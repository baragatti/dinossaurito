import Player from "./Player";
import Background from "./Background";
import ScoreBoard from "./ScoreBoard";
import Obstacle from "./Obstacle";
import KeyHandler from "./KeyHandler";
import Helper from "./Helper";

const Global = {
    DEFAULT_COLOUR: "#444",
    BACKGROUND_COLOUR: "#EEE",
    OFFSET_SPEED: 0.4,
    MAX_TIME_TICK: 1000 / 60,
    SCREEN_BUFFER: 50,
    GROUND_BUFFER: 10,
    SPACE_BAR_CODE: 32,
    MIN_CACTUS_DISTANCE: 400,
};

export default class Game {
    private readonly canvas: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D;
    private nextObstacle: number;
    private offset: number;
    private lastTick: any;
    private running: boolean;
    private finished: boolean;
    private player: Player;
    private background: Background;
    private score: ScoreBoard;
    private obstacles: Obstacle[];
    private keyHandler: KeyHandler;

    constructor() {
        // @ts-ignore
        this.canvas = document.getElementById("game");
        this.context = this.canvas.getContext("2d");

        this.nextObstacle = 0;
        this.offset = 0;
        this.lastTick = null;
        this.running = false;
        this.finished = false;

        this.keyHandler = new KeyHandler();

        this.initObjects();
        this.draw();
        requestAnimationFrame(this.step.bind(this));
    }

    initObjects() {
        this.player = new Player({
            context: this.context,
            left: 10,
            bottom: this.canvas.height - Global.GROUND_BUFFER,
        });

        this.background = new Background({
            context: this.context,
            width: this.canvas.width,
            height: this.canvas.height,
        });

        this.score = new ScoreBoard({
            context: this.context,
            left: this.canvas.width - 10,
            bottom: 26,
        });
    };

    updateObstacles() {
        // TODO
        while (this.offset > this.nextObstacle) {
            let count = Math.floor(Helper.rand(1, 3.9)),
                scale = Helper.rand(0.8, 1.5),
                x = this.canvas.width + this.offset + Global.SCREEN_BUFFER;

            while (count--) {
                // TODO
                // this.obstacles.push(new Obstacle({
                //     left: x + (count * 20 * scale),
                //     bottom: this.canvas.height - Global.GROUND_BUFFER,
                //     scale: scale,
                //     leftSize: Helper.rand(0.5, 1.5),
                //     rightSize: Helper.rand(0.5, 1.5),
                //     centerSize: Helper.rand(0.5, 1.5),
                // }));
            }

            this.nextObstacle = this.offset + Helper.rand(Global.MIN_CACTUS_DISTANCE, this.canvas.width);
        }
    }

    removeOldObstacles() {
        // TODO
        let count = 0; // used to force cacti off the screen

        // TODO implementar x nos obstaculos
        // while (this.obstacles.length > count && this.obstacles[count].x < this.offset - Global.SCREEN_BUFFER) {
        //     count++;
        // }

        if (count > 0)
            this.obstacles.splice(0, count);
    }

    draw() {
        this.clear();

        this.background.draw(this.context, this.offset);

        for (let i = 0; i < this.obstacles.length; i++) {
            // TODO colliders
            //this.obstacles[i].drawColliders(this.context, this.offset);
            this.obstacles[i].draw(this.context, this.offset);
        }

        // TODO colliders
        //this.player.drawColliders(this.context, this.offset);
        this.player.draw(this.context, this.offset);
        this.score.draw(this.context, this.offset);
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    checkCollision() {
        for (let i = 0; i < this.obstacles.length; i++) {
            // TODO implementar teste de colisao no player
            // if (this.player.collidesWith(this.obstacles[i], this.offset)) {
            //     this.running = false;
            //     this.finished = true;
            //     this.player.wideEyed = true; // TODO implementar no player
            //     return;
            // }
        }
    }

    step(timestamp) {
        if (this.running && this.lastTick) {
            this.offset += Math.min((timestamp - this.lastTick), Global.MAX_TIME_TICK) * Global.OFFSET_SPEED;

            this.removeOldObstacles();
            this.updateObstacles();

            // TODO implementar pulo
            // if (!this.player.isJumping(this.offset) && this.keyHandler.isKeyPressed(Global.SPACE_BAR_CODE) {
            //     this.player.startJump(this.offset);
            // }

            this.checkCollision();
            this.draw();
        } else if (this.keyHandler.isKeyPressed(Global.SPACE_BAR_CODE)) {
            this.running = true;
        }

        if (!this.finished) {
            this.lastTick = timestamp;
            requestAnimationFrame(this.step.bind(this));
        }
    };
}