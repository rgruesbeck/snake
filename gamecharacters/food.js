// Food
import Image from '../gameobjects/image';

class Food extends Image {
    constructor(ctx, image, c, r, w, h, s, grid) {
        super(ctx, image, c * grid.cellSize, r * grid.cellSize, w, h, s);

        this.c = c;
        this.r = r;

        this.id = Math.random().toString(16).slice(2);
        this.bounce = (Math.random() * 5) + 5;
    }

    /*
    draw() {
        // let dy = 0.5 * Math.cos(count / this.bounce);

        // this.move(0, dy, scale);
        super.draw();
    }
    */

    static appear(ctx, image, w, h, grid) {
        let randC = Math.floor(Math.random() * grid.numCols);
        let randR = Math.floor(Math.random() * grid.numRows);

        return new Food(ctx, image, randC, randR, w, h, 1, grid);
    }
}

export default Food;