// main.js (Education mode with CN/EN toggle)
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("game-root");
  if (!root) return;

  // ---------------------------
  // Data (food -> yin/yang tendency)
  // type: "yin" | "yang" | "neutral"
  // delta: affects balance
  // explain: short educational text, not medical advice
  // ---------------------------
  const FOODS = [
    // YANG (warming)
    {
      id: "beef",
      type: "yang",
      delta: +1,
      emoji: "🥩",
      name: { zh: "牛肉", en: "Beef" },
      level: { zh: "偏温/助阳", en: "Warming / Yang-leaning" },
      explain: {
        zh: "一般认为偏温，适量可助气血，但吃多容易偏热。",
        en: "Often considered warming. Moderate amounts may support energy, but too much can feel ‘hot’ for some people."
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
        zh: "常被认为更温热，适合偏寒体质者少量食用。",
        en: "Commonly seen as more warming. Some people with ‘cold’ tendencies may tolerate small amounts better."
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
        en: "Spicy foods can feel ‘hot’ and drying for some people—go lighter if you get dry mouth or feel overheated."
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
        zh: "常用于温中散寒，但不适合本就偏热的人大量吃。",
        en: "Often used as a warming food; large amounts may not suit people who already feel overheated."
      }
    },

    // YIN (cooling)
    {
      id: "broccoli",
      type: "yin",
      delta: -1,
      emoji: "🥦",
      name: { zh: "西兰花", en: "Broccoli" },
      level: { zh: "偏凉", en: "Cooling-leaning" },
      explain: {
        zh: "清淡蔬菜多偏凉，适合偏热时增加。",
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
        en: "Often viewed as cooling; people who feel ‘cold’ or have loose stools may do better with smaller amounts."
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
        zh: "清淡偏凉，适合偏热时作为调整方向之一。",
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

    // NEUTRAL (balancing)
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
  // App state
  // ---------------------------
  const MAX_ROUNDS = 10;
  let lang = "zh"; // "zh" | "en"
  let round = 1;
  let balance = 0;
  let history = []; // {id,type,delta}

  // Build UI scaffold
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

  const badgeRound = document.createElement("div");
  badgeRound.className = "badge neutral";
  const badgeState = document.createElement("div");
  badgeState.className = "badge neutral";

  statusRow.appendChild(badgeRound);
  statusRow.appendChild(badgeState);

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

  const btnRestart = document.createElement("button");
  btnRestart.className = "action-btn primary";
  const btnSummary = document.createElement("button");
  btnSummary.className = "action-btn";

  actions.appendChild(btnSummary);
  actions.appendChild(btnRestart);

  const foot = document.createElement("div");
  foot.className = "small";
  foot.style.marginTop = "4px";
  foot.textContent =
    "Note: This is educational content only and not medical advice.";

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
  // Helpers
  // ---------------------------
  function t(obj) {
    return obj[lang] ?? obj.zh;
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function stateLabelFromBalance(b) {
    // education-friendly bands (no "death")
    if (b >= 4) return { key: "yang", zh: "偏热（偏阳）", en: "Warm/Hot-leaning (Yang)" };
    if (b <= -4) return { key: "yin", zh: "偏寒（偏阴）", en: "Cool/Cold-leaning (Yin)" };
    return { key: "neutral", zh: "平和", en: "Balanced / Neutral" };
  }

  function suggestionFromBalance(b) {
    if (b >= 4) {
      return {
        zh: "建议下一步优先选：偏阴/清淡/蔬果类（让 Balance 往 0 回来）。",
        en: "Suggestion: next choose a cooling / lighter option to bring Balance back toward 0."
      };
    }
    if (b <= -4) {
      return {
        zh: "建议下一步优先选：偏阳/温热类（让 Balance 往 0 回来）。",
        en: "Suggestion: next choose a warming option to bring Balance back toward 0."
      };
    }
    return {
      zh: "你目前比较平和：可以选择平和类，或按当下感觉微调。",
      en: "You’re fairly balanced: choose neutral foods, or fine-tune based on how you feel."
    };
  }

  function updateUI() {
    // header description
    desc.textContent =
      lang === "zh"
        ? "科普互动：每轮从 3 个食物中选 1 个。系统会解释它偏阴/偏阳/平和，以及下一步怎么选更平衡。"
        : "Educational interactive: each round choose 1 of 3 foods. You’ll see why it’s Yin/Yang/Neutral and what to choose next for balance.";

    // buttons
    btnRestart.textContent = lang === "zh" ? "重新开始" : "Restart";
    btnSummary.textContent = lang === "zh" ? "查看总结" : "View Summary";

    // round badge
    badgeRound.innerHTML = `<strong>${lang === "zh" ? "轮次" : "Round"}:</strong> ${round}/${MAX_ROUNDS}`;

    // state badge
    const state = stateLabelFromBalance(balance);
    badgeState.classList.remove("yin", "yang", "neutral");
    badgeState.classList.add(state.key);
    badgeState.innerHTML = `<strong>${lang === "zh" ? "当前状态" : "Current"}:</strong> ${lang === "zh" ? state.zh : state.en}`;

    // progress marker (map -10..+10 => 0..100)
    const percent = ((balance + 10) / 20) * 100;
    marker.style.left = `${clamp(percent, 0, 100)}%`;
    marker.classList.remove("yin", "yang");
    if (balance >= 4) marker.classList.add("yang");
    else if (balance <= -4) marker.classList.add("yin");

    // help text
    const sugg = suggestionFromBalance(balance);
    help.textContent = (lang === "zh" ? "提示：" : "Tip: ") + (lang === "zh" ? sugg.zh : sugg.en);
  }

  function pickOneFoodByType(type) {
    const list = FOODS.filter(f => f.type === type);
    return list[Math.floor(Math.random() * list.length)];
  }

  function renderChoices() {
    cards.innerHTML = "";

    // Always show 3 choices: yin + yang + neutral (slow-paced)
    const yinFood = pickOneFoodByType("yin");
    const yangFood = pickOneFoodByType("yang");
    const neutralFood = pickOneFoodByType("neutral");

    const choices = [yinFood, neutralFood, yangFood];

    choices.forEach(food => {
      const btn = document.createElement("button");
      btn.className = `card-btn ${food.type}`;

      const emoji = document.createElement("div");
      emoji.className = "emoji";
      emoji.textContent = food.emoji;

      const text = document.createElement("div");
      text.className = "card-text";

      const name = document.createElement("div");
      name.className = "card-name";
      name.textContent = `${t(food.name)}${lang === "zh" ? `（${food.name.en}）` : ` (${food.name.zh})`}`;

      const meta = document.createElement("div");
      meta.className = "card-meta";
      const sign = food.delta > 0 ? "+" : "";
      const kind =
        food.type === "yin" ? (lang === "zh" ? "偏阴" : "Yin") :
        food.type === "yang" ? (lang === "zh" ? "偏阳" : "Yang") :
        (lang === "zh" ? "平和" : "Neutral");
      meta.textContent = `${kind}  ${t(food.level)}  (${sign}${food.delta})`;

      text.appendChild(name);
      text.appendChild(meta);

      btn.appendChild(emoji);
      btn.appendChild(text);

      btn.addEventListener("click", () => onChoose(food));
      cards.appendChild(btn);
    });
  }

  function onChoose(food) {
    history.push({ id: food.id, type: food.type, delta: food.delta });

    balance += food.delta;
    balance = clamp(balance, -10, 10);

    // After choosing: show explanation + advance round
    const state = stateLabelFromBalance(balance);
    const sugg = suggestionFromBalance(balance);

    const explainText =
      (lang === "zh"
        ? `你选择了：${t(food.name)}（${food.name.en}）。\n\n${t(food.explain)}\n\n当前状态：${state.zh}。\n${sugg.zh}`
        : `You chose: ${t(food.name)}.\n\n${t(food.explain)}\n\nCurrent state: ${state.en}.\n${sugg.en}`
      );

    alert(explainText); // Simple, accessible feedback (works well for older users)

    if (round >= MAX_ROUNDS) {
      showSummary();
      return;
    }

    round += 1;
    updateUI();
    renderChoices();
  }

  function showSummary() {
    // Count tendencies
    const yangCount = history.filter(h => h.type === "yang").length;
    const yinCount = history.filter(h => h.type === "yin").length;
    const neutralCount = history.filter(h => h.type === "neutral").length;

    const finalState = stateLabelFromBalance(balance);

    const summaryZh =
`总结（科普）：
- 轮次：${MAX_ROUNDS}
- 你选择：偏阳 ${yangCount} 次，偏阴 ${yinCount} 次，平和 ${neutralCount} 次
- 最终 Balance：${balance}
- 倾向：${finalState.zh}

建议方向（非医疗建议）：
- 偏热时：清淡、蔬果、适量水分
- 偏寒时：温热、熟食、少冰冷
- 平和时：保持多样化与适量`;

    const summaryEn =
`Summary (educational):
- Rounds: ${MAX_ROUNDS}
- Choices: Yang ${yangCount}, Yin ${yinCount}, Neutral ${neutralCount}
- Final Balance: ${balance}
- Tendency: ${finalState.en}

General guidance (not medical advice):
- If warm/hot-leaning: lighter foods, veggies, adequate fluids
- If cool/cold-leaning: warmer cooked foods, avoid too much cold/iced
- If balanced: keep variety and moderation`;

    alert(lang === "zh" ? summaryZh : summaryEn);

    // Freeze choices after summary
    cards.innerHTML = "";
    const done = document.createElement("div");
    done.className = "small";
    done.textContent =
      lang === "zh"
        ? "已完成 10 轮。你可以点击“重新开始”再体验一次。"
        : "Completed 10 rounds. Click “Restart” to try again.";
    cards.appendChild(done);
  }

  function restart() {
    round = 1;
    balance = 0;
    history = [];
    updateUI();
    renderChoices();
  }

  // ---------------------------
  // Language toggle
  // ---------------------------
  btnZh.addEventListener("click", () => {
    lang = "zh";
    btnZh.classList.add("active");
    btnEn.classList.remove("active");
    updateUI();
    renderChoices();
  });

  btnEn.addEventListener("click", () => {
    lang = "en";
    btnEn.classList.add("active");
    btnZh.classList.remove("active");
    updateUI();
    renderChoices();
  });

  // actions
  btnRestart.addEventListener("click", restart);
  btnSummary.addEventListener("click", showSummary);

  // init
  updateUI();
  renderChoices();
});
