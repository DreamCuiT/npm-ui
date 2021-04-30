// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from './store/store'
import sysConfig from './sysConfig'
import 'element-ui/lib/theme-chalk/index.css'
// import '../dist/theme-chalk/lib/index.css'
import './p8-variables.scss'
import p8 from '../dist/index'
import inject from '../dist/inject'
import api from '../dist/api'
import APIOBJ from './api'
Vue.use(p8)
Vue.use(inject)
Vue.use(api, {...sysConfig,...{APIOBJ}})
Vue.use(Vuex)
Vue.config.productionTip = false
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
