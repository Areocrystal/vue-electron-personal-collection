<template>
	<baseLayout>
		<div slot="littleFunc">
			<top-layout :showBack="true"></top-layout>
			<keep-alive>
				<router-view />
			</keep-alive>
			<template v-if="pathName === 'littleFunc'">
				<h2 class="desc-title">简要描述</h2>
				<el-divider><i class="el-icon-edit-outline"></i></el-divider>
				<el-row class="desc-row">
					<el-col :span="24">
						<div>
							<h3>1.cmd指令大全</h3>
							<p class="s-font">通过调用node-cmd调用cmd指令打开各种面板实现window下各种功能</p>
						</div>
					</el-col>
				</el-row>
				<el-divider><i class="el-icon-edit-outline"></i></el-divider>
				<el-row class="desc-row">
					<el-col :span="24">
						<div>
							<h3>2.天气动态查询</h3>
							<p>
								通过省市区三级联动(也可切换成省市)动态选择查询当地白天夜晚天气状况，同时地图及其图标也跳转至相应地点
							</p>
						</div>
					</el-col>
				</el-row>
			</template>
		</div>
	</baseLayout>
</template>

<script>
import baseLayout from 'components/common/baseLayout';
import topLayout from 'components/common/topLayout';

export default {
	name: 'little-func',
	components: {baseLayout, topLayout},
	beforeRouteEnter(to, from, next) {
		next((vm) => {
			vm.$store.commit('EDIT_METANAME', to.meta);
			vm.$store.commit('EDIT_MENUINDEX', '3');
		});
	},
	computed: {
		pathName() {
			return this.$route.name;
		},
	},
};
</script>

<style lang="less" scoped>
@import '~@/assets/css/index';
@import '~@/assets/css/font';
</style>
