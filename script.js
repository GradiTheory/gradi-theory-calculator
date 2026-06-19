/* ============================
   プリセット定義
============================ */
const presets = {
  electric: { M: 10, S: 3, L: 0.8, A: "1,0", T: 0.1 },
  heat:     { M: 80, S: 20, L: 0.5, A: "0,1", T: 0.5 },
  water:    { M: 5,  S: 1,  L: 0.9, A: "1,-1", T: 0.0 },
  economy:  { M: 120, S: 100, L: 0.3, A: "1,0", T: 5 },
  info:     { M: 300, S: 200, L: 0.7, A: "0,1", T: 10 }
};

/* ============================
   SI単位（G と Φ）
============================ */
const gUnits = {
  electric: "V（電位差）",
  heat:     "K（温度差）",
  water:    "m（高さ差）",
  economy:  "円（価格差）",
  info:     "（無次元・注目差）"
};

const phiUnits = {
  electric: "A（電流）",
  heat:     "W（熱流）",
  water:    "m³/s（水流）",
  economy:  "円/s（資金流）",
  info:     "1/s（情報流）"
};

/* ============================
   初期化
============================ */
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-calc").addEventListener("click", calc);

  document.querySelectorAll(".preset-card").forEach(card => {
    card.addEventListener("click", () => {
      const key = card.dataset.preset;
      loadPreset(key);
      applyTheme(key);
    });
  });

  document.getElementById("g-unit-label").innerText = gUnits.electric;
  document.getElementById("phi-unit-label").innerText = phiUnits.electric;

  calc();
});

/* ============================
   プリセット読み込み
============================ */
function loadPreset(key) {
  const p = presets[key];

  document.getElementById("input-M").value = p.M;
  document.getElementById("input-S").value = p.S;
  document.getElementById("input-L").value = p.L;
  document.getElementById("input-A").value = p.A;
  document.getElementById("input-T").value = p.T;

  document.getElementById("g-unit-label").innerText = gUnits[key];
  document.getElementById("phi-unit-label").innerText = phiUnits[key];

  calc();
}

/* ============================
   テーマ色切り替え
============================ */
function applyTheme(key) {
  const themes = {
    electric: "#4AA3FF",
    heat:     "#FF6B6B",
    water:    "#3ED6C4",
    economy:  "#FFD966",
    info:     "#B46BFF"
  };

  const color = themes[key];
  document.documentElement.style.setProperty("--theme-color", color);

  document.getElementById("flow-arrow").style.background =
    `linear-gradient(90deg, ${color}, #ffffff)`;
}

/* ============================
   計算
============================ */
function calc() {
  const M = parseFloat(document.getElementById("input-M").value);
  const S = parseFloat(document.getElementById("input-S").value);
  const L = parseFloat(document.getElementById("input-L").value);
  const T = parseFloat(document.getElementById("input-T").value);
  const A = document.getElementById("input-A").value.split(",").map(Number);
  const normalizeG = document.getElementById("input-normalize-G").checked;

  const status = document.getElementById("status-message");
  const outG = document.getElementById("output-G");
  const outPhi = document.getElementById("output-Phi");

  /* R（モノ・ソラ比） */
  let R = (S !== 0) ? (M / S) : Infinity;

  const outR = document.getElementById("output-R");
  const rState = document.getElementById("r-state-label");

  outR.textContent = R.toFixed(3);

  outR.classList.remove("r-mono", "r-sora", "r-equal");

  if (R > 1) {
    outR.classList.add("r-mono");
    rState.textContent = "モノ優勢";
  } else if (R < 1) {
    outR.classList.add("r-sora");
    rState.textContent = "ソラ優勢";
  } else {
    outR.classList.add("r-equal");
    rState.textContent = "均衡";
  }

  /* G（偏り） */
  let Graw = M - S;
  let G = normalizeG && (M + S !== 0) ? (M - S) / (M + S) : Graw;

  outG.textContent = G.toFixed(4);

  let Phi = 0;
  let flowed = false;

  if (Math.abs(Graw) < T) {
    Phi = 0;
    flowed = false;
    status.textContent = "閾値未満：流れは発生しません（Φ = 0）";
  } else {
    Phi = Graw * L;
    flowed = true;
    status.textContent = "流れが発生しています";
  }

  outPhi.textContent = Phi.toFixed(4);

  updateDiagram(G, A, L, Phi, flowed);
  updateFlowVisual(A, L, Phi, flowed);
}

/* ============================
   図解アニメーション
============================ */
function updateDiagram(G, A, L, Phi, flowed) {
  const arrowFlow = document.getElementById("arrow-Flow");
  const nodeG = document.getElementById("node-G");
  const nodePhi = document.getElementById("node-Phi");

  const absPhi = Math.abs(Phi);

  arrowFlow.style.strokeWidth = flowed ? (2 + Math.min(6, absPhi * 0.8)) : 2;
  arrowFlow.style.opacity = flowed ? Math.min(1, 0.3 + L) : 0.2;

  nodeG.style.filter = `drop-shadow(0 0 6px rgba(180,107,255,${flowed ? 0.6 : 0.2}))`;
  nodePhi.style.filter = `drop-shadow(0 0 8px rgba(255,95,122,${flowed ? 0.6 : 0.2}))`;
}

/* ============================
   Flow アニメーション
============================ */
function updateFlowVisual(A, L, Phi, flowed) {
  const arrow = document.getElementById("flow-arrow");
  const absPhi = Math.abs(Phi);

  arrow.style.height = flowed ? `${6 + Math.min(16, absPhi * 1.2)}px` : "6px";
  arrow.style.opacity = flowed ? Math.min(1, 0.2 + L) : 0.15;

  const angle = Math.atan2(A[1], A[0]) * 180 / Math.PI;
  arrow.style.transform = `rotate(${angle}deg)
