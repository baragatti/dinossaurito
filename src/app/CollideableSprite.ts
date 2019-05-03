import Sprite from "./Sprite";
import PixelMap from "./PixelMap";

export default class CollideableSprite extends Sprite {
    protected context: CanvasRenderingContext2D;
    private pixelMap: PixelMap;

    constructor(context: CanvasRenderingContext2D, link: string) {
        super(link);

        this.context = context;
    }

    async preload(): Promise<any> {
        await super.preload();

        return new Promise((resolve, reject) => {
            this.pixelMap = new PixelMap(this.context, this.getImage());
            resolve();
        });
    }

    getPixelMap() {
        return this.pixelMap;
    }
}