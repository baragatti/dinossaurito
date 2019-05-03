export default class PixelMap {
    private context: CanvasRenderingContext2D;
    private image: HTMLImageElement;
    private resolution: number;
    private pixelMap: Array<any>;

    constructor(context: CanvasRenderingContext2D, image: HTMLImageElement, resolution: number = 3) {
        this.context = context;
        this.image = image;
        this.resolution = resolution;

        this.generate();
    }

    private generate() {
        const pixelMap = [];

        this.context.drawImage(this.image, 0, 0, this.image.width, this.image.height);

        for (let y = 0; y < this.image.width; y = y + this.resolution) {
            for (let x = 0; x < this.image.height; x = x + this.resolution) {
                const pixel = this.context.getImageData(x, y, this.resolution, this.resolution);

                if (pixel.data[3] != 0) {
                    pixelMap.push({x: x, y: y});
                }
            }
        }

        this.context.clearRect(0, 0, this.image.width, this.image.height);

        this.pixelMap = pixelMap;
    }

    public getPixelMap(): Array<any> {
        return this.pixelMap;
    }

    public getResolution(): number {
        return this.resolution;
    }
}