let canvas = document.getElementById('rootme-badge');

let ctx = canvas.getContext('2d');
ctx.msImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

let username = canvas.dataset.username ?? 'Aube-643003';
let points = canvas.dataset.pts ?? 0;

let bgColor = "#191c22";
let textColor = "#2688a6";
let logoUrl = "./images/rootme-logo.png";

ctx.fillStyle = bgColor;
ctx.fillRect(0, 0, canvas.width, canvas.height);

let logo = new Image();
logo.src = logoUrl;

logo.onload = () => {
  let logoWidth = 28;
  let logoHeight = 36;
  let padding = 10;

  ctx.drawImage(logo, padding, (canvas.height - logoHeight) / 2, logoWidth, logoHeight);
  ctx.drawImage(logo, canvas.width - logoWidth - padding, (canvas.height - logoHeight) / 2, logoWidth, logoHeight);

  ctx.fillStyle = textColor;
  ctx.font = "bold 12px Arial";
  ctx.textBaseline = "top";

  let textX = logoWidth + 3 * padding;
  let textY1 = 10;
  let textY2 = 30;

  ctx.fillText(username, textX, textY1);
  ctx.fillText(`${points} pts`, textX, textY2);

  ctx.lineWidth = 8;
  ctx.strokeStyle = "#888";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

};

logo.onerror = () => {
  console.error("Impossible de charger le logo !");
};


canvas.style.cursor = "pointer";
canvas.addEventListener('click', async function() {
  window.open("https://www.root-me.org/Aube-643003", "_blank");
});
