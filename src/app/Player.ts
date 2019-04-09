import DrawableOptions from "./interfaces/DrawableOptions";
import Drawable from "./interfaces/Drawable";
import Config from "./Config";
import GameObject from "./interfaces/GameObject";
import Animation from "./Animation";
import Sprite from "./Sprite";

export default class Player implements Drawable {
    private options: DrawableOptions;
    private initialGameObject: GameObject;
    private gameObject: GameObject;
    private jumpStart: number;
    private static animations: Object = {
        run: new Animation('player', 'run', 6, 'png', 100),
        jump: new Sprite(Config.Assets.HREF + 'player/jump_1.png'),
    };

    constructor(options: DrawableOptions) {
        this.options = options;
        this.initialGameObject = {
            width: 67,
            height: 56,
            x: options.left,
            y: options.height - options.bottom - 56,
        };
        this.gameObject = {...this.initialGameObject};

        this.jumpStart = null;
    }

    static async preload() {
        const keys = Object.keys(Player.animations);

        for (let i=0; i < keys.length; i++) {
            await Player.animations[keys[i]].preload();
        }
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

        if (this.isJumping()) {
            context.drawImage(Player.animations['jump'].getImage(), x, y, width, height);
        } else {
            context.drawImage(Player.animations['run'].getImage(), x, y, width, height);
        }
    }
}