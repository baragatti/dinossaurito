import DrawableOptions from "./interfaces/DrawableOptions";
import Drawable from "./interfaces/Drawable";
import Config from "./Config";
import GameObject from "./interfaces/GameObject";

export default class ScoreBoard implements Drawable {
    private options: DrawableOptions;
    private gameObject: GameObject;

    constructor(options: DrawableOptions) {
        this.options = options;
        this.gameObject = {
            x: options.width - 10,
            y: options.top + 16,
            width: 50,
            height: 16,
        };
    }

    getScore(): number {
        return Math.floor(this.options.getOffset() * Config.Score.FACTOR);
    }

    getScoreText(): string {
        return String(this.getScore());
    }

    draw() {
        const {
            context,
        } = this.options;
        const {
            x,
            y,
        } = this.gameObject;

        context.fillStyle = "#000000";
        context.font = "16px Courier";
        context.textAlign = "right";
        context.fillText(this.getScoreText(), x, y);
    }
}