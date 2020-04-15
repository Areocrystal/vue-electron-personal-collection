import ribbonEffect from './ribbon-effect';
//conflict with bable-plugin-transform-runtime
const VueRibbonEffect = {
	install(Vue) {
		Vue.component('vue-ribbon-effect', ribbonEffect);
	},
};

export default VueRibbonEffect;
