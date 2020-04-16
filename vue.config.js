'use strict';

const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const IS_DEV = process.env.NODE_ENV !== 'production';
const resolve = (dir) => path.join(__dirname, dir);

module.exports = {
	publicPath: IS_DEV ? './' : '/static/',
	outputDir: 'dist',
	assetsDir: 'assets',
	indexPath: 'index.html',
	pages: {
		index: {
			// 入口文件
			entry: resolve('./src/main.js'),
			// 模板文件
			template: resolve('./public/index.html'),
			// 输出文件
			filename: 'index.html',
			// 页面title
			title: 'Areocrystal',
			// 提取出来的通用 chunk 和 vendor chunk。
			chunks: ['chunk-vendors', 'chunk-common', 'index'],
		},
	},
	filenameHashing: true,
	lintOnSave: IS_DEV,
	//是否使用包含运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右
	runtimeCompiler: false,
	parallel: false, //默认
	// 构建后的文件是部署在 CDN 上的，启用该选项可以提供额外的安全性, 默认false
	integrity: false,
	productionSourceMap: true,
	devServer: {
		port: 8090, // 端口号
		host: 'localhost',
		https: false, // https:{type:Boolean}
		open: false, //配置自动启动浏览器
		overlay: {
			warnings: true,
			errors: true,
		},
		proxy: {
			'/api': {
				target: 'https://restapi.amap.com/v3/',
				changeOrigin: true,
				pathRewrite: {
					'^/api': '',
				},
			},
			'/music': {
				target: 'https://m3ws.kugou.com/',
				changeOrigin: true,
				pathRewrite: {
					'^/music': '',
				},
			},
		},
	},
	pluginOptions: {},
	configureWebpack: (config) => {
		config.module.rules.push(
			{
				test: /\.(bmp|svg|ico)(\?.*)?$/,
				use: {
					loader: 'url-loader',
					options: {
						limit: 10000,
						name: '[name].[hash:7].[ext]',
						publicPath: '../img', //会在打包后图片路径拼上该设置
						outputPath: 'img/', //输出的图片会生成并放在当前设置的文件夹下
					},
				},
			},
			{
				test: /\.(js|vue)$/,
				loader: 'eslint-loader',
				enforce: 'pre',
				include: [resolve('./src')],
				exclude: [resolve('./src/pages/winCalculator/dateCalc.vue')],
				options: {
					fix: true,
				},
			},
			{
				test: /\.worker\.js$/,
				use: {
					loader: 'worker-loader',
					options: {
						inline: true,
						name: 'workerName.[hash:8].js',
					},
				},
			}
		);
		config.plugins.push(new CleanWebpackPlugin());
		// console.log(config.module.rules, config.plugins);
	},
	chainWebpack: (config) => {
		(config) => config.plugins.delete('named-chunks');
		config.resolve.alias
			.set('assets', resolve('./src/assets'))
			.set('images', resolve('./src/assets/images'))
			.set('components', resolve('./src/components'))
			.set('layout', resolve('./src/layout'))
			.set('pages', resolve('./src/pages'))
			.set('util', resolve('./src/util'))
			.set('store', resolve('./src/store'))
			.set('static', resolve('./public/static'));
	},
	pwa: {},
	// 全局注入通用样式
	css: {
		// 是否使用 css 分离插件 ExtractTextPlugin，采用独立样式文件载入，不采用 <style> 方式内联至 html 文件中
		// 生产环境下是 true，开发环境下是 false
		extract: IS_DEV,

		// 是否构建样式地图，设置为 true 之后可能会影响构建的性能
		sourceMap: false,

		// css预设器配置项
		loaderOptions: {
			css: {
				// 这里的选项会传递给 css-loader
				sourceMap: true,
			},
		},
	},
};
