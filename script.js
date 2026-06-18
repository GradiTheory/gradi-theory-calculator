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

  phiLine.setAttribute("x1", baseX);
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

function applyPreset(type) {
  let U = 0;
  let L = 0;
  let uDesc = "";
  let lDesc = "";
  let uUnit = "";
  let lUnit = "";

  switch (type) {
    case 'electric':
      U = 100;
      L = 0.5;
      uDesc = "電位差（Voltage difference）";
      lDesc = "導電率（Electrical conductivity）";
      uUnit = "V（ボルト）";
      lUnit = "S/m（ジーメンス毎メートル）";
      break;

    case 'heat':
      U = 30;
      L = 1.2;
      uDesc = "温度差（Temperature gradient）";
      lDesc = "熱伝導率（Thermal conductivity）";
      uUnit = "K（ケルビン）";
      lUnit = "W/(m·K)";
      break;

    case 'diffusion':
      U = 10;
      L = 0.8;
      uDesc = "濃度差（Concentration gradient）";
      lDesc = "拡散係数（Diffusion coefficient）";
      uUnit = "mol/m³";
      lUnit = "m²/s";
      break;

    case 'behavior':
      U = 5;
      L = 2.0;
      uDesc = "意欲差（Motivation gradient）";
      lDesc = "行動しやすさ（Behavioral ease）";
      uUnit = "（無次元）";
      lUnit = "（無次元）";
      break;

    case 'information':
      U = 20;
      L = 1.5;
      uDesc = "情報量の差（Information gradient）";
      lDesc = "伝わりやすさ（Transmission ease）";
      uUnit = "bit";
      lUnit = "（無次元）";
      break;
  }

  document.getElementById("inputU").value = U;
  document.getElementById("inputL").value = L;

  document.getElementById("uDesc").textContent = uDesc;
  document.getElementById("lDesc").textContent = lDesc;
  document.getElementById("uUnit").textContent = uUnit;
  document.getElementById("lUnit").textContent = lUnit;

  updateDiagram(U, L);
}

document.getElementById("calcBtn").addEventListener("click", calc);

// 初期表示
calc();
