import DrawableOptions from "./interfaces/DrawableOptions";
import Drawable from "./interfaces/Drawable";
import Config from "./Config";
import GameObject from "./interfaces/GameObject";

export default class Player implements Drawable {
    private options: DrawableOptions;
    private initialGameObject: GameObject
    private gameObject: GameObject;
    private jumpStart: number;

    constructor(options: DrawableOptions) {
        this.options = options;
        this.initialGameObject = {
            width: 20,
            height: 50,
            x: options.left,
            y: options.height - options.bottom - 50,
        };
        this.gameObject = {...this.initialGameObject};

        this.jumpStart = null;
    }

    isJumping() {
        return this.jumpStart !== null && this.jumpDistanceRemaining() > 0;
    };

    jumpDistanceRemaining() {
        if (this.jumpStart === null) return 0;
        return this.jumpStart + Config.Player.JUMP_DISTANCE - this.options.getOffset();
    };

    startJump() {
        this.jumpStart = this.options.getOffset();
    };

    getJumpHeight() {
        let distanceRemaining = this.jumpDistanceRemaining();

        if (distanceRemaining > 0) {
            const maxPoint = Config.Player.JUMP_DISTANCE / 2;

            if (distanceRemaining >= maxPoint) {
                distanceRemaining -= Config.Player.JUMP_DISTANCE
            }

            const arcPos = Math.abs(distanceRemaining / maxPoint);

            return Config.Player.JUMP_HEIGHT * arcPos;
        }
        return 0;
    };

    private calculatePosition() {
        this.gameObject.y = this.initialGameObject.y - this.getJumpHeight();
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

        context.fillStyle = "#000000";
        context.fillRect(x, y, width, height);
    }
}