import service from '@/api/index';
import eventBus from 'util/eventBus';

const state = {
	text: [],
};

const mutations = {
	SET_FAMOUS_TEXT(state, payload) {
		state.text = payload.val;
	},
	DEL_ONE(state, val) {
		state.text.includes(val) && state.text.splice(val, 1);
	},
};

const actions = {
	async getData({commit}) {
		const response = await service.getFamous().catch((err) => eventBus.errHandler(err));
		if (response.status === 1) {
			commit({type: 'SET_FAMOUS_TEXT', val: response.data});
		}
	},
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
};
