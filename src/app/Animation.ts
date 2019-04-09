import Sprite from "./Sprite";
import Config from "./Config";

export default class Animation {
    private sprites: Array<Sprite> = [];
    private delay: number;
    private lastTick: number;
    private currentImage: number;

    constructor(prefix: string, name: string, length: number, extension: string, delay: number) {
        const pathPrefix = Config.Assets.HREF + (prefix ? `${prefix}/` : '') + name + '_';

        for(let i = 0; i < length; i++) {
            const link = pathPrefix + (i+1) + '.' + extension;

            this.sprites.push(new Sprite(link));
        }

        this.lastTick = new Date().getTime();
        this.currentImage = 0;
        this.delay = delay;
    }

    async preload() {
        return Promise.all(this.sprites.map(sprite => sprite.preload()));
    }

    getSprite() {
        const newTime = new Date().getTime();

        if ((newTime - this.lastTick) > this.delay) {
            console.log('new tick', this.currentImage);
            this.currentImage++;

            if (this.currentImage > (this.sprites.length -1)) this.currentImage = 0;

            this.lastTick = newTime;
        }

        return this.sprites[this.currentImage];
    }

    getImage() {
        return this.getSprite().getImage();
    }
}