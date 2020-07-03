<template>
	<div class="top-widget">
		<el-tooltip
			effect="light"
			placement="left"
			:open-delay="1000"
			:content="`${$store.state.showAside ? '隐藏' : '显示'}侧边栏`"
		>
			<el-button
				circle
				plain
				size="small"
				:icon="controlIcon[+isFold]"
				@click="controlAside"
				v-animation="'rubberBand'"
			></el-button>
		</el-tooltip>
		<el-button
			v-show="showBack"
			circle
			plain
			size="small"
			style="margin-right: 12px;"
			@click.prevent="rollback"
			v-animation="'wobble'"
		>
			<i class="el-icon-arrow-left"></i>
		</el-button>
		<el-tooltip
			effect="light"
			placement="right"
			:content="`${$store.state.showEffect ? '关闭' : '启用'}特效`"
			:open-delay="500"
		>
			<el-button
				circle
				plain
				size="small"
				style="margin-right: 12px;"
				@click="$store.commit('TOGGLE_EFFECT')"
				v-animation="'jello'"
			>
				<i class="el-icon-attract"></i>
			</el-button>
		</el-tooltip>
		<slot name="create" />
		<div class="breadcrumb">
			<el-breadcrumb separator-class="el-icon-arrow-right">
				<el-breadcrumb-item v-for="(v, k) in breadcrumbList" :key="k">{{
					breadcrumbList[k]
				}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
	</div>
</template>

<script>
export default {
	name: 'top-layout',
	props: {
		showBack: {
			type: Boolean,
			defaults: true,
		},
	},
	data() {
		return {
			toggleClass: false,
			isFold: false,
			controlIcon: ['el-icon-s-unfold', 'el-icon-s-fold'],
		};
	},
	methods: {
		controlAside() {
			this.isFold = !this.isFold;
			this.$store.commit('TOGGLE_ASIDE');
		},
		rollback() {
			this.$router.back(-1);
		},
	},
	computed: {
		breadcrumbList() {
			return this.$store.state.metaName;
		},
	},
};
</script>

<style lang="less" scoped>
.top-widget {
	text-align: left;
	padding: 8px 0;
	position: relative;

	.breadcrumb {
		padding: 12px 0;
	}
}
</style>
