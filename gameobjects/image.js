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

        this.direction = { current: 'right', x: 'right', y: 'up' };

        this.bounds = { top: -100, right: this.ctx.canvas.width + 100, bottom: this.ctx.canvas.height + 100, left: -100 };
    }

    move(x, y, m) {
        let dx = x === 0 ? this.x : this.x + (x * this.speed * m);
        let dy = y === 0 ? this.y : this.y + (y * this.speed * m);
        
        this.setX(dx);
        this.setY(dy);
        this.setDirection(x, y);
    }

    draw() {
        this.ctx.save();
        let scaleX = 1;
        let posX = this.x;
        let trX = 0;

        if (this.direction.x === 'right') {
            scaleX = -1;
            posX = -1 * this.x;
            trX = this.width;
        }

        this.ctx.translate(trX, 0);
        this.ctx.scale(scaleX, 1);

        this.ctx.drawImage(this.image, posX, this.y, this.width, this.height);

        this.ctx.restore();
    }

    setDirection(x, y) {
        // set direction
        if (x > 0) { this.setDirection('right'); }
        if (x < 0) { this.setDirection('left'); }
        if (y > 0) { this.setDirection('down'); }
        if (y < 0) { this.setDirection('up'); }
    }

    setX(x) {
        // apply bounds
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

    setDirection(direction) {
        this.direction = {
            current: direction,
            x: /right|left/.test(direction) ? direction : this.direction.x,
            y: /up|down/.test(direction) ? direction : this.direction.y
        };
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