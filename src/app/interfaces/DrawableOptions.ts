export default interface DrawableOptions {
    context: any,
    getOffset: () => number,
    left?: number,
    bottom?: number,
    top?: number,
    width?: number,
    height?: number,
}