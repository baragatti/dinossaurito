import PixelMap from "./PixelMap";

export default class Collision {
	static boxTest(source: { x: number, y: number, width: number, height: number },
								 target: { x: number, y: number, width: number, height: number }) {
		/* Source and target objects contain x, y and width, height */
		return !(
			((source.y + source.height) < (target.y)) ||
			(source.y > (target.y + target.height)) ||
			((source.x + source.width) < target.x) ||
			(source.x > (target.x + target.width))
		);
	}

	static test(source: PixelMap, sourcePos: { x: number, y: number },
							target: PixelMap, targetPos: { x: number, y: number }) {
		const sourceMap = source.getPixelMap();
		const sourceResolution = source.getResolution();
		const targetMap = target.getPixelMap();
		const targetResolution = target.getResolution();

		for (let s = 0; s < sourceMap.length; s++) {
			const sourcePixel = sourceMap[s];
			// Add positioning offset
			const sourceArea = {
				x: sourcePixel.x + sourcePos.x,
				y: sourcePixel.y + sourcePos.y,
				width: targetResolution,
				height: targetResolution,
			};

			// Loop through all the pixels in the target image
			for (let t = 0; t < targetMap.length; t++) {
				const targetPixel = targetMap[t];
				// Add positioning offset
				const targetArea = {
					x: targetPixel.x + targetPos.x,
					y: targetPixel.y + targetPos.y,
					width: targetResolution,
					height: targetResolution,
				};

				/* Use the earlier aforementioned hitbox function */
				if (Collision.boxTest(sourceArea, targetArea)) {
					return true;
				}
			}
		}
	}
}