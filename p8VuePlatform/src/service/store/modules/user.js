import { Notification } from '~/index'
import { getToken, setToken, removeToken } from '@/service/expands/auth'
import api from '@/plugins/api'
import moment from 'moment'
/**
 * User STORE
 */

const user = {
  state: {
    userId: '',
    userAccount: '',
    userName: '',
    userStatus: '',
    loginStatus: false,
    // avatar: '../static/myAvatar200.png', // static
    token: getToken(),
    roles: null, // 权限应该是返回个数组对象
    confidentialiteList: [], // 用户密级,
    userSettingAll: {}, // 用户配置信息
    ganttButtonMode: 'double', // gantt操作按钮采用单行还是双行模式
    ganttRightButtons: [], // gantt右键菜单
    userInfo: {}, // 用于JT智能表单的系统级参数
    sysVars: { // 用于智能表单的系统级参数
      props: {}, // 参数变量，以$开头，例如：$SYSTEM_PARAMS_SELECT.username
      methods: { // 方法变量，以#开头，例如：#getFormFillingTime
        getFormFillingTime: function () { // 表单填报时间
          return moment(new Date()).format('YYYY-MM-DD')
        }
      }
    },
    messageInfo: [], // 用户消息信息
    messageNum: [] // 用户消息已读未读条数
  },

  mutations: {
    SET_TOKEN (state, token) {
      if (token) {
        state.token = token
        setToken(token)
      }
    },
    REMOVE_TOKEN (state, data) {
      state.token = null
      removeToken()
    },
    SET_USERINFO (state, data) {
      state.userInfo = data
      state.userId = data.id
      // state.userAccount = data.userAccount
      state.userName = data.realName
      // state.userStatus = data.userStatus
      state.roles = data.userRoles // static roles
      // state.avatar = data.avatar
      state.confidentialiteList = (data.confidentialiteList && data.confidentialiteList.length) ? data.confidentialiteList.map(({ name, id }) => {
        return {
          label: name,
          value: id
        }
      }) : []
    },
    RESET_USERINFO (state, data) {
      // state.userId = ''
      state.userInfo = {}
      state.userAccount = ''
      state.userName = ''
      state.userStatus = ''
      // state.avatar = ''
      state.roles = null
      state.confidentialiteList = []
    },
    SET_LOGIN_STATUS (state, data) {
      state.loginStatus = data
      console.log(state.loginStatus, 'state.loginStatus')
    },
    SET_SETTING_ALL (state, data) {
      console.log('SET_SETTING_ALL', data)
      state.userSettingAll = data
      if (data.PlanButton && data.PlanButton.length) {
        state.ganttButtonMode = data.PlanButton[0].value.type || 'double'
        state.ganttRightButtons = data.PlanButton[0].value.rightBtns || []
      }
    },
    SET_MESSAGEINFO (state, data) {
      state.messageInfo = data
    },
    SET_MESSAGENUM (state, data) {
      state.messageNum = data
    }
  },

  actions: {
    /**
     * 用户登录
     * 需要通过mutation在浏览器中创建Token cookie保证一定的登录实效性;
     *
     * @param {any} {commit}
     * @param {any} params
     * @returns
     */
    userLogin ({ commit, state }, params) {
      return new Promise((resolve, reject) => {
        api['user.login'](params).then(res => {
          commit('SET_TOKEN', res.token)
          resolve()
        }).catch(err => {
          if (err.toString().indexOf('Network Error') !== -1) {
            Notification.error({
              title: '提示',
              message: '接口异常',
              type: 'error',
              offset: 40
            })
          }
          reject(err)
        })
      })
    },
    /**
     * 用户注销
     * 需要通过mutations移除浏览器的Token cookie,并做一些相关注销处理
     *
     * @param {any} {commit}
     * @returns
     */
    userLogout ({ commit }) {
      return new Promise((resolve, reject) => {
        api['user.logout']().then(() => {
          // 重置用户相关信息
          commit('REMOVE_TOKEN')
          // 重置用户信息
          commit('RESET_USERINFO')
          // 重置浏览记录以及tab页面记录等,该mutation访问 store/views.js
          commit('REMOVE_ALL_VISITED')
          // 重置权限路由表, 该mutation 访问 store/asyncRouter.js
          commit('RESET_ROUTERS')
          //
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    /**
     * 获取用户信息
     * 返回当前用户的基础信息
     *
     * @param {any} {commit}
     * @param {any} params
     * @returns
     */
    getUserInfo ({ commit, state }, params) {
      return new Promise((resolve, reject) => {
        api['user.info']()
          .then(res => {
            if (res) {
              commit('SET_USERINFO', res)
              resolve(res)
            }
          }).catch(err => {
            reject(err)
          })
      })
    },
    /**
     * 获取用户登录状态（记住登录状态orNo）
     * 返回当前用户的登录状态
     *
     * @param {any} {commit}
     * @param {any} params
     * @returns
     */
    setLoginState ({ commit }, data) {
      commit('SET_LOGIN_STATUS', data)
    },
    /**
     * 获取用户设置信息
     * 返回用户的设置信息
     *
     * @param {any} {commit}
     * @returns
     */
    getSettingAll ({ commit }) {
      return new Promise((resolve, reject) => {
        api['user.setting.getAll']()
          .then(res => {
            if (res) {
              commit('SET_SETTING_ALL', res)
              resolve(res)
            }
          }).catch(err => {
            reject(err)
          })
      })
    },
    /**
     * 获取消息信息
     * 返回当前用户的消息信息
     *
     * @param {any} {commit}
     * @param {any} params
     * @returns
     */
    getMessageInfo ({ commit, state }, params) {
      return new Promise((resolve, reject) => {
        api['userMessage.catalog']()
          .then(res => {
            if (res) {
              commit('SET_MESSAGEINFO', res)
              resolve(res)
            }
          }).catch(err => {
            reject(err)
          })
      })
    },
    /**
     * 获取消息信息已读未读条数
     * 返回当前用户的消息信息已读未读条数
     *
     * @param {any} {commit}
     * @param {any} params
     * @returns
     */
    getMessageNum ({ commit, state }, params) {
      return new Promise((resolve, reject) => {
        api['userMessage.userCatalogCount']({ msgCatalog: '' })
          .then(res => {
            if (res) {
              commit('SET_MESSAGENUM', res)
              resolve(res)
            }
          }).catch(err => {
            reject(err)
          })
      })
    }
  }

}

export default user
