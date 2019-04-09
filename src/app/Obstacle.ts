import Drawable from "./interfaces/Drawable";
import DrawableOptions from "./interfaces/DrawableOptions";
import GameObject from "./interfaces/GameObject";
import Config from "./Config";
import Animation from "./Animation";
import Helper from "./Helper";

export default class Obstacle implements Drawable {
    private options: DrawableOptions;
    private initialGameObject: GameObject;
    private gameObject: GameObject;
    private animationId: number = Helper.rand(0, Obstacle.animations.length - 1);
    private static animations: Array<Animation> = [
        new Animation('obstacles', 'meteor', 2, 'png', 250),
    ];

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

    static async preload() {
        for (let i = 0; i < Obstacle.animations.length; i++) {
            await Obstacle.animations[i].preload();
        }
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

        context.drawImage(Obstacle.animations[this.animationId].getImage(), x, y, width, height);
    }
}