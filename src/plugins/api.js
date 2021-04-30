/**
 * API CONSTRUCTION ClASS
 * ========================================================================
 * 该类负责构建生成对应全局API对象。API对象可以通过直接导入该类实例使用， 也可以
 * 通过在Vue组件中通过 this.$api 方式调用。注入方式请参考 inject.js
 * 例如：
 * this.$api['user/login'](params)
 * 或
 * import api from '@/plugins/api'
 *
 * api['user/login'](params)
 * ========================================================================
 * Author: Vicco Wang
 * Date: 2018.06.22
 */
import store from '../store'
import _assign from 'lodash/assign'
import _isEmpty from 'lodash/isEmpty'
import axios from 'axios'

// 为对象创建代理，该代理可以拦截和重新定义该对象的基本操作
function apiProxy (obj) {
  const handler = {
    get: function (obj, prop) {
      if (!obj[prop]) {
        throw new Error(`'${prop}'接口未定义或拼写错误！`)
      }
      return obj[prop]
    }
  }
  const p = new Proxy(obj, handler)
  return p
}

const install = function (Vue, opts = {}) {
    store.commit('SET_SYSCONFIG', opts)
    const {
      axiosRequestSucessFunc,
      axiosRequestFailFunc,
      axiosResponseSucessFunc,
      axiosResponseFailFunc } = require('../interceptors/axios')
    let axiosInstance = axios.create(opts.AXIOS_DEFAULT_CONFIG)
    // 注入request拦截器
    axiosInstance.interceptors.request.use(axiosRequestSucessFunc, axiosRequestFailFunc)
    // 注入response拦截器
    axiosInstance.interceptors.response.use(axiosResponseSucessFunc, axiosResponseFailFunc)

    class ApiCounstructor {
      //
      constructor (options) {
        this.api = Object.create(null)
        this.debugApi = []
        this.apiBuilder(options)
      }
      //
      apiBuilder ({ apis = {}, devBaseUrl, prodBaseUrl, isDevMode = false, isDebug = false, sep = '/' }) {
        Object.keys(apis).forEach(namespace => {
          this.buildApiWidthNamespace({ namespace, apis: apis[namespace], isDevMode, isDebug, devBaseUrl, prodBaseUrl, sep })
        })
      }
    
      buildApiWidthNamespace ({ namespace, apis, devBaseUrl, prodBaseUrl, isDevMode, isDebug, sep }) {
        apis.forEach(api => {
          const { name, method, path, mockPath, params, desc } = api
          const apiNamespace = `${namespace}${sep}${name}`
          const url = isDevMode ? `${devBaseUrl}${mockPath}` : `${prodBaseUrl}${path}`
    
          Object.defineProperty(this.api, apiNamespace, {
            value (outerParams, outerOptions) {
              // 如果没传入参数 则传递默认参数
              // const data = _isEmpty(outerParams) ? params : _assign(params, outerParams) // assign合并对象, 会修改源对象(params)的值, 页面同一个api多次请求(传递参数不同)可能导致参数混乱问题
              const data = _isEmpty(outerParams) ? params : { ...params, ...outerParams }
              // 开启debug时打印一些提示信息
              isDebug && console.info(`调用业务接口名称:${apiNamespace}, 类型:${method}, 地址:${url}, 描述:${desc}`)
              //
              return axiosInstance(axiosParamBuilder(_assign({ url, method, desc }, outerOptions), data))
            }
          })
        })
      }
    }
    Vue.prototype.$api = apiProxy(new ApiCounstructor({ apis: opts.APIOBJ, ...opts.API_DEFAULT_CONFIG })['api'])
}

function axiosParamBuilder (options, data) {
  if (options.method === 'POST' ||
      options.method === 'PUT' ||
      options.method === 'PATCH') {
    options.data = data
  } else if (options.method === 'GET') { options.params = data }
  return options
}

export default {
  install
}

