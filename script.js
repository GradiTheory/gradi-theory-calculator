function updateDiagram(U, L) {
  const phi = Math.abs(U) * L;
  const direction = U >= 0 ? 1 : -1;

  // 結果表示
  document.getElementById("phiValue").textContent = phi.toFixed(2);
  document.getElementById("direction").textContent = direction === 1 ? "→" : "←";

  // Φ 矢印の長さ（スケール調整）
  const baseX = 640;
  const maxLen = 300;
  const len = Math.min(phi * 0.1, maxLen) * direction;
  const x2 = baseX + len;

  const phiLine = document.getElementById("phi-line");
  const phiArrow = document.getElementById("phi-arrow");

  phiLine.setAttribute("x2", x2);

  // 矢印先端
  const head = `${x2},200`;
  const p1 = `${x2 - 20 * direction},185`;
  const p2 = `${x2 - 20 * direction},215`;
  phiArrow.setAttribute("points", `${head} ${p1} ${p2}`);
}

function calc() {
  const U = parseFloat(document.getElementById("inputU").value || 0);
  const L = parseFloat(document.getElementById("inputL").value || 0);
  updateDiagram(U, L);
}

document.getElementById("calcBtn").addEventListener("click", calc);

// 初期表示
calc();
