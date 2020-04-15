<template>
	<div
		id="ribbon-js"
		:colorSaturation="colorSaturation"
		:colorBrightness="colorBrightness"
		:colorAlpha="colorAlpha"
		:colorCycleSpeed="colorCycleSpeed"
		:verticalPosition="verticalPosition"
		:horizontalSpeed="horizontalSpeed"
		:ribbonCount="ribbonCount"
		:strokeSize="strokeSize"
		:parallaxAmount="parallaxAmount"
		:animateSections="animateSections"
	></div>
</template>
<script>
export default {
	name: 'ribbon-effect',
	props: {
		colorSaturation: {
			type: String,
			default: '60%',
		},
		colorBrightness: {
			type: String,
			default: '50%',
		},
		colorAlpha: {
			type: Number,
			default: 0.5,
		},
		colorCycleSpeed: {
			type: Number,
			default: 5,
		},
		verticalPosition: {
			type: String,
			default: 'random',
		},
		horizontalSpeed: {
			type: Number,
			default: 200,
		},
		ribbonCount: {
			type: Number,
			default: 3,
		},
		strokeSize: {
			type: Number,
			default: 0,
		},
		parallaxAmount: {
			type: Number,
			default: -0.2,
		},
		animateSections: {
			type: Boolean,
			default: true,
		},
	},
	mounted() {
		const Ribbons = require('./RibbonsEffect.min')('ribbon-js');
		this.$nextTick(() => {
			const {
				colorSaturation,
				colorBrightness,
				colorAlpha,
				colorCycleSpeed,
				verticalPosition,
				horizontalSpeed,
				ribbonCount,
				strokeSize,
				parallaxAmount,
				animateSections,
			} = this;
			new Ribbons({
				colorSaturation,
				colorBrightness,
				colorAlpha,
				colorCycleSpeed,
				verticalPosition,
				horizontalSpeed,
				ribbonCount,
				strokeSize,
				parallaxAmount,
				animateSections,
			});
		});
	},
};
</script>
<style scoped>
#ribbon-js {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 0;
}
</style>
