const files = require.context('.', false, /\.js$/);
const modules = {};

files.keys().forEach(key => {
    if (key !== './index.js') {
        modules[key.replace(/(\.\/|\.js$)/gi, '')] = files(key).default
    }
});

export default modules;