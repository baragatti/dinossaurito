import Drawable from "./interfaces/Drawable";
import DrawableOptions from "./interfaces/DrawableOptions";
import GameObject from "./interfaces/GameObject";
import Config from "./Config";

export default class Obstacle implements Drawable {
    private options: DrawableOptions;
    private initialGameObject: GameObject;
    private gameObject: GameObject;
    private color: string = '#8900ff';

    constructor(options: DrawableOptions) {
        this.options = options;
        this.initialGameObject = {
            width: 10,
            height: 40,
            x: options.width + options.getOffset() + (options.left || 0)+ Config.Game.SCREEN_BUFFER,
            y: options.height - options.bottom - 40,
        };
        this.gameObject = {...this.initialGameObject};
    }

    getGameObject(): GameObject {
        return this.gameObject;
    }

    private calculatePosition() {
        this.gameObject.x = this.initialGameObject.x - this.options.getOffset();
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

        context.fillStyle = this.color;
        context.fillRect(x, y, width, height);
    }
}