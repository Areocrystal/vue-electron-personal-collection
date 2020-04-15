<template>
	<el-container class="master-container">
		<sidebar-layout></sidebar-layout>
		<el-container class="container">
			<el-main style="padding-top: 0;">
				<slot name="mainEntry"></slot>
				<slot name="personal"></slot>
				<slot name="littleFunc"></slot>
			</el-main>
			<el-footer>
				<el-divider>
					<el-link type="primary" @click="currHref">
						<font-awesome-icon icon="copyright" />&nbsp;我的GitHub连接
					</el-link>
				</el-divider>
			</el-footer>
		</el-container>
	</el-container>
</template>

<script>
import {shell} from 'electron';
import sidebarLayout from 'components/side/sidebarLayout';

export default {
	name: 'base-layout',
	data() {
		return {};
	},
	components: {
		sidebarLayout,
	},
	methods: {
		currHref() {
			shell.openExternal('https://github.com/Areocrystal');
		},
		alertTip() {
			const h = this.$createElement;
			this.$notify({
				title: '提示',
				message: h('i', {style: 'color: #303133'}, '敬请期待！'),
				duration: 1200,
			});
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import '~@/assets/css/index';

.master-container {
	min-height: 750px;
	padding-top: 16px;

	.container {
		/*max-width: 900px;*/
		min-width: 600px;
		margin: 0 auto;
		background-color: @main-color-bg;

		.el-divider__text {
			background-color: @main-color-bg;
		}
	}
}
</style>
