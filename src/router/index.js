import Vue from 'vue';
import Router from 'vue-router';

import {breadcrumbNames} from 'util/constantData';
// import {ipcRenderer} from 'electron';

Vue.use(Router);
export default new Router({
	base: '/',
	mode: 'hash',
	routes: [
		{
			path: '/',
			name: 'mainEntry',
			component: require('components/mainEntry/index').default,
			meta: breadcrumbNames['mainEntry']['meta'],
			beforeEnter: (to, from, next) => {
				next();
			},
		},
		{
			path: '/personal',
			name: 'personal',
			component: require('components/personal/index').default,
			meta: breadcrumbNames['mainEntry']['meta'],
			children: [
				{
					path: 'drawDice',
					name: 'drawDice',
					component: require('pages/drawByDice/index').default,
					meta: breadcrumbNames['drawDice']['meta'],
				},
				{
					path: 'randomSelect',
					name: 'randomSelect',
					component: require('pages/randomSelect/index').default,
					meta: breadcrumbNames['randomSelect']['meta'],
				},
				{
					path: 'calculator',
					name: 'calculator',
					component: require('pages/winCalculator/index').default,
					meta: breadcrumbNames['calculator']['meta'],
				},
			],
		},
		{
			path: '/littleFunc',
			name: 'littleFunc',
			component: require('components/littleFunc/index').default,
			meta: breadcrumbNames['littleFunc']['meta'],
			children: [
				{
					path: 'cmd',
					name: 'cmd',
					component: require('pages/cmd/index').default,
					meta: breadcrumbNames['cmd']['meta'],
				},
				{
					path: 'weatherQuery',
					name: 'weatherQuery',
					component: require('pages/weatherQuery/index').default,
					meta: breadcrumbNames['weatherQuery']['meta'],
				},
			],
		},
		{
			path: '*',
			redirect: '/',
		},
	],
});
