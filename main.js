* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  background: radial-gradient(circle at top, #101520 0%, #05060a 55%, #000 100%);
  color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

#game-root {
  width: min(90vw, 640px);
  padding: 20px 18px 18px;
  border-radius: 16px;
  background: rgba(8, 10, 20, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

h1 {
  margin: 0 0 8px;
  font-size: 1.6rem;
}

p {
  margin: 0 0 16px;
  font-size: 0.95rem;
  color: #c7c9d3;
  text-align: left;
}

.status-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  font-size: 0.95rem;
}

.timer-label {
  margin-left: auto;
  font-weight: 500;
}

.bar-container {
  position: relative;
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: #1b1f2b;
  margin-bottom: 16px;
  overflow: hidden;
}

.bar-fill {
  position: absolute;
  top: -4px;
  width: 10px;
  height: 14px;
  border-radius: 999px;
  background: #e0f7fa;
  transform: translateX(-50%);
  box-shadow: 0 0 10px rgba(129, 212, 250, 0.8);
}

.bar-fill.yin {
  background: #80cbc4;
  box-shadow: 0 0 10px rgba(128, 203, 196, 0.8);
}

.bar-fill.yang {
  background: #ffab91;
  box-shadow: 0 0 10px rgba(255, 171, 145, 0.9);
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  min-height: 80px;
  margin-bottom: 12px;
}

.food-card {
  border: none;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s;
}

.food-card.yin {
  background: #263238;
  color: #b2dfdb;
  box-shadow: 0 0 8px rgba(178, 223, 219, 0.35);
}

.food-card.yang {
  background: #f4511e;
  color: #ffe0b2;
  box-shadow: 0 0 8px rgba(255, 138, 101, 0.45);
}

.food-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
}

.game-message {
  min-height: 22px;
  font-size: 0.95rem;
  margin-bottom: 10px;
}

.game-message.win {
  color: #a5d6a7;
}

.game-message.lose {
  color: #ef9a9a;
}

.restart-btn {
  border: none;
  border-radius: 999px;
  padding: 8px 18px;
  font-size: 0.9rem;
  cursor: pointer;
  background: linear-gradient(135deg, #26a69a, #7e57c2);
  color: #fff;
  align-self: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.restart-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.55);
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.4rem;
  }
  .status-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  .timer-label {
    margin-left: 0;
  }
}


