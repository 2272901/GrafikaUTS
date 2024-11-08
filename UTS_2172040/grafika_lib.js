function gbr_titik(imageDataTemp, x, y, r, g, b){
    var index;
    index = 4 * (Math.round(x) + (Math.round(y) * canvasKita.width));
    imageDataTemp.data[index] = r;
    imageDataTemp.data[index + 1] = g;
    imageDataTemp.data[index + 2] = b;
    imageDataTemp.data[index + 3] = 255;
}

function dda_line(imageData, x1, y1, x2, y2, r, g, b){
    var dx = x2 - x1; //bisa positif atau negatif
    var dy = y2 - y1; //bisa positif atau negatif

    if (Math.abs(dx) > Math.abs(dy)){
        //jalan di X
        if (x2 > x1){
            //Jalan ke kanan
            var y = y1;
            for(var x = x1; x<x2; x++){
                y = y + dy/Math.abs(dx);
                gbr_titik(imageData, x, y, r, g ,b);
            }
        }
        else{
        // Jalan ke kiri
            var y = y1;
            for(var x = x1; x>x2; x--){
                y = y + dy/Math.abs(dx);
                gbr_titik(imageData, x, y, r, g ,b);
            }
        }
    }
    else{
        if (y2 > y1){
            //Jalan ke kanan
            var x = x1;
            for(var y = y1; y<y2; y++){
                x = x + dx/Math.abs(dy);
                gbr_titik(imageData, x, y, r, g ,b);
            }
        }
        else{
            var x = x1;
            for(var y = y1; y>y2; y--){
                x = x + dx/Math.abs(dy);
                gbr_titik(imageData, x, y, r, g ,b);
            }
        }
    }
}

function gbr_lingkaran(imageDataTemp, xc, yc, radius, r, g, b){
    // jalan dari xc-radius sampai dengan xc+radius
    for (var x = xc-radius; x < xc+radius; x++){
        //akar positif
        var y = yc + Math.sqrt(Math.pow(radius, 2) - Math.pow((x-xc), 2)); // akar dari r2 - (x-xc)2
        gbr_titik(imageDataTemp, Math.ceil(x), Math.ceil(y), r, g ,b);
        //akar negatif
        var y = yc - Math.sqrt(Math.pow(radius, 2) - Math.pow((x-xc), 2)); 
        gbr_titik(imageDataTemp, Math.ceil(x), Math.ceil(y), r, g ,b);
    }

    // jalan dari yc-radius sampai dengan yc+radius
    for (var x = xc-radius; x < xc+radius; x++){
        //akar positif
        var y = yc + Math.sqrt(Math.pow(radius, 2) - Math.pow((x-xc), 2)); // akar dari r2 - (x-xc)2
        gbr_titik(imageDataTemp, Math.ceil(y), Math.ceil(x), r, g ,b);
        //akar negatif
        var y = yc - Math.sqrt(Math.pow(radius, 2) - Math.pow((x-xc), 2)); 
        gbr_titik(imageDataTemp, Math.ceil(y), Math.ceil(x), r, g ,b);
    }
}

function lingkaran_polar(imageDataTemp, xc, yc, radius, r, g, b){
    for (var theta = 0; theta < Math.PI*2; theta += 0.01){
        x = xc+radius * Math.cos(theta);
        y = yc+radius * Math.sin(theta);

        gbr_titik(imageDataTemp, Math.ceil(x), Math.ceil(y), r, g ,b);
    }
}

function elipse_polar(imageDataTemp, xc, yc, radiusX, radiusY, r, g, b){
    for (var theta = 0; theta < Math.PI*2; theta += 0.01){
        x = xc+radiusX * Math.cos(theta);
        y = yc+radiusY * Math.sin(theta);

        gbr_titik(imageDataTemp, Math.ceil(x), Math.ceil(y), r, g ,b);
    }
}

function spiral_polar(imageDataTemp, xc, yc, radius, r, g, b){
    for (var theta = 0; theta < 6*Math.PI; theta += 0.01){
        radius = 5 * theta;
        x = xc+radius * Math.cos(theta);
        y = yc+radius * Math.sin(theta);

        gbr_titik(imageDataTemp, Math.ceil(x), Math.ceil(y), r, g ,b);
    }
}

function hati_polar(imageDataTemp, xc, yc, radius, r, g, b){
    for (var theta = 0; theta < Math.PI*2; theta += 0.01){
        x = xc + (radius + radius*Math.sin(theta)) * Math.cos(theta);
        y = yc + (radius + radius*Math.sin(theta)) * Math.sin(theta);

        gbr_titik(imageDataTemp, Math.ceil(x), Math.ceil(y), r, g ,b);
    }
}

function polyline (imageDataTemp, point_array, r, g , b){
    var point = point_array[0];
    dda_line(imageDataTemp, point.x, point.y, 150, 100, 255, 0, 0);

    for(var i = 1; i < point_array.length; i++){
        var point_2 = point_array[i];

    dda_line(imageDataTemp, point.x, point.y, point_2.x, point_2.y, r, g, b);
    point = point_2;
    }
}

function polygon (imageDataTemp, point_array, r, g, b){
    var point = point_array[0];

    for(var i = 1; i < point_array.length; i++){
        var point_2 = point_array[i];

        dda_line(imageDataTemp, point.x, point.y, point_2.x, point_2.y, r, g, b);
        point = point_2;
    }
    dda_line(imageDataTemp, point.x, point.y, point_array[0].x, point_array[0].y, r, g, b);
}

function floodFillNaive(imageDataTemp, canvas, x, y, toFlood, color){
    var index = 4 * (x + (y * canvasKita.width));

    var r1 = imageDataTemp.data[index];
    var g1 = imageDataTemp.data[index + 1];
    var b1 = imageDataTemp.data[index + 2];

    if((r1 == toFlood.r) && (g1 == toFlood.g) && (b1 == toFlood.b)){
        imageDataTemp.data[index] = color.r;
        imageDataTemp.data[index + 1] = color.g;
        imageDataTemp.data[index + 2] = color.b;
        imageDataTemp.data[index + 3] = 255;

    floodFillNaive(imageDataTemp, canvas, x + 1, y, toFlood, color);
    floodFillNaive(imageDataTemp, canvas, x, y + 1, toFlood, color);
    floodFillNaive(imageDataTemp, canvas, x - 1, y, toFlood, color);
    floodFillNaive(imageDataTemp, canvas, x, y - 1, toFlood, color);
}
}

function floodFillStack(imageDataTemp, canvas, x0, y0, toFlood, color){
    var index = 4 * (x0 + (y0 * canvasKita.width));

    var r1 = imageDataTemp.data[index];
    var g1 = imageDataTemp.data[index + 1];
    var b1 = imageDataTemp.data[index + 2];

    var tumpukan = [];
    tumpukan.push({x:x0, y:y0});

    while(tumpukan.length > 0) {
        var titik_sekarang = tumpukan.pop();
        var index_sekarang = index = 4 * (titik_sekarang.x + (titik_sekarang.y * canvasKita.width));
    
        var r1 = imageDataTemp.data[index_sekarang];
        var g1 = imageDataTemp.data[index_sekarang + 1];
        var b1 = imageDataTemp.data[index_sekarang + 2];
    
        if((r1 == toFlood.r) && (g1 == toFlood.g) && (b1 == toFlood.b)){
            imageDataTemp.data[index_sekarang] = color.r;
            imageDataTemp.data[index_sekarang + 1] = color.g;
            imageDataTemp.data[index_sekarang + 2] = color.b;
            imageDataTemp.data[index_sekarang + 3] = 255;
    
        tumpukan.push({x: titik_sekarang.x + 1, y: titik_sekarang.y});
        tumpukan.push({x: titik_sekarang.x - 1, y: titik_sekarang.y});
        tumpukan.push({x: titik_sekarang.x, y: titik_sekarang.y + 1});
        tumpukan.push({x: titik_sekarang.x, y: titik_sekarang.y - 1});
    }
    }

    
}
