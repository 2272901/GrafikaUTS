export class CanvasHandler {
    constructor() {
        this.c_handler = null;
        this.ctx = null;
        this.image_data = null;
        this.boxes = [];
        this.expand = 0;
    }

    init_canvas(canvas_id) {
        this.c_handler = document.querySelector("#" + canvas_id);
        this.ctx = this.c_handler.getContext("2d");
        this.image_data = this.ctx.getImageData(0,0,this.c_handler.width,this.c_handler.height);

        this.c_handler.addEventListener('click', this.canvas_click.bind(this));
        // this.c_handler.addEventListener('dblclick', this.canvas_click2.bind(this));
    }

    canvas_click(e) {
        const rect = this.c_handler.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        console.log(mouseX, mouseY);
    }

    // canvas_click2(e) {
    //     const rect = this.c_handler.getBoundingClientRect();
    //     const mouseX = e.clientX - rect.left;
    //     const mouseY = e.clientY - rect.top;
    //     this.kotak(0,0,500,500,{r: 255, g:255, b:255});
    //     this.ctx.clearRect(0, 0, this.c_handler.width, this.c_handler.height);
    //     this.create_spiral(mouseX,mouseY,Math.floor(Math.random() * (10+this.expand))+(10+this.expand),
    //         {r:Math.floor(Math.random() * 255),g:Math.floor(Math.random() * 255),b:Math.floor(Math.random() * 255)});
    // }

    create_dot(x,y,color) {
        const index = (Math.round(x)  + Math.round(y) * this.c_handler.width)*4;
        
        this.image_data.data[index] = color.r;
        this.image_data.data[index+1] = color.g;
        this.image_data.data[index+2] = color.b;
        this.image_data.data[index+3] = 255;
        // this.ctx.putImageData(this.image_data,0,0);
    }

    create_line(x0,y0,x1,y1,color) {
        const dy = y1-y0;
        const dx = x1-x0;
        if(Math.abs(dx) >= Math.abs(dy)) {
            for(let i = 0;i < Math.abs(dx);i++) {
                
                if (x0 > x1) {
                    this.create_dot(x0-i,y0-(i*dy/dx),{r:color.r,g:color.g,b:color.b});
                } else {
                    this.create_dot(x0+i,y0+(i*dy/dx),{r:color.r,g:color.g,b:color.b});
                }
            }
        } else {
            for(let i = 0;i < Math.abs(dy);i++) {
                
                if (y0 > y1) {
                    this.create_dot(x0-(i*(1/(dy/dx))),y0-i,{r:color.r,g:color.g,b:color.b});
                } else {
                    this.create_dot(x0+(i*(1/(dy/dx))),y0+i,{r:color.r,g:color.g,b:color.b});
                }
            }
        }
        
    }

    polygon(arrayXY, color) {
        var point = arrayXY[0];

        for (var i = 1; i<arrayXY.length; i++) {
            var point2 = arrayXY[i];

            this.create_line(point.x, point.y, point2.x, point2.y, {r:color.r,g:color.g,b:color.b});
            point = point2;
        }
        this.create_line(point.x,point.y,arrayXY[0].x,arrayXY[0].y, {r:color.r,g:color.g,b:color.b});
        
        this.ctx.putImageData(this.image_data,0,0);
    }

    create_circle(x0,y0,r,color) {
        let x = x0;
        let y = y0;
        for(let theta = 0;theta < 2*Math.PI;theta += 0.001) {
            x = x0 + r*Math.cos(theta);
            y = y0 + r*Math.sin(theta);
            this.create_dot(x,y,color);
        }
        this.ctx.putImageData(this.image_data,0,0);
    }

    create_polygon(x0, y0, r, sides, color) {
        if (sides < 3) return;
        let angleIncrement = (2 * Math.PI) / sides;
        let vertices = [];
    
        for (let i = 0; i < sides; i++) {
            let theta = i * angleIncrement;
            let x = x0 + r * Math.cos(theta);
            let y = y0 + r * Math.sin(theta);
            vertices.push({x: x, y: y});
        }
    
        for (let i = 0; i < vertices.length; i++) {
            let start = vertices[i];
            let end = vertices[(i + 1) % vertices.length];
            this.create_line(start.x, start.y, end.x, end.y, color);
        }
    }

    create_spiral(x0,y0,r,color) {
        let x = x0;
        let y = y0;
        for(let theta = 0;theta < 2*r;theta += 0.001) {
            let r1 = theta*2;
            if (r1 <= r){
                x = x0 + (r1)*Math.cos(theta);
                y = y0 + (r1)*Math.sin(theta);
            }
            this.create_dot(x,y,color);
        }
        this.ctx.putImageData(this.image_data,0,0);
    }

    bunga(x0, y0, r, n, color) {
        let x = x0;
        let y = y0;
        for (let theta = 0; theta < 2 * Math.PI; theta += 0.001) {
            x = x0 + r * Math.cos(n * theta) * Math.cos(theta);
            y = y0 + r * Math.cos(n * theta) * Math.sin(theta);
            this.create_dot(x, y, color);
        }
        this.ctx.putImageData(this.image_data, 0, 0);
    }

    shapes(x0,y0,r,color) {
        let x = x0;
        let y = y0;
        for(let theta = 0;theta < 2*Math.PI;theta += 1) {
            x = x0 + r*Math.cos(theta);
            y = y0 + r*Math.sin(theta);
            let x1 = x - 
            this.create_line(x1,y1,x2,y2,color);
        }
        this.ctx.putImageData(this.image_data,0,0);
    }

    floodFillNaive(image_data, canvas, x, y, flood, color) {
        var ind = 4 * (x + y * canvas.width);

        var r1 = image_data.data[ind];
        var g1 = image_data.data[ind+1];
        var b1 = image_data.data[ind+2];

        console.log(r1,g1,b1);
        console.log(flood.r,flood.g,flood.b);
        if((r1 == flood.r) || (g1 == flood.g) || (b1 == flood.b)) {
            image_data.data[ind] = color.r;
            image_data.data[ind+1] = color.g;
            image_data.data[ind+2] = color.b;
            image_data.data[ind+3] = 255;

            this.floodFillNaive(image_data, canvas, x+1, y, flood, color);
            this.floodFillNaive(image_data, canvas, x-1, y, flood, color);
            this.floodFillNaive(image_data, canvas, x, y+1, flood, color);
            this.floodFillNaive(image_data, canvas, x, y-1, flood, color);
        }
        this.ctx.putImageData(this.image_data,0,0);
    }

    floodFillStack(image_data, canvas, x, y, flood, color) {
        var tumpukan = [];
        tumpukan.push({x:x, y:y});

        while(tumpukan.length > 0) {
            var titik = tumpukan.pop();
            var inde = 4 * (titik.x + titik.y * canvas.width);

            var r1 = image_data.data[inde];
            var g1 = image_data.data[inde+1];
            var b1 = image_data.data[inde+2];

            if((r1 == flood.r) && (g1 == flood.g) && (b1 == flood.b)) {
                image_data.data[inde] = color.r;
                image_data.data[inde+1] = color.g;
                image_data.data[inde+2] = color.b;
                image_data.data[inde+3] = 255;
    
                tumpukan.push({x:titik.x+1, y:titik.y});
                tumpukan.push({x:titik.x-1, y:titik.y});
                tumpukan.push({x:titik.x, y:titik.y+1});
                tumpukan.push({x:titik.x, y:titik.y-1});
            }
        }

        console.log(r1,g1,b1);
        console.log(flood.r,flood.g,flood.b);
        
        this.ctx.putImageData(this.image_data,0,0);
    }
    reset() {
        this.image_data = this.ctx.createImageData(this.c_handler.width, this.c_handler.height);
        this.ctx.putImageData(this.image_data, 0, 0);
    }
    
}
