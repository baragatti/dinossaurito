import DrawableOptions from "./interfaces/DrawableOptions";
import Drawable from "./interfaces/Drawable";
import Config from "./Config";
import GameObject from "./interfaces/GameObject";

export default class ScoreBoard implements Drawable {
    private options: DrawableOptions;
    private gameObject: GameObject;
    private lastCalledTime: number;
    private fps: number = 0;

    constructor(options: DrawableOptions) {
        this.options = options;
        this.gameObject = {
            x: 10,
            y: options.top + 16,
            width: 50,
            height: 16,
        };
    }

    refresh() {
        if (!this.lastCalledTime) {
            this.lastCalledTime = performance.now();
            this.fps = 0;
            return;
        }
        var delta = (performance.now() - this.lastCalledTime) / 1000;
        this.lastCalledTime = performance.now();
        this.fps = 1 / delta;
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
        context.font = "9px Arial";
        context.textAlign = "left";
        context.fillText(Math.round(this.fps) + " fps", x, y);
    }
}