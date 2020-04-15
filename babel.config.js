module.exports = {
	presets: ['@babel/preset-env', '@vue/cli-plugin-babel/preset'],
	plugins: [
		[
			'@babel/plugin-transform-runtime',
			{
				absoluteRuntime: false,
				corejs: false,
				helpers: true,
				regenerator: true,
				useESModules: false,
				version: '7.0.0-beta.0',
			},
		],
		// ['transform-remove-console', {exclude: ['error']}],
		[
			'component',
			{
				libraryName: 'element-ui',
				styleLibraryName: 'theme-chalk',
			},
		],
	],
	// comments: false,
};
