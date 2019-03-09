export default class Helper {
    static rand(min, max) {
        return Math.random() * (max - min) + min;
    }
}