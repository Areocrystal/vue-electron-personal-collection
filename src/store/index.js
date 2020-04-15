import Vue from 'vue';
import Vuex from 'vuex';
import modules from 'store/modules';

Vue.use(Vuex);

const state = {
	metaName: [''],
	menuIndex: '1',
	showAside: true,
	showEffect: true, //是否展示特效
	shouldFold: false, //是否响应式折叠
};

const mutations = {
	EDIT_METANAME(state, val) {
		state.metaName = val;
	},
	EDIT_MENUINDEX(state, val) {
		state.menuIndex = val;
	},
	TOGGLE_ASIDE(state) {
		state.showAside = !state.showAside;
	},
	TOGGLE_EFFECT(state) {
		state.showEffect = !state.showEffect;
	},
	CHANGE_FOLD(state) {
		state.shouldFold = global.innerWidth < 768;
	},
};

export default new Vuex.Store({
	state,
	mutations,
	modules,
	strict: process.env.NODE_ENV === 'production',
});
