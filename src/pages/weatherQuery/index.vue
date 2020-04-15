<template>
	<div class="weather-include">
		<el-row v-loading="loadingData" element-loading-text="努力加载中……">
			<el-col :xs="9" :md="8" :lg="7" style="text-align: left;">
				<h4 style="text-align: left;">范围选择</h4>
				<el-radio-group v-model="regionPrecision" @change="precisionChange" class="b-s">
					<el-radio :label="false">定位到市</el-radio>
					<el-radio :label="true" @click.native.once="locatePrecision">定位到区</el-radio>
				</el-radio-group>
			</el-col>
			<el-col :xs="15" :md="16" :lg="17">
				<h4 style="text-align: left;">省市区选择</h4>
				<el-cascader
					v-model="selectedOptions"
					:options="options"
					:disabled="disableCascader"
					@change="changeHandler"
					style="width: 100%;"
				>
				</el-cascader>
			</el-col>
		</el-row>
		<el-divider></el-divider>
		<el-row ref="graphRoot">
			<el-col :span="24">
				<display-map :currLocation="locInfo"></display-map>
			</el-col>
			<el-col :span="24">
				<weather-chart
					:adcode="locInfo.adcode || initAdcode"
					@cascaderState="changeState"
				></weather-chart>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import {provinceAndCityData, regionData} from 'element-china-area-data';
import displayMap from 'pages/weatherQuery/displayMap';
import weatherChart from 'pages/weatherQuery/weatherChart/';

export default {
	name: 'weather-query',
	components: {
		displayMap,
		weatherChart,
	},
	beforeRouteEnter(to, from, next) {
		next(
			(vm) => (
				vm.$store.commit('EDIT_METANAME', to.meta), vm.$store.commit('EDIT_MENUINDEX', '3-2')
			)
		);
	},
	created() {
		this.getAllDistrict(2);
		//同时加入省市adcode
		this.selectedOptions.push(this.initAdcode.replace(/\d{4}$/g, '0000'), this.initAdcode);
	},
	data() {
		return {
			loadingData: true,
			disableCascader: false,
			regionPrecision: false,
			options: provinceAndCityData,
			selectedOptions: [],
			locInfo: {},
		};
	},
	methods: {
		async getAllDistrict(level) {
			await this.$store
				.dispatch('district/getDistrictInfo', level)
				.then(() => (this.loadingData = false));
		},
		precisionChange() {
			this.options = this.regionPrecision ? regionData : provinceAndCityData;
		},
		locatePrecision() {
			this.loadingData = true;
			this.getAllDistrict(3);
		},
		findResult(target, layer) {
			return (
				Array.isArray(target) && target.find((item) => item.adcode === this.selectedOptions[layer])
			);
		},
		changeHandler() {
			const {findResult, isPrecision, districts3, districts2} = this;
			const districts = isPrecision ? districts3 : districts2,
				cityList = findResult(districts, 0).districts,
				cityDetail = findResult(cityList, 1);
			let regionDetail;
			isPrecision && (regionDetail = findResult(cityDetail.districts, 2));
			this.locInfo = regionDetail ? regionDetail : cityDetail;
		},
		changeState(state) {
			this.disableCascader = state;
		},
	},
	computed: {
		districts2() {
			return this.$store.state.district.districts2;
		},
		districts3() {
			return this.$store.state.district.districts3;
		},
		isPrecision() {
			return this.selectedOptions.length === 3;
		},
		initAdcode() {
			return this.$store.state.weather.adcode || global.localStorage.getItem('adcode');
		},
	},
};
</script>

<style lang="less" scoped>
@import '~@/assets/css/index';
.weather-include {
	.el-divider--horizontal {
		height: 2px;
	}
}

.b-s {
	padding: 12px;
	.shadow-br();
}
</style>
