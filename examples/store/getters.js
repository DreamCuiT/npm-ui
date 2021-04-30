const getters = {
  // 用户
  userInfo: state => state.user.userInfo,
  userAccount: state => state.user.userAccount,
  userName: state => state.user.userName,
  loginStatus: state => state.user.loginStatus,
  userId: state => state.user.userId,
  avatar: state => state.user.avatar,
  token: state => state.user.token,
  roles: state => state.user.roles,
  messageInfo: state => state.user.messageInfo,
  messageNum: state => state.user.messageNum,
  userSettingAll: state => state.user.userSettingAll,
  ganttButtonMode: state => state.user.ganttButtonMode, // gantt操作按钮单行双行模式配置
  ganttRightButtons: state => state.user.ganttRightButtons, // gantt右键菜单配置
  // table行上权限按钮
  // buttonLimit: state => state.project.buttonLimit,
  // // 配置项信息：项目状态/计划状态/任务状态
  // dicConfig: state => state.project.dicConfig,
  // // 基础配置项: 例如系统名称\logo等
  // baseConfig: state => state.project.baseConfig,
  // // 基础项: 系统密级
  // systemSecretConfig: state => state.project.systemSecretConfig
}

export default getters
