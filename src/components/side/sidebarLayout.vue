<template>
	<transition
		name="toggle-aside-transition"
		enter-active-class="animated swing"
		leave-active-class="animated hinge"
	>
		<el-aside v-show="showAside" :width="isFold ? 'auto' : '200px'">
			<author :isHide="isFold" />
			<el-menu :default-active="menuIndex" background-color="transparent" :collapse="isFold">
				<el-menu-item index="1">
					<template slot="title">
						<font-awesome-icon icon="home" />&nbsp;
						<router-link to="/" tag="span" v-nav-set-handler="'mainEntry'">主页 </router-link>
					</template>
				</el-menu-item>
				<el-submenu index="2">
					<template slot="title"
						><i class="el-icon-picture"></i>
						<router-link to="/personal" tag="span" v-nav-set-handler="'personal'"
							>玩意
						</router-link>
					</template>
					<el-menu-item-group>
						<el-menu-item index="2-1">
							<router-link to="/personal/drawDice" tag="li" v-nav-set-handler="'drawDice'"
								>骰子作图
							</router-link>
						</el-menu-item>
						<el-menu-item index="2-2">
							<router-link to="/personal/randomSelect" tag="li" v-nav-set-handler="'randomSelect'"
								>随机抽人
							</router-link>
						</el-menu-item>
						<el-menu-item index="2-3">
							<router-link to="/personal/calculator" tag="li" v-nav-set-handler="'calculator'"
								>计算器
							</router-link>
						</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="3">
					<template slot="title"
						><i class="el-icon-s-grid"></i>
						<router-link to="/littleFunc" tag="span" v-nav-set-handler="'littleFunc'"
							>功能
						</router-link>
					</template>
					<el-menu-item-group>
						<el-menu-item index="3-1">
							<router-link to="/littleFunc/cmd" tag="li" v-nav-set-handler="'cmd'"
								>cmd指令大全
							</router-link>
						</el-menu-item>
						<el-menu-item index="3-2">
							<router-link to="/littleFunc/weatherQuery" tag="li" v-nav-set-handler="'weatherQuery'"
								>天气查询
							</router-link>
						</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
			</el-menu>
		</el-aside>
	</transition>
</template>

<script>
import author from 'components/side/author';
import eventBus from 'util/eventBus';
import {breadcrumbNames} from 'util/constantData';

export default {
	name: 'sidebar-layout',
	components: {
		author,
	},
	mounted() {
		global.addEventListener('resize', () => (this.isFold = global.innerWidth < 768));
	},
	data() {
		return {
			isFold: false,
		};
	},
	methods: {
		changeHandler(v) {
			this.$store.commit('EDIT_METANAME', breadcrumbNames[v].meta);
		},
	},
	computed: {
		showAside() {
			return this.$store.state.showAside;
		},
		menuIndex() {
			return this.$store.state.menuIndex;
		},
	},
	directives: {
		navSetHandler: {
			bind: function (el, binding) {
				el.addEventListener(
					'click',
					function ($ev) {
						$ev.preventDefault();
						eventBus.$store.commit('EDIT_METANAME', breadcrumbNames[binding.value].meta);
					},
					false
				);
			},
		},
	},
};
</script>

<style lang="less" scoped></style>
