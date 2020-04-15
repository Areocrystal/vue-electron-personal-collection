export default class {
	constructor(x, y, edge, ctx, image) {
		this.edge = edge;
		this._x = x * edge;
		this._y = y * edge;
		this.ctx = ctx;
		this.img = image;
		this.r = this.edge / 6;
		this.drawElement();
	}

	drawElement() {
		this.ctx.drawImage(
			this.img,
			this._x,
			this._y,
			this.edge,
			this.edge,
			this._x,
			this._y,
			this.edge,
			this.edge
		);
		this.acquireGrayscale();
	}

	acquireGrayscale() {
		let imgData = this.ctx.getImageData(this._x, this._y, this.edge, this.edge).data,
			average = 0,
			count = 0;
		for (let i = 0, len = imgData.length; i < len; i += 4) {
			average += (imgData[i] + imgData[i + 1] + imgData[i + 2]) / 3;
			count++;
		}
		this.grayscale = average / count;
	}
}
