// main.js
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("game-root");
  if (!root) return;

  let balance = 0;      // -10（偏阴）~ +10（偏阳）
  let timeLeft = 60;    // 游戏时间 60 秒
  let gameOver = false;
  let spawnTimer = null;
  let countdownTimer = null;

  root.innerHTML = "";

  const title = document.createElement("h1");
  title.textContent = "Yin & Yang Balance Game";

  const info = document.createElement("p");
  info.textContent = "点击 Yin 或 Yang 食物卡片，尽量把平衡维持在 -7 到 +7 之间，撑过 60 秒。";

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
  barFill.className = "bar-fill neutral";
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

  function updateUI() {
    balanceValue.textContent = balance.toString();
    timerLabel.textContent = `Time left: ${timeLeft}s`;

    const percent = ((balance + 10) / 20) * 100;
    barFill.style.left = `${percent}%`;

    if (balance < -3) {
      barFill.classList.remove("neutral", "yang");
      barFill.classList.add("yin");
    } else if (balance > 3) {
      barFill.classList.remove("neutral", "yin");
      barFill.classList.add("yang");
    } else {
      barFill.classList.remove("yin", "yang");
      barFill.classList.add("neutral");
    }
  }

  function spawnCard() {
    if (gameOver) return;

    const type = Math.random() < 0.5 ? "Yin" : "Yang";
    const card = document.createElement("button");
    card.className = `food-card ${type.toLowerCase()}`;
    card.textContent = type === "Yin" ? "Yin 食物" : "Yang 食物";

    card.addEventListener("click", () => {
      if (gameOver) return;
      if (type === "Yin") {
        balance -= 1;
      } else {
        balance += 1;
      }
      cardsContainer.removeChild(card);
      checkState();
      updateUI();
    });

    cardsContainer.appendChild(card);

    setTimeout(() => {
      if (cardsContainer.contains(card) && !gameOver) {
        cardsContainer.removeChild(card);
      }
    }, 5000);
  }

  function checkState() {
    if (Math.abs(balance) > 7) {
      endGame(false);
    }
  }

  function endGame(win) {
    gameOver = true;
    clearInterval(spawnTimer);
    clearInterval(countdownTimer);
    if (win) {
      message.textContent = "恭喜！你成功维持了阴阳平衡。";
      message.classList.remove("lose");
      message.classList.add("win");
    } else {
      message.textContent = "失衡过大，游戏失败。";
      message.classList.remove("win");
      message.classList.add("lose");
    }
  }

  function startGame() {
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

  function restartGame() {
    clearInterval(spawnTimer);
    clearInterval(countdownTimer);
    startGame();
  }

  startGame();
});

