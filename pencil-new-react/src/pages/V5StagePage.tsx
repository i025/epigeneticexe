import {
  headerContent,
  type PathStepTone
} from "../content/headerContent";
import { heroContent } from "../content/heroContent";
import { leftRailContent } from "../content/leftRailContent";
import { rightRailContent } from "../content/rightRailContent";
import { resolveLocalFileUrl } from "../utils/resolveLocalFileUrl";
import styles from "./V5StagePage.module.css";

const HOME_SCENE_VIDEO_SOURCE = "../../assets/videos/scene.webm";

type PlaceholderBlockProps = {
  title: string;
  penArea: string;
  className: string;
  muted?: boolean;
};

function PlaceholderBlock({
  title,
  penArea,
  className,
  muted = false
}: PlaceholderBlockProps) {
  return (
    <section
      className={`${styles.placeholder} ${className} ${
        muted ? styles.placeholderMuted : ""
      }`}
    >
      <span className={styles.placeholderTag}>Step 1 Skeleton</span>
      <h2 className={styles.placeholderTitle}>{title}</h2>
      <p className={styles.placeholderMeta}>{penArea}</p>
    </section>
  );
}

function pathStepClassName(tone: PathStepTone) {
  return {
    current: styles.pathStepCurrent,
    amber: styles.pathStepAmber,
    cyan: styles.pathStepCyan,
    violet: styles.pathStepViolet
  }[tone];
}

function HomeSceneVideo() {
  return (
    <div className={styles.centerArenaSceneVideoLayer} aria-hidden="true">
      <video
        className={styles.centerArenaSceneVideo}
        src={resolveLocalFileUrl(HOME_SCENE_VIDEO_SOURCE)}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}
function TopRowHeader() {
  return (
    <section className={styles.topRow}>
      <div className={styles.topRowBrandArea}>
        <h1 className={styles.brandTitle}>{headerContent.brandTitle}</h1>
      </div>

      <p className={styles.topRowExplanation}>{headerContent.explanationText}</p>

      <div className={styles.topRowMeta}>
        <div className={styles.topRowMetaPill}>
          <span className={styles.topRowMetaText}>{headerContent.metaText}</span>
        </div>
      </div>
    </section>
  );
}

function PathDivider() {
  return (
    <div className={styles.pathDivider} aria-hidden="true">
      <span className={styles.pathDividerDash} />
      <span className={styles.pathDividerDash} />
      <span className={styles.pathDividerDash} />
      <span className={styles.pathDividerDash} />
    </div>
  );
}

function PathBar() {
  return (
    <section className={styles.pathBar}>
      <div className={styles.pathBarLabel}>
        <span className={styles.pathBarLabelText}>{headerContent.pathBarLabel}</span>
      </div>

      {headerContent.pathSteps.map((step, index) => (
        <div key={step.label} className={styles.pathBarSegment}>
          <div className={`${styles.pathStep} ${pathStepClassName(step.tone)}`}>
            <span className={styles.pathStepText}>{step.label}</span>
          </div>

          {index < headerContent.pathSteps.length - 1 ? <PathDivider /> : null}
        </div>
      ))}
    </section>
  );
}

function hexagonPoints(size: number) {
  const quarter = size * 0.25;
  const threeQuarter = size * 0.75;
  const half = size * 0.5;

  return `${half},0 ${size},${quarter} ${size},${threeQuarter} ${half},${size} 0,${threeQuarter} 0,${quarter}`;
}

const topLeftTextureHexagons = [
  { x: 18, y: 18, size: 48, stroke: "#3B82F60A" },
  { x: 62, y: 42, size: 40, stroke: "#06B6D40A" },
  { x: 98, y: 16, size: 34, stroke: "#3B82F608" },
  { x: 118, y: 64, size: 28, stroke: "#06B6D408" }
];

const topLeftTextureLines = [
  { x: 56, y: 52, width: 34, rotation: 18, fill: "#3B82F608" },
  { x: 96, y: 42, width: 28, rotation: -26, fill: "#06B6D408" },
  { x: 112, y: 72, width: 20, rotation: 34, fill: "#3B82F606" },
  { x: 160, y: 42, width: 26, rotation: 22, fill: "#3B82F608" },
  { x: 184, y: 44, width: 20, rotation: -28, fill: "#06B6D408" }
];

const topLeftTextureNodes = [
  { x: 154, y: 34, size: 10, fill: "#3B82F60C" },
  { x: 178, y: 52, size: 8, fill: "#06B6D40C" },
  { x: 198, y: 28, size: 6, fill: "#3B82F608" }
];

const bottomRightTextureHexagons = [
  { x: 118, y: 20, size: 44, stroke: "#3B82F60A" },
  { x: 76, y: 48, size: 36, stroke: "#06B6D40A" },
  { x: 136, y: 68, size: 28, stroke: "#3B82F608" }
];

const bottomRightTextureLines = [
  { x: 102, y: 60, width: 30, rotation: -24, fill: "#3B82F608" },
  { x: 132, y: 70, width: 18, rotation: 36, fill: "#06B6D408" },
  { x: 34, y: 76, width: 24, rotation: -24, fill: "#06B6D408" },
  { x: 56, y: 74, width: 24, rotation: 38, fill: "#3B82F608" }
];

const bottomRightTextureNodes = [
  { x: 28, y: 82, size: 10, fill: "#06B6D40C" },
  { x: 52, y: 66, size: 8, fill: "#3B82F60C" },
  { x: 70, y: 96, size: 6, fill: "#06B6D408" }
];

function PageBioTextures() {
  return (
    <div className={styles.pageBioTextures} aria-hidden="true">
      <div className={styles.pageBioTextureTopLeft}>
        <svg
          className={styles.pageBioTextureSvg}
          viewBox="0 0 236 178"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {topLeftTextureHexagons.map((hexagon) => (
            <polygon
              key={`${hexagon.x}-${hexagon.y}-${hexagon.size}`}
              points={hexagonPoints(hexagon.size)}
              transform={`translate(${hexagon.x} ${hexagon.y})`}
              fill="none"
              stroke={hexagon.stroke}
              strokeWidth="1"
            />
          ))}

          {topLeftTextureLines.map((line) => (
            <rect
              key={`${line.x}-${line.y}-${line.width}`}
              x={line.x}
              y={line.y}
              width={line.width}
              height="1"
              rx="0.5"
              fill={line.fill}
              transform={`rotate(${line.rotation} ${line.x + line.width / 2} ${line.y + 0.5})`}
            />
          ))}

          {topLeftTextureNodes.map((node) => (
            <circle
              key={`${node.x}-${node.y}-${node.size}`}
              cx={node.x + node.size / 2}
              cy={node.y + node.size / 2}
              r={node.size / 2}
              fill={node.fill}
            />
          ))}
        </svg>
      </div>

      <div className={styles.pageBioTextureBottomRight}>
        <svg
          className={styles.pageBioTextureSvg}
          viewBox="0 0 194 156"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {bottomRightTextureHexagons.map((hexagon) => (
            <polygon
              key={`${hexagon.x}-${hexagon.y}-${hexagon.size}`}
              points={hexagonPoints(hexagon.size)}
              transform={`translate(${hexagon.x} ${hexagon.y})`}
              fill="none"
              stroke={hexagon.stroke}
              strokeWidth="1"
            />
          ))}

          {bottomRightTextureLines.map((line) => (
            <rect
              key={`${line.x}-${line.y}-${line.width}`}
              x={line.x}
              y={line.y}
              width={line.width}
              height="1"
              rx="0.5"
              fill={line.fill}
              transform={`rotate(${line.rotation} ${line.x + line.width / 2} ${line.y + 0.5})`}
            />
          ))}

          {bottomRightTextureNodes.map((node) => (
            <circle
              key={`${node.x}-${node.y}-${node.size}`}
              cx={node.x + node.size / 2}
              cy={node.y + node.size / 2}
              r={node.size / 2}
              fill={node.fill}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

function QuestionBand() {
  return (
    <section className={styles.questionBand}>
      <div className={styles.questionBandInner}>
        <h2 className={styles.questionBandTitle}>{heroContent.questionBandTitle}</h2>
      </div>
    </section>
  );
}

const centerArenaDnaPairBars = [
  { x: 15.93, y: 43, height: 22, color: "#B9B5E8" },
  { x: 30.47, y: 40.38, height: 24, color: "#55C6B8" },
  { x: 72, y: 31.22, height: 24, color: "#FF8B5C" },
  { x: 89, y: 30.24, height: 22, color: "#FFD45B" },
  { x: 126.64, y: 25.0, height: 25, color: "#B9B5E8" },
  { x: 143.58, y: 22.75, height: 25, color: "#55C6B8" },
  { x: 176.39, y: 15.51, height: 25, color: "#FF8B5C" },
  { x: 191.85, y: 13.13, height: 25, color: "#FFD45B" }
];

function CenterArenaDecorations() {
  return (
    <div className={styles.centerArenaDecorations} aria-hidden="true">
      <div className={styles.centerArenaTopLeftBubble} />
      <div className={styles.centerArenaTopLeftStem} />

      <div className={styles.centerArenaBottomLeftMarker} />
      <div className={styles.centerArenaBottomLeftStem} />

      <div className={styles.centerArenaDnaCluster}>
        <svg
          className={styles.centerArenaDnaSvg}
          viewBox="0 0 214 126"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient
              id="centerArenaDnaHaloGradient"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(107 37) rotate(90) scale(37 107)"
            >
              <stop stopColor="#FFFFFF" />
              <stop offset="0.58" stopColor="#EEF7FF" />
              <stop offset="1" stopColor="#EEF7FF" stopOpacity="0" />
            </radialGradient>
            <linearGradient
              id="centerArenaDnaBadgeGradient"
              x1="50"
              y1="16"
              x2="84"
              y2="50"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#C74A3C" />
              <stop offset="1" stopColor="#E6958D" />
            </linearGradient>
          </defs>

          <ellipse
            cx="107"
            cy="37"
            rx="107"
            ry="37"
            fill="url(#centerArenaDnaHaloGradient)"
            opacity="0.12"
            transform="rotate(-9.851 107 37)"
          />

          <path
            d="M0 25c18 21 36 21 54 0 18-21 36-21 54 0 18 21 36 21 54 0 18-21 34-21 50 0"
            transform="translate(3 14) rotate(-9.851 106 25)"
            stroke="#9FC1FF"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M0 25c18-21 36-21 54 0 18 21 36 21 54 0 18-21 36-21 54 0 18 21 34 21 50 0"
            transform="translate(3 14) rotate(-9.851 106 25)"
            stroke="#1F66D1"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {centerArenaDnaPairBars.map((bar) => (
            <rect
              key={`${bar.x}-${bar.y}`}
              x={bar.x}
              y={bar.y}
              width="10"
              height={bar.height}
              rx="5"
              fill={bar.color}
              transform={`rotate(-9.851 ${bar.x + 5} ${bar.y + bar.height / 2})`}
            />
          ))}

          <circle
            cx="67.04"
            cy="32.79"
            r="17"
            fill="url(#centerArenaDnaBadgeGradient)"
            opacity="0.88"
            transform="rotate(-9.851 67.04 32.79)"
          />
          <circle
            cx="164.75"
            cy="72.09"
            r="17"
            fill="url(#centerArenaDnaBadgeGradient)"
            opacity="0.88"
            transform="rotate(-9.851 164.75 72.09)"
          />

          <text
            x="56.21"
            y="21.16"
            fill="#FFFFFF"
            fontFamily='"DM Sans", "PingFang SC", "Microsoft YaHei", sans-serif'
            fontSize="18"
            fontWeight="800"
            dominantBaseline="hanging"
            transform="rotate(-1.851 56.21 21.16)"
          >
            M
          </text>
          <text
            x="155.38"
            y="63.97"
            fill="#FFFFFF"
            fontFamily='"DM Sans", "PingFang SC", "Microsoft YaHei", sans-serif'
            fontSize="18"
            fontWeight="800"
            dominantBaseline="hanging"
            transform="rotate(-1.851 146.38 62.97)"
          >
            M
          </text>

          <polygon
            points="0,12 12,6 0,0"
            fill="#7FAEDB88"
            transform="translate(173.84 114) rotate(76 6 6)"
          />
        </svg>
      </div>
    </div>
  );
}

function CenterArenaReservedStage() {
  return (
    <section className={styles.centerArena}>
      <div className={styles.centerArenaBackdrop} aria-hidden="true" />

      {/* Reserved container for future Live2D character */}
      {/* Keep visually minimal in current step */}
      {/* Do not replace with static robot */}
      <div className={styles.centerArenaReservedArea} />
      <HomeSceneVideo />
      <CenterArenaDecorations />

      <div className={styles.centerArenaPlatformGlow} aria-hidden="true" />
      <div className={styles.centerArenaPlatform} aria-hidden="true" />
      <div className={styles.centerArenaShadow} aria-hidden="true" />
    </section>
  );
}

function DialogueEntry() {
  const { dialogueEntry } = heroContent;

  return (
    <section className={styles.dialogueEntry}>
      <p className={styles.dialogueEntryPrompt}>{dialogueEntry.prompt}</p>

      <div className={styles.dialogueEntryButton} aria-hidden="true">
        <span className={styles.dialogueEntryButtonText}>{dialogueEntry.cta}</span>
      </div>
    </section>
  );
}

function PreviewGuideText() {
  return (
    <p className={`${styles.railGuideText} ${styles.previewGuideText}`}>
      {leftRailContent.previewGuideText}
    </p>
  );
}

function LeftSpacerPath() {
  const { leftSpacer } = leftRailContent;
  const leftPathPrimaryGeometry =
    "M80 8C105 30 108 68 82 104C58 138 68 182 108 216C140 244 144 288 126 344";
  const leftPathSecondaryGeometry =
    "M100 10C125 32 128 70 102 107C78 141 88 185 128 219C160 247 164 291 146 346";

  return (
    <section className={styles.leftSpacer} aria-hidden="true">
      <svg
        className={styles.leftSpacerSvg}
        viewBox="0 0 236 331"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={leftPathPrimaryGeometry}
          stroke="#8FC4FF"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={leftPathSecondaryGeometry}
          stroke="#8FC4FF"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <ellipse
          cx="95"
          cy="98.5"
          rx="11"
          ry="10.5"
          fill="#EDF9FF"
          stroke="#79C8F4"
          strokeWidth="2"
        />
        <ellipse
          cx="81"
          cy="167.5"
          rx="10"
          ry="9.5"
          fill="#FFF6EA"
          stroke="#E4B05D"
          strokeWidth="2"
        />
        <circle cx="154" cy="180" r="3" fill="#9FCFFF" />

        <polygon
          points="7 0 14 14 0 14"
          transform="translate(148 287) rotate(180 7 7)"
          fill="#EDC06A"
        />
      </svg>

      <span className={styles.leftSpacerTopLabel}>{leftSpacer.topLabel}</span>
      <span className={styles.leftSpacerBottomLabel}>{leftSpacer.bottomLabel}</span>
      <div className={styles.leftSpacerGlow} />
    </section>
  );
}

function PreviewCard() {
  const { previewCard } = leftRailContent;

  return (
    <section className={styles.previewCard}>
      <div className={styles.previewCardEyebrow}>
        <span className={styles.previewCardEyebrowText}>{previewCard.eyebrow}</span>
      </div>

      <div className={styles.previewCardIcon} aria-hidden="true">
        <svg
          className={styles.previewCardIconSvg}
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="23" cy="23" r="17" stroke="currentColor" strokeWidth="2" />
          <path
            d="M35 35L44 44"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M18 13C14 18 22 20 20 25C18 30 11 31 16 36"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M28 13C32 18 24 20 26 25C28 30 35 31 30 36"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M18 18H28"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M18 28H28"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <h2 className={styles.previewCardTitle}>{previewCard.title}</h2>

      <p className={styles.previewCardBody}>{previewCard.body}</p>

      <div className={styles.previewCardAction}>
        <span className={styles.previewCardActionText}>{previewCard.cta}</span>
      </div>
    </section>
  );
}

function VideoCard() {
  const { videoCard } = leftRailContent;

  return (
    <section className={styles.videoCard}>
      <div className={styles.videoCardEyebrow}>
        <span className={styles.videoCardEyebrowText}>{videoCard.eyebrow}</span>
      </div>

      <div className={styles.videoCardIcon} aria-hidden="true">
        <svg
          className={styles.videoCardIconSvg}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="32" cy="32" r="23" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="32" cy="32" r="17" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M28 24.5L41 32L28 39.5V24.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="8" r="2" fill="currentColor" />
          <circle cx="55" cy="32" r="2" fill="currentColor" />
          <circle cx="32" cy="56" r="2" fill="currentColor" />
          <circle cx="9" cy="32" r="2" fill="currentColor" />
        </svg>
      </div>

      <h2 className={styles.videoCardTitle}>{videoCard.title}</h2>

      <p className={styles.videoCardBody}>{videoCard.body}</p>

      <div className={styles.videoCardAction}>
        <span className={styles.videoCardActionText}>{videoCard.cta}</span>
      </div>
    </section>
  );
}

function InteractionCard() {
  const { interactionCard } = rightRailContent;

  return (
    <section className={styles.interactionCard}>
      <div className={styles.interactionCardEyebrow}>
        <span className={styles.interactionCardEyebrowText}>
          {interactionCard.eyebrow}
        </span>
      </div>

      <div className={styles.interactionCardIcon} aria-hidden="true">
        <svg
          className={styles.interactionCardIconSvg}
          viewBox="0 0 64 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="18"
            cy="16"
            r="8"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M10 37C12.5 31.5 16.5 28.5 22 28.5C27.5 28.5 31.5 31.5 34 37"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="46"
            cy="20"
            r="8"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M38 41C40.5 35.5 44.5 32.5 50 32.5C55.5 32.5 59.5 35.5 62 41"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h2 className={styles.interactionCardTitle}>{interactionCard.title}</h2>

      <p className={styles.interactionCardBody}>{interactionCard.body}</p>

      <div className={styles.interactionCardAction}>
        <span className={styles.interactionCardActionText}>
          {interactionCard.cta}
        </span>
      </div>
    </section>
  );
}

function InteractionGuideText() {
  return (
    <p className={`${styles.railGuideText} ${styles.interactionGuideText}`}>
      {rightRailContent.interactionGuideText}
    </p>
  );
}

function RightSpacerPath() {
  const { rightSpacer } = rightRailContent;
  const rightPathPrimaryGeometry =
    "M156 8C131 30 128 68 154 104C178 138 168 182 128 216C96 244 92 288 110 344";
  const rightPathSecondaryGeometry =
    "M136 10C111 32 108 70 134 107C158 141 148 185 108 230C72 258 66 303 84 344";

  return (
    <section className={styles.rightSpacer} aria-hidden="true">
      <div className={styles.rightSpacerCanvas}>
        <svg
          className={styles.rightSpacerSvg}
          viewBox="0 0 236 331"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={rightPathPrimaryGeometry}
            stroke="#9FDDF8"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={rightPathSecondaryGeometry}
            stroke="#9FDDF8"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <ellipse
            cx="141"
            cy="98.5"
            rx="11"
            ry="10.5"
            fill="#EDFDFF"
            stroke="#67D8F2"
            strokeWidth="2"
          />
          <ellipse
            cx="155"
            cy="167.5"
            rx="10"
            ry="9.5"
            fill="#F6F2FF"
            stroke="#9A8BF0"
            strokeWidth="2"
          />
          <circle cx="82" cy="180" r="3" fill="#95E3F8" />
        </svg>

        <span className={styles.rightSpacerTopLabel}>{rightSpacer.topLabel}</span>
        <span className={styles.rightSpacerBottomLabel}>{rightSpacer.bottomLabel}</span>
        <div className={styles.rightSpacerGlow} />
        <div className={styles.rightSpacerArrow} />
        <div className={styles.rightSpacerPentMarker} />
        <div className={styles.rightSpacerStem} />
      </div>
    </section>
  );
}

function ExtensionCard() {
  const { extensionCard } = rightRailContent;

  return (
    <section className={styles.extensionCard}>
      <div className={styles.extensionCardEyebrow}>
        <span className={styles.extensionCardEyebrowText}>
          {extensionCard.eyebrow}
        </span>
      </div>

      <div className={styles.extensionCardIcon} aria-hidden="true">
        <svg
          className={styles.extensionCardIconSvg}
          viewBox="0 0 58 62"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M26 6C14 12 8 22 8 32C8 45 18 55 30 55C42 55 50 44 50 32C50 20 42 11 30 7C28.5 6.5 27 6.2 26 6Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M31 10C35 18 36 26 35 34C34 42 31 48 25 55"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h2 className={styles.extensionCardTitle}>{extensionCard.title}</h2>

      <p className={styles.extensionCardBody}>{extensionCard.body}</p>

      <div className={styles.extensionCardAction}>
        <span className={styles.extensionCardActionText}>
          {extensionCard.cta}
        </span>
      </div>
    </section>
  );
}

export function V5StagePage() {
  return (
    <main className={styles.page}>
      <div className={styles.cornerGlow} aria-hidden="true" />
      <PageBioTextures />

      <div className={styles.shell}>

        <div className={styles.stageArea}>
          <header className={styles.headerArea}>
            <TopRowHeader />
            <PathBar />
          </header>

          <section className={styles.contentArea}>
            <aside className={styles.leftRail}>
              <PreviewGuideText />

              <PreviewCard />

              <LeftSpacerPath />

              <VideoCard />
            </aside>

            <section className={styles.centerStage}>
              <QuestionBand />

              <CenterArenaReservedStage />

              <DialogueEntry />
            </section>

            <aside className={styles.rightRail}>
              <InteractionGuideText />

              <InteractionCard />

              <RightSpacerPath />

              <ExtensionCard />
            </aside>
          </section>
        </div>
      </div>
    </main>
  );
}










