// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from './store/store'

import 'element-ui/lib/theme-chalk/index.css';
import '../dist/theme-chalk/lib/index.css'
Vue.prototype.$bus = new Vue() 
// import './p8-variables.scss'
// 测试打包
// import p8 from '../dist/index'
// import api from '../dist/api'
// 测试开发
import p8 from '../src/index'
// import api from '../src/plugins/api'

// import sysConfig from './sysConfig'
// Vue.use(api, sysConfig)
Vue.use(p8)
Vue.use(Vuex)
Vue.config.productionTip = false
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
