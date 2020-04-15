import Vue from 'vue';
import App from 'layout/App.vue';
import router from '@/router/index';
import ElementUI from 'element-ui';
import animated from 'animate.css';
import APlayer from '@moefe/vue-aplayer';
import {library} from '@fortawesome/fontawesome-svg-core';

import {
	faBook,
	faTags,
	faCube,
	faDownload,
	faQuoteLeft,
	faQuoteRight,
	faCalculator,
	faBraille,
	faBars,
	faCopyright,
	faRandom,
	faMale,
	faHome,
	faWindowRestore,
	faCubes,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import store from 'store/index';
import VueRibbonEffect from '@/plugin/vue-ribbon-effect';
import VueTransformEffect from '@/plugin/vue-transform-effect';
import 'util/directive';

Vue.config.productionTip = false;

library.add(
	faBook,
	faTags,
	faCube,
	faDownload,
	faQuoteLeft,
	faQuoteRight,
	faCalculator,
	faBraille,
	faBars,
	faCopyright,
	faRandom,
	faMale,
	faHome,
	faWindowRestore,
	faCubes
);

Vue.use(ElementUI);
Vue.use(animated);

Vue.use(APlayer, {
	defaultCover: 'https://github.com/u3u.png',
	productionTip: true,
});

Vue.use(VueRibbonEffect);
Vue.use(VueTransformEffect);

Vue.component('font-awesome-icon', FontAwesomeIcon);

new Vue({
	components: {App},
	router,
	store,
	render: (h) => h(App),
}).$mount('#app');
