import { CanvasHandler } from './lib.js';

const handler = new CanvasHandler();
handler.init_canvas('mycanvas');

var cursorShape = [
    {x:160, y:220},
    {x:160, y:233},
    {x:163, y:230},
    {x:165, y:235},
    {x:167, y:234},
    {x:165, y:229},
    {x:169.5, y:229}
];

var square = [
    {x:160, y:200},
    {x:200, y:200},
    {x:200, y:160},
    {x:160, y:160}
];

let fallingCursors = [];
let squareMoves = 0;

function cursor0(x, y) {
    const translatedShape = cursorShape.map(point => ({x:point.x + x-160, y:point.y + y-220}));
    return translatedShape;
}

function cursorFall() {
    const x = Math.random() * handler.c_handler.width;
    const y = 0;
    const speed = 1 + Math.random() * 3;
    const dx = (Math.random() - 0.5) * 2;
    const dy = speed;

    fallingCursors.push({shape: cursor0(x, y), dx:dx, dy:dy});
}

function moveSquare() {
    const maxX = handler.c_handler.width - 40;
    const maxY = handler.c_handler.height - 40;
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    square = [
        {x:randomX, y:randomY},
        {x:randomX + 40, y:randomY},
        {x:randomX + 40, y:randomY - 40},
        {x:randomX, y:randomY - 40}
    ];
}

function clickBox(point, polygon) {
    let inside = false;
    for (let i=0, j=polygon.length - 1; i<polygon.length; j=i++) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;

        const intersect = ((yi > point.y) !== (yj > point.y)) && (point.x < (xj-xi) * (point.y - yi) / (yj-yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

function animateRain() {
    handler.reset();

    for (let i = 0; i < fallingCursors.length; i++) {
        let cursor = fallingCursors[i];

        cursor.shape = cursor.shape.map(point => ({
            x: point.x + cursor.dx,
            y: point.y + cursor.dy
        }));

        handler.polygon(cursor.shape, { r: 0, g: 0, b: 0 });

        if (cursor.shape[0].y > handler.c_handler.height || cursor.shape[0].x < 0 || cursor.shape[0].x > handler.c_handler.width) {
            fallingCursors.splice(i, 1);
            i--;
        }
    }

    if (Math.random() < 0.3) cursorFall();

    handler.polygon(square, {r:0, g:0, b:255});

    requestAnimationFrame(animateRain);
}

handler.c_handler.addEventListener('click', (e) => {
    const rect = handler.c_handler.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (clickBox({ x: mouseX, y: mouseY }, square)) {
        if (squareMoves < 5) {
            moveSquare();
            squareMoves++;
        } else {
            window.open('blank.html', '_blank');
        }

        if (squareMoves >= 3) {
            document.body.style.cursor = 'none';
        }
    }
});


animateRain();
