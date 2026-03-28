const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const desktopRoot = path.join(os.homedir(), 'Desktop', '艾纹');
const checkOnly = process.argv.includes('--check');

const articles = [
  {
    key: 'pre-study',
    repoPath: path.join(repoRoot, 'content', 'articles', 'pre-study', 'index.html'),
    originalPath: path.join(desktopRoot, '预习', '表观遗传学预习资源_420布局无二维码_无框灰底.html'),
  },
  {
    key: 'cpg',
    repoPath: path.join(repoRoot, 'content', 'articles', 'cpg', 'index.html'),
    originalPath: path.join(
      desktopRoot,
      'CpG',
      '【拓展阅读】基因组里的“神秘岛屿”：深度拆解 CpG 岛的静默密码.html',
    ),
  },
  {
    key: 'famine',
    repoPath: path.join(repoRoot, 'content', 'articles', 'famine', 'index.html'),
    originalPath: path.join(
      desktopRoot,
      '荷兰饥荒',
      '【拓展资料】封印的历史：荷兰饥饿冬天与表观遗传学_窄屏比例版_居中修复.html',
    ),
  },
];

const tokenRegex =
  /(<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>|<!--[\s\S]*?-->|<[^>]+>)/gi;
const textLikeAttrPattern =
  /\b(content|title|aria-label|alt|placeholder)=(["'])([\s\S]*?)\2/gi;
const whitespacePattern = /^(?:(?:\s|\u00a0|&nbsp;|&#160;)+)|(?:(?:\s|\u00a0|&nbsp;|&#160;)+)$/gi;
const hasVisibleContentPattern = /(?:\S|\u00a0|&nbsp;|&#160;)/i;

function readUtf8(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function ensureExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required source file: ${filePath}`);
  }
}

function decodeMinimalEntities(text) {
  return text
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function normalizeForMatch(text) {
  return decodeMinimalEntities(text)
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/，/g, ',')
    .replace(/。/g, '.')
    .replace(/？/g, '?')
    .replace(/！/g, '!')
    .replace(/：/g, ':')
    .replace(/；/g, ';')
    .replace(/（/g, '(')
    .replace(/）/g, ')')
    .replace(/【/g, '[')
    .replace(/】/g, ']')
    .replace(/—/g, '-')
    .replace(/…/g, '...')
    .replace(/[\u00a0\s]+/g, '')
    .trim()
    .toLowerCase();
}

function splitTextParts(rawText) {
  const matches = rawText.match(whitespacePattern) || [];
  const leading = rawText.match(/^(?:(?:\s|\u00a0|&nbsp;|&#160;)+)/i)?.[0] ?? '';
  const trailing =
    rawText.match(/(?:(?:\s|\u00a0|&nbsp;|&#160;)+)$/i)?.[0] ?? '';
  const core = rawText.slice(leading.length, rawText.length - trailing.length);

  return { leading, core, trailing, raw: rawText, _matches: matches.length };
}

function tokenizeHtml(html) {
  const tokens = [];
  let lastIndex = 0;
  let match;

  while ((match = tokenRegex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'text', value: html.slice(lastIndex, match.index) });
    }

    const value = match[0];
    let type = 'tag';

    if (value.startsWith('<!--')) {
      type = 'comment';
    } else if (/^<script\b/i.test(value)) {
      type = 'script';
    } else if (/^<style\b/i.test(value)) {
      type = 'style';
    }

    tokens.push({ type, value });
    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < html.length) {
    tokens.push({ type: 'text', value: html.slice(lastIndex) });
  }

  return tokens;
}

function extractTextEntries(tokens) {
  const entries = [];

  tokens.forEach((token, tokenIndex) => {
    if (token.type !== 'text' || !hasVisibleContentPattern.test(token.value)) {
      return;
    }

    const parts = splitTextParts(token.value);
    if (!parts.core) {
      return;
    }

    entries.push({
      tokenIndex,
      raw: token.value,
      leading: parts.leading,
      core: parts.core,
      trailing: parts.trailing,
      norm: normalizeForMatch(parts.core),
    });
  });

  return entries;
}

function extractDisplayAttributes(tokens) {
  const entries = [];

  tokens.forEach((token, tokenIndex) => {
    if (token.type !== 'tag' || /^<\/.+>$/.test(token.value)) {
      return;
    }

    const tagName = token.value.match(/^<\s*([^\s/>]+)/)?.[1]?.toLowerCase();
    if (!tagName) {
      return;
    }

    let match;
    while ((match = textLikeAttrPattern.exec(token.value)) !== null) {
      const attrName = match[1].toLowerCase();
      const value = match[3];
      const norm = normalizeForMatch(value);

      if (!norm) {
        continue;
      }

      if (attrName === 'content' && tagName !== 'meta') {
        continue;
      }

      entries.push({
        tokenIndex,
        tagName,
        attrName,
        fullMatch: match[0],
        quote: match[2],
        value,
        norm,
      });
    }
  });

  return entries;
}

function lcsLength(left, right) {
  const leftChars = [...left];
  const rightChars = [...right];
  const row = new Array(rightChars.length + 1).fill(0);

  for (let leftIndex = 1; leftIndex <= leftChars.length; leftIndex += 1) {
    let prev = 0;

    for (let rightIndex = 1; rightIndex <= rightChars.length; rightIndex += 1) {
      const snapshot = row[rightIndex];
      row[rightIndex] =
        leftChars[leftIndex - 1] === rightChars[rightIndex - 1]
          ? prev + 1
          : Math.max(row[rightIndex], row[rightIndex - 1]);
      prev = snapshot;
    }
  }

  return row[rightChars.length];
}

function similarityRatio(left, right) {
  if (!left || !right) {
    return 0;
  }

  if (left === right) {
    return 1;
  }

  if (left.includes(right) || right.includes(left)) {
    return 0.82;
  }

  return lcsLength(left, right) / Math.max([...left].length, [...right].length);
}

function substitutionCost(repoEntry, originalEntry) {
  if (repoEntry.norm === originalEntry.norm) {
    return 0;
  }

  const similarity = similarityRatio(repoEntry.norm, originalEntry.norm);
  let cost = 3;

  if (similarity >= 0.85) {
    cost = 0.5;
  } else if (similarity >= 0.6) {
    cost = 1;
  } else if (similarity >= 0.35) {
    cost = 1.8;
  }

  const repoDigits = repoEntry.norm.match(/\d+/g)?.join('|') ?? '';
  const originalDigits = originalEntry.norm.match(/\d+/g)?.join('|') ?? '';
  const repoAscii = repoEntry.norm.match(/[a-z]+/gi)?.join('|') ?? '';
  const originalAscii = originalEntry.norm.match(/[a-z]+/gi)?.join('|') ?? '';

  if (repoDigits && repoDigits === originalDigits) {
    cost -= 0.25;
  }

  if (repoAscii && repoAscii === originalAscii) {
    cost -= 0.25;
  }

  return Math.max(0.2, cost);
}

function alignSequences(repoEntries, originalEntries) {
  const gapCost = 2;
  const repoCount = repoEntries.length;
  const originalCount = originalEntries.length;
  const scores = Array.from({ length: repoCount + 1 }, () =>
    Array(originalCount + 1).fill(0),
  );
  const backtrack = Array.from({ length: repoCount + 1 }, () =>
    Array(originalCount + 1).fill(''),
  );

  for (let repoIndex = 1; repoIndex <= repoCount; repoIndex += 1) {
    scores[repoIndex][0] = repoIndex * gapCost;
    backtrack[repoIndex][0] = 'up';
  }

  for (let originalIndex = 1; originalIndex <= originalCount; originalIndex += 1) {
    scores[0][originalIndex] = originalIndex * gapCost;
    backtrack[0][originalIndex] = 'left';
  }

  for (let repoIndex = 1; repoIndex <= repoCount; repoIndex += 1) {
    for (let originalIndex = 1; originalIndex <= originalCount; originalIndex += 1) {
      const diagScore =
        scores[repoIndex - 1][originalIndex - 1] +
        substitutionCost(repoEntries[repoIndex - 1], originalEntries[originalIndex - 1]);
      const upScore = scores[repoIndex - 1][originalIndex] + gapCost;
      const leftScore = scores[repoIndex][originalIndex - 1] + gapCost;

      let bestScore = diagScore;
      let direction = 'diag';

      if (upScore < bestScore) {
        bestScore = upScore;
        direction = 'up';
      }

      if (leftScore < bestScore) {
        bestScore = leftScore;
        direction = 'left';
      }

      scores[repoIndex][originalIndex] = bestScore;
      backtrack[repoIndex][originalIndex] = direction;
    }
  }

  const pairs = [];
  let repoIndex = repoCount;
  let originalIndex = originalCount;

  while (repoIndex > 0 || originalIndex > 0) {
    const direction = backtrack[repoIndex][originalIndex];

    if (direction === 'diag') {
      pairs.push([repoIndex - 1, originalIndex - 1]);
      repoIndex -= 1;
      originalIndex -= 1;
    } else if (direction === 'up') {
      pairs.push([repoIndex - 1, null]);
      repoIndex -= 1;
    } else {
      pairs.push([null, originalIndex - 1]);
      originalIndex -= 1;
    }
  }

  return pairs.reverse();
}

function replaceVisibleAttribute(tag, attrName, nextValue) {
  let replaced = false;

  return tag.replace(textLikeAttrPattern, (match, name, quote, value) => {
    if (replaced || name.toLowerCase() !== attrName) {
      return match;
    }

    replaced = true;
    return `${name}=${quote}${nextValue}${quote}`;
  });
}

function syncTextTokens(repoTokens, repoEntries, originalEntries) {
  let changes = 0;
  const alignedPairs = alignSequences(repoEntries, originalEntries);

  for (const [repoIndex, originalIndex] of alignedPairs) {
    if (repoIndex === null || originalIndex === null) {
      continue;
    }

    const repoEntry = repoEntries[repoIndex];
    const originalEntry = originalEntries[originalIndex];

    if (repoEntry.norm === originalEntry.norm) {
      continue;
    }

    const replacement =
      repoEntry.leading + splitTextParts(originalEntry.raw).core + repoEntry.trailing;

    if (repoTokens[repoEntry.tokenIndex].value !== replacement) {
      repoTokens[repoEntry.tokenIndex].value = replacement;
      changes += 1;
    }
  }

  return changes;
}

function syncVisibleAttributes(repoTokens, originalTokens) {
  const repoEntries = extractDisplayAttributes(repoTokens);
  const originalEntries = extractDisplayAttributes(originalTokens);
  const groupedRepo = new Map();
  const groupedOriginal = new Map();
  let changes = 0;

  for (const entry of repoEntries) {
    const key = `${entry.tagName}:${entry.attrName}`;
    const bucket = groupedRepo.get(key) ?? [];
    bucket.push(entry);
    groupedRepo.set(key, bucket);
  }

  for (const entry of originalEntries) {
    const key = `${entry.tagName}:${entry.attrName}`;
    const bucket = groupedOriginal.get(key) ?? [];
    bucket.push(entry);
    groupedOriginal.set(key, bucket);
  }

  for (const [key, repoBucket] of groupedRepo.entries()) {
    const originalBucket = groupedOriginal.get(key);
    if (!originalBucket || originalBucket.length === 0) {
      continue;
    }

    const alignedPairs = alignSequences(repoBucket, originalBucket);

    for (const [repoIndex, originalIndex] of alignedPairs) {
      if (repoIndex === null || originalIndex === null) {
        continue;
      }

      const repoEntry = repoBucket[repoIndex];
      const originalEntry = originalBucket[originalIndex];

      if (repoEntry.norm === originalEntry.norm) {
        continue;
      }

      const nextTag = replaceVisibleAttribute(
        repoTokens[repoEntry.tokenIndex].value,
        repoEntry.attrName,
        originalEntry.value,
      );

      if (nextTag !== repoTokens[repoEntry.tokenIndex].value) {
        repoTokens[repoEntry.tokenIndex].value = nextTag;
        changes += 1;
      }
    }
  }

  return changes;
}

function fingerprintStructure(tokens) {
  const digestSource = tokens
    .map((token) => (token.type === 'text' ? '__TEXT__' : token.value))
    .join('');

  return crypto.createHash('sha1').update(digestSource).digest('hex');
}

function rebuildHtml(tokens) {
  return tokens.map((token) => token.value).join('');
}

function repairArticle(article) {
  ensureExists(article.repoPath);
  ensureExists(article.originalPath);

  const repoHtml = readUtf8(article.repoPath);
  const originalHtml = readUtf8(article.originalPath);
  const repoTokens = tokenizeHtml(repoHtml);
  const originalTokens = tokenizeHtml(originalHtml);
  const beforeFingerprint = fingerprintStructure(repoTokens);
  const textChanges = syncTextTokens(
    repoTokens,
    extractTextEntries(repoTokens),
    extractTextEntries(originalTokens),
  );
  const attrChanges = syncVisibleAttributes(repoTokens, originalTokens);
  const repairedHtml = rebuildHtml(repoTokens);
  const repairedTokens = tokenizeHtml(repairedHtml);
  const afterFingerprint = fingerprintStructure(repairedTokens);

  if (beforeFingerprint !== afterFingerprint) {
    throw new Error(`Non-text structure changed for ${article.key}`);
  }

  if (!checkOnly && repairedHtml !== repoHtml) {
    fs.writeFileSync(article.repoPath, repairedHtml, 'utf8');
  }

  return {
    changed: repairedHtml !== repoHtml,
    textChanges,
    attrChanges,
  };
}

let changedFiles = 0;

for (const article of articles) {
  const result = repairArticle(article);
  if (result.changed) {
    changedFiles += 1;
  }

  const actionLabel = checkOnly ? 'would update' : 'updated';
  console.log(
    `${actionLabel}: ${article.key} (${result.changed ? 'changed' : 'unchanged'}) ` +
      `[text=${result.textChanges}, attrs=${result.attrChanges}]`,
  );
}

console.log(`${checkOnly ? 'check complete' : 'repair complete'}: ${changedFiles}/${articles.length} files changed`);
