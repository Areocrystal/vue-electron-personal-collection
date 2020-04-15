import {ajax_loc, ajax_gao, ajax_music} from '@/api/interceptor';

//本地请求
export function getFamous() {
	return ajax_loc.get('/mock/famous.json').then((res) => res.data);
}

export function getMusicPic() {
	return ajax_loc
		.get('/resource/musicDefault.jpeg', {responseType: 'arraybuffer'})
		.then((res) => res.data);
}

export function getCmd() {
	return ajax_loc.get('/mock/cmd.json').then((res) => res.data);
}

//以下使用高德开发平台接口
export function getIp() {
	return ajax_gao.get('/ip').then((res) => res.data);
}

//行政区域查询
/*
  @param subdistrict:(1,2,3)1:省，2：市，3：区
*/
export function getDistrict(params) {
	return ajax_gao.get('/config/district', {params}).then((res) => res.data);
}

// 获取天气
/*
  @param city城市的adcode extensions：(base:实况天气（默认）, all:预报天气)
*/
export function getWeather(params) {
	return ajax_gao.get('/weather/weatherInfo', {params}).then((res) => res.data);
}

//获取歌单
export function getSongs() {
	return ajax_music.get('/plist').then((res) => res.data);
}

//单首歌信息
export function getSongInfo(params) {
	return ajax_music.get('/app/i/getSongInfo.php', {params}).then((res) => res.data);
}

//图片测试
export function getPicture(url) {
	return ajax_music
		.get(url)
		.then((res) => res)
		.catch((err) => err);
}
