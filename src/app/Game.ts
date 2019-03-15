import Player from "./Player";
import Background from "./Background";
import ScoreBoard from "./ScoreBoard";
import Obstacle from "./Obstacle";
import KeyHandler from "./KeyHandler";
import Helper from "./Helper";
import Config from "./Config";
import DrawableOptions from "./interfaces/DrawableOptions";

export default class Game {
    private readonly canvas: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D;
    private nextObstacle: number;
    private offset: number;
    private lastTick: number;
    private minTickObstable: number = 0;
    private running: boolean;
    private finished: boolean;
    private player: Player;
    private background: Background;
    private score: ScoreBoard;
    private obstacles: Obstacle[];
    private keyHandler: KeyHandler;

    constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById("game");
        this.context = this.canvas.getContext("2d");

        this.obstacles = [];
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

    private getDefaultDrawableOptions(): DrawableOptions {
        return {
            context: this.context,
            getOffset: () => this.offset,
            width: this.canvas.width,
            height: this.canvas.height,
        }
    }

    private initObjects() {
        this.player = new Player({
            ...this.getDefaultDrawableOptions(),
            left: 10,
            bottom: Config.Game.GROUND_BUFFER,
        });

        this.background = new Background({
            ...this.getDefaultDrawableOptions(),
        });

        this.score = new ScoreBoard({
            ...this.getDefaultDrawableOptions(),
            left: this.canvas.width - 10,
            top: 5,
        });
    };

    updateObstacles() {
        if ((this.offset > this.nextObstacle) && (this.lastTick > this.minTickObstable)) {
            if (Helper.rand(1, 100) > 30) {
                this.minTickObstable = this.lastTick + Helper.rand(500, Helper.rand(1500, 2500));
            }

            this.obstacles.push(new Obstacle({
                ...this.getDefaultDrawableOptions(),
                left: 20 * Helper.rand(0.8, 4),
                bottom: Config.Game.GROUND_BUFFER,
            }));

            this.nextObstacle = this.offset + Helper.rand(Config.Game.MIN_OBSTACLE_DISTANCE, this.canvas.width);
        }
    }

    removeOldObstacles() {
        let count = 0;

        while (this.obstacles.length > count && this.obstacles[count].getGameObject().x < -Config.Game.SCREEN_BUFFER) {
            count++;
        }

        if (count > 0)
            this.obstacles.splice(0, count);
    }

    draw() {
        this.clear();

        this.background.draw();

        for (let i = 0; i < this.obstacles.length; i++) {
            // TODO colliders
            //this.obstacles[i].drawColliders();
            this.obstacles[i].draw();
        }

        // TODO colliders - migrar p/ getColliders
        //this.player.drawColliders();
        this.player.draw();
        this.score.draw();
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
            this.offset += Math.min((timestamp - this.lastTick), Config.Game.MAX_TIME_TICK) * Config.Game.OFFSET_SPEED;

            this.removeOldObstacles();
            this.updateObstacles();

            // TODO implementar pulo
            if (!this.player.isJumping() && this.keyHandler.isKeyPressed(Config.Game.JUMP_KEY)) {
                this.player.startJump();
            }

            this.checkCollision();
            this.draw();
        } else if (this.keyHandler.isKeyPressed(Config.Game.JUMP_KEY)) {
            this.running = true;
        }

        if (!this.finished) {
            this.lastTick = timestamp;
            requestAnimationFrame(this.step.bind(this));
        }
    };
}