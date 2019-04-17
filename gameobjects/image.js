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

        this.direction = { x: 'left', y: 'up' };

        this.bounds = { top: -100, right: this.ctx.canvas.width + 100, bottom: this.ctx.canvas.height + 100, left: -100 };
    }

    move(x, y, m) {
        let dx = x === 0 ? this.x : this.x + (x * this.speed * m);
        let dy = y === 0 ? this.y : this.y + (y * this.speed * m);
        
        // apply bounds
        let inBoundsX = dx >= this.bounds.left && dx <= this.bounds.right;
        if (inBoundsX) { this.setX(dx); }

        let inBoundsY = dy >= this.bounds.top && dy <= this.bounds.bottom;
        if (inBoundsY) { this.setY(dy); }

        // set direction
        if (x > 0) { this.direction.x = 'right'; }
        if (x < 0) { this.direction.x = 'left'; }
        if (y > 0) { this.direction.y = 'down'; }
        if (y < 0) { this.direction.y = 'up'; }
    }

    setX(x) {
        this.x = x;
        this.cx = this.x + (this.width/2);
    }

    setY(y) {
        this.y = y;
        this.cy = this.y + (this.height/2);
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
}

export default Image;