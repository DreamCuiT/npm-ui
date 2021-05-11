/**
 * USER API
 * Namespace: User
 */

export const commonResourcesImplementationApi = {

    commonResourcesImplementation: [
        {
            name: 'list',
            method: 'POST',
            path: '/product/taskplanCommonResources/list',
            mockPath: '/product/taskplanCommonResources/list',
            desc: '共性资源执行情况-列表'
        },
        {
            name: 'info',
            method: 'POST',
            path: '/product/taskplanCommonResources/info',
            mockPath: '/product/taskplanCommonResources/info',
            desc: '共性资源计划详情-列表'
        }
    ],
    commonResourcesPlan: [
        {
            name: 'myTaskPlan',
            method: 'POST',
            path: '/product/taskplanCommonResources/myTaskPlan',
            mockPath: '/product/taskplanCommonResources/myTaskPlan',
            desc: '共性资源计划-列表'
        },
        {
            name: 'myTaskStatusSave',
            method: 'POST',
            path: '/product/taskplanCommonResources/myTaskStatusSave',
            mockPath: '/product/taskplanCommonResources/myTaskStatusSave',
            desc: '我的任务-共性资源状态更新'
        },
        {
            name: 'getCommResourcesPlanById',
            method: 'GET',
            path: '/product/taskplanCommonResources/getCommResourcesPlanById',
            mockPath: '/product/taskplanCommonResources/getCommResourcesPlanById',
            desc: '我的任务-共性资源任务'
        },
        {
            name: 'plan',
            method: 'POST',
            path: '/product/taskplanCommonResources/plan',
            mockPath: '/product/taskplanCommonResources/plan',
            desc: '共性资源计划-列表'
        },
        {
            name: 'analysis',
            method: 'POST',
            path: '/product/taskplanCommonResources/analysis',
            mockPath: '/product/taskplanCommonResources/analysis',
            desc: '共性资源分析-列表'
        },
        {
            name: 'completion',
            method: 'POST',
            path: '/product/taskplanCommonResources/completion',
            mockPath: '/product/taskplanCommonResources/completion',
            desc: '共性资源完成度-列表'
        },
        {
            name: 'comResourceDutyUserSave',
            method: 'POST',
            path: '/product/taskplanCommonResources/comResourceDutyUserSave',
            mockPath: '/product/taskplanCommonResources/comResourceDutyUserSave',
            desc: '共性资源-列表修改保存责任人'
        },
        {
            name: 'getModelListData',
            method: 'POST',
            path: '/product/modelInformation/getModelListData',
            mockPath: '/product/modelInformation/getModelListData',
            desc: '所属型号-查询'
        }
    ]
}
