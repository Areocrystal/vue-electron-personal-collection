import service from "@/api/index";
import eventBus from "util/eventBus";

const state = {
    province: '',
    adcode: '',
    rectangle: '',
    weatherInfo: {
        adcode: '',
        city: '',
        humidity: '',
        province: '',
        reporttime: '',
        temperature: '',
        weather: '',
        winddirection: '',
        windpower: '',
    },
    weatherListInfo: [],
};

const mutations = {
    SET_CONST_CITY(state, payload) {
        const {province, adcode, rectangle} = payload;
        [state.province, state.adcode, state.rectangle] = [province, adcode, rectangle];
    },
    SET_WEATHER_INFO(state, payload) {
        state.weatherInfo = payload.info;
    },
    SET_WEATHER_LIST_INFO(state, payload) {
        state.weatherListInfo = payload.info;
    }
};

const actions = {
    async getIpInfo({dispatch, commit}) {
        const response = await service.getIp()
            .catch(err => eventBus.errHandler(err));
        if (response && response.info === 'OK') {
            const {rectangle, province, adcode} = response;
            //方便开发
            global.localStorage.setItem('rectangle', rectangle);
            global.localStorage.setItem('adcode', adcode);
            commit({type: 'SET_CONST_CITY', adcode, province, rectangle});
            dispatch('getWeatherData', {city: adcode, extensions: 'base'});
        }
    },
    async getWeatherData({commit, dispatch}, params) {
        const response = await service.getWeather(params)
            .catch(err => eventBus.errHandler(err));
        if (response && response.info === 'OK') {
            const {lives, forecasts} = response;
            if (lives) {
                commit({type: 'SET_WEATHER_INFO', info: lives[0]});
            } else if (forecasts) {
                commit({type: 'SET_WEATHER_LIST_INFO', info: forecasts[0]});
            }
        }

    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
}