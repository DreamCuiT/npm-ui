'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  useEslint: false,
  BASE_URL: '../p8VuePlatform/public/'
})
