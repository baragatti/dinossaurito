import DrawableOptions from "./interfaces/DrawableOptions";
import Drawable from "./interfaces/Drawable";
import Config from "./Config";
import GameObject from "./interfaces/GameObject";
import Animation from "./Animation";
import Sprite from "./Sprite";
import CollideableSprite from "./CollideableSprite";
import CollideableAnimation from "./CollideableAnimation";
import Game from "./Game";
import PixelMap from "./PixelMap";

export default class Player implements Drawable {
    private options: DrawableOptions;
    private initialGameObject: GameObject;
    private gameObject: GameObject;
    private jumpStart: number;
    private static animations: Object = null;

    private static loadAnimations(context: CanvasRenderingContext2D) {
        if (this.animations == null) {
            this.animations = {
                run: new CollideableAnimation({
                    context: context,
                    prefix: 'player',
                    name: 'run',
                    length: 6,
                    extension: 'png',
                    delay: 100,
                }),
                jump: new CollideableSprite(context, Config.Assets.HREF + 'player/jump_1.png'),
            };
        }
    }

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

    static async preload(context: CanvasRenderingContext2D) {
        if (Player.animations != null) return;

        Player.loadAnimations(context);

        const keys = Object.keys(Player.animations);

        for (let i = 0; i < keys.length; i++) {
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

    getPixelMap(): PixelMap {
        return this.getCurrentAnimation().getPixelMap();
    }

    getGameObject(): GameObject {
        return this.gameObject;
    }

    private calculatePosition() {
        this.gameObject.y = this.initialGameObject.y - this.getJumpHeight();
    }

    getCurrentAnimation(): CollideableAnimation {
        if (this.isJumping())
            return Player.animations['jump'];

        return Player.animations['run'];
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

        context.fillStyle = "#ff0000";
        const pixelMap: PixelMap = this.getPixelMap();
        const pixels: Array<any> = this.getPixelMap().getPixelMap();

        for (let i = 0; i < pixels.length; i++) {
            const pixel = pixels[i];
            context.fillRect(x + pixel.x, y + pixel.y, pixelMap.getResolution(), pixelMap.getResolution());
        }
    }
}