<template>
	<div>
		<el-row v-loading="loading">
			<el-col :span="24">
				<el-card
					v-if="imgSrc"
					shadow="hover"
					:body-style="{padding: '7px'}"
					@click.native.stop="fixEl"
				>
					<el-image fit="fill" lazy :src="imgSrc" v-cloak>
						<div slot="error" class="image-slot">
							<i class="el-icon-picture-outline"></i>
						</div>
					</el-image>
					<div class="weather-desc" v-cloak>
						<p>
							<i class="el-icon-location-information"></i>&nbsp;您当前位于&nbsp;<span
								class="span-weight"
								>{{ `${province} ${weatherInfo.city}` }}</span
							>
						</p>
						<p>
							<font-awesome-icon icon="random" />&nbsp;当前室外温度 &nbsp;<span
								class="span-weight"
								>{{ weatherInfo.temperature }}</span
							>℃, 当前风向<span class="span-weight">{{ weatherInfo.winddirection }}</span
							>风, 当前风力<span class="span-weight">{{ weatherInfo.windpower }}</span
							>级, 当前空气湿度<span class="span-weight">{{ weatherInfo.humidity }}</span
							>%
						</p>
					</div>
				</el-card>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24">
				<el-card :body-style="{padding: '7px', maxHeight: '600px'}" shadow="hover">
					<el-calendar v-model="dateVal"></el-calendar>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import {weatherImgMap} from 'util/constantData';

const imagesContext = require.context('images/weather', true, /\.jpe?g$/i);

export default {
	name: 'mainCard',
	created() {
		this.getWeather();
	},
	data() {
		return {
			loading: true,
			dateVal: new Date(),
		};
	},
	methods: {
		async getWeather() {
			await this.$store.dispatch('weather/getIpInfo').then(this.nextHandler);
		},
		nextHandler() {
			this.loading = false;
		},
		fixEl() {
			document.body.style.overflowY = 'auto';
		},
	},
	computed: {
		weatherInfo() {
			return this.$store.state.weather.weatherInfo;
		},
		imgSrc() {
			const {weather} = this.weatherInfo;
			return weather ? imagesContext(weatherImgMap[weather]) : null;
		},
		province() {
			let {province} = this.$store.state.weather;
			return typeof province === 'string' && !province.endsWith('省') ? '' : province;
		},
	},
};
</script>

<style scoped>
.el-image {
	width: 100%;
}

[v-cloak] {
	display: none;
}
</style>
