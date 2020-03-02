const IS_DEV = process.env.NODE_ENV !== 'production';
export const API_ROOT_LOCAL = '/static/';
export const API_ROOT = IS_DEV ? 'http://localhost:8090/api/' : 'https://restapi.amap.com/v3/';
export const API_ROOT_MUSIC = IS_DEV ? 'http://localhost:8090/music/' : 'https://m3ws.kugou.com/';
