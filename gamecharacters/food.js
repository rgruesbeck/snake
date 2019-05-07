// Food
import Image from '../gameobjects/image';

class Food extends Image {
    constructor({ ctx, image, col, row, grid, bounds }) {
        super(ctx, image, col * grid.cellSize, row * grid.cellSize, grid.cellSize, grid.cellSize, 5, bounds);

        this.c = col;
        this.r = row;

        this.id = Math.random().toString(16).slice(2);
    }

    /* fancy bouncing animation
    draw() {
        // let dy = 0.5 * Math.cos(count / this.bounce);

        // this.move(0, dy, scale);
        super.draw();
    }
    */

    static appear(ctx, image, location, grid, bounds) {
        return new Food({
            ctx,
            image,
            col: location.c,
            row: location.r,
            grid,
            bounds
        });
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