// main.js — Education mode with 5-question survey + CN/EN toggle
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("game-root");
  if (!root) return;

  // ---------------------------
  // Language
  // ---------------------------
  let lang = "zh"; // "zh" | "en"
  function t(obj) {
    return obj[lang] ?? obj.zh;
  }

  // ---------------------------
  // Food data (education; NOT medical advice)
  // type: "yin" | "yang" | "neutral"
  // delta: affects balance
  // ---------------------------
  const FOODS = [
    // YANG
    {
      id: "beef",
      type: "yang",
      delta: +1,
      emoji: "🥩",
      name: { zh: "牛肉", en: "Beef" },
      level: { zh: "偏温/助阳", en: "Warming / Yang-leaning" },
      explain: {
        zh: "一般认为偏温，适量可助气血，但吃多容易偏热。",
        en: "Often considered warming. Moderate amounts may feel supportive, but too much may feel ‘hot’ for some people."
      }
    },
    {
      id: "lamb",
      type: "yang",
      delta: +2,
      emoji: "🍖",
      name: { zh: "羊肉", en: "Lamb" },
      level: { zh: "温热", en: "Warming" },
      explain: {
        zh: "常被认为更温热，偏寒者少量可能更合适。",
        en: "Commonly seen as more warming. People who feel ‘cold’ may tolerate small portions better."
      }
    },
    {
      id: "chili",
      type: "yang",
      delta: +3,
      emoji: "🌶️",
      name: { zh: "辣椒", en: "Chili" },
      level: { zh: "大热/辛辣", en: "Hot / Spicy" },
      explain: {
        zh: "辛辣多偏热，容易口干、上火者要少量。",
        en: "Spicy foods can feel ‘hot’ and drying—go lighter if you feel overheated or dry."
      }
    },
    {
      id: "ginger",
      type: "yang",
      delta: +2,
      emoji: "🫚",
      name: { zh: "生姜", en: "Ginger" },
      level: { zh: "温", en: "Warming" },
      explain: {
        zh: "常用于温中散寒，但本就偏热者不适合大量。",
        en: "Often used as a warming food; large amounts may not suit people who already feel overheated."
      }
    },

    // YIN
    {
      id: "broccoli",
      type: "yin",
      delta: -1,
      emoji: "🥦",
      name: { zh: "西兰花", en: "Broccoli" },
      level: { zh: "偏凉", en: "Cooling-leaning" },
      explain: {
        zh: "清淡蔬菜多偏凉，偏热时可以多一些。",
        en: "Light vegetables are often considered cooling; many people add them when they feel ‘hot’."
      }
    },
    {
      id: "cucumber",
      type: "yin",
      delta: -2,
      emoji: "🥒",
      name: { zh: "黄瓜", en: "Cucumber" },
      level: { zh: "凉", en: "Cooling" },
      explain: {
        zh: "通常认为偏凉，偏寒或腹泻者不宜过量。",
        en: "Often viewed as cooling; people who feel ‘cold’ or have loose stools may prefer smaller amounts."
      }
    },
    {
      id: "pear",
      type: "yin",
      delta: -1,
      emoji: "🍐",
      name: { zh: "梨", en: "Pear" },
      level: { zh: "偏凉/润", en: "Cooling / Moistening" },
      explain: {
        zh: "常被认为偏凉且润，干燥咽喉不适者会更喜欢。",
        en: "Often described as cooling and moistening—some people prefer it when the throat feels dry."
      }
    },
    {
      id: "watermelon",
      type: "yin",
      delta: -3,
      emoji: "🍉",
      name: { zh: "西瓜", en: "Watermelon" },
      level: { zh: "偏寒", en: "More cooling" },
      explain: {
        zh: "多被认为偏寒，脾胃虚寒或怕冷者要少量。",
        en: "Commonly seen as strongly cooling; people who feel cold easily may do better with smaller portions."
      }
    },
    {
      id: "mung_soup",
      type: "yin",
      delta: -2,
      emoji: "🥣",
      name: { zh: "绿豆汤", en: "Mung bean soup" },
      level: { zh: "偏凉", en: "Cooling" },
      explain: {
        zh: "清淡偏凉，偏热时作为调整方向之一。",
        en: "Light and cooling—often chosen as a gentle ‘cooling’ option."
      }
    },
    {
      id: "crab",
      type: "yin",
      delta: -2,
      emoji: "🦀",
      name: { zh: "螃蟹", en: "Crab" },
      level: { zh: "偏寒", en: "Cooling-leaning" },
      explain: {
        zh: "海鲜部分被认为偏寒，偏寒体质者注意分量。",
        en: "Some seafood is viewed as cooling; people with ‘cold’ tendencies may watch portion size."
      }
    },

    // NEUTRAL
    {
      id: "rice",
      type: "neutral",
      delta: 0,
      emoji: "🍚",
      name: { zh: "米饭/粥", en: "Rice / Congee" },
      level: { zh: "平和", en: "Neutral" },
      explain: {
        zh: "相对平和，常用作“打底”，帮助饮食更稳定。",
        en: "Relatively neutral and steady—often used as a base to keep meals balanced."
      }
    },
    {
      id: "egg",
      type: "neutral",
      delta: 0,
      emoji: "🥚",
      name: { zh: "鸡蛋", en: "Egg" },
      level: { zh: "平和", en: "Neutral" },
      explain: {
        zh: "多数人感觉较平和，适量补充蛋白质。",
        en: "Many people find it neutral; moderate portions can support protein intake."
      }
    },
    {
      id: "carrot",
      type: "neutral",
      delta: 0,
      emoji: "🥕",
      name: { zh: "胡萝卜", en: "Carrot" },
      level: { zh: "平和偏温", en: "Neutral (slightly warming)" },
      explain: {
        zh: "多数情况下较平和，搭配主食或蛋白更稳。",
        en: "Often felt as gentle/neutral; pairs well with staple foods."
      }
    }
  ];

  // ---------------------------
  // Survey (5 questions)
  // Each option has a score; totalScore maps to initial balance.
  // ---------------------------
  const SURVEY = [
    {
      zh: "你平时更怕哪种不舒服？",
      en: "Which discomfort do you notice more often?",
      options: [
        { zh: "怕冷、手脚凉", en: "Feel cold, cold hands/feet", score: -2 },
        { zh: "都还可以", en: "About the same", score: 0 },
        { zh: "怕热、容易出汗", en: "Feel hot, sweat easily", score: 2 }
      ]
    },
    {
      zh: "你更喜欢什么饮品？",
      en: "What drinks do you prefer?",
      options: [
        { zh: "热水 / 热饮", en: "Warm or hot drinks", score: -1 },
        { zh: "温水", en: "Room temperature", score: 0 },
        { zh: "冷饮 / 冰水", en: "Cold or iced drinks", score: 1 }
      ]
    },
    {
      zh: "大便情况更接近？",
      en: "Which bowel pattern is closer?",
      options: [
        { zh: "偏稀 / 容易拉肚子", en: "Loose stools / diarrhea-prone", score: -1 },
        { zh: "正常", en: "Normal", score: 0 },
        { zh: "偏干 / 容易便秘", en: "Dry stools / constipation-prone", score: 1 }
      ]
    },
    {
      zh: "平时精神状态更像？",
      en: "Your energy & mood is more like…",
      options: [
        { zh: "容易疲劳、没力气", en: "Tired / low energy", score: -1 },
        { zh: "一般", en: "About average", score: 0 },
        { zh: "容易烦躁、坐不住", en: "Restless / irritable", score: 1 }
      ]
    },
    {
      zh: "口腔和皮肤感觉更像？",
      en: "Mouth & skin feel more like…",
      options: [
        { zh: "很少口干，偏凉", en: "Rarely dry; tend to feel cool", score: -1 },
        { zh: "正常", en: "Normal", score: 0 },
        { zh: "经常口干，偏热", en: "Often dry; tend to feel warm", score: 1 }
      ]
    }
  ];

  function calcInitialBalance(totalScore) {
    if (totalScore <= -3) return -4;
    if (totalScore >= 3) return 4;
    return 0;
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function stateLabelFromBalance(b) {
    if (b >= 4) return { key: "yang", zh: "偏热（偏阳）", en: "Warm/Hot-leaning (Yang)" };
    if (b <= -4) return { key: "yin", zh: "偏寒（偏阴）", en: "Cool/Cold-leaning (Yin)" };
    return { key: "neutral", zh: "平和", en: "Balanced / Neutral" };
  }

  function suggestionFromBalance(b) {
    if (b >= 4) {
      return {
        zh: "建议下一步优先选：偏阴/清淡/蔬果类（让 Balance 往 0 回来）。",
        en: "Suggestion: choose a cooling / lighter option next to bring Balance back toward 0."
      };
    }
    if (b <= -4) {
      return {
        zh: "建议下一步优先选：偏阳/温热类（让 Balance 往 0 回来）。",
        en: "Suggestion: choose a warming option next to bring Balance back toward 0."
      };
    }
    return {
      zh: "你目前比较平和：可以选择平和类，或按当下感觉微调。",
      en: "You’re fairly balanced: choose neutral foods, or fine-tune based on how you feel."
    };
  }

  // ---------------------------
  // App state
  // ---------------------------
  const MAX_ROUNDS = 10;
  let mode = "survey"; // "survey" | "game"

  // survey state
  let surveyIndex = 0;
  let surveyTotal = 0;

  // game state
  let round = 1;
  let balance = 0;
  let history = []; // {id,type,delta}

  // ---------------------------
  // UI build
  // Note: This JS expects the "style.css" I gave you (with these class names).
  // ---------------------------
  root.innerHTML = "";

  const headerRow = document.createElement("div");
  headerRow.className = "header-row";

  const title = document.createElement("h1");
  title.textContent = "Yin & Yang Food Balance";

  const langToggle = document.createElement("div");
  langToggle.className = "lang-toggle";

  const btnZh = document.createElement("button");
  btnZh.className = "toggle-btn active";
  btnZh.textContent = "中文";

  const btnEn = document.createElement("button");
  btnEn.className = "toggle-btn";
  btnEn.textContent = "English";

  langToggle.appendChild(btnZh);
  langToggle.appendChild(btnEn);

  headerRow.appendChild(title);
  headerRow.appendChild(langToggle);

  const desc = document.createElement("p");
  desc.className = "desc";

  const panel = document.createElement("div");
  panel.className = "panel";

  const statusRow = document.createElement("div");
  statusRow.className = "status-row";

  const badgeLeft = document.createElement("div");
  badgeLeft.className = "badge neutral";

  const badgeRight = document.createElement("div");
  badgeRight.className = "badge neutral";

  statusRow.appendChild(badgeLeft);
  statusRow.appendChild(badgeRight);

  const progress = document.createElement("div");
  progress.className = "progress";

  const marker = document.createElement("div");
  marker.className = "marker";
  progress.appendChild(marker);

  const cards = document.createElement("div");
  cards.className = "cards";

  const help = document.createElement("p");
  help.className = "help";

  const actions = document.createElement("div");
  actions.className = "actions";

  const btnBack = document.createElement("button");
  btnBack.className = "action-btn";
  const btnPrimary = document.createElement("button");
  btnPrimary.className = "action-btn primary";
  const btnSummary = document.createElement("button");
  btnSummary.className = "action-btn";

  actions.appendChild(btnSummary);
  actions.appendChild(btnBack);
  actions.appendChild(btnPrimary);

  const foot = document.createElement("div");
  foot.className = "small";
  foot.style.marginTop = "4px";
  foot.textContent = "Note: Educational content only. Not medical advice.";

  panel.appendChild(statusRow);
  panel.appendChild(progress);
  panel.appendChild(cards);
  panel.appendChild(help);
  panel.appendChild(actions);

  root.appendChild(headerRow);
  root.appendChild(desc);
  root.appendChild(panel);
  root.appendChild(foot);

  // ---------------------------
  // Rendering
  // ---------------------------
  function setLang(newLang) {
    lang = newLang;
    if (lang === "zh") {
      btnZh.classList.add("active");
      btnEn.classList.remove("active");
    } else {
      btnEn.classList.add("active");
      btnZh.classList.remove("active");
    }
    render();
  }

  function render() {
    // common labels
    foot.textContent =
      lang === "zh"
        ? "提示：此页面为科普内容，不构成医疗建议。"
        : "Note: This is educational content only and not medical advice.";

    if (mode === "survey") {
      renderSurvey();
    } else {
      renderGame();
    }
  }

  // ---------------------------
  // Survey screen
  // ---------------------------
  function renderSurvey() {
    desc.textContent =
      lang === "zh"
        ? "第一步：用 5 个小问题做一个“当前倾向”自评（约 30–60 秒）。"
        : "Step 1: A quick 5-question self-check to estimate your current tendency (about 30–60 seconds).";

    // badges
    badgeLeft.className = "badge neutral";
    badgeRight.className = "badge neutral";
    badgeLeft.innerHTML = `<strong>${lang === "zh" ? "进度" : "Progress"}:</strong> ${surveyIndex + 1}/${SURVEY.length}`;
    badgeRight.innerHTML = `<strong>${lang === "zh" ? "当前分数" : "Score"}:</strong> ${surveyTotal}`;

    // progress marker mapped by surveyTotal roughly (-6..+6)
    const percent = ((surveyTotal + 10) / 20) * 100;
    marker.style.left = `${clamp(percent, 0, 100)}%`;
    marker.classList.remove("yin", "yang");

    // question + options
    cards.innerHTML = "";
    const q = SURVEY[surveyIndex];

    help.textContent = lang === "zh" ? q.zh : q.en;

    q.options.forEach((opt) => {
      const btn = document.createElement("button");
      // Use neutral styling for survey options (simple & accessible)
      btn.className = "card-btn neutral";

      const emoji = document.createElement("div");
      emoji.className = "emoji";
      emoji.textContent = "📝";

      const text = document.createElement("div");
      text.className = "card-text";

      const name = document.createElement("div");
      name.className = "card-name";
      name.textContent = lang === "zh" ? opt.zh : opt.en;

      const meta = document.createElement("div");
      meta.className = "card-meta";
      meta.textContent =
        lang === "zh"
          ? `本题分值：${opt.score > 0 ? "+" : ""}${opt.score}`
          : `Score: ${opt.score > 0 ? "+" : ""}${opt.score}`;

      text.appendChild(name);
      text.appendChild(meta);

      btn.appendChild(emoji);
      btn.appendChild(text);

      btn.addEventListener("click", () => {
        surveyTotal += opt.score;
        if (surveyIndex < SURVEY.length - 1) {
          surveyIndex += 1;
          renderSurvey();
        } else {
          // survey finished -> start game
          const init = calcInitialBalance(surveyTotal);
          balance = init;
          mode = "game";
          round = 1;
          history = [];
          // Explain result once (older-user friendly)
          const s = stateLabelFromBalance(balance);
          const msgZh = `自评完成：你的当前倾向为「${s.zh}」，初始 Balance = ${balance}。\n\n接下来我们用饮食选择练习，看看如何更接近平和（0）。`;
          const msgEn = `Self-check complete: your tendency is “${s.en}”, initial Balance = ${balance}.\n\nNext, use the food choices to practice moving closer to balanced (0).`;
          alert(lang === "zh" ? msgZh : msgEn);
          render();
        }
      });

      cards.appendChild(btn);
    });

    // buttons
    btnSummary.style.display = "none";
    btnBack.style.display = "none";
    btnPrimary.style.display = "inline-flex";
    btnPrimary.textContent = lang === "zh" ? "重新开始自评" : "Restart Self-check";
    btnPrimary.onclick = () => {
      surveyIndex = 0;
      surveyTotal = 0;
      renderSurvey();
    };
  }

  // ---------------------------
  // Game screen
  // ---------------------------
  function pickOneFoodByType(type) {
    const list = FOODS.filter((f) => f.type === type);
    return list[Math.floor(Math.random() * list.length)];
  }

  function renderGame() {
    desc.textContent =
      lang === "zh"
        ? "第二步：饮食科普练习（每轮从 3 个食物中选 1 个）。目标：让 Balance 更接近 0。"
        : "Step 2: Food education practice (choose 1 of 3 foods each round). Goal: move Balance closer to 0.";

    const state = stateLabelFromBalance(balance);

    // badges
    badgeLeft.className = "badge neutral";
    badgeRight.className = `badge ${state.key}`;

    badgeLeft.innerHTML = `<strong>${lang === "zh" ? "轮次" : "Round"}:</strong> ${round}/${MAX_ROUNDS}`;
    badgeRight.innerHTML = `<strong>${lang === "zh" ? "当前状态" : "Current"}:</strong> ${lang === "zh" ? state.zh : state.en}  (Balance ${balance})`;

    // progress marker (-10..+10 => 0..100)
    const percent = ((balance + 10) / 20) * 100;
    marker.style.left = `${clamp(percent, 0, 100)}%`;
    marker.classList.remove("yin", "yang");
    if (balance >= 4) marker.classList.add("yang");
    else if (balance <= -4) marker.classList.add("yin");

    // tip
    const sugg = suggestionFromBalance(balance);
    help.textContent =
      (lang === "zh" ? "提示：" : "Tip: ") + (lang === "zh" ? sugg.zh : sugg.en);

    // choices: yin + neutral + yang
    cards.innerHTML = "";
    const yinFood = pickOneFoodByType("yin");
    const yangFood = pickOneFoodByType("yang");
    const neutralFood = pickOneFoodByType("neutral");

    const choices = [yinFood, neutralFood, yangFood];

    choices.forEach((food) => {
      const btn = document.createElement("button");
      btn.className = `card-btn ${food.type}`;

      const emoji = document.createElement("div");
      emoji.className = "emoji";
      emoji.textContent = food.emoji;

      const text = document.createElement("div");
      text.className = "card-text";

      const name = document.createElement("div");
      name.className = "card-name";
      // bilingual naming
      name.textContent =
        lang === "zh"
          ? `${food.name.zh}（${food.name.en}）`
          : `${food.name.en} (${food.name.zh})`;

      const meta = document.createElement("div");
      meta.className = "card-meta";
      const sign = food.delta > 0 ? "+" : "";
      const kind =
        food.type === "yin"
          ? lang === "zh"
            ? "偏阴"
            : "Yin"
          : food.type === "yang"
          ? lang === "zh"
            ? "偏阳"
            : "Yang"
          : lang === "zh"
          ? "平和"
          : "Neutral";
      meta.textContent = `${kind}  ${t(food.level)}  (${sign}${food.delta})`;

      text.appendChild(name);
      text.appendChild(meta);

      btn.appendChild(emoji);
      btn.appendChild(text);

      btn.addEventListener("click", () => onChooseFood(food));
      cards.appendChild(btn);
    });

    // buttons
    btnSummary.style.display = "inline-flex";
    btnBack.style.display = "inline-flex";
    btnPrimary.style.display = "inline-flex";

    btnSummary.textContent = lang === "zh" ? "查看总结" : "View Summary";
    btnSummary.onclick = showSummary;

    btnBack.textContent = lang === "zh" ? "返回自评" : "Back to Self-check";
    btnBack.onclick = () => {
      mode = "survey";
      // keep previous survey score visible; let user redo if wanted
      render();
    };

    btnPrimary.textContent = lang === "zh" ? "重新开始练习" : "Restart Practice";
    btnPrimary.onclick = restartGame;
  }

  function onChooseFood(food) {
    history.push({ id: food.id, type: food.type, delta: food.delta });

    const before = balance;
    balance = clamp(balance + food.delta, -10, 10);
    const afterState = stateLabelFromBalance(balance);
    const sugg = suggestionFromBalance(balance);

    // Explanation popup (simple + accessible)
    const msgZh =
      `你选择了：${food.name.zh}（${food.name.en}）\n` +
      `分值变化：${before} → ${balance}（${food.delta > 0 ? "+" : ""}${food.delta}）\n\n` +
      `${food.explain.zh}\n\n` +
      `当前状态：${afterState.zh}\n` +
      `${sugg.zh}`;

    const msgEn =
      `You chose: ${food.name.en} (${food.name.zh})\n` +
      `Balance: ${before} → ${balance} (${food.delta > 0 ? "+" : ""}${food.delta})\n\n` +
      `${food.explain.en}\n\n` +
      `Current state: ${afterState.en}\n` +
      `${sugg.en}`;

    alert(lang === "zh" ? msgZh : msgEn);

    if (round >= MAX_ROUNDS) {
      showSummary();
      return;
    }

    round += 1;
    renderGame();
  }

  function showSummary() {
    const yangCount = history.filter((h) => h.type === "yang").length;
    const yinCount = history.filter((h) => h.type === "yin").length;
    const neutralCount = history.filter((h) => h.type === "neutral").length;

    const finalState = stateLabelFromBalance(balance);

    const summaryZh =
      `总结（科普）：\n` +
      `- 轮次：${MAX_ROUNDS}\n` +
      `- 你选择：偏阳 ${yangCount} 次，偏阴 ${yinCount} 次，平和 ${neutralCount} 次\n` +
      `- 最终 Balance：${balance}\n` +
      `- 倾向：${finalState.zh}\n\n` +
      `一般建议方向（非医疗建议）：\n` +
      `- 偏热时：清淡、蔬果、适量水分\n` +
      `- 偏寒时：温热、熟食、少冰冷\n` +
      `- 平和时：保持多样化与适量`;

    const summaryEn =
      `Summary (educational):\n` +
      `- Rounds: ${MAX_ROUNDS}\n` +
      `- Choices: Yang ${yangCount}, Yin ${yinCount}, Neutral ${neutralCount}\n` +
      `- Final Balance: ${balance}\n` +
      `- Tendency: ${finalState.en}\n\n` +
      `General guidance (not medical advice):\n` +
      `- Warm/hot-leaning: lighter foods, veggies, adequate fluids\n` +
      `- Cool/cold-leaning: warmer cooked foods, avoid too much cold/iced\n` +
      `- Balanced: keep variety and moderation`;

    alert(lang === "zh" ? summaryZh : summaryEn);
  }

  function restartGame() {
    round = 1;
    history = [];
    renderGame();
  }

  // ---------------------------
  // Language toggle handlers
  // ---------------------------
  btnZh.addEventListener("click", () => setLang("zh"));
  btnEn.addEventListener("click", () => setLang("en"));

  // Init
  render();
});
