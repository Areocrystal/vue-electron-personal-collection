<template>
	<div id="app">
		<div class="main-include">
			<audio-player></audio-player>
			<vue-ribbon-effect v-show="showEffect"></vue-ribbon-effect>
			<keep-alive>
				<router-view></router-view>
			</keep-alive>
		</div>
	</div>
</template>

<script>
import audioPlayer from 'components/common/audioPlayer';
import {setContextmenu} from '@/electron/setting';

export default {
	name: 'app',
	data() {
		return {};
	},
	created() {
		setContextmenu();
	},
	mounted() {
		this.$nextTick(
			() =>
				global.L2Dwidget &&
				global.L2Dwidget.init({
					pluginRootPath: 'static/live2dw/',
					pluginJsPath: 'lib/',
					pluginModelPath: 'live2d-widget-model-nito/assets/',
					tagMode: false,
					debug: false,
					model: {
						scale: 0.6,
						jsonPath: 'static/live2dw/live2d-widget-model-nito/assets/nito.model.json',
					},
					display: {position: 'right', width: 150, height: 210, hOffset: 10, vOffset: -10},
					mobile: {show: true, scale: 0.3},
					react: {
						opacityDefault: 0.7,
						opacityOnHover: 0.2,
					},
					log: true,
				})
		);
		global.addEventListener('resize', () => this.$store.commit('CHANGE_FOLD'));
	},
	computed: {
		showEffect() {
			return this.$store.state.showEffect;
		},
	},
	components: {
		audioPlayer,
	},
};
</script>

<style lang="less" scoped>
@import '~assets/css/index';

#app {
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	padding: 0 20px;

	.main-include {
		position: relative;
		-ms-flex-align: center;
		-webkit-box-align: center;
		align-items: center;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		height: 100%;
		-webkit-box-pack: center;
		-ms-flex-pack: center;
		justify-content: center;
	}
}
</style>
