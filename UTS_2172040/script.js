let canvasKita = document.querySelector("#canvas1");
let ctx = canvasKita.getContext("2d");
let poin = 0;
let stateGlob = true;
let point_lingkaran = { x: 50, y: 200 };
let panah = false;

function gbr_titik(imageDataTemp, x, y, r, g, b) {
  let index = 4 * (Math.ceil(x) + Math.ceil(y) * canvasKita.width);
  imageDataTemp.data[index] = r;
  imageDataTemp.data[index + 1] = g;
  imageDataTemp.data[index + 2] = b;
  imageDataTemp.data[index + 3] = 255;
}

function polygon(imageDataTemp, titiks, r, g, b) {
  let point = titiks[0];
  for (let i = 1; i < titiks.length; i++) {
    let point_2 = titiks[i];
    dda_line(imageDataTemp, point.x, point.y, point_2.x, point_2.y, r, g, b);
    point = point_2;
  }
  dda_line(imageDataTemp, point.x, point.y, titiks[0].x, titiks[0].y, r, g, b);
}

function dda_line(imageData, x1, y1, x2, y2, r, g, b) {
  let dx = x2 - x1;
  let dy = y2 - y1;

  if (Math.abs(dx) > Math.abs(dy)) {
    let y = y1;
    if (x2 > x1) {
      for (let x = x1; x < x2; x++) {
        y = y + dy / Math.abs(dx);
        gbr_titik(imageData, x, y, r, g, b);
      }
    } else {
      for (let x = x1; x > x2; x--) {
        y = y + dy / Math.abs(dx);
        gbr_titik(imageData, x, y, r, g, b);
      }
    }
  } else {
    let x = x1;
    if (y2 > y1) {
      for (let y = y1; y < y2; y++) {
        x = x + dx / Math.abs(dy);
        gbr_titik(imageData, x, y, r, g, b);
      }
    } else {
      for (let y = y1; y > y2; y--) {
        x = x + dx / Math.abs(dy);
        gbr_titik(imageData, x, y, r, g, b);
      }
    }
  }
}

function translasi(titik_lama, T) {
  let x_baru = titik_lama.x + T.x;
  let y_baru = titik_lama.y + T.y;
  return { x: x_baru, y: y_baru };
}

function translasi_array(array_titik, T) {
  let array_hasil = [];
  for (let i = 0; i < array_titik.length; i++) {
    let temp = translasi(array_titik[i], T);
    array_hasil.push(temp);
  }
  return array_hasil;
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(point_lingkaran.x, point_lingkaran.y, 10, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
}

function rintangan() {
  let imageDataSaya = ctx.getImageData(0, 0, canvasKita.width, canvasKita.height);
  let tinggi = Math.floor(Math.random() * 100 + 300);

  let point_array = [
    { x: 950, y: tinggi },
    { x: 980, y: tinggi },
    { x: 980, y: 600 },
    { x: 950, y: 600 },
  ];
  polygon(imageDataSaya, point_array, 0, 128, 0);

  let tinggi2 = Math.floor(Math.random() * 150 + 100);
  let point_array2 = [
    { x: 950, y: 0 },
    { x: 980, y: 0 },
    { x: 980, y: tinggi2 },
    { x: 950, y: tinggi2 },
  ];
  polygon(imageDataSaya, point_array2, 0, 128, 0);

  ctx.putImageData(imageDataSaya, 0, 0);
  drawBall();
  requestAnimationFrame(function () {
    gerak(imageDataSaya, point_array, point_array2);
  });
}

function gerak(imageDataSaya, point_array, point_array2) {
  let state = true;
  ctx.clearRect(0, 0, canvasKita.width, canvasKita.height);

  imageDataSaya = ctx.getImageData(0, 0, canvasKita.width, canvasKita.height);
  point_array = translasi_array(point_array, { x: -15, y: 0 });
  polygon(imageDataSaya, point_array, 255, 99, 71);

  point_array2 = translasi_array(point_array2, { x: -15, y: 0 });
  polygon(imageDataSaya, point_array2, 0, 128, 255);

  ctx.putImageData(imageDataSaya, 0, 0);
  drawBall();

  if (point_array[0].x < 56) {
    if (point_lingkaran.y < point_array2[3].y || point_lingkaran.y > point_array[1].y) {
      document.querySelector("#kalah").innerHTML = "Kalah";
      clearInterval(interval);
      stateGlob = false;
      alert("Nomor anda yang terdaftar adalah: "+ Math.ceil(poin))
    } else {
      poin += 1/5;
      document.querySelector("#nilai").innerHTML = Math.ceil(poin);
    }
  }

  panah = false;
  if (!panah) {
    point_lingkaran = translasi(point_lingkaran, { x: 0, y: 2 });
  }

  if (point_array[0].x < 0 || point_array2[0].x < 0) {
    state = false;
  }

  if (state == true && stateGlob == true) {
    requestAnimationFrame(function () {
      gerak(imageDataSaya, point_array, point_array2);
    });
  }
}

document.onkeydown = function (event) {
  switch (event.key) {
    case "ArrowUp":
      point_lingkaran = translasi(point_lingkaran, { x: 0, y: -30 });
      panah = true;
      break;
  }
};

let interval = setInterval(rintangan, 1000);
