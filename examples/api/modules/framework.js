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