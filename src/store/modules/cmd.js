import service from "@/api/index";
import eventBus from "util/eventBus";

const state = {
    directiveData: [],
};

const mutations = {
    SET_DIRECTIVE(state, payload) {
        state.directiveData = payload.val;
    }
};

const actions = {
    async getData({commit}) {
        const response = await service.getCmd()
            .catch(err => eventBus.errHandler(err));
        if (response.status === 1) {
            commit({type: 'SET_DIRECTIVE', val: response.data})
        }
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
}