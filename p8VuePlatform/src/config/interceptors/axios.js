/**
 * AXIOS Interceptors Configuration
 * =================================
 * Author: Vicco Wang
 * Date: 2018.06.22
 */
 import store from '@/plugins/store'
 import { MessageBox, Notification, Loading } from '~/index'
 // 遮罩
 let loading = {}
 /**
  * @export
  * @param {*} config
  * @returns
  */
 export function axiosRequestSucessFunc (config) {
   // dosth before request
   // config.headers['Content-type'] = 'application/x-www-form-urlencoded'
   const token = store.getters.token
   if (token) {
     config.headers['Authorization'] = token
     if (!config.cancelLoadingMask) {
       config.timeoutKey = setTimeout(loadingObject, 3000)
     }
   }
   return config
 }
 
 /**
  *
  *
  * @export
  * @param {*} error
  * @returns
  */
 export function axiosRequestFailFunc (error) {
   return Promise.reject(error)
 }
 /**
  *
  *
  * @export
  * @param {*} response
  * @returns
  */
 export function axiosResponseSucessFunc (response) {
   const timeoutKey = response.config.timeoutKey
   timeoutKey && clearTimeout(timeoutKey)
   response.config.responseFinish = true
 
   if (Object.keys(loading).length) {
    loading.close()
   }
   /**
    * response 基本格式如下
    * {
    *  ...
    *  status: 200,
    *  data: {
    *    head: { success: 'true' },
    *    data: { some data here }
    *  }
    *  ...
    * }
    */
   // response by remote server
   switch (response.status) {
     case 200:
     case 304:
       const contentType = response.headers['content-type']
       if (contentType.includes('application/json')) {
         const responseData = response.data
         const responseHead = responseData.head
         // response success and response data
         if (responseHead && responseHead.success === 'true') {
           return responseData.data
         } else {
           // case response data error code
           if (!(responseHead && responseHead.code)) {
             return Promise.reject(response.data)
           }
           switch (responseHead.code) {
             case '401':
               // 权限不够,重新登录
               // 如果是登录时用户名或密码错误，则给出提示
               // 如果同一个账号，不同电脑登录，被踢掉时，给出提示
 
               if (responseHead.message === '用户名或密码错误') {
                 Notification.error({
                   title: '提示',
                   message: responseHead.message
                 })
               } else if (responseHead.message === '授权信息无效，请重新授权!') {
                 MessageBox.alert(responseHead.message, '提示', {
                   confirmButtonText: '确定',
                   type: 'warning',
                   callback: (action) => {
                     store.dispatch('userLogout').then(() => {
                       location.reload()
                     })
                   }
                 })
               } else {
                 store.dispatch('userLogout').then(() => {
                   location.reload()
                 })
               }
               return Promise.reject(response.data).catch(() => {})
 
             case '500':
               // eslint-disable-next-line no-undef
               if (!CHECK_PRODUCTION_ERROR_TIP) {
                 if (process.env.NODE_ENV !== 'production') {
                   Notification.error({
                     title: '提示',
                     message: responseHead.message
                   })
                 }
               } else {
                 Notification.error({
                   title: '提示',
                   message: responseHead.message
                 })
               }
 
               return false
             default:
               return Promise.reject(response.data)
           }
         }
       } else {
         return response
       }
 
     default:
       return Promise.reject(response.data)
   }
 }
 
 export function axiosResponseFailFunc (error, config) {
   if (config) {
     const timeoutKey = config.timeoutKey
     timeoutKey && clearTimeout(timeoutKey)
   }
  //  loadingObject().close()
   if (Object.keys(loading).length) {
    loading.close()
   }
   return Promise.reject(error)
 }
 
 function loadingObject () {
   loading = Loading.service({text: '加载中...'})
   return loading
 }
 