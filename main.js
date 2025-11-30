// main.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("Yin & Yang Food Balance: script loaded.");

  const root = document.getElementById("game-root");
  if (!root) {
    console.error("#game-root not found");
    return;
  }

  // 阴阳食物表：姓名 + emoji + 类型 + 阴阳分值
  const FOODS = [
    { name: "牛肉 (Beef)", emoji: "🥩", type: "yang", delta: 1 },
    { name: "羊肉 (Lamb)", emoji: "🍖", type: "yang", delta: 2 },
    { name: "辣椒 (Chili)", emoji: "🌶️", type: "yang", delta: 3 },
    { name: "生姜 (Ginger)", emoji: "🫚", type: "yang", delta: 2 },
    { name: "西兰花 (Broccoli)", emoji: "🥦", type: "yin", delta: -1 },
    { name: "黄瓜 (Cucumber)", emoji: "🥒", type: "yin", delta: -2 },
    { name: "梨 (Pear)", emoji: "🍐", type: "yin", delta: -1 },
    { name: "西瓜 (Watermelon)", emoji: "🍉", type: "yin", delta: -3 },
    { name: "绿豆汤 (Mung bean soup)", emoji: "🥣", type: "yin", delta: -2 },
    { name: "螃蟹 (Crab)", emoji: "🦀", type: "yin", delta: -2 }
  ];

  // 游戏状态
  let balance = 0;       // 阴阳平衡值
  let timeLeft = 60;     // 剩余秒数
  let gameOver = false;  // 游戏是否结束
  let spawnTimer = null;
  let countdownTimer = null;

  // 构建 UI
  root.innerHTML = "";

  const title = document.createElement("h1");
  title.textContent = "Yin & Yang Food Balance";

  const info = document.createElement("p");
  info.textContent =
    "点击不同食物卡片：阳性食物让数值上升，阴性食物让数值下降。尽量让 Balance 保持在 -7 到 +7 之间，撑过 60 秒。";

  const statusBar = document.createElement("div");
  statusBar.className = "status-bar";

  const balanceLabel = document.createElement("span");
  balanceLabel.textContent = "Balance: ";

  const balanceValue = document.createElement("span");
  balanceValue.id = "balance-value";

  const timerLabel = document.createElement("span");
  timerLabel.className = "timer-label";

  statusBar.appendChild(balanceLabel);
  statusBar.appendChild(balanceValue);
  statusBar.appendChild(timerLabel);

  const barContainer = document.createElement("div");
  barContainer.className = "bar-container";

  const barFill = document.createElement("div");
  barFill.className = "bar-fill";
  barContainer.appendChild(barFill);

  const cardsContainer = document.createElement("div");
  cardsContainer.className = "cards-container";

  const message = document.createElement("div");
  message.className = "game-message";

  const restartBtn = document.createElement("button");
  restartBtn.textContent = "Restart";
  restartBtn.className = "restart-btn";
  restartBtn.addEventListener("click", restartGame);

  root.appendChild(title);
  root.appendChild(info);
  root.appendChild(statusBar);
  root.appendChild(barContainer);
  root.appendChild(cardsContainer);
  root.appendChild(message);
  root.appendChild(restartBtn);

  // 更新 UI
  function updateUI() {
    balanceValue.textContent = balance.toString();
    timerLabel.textContent = `Time left: ${timeLeft}s`;

    // 把 balance (-10 ~ +10) 映射为 0% ~ 100%
    const percent = ((balance + 10) / 20) * 100;
    barFill.style.left = `${percent}%`;

    // 条的颜色
    if (balance < -3) {
      barFill.classList.remove("yang");
      barFill.classList.add("yin");
    } else if (balance > 3) {
      barFill.classList.remove("yin");
      barFill.classList.add("yang");
    } else {
      barFill.classList.remove("yin", "yang");
    }
  }

  // 生成一个随机食物卡片
  function spawnCard() {
    if (gameOver) return;

    const food = FOODS[Math.floor(Math.random() * FOODS.length)];

    const card = document.createElement("button");
    card.className = `food-card ${food.type}`;

    const emojiSpan = document.createElement("span");
    emojiSpan.className = "food-emoji";
    emojiSpan.textContent = food.emoji;

    const textWrap = document.createElement("div");
    textWrap.className = "food-text";

    const nameSpan = document.createElement("span");
    nameSpan.className = "food-name";
    nameSpan.textContent = food.name;

    const metaSpan = document.createElement("span");
    metaSpan.className = "food-meta";
    const sign = food.delta > 0 ? "+" : "";
    const yinYangLabel = food.type === "yang" ? "Yang" : "Yin";
    metaSpan.textContent = `${yinYangLabel} ${sign}${food.delta}`;

    textWrap.appendChild(nameSpan);
    textWrap.appendChild(metaSpan);

    card.appendChild(emojiSpan);
    card.appendChild(textWrap);

    card.addEventListener("click", () => {
      if (gameOver) return;
      balance += food.delta;
      cardsContainer.removeChild(card);
      checkState();
      updateUI();
    });

    cardsContainer.appendChild(card);

    // 5 秒不点就自动消失
    setTimeout(() => {
      if (cardsContainer.contains(card) && !gameOver) {
        cardsContainer.removeChild(card);
      }
    }, 5000);
  }

  // 检查是否过度失衡
  function checkState() {
    if (Math.abs(balance) > 7) {
      endGame(false);
    }
  }

  // 结束游戏
  function endGame(win) {
    gameOver = true;
    clearInterval(spawnTimer);
    clearInterval(countdownTimer);

    if (win) {
      message.textContent = "恭喜！你用饮食保持了阴阳平衡。";
      message.classList.remove("lose");
      message.classList.add("win");
    } else {
      message.textContent = "吃得太偏了，阴阳失衡，游戏失败。";
      message.classList.remove("win");
      message.classList.add("lose");
    }

    console.log("Game over. Win:", win, "Final balance:", balance);
  }

  // 开始一局游戏
  function startGame() {
    console.log("Game start");
    balance = 0;
    timeLeft = 60;
    gameOver = false;
    message.textContent = "";
    cardsContainer.innerHTML = "";

    updateUI();

    spawnTimer = setInterval(spawnCard, 1500);

    countdownTimer = setInterval(() => {
      if (gameOver) return;
      timeLeft -= 1;
      if (timeLeft <= 0) {
        timeLeft = 0;
        endGame(true);
      }
      updateUI();
    }, 1000);
  }

  // 点击 Restart
  function restartGame() {
    clearInterval(spawnTimer);
    clearInterval(countdownTimer);
    startGame();
  }

  // 初始化启动
  startGame();
});
