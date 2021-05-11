/**
 * USER API
 * Namespace: User
 */

export const QualityApi = {

    quality: [
        {
            name: 'list',
            method: 'POST',
            path: '/quality/qualityProblem/list',
            mockPath: '/quality/qualityProblem/list',
            desc: '质量问题快报-列表'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/quality/qualityProblem/save',
            mockPath: '/quality/qualityProblem/save',
            desc: '质量问题快报-保存'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/quality/qualityProblem/remove',
            mockPath: '/quality/qualityProblem/remove',
            desc: '质量问题快报-删除'
        },
        {
            name: 'getQuality',
            method: 'POST',
            path: '/quality/qualityProblem/getProblem',
            mockPath: '/quality/qualityProblem/getProblem',
            params: {},
            desc: '质量问题快报-详情查询'
        },
        {
            name: 'exportExcel',
            method: 'POST',
            path: '/quality/qualityProblem/exportExcel',
            mockPath: '/quality/qualityProblem/exportExcel',
            desc: '质量问题快报-导出'
        },
        {
            name: 'getDepartment',
            method: 'POST',
            path: '/quality/qualityProblem/getDepartment',
            mockPath: '/quality/qualityProblem/getDepartment',
            desc: '质量信息-获取部门'
        }
    ],
    tozero: [
        {
            name: 'list',
            method: 'POST',
            path: '/quality/qualityTozero/list',
            mockPath: '/quality/qualityTozero/list',
            desc: '质量问题归零-列表'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/quality/qualityTozero/save',
            mockPath: '/quality/qualityTozero/save',
            desc: '质量问题归零-保存'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/quality/qualityTozero/remove',
            mockPath: '/quality/qualityTozero/remove',
            desc: '质量问题归零-删除'
        },
        {
            name: 'getTozero',
            method: 'POST',
            path: '/quality/qualityTozero/getQualityToZero',
            mockPath: '/quality/qualityTozero/getQualityToZero',
            params: {},
            desc: '质量问题归零-详情查询'
        },
        {
            name: 'statistical',
            method: 'POST',
            path: '/quality/qualityTozero/statistical',
            mockPath: '/quality/qualityTozero/statistical',
            desc: '质量问题归零统计'
        },
        {
            name: 'exportExcel',
            method: 'POST',
            path: '/quality/qualityTozero/exportExcel',
            mockPath: '/quality/qualityTozero/exportExcel',
            desc: '质量归零-导出'
        },
        {
            name: 'exportExcelStatistical',
            method: 'POST',
            path: '/quality/qualityTozero/exportExcelStatistical',
            mockPath: '/quality/qualityTozero/exportExcelStatistical',
            desc: '质量归零统计-导出'
        }
    ],
    flight: [
        {
            name: 'list',
            method: 'POST',
            path: '/quality/flightExperiment/list',
            mockPath: '/quality/flightExperiment/list',
            desc: '飞行试验-列表'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/quality/flightExperiment/save',
            mockPath: '/quality/flightExperiment/save',
            desc: '飞行试验-保存'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/quality/flightExperiment/remove',
            mockPath: '/quality/flightExperiment/remove',
            desc: '飞行试验-删除'
        },
        {
            name: 'getFlightExperiment',
            method: 'POST',
            path: '/quality/flightExperiment/getFlightExperiment',
            mockPath: '/quality/flightExperiment/getFlightExperiment',
            params: {},
            desc: '飞行试验-详情查询'
        },
        {
            name: 'detail',
            method: 'POST',
            path: '/quality/flightExperiment/detail',
            mockPath: '/quality/flightExperiment/detail',
            params: {},
            desc: '飞行试验-详情查询'
        },
        {
            name: 'exportExcel',
            method: 'POST',
            path: '/quality/flightExperiment/exportExcel',
            mockPath: '/quality/flightExperiment/exportExcel',
            desc: '飞行试验-导出'
        }
    ],
    engine: [
        {
            name: 'list',
            method: 'POST',
            path: '/quality/engineExperiment/list',
            mockPath: '/quality/engineExperiment/list',
            desc: '发动机实验-列表'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/quality/engineExperiment/save',
            mockPath: '/quality/engineExperiment/save',
            desc: '发动机实验-保存'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/quality/engineExperiment/remove',
            mockPath: '/quality/engineExperiment/remove',
            desc: '发动机实验-删除'
        },
        {
            name: 'getEngineExperiment',
            method: 'POST',
            path: '/quality/engineExperiment/getEngineExperiment',
            mockPath: '/quality/engineExperiment/getEngineExperiment',
            params: {},
            desc: '发动机试验-详情查询'
        },
        {
            name: 'detail',
            method: 'POST',
            path: '/quality/engineExperiment/detail',
            mockPath: '/quality/engineExperiment/detail',
            params: {},
            desc: '发动机试验-详情查询'
        },
        {
            name: 'exportExcel',
            method: 'POST',
            path: '/quality/engineExperiment/exportExcel',
            mockPath: '/quality/engineExperiment/exportExcel',
            desc: '发动机试验-导出'
        }
    ],
    qualitySystem: [
        {
            name: 'qualityTree',
            method: 'GET',
            path: '/quality/QualitySystem/qualityTree',
            mockPath: '/quality/QualitySystem/qualityTree',
            desc: '质量体系->体系文件管理->质量体系树'
        },
        {
            name: 'qualityTreeSelect',
            method: 'GET',
            path: '/quality/QualitySystem/qualityTreeSelect',
            mockPath: '/quality/QualitySystem/qualityTreeSelect',
            desc: '质量体系->体系文件管理->质量体系树'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/quality/QualitySystem/save',
            mockPath: '/quality/QualitySystem/save',
            desc: '质量体系->体系文件管理->保存节点'
        },
        {
            name: 'removeNode',
            method: 'POST',
            path: '/quality/QualitySystem/removeNode',
            mockPath: '/quality/QualitySystem/removeNode',
            desc: '质量体系->体系文件管理->删除节点'
        },
        {
            name: 'getNodeDetail',
            method: 'POST',
            path: '/quality/QualitySystem/getNodeDetail',
            mockPath: '/quality/QualitySystem/getNodeDetail',
            desc: '质量体系->体系文件管理->获取节点信息'
        },
        {
            name: 'upload',
            method: 'POST',
            path: '/qualitySystem/QualitySystemResource/upload',
            mockPath: '/qualitySystem/QualitySystemResource/upload',
            desc: '质量体系->体系文件管理->上传附件'
        },
        {
            name: 'getFileList',
            method: 'POST',
            path: '/qualitySystem/QualitySystemResource/getFileList',
            mockPath: '/qualitySystem/QualitySystemResource/getFileList',
            desc: '质量体系->体系文件管理->文件列表'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/qualitySystem/QualitySystemResource/remove',
            mockPath: '/qualitySystem/QualitySystemResource/remove',
            desc: '质量体系->体系文件管理->删除附件'
        },
        {
            name: 'download',
            method: 'POST',
            path: '/qualitySystem/QualitySystemResource/download',
            mockPath: '/qualitySystem/QualitySystemResource/download',
            desc: '质量体系->体系文件管理->下载'
        },
        {
            name: 'getInfo',
            method: 'POST',
            path: '/qualitySystem/QualitySystemResource/getInfo',
            mockPath: '/qualitySystem/QualitySystemResource/getInfo',
            desc: '质量体系->体系文件管理->详情'
        },
        {
            name: 'exportExcel',
            method: 'POST',
            path: '/qualitySystem/QualitySystemResource/exportExcel',
            mockPath: '/qualitySystem/QualitySystemResource/exportExcel',
            desc: '质量体系->体系文件管理->导出'
        },
        {
            name: 'importExcel',
            method: 'POST',
            path: '/qualitySystem/QualitySystemResource/importExcel',
            mockPath: '/qualitySystem/QualitySystemResource/importExcel',
            desc: '质量体系->体系文件管理->导入'
        }
    ],
    manageAppraise: [
        {
            name: 'getTree',
            method: 'POST',
            path: '/qualitySystem/qualityManagementTask/getSystemType',
            mockPath: '/qualitySystem/qualityManagementTask/getSystemType',
            desc: '质量体系->管理评审管理->获取体系类型'
        },
        {
            name: 'manageAppraiseList',
            method: 'POST',
            path: '/qualitySystem/qualityManagementTask/manageAppraiseList',
            mockPath: '/qualitySystem/qualityManagementTask/manageAppraiseList',
            desc: '质量体系->管理评审管理->评审列表'
        },
        {
            name: 'saveManageAppraise',
            method: 'POST',
            path: '/qualitySystem/qualityManagementTask/saveManageAppraise',
            mockPath: '/qualitySystem/qualityManagementTask/saveManageAppraise',
            desc: '质量体系->管理评审管理->新建评审'
        },
        {
            name: 'getAppraise',
            method: 'POST',
            path: '/qualitySystem/qualityManagementTask/getAppraise',
            mockPath: '/qualitySystem/qualityManagementTask/getAppraise',
            desc: '质量体系->管理评审管理->评审信息'
        },
        {
            name: 'getAppraiseTableDate',
            method: 'POST',
            path: '/qualitySystem/qualityManagementTask/getAppraiseTableDate',
            mockPath: '/qualitySystem/qualityManagementTask/getAppraiseTableDate',
            desc: '质量体系->管理评审管理->评审任务管理->列表数据'
        },
        {
            name: 'createAppraisePlan',
            method: 'POST',
            path: '/qualitySystem/qualityManagementTask/createAppraisePlan',
            mockPath: '/qualitySystem/qualityManagementTask/createAppraisePlan',
            desc: '质量体系->管理评审管理->评审任务管理->新建评审任务'
        },
        {
            name: 'updateAppraiseData',
            method: 'POST',
            path: '/qualitySystem/qualityManagementTask/updateAppraiseData',
            mockPath: '/qualitySystem/qualityManagementTask/updateAppraiseData',
            desc: '质量体系->管理评审管理->评审任务管理->修改评审任务信息'
        },
        {
            name: 'deleteAppraiseData',
            method: 'POST',
            path: '/qualitySystem/qualityManagementTask/deleteAppraiseData',
            mockPath: '/qualitySystem/qualityManagementTask/deleteAppraiseData',
            desc: '质量体系->管理评审管理->评审任务管理->删除节点'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/qualitySystem/qualityManagementTask/remove',
            mockPath: '/qualitySystem/qualityManagementTask/remove',
            desc: '质量体系->管理评审管理->删除评审'
        },
        {
            name: 'issue',
            method: 'POST',
            path: '/qualitySystem/qualityManagementTask/issue',
            mockPath: '/qualitySystem/qualityManagementTask/issue',
            desc: '质量体系->管理评审管理->下发计划'
        },
        {
            name: 'complete',
            method: 'POST',
            path: '/qualitySystem/qualityManagementTask/complete',
            mockPath: '/qualitySystem/qualityManagementTask/complete',
            desc: '质量体系->管理评审管理->完成计划'
        },
        {
            name: 'importExcel',
            method: 'POST',
            path: '/qualitySystem/qualityManagementTask/importExcel',
            mockPath: '/qualitySystem/qualityManagementTask/importExcel',
            desc: '质量体系->管理评审管理->导入'
        },
        {
            name: 'exportExcel',
            method: 'POST',
            path: '/qualitySystem/qualityManagementTask/exportExcel',
            mockPath: '/qualitySystem/qualityManagementTask/exportExcel',
            desc: '质量体系->管理评审管理->导出'
        },
        {
            name: 'leaderTaskList',
            method: 'POST',
            path: '/qualitySystem/qualityManagementTask/leaderTaskList',
            mockPath: '/qualitySystem/qualityManagementTask/leaderTaskList',
            desc: '我的任务->管理评审任务->管理评审计划领导任务列表'
        },
        {
            name: 'implementTask',
            method: 'POST',
            path: '/qualitySystem/qualityManagementTask/implementTask',
            mockPath: '/qualitySystem/qualityManagementTask/implementTask',
            desc: '我的任务->管理评审任务->执行任务'
        },
        {
            name: 'dutyTaskList',
            method: 'POST',
            path: '/qualitySystem/qualityManagementTask/dutyTaskList',
            mockPath: '/qualitySystem/qualityManagementTask/dutyTaskList',
            desc: '我的任务->管理评审任务->管理评审计划责任人任务列表'
        },
        {
            name: 'dutyTaskInfo',
            method: 'POST',
            path: '/qualitySystem/qualityManagementTask/dutyTaskInfo',
            mockPath: '/qualitySystem/qualityManagementTask/dutyTaskInfo',
            desc: '我的任务->管理评审任务->任务详细信息'
        },
        {
            name: 'getAttachment',
            method: 'POST',
            path: '/qualitySystem/qualityManagementTask/getAttachment',
            mockPath: '/qualitySystem/qualityManagementTask/getAttachment',
            desc: '我的任务->管理评审任务->查看附件'
        },
        {
            name: 'searchLeaderTask',
            method: 'POST',
            path: '/qualitySystem/qualityManagementTask/searchLeaderTask',
            mockPath: '/qualitySystem/qualityManagementTask/searchLeaderTask',
            desc: '我的任务->管理评审任务->搜索评审计划'
        },
        {
            name: 'searchDutyTask',
            method: 'POST',
            path: '/qualitySystem/qualityManagementTask/searchDutyTask',
            mockPath: '/qualitySystem/qualityManagementTask/searchDutyTask',
            desc: '我的任务->管理评审任务->搜索评审计划'
        }
    ],
    qualityExposure: [
        {
            name: 'list',
            method: 'POST',
            path: '/quality/qualityExposure/list',
            mockPath: '/quality/qualityExposure/list',
            desc: '质量信息->质量曝光列表'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/quality/qualityExposure/save',
            mockPath: '/quality/qualityExposure/save',
            desc: '质量信息->质量曝光台->保存'
        },
        {
            name: 'getExposure',
            method: 'POST',
            path: '/quality/qualityExposure/getExposure',
            mockPath: '/quality/qualityExposure/getExposure',
            desc: '质量信息->质量曝光台->获取质量曝光信息'
        },
        {
            name: 'getExposureInfo',
            method: 'POST',
            path: '/quality/qualityExposure/getExposureInfo',
            mockPath: '/quality/qualityExposure/getExposureInfo',
            desc: '质量信息->质量曝光台->查看质量曝光信息'
        },
        {
            name: 'importExposure',
            method: 'POST',
            path: '/quality/qualityExposure/importExposure',
            mockPath: '/quality/qualityExposure/importExposure',
            desc: '质量信息->质量曝光台->导入质量曝光信息'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/quality/qualityExposure/remove',
            mockPath: '/quality/qualityExposure/remove',
            desc: '质量信息->质量曝光台->删除质量曝光信息'
        },
        {
            name: 'getNewExposureInfo',
            method: 'POST',
            path: '/quality/qualityExposure/getNewExposureInfo',
            mockPath: '/quality/qualityExposure/getNewExposureInfo',
            desc: '质量信息->质量曝光台->最新质量曝光信息'
        }
    ],
    QualitySupervision: [
        {
            name: 'list',
            method: 'POST',
            path: '/qualitySystem/qualitySupervision/list',
            mockPath: '/qualitySystem/qualitySupervision/list',
            desc: '质量体系->质量监督->列表'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/qualitySystem/qualitySupervision/save',
            mockPath: '/qualitySystem/qualitySupervision/save',
            desc: '质量体系->质量监督->保存'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/qualitySystem/qualitySupervision/remove',
            mockPath: '/qualitySystem/qualitySupervision/remove',
            desc: '质量体系->质量监督->删除'
        },
        {
            name: 'getInfo',
            method: 'POST',
            path: '/qualitySystem/qualitySupervision/getInfo',
            mockPath: '/qualitySystem/qualitySupervision/getInfo',
            desc: '质量体系->质量监督->详情'
        },
        {
            name: 'detail',
            method: 'POST',
            path: '/qualitySystem/qualitySupervision/detail',
            mockPath: '/qualitySystem/qualitySupervision/detail',
            desc: '质量体系->质量监督->详情'
        },
        {
            name: 'importExcel',
            method: 'POST',
            path: '/qualitySystem/qualitySupervision/importExcel',
            mockPath: '/qualitySystem/qualitySupervision/importExcel',
            desc: '质量体系->质量监督->导入excel'
        },
        {
            name: 'exportExcel',
            method: 'POST',
            path: '/qualitySystem/qualitySupervision/exportExcel',
            mockPath: '/qualitySystem/qualitySupervision/exportExcel',
            desc: '质量体系->质量监督->导出excel'
        }
    ],
    UncorrectionItems: [
        {
            name: 'list',
            method: 'POST',
            path: '/qualitySystem/uncorrectionItems/list',
            mockPath: '/qualitySystem/uncorrectionItems/list',
            desc: '质量体系->不符合项纠正项->列表'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/qualitySystem/uncorrectionItems/save',
            mockPath: '/qualitySystem/uncorrectionItems/save',
            desc: '质量体系->不符合项纠正项->保存'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/qualitySystem/uncorrectionItems/remove',
            mockPath: '/qualitySystem/uncorrectionItems/remove',
            desc: '质量体系->不符合项纠正项->删除'
        },
        {
            name: 'getInfo',
            method: 'POST',
            path: '/qualitySystem/uncorrectionItems/getInfo',
            mockPath: '/qualitySystem/uncorrectionItems/getInfo',
            desc: '质量体系->不符合项纠正项->详情'
        },
        {
            name: 'getDepartment',
            method: 'POST',
            path: '/qualitySystem/uncorrectionItems/getDepartment',
            mockPath: '/qualitySystem/uncorrectionItems/getDepartment',
            desc: '质量体系->部门->列表'
        },
        {
            name: 'detail',
            method: 'POST',
            path: '/qualitySystem/uncorrectionItems/detail',
            mockPath: '/qualitySystem/uncorrectionItems/detail',
            desc: '质量体系->不符合项纠正项->详情'
        },
        {
            name: 'importExcel',
            method: 'POST',
            path: '/qualitySystem/uncorrectionItems/importExcel',
            mockPath: '/qualitySystem/uncorrectionItems/importExcel',
            desc: '质量体系->不符合项纠正项->导入excel'
        },
        {
            name: 'exportExcel',
            method: 'POST',
            path: '/qualitySystem/uncorrectionItems/exportExcel',
            mockPath: '/qualitySystem/uncorrectionItems/exportExcel',
            desc: '质量体系->不符合项纠正项->导出excel'
        }
    ],
    CustomerOpinion: [
        {
            name: 'list',
            method: 'POST',
            path: '/qualitySystem/customerOpinion/list',
            mockPath: '/qualitySystem/customerOpinion/list',
            desc: '质量体系->顾客意见表->列表'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/qualitySystem/customerOpinion/save',
            mockPath: '/qualitySystem/customerOpinion/save',
            desc: '质量体系->顾客意见表->保存'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/qualitySystem/customerOpinion/remove',
            mockPath: '/qualitySystem/customerOpinion/remove',
            desc: '质量体系->顾客意见表->删除'
        },
        {
            name: 'getInfo',
            method: 'POST',
            path: '/qualitySystem/customerOpinion/getInfo',
            mockPath: '/qualitySystem/customerOpinion/getInfo',
            desc: '质量体系->顾客意见表->详情'
        },
        {
            name: 'detail',
            method: 'POST',
            path: '/qualitySystem/customerOpinion/detail',
            mockPath: '/qualitySystem/customerOpinion/detail',
            desc: '质量体系->顾客意见表->详情'
        },
        {
            name: 'importExcel',
            method: 'POST',
            path: '/qualitySystem/customerOpinion/importExcel',
            mockPath: '/qualitySystem/customerOpinion/importExcel',
            desc: '质量体系->不符合项纠正项->导入excel'
        },
        {
            name: 'exportExcel',
            method: 'POST',
            path: '/qualitySystem/customerOpinion/exportExcel',
            mockPath: '/qualitySystem/customerOpinion/exportExcel',
            desc: '质量体系->不符合项纠正项->导出excel'
        }
    ],
    qualitySystemAssess: [
        {
            name: 'save',
            method: 'POST',
            path: '/qualitySystem/qualitySystemAssess/save',
            mockPath: '/qualitySystem/qualitySystemAssess/save',
            desc: '质量体系->质量体系评估->保存'
        },
        {
            name: 'getList',
            method: 'POST',
            path: '/qualitySystem/qualitySystemAssess/getList',
            mockPath: '/qualitySystem/qualitySystemAssess/getList',
            desc: '质量体系->质量体系评估->列表'
        },
        {
            name: 'getAssess',
            method: 'POST',
            path: '/qualitySystem/qualitySystemAssess/getAssess',
            mockPath: '/qualitySystem/qualitySystemAssess/getAssess',
            desc: '质量体系->质量体系评估->详情'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/qualitySystem/qualitySystemAssess/remove',
            mockPath: '/qualitySystem/qualitySystemAssess/remove',
            desc: '质量体系->质量体系评估->删除评估'
        },
        {
            name: 'saveInfo',
            method: 'POST',
            path: '/qualitySystem/qualitySystemAssess/saveInfo',
            mockPath: '/qualitySystem/qualitySystemAssess/saveInfo',
            desc: '质量体系->质量体系评估->保存整改计划附件'
        },
        {
            name: 'exportExcel',
            method: 'POST',
            path: '/qualitySystem/qualitySystemAssess/exportExcel',
            mockPath: '/qualitySystem/qualitySystemAssess/exportExcel',
            desc: '质量体系->管理评审改进事项跟踪->导出'
        },
        {
            name: 'importExcel',
            method: 'POST',
            path: '/qualitySystem/qualitySystemAssess/importExcel',
            mockPath: '/qualitySystem/qualitySystemAssess/importExcel',
            desc: '质量体系->管理评审改进事项跟踪->导入'
        }
    ],
    manageImproveTract: [
        {
            name: 'save',
            method: 'POST',
            path: '/qualitySystem/qualityImproveTrack/save',
            mockPath: '/qualitySystem/qualityImproveTrack/save',
            desc: '质量体系->管理评审改进事项跟踪->保存'
        },
        {
            name: 'getList',
            method: 'POST',
            path: '/qualitySystem/qualityImproveTrack/getList',
            mockPath: '/qualitySystem/qualityImproveTrack/getList',
            desc: '质量体系->管理评审改进事项跟踪->列表'
        },
        {
            name: 'saveInfo',
            method: 'POST',
            path: '/qualitySystem/qualityImproveTrack/saveInfo',
            mockPath: '/qualitySystem/qualityImproveTrack/saveInfo',
            desc: '质量体系->管理评审改进事项跟踪->保存整改计划'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/qualitySystem/qualityImproveTrack/remove',
            mockPath: '/qualitySystem/qualityImproveTrack/remove',
            desc: '质量体系->管理评审改进事项跟踪->删除整改计划'
        },
        {
            name: 'getImproveTractData',
            method: 'POST',
            path: '/qualitySystem/qualityImproveTrack/getImproveTractData',
            mockPath: '/qualitySystem/qualityImproveTrack/getImproveTractData',
            desc: '质量体系->管理评审改进事项跟踪->详情'
        },
        {
            name: 'getImproveAdvise',
            method: 'POST',
            path: '/qualitySystem/qualityImproveTrack/getImproveAdvise',
            mockPath: '/qualitySystem/qualityImproveTrack/getImproveAdvise',
            desc: '质量体系->管理评审改进事项跟踪->详情'
        },
        {
            name: 'exportExcel',
            method: 'POST',
            path: '/qualitySystem/qualityImproveTrack/exportExcel',
            mockPath: '/qualitySystem/qualityImproveTrack/exportExcel',
            desc: '质量体系->管理评审改进事项跟踪->导出'
        },
        {
            name: 'importExcel',
            method: 'POST',
            path: '/qualitySystem/qualityImproveTrack/importExcel',
            mockPath: '/qualitySystem/qualityImproveTrack/importExcel',
            desc: '质量体系->管理评审改进事项跟踪->导入'
        }
    ],
    activityReport: [
        {
            name: 'deptTree',
            method: 'POST',
            path: '/qualityBasic/qualityEvaluation/deptTree',
            mockPath: '/qualityBasic/qualityEvaluation/deptTree'
        },
        {
            name: 'list',
            method: 'POST',
            path: '/qualityBasic/qualityActivityReport/list',
            mockPath: '/qualityBasic/qualityActivityReport/list',
            desc: '基础质量管理->质量活动简报->列表'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/qualityBasic/qualityActivityReport/save',
            mockPath: '/qualityBasic/qualityActivityReport/save',
            desc: '基础质量管理->质量活动简报->保存'
        },
        {
            name: 'getInfo',
            method: 'POST',
            path: '/qualityBasic/qualityActivityReport/getInfo',
            mockPath: '/qualityBasic/qualityActivityReport/getInfo',
            desc: '基础质量管理->质量活动简报->详情'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/qualityBasic/qualityActivityReport/remove',
            mockPath: '/qualityBasic/qualityActivityReport/remove',
            desc: '基础质量管理->质量活动简报->删除'
        },
        {
            name: 'importExcel',
            method: 'POST',
            path: '/qualityBasic/qualityActivityReport/importExcel',
            mockPath: '/qualityBasic/qualityActivityReport/importExcel',
            desc: '基础质量管理->质量活动简报->导入'
        },
        {
            name: 'exportExcel',
            method: 'POST',
            path: '/qualityBasic/qualityActivityReport/exportExcel',
            mockPath: '/qualityBasic/qualityActivityReport/exportExcel',
            desc: '基础质量管理->质量活动简报->导出'
        }
    ],
    ruleManage: [
        {
            name: 'list',
            method: 'POST',
            path: '/qualityBasic/qualityRuleManage/list',
            mockPath: '/qualityBasic/qualityRuleManage/list',
            desc: '基础质量管理->质量制度管理->列表'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/qualityBasic/qualityRuleManage/save',
            mockPath: '/qualityBasic/qualityRuleManage/save',
            desc: '基础质量管理->质量制度管理->保存'
        },
        {
            name: 'getInfo',
            method: 'POST',
            path: '/qualityBasic/qualityRuleManage/getInfo',
            mockPath: '/qualityBasic/qualityRuleManage/getInfo',
            desc: '基础质量管理->质量制度管理->详情'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/qualityBasic/qualityRuleManage/remove',
            mockPath: '/qualityBasic/qualityRuleManage/remove',
            desc: '基础质量管理->质量制度管理->删除'
        },
        {
            name: 'importExcel',
            method: 'POST',
            path: '/qualityBasic/qualityRuleManage/importExcel',
            mockPath: '/qualityBasic/qualityRuleManage/importExcel',
            desc: '基础质量管理->质量制度管理->导入'
        },
        {
            name: 'exportExcel',
            method: 'POST',
            path: '/qualityBasic/qualityRuleManage/exportExcel',
            mockPath: '/qualityBasic/qualityRuleManage/exportExcel',
            desc: '基础质量管理->质量制度管理->导出'
        }
    ],
    QualityEvaluation: [
        {
            name: 'list',
            method: 'POST',
            path: '/qualityBasic/qualityEvaluation/list',
            mockPath: '/qualityBasic/qualityEvaluation/list',
            desc: '基础质量管理->质量管理评价->列表'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/qualityBasic/qualityEvaluation/save',
            mockPath: '/qualityBasic/qualityEvaluation/save',
            desc: '基础质量管理->质量管理评价->保存'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/qualityBasic/qualityEvaluation/remove',
            mockPath: '/qualityBasic/qualityEvaluation/remove',
            desc: '基础质量管理->质量管理评价->删除'
        },
        {
            name: 'getInfo',
            method: 'POST',
            path: '/qualityBasic/qualityEvaluation/getInfo',
            mockPath: '/qualityBasic/qualityEvaluation/getInfo',
            desc: '基础质量管理->质量管理评价->详情'
        },
        {
            name: 'deptTree',
            method: 'POST',
            path: '/qualityBasic/qualityEvaluation/deptTree',
            mockPath: '/qualityBasic/qualityEvaluation/deptTree',
            params: {},
            desc: '基础质量管理->质量管理评价->部门树'
        },
        {
            name: 'importExcel',
            method: 'POST',
            path: '/qualityBasic/qualityEvaluation/importExcel',
            mockPath: '/qualityBasic/qualityEvaluation/importExcel',
            desc: '基础质量管理->质量管理评价->导入excel'
        },
        {
            name: 'exportExcel',
            method: 'POST',
            path: '/qualityBasic/qualityEvaluation/exportExcel',
            mockPath: '/qualityBasic/qualityEvaluation/exportExcel',
            desc: '基础质量管理->质量管理评价->导出excel'
        }
    ],
    ScientificResearchSite: [
        {
            name: 'list',
            method: 'POST',
            path: '/qualityBasic/scientificResearchSite/list',
            mockPath: '/qualityBasic/scientificResearchSite/list',
            desc: '基础质量管理->科研生产现场->列表'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/qualityBasic/scientificResearchSite/save',
            mockPath: '/qualityBasic/scientificResearchSite/save',
            desc: '基础质量管理->科研生产现场->保存'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/qualityBasic/scientificResearchSite/remove',
            mockPath: '/qualityBasic/scientificResearchSite/remove',
            desc: '基础质量管理->科研生产现场->删除'
        },
        {
            name: 'getInfo',
            method: 'POST',
            path: '/qualityBasic/scientificResearchSite/getInfo',
            mockPath: '/qualityBasic/scientificResearchSite/getInfo',
            desc: '基础质量管理->科研生产现场->详情'
        },
        {
            name: 'importExcel',
            method: 'POST',
            path: '/qualityBasic/scientificResearchSite/importExcel',
            mockPath: '/qualityBasic/scientificResearchSite/importExcel',
            desc: '基础质量管理->科研生产现场->导入excel'
        },
        {
            name: 'exportExcel',
            method: 'POST',
            path: '/qualityBasic/scientificResearchSite/exportExcel',
            mockPath: '/qualityBasic/scientificResearchSite/exportExcel',
            desc: '基础质量管理->科研生产现场->导出excel'
        }
    ],
    QualityThesis: [
        {
            name: 'list',
            method: 'POST',
            path: '/qualityBasic/qualityThesis/list',
            mockPath: '/qualityBasic/qualityThesis/list',
            desc: '基础质量管理->质量管理评价->列表'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/qualityBasic/qualityThesis/save',
            mockPath: '/qualityBasic/qualityThesis/save',
            desc: '基础质量管理->质量管理评价->保存'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/qualityBasic/qualityThesis/remove',
            mockPath: '/qualityBasic/qualityThesis/remove',
            desc: '基础质量管理->质量管理评价->删除'
        },
        {
            name: 'getInfo',
            method: 'POST',
            path: '/qualityBasic/qualityThesis/getInfo',
            mockPath: '/qualityBasic/qualityThesis/getInfo',
            desc: '基础质量管理->质量管理评价->详情'
        }
    ],
    QualityProject: [
        {
            name: 'list',
            method: 'POST',
            path: '/qualityBasic/qualityProject/list',
            mockPath: '/qualityBasic/qualityProject/list',
            desc: '基础质量管理->质量项目管理->列表'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/qualityBasic/qualityProject/save',
            mockPath: '/qualityBasic/qualityProject/save',
            desc: '基础质量管理->质量项目管理->保存'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/qualityBasic/qualityProject/remove',
            mockPath: '/qualityBasic/qualityProject/remove',
            desc: '基础质量管理->质量项目管理->删除'
        },
        {
            name: 'getInfo',
            method: 'POST',
            path: '/qualityBasic/qualityProject/getInfo',
            mockPath: '/qualityBasic/qualityProject/getInfo',
            desc: '基础质量管理->质量项目管理->详情'
        },
        {
            name: 'uploadReport',
            method: 'POST',
            path: '/qualityBasic/qualityProject/uploadReport',
            mockPath: '/qualityBasic/qualityProject/uploadReport',
            desc: '基础质量管理->质量项目管理->上传报告'
        },
        {
            name: 'importExcel',
            method: 'POST',
            path: '/qualityBasic/qualityProject/importExcel',
            mockPath: '/qualityBasic/qualityProject/importExcel',
            desc: '基础质量管理->质量项目管理->导入excel'
        },
        {
            name: 'exportExcel',
            method: 'POST',
            path: '/qualityBasic/qualityProject/exportExcel',
            mockPath: '/qualityBasic/qualityProject/exportExcel',
            desc: '基础质量管理->质量项目管理->导出excel'
        }
    ],
    QualityWorkStatus: [
        {
            name: 'list',
            method: 'POST',
            path: '/qualityBasic/qualityWorkStatus/list',
            mockPath: '/qualityBasic/qualityWorkStatus/list',
            desc: '基础质量管理->工作状态->列表'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/qualityBasic/qualityWorkStatus/save',
            mockPath: '/qualityBasic/qualityWorkStatus/save',
            desc: '基础质量管理->工作状态->保存'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/qualityBasic/qualityWorkStatus/remove',
            mockPath: '/qualityBasic/qualityWorkStatus/remove',
            desc: '基础质量管理->工作状态->删除'
        },
        {
            name: 'getInfo',
            method: 'POST',
            path: '/qualityBasic/qualityWorkStatus/getInfo',
            mockPath: '/qualityBasic/qualityWorkStatus/getInfo',
            desc: '基础质量管理->工作状态->详情'
        }
    ],
    QualityReason: [
        {
            name: 'list',
            method: 'POST',
            path: '/qualityBasic/qualityReasonClassify/list',
            mockPath: '/qualityBasic/qualityReasonClassify/list',
            desc: '基础质量管理->质量问题原因分类->列表'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/qualityBasic/qualityReasonClassify/save',
            mockPath: '/qualityBasic/qualityReasonClassify/save',
            desc: '基础质量管理->质量问题原因分类->保存'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/qualityBasic/qualityReasonClassify/remove',
            mockPath: '/qualityBasic/qualityReasonClassify/remove',
            desc: '基础质量管理->质量问题原因分类->删除'
        },
        {
            name: 'getInfo',
            method: 'POST',
            path: '/qualityBasic/qualityReasonClassify/getInfo',
            mockPath: '/qualityBasic/qualityReasonClassify/getInfo',
            desc: '基础质量管理->质量问题原因分类->详情'
        }
    ],
    QualityFaultPattern: [
        {
            name: 'list',
            method: 'POST',
            path: '/qualityBasic/qualityFaultPattern/list',
            mockPath: '/qualityBasic/qualityFaultPattern/list',
            desc: '基础质量管理->故障模式->列表'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/qualityBasic/qualityFaultPattern/save',
            mockPath: '/qualityBasic/qualityFaultPattern/save',
            desc: '基础质量管理->故障模式->保存'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/qualityBasic/qualityFaultPattern/remove',
            mockPath: '/qualityBasic/qualityFaultPattern/remove',
            desc: '基础质量管理->故障模式->删除'
        },
        {
            name: 'getInfo',
            method: 'POST',
            path: '/qualityBasic/qualityFaultPattern/getInfo',
            mockPath: '/qualityBasic/qualityFaultPattern/getInfo',
            desc: '基础质量管理->故障模式->详情'
        }
    ],
    QualityMember: [
        {
            name: 'parentList',
            method: 'POST',
            path: '/qualityBasic/qualityMemberSystem/parentList',
            mockPath: '/qualityBasic/qualityMemberSystem/parentList',
            desc: '基础质量管理->质量系统人员->父级列表'
        },
        {
            name: 'getMember',
            method: 'POST',
            path: '/qualityBasic/qualityMemberSystem/getMember',
            mockPath: '/qualityBasic/qualityMemberSystem/getMember',
            desc: '基础质量管理->质量系统人员->人员树'
        },
        {
            name: 'update',
            method: 'POST',
            path: '/qualityBasic/qualityMemberSystem/update',
            mockPath: '/qualityBasic/qualityMemberSystem/update',
            desc: '基础质量管理->质量系统人员->保存人员树'
        },
        {
            name: 'deleteMemberData',
            method: 'POST',
            path: '/qualityBasic/qualityMemberSystem/deleteMemberData',
            mockPath: '/qualityBasic/qualityMemberSystem/deleteMemberData',
            desc: '基础质量管理->质量系统人员->删除信息'
        },
        {
            name: 'getQualityMemberSys',
            method: 'POST',
            path: '/qualityBasic/qualityMemberSystem/getQualityMemberSys',
            mockPath: '/qualityBasic/qualityMemberSystem/getQualityMemberSys',
            desc: '基础质量管理->质量系统人员档案->人员信息树'
        }
    ],
    MemberArchives: [
        {
            name: 'list',
            method: 'POST',
            path: '/qualityBasic/qualityMemberArchive/list',
            mockPath: '/qualityBasic/qualityMemberArchive/list',
            desc: '基础质量管理->质量系统人员档案->列表'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/qualityBasic/qualityMemberArchive/save',
            mockPath: '/qualityBasic/qualityMemberArchive/save',
            desc: '基础质量管理->质量系统人员档案->保存'
        },
        {
            name: 'saveInfo',
            method: 'POST',
            path: '/qualityBasic/qualityMemberArchive/saveInfo',
            mockPath: '/qualityBasic/qualityMemberArchive/saveInfo',
            desc: '基础质量管理->质量系统人员档案->保存'
        },
        {
            name: 'getArchives',
            method: 'POST',
            path: '/qualityBasic/qualityMemberArchive/getArchives',
            mockPath: '/qualityBasic/qualityMemberArchive/getArchives',
            desc: '基础质量管理->质量系统人员档案->详情'
        },
        {
            name: 'removeAll',
            method: 'POST',
            path: '/qualityBasic/qualityMemberArchive/removeAll',
            mockPath: '/qualityBasic/qualityMemberArchive/removeAll',
            desc: '基础质量管理->质量系统人员档案->删除'
        },
        {
            name: 'getBRInfoData',
            method: 'POST',
            path: '/qualityBasic/qualityMemberArchive/getBRInfoData',
            mockPath: '/qualityBasic/qualityMemberArchive/getBRInfoData',
            desc: '基础质量管理->质量系统人员档案->领用归还详情'
        },
        {
            name: 'exportExcel',
            method: 'POST',
            path: '/qualityBasic/qualityMemberArchive/exportExcel',
            mockPath: '/qualityBasic/qualityMemberArchive/exportExcel',
            desc: '基础质量管理->质量系统人员档案->导出'
        },
        {
            name: 'importExcel',
            method: 'POST',
            path: '/qualityBasic/qualityMemberArchive/importExcel',
            mockPath: '/qualityBasic/qualityMemberArchive/importExcel',
            desc: '基础质量管理->质量系统人员档案->导入'
        }
    ],
    QualityCheckoutArchives: [
        {
            name: 'borrowList',
            method: 'POST',
            path: '/qualityBasic/qualityCheckoutArchives/borrowList',
            mockPath: '/qualityBasic/qualityCheckoutArchives/borrowList',
            desc: '基础质量管理->检验档案管理->领用列表'
        },
        {
            name: 'returnList',
            method: 'POST',
            path: '/qualityBasic/qualityCheckoutArchives/returnList',
            mockPath: '/qualityBasic/qualityCheckoutArchives/returnList',
            desc: '基础质量管理->检验档案管理->归还列表'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/qualityBasic/qualityCheckoutArchives/save',
            mockPath: '/qualityBasic/qualityCheckoutArchives/save',
            desc: '基础质量管理->检验档案管理->保存'
        },
        {
            name: 'getInfo',
            method: 'POST',
            path: '/qualityBasic/qualityCheckoutArchives/getInfo',
            mockPath: '/qualityBasic/qualityCheckoutArchives/getInfo',
            desc: '基础质量管理->检验档案管理->保存'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/qualityBasic/qualityCheckoutArchives/remove',
            mockPath: '/qualityBasic/qualityCheckoutArchives/remove',
            desc: '基础质量管理->检验档案管理->保存'
        },
        {
            name: 'exportExcel',
            method: 'POST',
            path: '/qualityBasic/qualityCheckoutArchives/exportExcel',
            mockPath: '/qualityBasic/qualityCheckoutArchives/exportExcel',
            desc: '基础质量管理->检验档案管理->导出'
        },
        {
            name: 'importExcel',
            method: 'POST',
            path: '/qualityBasic/qualityCheckoutArchives/importExcel',
            mockPath: '/qualityBasic/qualityCheckoutArchives/importExcel',
            desc: '基础质量管理->检验档案管理->导入'
        }
    ],
    FormatTemplate: [
        {
            name: 'list',
            method: 'POST',
            path: '/qualityBasic/FormatTemplate/list',
            mockPath: '/qualityBasic/FormatTemplate/list',
            desc: '基础质量管理->格式模板->列表'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/qualityBasic/FormatTemplate/save',
            mockPath: '/qualityBasic/FormatTemplate/save',
            desc: '基础质量管理->格式模板->保存'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/qualityBasic/FormatTemplate/remove',
            mockPath: '/qualityBasic/FormatTemplate/remove',
            desc: '基础质量管理->格式模板->删除'
        },
        {
            name: 'getInfo',
            method: 'POST',
            path: '/qualityBasic/FormatTemplate/getInfo',
            mockPath: '/qualityBasic/FormatTemplate/getInfo',
            desc: '基础质量管理->格式模板->详情'
        },
        {
            name: 'importExcel',
            method: 'POST',
            path: '/qualityBasic/FormatTemplate/importExcel',
            mockPath: '/qualityBasic/FormatTemplate/importExcel',
            desc: '基础质量管理->格式模板->导入excel'
        },
        {
            name: 'exportExcel',
            method: 'POST',
            path: '/qualityBasic/FormatTemplate/exportExcel',
            mockPath: '/qualityBasic/FormatTemplate/exportExcel',
            desc: '基础质量管理->格式模板->导出excel'
        }
    ],
    QualityZeroDynamic: [
        {
            name: 'list',
            method: 'POST',
            path: '/quality/QualityZeroDynamic/list',
            mockPath: '/quality/QualityZeroDynamic/list',
            desc: '基础质量管理->每周归零动态->列表'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/quality/QualityZeroDynamic/save',
            mockPath: '/quality/QualityZeroDynamic/save',
            desc: '基础质量管理->每周归零动态->保存'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/quality/QualityZeroDynamic/remove',
            mockPath: '/quality/QualityZeroDynamic/remove',
            desc: '基础质量管理->每周归零动态->删除'
        },
        {
            name: 'getInfo',
            method: 'POST',
            path: '/quality/QualityZeroDynamic/getInfo',
            mockPath: '/quality/QualityZeroDynamic/getInfo',
            desc: '基础质量管理->每周归零动态->详情'
        },
        {
            name: 'importExcel',
            method: 'POST',
            path: '/quality/QualityZeroDynamic/importExcel',
            mockPath: '/quality/QualityZeroDynamic/importExcel',
            desc: '基础质量管理->每周归零动态->导入excel'
        },
        {
            name: 'exportExcel',
            method: 'POST',
            path: '/quality/QualityZeroDynamic/exportExcel',
            mockPath: '/quality/QualityZeroDynamic/exportExcel',
            desc: '基础质量管理->每周归零动态->导出excel'
        }
    ],
    QualityAnalysisReport: [
        {
            name: 'list',
            method: 'POST',
            path: '/quality/QualityAnalysisReport/list',
            mockPath: '/quality/QualityAnalysisReport/list',
            desc: '基础质量管理->质量分析报告->列表'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/quality/QualityAnalysisReport/save',
            mockPath: '/quality/QualityAnalysisReport/save',
            desc: '基础质量管理->质量分析报告->保存'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/quality/QualityAnalysisReport/remove',
            mockPath: '/quality/QualityAnalysisReport/remove',
            desc: '基础质量管理->质量分析报告->删除'
        },
        {
            name: 'getInfo',
            method: 'POST',
            path: '/quality/QualityAnalysisReport/getInfo',
            mockPath: '/quality/QualityAnalysisReport/getInfo',
            desc: '基础质量管理->质量分析报告->详情'
        },
        {
            name: 'importExcel',
            method: 'POST',
            path: '/quality/QualityAnalysisReport/importExcel',
            mockPath: '/quality/QualityAnalysisReport/importExcel',
            desc: '基础质量管理->质量分析报告->导入excel'
        },
        {
            name: 'exportExcel',
            method: 'POST',
            path: '/quality/QualityAnalysisReport/exportExcel',
            mockPath: '/quality/QualityAnalysisReport/exportExcel',
            desc: '基础质量管理->质量分析报告->导出excel'
        }
    ],
    QualityBulletin: [
        {
            name: 'list',
            method: 'POST',
            path: '/quality/QualityBulletin/list',
            mockPath: '/quality/QualityBulletin/list',
            desc: '基础质量管理->质量通报->列表'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/quality/QualityBulletin/save',
            mockPath: '/quality/QualityBulletin/save',
            desc: '基础质量管理->质量通报->保存'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/quality/QualityBulletin/remove',
            mockPath: '/quality/QualityBulletin/remove',
            desc: '基础质量管理->质量通报->删除'
        },
        {
            name: 'getInfo',
            method: 'POST',
            path: '/quality/QualityBulletin/getInfo',
            mockPath: '/quality/QualityBulletin/getInfo',
            desc: '基础质量管理->质量通报->详情'
        },
        {
            name: 'importExcel',
            method: 'POST',
            path: '/quality/QualityBulletin/importExcel',
            mockPath: '/quality/QualityBulletin/importExcel',
            desc: '基础质量管理->质量通报->导入excel'
        },
        {
            name: 'exportExcel',
            method: 'POST',
            path: '/quality/QualityBulletin/exportExcel',
            mockPath: '/quality/QualityBulletin/exportExcel',
            desc: '基础质量管理->质量通报->导出excel'
        }
    ],
    QualityCase: [
        {
            name: 'list',
            method: 'POST',
            path: '/quality/QualityCase/list',
            mockPath: '/quality/QualityCase/list',
            desc: '基础质量管理->质量案例->列表'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/quality/QualityCase/save',
            mockPath: '/quality/QualityCase/save',
            desc: '基础质量管理->质量案例->保存'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/quality/QualityCase/remove',
            mockPath: '/quality/QualityCase/remove',
            desc: '基础质量管理->质量案例->删除'
        },
        {
            name: 'getInfo',
            method: 'POST',
            path: '/quality/QualityCase/getInfo',
            mockPath: '/quality/QualityCase/getInfo',
            desc: '基础质量管理->质量案例->详情'
        },
        {
            name: 'importExcel',
            method: 'POST',
            path: '/quality/QualityCase/importExcel',
            mockPath: '/quality/QualityCase/importExcel',
            desc: '基础质量管理->质量案例->导入excel'
        },
        {
            name: 'exportExcel',
            method: 'POST',
            path: '/quality/QualityCase/exportExcel',
            mockPath: '/quality/QualityCase/exportExcel',
            desc: '基础质量管理->质量案例->导出excel'
        }
    ]
}
