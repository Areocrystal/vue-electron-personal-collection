import transformEffect from './transform-effect';

const VueTransformEffect = {
	install(Vue) {
		Vue.component('vue-transform-effect', transformEffect);
	},
};

export default VueTransformEffect;
