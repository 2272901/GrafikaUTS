import { CanvasHandler } from './lib.js';
import { MatrixUtility } from './matrix.js';

const handler = new CanvasHandler();
handler.init_canvas('mycanvas');

const resetButton = document.getElementById('reset-btn');
const confirmButton = document.getElementById('confirm-btn');

resetButton.addEventListener('click', function() {
    location.reload();
});

confirmButton.addEventListener('click', function() {
    window.location.href = 'blank.html';
});

var arr1 = [
    {x:160,y:220},
    {x:160,y:280},
    {x:280,y:280},
    {x:280,y:220}
];
handler.polygon(arr1,{r:255,g:0,b:0});

var arr2 = [
    {x:230,y:250},
    {x:221.21,y:271.21},
    {x:200,y:280},
    {x:178.79,y:271.21},
    {x:170,y:250},
    {x:178.79,y:228.79},
    {x:200,y:220},
    {x:221.21,y:228.79}
];
handler.polygon(arr2,{r:255,g:0,b:0});

var arr3 = [
    {x:200,y:240},
    {x:300,y:240},
    {x:300,y:260},
    {x:200,y:260}
];
handler.polygon(arr3,{r:255,g:0,b:0});

let bullet = null;
const bulletSpeed = 15;
let bulletActive = false;
let cannonAngle = 0;

document.addEventListener('keydown', function(event) {
    const moveIncrement = 8;
    let angleIncrement = 0;
    let translation = { x: 0, y: 0 };

    if (event.code === 'KeyW') {
        translation.y = -moveIncrement;
    } else if (event.code === 'KeyS') {
        translation.y = moveIncrement;
    } else if (event.code === 'KeyA') {
        translation.x = -moveIncrement;
    } else if (event.code === 'KeyD') {
        translation.x = moveIncrement;
    } else if (event.code === 'KeyQ') { 
        angleIncrement -= 1 / 2;
    } else if (event.code === 'KeyE') {
        angleIncrement += 1 / 2;
    }

    if (event.code === 'Space') {
        if (!bulletActive) {
            const tipX = (arr3[1].x + arr3[2].x) / 2;
            const tipY = (arr3[1].y + arr3[2].y) / 2;

            bullet = [
                {x: tipX, y: tipY + 5},
                {x: tipX - 10, y: tipY + 5},
                {x: tipX - 10, y: tipY - 5},
                {x: tipX, y: tipY - 5}
            ];
            bulletActive = true;
            animateBullet();
        }
    }

    if (angleIncrement !== 0) {
        const center = calculateCenter(arr2);
        let rotationMatrix = MatrixUtility.createFixedPointRotationMatrix(center, Math.PI / 8 * angleIncrement);
        arr3 = MatrixUtility.transformPoints(arr3, rotationMatrix);
        cannonAngle += Math.PI / 8 * angleIncrement;
    }

    if (translation.x !== 0 || translation.y !== 0) {
        arr1 = MatrixUtility.transformPoints(arr1, MatrixUtility.createTranslationMatrix(translation.x, translation.y));
        arr2 = MatrixUtility.transformPoints(arr2, MatrixUtility.createTranslationMatrix(translation.x, translation.y));
        arr3 = MatrixUtility.transformPoints(arr3, MatrixUtility.createTranslationMatrix(translation.x, translation.y));
    }

    drawScene();
});

let squareContents = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const hitNum = document.getElementById('num');

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function square0() {
    for (let i = 0; i < 10; i++) {
        squareContents[i] = i;
    }
}

function drawDices() {
    const squareSize = 48;
    const padding = 2;
    const circleRadius = 2;

    for (let i = 0; i < 10; i++) {
        const x = handler.c_handler.width - squareSize - padding;
        const y = i * (squareSize + padding);

        handler.polygon([
            {x:x, y:y},
            {x:x + squareSize, y:y},
            {x:x + squareSize, y:y + squareSize},
            {x:x, y:y + squareSize}
        ], {r:0, g:255, b:255});

        const circles = getCirclesInSquare(squareContents[i]);
        if (circles.length > 0) {
            const rows = Math.ceil(circles.length / 3);
            const cols = Math.min(circles.length, 3);

            const centerX = x + squareSize / 2;
            const centerY = y + squareSize / 2;

            const horizontalSpacing = (squareSize - (cols * circleRadius * 2)) / (cols + 1);
            const verticalSpacing = (squareSize - (rows * circleRadius * 2)) / (rows + 1);

            for (let j = 0; j < circles.length; j++) {
                const row = Math.floor(j / 3);
                const col = j % 3;

                const circleX = x + (col + 1) * horizontalSpacing + col * circleRadius * 2;
                const circleY = y + (row + 1) * verticalSpacing + row * circleRadius * 2;

                handler.create_circle(circleX, circleY, circleRadius, {r:0, g:0, b:0});
            }
        }
    }
}

var number = "";

function animateBullet() {
    if (bullet && bulletActive) {
        bullet = MatrixUtility.transformPoints(bullet, MatrixUtility.createTranslationMatrix(
            bulletSpeed * Math.cos(cannonAngle),
            bulletSpeed * Math.sin(cannonAngle)
        ));

        if (bullet[0].x > handler.c_handler.width || bullet[0].x < 0 || bullet[0].y < 0 || bullet[0].y > handler.c_handler.height) {
            bullet = null;
            bulletActive = false;
        }

        for (let i = 0; i < 10; i++) {
            if (checkCollisionWithSquare(i, bullet)) {
                console.log(squareContents[i]);
                number += `${squareContents[i]}`;
                hitNum.innerHTML = `Is this your number? ${number}`;

                shuffleArray(squareContents);

                bulletActive = false;
                break;
            }
        }

        drawScene();

        if (bulletActive) {
            requestAnimationFrame(animateBullet);
        }
    }
}

function checkCollisionWithSquare(squareIndex, bullet) {
    const squareSize = 48;
    const padding = 2;
    const x = handler.c_handler.width - squareSize - padding;
    const y = squareIndex * (squareSize + padding);

    for (let i = 0; i < bullet.length; i++) {
        const bx = bullet[i].x;
        const by = bullet[i].y;

        if (bx>=x && bx<=x+squareSize && by>=y && by<=y + squareSize) {
            return true;
        }
    }

    return false;
}

square0();

function drawScene() {
    handler.reset();

    handler.polygon(arr3, {r:255, g:0, b:0});
    handler.polygon(arr1, {r:255, g:0, b:0});
    handler.polygon(arr2, {r:255, g:0, b:0});

    if (bulletActive && bullet) {
        handler.polygon(bullet, {r:0, g:0, b:255});
    }

    drawDices();
}

function getCirclesInSquare(number) {
    const circleCounts = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9
    ];
    return Array.from({length: circleCounts[number]}, (_, index) => index);
}

function calculateCenter(points) {
    let sum = {x:0, y:0};

    for (let i = 0; i < points.length; i++) {
        sum.x += points[i].x;
        sum.y += points[i].y;
    }

    return {
        x:sum.x / points.length,
        y:sum.y / points.length
    };
}

function animate(currentTime) {
    handler.ctx.clearRect(0, 0, handler.c_handler.width, handler.c_handler.height);
    drawScene();
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
