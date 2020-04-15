<template>
	<div class="date-wrapper">
		<el-dropdown trigger="click" @command="commandHandler">
			<span class="el-dropdown-link">
				{{ showGap ? '日期之间的相隔时间' : '添加或减去天数' }}
				<i class="el-icon-arrow-down el-icon--right"></i>
			</span>
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item command="gap">日期之间的相隔时间</el-dropdown-item>
				<el-dropdown-item command="operation">添加或减去天数</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
		<div v-show="showGap" style="padding-top: 24px;">
			<el-row class="row-p">
				<el-col :span="24" class="col-p">
					<span class="date-desc">开始日期</span>
				</el-col>
				<el-col :span="24" class="col-p s-c">
					<span class="s-c" style="margin-right: 7px;">{{
						startDate|date-format('yyyy年MM月dd日')
					}}</span>
					<el-link :underline="false">
						<i v-if="hideStart" class="el-icon-date" @click="hideStart = false"></i>
						<el-date-picker
							v-else
							:clearable="false"
							style="width: 50px;"
							v-model="startDate"
							type="date"
							size="mini"
							placeholder="选择日期时间"
							@change="hideStart = true"
						>
						</el-date-picker>
					</el-link>
				</el-col>
			</el-row>
			<el-row class="row-p">
				<el-col :span="24" class="col-p">
					<span class="date-desc">结束日期</span>
				</el-col>
				<el-col :span="24" class="col-p s-c">
					<span class="s-c" style="margin-right: 7px;">{{
						endDate|date-format('yyyy年MM月dd日')
					}}</span>
					<el-link :underline="false">
						<i v-if="hideEnd" class="el-icon-date" @click="hideEnd = false"></i>
						<el-date-picker
							v-else
							:clearable="false"
							style="width: 50px;"
							v-model="endDate"
							type="date"
							size="mini"
							placeholder="选择日期时间"
							@change="hideEnd = true"
						>
						</el-date-picker>
					</el-link>
				</el-col>
			</el-row>
			<el-row class="row-p">
				<el-col :span="24" class="col-p">
					<span class="date-desc">间隔时间</span>
				</el-col>
				<el-col :span="24" class="col-p">
					<span class="s-c">{{ startDate|gap-day-format(endDate) }}</span>
					<span class="week-gap">{{ startDate|gap-week-format(endDate) }}</span>
				</el-col>
			</el-row>
		</div>
		<div v-show="!showGap">
			<el-row class="row-p">
				<el-col :span="24" class="col-p">
					<span class="date-desc">开始日期</span>
				</el-col>
				<el-col :span="24" class="col-p s-c">
					<span class="s-c" style="margin-right: 7px;">{{
						startDate2|date-format('yyyy年MM月dd日')
					}}</span>
					<el-link :underline="false">
						<i v-if="hideStart" class="el-icon-date" @click="hideStart = false"></i>
						<el-date-picker
							v-else
							:clearable="false"
							style="width: 50px;"
							v-model="startDate2"
							type="date"
							size="mini"
							placeholder="选择日期时间"
							@change="hideStart = true"
						>
						</el-date-picker>
					</el-link>
				</el-col>
				<!--                <el-col :span="24" class="col-p">-->
				<!--                    <span style="color:#409EFF;font-size: 1.25em;">{{startDate2|ancient-format}}</span>-->
				<!--                </el-col>-->
			</el-row>
			<el-row class="row-p">
				<el-col :span="24" class="col-p">
					<el-radio-group v-model="calcType">
						<el-radio label="+">添加</el-radio>
						<el-radio label="-">减去</el-radio>
					</el-radio-group>
				</el-col>
			</el-row>
			<el-row class="row-p">
				<el-col :span="3" class="col-p">
					<dateSelect desc="年" @getSelected="acquireYear"></dateSelect>
				</el-col>
				<el-col :span="3" class="col-p">
					<dateSelect desc="月" @getSelected="acquireMonth"></dateSelect>
				</el-col>
				<el-col :span="3" class="col-p">
					<dateSelect desc="日" @getSelected="acquireDay"></dateSelect>
				</el-col>
			</el-row>
			<el-row class="row-p">
				<el-col :span="24" class="col-p">
					<span class="date-desc">结束时间</span>
				</el-col>
				<el-col :span="24" class="col-p">
					<span class="s-c">
						{{
							startDate2|operation-format(calcType, yearVal, monthVal, dayVal, 'yyyy年MM月dd日')
						}}
					</span>
				</el-col>
				<el-col :span="24" class="col-p">
					<span style="font-size: 1.25em;" class="s-c">
						{{
							startDate2|operation-format(calcType, yearVal, monthVal, dayVal)|ancient-format
						}}
					</span>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
import dateSelect from 'pages/winCalculator/dateSelect';
import 'util/datePipe';

export default {
	name: 'dateCalc',
	components: {
		dateSelect,
	},
	data() {
		return {
			startDate: new Date(),
			endDate: new Date(),
			startDate2: new Date(),
			hideStart: true,
			hideEnd: true,
			showGap: true,
			calcType: '+',
			yearVal: 0,
			monthVal: 0,
			dayVal: 0,
		};
	},
	methods: {
		commandHandler(command) {
			this.showGap = command === 'gap';
		},
		acquireYear(data) {
			this.yearVal = data;
		},
		acquireMonth(data) {
			this.monthVal = data;
		},
		acquireDay(data) {
			this.dayVal = data;
		},
	},
};
</script>

<style lang="less" scoped>
@import '~@/assets/css/index';
.date-wrapper {
	height: 500px;
	text-align: left;
	.row-p {
		padding: 12px 0;
		.col-p {
			padding: 6px 0;
			.date-desc {
				font-weight: 700;
				font-size: 1.25em;
			}
			.week-gap {
				color: #409eff;
				font-size: 18px;
				margin-left: 12px;
			}
		}
	}
}
</style>
