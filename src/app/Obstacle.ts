import Drawable from "./interfaces/Drawable";
import DrawableOptions from "./interfaces/DrawableOptions";
import GameObject from "./interfaces/GameObject";
import Config from "./Config";
import Helper from "./Helper";
import CollideableAnimation from "./CollideableAnimation";
import PixelMap from "./PixelMap";

export default class Obstacle implements Drawable {
	private readonly options: DrawableOptions;
	private readonly initialGameObject: GameObject;
	private readonly gameObject: GameObject;
	private animationId: number = Math.round(Helper.rand(0, Obstacle.animations.length - 1));
	private static animations: Array<CollideableAnimation> = null;

	private static loadAnimations(context: CanvasRenderingContext2D) {
		if (this.animations == null) {
			this.animations = [
				new CollideableAnimation({
					context: context,
					prefix: 'obstacles',
					name: 'meteor',
					length: 2,
					extension: 'png',
					delay: 250,
				}),
			];
		}
	}

	constructor(options: DrawableOptions) {
		this.options = options;
		this.initialGameObject = {
			width: 25,
			height: 34,
			x: options.width + options.getOffset() + (options.left || 0) + Config.Game.SCREEN_BUFFER,
			y: options.height - options.bottom - 40,
		};
		this.gameObject = {...this.initialGameObject};
	}

	static async preload(context: CanvasRenderingContext2D) {
		if (Obstacle.animations != null) return;

		Obstacle.loadAnimations(context);

		for (let i = 0; i < Obstacle.animations.length; i++) {
			await Obstacle.animations[i].preload();
		}
	}

	getGameObject(): GameObject {
		return this.gameObject;
	}

	getPixelMap(): PixelMap {
		return this.getCurrentAnimation().getPixelMap();
	}

	private calculatePosition() {
		this.gameObject.x = this.initialGameObject.x - this.options.getOffset();
	}

	getCurrentAnimation(): CollideableAnimation {
		return Obstacle.animations[this.animationId];
	}

	draw() {
		this.calculatePosition();

		const {
			context,
		} = this.options;
		const {
			x,
			y,
			height,
			width,
		} = this.gameObject;

		context.drawImage(this.getCurrentAnimation().getImage(), x, y, width, height);
	}

	drawColliders() {
		const {
			context,
		} = this.options;
		const {
			x,
			y,
		} = this.gameObject;

		context.fillStyle = "#00ff00";
		const pixelMap: PixelMap = this.getPixelMap();
		const pixels: Array<any> = this.getPixelMap().getPixelMap();

		for (let i = 0; i < pixels.length; i++) {
			const pixel = pixels[i];
			context.fillRect(x + pixel.x, y + pixel.y, pixelMap.getResolution(), pixelMap.getResolution());
		}
	}
}