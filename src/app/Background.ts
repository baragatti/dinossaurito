import DrawableOptions from "./interfaces/DrawableOptions";
import Drawable from "./interfaces/Drawable";
import Helper from "./Helper";

export default class Background implements Drawable {
    private options: DrawableOptions;
    private bits: any;
    private size: number;

    constructor(options: DrawableOptions) {
        this.options = options;
        this.size = 20;

        this.generateBits();
    }

    generateBits() {
        let bits = [], x, y;
        const {height, width} = this.options;

        for (y = height - 10; y <= height; y += 8) {
            for (x = 0 + Helper.rand(0, 100); x <= width; x += Helper.rand(100, 200)) {
                bits.push({
                    x: x,
                    y: y,
                    width: Helper.rand(2, 4)
                });
            }
        }

        this.bits = bits;
    }

    draw(context: any, offset: number) {
        const {
            bits,
            size,
        } = this;
        const {
            height,
            width,
        } = this.options;

        context.fillStyle = "#F2D16B";
        context.fillRect(0, height - size, width, size);

        context.fillStyle = "#856501";
        context.fillRect(0, height - size, width, 1);

        for (let i = bits.length - 1; i >= 0; i--) {
            context.fillRect(width - ((bits[i].x + offset) % width), bits[i].y, bits[i].width, 1);
        }
    }
}