<template>
	<div>
		<transition
			name="custom-classes-transition"
			enter-active-class="animated rollIn"
			leave-active-class="animated rollOut"
		>
			<div v-if="tableData.length > 0">
				<p class="c-desc">
					当前个数:&nbsp;<span class="s-c c-desc">{{ totalNum }}</span
					>&nbsp;个
				</p>
				<transition-group
					enter-active-class="animated lightSpeedIn"
					leave-active-class="animated bounceInLeftRight"
				>
					<el-row v-for="(v, k) in tableData" :key="tableData.indexOf(v)">
						<transition-group
							enter-active-class="animated rotateInUpLeft"
							leave-active-class="animated zoomOutDown"
						>
							<el-tag
								hit
								v-for="(v, _k) in tableData[k]"
								:key="v.val"
								:type="tableData[k][_k]['type']"
								:size="tableData[k][_k]['size']"
								@dblclick.native.self="delOne(k, _k)"
							>
								{{ tableData[k][_k].val }}
							</el-tag>
						</transition-group>
					</el-row>
				</transition-group>
			</div>
		</transition>
		<transition
			name="create-description-transition"
			enter-active-class="animated lightSpeedIn"
			leave-active-class="animated rollOut"
		>
			<div v-if="tableData.length <= 0" style="min-height: 50px;">
				<h3 class="c-desc">先创建，双击可删除！</h3>
			</div>
		</transition>
		<div class="btn-control">
			<el-button class="selected" type="primary" @click.prevent="startSelect" :disabled="banStart">
				<i class="el-icon-position"></i>&nbsp;开始
			</el-button>
		</div>
	</div>
</template>

<script>
import Worker from 'util/calSelect.worker';

export default {
	name: 'matrixEffect',
	props: ['necessary'],
	data() {
		return {
			banStart: true,
			tableData: [],
			tableStorage: '',
			rndRow: null,
			rndCol: null,
			size: 'mini',
		};
	},
	methods: {
		createMatrix() {
			const calcWorker = new Worker(),
				{size} = this,
				{numTotal, numRow} = this.necessary;
			this.rndRow = this.rndCol = null;
			calcWorker.postMessage({numTotal, numRow, size});
			calcWorker.addEventListener('message', (result) => {
				this.tableStorage = result.data;
				this.tableData = JSON.parse(result.data);
				this.banStart = false;
				this.$emit('done', false);
			});
		},
		delOne(row, col) {
			if (row === this.rndRow) {
				if (col < this.rndCol) {
					this.rndCol--;
				}
			}
			this.tableData[row].splice(col, 1);
			this.tableData[row].length === 0 && this.tableData.splice(row, 1);
			this.tableStorage = JSON.stringify(this.tableData);
			this.$emit('minusTotal', this.totalNum);
		},
		startSelect() {
			if (this.tableData.length < 2) {
				return this.$message.warning({
					message: '人数过少，不用抽取',
					duration: 1000,
					center: true,
				});
			}
			let {rndRow, rndCol} = this,
				selectedCell;
			if (rndRow !== null && rndCol !== null) {
				selectedCell = this.tableData[rndRow][rndCol];
				selectedCell['type'] = '';
				selectedCell['size'] = this.size;
				this.tableStorage = JSON.stringify(this.tableData);
			}
			const startTime = +new Date(),
				gapTime = this.necessary.gap * 1000,
				recycle = () => {
					let numId = global.requestAnimationFrame(recycle);
					this.banStart = true;
					this.tableData = JSON.parse(this.tableStorage);
					this.rndRow = (Math.random() * this.tableData.length) | 0;
					this.rndCol = (Math.random() * this.tableData[this.rndRow].length) | 0;
					selectedCell = this.tableData[this.rndRow][this.rndCol];
					selectedCell['type'] = 'warning';
					selectedCell['size'] = 'large';
					if (+new Date() - startTime > gapTime) {
						global.cancelAnimationFrame(numId);
						this.banStart = false;
						this.$message.success({
							message: `已抽中${selectedCell.val}号！`,
							duration: 1500,
							center: true,
						});
					}
				};
			this.$nextTick(recycle);
		},
	},
	computed: {
		totalNum() {
			return this.tableData.map((table) => table.length).reduce((pre, cur) => pre + cur);
		},
	},
	watch: {
		necessary: {
			handler: () => {},
			deep: true,
		},
	},
};
</script>

<style lang="less" scoped>
@import '~@/assets/css/font';
@import '~@/assets/css/index';

.el-tag {
	text-align: center;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	color: @main-color;

	&:hover {
		transform: scale(1.07);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.27), 0 0 6px rgba(0, 0, 0, 0.06);
		cursor: pointer;
	}
}

.btn-control {
	position: relative;
	text-align: left;
	margin-top: 16px;
}
</style>
