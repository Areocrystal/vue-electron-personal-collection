<template>
	<el-card :body-style="wrapperCard" shadow="hover">
		<el-image class="wave" lazy :src="prodSrc" :preview-src-list="[prodSrc]" style="width: 100%;">
			<div slot="error" class="image-slot">
				<i class="el-icon-picture-outline" />
			</div>
		</el-image>
	</el-card>
</template>

<script>
import {dice} from 'util/constantData';
import ImageElement from 'util/imageElement';

export default {
	name: 'generate-picture',
	props: {
		files: {
			type: Array,
			// eslint-disable-next-line vue/require-valid-default-prop
			default: [],
		},
		unitColor: {
			type: String,
			default: '#fff',
		},
		bgColor: {
			type: String,
			default: '#000',
		},
		range: {
			type: Number,
			default: 15,
		},
		type: {
			type: String,
			default: 'dot',
		},
	},
	created() {
		this.canvas = document.createElement('canvas');
		this.ctx2 = this.canvas.getContext('2d');
		this.drawDetail = this.primitiveDrawDetail;
	},
	data() {
		return {
			wrapperCard: {
				padding: '7px',
				borderRadius: '7px',
				backgroundColor: '#f8f8f8',
				border: 'none',
			},
			img: new Image(),
			pixelCollection: [
				...'1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+{}|:"<>?-=[]\\;\',./`~',
			],
			prodSrc: '',
		};
	},
	methods: {
		async setImgSource(src) {
			const {img} = this;
			img.src = src;
			await img.addEventListener(
				'load',
				function () {
					this.cw = this.canvas.width = img.width;
					this.ch = this.canvas.height = img.height;
				}.bind(this)
			);
		},
		getImgSegments() {
			const {drawUnit} = this;
			if (this.files.length < 1) {
				return this.$message({
					showClose: true,
					message: '请先上传一张图片!',
					type: 'error',
					duration: 1000,
					center: true,
				});
			}
			const loading = this.$loading({
					lock: true,
					text: '生成中……',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, .4)',
				}),
				segmentsX = Math.ceil(this.cw / this.range),
				segmentsY = Math.ceil(this.ch / this.range);
			for (let i = 0; i < segmentsX; i++) {
				for (let j = 0; j < segmentsY; j++) {
					drawUnit(new ImageElement(i, j, this.range, this.ctx2, this.img));
				}
			}
			this.prodSrc = this.canvas.toDataURL();
			this.$emit('hasProdImg', [true, this.prodSrc]);
			loading.close();
		},

		drawUnit(_self) {
			const step = (_self.grayscale / 25.6) | 0;
			this.ctx2.fillStyle = this.bgColor;
			this.ctx2.fillRect(_self._x, _self._y, _self.edge, _self.edge);
			for (let i = dice[step].length - 1; i > -1; i--) {
				for (let j = dice[step][i].length - 1; j > -1; j--) {
					dice[step][i][j] === 1 && this.drawDetail(_self._x, _self._y, _self.r, i, j);
				}
			}
		},

		primitiveDrawDetail() {
			switch (this.type) {
				case 'dot':
					this.drawDetail = (x, y, range, I, J) => {
						this.ctx2.beginPath();
						this.ctx2.fillStyle = this.unitColor;
						this.ctx2.arc(x + range * (2 * J + 1), y + range * (2 * I + 1), range, 0, 2 * Math.PI);
						this.ctx2.fill();
						this.ctx2.closePath();
					};
					break;
				case 'diamond':
					this.drawDetail = (x, y, range, I, J) => {
						this.ctx2.beginPath();
						this.ctx2.fillStyle = this.unitColor;
						this.ctx2.fillRect(x + range * J, y + range * I, range, range);
						this.ctx2.fill();
						this.ctx2.closePath();
					};
					break;
				case 'character':
					this.drawDetail = (x, y, range, I, J) => {
						let txt = this.pixelCollection[this.getRnd(this.pixelCollection.length)];
						this.ctx2.beginPath();
						this.ctx2.fillStyle = this.unitColor;
						this.ctx2.font = `${range}px Consolas`;
						this.ctx2.textBaseline = 'hanging';
						this.ctx2.fillText(txt, x + 2 * range * J, y + 2 * range * I);
						this.ctx2.fill();
						this.ctx2.closePath();
					};
			}
		},

		getRnd(n, m) {
			if (arguments.length < 2) {
				m = [n, (n = 0)][0];
			}
			if (n > m) {
				n = [m, (m = n)][0];
			}
			return ~~(Math.random() * (m - n)) + n;
		},
	},
	watch: {
		range(newVal) {
			this.range = newVal;
		},
		unitColor(newVal) {
			this.unitColor = newVal;
		},
		bgColor(newVal) {
			this.bgColor = newVal;
		},
		type(newVal) {
			this.type = newVal;
			this.primitiveDrawDetail();
		},
	},
};
</script>
