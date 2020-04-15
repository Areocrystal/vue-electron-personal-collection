<template>
	<el-card
		:body-style="{padding: '7px'}"
		v-loading="loading"
		element-loading-text="努力获取中……"
		element-loading-spinner="el-icon-loading"
	>
		<div ref="chartBox" class="chart-box"></div>
	</el-card>
</template>

<script>
import Charts from 'echarts';

export default {
	name: 'weatherChart',
	props: {
		adcode: {
			type: String,
			default: '',
		},
	},
	created() {
		this.getDetailWeather();
	},
	data() {
		return {
			loading: true,
		};
	},
	methods: {
		async getDetailWeather() {
			const {adcode, $store} = this;
			this.loading = true;
			this.$emit('cascaderState', true);
			await $store
				.dispatch('weather/getWeatherData', {
					city: adcode,
					extensions: 'all',
				})
				.then(() => {
					this.drawChart();
					this.loading = false;
					this.$emit('cascaderState', false);
				});
		},
		handlerData() {
			const {weatherMessage} = this,
				{casts, city, reporttime} = weatherMessage,
				titleText = `${casts[0].date} —— ${casts[casts.length - 1].date}`;
			const dayData = [],
				nightData = [];
			casts.forEach((weather) => {
				let tmpDayData = [],
					tmpNightData = [],
					{
						week,
						date,
						daytemp,
						daypower,
						nighttemp,
						nightpower,
						daywind,
						nightwind,
						dayweather,
						nightweather,
					} = weather;
				tmpDayData.push(week, daytemp, date, daypower, daywind, dayweather, 'day');
				tmpNightData.push(week, nighttemp, date, nightpower, nightwind, nightweather, 'night');
				dayData.push(tmpDayData);
				nightData.push(tmpNightData);
			});
			return [titleText, dayData, nightData, city, reporttime];
		},
		drawChart() {
			const [titleText, dayData, nightData, city, reporttime] = this.handlerData();
			const formatText = (a, b) => `风力：${a}级，风向：${b}`;
			const formatSeries = (name, data, color) => ({
				name,
				data,
				type: 'line',
				clip: true,
				symbolSize: (data) => Math.sqrt(Math.abs(data[1]) + 3e2),
				emphasis: {
					label: {
						show: true,
						formatter: (param) => formatText(param.data[3], param.data[4]),
						position: 'top',
					},
				},
				itemStyle: {
					shadowBlur: 5,
					shadowColor: 'rgba(38,35,19,0.5)',
					shadowOffsetY: 5,
					smooth: true,
					symbol: 'circle', //折线点设置为实心点
					symbolSize: 0.5, //折线点的大小
					normal: {
						color, //折线点的颜色
						lineStyle: {
							color, //折线的颜色
						},
					},
					color: new Charts.graphic.RadialGradient(0.4, 0.3, 1, [
						{
							offset: 0,
							color: 'rgb(255,241,83)',
						},
						{
							offset: 1,
							color,
						},
					]),
				},
			});
			let wChart = Charts.init(this.$refs.chartBox);
			wChart.setOption({
				backgroundColor: new Charts.graphic.LinearGradient(1, 0.8, 0.6, 0.5, [
					{
						offset: 0,
						color: '#404040',
					},
					{
						offset: 0.6,
						color: '#fff',
					},
					{
						offset: 1,
						color: '#c2d2ff',
					},
				]),
				title: {
					text: `天气变化表${titleText}`,
					subtext: `${city}，查询日期：${reporttime}`,
					left: 'center',
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						animation: true,
						label: {
							backgroundColor: '#ccc',
							borderColor: '#aaa',
							borderWidth: 1,
							shadowBlur: 2,
							shadowOffsetX: -1,
							shadowOffsetY: -1,
							color: '#409eff',
						},
					},
					formatter: function (params) {
						const [day, night] = params;
						return `${day.value[2]}<br/>${day.seriesName}&nbsp;：${
							day.value[day.value.length - 2]
						}<br/>${night.seriesName}&nbsp;：${night.value[night.value.length - 2]}`;
					},
				},
				legend: {
					right: 1,
					y: 'bottom',
					data: ['白天', '夜晚'],
				},
				xAxis: {
					type: 'category',
					axisLabel: {
						formatter: (val) => ' 一二三四五六日'.split('').map((v) => '星期' + v)[val],
					},
					axisLine: {
						lineStyle: {
							color: '#409eff', //轴颜色
						},
					},
					splitLine: {
						show: true,
						lineStyle: {
							color: ['rgb(1,155,246,0.3)'], //网格线颜色
							width: 1,
							type: 'dash',
						},
					},
					axisTick: {
						lineStyle: {color: '#fff'}, // 轴刻度的颜色
					},
					boundaryGap: true,
				},
				yAxis: {
					axisLabel: {
						formatter: (val) => val + '℃',
					},
					axisLine: {
						lineStyle: {
							color: '#409eff', //轴颜色
						},
					},
					splitLine: {
						lineStyle: {type: 'dash'},
					},
					scale: true,
					splitNumber: 10,
					axisTick: {
						lineStyle: {color: '#fff'}, // 轴刻度的颜色
					},
				},
				grid: {
					//距离
					left: '4%',
					right: '3%',
					bottom: '10%',
					top: '15%',
					containLabel: true, //保留文字距离
				},
				series: [formatSeries('白天', dayData, '#409eff'), formatSeries('夜晚', nightData, '#000')],
			});
		},
	},
	computed: {
		weatherMessage() {
			return this.$store.state.weather.weatherListInfo;
		},
	},
	watch: {
		adcode(newVal, oldVal) {
			newVal !== oldVal && this.getDetailWeather();
		},
	},
};
</script>

<style lang="less" scoped>
.chart-box {
	width: 100%;
	height: 550px;
}
</style>
