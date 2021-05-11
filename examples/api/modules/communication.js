/**
 * USER API
 * Namespace: User
 */

export const CommunicationApi = {

    importantReception: [
        {
            name: 'list',
            method: 'POST',
            path: '/communication/importantReception/list',
            mockPath: '/communication/importantReception/list',
            desc: '重大接待-列表'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/communication/importantReception/save',
            mockPath: '/communication/importantReception/save',
            desc: '重大接待-保存'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/communication/importantReception/remove',
            mockPath: '/communication/importantReception/remove',
            desc: '重大接待-删除'
        },
        {
            name: 'getInfo',
            method: 'POST',
            path: '/communication/importantReception/getImportantReceptionInfo',
            mockPath: '/communication/importantReception/getImportantReceptionInfo',
            params: {},
            desc: '重大接待-详情查询'
        },
        {
            name: 'getInfoList',
            method: 'POST',
            path: '/communication/importantReception/getImportantReceptionInfoList',
            mockPath: '/communication/importantReception/getImportantReceptionInfoList',
            params: {},
            desc: '重大接待-详情查询'
        }
    ],
    memorabilia: [
        {
            name: 'save',
            method: 'POST',
            path: '/communication/memorabilia/save',
            mockPath: '/communication/memorabilia/save',
            desc: '大事记-新建'
        },
        {
            name: 'saveInfo',
            method: 'POST',
            path: '/communication/memorabilia/saveInfo',
            mockPath: '/communication/memorabilia/saveInfo',
            desc: '大事记-编辑'
        },
        {
            name: 'detail',
            method: 'POST',
            path: '/communication/memorabilia/detail',
            mockPath: '/communication/memorabilia/detail',
            desc: '大事记-查看'
        },
        {
            name: 'list',
            method: 'POST',
            path: '/communication/memorabilia/list',
            mockPath: '/communication/memorabilia/list',
            desc: '大事记-列表'
        },
        {
            name: 'searchWholeDescribe',
            method: 'POST',
            path: '/communication/memorabilia/searchWholeDescribe',
            mockPath: '/communication/memorabilia/searchWholeDescribe',
            desc: '项目下拉框'
        },
        {
            name: 'importExcel',
            method: 'POST',
            path: '/communication/memorabilia/importExcel',
            mockPath: '/communication/memorabilia/importExcel',
            desc: '导入'
        },
        {
            name: 'exportExcel',
            method: 'POST',
            path: '/communication/memorabilia/exportExcel',
            mockPath: '/communication/memorabilia/exportExcel',
            desc: '导出'
        }
    ],
    meetingManager: [
        {
            name: 'list',
            method: 'POST',
            path: '/communication/meetingManager/list',
            mockPath: '/communication/meetingManager/list',
            desc: '会议管理-列表'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/communication/meetingManager/save',
            mockPath: '/communication/meetingManager/save',
            desc: '会议管理-保存'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/communication/meetingManager/remove',
            mockPath: '/communication/meetingManager/remove',
            desc: '会议管理-删除'
        },
        {
            name: 'getInfo',
            method: 'POST',
            path: '/communication/meetingManager/getInfo',
            mockPath: '/communication/meetingManager/getInfo',
            params: {},
            desc: '会议管理-详情查询'
        },
        {
            name: 'TodolistDetail',
            method: 'POST',
            path: '/communication/meetingTodolist/detail',
            mockPath: '/communication/meetingTodolist/detail',
            params: {},
            desc: '会议管理-进入待办事项'
        },
        {
            name: 'TodolistSave',
            method: 'POST',
            path: '/communication/meetingTodolist/save',
            mockPath: '/communication/meetingTodolist/save',
            params: {},
            desc: '会议管理-保存待办事项'
        }
    ]
}
