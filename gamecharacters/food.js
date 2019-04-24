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

    /* fancy bouncing animation
    draw() {
        // let dy = 0.5 * Math.cos(count / this.bounce);

        // this.move(0, dy, scale);
        super.draw();
    }
    */

    static appear(ctx, image, location, grid) {
        return new Food(ctx, image, location.c, location.r, grid);
    }

    static pickLocation(grid, invalidLocations) {
        let location = {
            c: Math.floor(Math.random() * grid.numCols),
            r: Math.floor(Math.random() * grid.numRows)
        };

        let id = ''.concat(location.c, location.r);
        
        if (!invalidLocations.includes(id)) {
            return location;
        } else {
            return Food.pickLocation(grid, invalidLocations);
        }
    }
}

export default Food;