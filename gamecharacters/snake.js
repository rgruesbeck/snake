// Snake

import Image from '../gameobjects/image';

class Snake {
    constructor(ctx, headImage, c, r, grid, speed) {
        this.ctx = ctx;

        this.c = c;
        this.r = r;

        this.x = c * grid.cellSize;
        this.y = r * grid.cellSize;

        this.direction = 'right';

        this.speed = speed;

        this.head = new Image(this.ctx, headImage, this.x, this.y, grid.cellSize, grid.cellSize, this.speed);
        this.head.c = c;
        this.head.r = r;

        this.body = [];

    }

    // eat food
    eat(foodItem, g) {
        // set speed of foodItem
        foodItem.speed = this.speed;

        // set new food item behind head
        if (this.direction === 'up') {
            foodItem.setR(this.head.r + 1, g);
        }

        if (this.direction === 'down') {
            foodItem.setR(this.head.r - 1, g);
        }

        if (this.direction === 'right') {
            foodItem.setC(this.head.c - 1, g);
        }

        if (this.direction === 'left') {
            foodItem.setC(this.head.c + 1, g);
        }

        // add new food to the body
        this.body = [
            ...this.body,
            foodItem
        ];
    }

    move(dc, dr, direction, g) {
        // don't run if head is still moving
        if (this.head.moving) {
            return;
        }

        // set direction
        this.direction = direction;
        this.head.direction = direction;

        // get next cell
        let nextC = this.head.c + dc;
        let nextR = this.head.r + dr;
        let neck = this.body[0];

        // snake can't double back
        if (neck && nextR === neck.r && nextC === neck.c) {
            return;
        }

        // update positions of each segment
        this.updateBody(g);

        // update cell position
        this.head.setC(nextC, g);
        this.head.setR(nextR, g);
    }

    draw(frame, grid) {
        // draw body
        this.body.forEach((segment) => {
            segment.moveToCell(frame, grid);
            segment.draw();
        })

        // draw head
        this.head.moveToCell(frame, grid);
        this.head.draw();
    }

    updateBody(g) {
        // get updated cell positions
        this.body.map((segment, idx, body) => {
            let leader = body[idx - 1] || this.head;
            return {
                col: leader.c,
                row: leader.r,
                segment: segment
            };
        })
        .forEach((next, idx) => {
            // set direction
            next.segment.direction = this.direction === 'right' ? 'left' : 'right';

            // modify size
            let tapper = g.cellSize - (idx + 2) * 2;
            let minsize = g.cellSize * 0.75;
            next.segment.width = Math.max(tapper, minsize);
            next.segment.height = Math.max(tapper, minsize);

            // set new grid position
            next.segment.setC(next.col, g);
            next.segment.setR(next.row, g);
        });

        // update locations list
        this.updateLocations();
    }

    updateLocations() {
        this.locations = [
            this.head,
            ...this.body
        ].map((loc) => {
            let id = ''.concat(loc.c, loc.r)
            return id;
        });
    }

    setBounds(bounds) {
        this.head.setBounds(bounds);
    }

    setDirection(direction) {
        this.direction = {
            current: direction,
            x: /right|left/.test(direction) ? direction : this.direction.x,
            y: /up|down/.test(direction) ? direction : this.direction.y
        };
    }

    collisionsWith(entities) {
        return entities
        .find((ent) => { return this.collidesWith(ent); })
    };

    collidesWith(entity) {
        return entity.c === this.head.c && entity.r === this.head.r;
    }

}

export default Snake;