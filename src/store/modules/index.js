const files = require.context('.', false, /\.js$/);
const modules = {};

files
	.keys()
	.forEach(
		(key) =>
			key !== './index.js' && (modules[key.replace(/(\.\/|\.js$)/gi, '')] = files(key).default)
	);
export default modules;
