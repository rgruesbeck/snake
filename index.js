// Game
import config from './config.json';

import {
    requestAnimationFrame,
    cancelAnimationFrame
} from './helpers/animationframe.js';

import {
    loadList,
    loadImage,
    loadSound,
    loadFont
} from './helpers/loaders.js';

import Overlay from './helpers/overlay.js';
import Snake from './gamecharacters/snake.js'
import Food from './gamecharacters/food.js'

class Game {

    constructor(canvas, overlay, config) {
        this.config = config; // customizations

        this.canvas = canvas; // game screen
        this.ctx = canvas.getContext("2d"); // game screen context
        this.canvas.width = window.innerWidth; // set game screen width
        this.canvas.height = window.innerHeight; // set game screen height
        this.canvas.style.backgroundColor = config.style.backgroundColor;

        this.overlay = new Overlay(overlay, config.style);

        // frame count and rate
        // just a place to keep track of frame rate (not set it)
        this.frame = {
            count: 0,
            rate: 60,
            time: Date.now()
        };

        // game settings
        this.state = {
            current: 'loading',
            prev: '',
            heading: 'right',
            score: 0,
            name: config.general.name,
            startText: config.general.startText,
            gameoverText: config.general.gameoverText,
            speed: config.general.speed,
            paused: false,
            muted: localStorage.getItem('game-muted') === 'true'
        };

        this.input = {
            active: 'keyboard',
            keyboard: { up: false, right: false, left: false, down: false },
            mouse: { x: 0, y: 0, click: false },
            touches: []
        };

        this.screen = {
            top: 0,
            bottom: this.canvas.height,
            left: 0,
            right: this.canvas.width,
            centerX: this.canvas.width / 2,
            centerY: this.canvas.height / 2,
            scale: ((this.canvas.width + this.canvas.height) / 2) * 0.003
        };

        this.characterSize = this.canvas.width / (100 / config.general.size);

        this.grid = {
            numCols: Math.floor(this.canvas.width / this.characterSize),
            numRows: Math.floor(this.canvas.height / this.characterSize),
            cellSize: this.characterSize
        };

        this.images = {}; // place to keep images
        this.sounds = {}; // place to keep sounds
        this.fonts = {}; // place to keep fonts

        this.snake = {};
        this.foodItems = [];

        // setup event listeners
        // handle keyboard events
        document.addEventListener('keydown', ({ code }) => this.handleKeyboardInput('keydown', code), false);
        document.addEventListener('keyup', ({ code }) => this.handleKeyboardInput('keyup', code), false);

        // handle swipes
        document.addEventListener('touchstart', ({ touches }) => this.handleSwipeInput('touchstart', touches[0]), false);
        document.addEventListener('touchmove', ({ touches }) => this.handleSwipeInput('touchmove', touches[0]), false);
        document.addEventListener('touchend', ({ touches }) => this.handleSwipeInput('touchend', touches[0]), false);

        // handle overlay clicks
        this.overlay.root.addEventListener('click', ({ target }) => this.handleClicks(target), false);

        // handle resize events
        window.addEventListener('resize', () => this.handleResize(), false);

        // handle post message
        window.addEventListener('message', (e) => this.handlePostMessage(e), false);
    }

    load() {
        // here will load all assets
        // pictures, sounds, and fonts
        
        // make a list of assets
        const gameAssets = [
            loadImage('headImage', this.config.images.headImage),
            loadImage('foodImage', this.config.images.foodImage),
            loadSound('dieSound', this.config.sounds.dieSound),
            loadSound('eatSound', this.config.sounds.eatSound),
            loadSound('backgroundMusic', this.config.sounds.backgroundMusic),
            loadFont('gameFont', this.config.style.fontFamily)
        ];

        // put the loaded assets the respective containers
        loadList(gameAssets)
        .then((assets) => {

            this.images = assets.image;
            this.sounds = assets.sound;

        })
        .then(() => this.create());
    }

    create() {

        // create game characters
        const { scale, centerX, centerY } = this.screen;
        const { headImage } = this.images;

        // get cordinates for center cell
        let centerCol = Math.floor(this.grid.numCols / 2);
        let centerRow = Math.floor(this.grid.numRows / 2);

        this.snake = new Snake(this.ctx, headImage, centerCol, centerRow, this.grid, this.state.speed);

        this.setState({ current: 'ready' });
        this.play();
    }

    play() {
        // each time play() is called, update the positions of game character,
        // and paint a picture and then call play() again
        // this will create an animation just like the pages of a flip book

        // clear the screen of the last picture
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // draw and do stuff that you need to do
        // no matter the game state

        // ready to play
        if (this.state.current === 'ready') {
            this.overlay.hideLoading();
            this.canvas.style.opacity = 1;

            this.overlay.setBanner(this.state.name);
            this.overlay.setButton(this.state.startText);
            this.overlay.showStats();
            this.overlay.setScore(this.state.score);

            this.overlay.setMute(this.state.muted);
            this.overlay.setPause(this.state.paused);
        }

        // game play
        if (this.state.current === 'play') {
            if (this.state.prev === 'ready') {
                this.overlay.hideBanner();
                this.overlay.hideButton();
            }

            if (!this.state.muted) { this.sounds.backgroundMusic.play(); }

            this.overlay.setScore(this.state.score);

            let { heading } = this.state;

            if (heading === 'up') {
                this.snake.move(0, -1, 'up', this.grid);
            }

            if (heading === 'down') {
                this.snake.move(0, 1, 'down', this.grid);
            }

            if (heading === 'left') {
                this.snake.move(-1, 0, 'left', this.grid);
            }

            if (heading === 'right') {
                this.snake.move(1, 0, 'right', this.grid);
            }

            this.snake.draw(this.frame, this.grid);

            // snake eats food
            let eatingFood = this.snake.collisionsWith(this.foodItems);
            if (eatingFood) {
                // play eat sound
                if (!this.state.muted) {
                    this.sounds.eatSound.currentTime = 0;
                    this.sounds.eatSound.play();
                }

                // eat the food
                this.snake.eat(eatingFood, this.grid);

                // remove food from foodItems list
                this.foodItems = [ ...this.foodItems]
                .filter(food => food.id != eatingFood.id)

                // increment score
                this.state.score += 1;
            }

            // snake eats its self or runs into wall
            let eatingSelf = this.snake.collisionsWith(this.snake.body);
            if (eatingSelf) {

                // stop background musc and play diesound
                if (!this.state.muted) {
                    this.sounds.backgroundMusic.pause();
                    this.sounds.dieSound.play();
                }

                // die or remove life
                this.setState({ current: 'over' });
            }

            // food
            if (this.foodItems.length < 1) {
                const { foodImage } = this.images;

                let newLocation = Food.pickLocation(this.grid, this.snake.locations);
                let newFood = Food.appear(this.ctx, foodImage, newLocation, this.grid);
                this.foodItems = [...this.foodItems, newFood];
            }

            this.foodItems.forEach(f => f.draw(this.frame, this.grid));

        }

        // game over
        if (this.state.current === 'over') {
            this.overlay.setBanner(this.state.gameoverText);
        }

        // paint the next screen
        this.requestFrame(() => this.play());
    }

    start() {

    }

    // event listeners

    handleClicks(target) {

        // mute
        if (target.id === 'mute') {
            this.mute();
        }

        // pause
        if (target.id === 'pause') {
            this.pause();
        }

        // button
        if ( target.id === 'button') {
            this.setState({ current: 'play' });
        }

        if (this.state.current === 'over') {
            this.load();
        }

    }

    handleKeyboardInput(type, code) {
        this.input.active = 'keyboard';

        if (type === 'keydown') {

            if (code === 'ArrowUp') {
                if (this.state.heading === 'down') { return; }
                this.state.heading = 'up';
            }

            if (code === 'ArrowDown') {
                if (this.state.heading === 'up') { return; }
                this.state.heading = 'down';
            }

            if (code === 'ArrowRight') {
                if (this.state.heading === 'left') { return; }
                this.state.heading = 'right';
            }

            if (code === 'ArrowLeft') {
                if (this.state.heading === 'right') { return; }
                this.state.heading = 'left';
            }


            // if in ready state, start game on any keypress
            if (this.state.current === 'ready') {
                this.setState({ current: 'play' });
            } else {

                // spacebar: pause and play game
                if (code === 'Space') {
                    this.pause();
                }
            }
        }
    }

    // convert swipe to a direction
    handleSwipeInput(type, touch) {

        // clear touch list
        if (type === 'touchstart') {
            this.input.touches = [];
        }

        // add to touch list
        if (type === 'touchmove') {
            let { clientX, clientY } = touch;
            this.input.touches.push({ x: clientX, y: clientY });
        }

        // get user intention
        if (type === 'touchend') {
            let { touches } = this.input;
            let result = {};

            if (touches.length) {

                // get direction from touches
                result = this.input.touches
                .map((touch, idx, arr) => {
                    // collect diffs
                    let prev = arr[idx - 1] || arr[0];
                    return {
                        x: touch.x,
                        y: touch.y,
                        dx: touch.x - prev.x,
                        dy: touch.y - prev.y
                    }
                })
                .reduce((direction, diff) => {
                    // sum the diffs
                    direction.dx += diff.dx;
                    direction.dy += diff.dy;

                    return direction;
                });

                // get direction
                let swipesX = Math.abs(result.dx) > Math.abs(result.dy);
                let swipesY = Math.abs(result.dy) > Math.abs(result.dx);

                if (swipesX) {
                    if (result.dx > 0) {
                        // swipe right
                        if (this.state.heading === 'left') { return; }
                        this.state.heading = 'right';
                    } else {
                        // swipe left
                        if (this.state.heading === 'right') { return; }
                        this.state.heading = 'left';
                    }
                }

                if (swipesY) {
                    if (result.dy > 0) {
                        // swipe down
                        if (this.state.heading === 'up') { return; }
                        this.state.heading = 'down';
                    } else {
                        // swipe up
                        if (this.state.heading === 'down') { return; }
                        this.state.heading = 'up';
                    }
                }
            }
        }
    }

    handleResize() {

        document.location.reload();
    }

    handlePostMessage({ data }) {
        if (data.action === 'injectGlobal') {
            let { scope, key, value } = data.payload;
            config[scope][key] = value;
            this.load();
        }
    }

    // game helpers
    // pause game
    pause() {
        this.state.paused = !this.state.paused;
        this.overlay.setPause(this.state.paused);

        if (this.state.paused) {
            // pause game loop
            this.cancelFrame();

            // mute all game sounds
            Object.keys(this.sounds).forEach((key) => {
                this.sounds[key].muted = true;
                this.sounds[key].pause();
            });

            this.overlay.setBanner('Paused');
        } else {
            // resume game loop
            this.requestFrame(() => this.play(), true);

            // resume game sounds if game not muted
            if (!this.state.muted) {
                Object.keys(this.sounds).forEach((key) => {
                    this.sounds[key].muted = false;
                    this.sounds.backgroundMusic.play();
                });
            }

            this.overlay.hideBanner();
        }
    }

    // mute game
    mute() {
        let key = 'game-muted';
        localStorage.setItem(
            key,
            localStorage.getItem(key) === 'true' ? 'false' : 'true'
        );
        this.state.muted = localStorage.getItem(key) === 'true';

        this.overlay.setMute(this.state.muted);

        if (this.state.muted) {
            // mute all game sounds
            Object.keys(this.sounds).forEach((key) => {
                this.sounds[key].muted = true;
                this.sounds[key].pause();
            });
        } else {
            // unmute all game sounds
            // and play background music
            // if game not paused
            if (!this.state.paused) {
                Object.keys(this.sounds).forEach((key) => {
                    this.sounds[key].muted = false;
                    this.sounds.backgroundMusic.play();
                });
            }
        }
    }

    // reset game
    reset() {
        document.location.reload();
    }

    // update game state
    setState(state) {
        this.state = {
            ...this.state,
            ...{ prev: this.state.current },
            ...state,
        };
    }

    // request new frame
    requestFrame(next, resumed) {
        let now = Date.now();
        this.frame = {
            count: requestAnimationFrame(next),
            rate: resumed ? now : now - this.frame.time,
            time: now,
            scale: this.screen.scale * this.frame.rate * 0.01
        };
    }

    // don't request new frame
    cancelFrame() {
        cancelAnimationFrame(this.frame.count);
    }
}

document.body.style.backgroundColor = config.style.backgroundColor;

const screen = document.getElementById("game");
const overlay = document.getElementById("overlay");

const game = new Game(screen, overlay, config); // here we create a fresh game
game.load(); // and tell it to start