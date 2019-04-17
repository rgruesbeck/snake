// Snake
import Image from '../gameobjects/image';

class Snake {
    constructor(ctx, headImage, tailImage, x, y, w, h, s) {
        this.ctx = ctx;
        
        this.head = new Image(this.ctx, headImage, x, y, w, h, s);
        this.tail = new Image(this.ctx, tailImage, x, y+(h/2), 60, 60, s);
        this.body = [];
    }

    eat(foodImage) {
        console.log('eat');
        // eat food
        // add new segment to body
    }

    hit() {
        console.log('hit');
        // remove some food
    }

    move(x, y, m) {
        this.head.move(x, y, m);

        this.tail.move(x, y, m);
    }

    draw() {
        this.head.draw();
        this.tail.draw();
    }

    setBounds(bounds) {
        this.head.setBounds(bounds);
    }

    // collides with food
    // collides with body
    // collides with edge
}

export default Snake;