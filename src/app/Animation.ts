import Sprite from "./Sprite";
import Config from "./Config";

export interface AnimationOptions {
	context: CanvasRenderingContext2D,
	prefix: string,
	name: string,
	length: number,
	extension: string,
	delay: number,
}

export default class Animation {
	protected context: CanvasRenderingContext2D;
	protected sprites: Array<Sprite> = [];
	private readonly delay: number;
	private lastTick: number;
	protected currentImage: number;

	constructor(options: AnimationOptions) {
		const {
			prefix,
			name,
			length,
			extension,
			delay,
			context,
		} = options;

		const pathPrefix = Config.Assets.HREF + (prefix ? `${prefix}/` : '') + name + '_';

		for (let i = 0; i < length; i++) {
			const link = pathPrefix + (i + 1) + '.' + extension;

			this.sprites.push(this.createSprite(context, link));
		}

		this.context = context;
		this.lastTick = new Date().getTime();
		this.currentImage = 0;
		this.delay = delay;
	}

	protected createSprite(context: CanvasRenderingContext2D, link: string) {
		return new Sprite(link);
	}

	async preload(): Promise<any> {
		return Promise.all(this.sprites.map(sprite => sprite.preload()));
	}

	getSprite() {
		const newTime = new Date().getTime();

		if ((newTime - this.lastTick) > this.delay) {
			this.currentImage++;

			if (this.currentImage > (this.sprites.length - 1)) {
				this.currentImage = 0;
			}

			this.lastTick = newTime;
		}

		return this.sprites[this.currentImage];
	}

	getImage() {
		return this.getSprite().getImage();
	}
}