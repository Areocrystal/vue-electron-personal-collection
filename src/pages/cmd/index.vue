<template>
	<div v-if="cmdData.length">
		<el-collapse class="collapse pr" v-model="activeName" accordion>
			<el-collapse-item v-for="(v, k) in cmdData" :name="k + 1" :key="k">
				<div>
					<p style="text-align: left;">{{ v.command }}</p>
					<p>{{ activeText[v.command] }}</p>
				</div>
				<el-button type="primary" circle plain size="mini" @click="runCmdDirective(v.command)">
					<font-awesome-icon icon="cubes" class="icon" />
				</el-button>
				<div slot="title">
					<h3 :class="activeName === k + 1 && 's-c'" style="padding-left: 12px;">{{ v.desc }}</h3>
				</div>
			</el-collapse-item>
		</el-collapse>
	</div>
</template>

<script>
import nodeCmd from 'node-cmd';
import {ipcRenderer} from 'electron';

export default {
	name: 'index',
	beforeRouteEnter(to, from, next) {
		next(
			(vm) => (vm.$store.commit('EDIT_METANAME', to.meta), vm.$store.commit('EDIT_MENUINDEX', '31'))
		);
	},
	created() {
		this.getCmdData();
	},
	data() {
		return {
			activeName: 1,
			activeText: {},
		};
	},
	methods: {
		async getCmdData() {
			await this.$store.dispatch('cmd/getData');
		},
		runCmdDirective(d) {
			nodeCmd.get(`chcp 65001 &&${d}`, (err, data, stderr) => {
				// if (err) {
				//     ipcRenderer.send(
				//         'openErrorDialog',
				//         {title: 'cmd错误', content: err}
				//     );
				// }
				data && (this.activeText[d] = data);
			});
			nodeCmd.run(d);
		},
	},
	computed: {
		cmdData() {
			return this.$store.state.cmd.directiveData;
		},
	},
};
</script>

<style lang="less" scoped>
@import '~@/assets/css/index';

.collapse {
	height: 800px;
	overflow-y: scroll;
}
</style>
