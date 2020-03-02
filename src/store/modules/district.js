import service from "@/api/index";
import eventBus from "util/eventBus";

const state = {
    params: {
        page: 1,
        offset: 20,
    },
    districts2: [],
    districts3: [],
};

const mutations = {
    SET_DISTRICT2(state, payload) {
        state.districts2 = payload.districts;
    },
    SET_DISTRICT3(state, payload) {
        state.districts3 = payload.districts;
    }
};

const actions = {
    async getDistrictInfo({commit, state}, subdistrict) {
        const result = global.localStorage.getItem('districts');
        if (result) {
            commit({type: `SET_DISTRICT${subdistrict}`, districts: JSON.parse(result)});
        } else {
            const response = await service.getDistrict({
                ...state.params,
                subdistrict
            }).catch(err => eventBus.errHandler(err));
            if (response && response.info === "OK") {
                let {districts} = response.districts[0];
                global.localStorage.setItem('districts', JSON.stringify(districts));
                commit({type: `SET_DISTRICT${subdistrict}`, districts});
            }
        }

    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
}