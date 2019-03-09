import Map from "./interfaces/Map";

export default class KeyHandler {
    private pressedKeys: Map<number, boolean>;

    constructor() {
        this.pressedKeys = {};

        document.addEventListener('keyup', this.onKeyUp, false);
        document.addEventListener('keydown', this.onKeyDown, false);
    }

    private onKeyDown(e) {
        this.pressedKeys[e.keyCode] = true;
    }

    private onKeyUp(e) {
        this.pressedKeys[e.keyCode] = false;
    }

    public isKeyPressed(keyCode: number) {
        return (typeof this.pressedKeys[keyCode] !== 'undefined') && this.pressedKeys[keyCode];
    }

}