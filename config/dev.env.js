'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')


module.exports = merge(prodEnv, {
NODE_ENV: '"development"',
// API_ROOT:'"http://192.168.2.123:2089"'
API_ROOT:'"http://39.104.113.112:2089"'//家庭
// API_ROOT:'"http://39.104.113.112:20189"'//客服
})