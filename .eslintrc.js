const IS_DEV = process.env.NODE_ENV !== 'production';
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'no-console': IS_DEV ? 'off' : 'error',
    'no-debugger': IS_DEV ? 'off' : 'error',
    'no-unused-vars': 'off',
    'indent': [0, 4],
    'space-in-parens': [0, "never"],
    'no-unneeded-ternary': 2, //禁止不必要的嵌套
    'prettier/prettier': 'warn',
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  globals: {
    'document': true,
    'localStorage': true,
    'window': true
  },
  plugins: ['prettier'],
};
