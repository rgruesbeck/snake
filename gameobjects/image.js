// Image base

class Image {
    constructor(ctx, image, x, y, w, h, s) {
        this.ctx = ctx;
        this.image = image;

        this.x = x || 0;
        this.y = y || 0;

        this.cx = x + (w/2);
        this.cy = y + (h/2);

        this.width = w;
        this.height = h;

        this.radius = (w + h) / 4;

        this.speed = s || 1;

        this.moving = false;

        this.direction = 'right';

        this.bounds = { top: -100, right: this.ctx.canvas.width + 100, bottom: this.ctx.canvas.height + 100, left: -100 };
    }

    move(x, y, m) {
        let dx = x === 0 ? this.x : this.x + (x * this.speed * m);
        let dy = y === 0 ? this.y : this.y + (y * this.speed * m);
        
        this.setX(dx);
        this.setY(dy);
    }

    moveToCell(frame, grid) {
        let dx = this.c * grid.cellSize;
        let dy = this.r * grid.cellSize;

        let m = this.speed * frame.scale;
        let closeX = Math.abs(dx - this.x) < m;
        let closeY = Math.abs(dy - this.y) < m;


        if (closeX && closeY) {
            this.moving = false;

            this.setX(dx);
            this.setY(dy);
        } else {
            this.moving = true;

            if (this.x < dx) {
                this.move(1, 0, frame.scale);
            }

            if (this.x > dx) {
                this.move(-1, 0, frame.scale);
            }

            if (this.y < dy) {
                this.move(0, 1, frame.scale);
            }

            if (this.y > dy) {
                this.move(0, -1, frame.scale);
            }
        }

    }

    draw() {
        this.ctx.save();
        let scaleX = 1;
        let posX = this.x;
        let trX = 0;

        if (this.direction === 'right') {
            scaleX = -1;
            posX = -1 * this.x;
            trX = this.width;
        }

        this.ctx.translate(trX, 0);
        this.ctx.scale(scaleX, 1);

        this.ctx.drawImage(this.image, posX, this.y, this.width, this.height);

        this.ctx.restore();
    }

    setX(x) {
        // apply x bounds
        let inBoundsX = x >= this.bounds.left && x <= this.bounds.right;
        if (!inBoundsX) { return; }

        // set the new x possition 
        this.x = x;

        // set the new center y position
        this.cx = this.x + (this.width/2);
    }

    setY(y) {
        // apply y bounds
        let inBoundsY = y >= this.bounds.top && y <= this.bounds.bottom;
        if (!inBoundsY) { return; }

        // set the new y possition 
        this.y = y;

        // set the new center y position
        this.cy = this.y + (this.height/2);
    }

    setC(c, g) {
        // apply col bounds
        let inBoundsC = c < g.numCols && c >= 0;
        if (!inBoundsC) { return; }

        this.c = c;

        // let x = c * g.cellSize;
        // this.setX(x);
    }

    setR(r, g) {
        // apply row bounds
        let inBoundsR = r < g.numRows && r >= 0;
        if (!inBoundsR) { return; }

        this.r = r;

        // let y = r * g.cellSize;
        // this.setY(y);
    }

    setBounds(bounds) {
        this.bounds = {
            ...this.bounds,
            ...bounds,
            ...{
                right: bounds.right - this.width,
                bottom: bounds.bottom - this.height
            }
        }
    }
}

export default Image;