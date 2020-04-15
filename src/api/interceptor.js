import axios from 'axios';
import {Message} from 'element-ui';
import querystring from 'querystring';
import * as env from '@/env.config';

export const ajax_loc = axios.create({
	baseURL: env.API_ROOT_LOCAL,
	headers: {'Content-Type': 'application/json'},
	timeout: 5000,
});

export const ajax_gao = axios.create({
	baseURL: env.API_ROOT,
	headers: {'Content-Type': 'application/json'},
	timeout: 10000,
});

export const ajax_music = axios.create({
	baseURL: env.API_ROOT_MUSIC,
	headers: {'Content-Type': 'application/json'},
	timeout: 10000,
});

const requestErrorHandler = (error) => {
	// 对请求错误做些什么，自己定义
	error.response !== undefined &&
		Message({
			showClose: true,
			message: querystring.stringify(error),
			type: 'error',
		});
	return Promise.reject(error);
};

const responseHandlers = [
	(response) => {
		if (response.status === 200) {
			return Promise.resolve(response);
		} else {
			return Promise.reject(response);
		}
	},
	requestErrorHandler,
];

//必须要key值
const validation = {
	key: 'a42bd90ec981723bef2a5e26b70e9ca7',
};
ajax_gao.interceptors.request.use((config) => {
	//不能用Object.assign,必须这种写法否则config丢失所有属性
	config.params = {...(config.params || {}), ...validation};
	return config;
}, requestErrorHandler);

ajax_loc.interceptors.response.use(...responseHandlers);

ajax_gao.interceptors.response.use(...responseHandlers);

ajax_music.interceptors.request.use((config) => {
	config.params = {...(config.params || {}), ...{json: 'true', cmd: 'playInfo'}};
	// config.headers = {...(config.headers || {}), ...{referer: 'https://m3ws.kugou.com/plist/list'}};
	return config;
}, requestErrorHandler);

ajax_music.interceptors.response.use(...responseHandlers);
