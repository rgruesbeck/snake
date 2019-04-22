// Snake

import Image from '../gameobjects/image';

class Snake {
    constructor(ctx, headImage, c, r, grid) {
        this.ctx = ctx;

        this.c = c;
        this.r = r;

        this.x = c * grid.cellSize;
        this.y = r * grid.cellSize;

        this.directions = ['right', 'left', 'up', 'down'];
        this.direction = { current: 'right', x: 'right', y: 'up' };

        this.head = new Image(this.ctx, headImage, this.x, this.y, grid.cellSize, grid.cellSize, 5);
        this.body = [];

        // this.eat(this.tail);
    }

    // eat food
    eat(foodItem, grid) {
        // position new food item behind
        // head in the previous cell
        // head: right -> left 
        if (this.head.direction.current === 'right') {
            foodItem.setX(this.head.x - foodItem.width);
            foodItem.setY(this.head.y);
        }

        // head: left -> right
        if (this.head.direction.current === 'left') {
            foodItem.setX(this.head.x + this.head.width);
            foodItem.setY(this.head.y);
        }

        // head: up -> bottom
        if (this.head.direction.current === 'up') {
            foodItem.setY(this.head.y + this.head.height);
            foodItem.setX(this.head.x);
        }

        // head: down -> top
        if (this.head.direction.current === 'down') {
            foodItem.setY(this.head.y - foodItem.height);
            foodItem.setX(this.head.x);
        }

        // add new food to the body
        this.body = [
            foodItem,
            ...this.body
        ];

        console.log(grid);
        console.log('body lenth', this.body.length);
    }

    move(dc, dr, m, g) {
        let nextC = head.c + dc;
        let nextR = head.r + dr;

        // first pass, calculate each segments' next position
        head.nextC = nextC;
        head.nextR = nextR;
        for (let i = 1;)
    }

    draw() {
        this.head.draw();
        this.body.forEach((segment) => {
            segment.draw();
        })
    }

    movex(x, y, m, grid) {
        // snake cannot move backward
        let prevDirection = this.direction.current;
        let newDirection = this.direction.current;

        // get valid directions
        let canMove = this.directions.filter((direction) => {
            if (prevDirection === 'left') { return direction !== 'right'; }
            if (prevDirection === 'right') { return direction !== 'left'; }
            if (prevDirection === 'up') { return direction !== 'down'; }
            if (prevDirection === 'down') { return direction !== 'up'; }
        });

        // get intended direction
        if (x > 0) { newDirection = 'right'; }
        if (x < 0) { newDirection = 'left'; }
        if (y > 0) { newDirection = 'down'; }
        if (y < 0) { newDirection = 'up'; }

        // console.log(grid);

        if (newDirection && canMove.includes(newDirection)) {
            // move head to new location
            this.head.move(x, y, m);

            // move each segment to location of previous segment
            this.body.forEach((segment, idx, body) => {
                let leader = body[idx - 1] || this.head;

                // update position

                // leader is right of segment
                if (leader.x > segment.x) {
                    segment.setX(leader.x - segment.width);
                }

                // leader is left of segment
                if (leader.x < segment.x) {
                    segment.setX(leader.x + leader.width);
                }

                // leader is up of segment
                if (leader.y < segment.y) {
                    segment.setY(leader.y + leader.height);
                }

                // leader is down of segment
                if (leader.y > segment.y) {
                    segment.setY(leader.y - segment.height);
                }
            })


            this.setDirection(newDirection);
        }
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
        let vx = entity.cx - this.head.cx;
        let vy = entity.cy - this.head.cy;
        let distance = Math.sqrt(vx * vx + vy * vy);
        return distance < (entity.radius + this.head.radius);
    }

}

export default Snake;