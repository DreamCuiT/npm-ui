// initialize base framework
import Vue from 'vue'
import config from '@/config'
import store from '@/plugins/store'
import inject from '@/plugins/inject'
import router from '@/plugins/router'
import App from './App'

import echarts from 'echarts'
import Validate from '@/utils/extendValidate/extendValidate.js'
import { P8Contextmenu as Contextmenu, P8ContextmenuItem as ContextmenuItem, P8InfiniteScroll as InfiniteScroll } from '~/index'

// p8组件测试
import p8 from '~/index'
import api from '~/plugins/api'
import p8Config from '@/config/p8Config'
import 'packages/theme-chalk/lib/index.css'


Vue.use(p8)
Vue.use(api, p8Config)
// 全局配置项
Vue.use(config)
// 注入自定义组件和方法
Vue.use(inject)
// 无限滚动
Vue.use(InfiniteScroll)
// 表单校验
Vue.use(Validate)
Vue.component('v-contextmenu', Contextmenu)
Vue.component('v-contextmenu-item', ContextmenuItem)

// echarts 图表插件
Vue.prototype.$echarts = echarts
new Vue({
  el: '#app',
  store,
  router,
  components: {
    App
  },
  template: '<App/>'
})
