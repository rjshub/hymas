module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    "plugin:vue/recommended"
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "vue/no-unused-vars": "off",
    "vue/no-unused-components": "off",
    "vue/return-in-computed-property": "warning",
    "vue/no-use-v-if-with-v-for": "warning",
    "vue/no-side-effects-in-computed-properties": "warning",
    "vue/no-reserved-keys": "warning",
    "vue/require-v-for-key": "warning"
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
