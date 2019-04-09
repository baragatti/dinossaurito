export default class Sprite {
    private image: HTMLImageElement = new Image();
    private link: string;

    constructor(link: string) {
        this.link = link;
    }

    async preload() {
        const {
            image,
            link,
        } = this;

        return new Promise((resolve, reject) => {
            image.src = link;
            image.onload = () => {
                resolve();
            };
        });
    }

    getImage() {
        return this.image;
    }
}