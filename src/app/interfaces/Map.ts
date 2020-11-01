export default interface Map<A extends string | number, B> {
	// @ts-ignore
	[key: A]: B;
}