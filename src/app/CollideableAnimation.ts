import Animation, {AnimationOptions} from "./Animation";
import PixelMap from "./PixelMap";
import Sprite from "./Sprite";
import CollideableSprite from "./CollideableSprite";

export default class CollideableAnimation extends Animation {
    constructor(options: AnimationOptions) {
        super(options);
    }

    protected createSprite(context: CanvasRenderingContext2D, link: string): Sprite {
        return new CollideableSprite(context, link);
    }

    getPixelMap(): PixelMap {
        return (<CollideableSprite>this.sprites[this.currentImage]).getPixelMap();
    }

}