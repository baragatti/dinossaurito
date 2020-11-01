import Player from "./Player";
import Background from "./Background";
import ScoreBoard from "./ScoreBoard";
import Obstacle from "./Obstacle";
import KeyHandler from "./KeyHandler";
import Helper from "./Helper";
import Config from "./Config";
import DrawableOptions from "./interfaces/DrawableOptions";
import FrameCounter from "./FrameCounter";
import Collision from "./Collision";

export default class Game {
	private readonly canvas: HTMLCanvasElement;
	private readonly context: CanvasRenderingContext2D;
	private nextObstacle: number;
	private offset: number;
	private lastTick: number;
	private minTickObstable: number;
	private running: boolean;
	private finished: boolean;
	private player: Player;
	private background: Background;
	private score: ScoreBoard;
	private obstacles: Obstacle[];
	private frameCounter: FrameCounter;
	private keyHandler: KeyHandler;
	private preloaded: boolean = false;
	private requestedFrame: boolean = false;

	constructor() {
		this.canvas = <HTMLCanvasElement>document.getElementById("game");
		this.context = this.canvas.getContext("2d");

		this.keyHandler = new KeyHandler();

		this.startGame();
	}

	startGame() {
		this.reset();

		this.initObjects().then(() => {
			this.draw();

			if (!this.requestedFrame) {
				requestAnimationFrame(this.step.bind(this));
				this.requestedFrame = true;
			}
		});
	}

	private getDefaultDrawableOptions(): DrawableOptions {
		return {
			context: this.context,
			getOffset: () => this.offset,
			width: this.canvas.width,
			height: this.canvas.height,
		}
	}

	private async initObjects() {
		if (!this.preloaded) {
			await Player.preload(this.context);
			await Obstacle.preload(this.context);

			this.preloaded = true;
		}

		this.context.imageSmoothingEnabled = false;

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

		this.frameCounter = new FrameCounter({
			...this.getDefaultDrawableOptions(),
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
			const obstacle: Obstacle = this.obstacles[i];

			obstacle.draw();
			if (Config.Debug.SHOW_COLLIDERS) {
				obstacle.drawColliders();
			}
		}

		this.player.draw();
		this.score.draw();
		this.frameCounter.draw();

		if (Config.Debug.SHOW_COLLIDERS) {
			this.player.drawColliders();
		}
	}

	clear() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	checkCollision() {
		const size = this.obstacles.length > 2 ? 2 : this.obstacles.length;

		for (let i = 0; i < size; i++) {
			const obstacle: Obstacle = this.obstacles[i];

			if (Collision.test(this.player.getPixelMap(), this.player.getGameObject(),
				obstacle.getPixelMap(), obstacle.getGameObject())) {

				this.running = false;
				this.finished = true;
				return;
			}
		}
	}

	reset() {
		this.obstacles = [];
		this.nextObstacle = 0;
		this.minTickObstable = 0;
		this.offset = 0;
		this.lastTick = null;
		this.running = false;
		this.finished = false;
	}

	step(timestamp) {
		if (this.running && this.lastTick) {
			this.frameCounter.refresh();
			this.offset += Math.min((timestamp - this.lastTick), Config.Game.MAX_TIME_TICK) * Config.Game.OFFSET_SPEED;

			this.removeOldObstacles();
			this.updateObstacles();

			if (!this.player.isJumping() && this.keyHandler.isKeyPressed(Config.Game.JUMP_KEY)) {
				this.player.startJump();
			}

			this.draw();
			this.checkCollision();
		}
		else if (this.keyHandler.isKeyPressed(Config.Game.JUMP_KEY)) {
			if (this.finished) {
				this.startGame();
			}
			else if (!this.running) {
				this.running = true;
			}
		}

		this.lastTick = timestamp;
		requestAnimationFrame(this.step.bind(this));
	};
}