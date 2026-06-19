// script.js
const presets = {
  electric: { // 電位差 → 電流
    M: 10, S: 3, L: 0.8, A: "1,0", T: 0.1
  },
  heat: { // 温度差 → 熱流
    M: 80, S: 20, L: 0.5, A: "0,1", T: 0.5
  },
  water: { // 高さ差 → 水流
    M: 5, S: 1, L: 0.9, A: "1,-1", T: 0.0
  },
  economy: { // 需要差 → 資金流
    M: 120, S: 100, L: 0.3, A: "1,0", T: 5
  },
  info: { // 関心差 → 情報流
    M: 300, S: 200, L: 0.7, A: "0,1", T: 10
  }
};

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-calc").addEventListener("click", calc);
  document.querySelectorAll("#preset-buttons button").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.preset;
      loadPreset(key);
    });
  });
  // 初期計算
  calc();
});

function loadPreset(key) {
  const p = presets[key];
  if (!p) return;
  document.getElementById("input-M").value = p.M;
  document.getElementById("input-S").value = p.S;
  document.getElementById("input-L").value = p.L;
  document.getElementById("input-A").value = p.A;
  document.getElementById("input-T").value = p.T;
  calc();
}

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

  if (isNaN(M) || isNaN(S) || isNaN(L) || isNaN(T) || A.some(v => isNaN(v))) {
    status.textContent = "入力値を確認してください。";
    return;
  }

  let Graw = M - S;
  let G = Graw;

  if (normalizeG && (M + S) !== 0) {
    G = (M - S) / (M + S);
  }

  outG.textContent = G.toFixed(4);

  let Phi = 0;
  let flowed = false;

  if (Math.abs(Graw) < T) {
    Phi = 0;
    flowed = false;
    status.textContent = "|M − S| < T のため、流れは発生しません（Φ = 0）。";
  } else {
    Phi = Graw * L; // A は方向として別扱い
    flowed = true;
    status.textContent = "|M − S| ≥ T のため、流れが発生しています。";
  }

  outPhi.textContent = Phi.toFixed(4);

  updateDiagram(G, A, L, Phi, flowed);
  updateFlowVisual(A, L, Phi, flowed);
}

function updateDiagram(G, A, L, Phi, flowed) {
  const arrowFlow = document.getElementById("arrow-Flow");
  const nodeG = document.getElementById("node-G");
  const nodePhi = document.getElementById("node-Phi");

  const absPhi = Math.abs(Phi);

  // Flow arrow thickness
  arrowFlow.style.strokeWidth = flowed ? (2 + Math.min(6, absPhi * 0.8)) : 2;
  arrowFlow.style.opacity = flowed ? Math.min(1, 0.3 + L) : 0.2;

  // G node glow
  const gGlow = flowed ? 0.4 + Math.min(0.6, Math.abs(G) * 0.2) : 0.2;
  nodeG.style.filter = `drop-shadow(0 0 6px rgba(180,107,255,${gGlow}))`;

  // Φ node glow
  const phiGlow = flowed ? 0.4 + Math.min(0.6, absPhi * 0.15) : 0.2;
  nodePhi.style.filter = `drop-shadow(0 0 8px rgba(255,95,122,${phiGlow}))`;
}

function updateFlowVisual(A, L, Phi, flowed) {
  const arrow = document.getElementById("flow-arrow");
  const absPhi = Math.abs(Phi);

  // 太さ
  const baseHeight = 6;
  const newHeight = flowed ? baseHeight + Math.min(16, absPhi * 1.2) : baseHeight;
  arrow.style.height = `${newHeight}px`;

  // 透明度
  arrow.style.opacity = flowed ? Math.min(1, 0.2 + L) : 0.15;

  // 方向（A）
  const angle = Math.atan2(A[1], A[0]) * 180 / Math.PI;
  arrow.style.transform = `rotate(${angle}deg)`;

  // 速度（アニメーション周期）
  const baseDuration = 1.2;
  const duration = flowed ? Math.max(0.25, baseDuration / (1 + absPhi)) : 2.0;
  arrow.style.animationDuration = `${duration}s`;
}
