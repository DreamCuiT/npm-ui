/**
 * USER API
 * Namespace: User
 */

export const meteringManage = {

    MeteringDevice: [
        {
            name: 'list',
            method: 'POST',
            path: '/meteringManage/meteringDevice/list',
            mockPath: '/meteringManage/meteringDevice/list',
            desc: '计量标准装置管理-列表'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/meteringManage/meteringDevice/save',
            mockPath: '/meteringManage/meteringDevice/save',
            desc: '计量标准装置管理-保存'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/meteringManage/meteringDevice/remove',
            mockPath: '/meteringManage/meteringDevice/remove',
            desc: '计量标准装置管理-删除'
        },
        {
            name: 'getInfo',
            method: 'POST',
            path: '/meteringManage/meteringDevice/getInfo',
            mockPath: '/meteringManage/meteringDevice/getInfo',
            params: {},
            desc: '计量标准装置管理-详情查询'
        },
        {
            name: 'detail',
            method: 'POST',
            path: '/meteringManage/meteringDevice/detail',
            mockPath: '/meteringManage/meteringDevice/detail',
            params: {},
            desc: '计量标准装置管理-详情查询'
        },
        {
            name: 'importExcel',
            method: 'POST',
            path: '/meteringManage/meteringDevice/importExcel',
            mockPath: '/meteringManage/meteringDevice/importExcel',
            desc: '计量管理->计量标准装置管理->导入excel'
        },
        {
            name: 'exportExcel',
            method: 'POST',
            path: '/meteringManage/meteringDevice/exportExcel',
            mockPath: '/meteringManage/meteringDevice/exportExcel',
            desc: '计量管理->计量标准装置管理->导出excel'
        }
    ],
    MeteringTest: [
        {
            name: 'list',
            method: 'POST',
            path: '/meteringManage/meteringTest/list',
            mockPath: '/meteringManage/meteringTest/list',
            desc: '计量专用测试设备管理-列表'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/meteringManage/meteringTest/save',
            mockPath: '/meteringManage/meteringTest/save',
            desc: '计量专用测试设备管理-保存'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/meteringManage/meteringTest/remove',
            mockPath: '/meteringManage/meteringTest/remove',
            desc: '计量专用测试设备管理-删除'
        },
        {
            name: 'getInfo',
            method: 'POST',
            path: '/meteringManage/meteringTest/getInfo',
            mockPath: '/meteringManage/meteringTest/getInfo',
            params: {},
            desc: '计量专用测试设备管理-详情查询'
        },
        {
            name: 'detail',
            method: 'POST',
            path: '/meteringManage/meteringTest/detail',
            mockPath: '/meteringManage/meteringTest/detail',
            params: {},
            desc: '计量专用测试设备管理-详情查询'
        },
        {
            name: 'importExcel',
            method: 'POST',
            path: '/meteringManage/meteringTest/importExcel',
            mockPath: '/meteringManage/meteringTest/importExcel',
            desc: '计量管理->计量专用测试设备管理->导入excel'
        },
        {
            name: 'exportExcel',
            method: 'POST',
            path: '/meteringManage/meteringTest/exportExcel',
            mockPath: '/meteringManage/meteringTest/exportExcel',
            desc: '计量管理->计量专用测试设备管理->导出excel'
        }
    ]
}
