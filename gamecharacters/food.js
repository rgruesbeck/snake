// Food
import Image from '../gameobjects/image';

class Food extends Image {
    constructor(ctx, image, c, r, grid) {
        super(ctx, image, c * grid.cellSize, r * grid.cellSize, grid.cellSize, grid.cellSize, 5);

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

    static appear(ctx, image, grid) {
        let randC = Math.floor(Math.random() * grid.numCols);
        let randR = Math.floor(Math.random() * grid.numRows);

        return new Food(ctx, image, randC, randR, grid);
    }
}

export default Food;