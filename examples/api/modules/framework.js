/**
 * framework API
 * Namespace: framework
 */

export const system = {
  // 第三方接口平台
  thirdPartInterface: [{
    name: 'serviceList',
    method: 'POST',
    path: '/framework/system/ThirdPartService/serviceList',
    mockPath: '/framework/system/ThirdPartService/serviceList',
    params: {},
    desc: '第三方接口管理-列表'
  },
  {
    name: 'bindService',
    method: 'POST',
    path: '/framework/system/ThirdPartService/bindService',
    mockPath: '/framework/system/ThirdPartService/bindService',
    params: {},
    desc: '第三方接口管理-修改保存'
  },
  {
    name: 'getDic',
    method: 'POST',
    path: '/framework/system/BpDictionary/getDic',
    mockPath: '/framework/system/BpDictionary/getDic',
    // params: {},
    desc: '数据字典'
  },
  {
    name: 'unBindConfigList',
    method: 'POST',
    path: '/framework/system/ThirdPartService/unBindConfigList',
    mockPath: '/framework/system/ThirdPartService/unBindConfigList',
    params: {},
    desc: '第三方接口管理-查询所有未绑定的配置'
  },
  {
    name: 'unBindServiceList',
    method: 'POST',
    path: '/framework/system/ThirdPartService/unBindServiceList',
    mockPath: '/framework/system/ThirdPartService/unBindServiceList',
    params: {},
    desc: '第三方接口管理-获取所有未绑定的实现类'
  },
  {
    name: 'heartInterfaceList',
    method: 'POST',
    path: '/framework/system/ThirdPartService/heartServiceList',
    mockPath: '/framework/system/ThirdPartService/heartServiceList',
    params: {},
    desc: '第三方接口管理-获取所有心跳接口'
  },
  {
    name: 'serviceRemove',
    method: 'POST',
    path: '/framework/system/ThirdPartService/serviceRemove',
    mockPath: '/framework/system/ThirdPartService/serviceRemove',
    params: {},
    desc: '第三方接口管理-删除'
  },
  {
    name: 'logListData',
    method: 'POST',
    path: '/framework/system/ThirdPartService/serviceLogList',
    mockPath: '/framework/system/ThirdPartService/serviceLogList',
    params: {},
    desc: '第三方接口管理>执行记录列表'
  },
  {
    name: 'retryListData',
    method: 'POST',
    path: '/framework/system/ThirdPartService/serviceRetryList',
    mockPath: '/framework/system/ThirdPartService/serviceRetryList',
    params: {},
    desc: '第三方接口异常监控>列表'
  },
  {
    name: 'doServiceRetry',
    method: 'POST',
    path: '/framework/system/ThirdPartService/doServiceRetry',
    mockPath: '/framework/system/ThirdPartService/doServiceRetry',
    params: {},
    desc: '第三方接口管理>接口异常手动处理'
  },
  {
    name: 'retryDetailList',
    method: 'POST',
    path: '/framework/system/ThirdPartService/retryList',
    mockPath: '/framework/system/ThirdPartService/retryList',
    params: {},
    desc: '第三方接口异常监控>接口异常详情列表'
  },
  {
    name: 'doRetry',
    method: 'POST',
    path: '/framework/system/ThirdPartService/doRetry',
    mockPath: '/framework/system/ThirdPartService/doRetry',
    params: {},
    desc: '第三方接口管理>接口异常单条手动处理'
  },
  {
    name: 'getYear',
    method: 'POST',
    path: '/framework/system/ThirdPartService/getYear',
    mockPath: '/framework/system/ThirdPartService/getYear',
    params: {},
    desc: '第三方接口管理>接口异常单条手动处理'
  }, {
    name: 'getThirdpartUser',
    method: 'POST',
    path: '/framework/system/ThirdPartService/user',
    mockPath: '/framework/system/ThirdPartService/user',
    desc: '获取三方接口用户'
  }],
  schedulerTask: [
    {
      name: 'list',
      method: 'POST',
      path: '/framework/scheduler/schedulerTask/list',
      mockPath: '/framework/scheduler/schedulerTask/list',
      params: {},
      desc: '定时任务管理-列表'
    },
    {
      name: 'save',
      method: 'POST',
      path: '/framework/scheduler/schedulerTask/save',
      mockPath: '/framework/scheduler/schedulerTask/save',
      params: {},
      desc: '定时任务管理-列表'
    },
    {
      name: 'forbiddenOrNormal',
      method: 'POST',
      path: '/framework/scheduler/schedulerTask/forbiddenOrNormal',
      mockPath: '/framework/scheduler/schedulerTask/forbiddenOrNormal',
      params: {},
      desc: '定时任务管理-启用或者禁用'
    },
    {
      name: 'delete',
      method: 'POST',
      path: '/framework/scheduler/schedulerTask/delete',
      mockPath: '/framework/scheduler/schedulerTask/delete',
      params: {},
      desc: '定时任务管理-删除'
    },
    {
      name: 'futureLaunch',
      method: 'POST',
      path: '/framework/scheduler/schedulerTask/futureLaunch',
      mockPath: '/framework/scheduler/schedulerTask/futureLaunch',
      params: {},
      desc: '定时任务管理-启动'
    },
    {
      name: 'futureShutdown',
      method: 'POST',
      path: '/framework/scheduler/schedulerTask/futureShutdown',
      mockPath: '/framework/scheduler/schedulerTask/futureShutdown',
      params: {},
      desc: '定时任务管理-关闭'
    },
    {
      name: 'futureLaunchOrStop',
      method: 'POST',
      path: '/framework/scheduler/schedulerTask/futureLaunchOrStop',
      mockPath: '/framework/scheduler/schedulerTask/futureLaunchOrStop',
      params: {},
      desc: '定时任务管理-启动或停止'
    }
  ],
  workHomePage: [
    {
      name: 'menuModuleList',
      method: 'GET',
      path: '/framework/system/menuModule/menuModuleList',
      mockPath: '/framework/system/menuModule/menuModuleList',
      desc: '工作首页>快捷入口>项目模块数据'
    }
  ],
  projectTeamSetting: [
    {
      name: 'listData',
      method: 'POST',
      path: '/framework/projectTeamSetting/teamPage/get',
      mockPath: '/framework/projectTeamSetting/teamPage/get',
      params: {},
      desc: '系统设置>功能设置>资源管理>项目团队设置>列表'
    },
    {
      name: 'create',
      method: 'POST',
      path: '/framework/projectTeamSetting/create',
      mockPath: '/framework/projectTeamSetting/create',
      params: {},
      desc: '系统设置>功能设置>资源管理>项目团队设置>修改保存'
    },
    {
      name: 'detail',
      method: 'POST',
      path: '/framework/projectTeamSetting/detail',
      mockPath: '/framework/projectTeamSetting/detail',
      params: {},
      desc: '系统设置>功能设置>资源管理>项目团队设置>获取修改数据'
    },
    {
      name: 'remove',
      method: 'POST',
      path: '/framework/projectTeamSetting/remove',
      mockPath: '/framework/projectTeamSetting/remove',
      params: {},
      desc: '系统设置>功能设置>资源管理>项目团队设置>删除'
    },
    {
      name: 'useState',
      method: 'POST',
      path: '/framework/projectTeamSetting/useState',
      mockPath: '/framework/projectTeamSetting/useState',
      params: {},
      desc: '系统设置>功能设置>资源管理>项目团队设置>启用停用'
    },
    {
      name: 'repeatedCheck',
      method: 'POST',
      path: '/framework/projectTeamSetting/repeatedCheck',
      mockPath: '/framework/projectTeamSetting/repeatedCheck',
      params: {},
      desc: '系统设置>功能设置>资源管理>项目团队设置>团队名称校验'
    },
    {
      name: 'getRole',
      method: 'POST',
      path: '/framework/projectTeamSetting/getRoleData',
      mockPath: '/framework/projectTeamSetting/getRoleData',
      params: {},
      desc: '系统设置>功能设置>资源管理>项目团队设置>团队名称校验'
    },
    {
      name: 'projectType',
      method: 'POST',
      path: '待提供',
      mockPath: '待提供',
      params: {},
      desc: '系统设置>功能设置>资源管理>项目团队设置>获取项目类型'
    },
    {
      name: 'repeatedCheckClassify',
      method: 'POST',
      path: '/framework/projectTeamSetting/repeatedCheckClassify',
      mockPath: '/framework/projectTeamSetting/repeatedCheckClassify',
      params: {},
      desc: '系统设置>功能设置>资源管理>项目团队设置>项目类型重复校验'
    }
  ],
  userManager: [
    {
      name: 'dicData',
      method: 'POST',
      path: '/framework/system/BpDictionary/getDic',
      mockPath: '/framework/system/BpDictionary/getDic',
      desc: '人员管理-列表'
    },
    {
      name: 'list',
      method: 'POST',
      path: '/framework/system/User/list',
      mockPath: '/framework/system/User/list',
      desc: '人员管理-列表'
    },
    {
      name: 'save',
      method: 'POST',
      path: '/framework/system/User/save',
      mockPath: '/framework/system/User/save',
      desc: '人员管理-保存'
    },
    {
      name: 'userInfo',
      method: 'POST',
      path: '/framework/system/User/userInfo',
      mockPath: '/framework/system/User/userInfo',
      desc: '人员信息'
    },
    {
      name: 'repeatedCheck',
      method: 'POST',
      path: '/framework/system/User/repeatedCheck',
      mockPath: '/framework/system/User/repeatedCheck',
      desc: '人员信息唯一性校验'
    },
    {
      name: 'remove',
      method: 'POST',
      path: '/framework/system/User/remove',
      mockPath: '/framework/system/User/remove',
      desc: '人员信息逻辑删除'
    },
    {
      name: 'unlock',
      method: 'POST',
      path: '/framework/system/User/unlock',
      mockPath: '/framework/system/User/unlock',
      desc: '已锁定人员解锁'
    },
    {
      name: 'safeSave',
      method: 'POST',
      path: '/framework/system/User/safeSave',
      mockPath: '/framework/system/User/safeSave',
      desc: '安全设置保存'
    },
    {
      name: 'deptTree',
      method: 'POST',
      path: '/framework/system/Department/deptTree',
      mockPath: '/framework/system/Department/deptTree',
      params: {},
      desc: '部门树导航'
    },
    {
      name: 'deptTreeByUserDepartment',
      method: 'POST',
      path: '/framework/system/Department/deptTreeByUserDepartment',
      mockPath: '/framework/system/Department/deptTreeByUserDepartment',
      params: {},
      desc: '登陆人的部门树'
    },
    {
      name: 'getThreeLvDept',
      method: 'POST',
      path: '/framework/system/Department/getThreeLvDept',
      mockPath: '/framework/system/Department/getThreeLvDept',
      params: {},
      desc: '三级单位名称'
    },
    {
      name: 'getRoles',
      method: 'POST',
      path: '/framework/system/Role/getRoles',
      mockPath: '/framework/system/Role/getRoles',
      params: {},
      desc: '普通角色选择'
    }
  ],
  PlanMonitor: [
    {
      name: 'planLogoListData',
      method: 'POST',
      path: '/framework/system/PlanLogo/listData',
      mockPath: '/framework/system/PlanLogo/listData',
      params: {},
      desc: '计划标识管理 列表'
    },
    {
      name: 'savePlanLogo',
      method: 'POST',
      path: '/framework/system/PlanLogo/save',
      mockPath: '/framework/system/PlanLogo/save',
      params: {},
      desc: '计划标识管理 修改保存'
    },
    {
      name: 'removePlanLogo',
      method: 'POST',
      path: '/framework/system/PlanLogo/remove',
      mockPath: '/framework/system/PlanLogo/remove',
      params: {},
      desc: '计划标识管理 删除'
    },
    {
      name: 'planLogoUseState',
      method: 'POST',
      path: '/framework/system/PlanLogo/useState',
      mockPath: '/framework/system/PlanLogo/useState',
      params: {},
      desc: '计划标识管理 启用停用'
    },
    {
      name: 'checkName',
      method: 'POST',
      path: '/framework/system/PlanLogo/repeatedCheck',
      mockPath: '/framework/system/PlanLogo/repeatedCheck',
      params: {},
      desc: '计划标识管理 标识名称校验'
    },
    {
      name: 'getRoleData',
      method: 'POST',
      path: '/framework/system/PlanLogo/getRoleData',
      mockPath: '/framework/system/PlanLogo/getRoleData',
      params: {},
      desc: '计划标识管理  系统角色数据查询'
    },
    {
      name: 'getMonitorPointData',
      method: 'POST',
      path: '/framework/system/PlanLogo/getMonitorPointData',
      mockPath: '/framework/system/PlanLogo/getMonitorPointData',
      params: {},
      desc: '计划标识管理   依赖互斥标识查询'
    },
    {
      name: 'getMonitorPointDataInfo',
      method: 'POST',
      path: '/framework/system/PlanLogo/getMonitorPointDataInfo',
      mockPath: '/framework/system/PlanLogo/getMonitorPointDataInfo',
      params: {},
      desc: '计划标识管理   标识详情查询'
    }
  ],
  role: [
    {
      name: 'list',
      method: 'POST',
      path: '/framework/system/Role/list',
      mockPath: '/framework/system/Role/list',
      params: {},
      desc: '角色列表'
    },
    {
      name: 'getPermissions',
      method: 'POST',
      path: '/framework/system/Role/getPermissions',
      mockPath: '/framework/system/Role/getPermissions',
      params: {},
      desc: '获取所有权限资源'
    },
    {
      name: 'save',
      method: 'POST',
      path: '/framework/system/Role/save',
      mockPath: '/framework/system/Role/save',
      params: {},
      desc: '角色保存'
    },
    {
      name: 'getRole',
      method: 'POST',
      path: '/framework/system/Role/getRole',
      mockPath: '/framework/system/Role/getRole',
      params: {},
      desc: '获取指定角色信息'
    },
    {
      name: 'repeatedCheck',
      method: 'POST',
      path: '/framework/system/Role/repeatedCheck',
      mockPath: '/framework/system/Role/repeatedCheck',
      params: {},
      desc: '角色唯一性校验'
    },
    {
      name: 'remove',
      method: 'POST',
      path: '/framework/system/Role/remove',
      mockPath: '/framework/system/Role/remove',
      params: {},
      desc: '角色删除'
    }
  ],
  departmentManger: [
    {
      name: 'list',
      method: 'POST',
      path: '/framework/system/Department/list',
      mockPath: '/framework/system/Department/list',
      desc: '部门管理-列表'
    },
    {
      name: 'save',
      method: 'POST',
      path: '/framework/system/Department/save',
      mockPath: '/framework/system/Department/save',
      desc: '部门-保存'
    },
    {
      name: 'remove',
      method: 'POST',
      path: '/framework/system/Department/remove',
      mockPath: '/framework/system/Department/remove',
      desc: '部门-删除'
    },
    {
      name: 'moveUser',
      method: 'POST',
      path: '/framework/system/Department/moveUser',
      mockPath: '/framework/system/Department/moveUser',
      desc: '部门-人员转移'
    },
    {
      name: 'deptTree',
      method: 'POST',
      path: '/framework/system/Department/deptTree',
      mockPath: '/framework/system/Department/deptTree',
      desc: '部门-选择树'
    },
    {
      name: 'repeatedCheck',
      method: 'POST',
      path: '/framework/system/Department/repeatedCheck',
      mockPath: '/framework/system/Department/repeatedCheck',
      desc: '部门-名称重复校验'
    },
    {
      name: 'deptInfo',
      method: 'POST',
      path: '/framework/system/Department/deptInfo',
      mockPath: '/framework/system/Department/deptInfo',
      desc: '部门详情查询'
    }
  ],
  secretLevel: [
    {
      name: 'list',
      method: 'POST',
      path: '/framework/system/SecretLevel/list',
      mockPath: '/framework/system/SecretLevel/list',
      params: {},
      desc: '密级列表'
    },
    {
      name: 'save',
      method: 'POST',
      path: '/framework/system/SecretLevel/save',
      mockPath: '/framework/system/SecretLevel/save',
      desc: '密级保存'
    },
    {
      name: 'remove',
      method: 'POST',
      path: '/framework/system/SecretLevel/remove',
      mockPath: '/framework/system/SecretLevel/remove',
      params: {},
      desc: '密级删除'
    },
    {
      name: 'getSecret',
      method: 'POST',
      path: '/framework/system/SecretLevel/getSecret',
      mockPath: '/framework/system/SecretLevel/getSecret',
      params: {},
      desc: '密级详情查询'
    },
    {
      name: 'repeatedCheck',
      method: 'POST',
      path: '/framework/system/SecretLevel/repeatedCheck',
      mockPath: '/framework/system/SecretLevel/repeatedCheck',
      params: {},
      desc: '密级唯一性检查'
    }
  ],
  systemLog: [
    {
      name: 'list',
      method: 'POST',
      path: '/framework/system/Log/list',
      mockPath: '/framework/system/Log/list',
      desc: '系统日志-日志列表'
    },
    {
      name: 'logModule',
      method: 'POST',
      path: '/framework/system/Log/logModule',
      mockPath: '/framework/system/Log/logModule',
      desc: '系统日志-下拉模块框'
    }
  ],
  SystemSettings: [
    {
      name: 'getBaseConfigSettings',
      method: 'POST',
      path: '/framework/system/SystemSettings/getBaseConfigSettings',
      mockPath: '/framework/system/SystemSettings/getBaseConfigSettings',
      desc: '获取配置项信息'
    },
    {
      name: 'saveBaseConfigSettings',
      method: 'POST',
      path: '/framework/system/SystemSettings/saveBaseConfigSettings',
      mockPath: '/framework/system/SystemSettings/saveBaseConfigSettings',
      desc: '保存配置项信息'
    },
    {
      name: 'getAppearanceSettings',
      method: 'POST',
      path: '/framework/system/SystemSettings/getAppearanceSettings',
      mockPath: '/framework/system/SystemSettings/getAppearanceSettings',
      desc: '外观设置-数据'
    },
    {
      name: 'saveAppearanceSettings',
      method: 'POST',
      path: '/framework/system/SystemSettings/saveAppearanceSettings',
      mockPath: '/framework/system/SystemSettings/saveAppearanceSettings',
      desc: '外观设置-保存'
    },
    {
      name: 'getBasicSetting',
      method: 'POST',
      path: '/framework/system/SystemSettings/getBasicSetting',
      mockPath: '/framework/system/SystemSettings/getBasicSetting',
      desc: '基本设置-数据'
    },
    {
      name: 'saveBasicSetting',
      method: 'POST',
      path: '/framework/system/SystemSettings/saveBasicSetting',
      mockPath: '/framework/system/SystemSettings/saveBasicSetting',
      desc: '基本设置-保存'
    },
    {
      name: 'download',
      method: 'POST',
      path: '/attachment/download',
      mockPath: '/attachment/download',
      desc: '下载'
    },
    {
      name: 'getFileUrl',
      method: 'POST',
      path: '/attachment/download',
      mockPath: '/attachment/download',
      desc: '下载'
    },
    // 获取项目标识、计划标识、任务标识等，后续增加logo等
    {
      name: 'getVuePlatfromInitConfig',
      method: 'POST',
      path: '/framework/system/SystemSettings/getVuePlatfromInitConfig',
      mockPath: '/framework/system/SystemSettings/getVuePlatfromInitConfig',
      desc: '获取页面初始化配置'
    }
  ],

  processApproval: [
    {
      name: 'pendingList',
      method: 'POST',
      path: '/bpm/personal/ProcessApproval/pendingList',
      mockPath: '/bpm/personal/ProcessApproval/pendingList',
      desc: '当前用户待审批列表数据'
    }
  ],
  commonInterface: [
    {
      name: 'configItem',
      method: 'POST',
      path: '/framework/system/SystemSettings/getBaseConfigSettings',
      mockPath: '/framework/system/SystemSettings/getBaseConfigSettings',
      params: {},
      desc: '配置项信息'
    }
  ],
  documentManagement: [
    {
      name: 'getAllDicByCodeType',
      method: 'GET',
      path: '/framework/system/BpDictionary/getAllDicByCodeType',
      mockPath: '/framework/system/BpDictionary/getAllDicByCodeType',
      params: {},
      desc: '获取字典列表数据'
    },
    {
      name: 'list',
      method: 'POST',
      path: '/framework/system/document/list',
      mockPath: '/framework/system/document/list',
      params: {},
      desc: '文档列表'
    },
    {
      name: 'listPage',
      method: 'POST',
      path: '/framework/system/document/listPage',
      mockPath: '/framework/system/document/listPage',
      params: {},
      desc: '文档列表'
    },
    {
      name: 'save',
      method: 'POST',
      path: '/framework/system/document/save',
      mockPath: '/framework/system/document/save',
      params: {},
      desc: '文档和文档管理保存'
    },
    {
      name: 'saveDocumentManagement',
      method: 'POST',
      path: '/framework/system/document/saveDocumentManagement',
      mockPath: '/framework/system/document/saveDocumentManagement',
      params: {},
      desc: '文档管理更新保存'
    },
    {
      name: 'delete',
      method: 'POST',
      path: '/framework/system/document/delete',
      mockPath: '/framework/system/document/delete',
      params: {},
      desc: '文档删除'
    },
    {
      name: 'saveClassify',
      method: 'POST',
      path: '/framework/system/document/saveClassify',
      mockPath: '/framework/system/document/saveClassify',
      params: {}, // 传递字典实体属性
      desc: '保存分类'
    },
    {
      name: 'deleteClassify',
      method: 'POST',
      path: '/framework/system/document/deleteClassify',
      mockPath: '/framework/system/document/deleteClassify',
      params: {}, // 传递id
      desc: '删除分类及分类下文档'
    },
    {
      name: 'download',
      method: 'POST',
      path: '/attachment/download',
      mockPath: '/attachment/download',
      desc: '下载'
    }
  ]
}

export const messageApi = {
  userMessage: [
    {
      name: 'catalog',
      method: 'POST',
      path: '/framework/system/BpDictionary/getDicList',
      mockPath: '/framework/system/BpDictionary/getDicList',
      params: { 'dicType': 'MESSAGE_TYPE', 'containRoot': true },
      desc: '个人消息管理分类目录'
    },
    {
      name: 'list',
      method: 'POST',
      path: '/framework/message/Message/list',
      mockPath: '/framework/message/Message/list',
      desc: '消息列表'
    },
    {
      name: 'myMessageTotal',
      method: 'POST',
      path: '/framework/message/Message/myMessageTotal',
      mockPath: '/framework/message/Message/myMessageTotal',
      desc: '消息数量'
    },
    {
      name: 'myWorkData',
      method: 'POST',
      path: '/framework/message/Message/myWorkData',
      mockPath: '/framework/message/Message/myWorkData',
      desc: '门户界面我的任务以及我的审批消息数量'
    },
    {
      name: 'toggleStatus',
      method: 'POST',
      path: '/framework/message/Message/toggleStatus',
      mockPath: '/framework/message/Message/toggleStatus',
      desc: '消息标记已读/未读'
    },
    {
      name: 'delete',
      method: 'POST',
      path: '/framework/message/Message/delete',
      mockPath: '/framework/message/Message/delete',
      desc: '消息删除'
    },
    {
      name: 'userCatalogCount',
      method: 'POST',
      path: '/framework/message/Message/userCatalogCount',
      mockPath: '/framework/message/Message/userCatalogCount',
      desc: '分类消息数',
      cancelLoading: true
    },
    {
      name: 'userUnReadMessageCount',
      method: 'POST',
      path: '/framework/message/Message/userUnReadMessageCount',
      mockPath: '/framework/message/Message/userUnReadMessageCount',
      desc: '获取用户未读消息总数'
    }
  ]
}

export const formGeneratorApi = {
  formGenerator: [
    // 组件列表
    {
      name: 'compList',
      method: 'POST',
      path: '/framework/desComp/list',
      mockPath: '/framework/desComp/list',
      desc: '表单设计器-组件管理-组件列表'
    },
    {
      name: 'compSave',
      method: 'POST',
      path: '/framework/desComp/save',
      mockPath: '/framework/desComp/save',
      desc: '表单设计器-组件管理-组件保存'
    },
    {
      name: 'compRemove',
      method: 'POST',
      path: '/framework/desComp/remove',
      mockPath: '/framework/desComp/remove',
      desc: '表单设计器-组件管理-组件删除'
    },
    // 表单设计器
    {
      name: 'designerDetails',
      method: 'POST',
      path: '/framework/desForm/index',
      mockPath: '/framework/desForm/index',
      desc: '表单设计器-表单设计详情'
    },
    {
      name: 'designerSave',
      method: 'POST',
      path: '/framework/desForm/desSave',
      mockPath: '/framework/desForm/desSave',
      desc: '表单设计器-表单设计保存'
    },
    {
      name: 'getFormDataBase',
      method: 'POST',
      path: '/framework/cgForm/getAllForm',
      mockPath: '/framework/cgForm/getAllForm',
      desc: '表单设计器-加载数据源'
    },
    {
      name: 'getFormFields',
      method: 'POST',
      path: '/framework/cgForm/getFormFields',
      mockPath: '/framework/cgForm/getFormFields',
      desc: '表单设计器-加载数据源所有字段'
    },
    {
      name: 'getFormFieldsList',
      method: 'POST',
      path: '/framework/cgForm/getDesFormFields',
      mockPath: '/framework/cgForm/getDesFormFields',
      desc: '表单设计器-加载列表所有字段'
    },
    {
      name: 'desCopy',
      method: 'POST',
      path: '/framework/desForm/desCopy',
      mockPath: '/framework/desForm/desCopy',
      desc: '表单设计器-表单复制功能'
    },
    // 表单列表
    {
      name: 'formList',
      method: 'POST',
      path: '/framework/desForm/list',
      mockPath: '/framework/desForm/list',
      desc: '表单设计器-表单列表-表单列表'
    },
    {
      name: 'formListSave',
      method: 'POST',
      path: '/framework/desForm/save',
      mockPath: '/framework/desForm/save',
      desc: '表单设计器-表单列表-表单保存'
    },
    {
      name: 'formListRemove',
      method: 'POST',
      path: '/framework/desForm/remove',
      mockPath: '/framework/desForm/remove',
      desc: '表单设计器-表单列表-表单删除'
    },
    {
      name: 'formListRelease',
      method: 'POST',
      path: '/framework/desForm/desRelease',
      mockPath: '/framework/desForm/desRelease',
      desc: '表单设计器-表单列表-表单发布'
    },
    // 表单调用
    {
      name: 'formCallSave',
      method: 'POST',
      path: '/framework/cgForm/dataSave',
      mockPath: '/framework/cgForm/dataSave',
      desc: '表单设计器-表单调用-表单保存'
    },
    {
      name: 'formCallDataDetails',
      method: 'POST',
      path: '/framework/cgForm/getFormData',
      mockPath: '/framework/cgForm/getFormData',
      desc: '表单设计器-表单调用-表单数据详情'
    },
    {
      name: 'formCallDataList',
      method: 'POST',
      path: '/framework/cgForm/dataList',
      mockPath: '/framework/cgForm/dataList',
      desc: '表单设计器-表单调用-表单数据列表'
    },
    {
      name: 'formCallDataRemove',
      method: 'POST',
      path: '/framework/cgForm/removeFormData',
      mockPath: '/framework/cgForm/removeFormData',
      desc: '表单设计器-表单调用-表单数据删除'
    },
    // 主从表组件
    {
      name: 'getChildTable',
      method: 'POST',
      path: '/framework/cgForm/getChildTable',
      mockPath: '/framework/cgForm/getChildTable',
      desc: '表单设计器-主从表组件-通过主表获取所有子表表名'
    },
    // 选项组件管理
    {
      name: 'getSelectionDetail',
      method: 'POST',
      path: '/framework/selection/view',
      mockPath: '/framework/selection/view',
      desc: '智能表单-选项组件管理-选项详情'
    },
    {
      name: 'getSelectionOption',
      method: 'POST',
      path: '/framework/selection/getSelectionOption',
      mockPath: '/framework/selection/getSelectionOption',
      desc: '智能表单-选项组件管理-获取选型下拉框'
    },
    {
      name: 'getSelectionConfig',
      method: 'POST',
      path: '/framework/selection/getSelectionConfig',
      mockPath: '/framework/selection/getSelectionConfig',
      desc: '智能表单-选项组件管理-根据选项ID获取配置参数'
    },
    {
      name: 'getSqlViewAllColumnBySelectionId',
      method: 'POST',
      path: '/framework/selection/getSqlViewAllColumnBySelectionId',
      mockPath: '/framework/selection/getSqlViewAllColumnBySelectionId',
      desc: '智能表单-选项组件管理-根据选项ID获取数据视图所有的列'
    },
    {
      name: 'getSelectionData',
      method: 'POST',
      path: '/framework/selection/getSelectionData',
      mockPath: '/framework/selection/getSelectionData',
      desc: '智能表单-选项组件管理-获取选项数据接口'
    },
    // 数据源管理
    {
      name: 'dataSourceList',
      method: 'POST',
      path: '/framework/cgForm/list',
      mockPath: '/framework/cgForm/list',
      desc: '数据源管理-数据源列表'
    },
    {
      name: 'dataSourceSave',
      method: 'POST',
      path: '/framework/cgForm/save',
      mockPath: '/framework/cgForm/save',
      desc: '数据源管理-数据源保存'
    },
    {
      name: 'dataSourceRemove',
      method: 'POST',
      path: '/framework/cgForm/remove',
      mockPath: '/framework/cgForm/remove',
      desc: '数据源管理-数据源删除'
    },
    {
      name: 'dataSourceFormView',
      method: 'POST',
      path: '/framework/cgForm/view',
      mockPath: '/framework/cgForm/view',
      desc: '数据源管理-获取数据源详细信息'
    },
    {
      name: 'dataSourceSync',
      method: 'POST',
      path: '/framework/cgForm/sync',
      mockPath: '/framework/cgForm/sync',
      desc: '数据源管理-数据源同步'
    },
    {
      name: 'getFieldList',
      method: 'POST',
      path: '/framework/cgForm/fieldList',
      mockPath: '/framework/cgForm/fieldList',
      desc: '数据源管理-获取所有字段类型'
    },
    {
      name: 'getDefaultProp',
      method: 'POST',
      path: '/framework/cgForm/getDefaultProp',
      mockPath: '/framework/cgForm/getDefaultProp',
      desc: '数据源管理-获取数据源默认属性'
    },
    // 报表 SQL管理
    {
      name: 'sqlList',
      method: 'POST',
      path: '/framework/reportSQL/list',
      mockPath: '/framework/reportSQL/list',
      desc: 'SQL管理-SQL列表'
    },
    {
      name: 'sqlSave',
      method: 'POST',
      path: '/framework/reportSQL/save',
      mockPath: '/framework/reportSQL/save',
      desc: 'SQL管理-SQL保存'
    },
    {
      name: 'sqlRemove',
      method: 'POST',
      path: '/framework/reportSQL/delete',
      mockPath: '/framework/reportSQL/delete',
      desc: 'SQL管理-SQL删除'
    },
    {
      name: 'sqlParseCheck',
      method: 'POST',
      path: '/framework/reportSQL/parseCheck',
      mockPath: '/framework/reportSQL/parseCheck',
      desc: 'SQL管理-SQL解析检查'
    },
    {
      name: 'sqlParam',
      method: 'POST',
      path: '/framework/reportSQL/sqlParam',
      mockPath: '/framework/reportSQL/sqlParam',
      desc: 'SQL管理-SQL参数'
    },
    // 报表管理
    {
      name: 'tableList',
      method: 'POST',
      path: '/framework/report/list',
      mockPath: '/framework/report/list',
      desc: '报表管理-报表列表'
    },
    {
      name: 'tableSave',
      method: 'POST',
      path: '/framework/report/save',
      mockPath: '/framework/report/save',
      desc: '报表管理-报表保存'
    },
    {
      name: 'tableRemove',
      method: 'POST',
      path: '/framework/report/delete',
      mockPath: '/framework/report/delete',
      desc: '报表管理-报表删除'
    },
    {
      name: 'tableSqlParse',
      method: 'POST',
      path: '/framework/report/parse',
      mockPath: '/framework/report/parse',
      desc: '报表管理-SQL解析'
    },
    {
      name: 'tableApply',
      method: 'POST',
      path: '/framework/report/apply',
      mockPath: '/framework/report/apply',
      desc: '报表管理-报表应用'
    },
    {
      name: 'tableColumnsInfo',
      method: 'POST',
      path: '/framework/report/reportItem',
      mockPath: '/framework/report/reportItem',
      desc: '报表管理-报表列表-列配置信息'
    },
    {
      name: 'tableParam',
      method: 'POST',
      path: '/framework/report/reportParam',
      mockPath: '/framework/report/reportParam',
      desc: '报表管理-报表列表-获取报表参数'
    },
    {
      name: 'tableButton',
      method: 'POST',
      path: '/framework/report/reportButton',
      mockPath: '/framework/report/reportButton',
      desc: '报表管理-报表列表-获取报表按钮'
    },
    {
      name: 'tableGetInfo',
      method: 'POST',
      path: '/framework/report/get',
      mockPath: '/framework/report/get',
      desc: '报表管理-报表列表-根据报表编码获取报表数据'
    }
  ]
}

export const ComponentManagerApi = {
  selection: [
    {
      name: 'list',
      method: 'POST',
      path: '/framework/selection/list',
      mockPath: '/framework/selection/list',
      desc: '组件管理-选项-1.6.1选项列表'
    },
    {
      name: 'save',
      method: 'POST',
      path: '/framework/selection/save',
      mockPath: '/framework/selection/save',
      desc: '组件管理-选项-1.6.0选项保存'
    },
    {
      name: 'getAllDictionaryType',
      method: 'POST',
      path: '/framework/selection/getAllDictionaryType',
      mockPath: '/framework/selection/getAllDictionaryType',
      desc: '组件管理-选项-1.6.5获取所有数据字典类型'
    },
    {
      name: 'getAllSqlview',
      method: 'POST',
      path: '/framework/selection/getAllSqlview',
      mockPath: '/framework/selection/getAllSqlview',
      desc: '组件管理-选项-1.6.6获取所有sql视图下拉框'
    },
    {
      name: 'getSqlViewAllColumn',
      method: 'POST',
      path: '/framework/selection/getSqlViewAllColumn',
      mockPath: '/framework/selection/getSqlViewAllColumn',
      desc: '组件管理-选项-1.6.9根据选项ID获取数据视图所有的列'
    },
    {
      name: 'getColumnsByReportId',
      method: 'POST',
      path: '/framework/selection/getColumnsByReportId',
      mockPath: '/framework/selection/getColumnsByReportId',
      desc: '组件管理-选项-1.6.13 根据表格ID获取表格SQL视图所有列'
    },
    {
      name: 'view',
      method: 'POST',
      path: '/framework/selection/view',
      mockPath: '/framework/selection/view',
      desc: '组件管理-选项-1.6.2选项详情'
    },
    {
      name: 'remove',
      method: 'POST',
      path: '/framework/selection/remove',
      mockPath: '/framework/selection/remove',
      desc: '组件管理-选项-1.6.3选项删除'
    },
    {
      name: 'getAllReport',
      method: 'POST',
      path: '/framework/selection/getAllReport',
      mockPath: '/framework/selection/getAllReport',
      desc: '组件管理-选项-1.6.11获取所有报表下拉框'
    },
    {
      name: 'preview',
      method: 'POST',
      path: '/framework/selection/preview',
      mockPath: '/framework/selection/preview',
      desc: '组件管理-选项-1.6.4选项预览'
    }
  ]
}
