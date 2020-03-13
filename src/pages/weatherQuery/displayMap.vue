<template>
  <el-card class="map-card" :body-style="{padding:'7px'}">
    <div id="map" ref="rootMap" @mousemove="pickLocation">
      <div class="picker" v-if="initLoc">
        <h4><i class="el-icon-rank"></i></h4>
        <p>当前经度：{{currLoc[0]}}</p>
        <p>当前纬度：{{currLoc[1]}}</p>
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
    import {defaults as defaultControls, ScaleLine} from 'ol/control';
    import {Vector as VectorSource} from "ol/source";
    import {Style as OlStyle, Stroke as OlStroke, Fill, Text as OlText, Icon as OlIcon} from "ol/style";
    import XYZ from 'ol/source/XYZ';
    import "ol/ol.css";
    // import rippleEffect from '@/plugin/ripple-effect/RippleEffect.min';

    export default {
        name: "displayMap",
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
            }
        },
        data() {
            return {
                map: null,
                currLoc: [0, 0],
                vectorLayer: null,
                customizedDebounce: function (fn, wait) {
                    let timer = null, context = this;
                    return function (ev) {
                        if (timer !== null) {
                            clearTimeout(timer)
                        }
                        timer = setTimeout(() => context.initLoc = fn.call(context.map, ev), wait);
                    }
                },
                zoomLevel: {
                    province: 9,
                    city: 12,
                    district: 15,
                }
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
                anchor.setStyle(new OlStyle({
                    image: new OlIcon({
                        src: locateBase64,
                        rotation: 30,
                    }),
                    text: new OlText({
                        text: '当前定位点',
                        scale: 1.3,
                        fill: new Fill({
                            color: '#ff09a8'
                        }),
                        stroke: new OlStroke({
                            color: 'transparent',
                            width: 2,
                        }),
                        offsetX: 0,
                        offsetY: 20,
                    })
                }));
                airSource.addFeature(anchor);
                return new VectorLayer({
                    source: airSource
                });
            },
            generateOlMap() {
                this.map = new Map({
                    target: "map",
                    controls: defaultControls().extend([
                        new ScaleLine({
                            units: 'degrees',
                        })
                    ]),
                    layers: [
                        new TileLayer({
                            source: new XYZ({
                                //高德地图图层
                                url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
                            })
                        }),
                        this.vectorLayer,
                    ],
                    view: new View({
                        center: this.currLoc,
                        projection: "EPSG:4326",    //投影类型
                        zoom: 11,
                    })
                });
                // rippleEffect(this.$refs.rootMap);
            },
            pickLocation($event) {
                this.customizedDebounce(this.map.getEventCoordinate, 200)($event);
            },
            handlerRect(val) {
                const catercorner = val && val.split(';'), start = catercorner[0].split(','),
                    end = catercorner[1].split(',');
                return [(+start[0] + +end[0]) / 2, (+start[1] + +end[1]) / 2];

            }
        },
        watch: {
            currLocation: {
                handler(newVal) {
                    const mapTarget = this.map.getView(), {level} = newVal, center = newVal.center.split(',');
                    this.currLoc = center;
                    mapTarget.setCenter(center);
                    mapTarget.setZoom(this.zoomLevel[level]);
                    this.map.removeLayer(this.vectorLayer);
                    this.vectorLayer = this.vectorLayerAnchor();
                    this.map.addLayer(this.vectorLayer);
                },
                deep: true,
            },
        },
        computed: {
            initLoc: {
                get() {
                    const {rectangle} = this.$store.state.weather;
                    return rectangle ? this.handlerRect(rectangle) : this.handlerRect(global.localStorage.getItem('rectangle'));
                },
                set(val) {
                    this.currLoc = val
                }
            }
        }
    }
</script>

<style lang="less" scoped>
  .map-card {
    #map {
      width: 100%;
      height: 500px;
      position: relative;

      .picker {
        position: absolute;
        width: 165px;
        padding: 4px;
        background-color: rgba(0, 0, 0, .4);
        color: #fff;
        right: 8px;
        z-index: 1;
        text-align: left;
        border-radius: 4px;

        h4 {
          margin: 6px 0;
          text-align: center;
        }

        p {
          margin: 6px 0;
          text-overflow: ellipsis;
          font: 18px HyTianZhen;
        }
      }
    }
  }

</style>
