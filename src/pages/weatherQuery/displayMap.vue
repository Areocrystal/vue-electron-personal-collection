<template>
	<el-card class="map-card" :body-style="{padding: '7px'}">
		<div id="map" ref="rootMap">
			<div v-if="initLoc" class="picker" ref="picker">
				<i class="el-icon-rank"></i>
			</div>
		</div>
	</el-card>
</template>

<script>
import locateBase64 from 'images/locate.jpg';
import {Map, View} from 'ol';
import Point from 'ol/geom/Point';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import Feature from 'ol/Feature';
import {defaults as defaultControls, ScaleLine, FullScreen, MousePosition} from 'ol/control';
import {Vector as VectorSource} from 'ol/source';
import {
	Style as OlStyle,
	Stroke as OlStroke,
	Fill as OlFill,
	Text as OlText,
	Icon as OlIcon,
} from 'ol/style';
import XYZ from 'ol/source/XYZ';
import {createStringXY} from 'ol/coordinate';
import 'ol/ol.css';

export default {
	name: 'displayMap',
	props: {
		currLocation: {
			type: Object,
			// eslint-disable-next-line vue/require-valid-default-prop
			default: {
				adcode: '',
				center: '',
				citycode: '',
				districts: [],
				level: '',
				name: '',
			},
		},
	},
	data() {
		return {
			map: null,
			currLoc: [0, 0],
			vectorLayer: null,
			zoomLevel: {
				province: 9,
				city: 12,
				district: 15,
			},
		};
	},
	mounted() {
		this.currLoc = this.initLoc;
		this.vectorLayer = this.vectorLayerAnchor();
		this.generateOlMap();
	},
	methods: {
		vectorLayerAnchor() {
			let airSource = new VectorSource(),
				anchor = new Feature({
					geometry: new Point(this.currLoc),
				});
			anchor.setStyle(
				new OlStyle({
					image: new OlIcon({
						src: locateBase64,
						rotation: 30,
					}),
					text: new OlText({
						text: '当前定位点',
						scale: 1.3,
						fill: new OlFill({
							color: '#ff09a8',
						}),
						stroke: new OlStroke({
							color: 'transparent',
							width: 2,
						}),
						offsetX: 0,
						offsetY: 20,
					}),
				})
			);
			airSource.addFeature(anchor);
			return new VectorLayer({
				source: airSource,
			});
		},
		generateOlMap() {
			this.map = new Map({
				target: 'map',
				controls: defaultControls().extend([
					new ScaleLine({
						units: 'degrees',
					}),
					new FullScreen(),
					new MousePosition({
						coordinateFormat: createStringXY(14),
						projection: 'EPSG:4326',
						className: 'picker',
						target: this.$refs.picker,
					}),
				]),
				layers: [
					new TileLayer({
						source: new XYZ({
							//高德地图图层
							url:
								'http://webrd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8',
						}),
					}),
					this.vectorLayer,
				],
				view: new View({
					center: this.currLoc,
					projection: 'EPSG:4326', //投影类型
					zoom: 11,
				}),
			});
			// rippleEffect(this.$refs.rootMap);
		},
		handlerRect(val) {
			const catercorner = val && val.split(';'),
				start = catercorner[0].split(','),
				end = catercorner[1].split(',');
			return [(+start[0] + +end[0]) / 2, (+start[1] + +end[1]) / 2];
		},
	},
	watch: {
		currLocation: {
			handler(newVal) {
				const {map} = this,
					mapTarget = this.map.getView(),
					{level} = newVal,
					center = newVal.center.split(',');
				this.currLoc = center;
				mapTarget.setCenter(center);
				mapTarget.setZoom(this.zoomLevel[level]);
				map.removeLayer(this.vectorLayer);
				this.vectorLayer = this.vectorLayerAnchor();
				map.addLayer(this.vectorLayer);
			},
			deep: true,
		},
	},
	computed: {
		initLoc: {
			get() {
				const {rectangle} = this.$store.state.weather;
				return rectangle
					? this.handlerRect(rectangle)
					: this.handlerRect(global.localStorage.getItem('rectangle'));
			},
			set(val) {
				this.currLoc = val;
			},
		},
	},
};
</script>

<style lang="less" scoped>
.map-card {
	#map {
		width: 100%;
		height: 500px;
		position: relative;

		.picker {
			position: absolute;
			width: 150px;
			padding: 4px;
			background-color: rgba(0, 0, 0, 0.3);
			color: #fff;
			right: 8px;
			bottom: 8px;
			z-index: 2;
			text-align: left;
			border-radius: 4px;

			p {
				margin: 6px 0;
				text-overflow: ellipsis;
				font: 18px HyTianZhen;
			}
		}
	}
}
</style>
