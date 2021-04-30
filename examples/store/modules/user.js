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
    token: '',
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
  },

  actions: {}
}

export default user
