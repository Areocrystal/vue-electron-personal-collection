<template>
	<div slot="selectOne" class="selected-wrapper">
		<el-popover placement="bottom" width="50%" v-model="createVisible" slot="create">
			<el-form
				status-icon
				:model="gameForm"
				:rules="rules"
				label-width="75px"
				ref="ruleForm"
				style="padding-top: 20px;"
			>
				<el-form-item label="总数" prop="numTotal">
					<el-input v-model.number="gameForm.numTotal" size="small" />
				</el-form-item>
				<el-form-item label="每排数" prop="numRow">
					<el-input v-model.number="gameForm.numRow" size="small" />
				</el-form-item>
				<el-form-item label="设置时长" prop="gap">
					<el-tooltip
						class="item"
						effect="light"
						:open-delay="1000"
						content="设置游戏开始后的抽取时间，最短设置2秒，最长设置15秒"
						placement="bottom"
					>
						<el-input-number
							v-model="gameForm.gap"
							:min="1.5"
							:max="15"
							:step="0.1"
							size="small"
						></el-input-number>
					</el-tooltip>
					&nbsp;<span style="color: #787878; font-size: 12px;">/秒</span>
				</el-form-item>
				<el-form-item>
					<el-button size="mini" type="text" @click="createVisible = false">取消</el-button>
					<el-button type="primary" size="mini" @click.prevent="submitForm('ruleForm')"
						>确定
					</el-button>
				</el-form-item>
			</el-form>
			<div slot="reference" style="text-align: left; position: relative;">
				<el-button type="primary" plain v-animation="'fadeIn'">
					<font-awesome-icon icon="male" />&nbsp;创建
				</el-button>
			</div>
		</el-popover>
		<matrixEffect
			:necessary="gameForm"
			@done="changeState"
			@minusTotal="changeTotal"
			ref="matrix"
		/>
	</div>
</template>

<script>
import matrixEffect from 'pages/randomSelect/matrixEffect';

export default {
	name: 'randomSelect',
	components: {matrixEffect},
	beforeRouteEnter(to, from, next) {
		next(
			(vm) => (
				vm.$store.commit('EDIT_METANAME', to.meta), vm.$store.commit('EDIT_MENUINDEX', '2-2')
			)
		);
	},
	data() {
		const checkTotal = (rule, value, callback) => {
				if (!value) {
					return callback(new Error('总人数不能为空'));
				}
				if (!Number.isInteger(value)) {
					return callback(new Error('请输入数字值'));
				}
				if (value > 500) {
					return callback(new Error('总人数不能超过500'));
				}
				callback();
			},
			checkRow = (rule, value, callback) => {
				if (!value) {
					return callback(new Error('每排人数不能为空'));
				}
				if (!Number.isInteger(value)) {
					callback(new Error('请输入数字值'));
				} else {
					if (value >= this.gameForm.numTotal) {
						callback(new Error('每排人数必须小于总人数'));
					}
					if (value > 30) {
						callback(new Error('每排人数不能超过30'));
					}
					if (value >= this.gameForm.numTotal) {
						callback(new Error('每排人数必须小于总人数'));
					} else {
						callback();
					}
				}
			};
		return {
			createVisible: false,
			gameForm: {
				numTotal: '',
				numRow: '',
				gap: '2',
			},
			rules: {
				numTotal: [{validator: checkTotal, trigger: 'blur'}],
				numRow: [{validator: checkRow, trigger: 'blur'}],
			},
		};
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.loading = this.$loading({
						lock: true,
						text: 'Loading',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, .3)',
					});
					this.$refs.matrix.createMatrix();
				} else {
					return false;
				}
			});
		},
		changeState() {
			this.createVisible = false;
			this.loading.close();
		},
		changeTotal(val) {
			this.gameForm.numTotal = val;
		},
	},
};
</script>

<style lang="less" scoped>
/deep/ .c-desc {
	font-family: HyTianZhen;
	font-size: 24px;
}
</style>
