import DrawableOptions from "./interfaces/DrawableOptions";
import Drawable from "./interfaces/Drawable";

export default class Player implements Drawable {
    private options: DrawableOptions;

    constructor(options: DrawableOptions) {
        this.options = options;
    }

    draw(context: any, offset: number) {
        const {
            height,
            width,
            left,
            bottom,
        } = this.options;

        // TODO alterar
        const sizeWidth = 20;
        const sizeHeight = 50;

        context.fillStyle = "#000000";
        context.fillRect(left, height - bottom - sizeHeight, sizeWidth, sizeHeight);
    }
}