import store from '../store'
import axios from 'axios'

import {
  axiosRequestSucessFunc,
  axiosRequestFailFunc,
  axiosResponseSucessFunc,
  axiosResponseFailFunc }
  from '../interceptors/axios'

const { AXIOS_DEFAULT_CONFIG } = store.state.SET_SYSCONFIG

  let axiosInstance = axios.create(AXIOS_DEFAULT_CONFIG)
  // 注入request拦截器
  axiosInstance.interceptors.request.use(axiosRequestSucessFunc, axiosRequestFailFunc)
  // 注入response拦截器
  axiosInstance.interceptors.response.use(axiosResponseSucessFunc, axiosResponseFailFunc)
  
  export default axiosInstance

