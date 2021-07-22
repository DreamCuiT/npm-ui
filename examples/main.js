// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from './store/store'

import { IEVersion } from '~/utils/common'
import 'element-ui/lib/theme-chalk/index.css';
// import "../packages/theme-chalk/src/index.scss";
Vue.prototype.$bus = new Vue() 
// 测试打包
import p8 from '../dist/index'
// import api from '../dist/api'
// 测试开发
// import p8 from '../src/index'
// import api from '../src/plugins/api'

Vue.use(api, {...sysConfig,...{APIOBJ}})
Vue.use(p8)
Vue.use(inject)
Vue.use(Vuex)
Vue.config.productionTip = false

if (IEVersion() === 11) {
  import('./isIE11.scss')
}else{
  import('./p8-variables.scss')
}

new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
