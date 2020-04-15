<template>
	<div class="author-wrapper" v-show="isShow">
		<el-avatar
			style="vertical-align: middle;"
			src="https://avatars1.githubusercontent.com/u/29609342?s=460&v=4"
		></el-avatar>
		<span class="avatar-name">Areocrystal</span>
		<el-divider></el-divider>
	</div>
</template>

<script>
export default {
	name: 'author',
	props: ['isHide'],
	data() {
		return {
			isShow: true,
		};
	},
	watch: {
		isHide(newVal) {
			this.isShow = !newVal;
		},
	},
};
</script>

<style lang="less" scoped>
@import '~@/assets/css/index';

.author-wrapper {
	padding: 12px 24px 0;

	.avatar-name {
		background-image: -webkit-linear-gradient(
			135deg,
			#1896db,
			#f45c0c 10%,
			#d733c5 20%,
			#2af793 30%,
			#ffd400 40%,
			#3498db 50%,
			#f47920 60%,
			#d71345 70%,
			#f7acbc 80%,
			#ffd400 90%,
			#3498db
		);
		color: transparent;
		-webkit-text-fill-color: transparent;
		-webkit-background-clip: text;
		background-size: 200% 100%;
		text-align: center;
		font-size: 1em;
		margin-left: 12px;
		animation: masked-animation 4s infinite linear;
	}

	@keyframes masked-animation {
		0% {
			background-position: 0 0;
		}
		100% {
			background-position: -100% 0;
		}
	}
}
</style>
