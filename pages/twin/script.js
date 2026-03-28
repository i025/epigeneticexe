document.addEventListener('DOMContentLoaded', function() {
    // 身体地图导航
    const bodyParts = document.querySelectorAll('.body-part');
    bodyParts.forEach(part => {
        part.addEventListener('click', () => {
            const id = part.getAttribute('data-section');
            const target = document.getElementById(id);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 初始化所有模块
    initBrain();
    initMeta();
    initImmune();
    initSkin();
    initAging();
});

// 通用绑定函数
function bindTwinEvents(idsA, idsB, updateFunction) {
    const allIds = [...idsA, ...idsB];
    allIds.forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            el.addEventListener('input', updateFunction);
            el.addEventListener('change', updateFunction);
        }
    });
}

// 1. BRAIN
function initBrain() {
    function updateTwin(suffix) {
        const sleep = parseFloat(document.getElementById('sleep-' + suffix).value);
        const stress = parseInt(document.getElementById('stress-level-' + suffix).value);
        const mind = parseInt(document.getElementById('mindfulness-' + suffix).value);
        const meter = document.getElementById('stress-meter-' + suffix);
        const result = document.getElementById('stress-result-' + suffix);

        document.getElementById('sleep-value-' + suffix).textContent = sleep + 'h';
        document.getElementById('stress-value-' + suffix).textContent = stress + '%';
        document.getElementById('mindfulness-value-' + suffix).textContent = mind + 'm';

        let score = stress;
        if (sleep > 6) score -= (sleep - 6) * 5; 
        score -= (mind * 0.5);
        score = Math.max(5, Math.min(100, score));

        meter.style.width = score + '%';

        if(score < 35) {
            result.textContent = "✓ 压力影响低。基因调控良好。";
            result.style.borderLeftColor = "#22c55e";
        } else if(score < 65) {
            result.textContent = "⚠ 影响中等。试着增加正念冥想。";
            result.style.borderLeftColor = "#eab308";
        } else {
            result.textContent = "✗ 影响极高。存在慢性压力风险。";
            result.style.borderLeftColor = "#ef4444";
        }
    }

    function update() { updateTwin('a'); updateTwin('b'); }
    
    bindTwinEvents(
        ['sleep-a', 'stress-level-a', 'mindfulness-a'],
        ['sleep-b', 'stress-level-b', 'mindfulness-b'],
        update
    );
    update();
}

// 2. METABOLISM
function initMeta() {
    function updateTwin(suffix) {
        const exIn = document.getElementById('exercise-' + suffix);
        const dietIn = document.getElementById('diet-' + suffix);
        const schIn = document.getElementById('circadian-' + suffix);
        const needle = document.getElementById('metabolism-needle-' + suffix);
        const result = document.getElementById('metabolism-result-' + suffix);

        const ex = parseInt(exIn.value);
        const diet = parseInt(dietIn.value);

        document.getElementById('exercise-value-' + suffix).textContent = ex + 'h';
        document.getElementById('diet-value-' + suffix).textContent = diet + '%';

        let score = ((ex/14)*50) + ((diet/100)*50);
        if(schIn.value === 'irregular') score -= 15;
        if(schIn.value === 'shift') score -= 30;

        score = Math.max(0, Math.min(100, score));
        const rot = (score/100)*180 - 90;
        needle.style.transform = `translateX(-50%) rotate(${rot}deg)`;

        if(score > 70) {
            result.textContent = "✓ 代谢健康极佳";
            result.style.borderLeftColor = "#22c55e";
        } else if(score > 40) {
            result.textContent = "⚠ 代谢健康一般";
            result.style.borderLeftColor = "#eab308";
        } else {
            result.textContent = "✗ 代谢健康较差";
            result.style.borderLeftColor = "#ef4444";
        }
    }

    function update() { updateTwin('a'); updateTwin('b'); }

    bindTwinEvents(
        ['exercise-a', 'diet-a', 'circadian-a'],
        ['exercise-b', 'diet-b', 'circadian-b'],
        update
    );
    update();
}

// 3. IMMUNE
function initImmune() {
    function updateTwin(suffix) {
        const container = document.getElementById('immune-' + suffix);
        const inputs = container.querySelectorAll('input');
        const bar = document.getElementById('immune-gauge-' + suffix);
        const result = document.getElementById('immune-result-' + suffix);

        let bad = 0;
        let good = 0;
        inputs.forEach(i => {
            if(i.checked) {
                if(i.classList.contains('pos')) good++;
                else bad++;
            }
        });

        let netScore = bad - good; 
        if (netScore < 0) netScore = 0; 
        
        let pct = (netScore / 4) * 100;
        pct = Math.min(100, pct);
        
        bar.style.width = pct + '%';

        if(netScore === 0) {
            result.textContent = "✓ 炎症倾向低";
            result.style.borderLeftColor = "#22c55e";
        } else if(netScore <= 2) {
            result.textContent = "⚠ 中度炎症风险";
            result.style.borderLeftColor = "#eab308";
        } else {
            result.textContent = "✗ 高度炎症风险";
            result.style.borderLeftColor = "#ef4444";
        }
    }

    function update() { updateTwin('a'); updateTwin('b'); }
    const allChecks = document.querySelectorAll('.checkbox-group input');
    allChecks.forEach(c => c.addEventListener('change', update));
    update();
}

// 4. SKIN
function initSkin() {
    function updateTwin(suffix) {
        const uvVal = document.getElementById('uv-' + suffix).value;
        const sleepVal = document.getElementById('skin-sleep-' + suffix).value;
        const visual = document.getElementById('current-skin-' + suffix);
        const result = document.getElementById('skin-result-' + suffix);
        const ageDisplay = document.querySelector('#current-age-' + suffix + ' span');

        let score = 0;
        if(uvVal === 'high') score += 3;
        if(uvVal === 'moderate') score += 1;
        if(sleepVal === 'poor') score += 2;
        if(sleepVal === 'moderate') score += 1;
        
        const r = 230;
        const g = 180 - (score * 25);
        const b = 150 - (score * 25);
        visual.style.background = `rgb(${r},${g},${b})`;
        
        const age = 30 + Math.floor(score * 3);
        ageDisplay.textContent = age + ' 岁';

        if(score < 2) {
            result.textContent = "✓ 皮肤保护良好";
            result.style.borderLeftColor = "#22c55e";
        } else if(score < 4) {
            result.textContent = "⚠ 中度老化迹象";
            result.style.borderLeftColor = "#eab308";
        } else {
            result.textContent = "✗ 检测到加速老化";
            result.style.borderLeftColor = "#ef4444";
        }
    }

    function update() { updateTwin('a'); updateTwin('b'); }

    bindTwinEvents(
        ['uv-a', 'skin-sleep-a'],
        ['uv-b', 'skin-sleep-b'],
        update
    );
    update();
}

// 5. AGING
function initAging() {
    function updateTwin(suffix) {
        const ageIn = document.getElementById('chrono-age-' + suffix);
        const inputs = document.querySelectorAll('.aging-factor-' + suffix);
        
        const bioHand = document.getElementById('bio-clock-hand-' + suffix);
        const bioDisplay = document.getElementById('bio-age-display-' + suffix);
        const result = document.getElementById('aging-result-' + suffix);
        
        const valArr = Array.from(inputs);
        document.getElementById('sleep-reg-value-' + suffix).textContent = valArr[0].value + '%';
        document.getElementById('training-value-' + suffix).textContent = valArr[1].value + '%';
        document.getElementById('stress-mgmt-value-' + suffix).textContent = valArr[2].value + '%';

        const vals = valArr.map(i => parseInt(i.value));
        const avg = vals.reduce((a,b)=>a+b,0) / 3;
        const chrono = parseInt(ageIn.value);

        let diff = 0;
        if(avg > 80) diff = -5;
        else if(avg > 60) diff = -2;
        else if(avg < 30) diff = 8;
        else if(avg < 50) diff = 4;
        
        const bio = chrono + diff;
        bioDisplay.textContent = bio;
        
        const bioRot = (bio / 100) * 360;
        bioHand.style.transform = `translateX(-50%) rotate(${bioRot}deg)`;
        
        if (diff > 0) {
            result.textContent = `✗ 加速老化 (+${diff} 岁)`;
            result.style.borderLeftColor = "#ef4444";
        } else if (diff < 0) {
            result.textContent = `✓ 延缓老化 (${diff} 岁)`;
            result.style.borderLeftColor = "#22c55e";
        } else {
            result.textContent = "→ 生物年龄与实际年龄一致";
            result.style.borderLeftColor = "#cbd5e1";
        }
    }

    function update() { updateTwin('a'); updateTwin('b'); }

    const allInputs = [...document.querySelectorAll('.aging-factor-a'), ...document.querySelectorAll('.aging-factor-b'), document.getElementById('chrono-age-a'), document.getElementById('chrono-age-b')];
    allInputs.forEach(el => el.addEventListener('input', update));
    
    update();
}