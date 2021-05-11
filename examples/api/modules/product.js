/**
 * USER API
 * Namespace: User
 */

export const repositoryApi = {
    baseData: [
        {
            name: 'dicTypeTree',
            method: 'POST',
            path: '/product/repository/baseData/dicTypeTree',
            mockPath: '/product/repository/baseData/dicTypeTree',
            desc: '知识库管理->基础数据管理->获取分类树'
        }, {
            name: 'dicListData',
            method: 'POST',
            path: '/product/repository/baseData/otherListData',
            mockPath: '/product/repository/baseData/otherListData',
            desc: '知识库管理->其他数据->列表'
        }, {
            name: 'dicRepeatedCodeCheck',
            method: 'POST',
            path: '/product/repository/baseData/repeatedCodeCheck',
            mockPath: '/product/repository/baseData/repeatedCodeCheck',
            desc: '知识库管理->其他数据->新建->编码重复性校验'
        },
        {
            name: 'dicRepeatedNameCheck',
            method: 'POST',
            path: '/product/repository/baseData/repeatedNameCheck',
            mockPath: '/product/repository/baseData/repeatedNameCheck',
            desc: '知识库管理->其他数据->新建->名称重复性校验'
        },
        {
            name: 'dicSave',
            method: 'POST',
            path: '/product/repository/baseData/save',
            mockPath: '/product/repository/baseData/save',
            desc: '知识库管理->其他数据->新建->保存'
        },
        {
            name: 'getDicInfo',
            method: 'POST',
            path: '/product/repository/baseData/getDicInfo',
            mockPath: '/product/repository/baseData/getDicInfo',
            desc: '知识库管理->其他数据->修改->获取数据详情'
        },
        {
            name: 'removeDic',
            method: 'POST',
            path: '/product/repository/baseData/removeDic',
            mockPath: '/product/repository/baseData/removeDic',
            desc: '知识库管理->其他数据->删除'
        },
        {
            name: 'removeDics',
            method: 'POST',
            path: '/product/repository/baseData/removeDics',
            mockPath: '/product/repository/baseData/removeDics',
            desc: '知识库管理->其他数据->删除'
        },
        {
            name: 'fileClassifyTreeData',
            method: 'POST',
            path: '/product/repository/baseData/fileClassifyTreeData',
            mockPath: '/product/repository/baseData/fileClassifyTreeData',
            desc: '知识库管理->项目文档类型->分类树'
        },
        {
            name: 'treeSave',
            method: 'POST',
            path: '/product/repository/baseData/treeSave',
            mockPath: '/product/repository/baseData/treeSave',
            desc: '知识库管理->树数据->新建->保存'
        },
        {
            name: 'classifyTreeData',
            method: 'POST',
            path: '/product/repository/kprojectClassify/classifyTreeData',
            mockPath: '/product/repository/kprojectClassify/classifyTreeData',
            desc: '知识库管理->项目类型->分类树'
        },
        {
            name: 'projectClassifySave',
            method: 'POST',
            path: '/product/repository/kprojectClassify/save',
            mockPath: '/product/repository/kprojectClassify/save',
            desc: '知识库管理->项目类型->保存'
        },
        {
            name: 'pcRepeatedCodeCheck',
            method: 'POST',
            path: '/product/repository/kprojectClassify/repeatedCodeCheck',
            mockPath: '/product/repository/kprojectClassify/repeatedCodeCheck',
            desc: '知识库管理->项目类型->项目类型编号重复性校验'
        },
        {
            name: 'pcRepeatedNameCheck',
            method: 'POST',
            path: '/product/repository/kprojectClassify/repeatedNameCheck',
            mockPath: '/product/repository/kprojectClassify/repeatedNameCheck',
            desc: '知识库管理->项目类型->项目类型名称重复性校验'
        },
        {
            name: 'getProjectClassifyInfo',
            method: 'POST',
            path: '/product/repository/kprojectClassify/getProjectClassifyInfo',
            mockPath: '/product/repository/kprojectClassify/getProjectClassifyInfo',
            desc: '知识库管理->项目类型->项目类型详细查询'
        },
        {
            name: 'getPCMonitorPointsData',
            method: 'POST',
            path: '/product/repository/kprojectClassify/getPCMonitorPointsData',
            mockPath: '/product/repository/kprojectClassify/getPCMonitorPointsData',
            desc: '知识库管理->项目类型->获取计划标识'
        },
        {
            name: 'pcRemove',
            method: 'POST',
            path: '/product/repository/kprojectClassify/remove',
            mockPath: '/product/repository/kprojectClassify/remove',
            desc: '知识库管理->项目类型->删除'
        },
        {
            name: 'getMarkPointsData',
            method: 'POST',
            path: '/product/repository/kprojectClassify/getMarkPointsData',
            mockPath: '/product/repository/kprojectClassify/getMarkPointsData',
            desc: '知识库管理->项目类型->获取标记类型'
        }, {
            name: 'saveMarkPointsData',
            method: 'POST',
            path: '/product/repository/kprojectClassify/saveMarkPointsData',
            mockPath: '/product/repository/kprojectClassify/saveMarkPointsData',
            desc: '知识库管理->项目类型->保存标记类型'
        },
        {
            name: 'kProjectClassifyLimitSumSave',
            method: 'POST',
            path: '/product/repository/kprojectClassify/kProjectClassifyLimitSumSave',
            mockPath: '/product/repository/kprojectClassify/kProjectClassifyLimitSumSave',
            desc: '知识库管理->三重一大限额设置->保存项目类型限额'
        },
        {
            name: 'resList',
            method: 'POST',
            path: '/product/repository/publicResource/listData',
            mockPath: '/product/repository/publicResource/listData',
            desc: '知识库管理->共性资源库->列表查询'
        },
        {
            name: 'removeRes',
            method: 'POST',
            path: '/product/repository/publicResource/removeRes',
            mockPath: '/product/repository/publicResource/removeRes',
            desc: '知识库管理->共性资源库->共性资源删除'
        },
        {
            name: 'resSave',
            method: 'POST',
            path: '/product/repository/publicResource/save',
            mockPath: '/product/repository/publicResource/save',
            desc: '知识库管理->共性资源库->共性资源保存'
        },
        {
            name: 'getPublicResourceInfo',
            method: 'POST',
            path: '/product/repository/publicResource/getPublicResourceInfo',
            mockPath: '/product/repository/publicResource/getPublicResourceInfo',
            desc: '知识库管理->共性资源库->共性资源库详细查询'
        },
        {
            name: 'repeatedNameCheck',
            method: 'POST',
            path: '/product/repository/publicResource/repeatedNameCheck',
            mockPath: '/product/repository/publicResource/repeatedNameCheck',
            desc: '知识库管理->共性资源库->共性资源名称重复性校验'
        },
        {
            name: 'repeatedCodeCheck',
            method: 'POST',
            path: '/product/repository/publicResource/repeatedCodeCheck',
            mockPath: '/product/repository/publicResource/repeatedCodeCheck',
            desc: '知识库管理->共性资源库->共性资源编号复性校验'
        },
        {
            name: 'getPublicResourceTypes',
            method: 'POST',
            path: '/product/repository/publicResource/getPublicResourceTypes',
            mockPath: '/product/repository/publicResource/getPublicResourceTypes',
            desc: '知识库管理->共性资源库->查询共性资源类型'
        },
        {
            name: 'kTeamsPage',
            method: 'POST',
            path: '/product/kTeams/kTeamsPage/get',
            mockPath: '/product/kTeams/kTeamsPage/get',
            desc: '知识库管理->标准团队管理->标准团队列表'
        },
        {
            name: 'kTeamsDelete',
            method: 'POST',
            path: '/product/kTeams/delete',
            mockPath: '/product/kTeams/delete',
            desc: '知识库管理->标准团队管理->标准团队删除'
        },
        {
            name: 'kTeamsRepeatedCheck',
            method: 'POST',
            path: '/product/kTeams/repeatedCheck',
            mockPath: '/product/kTeams/repeatedCheck',
            desc: '知识库管理->标准团队管理->标准团队名称校验唯一'
        },
        {
            name: 'kTeamsDetail',
            method: 'POST',
            path: '/product/kTeams/detail',
            mockPath: '/product/kTeams/detail',
            desc: '知识库管理->标准团队管理->标准团队信息'
        },
        {
            name: 'kTeamsSave',
            method: 'POST',
            path: '/product/kTeams/create',
            mockPath: '/product/kTeams/create',
            desc: '知识库管理->标准团队管理->标准团队保存'
        },
        {
            name: 'RoleClassifyListData',
            method: 'POST',
            path: '/product/kTeamRoleClassify/roleClassifyList/get',
            mockPath: '/product/kTeamRoleClassify/roleClassifyList/get',
            desc: '知识库管理->标准团队管理->标准团队角色类别列表'
        },
        {
            name: 'RoleClassifySave',
            method: 'POST',
            path: '/product/kTeamRoleClassify/create',
            mockPath: '/product/kTeamRoleClassify/create',
            desc: '知识库管理->标准团队管理->标准团队角色类别删除'
        },
        {
            name: 'RoleClassifyDelete',
            method: 'POST',
            path: '/product/kTeamRoleClassify/delete',
            mockPath: '/product/kTeamRoleClassify/delete',
            desc: '知识库管理->标准团队管理->标准团队角色类别列表'
        },
        {
            name: 'RoleClassifyRepeatedCheck',
            method: 'POST',
            path: '/product/kTeamRoleClassify/repeatedCheck',
            mockPath: '/product/kTeamRoleClassify/repeatedCheck',
            desc: '知识库管理->标准团队管理->标准团队角色类别名称校验唯一'
        },
        {
            name: 'ProblemPage',
            method: 'POST',
            path: '/product/Problem/ProblemPage/get',
            mockPath: '/product/Problem/ProblemPage/get',
            desc: '问题管理->问题管理->问题管理列表'
        },
        {
            name: 'JhyjPage',
            method: 'POST',
            path: '/product/Problem/ProblemPage/getJhyj',
            mockPath: '/product/Problem/ProblemPage/getJhyj',
            desc: '问题管理->问题管理->问题管理列表'
        },
        {
            name: 'productTeam',
            method: 'POST',
            path: '/product/repository/productTeam/listData',
            mockPath: '/product/repository/productTeam/listData',
            desc: '知识库管理->质量管理->产品队伍'
        },
        {
            name: 'productTeamSave',
            method: 'POST',
            path: '/product/repository/productTeam/save',
            mockPath: '/product/repository/productTeam/save',
            desc: '知识库管理->质量管理->产品队伍'
        },
        {
            name: 'productTeamRemove',
            method: 'POST',
            path: '/product/repository/productTeam/remove',
            mockPath: '/product/repository/productTeam/remove',
            desc: '知识库管理->质量管理->产品队伍'
        },
        {
            name: 'getProductTeamInfo',
            method: 'POST',
            path: '/product/repository/productTeam/getProductTeamInfo',
            mockPath: '/product/repository/productTeam/getProductTeamInfo',
            desc: '知识库管理->质量管理->产品队伍'
        }
    ],
    commonProjectTree: [
        {
            name: 'projectTree',
            method: 'POST',
            path: '/product/common/P8Tree/threeLayersTree',
            mockPath: '/product/common/P8Tree/threeLayersTree',
            desc: '项目结构树查询'
        },
        {
            name: 'projectTreeByMyTask',
            method: 'POST',
            path: '/product/common/P8Tree/threeLayersTreeByMyTask',
            mockPath: '/product/common/P8Tree/threeLayersTreeByMyTask',
            desc: '我的任务领域项目类型型号树'
        }
    ],
    commonModelTree: [
        {
            name: 'modelTree',
            method: 'POST',
            path: '/product/common/P8Tree/modelDominTree',
            mockPath: '/product/common/P8Tree/modelDominTree',
            desc: '领域型号树查询'
        }
    ],
    modelInformation: [
        {
            name: 'getMIList',
            method: 'POST',
            path: '/product/modelInformation/modelPage/get',
            mockPath: '/product/modelInformation/modelPage/get',
            desc: '知识库管理->型号信息管理->列表查询'
        },
        {
            name: 'MLDelete',
            method: 'POST',
            path: '/product/modelInformation/delete',
            mockPath: '/product/modelInformation/delete',
            desc: '知识库管理->型号信息管理->删除'
        },
        {
            name: 'MISave',
            method: 'POST',
            path: '/product/modelInformation/create',
            mockPath: '/product/modelInformation/create',
            desc: '知识库管理->型号信息管理->共性资源保存'
        },
        {
            name: 'MIGetInfo',
            method: 'POST',
            path: '/product/modelInformation/getInfo',
            mockPath: '/product/modelInformation/getInfo',
            desc: '知识库管理->型号信息管理->数据详情'
        },
        {
            name: 'MIRepeatedCheck',
            method: 'POST',
            path: '/product/modelInformation/repeatedCheck',
            mockPath: '/product/modelInformation/repeatedCheck',
            desc: '知识库管理->型号信息管理->型号信息名称校验唯一'
        },
        {
            name: 'checkDeleteDic',
            method: 'POST',
            path: '/product/modelInformation/checkDeleteDic',
            mockPath: '/product/modelInformation/checkDeleteDic',
            desc: '知识库管理->型号信息管理->型号信息所属领域删除校验'
        }
    ],
    OutputFlow: [
        {
            name: 'indexList',
            method: 'POST',
            path: '/product/repository/outputFlow/listData',
            mockPath: '/product/repository/outputFlow/listData',
            desc: '知识库管理->产出流程管理->列表数据'
        }, {
            name: 'getByActivityClassifyId',
            method: 'POST',
            path: '/product/repository/outputFlow/getByActivityClassifyId',
            mockPath: '/product/repository/outputFlow/getByActivityClassifyId',
            desc: '知识库管理->产出流程管理->根据项目类别获取'
        }, {
            name: 'editGetInfo',
            method: 'POST',
            path: '/product/repository/outputFlow/activityInfo',
            mockPath: '/product/repository/outputFlow/activityInfo',
            desc: '知识库管理->产出流程管理->流程详情数据查询'
        }, {
            name: 'editGetKTeamData',
            method: 'POST',
            path: '/product/repository/outputFlow/getKTeamData',
            mockPath: '/product/repository/outputFlow/getKTeamData',
            desc: '知识库管理->产出流程管理->获取企业标准团队'
        }, {
            name: 'editRepeatedNameCheck',
            method: 'POST',
            path: '/product/repository/outputFlow/repeatedNameCheck',
            mockPath: '/product/repository/outputFlow/repeatedNameCheck',
            desc: '知识库管理->产出流程管理-> 流程名称重复校验'
        }, {
            name: 'indexRemove',
            method: 'POST',
            path: '/product/repository/outputFlow/removeActivityInfo',
            mockPath: '/product/repository/outputFlow/removeActivityInfo',
            desc: '知识库管理->产出流程管理-> 流程删除'
        }, {
            name: 'saveActivityInfo',
            method: 'POST',
            path: '/product/repository/outputFlow/saveActivityInfo',
            mockPath: '/product/repository/outputFlow/saveActivityInfo',
            desc: '知识库管理->产出流程管理-> 流程保存'
        }, {
            name: 'copyKActivityInfo',
            method: 'POST',
            path: '/product/repository/outputFlow/copyActivityInfo',
            mockPath: '/product/repository/outputFlow/copyActivityInfo',
            desc: '知识库管理->产出流程管理-> 流程复制'
        }, {
            name: 'loadAcivityData',
            method: 'POST',
            path: '/product/repository/outputFlow/activityInfoTreeData',
            mockPath: '/product/repository/outputFlow/activityInfoTreeData',
            desc: '知识库管理->产出流程管理-> 活动树加载'
        }, {
            name: 'updateActivityInfos',
            method: 'POST',
            path: '/product/repository/outputFlow/updateActivityInfos',
            mockPath: '/product/repository/outputFlow/updateActivityInfos',
            desc: '知识库管理->产出流程管理-> 活动拖动、升降级更新'
        }, {
            name: 'saveNode',
            method: 'POST',
            path: '/product/repository/outputFlow/saveNode',
            mockPath: '/product/repository/outputFlow/saveNode',
            desc: '知识库管理->产出流程管理-> 新建活动保存'
        }, {
            name: 'GMloadModeData',
            method: 'POST',
            path: '/product/repository/outputFlow/loadModeData',
            mockPath: '/product/repository/outputFlow/loadModeData',
            desc: '知识库管理->产出流程管理-> [图形]数据加载'
        }, {
            name: 'GMdragNodeSave',
            method: 'POST',
            path: '/product/repository/outputFlow/dragNodeSave',
            mockPath: '/product/repository/outputFlow/dragNodeSave',
            desc: '知识库管理->产出流程管理-> [图形]拖动保存节点'
        }, {
            name: 'GMpredecessorsCreateOrUpdate',
            method: 'POST',
            path: '/product/repository/outputFlow/predecessorsCreateOrUpdate',
            mockPath: '/product/repository/outputFlow/predecessorsCreateOrUpdate',
            desc: '知识库管理->产出流程管理-> [图形]前后置连线创建和更新'
        }, {
            name: 'GMremovePredecessors',
            method: 'POST',
            path: '/product/repository/outputFlow/removePredecessors',
            mockPath: '/product/repository/outputFlow/removePredecessors',
            desc: '知识库管理->产出流程管理-> [图形] 删除前后置连线'
        }, {
            name: 'GMPredecessors',
            method: 'POST',
            path: '/product/repository/outputFlow/gmPredecessors',
            mockPath: '/product/repository/outputFlow/gmPredecessors',
            desc: '知识库管理->产出流程管理-> [图形]  获取前后置信息'
        }, {
            name: 'removeNodes',
            method: 'POST',
            path: '/product/repository/outputFlow/removeNodes',
            mockPath: '/product/repository/outputFlow/removeNodes',
            desc: '知识库管理->产出流程管理->删除活动，连同子删除'
        }, {
            name: 'activityInfo',
            method: 'POST',
            path: '/product/repository/outputFlow/activityInfo',
            mockPath: '/product/repository/outputFlow/activityInfo',
            desc: '知识库管理->产出流程管理->流程详情/活动描述详情数据查询'
        }, {
            name: 'describeSave',
            method: 'POST',
            path: '/product/repository/outputFlow/describeSave',
            mockPath: '/product/repository/outputFlow/describeSave',
            desc: '知识库管理->产出流程管理->活动描述保存'
        }, {
            name: 'OFrepeatedCodeCheck',
            method: 'POST',
            path: '/product/repository/outputFlow/repeatedCodeCheck',
            mockPath: '/product/repository/outputFlow/repeatedCodeCheck',
            desc: '知识库管理->产出流程管理->活动编号重复校验'
        }, {
            name: 'roleClassifyTree',
            method: 'POST',
            path: '/product/repository/outputFlow/roleClassifyTree',
            mockPath: '/product/repository/outputFlow/roleClassifyTree',
            desc: '知识库管理->产出流程管理->根据流程团队id获取团队角色信息'
        }, {
            name: 'inputInfo',
            method: 'POST',
            path: '/product/repository/outputFlow/inputInfo',
            mockPath: '/product/repository/outputFlow/inputInfo',
            desc: '知识库管理->产出流程管理->输入详情'
        }, {
            name: 'customInputInfo',
            method: 'POST',
            path: '/product/repository/outputFlow/customInputInfo',
            mockPath: '/product/repository/outputFlow/customInputInfo',
            desc: '知识库管理->产出流程管理->自定义的输入详情'
        }, {
            name: 'inputSave',
            method: 'POST',
            path: '/product/repository/outputFlow/inputSave',
            mockPath: '/product/repository/outputFlow/inputSave',
            desc: '知识库管理->产出流程管理->输入保存'
        }, {
            name: 'outputSave',
            method: 'POST',
            path: '/product/repository/outputFlow/outputSave',
            mockPath: '/product/repository/outputFlow/outputSave',
            desc: '知识库管理->产出流程管理->输出保存'
        }, {
            name: 'outputInfo',
            method: 'POST',
            path: '/product/repository/outputFlow/outputInfo',
            mockPath: '/product/repository/outputFlow/outputInfo',
            desc: '知识库管理->产出流程管理->输出详情'
        }, {
            name: 'specialSave',
            method: 'POST',
            path: '/product/repository/outputFlow/specialSave',
            mockPath: '/product/repository/outputFlow/specialSave',
            desc: '知识库管理->产出流程管理->活动特别说明保存'
        }, {
            name: 'specialInfo',
            method: 'POST',
            path: '/product/repository/outputFlow/specialInfo',
            mockPath: '/product/repository/outputFlow/specialInfo',
            desc: '知识库管理->产出流程管理->特别说明详情'
        }, {
            name: 'predecessorsTree',
            method: 'POST',
            path: '/product/repository/outputFlow/predecessorsTree',
            mockPath: '/product/repository/outputFlow/predecessorsTree',
            desc: '知识库管理->产出流程管理->前后置关系树数据源'
        }, {
            name: 'importExcel',
            method: 'POST',
            path: '/product/repository/outputFlow/importExcel',
            mockPath: '/product/repository/outputFlow/importExcel',
            desc: '知识库管理->产出流程管理->excel导入'
        }, {
            name: 'importExcelCheck',
            method: 'POST',
            path: '/product/repository/outputFlow/importExcelCheck',
            mockPath: '/product/repository/outputFlow/importExcelCheck',
            desc: '知识库管理->产出流程管理->excel导入检查'
        }
    ],
    PaModelFlot: [
        {
            name: 'paModelFlotList',
            method: 'POST',
            path: '/product/paModelFlot/paModelFlotList',
            mockPath: '/product/paModelFlot/paModelFlotList',
            desc: '项目策划管理-策划数据'
        },
        {
            name: 'classifyTree',
            method: 'POST',
            path: '/product/paModelFlot/classifyTree',
            mockPath: '/product/paModelFlot/classifyTree',
            desc: '项目策划管理-策划数据-树结构'
        },
        {
            name: 'savePaModelFlot',
            method: 'POST',
            path: '/product/paModelFlot/savePaModelFlot',
            mockPath: '/product/paModelFlot/savePaModelFlot',
            desc: '项目策划管理-策划数据-保存数据'
        },
        {
            name: 'showUpload',
            method: 'POST',
            path: '/product/paModelFlot/showUpload',
            mockPath: '/product/paModelFlot/showUpload',
            desc: '项目策划管理-策划数据-查看附件'
        },
        {
            name: 'getPaModelFlotById',
            method: 'POST',
            path: '/product/paModelFlot/getPaModelFlotById',
            mockPath: '/product/paModelFlot/getPaModelFlotById',
            desc: '项目策划管理-策划数据-修改'
        },
        {
            name: 'deleteById',
            method: 'POST',
            path: '/product/paModelFlot/deleteById',
            mockPath: '/product/paModelFlot/deleteById',
            desc: '项目策划管理-策划数据-删除'
        }
    ],
    MainJobRisk: [
        {
            name: 'jboRiskList',
            method: 'POST',
            path: '/product/MainJobRisk/jboRiskList',
            mockPath: '/product/MainJobRisk/jboRiskList',
            desc: '主要工作重点-列表展示'
        },
        {
            name: 'saveAll',
            method: 'POST',
            path: '/product/MainJobRisk/saveAll',
            mockPath: '/product/MainJobRisk/saveAll',
            desc: '主要工作重点-列表展示'
        }
    ],
    DutyToken: [
        {
            name: 'projectList',
            method: 'POST',
            path: '/product/duty/dutyToken/list',
            mockPath: '/product/duty/dutyToken/list',
            desc: '责任令组管理-列表数据'
        },
        {
            name: 'saveDuty',
            method: 'POST',
            path: '/product/duty/dutyToken/save',
            mockPath: '/product/duty/dutyToken/save',
            desc: '责任令组管理-新建责任令'
        },
        {
            name: 'deleteDuty',
            method: 'POST',
            path: '/product/duty/dutyToken/delete',
            mockPath: '/product/duty/dutyToken/delete',
            desc: '责任令组管理-删除责任令'
        },
        {
            name: 'editDuty',
            method: 'POST',
            path: '/product/duty/dutyToken/edit',
            mockPath: '/product/duty/dutyToken/edit',
            desc: '责任令组管理-修改责任令'
        },
        {
            name: 'dutyUser',
            method: 'POST',
            path: '/product/duty/dutyToken/user',
            mockPath: '/product/duty/dutyToken/user',
            desc: '责任令组管理-获取成员列表'
        },
        {
            name: 'saveMember',
            method: 'POST',
            path: '/product/duty/dutyToken/saveMember',
            mockPath: '/product/duty/dutyToken/saveMember',
            desc: '责任令组管理-存储成员列表'
        },
        {
            name: 'getMember',
            method: 'POST',
            path: '/product/duty/dutyToken/getMember',
            mockPath: '/product/duty/dutyToken/getMember',
            desc: '责任令组管理-获取成员列表'
        }
    ],
    ProjectApply: [
        {
            name: 'projectList',
            method: 'POST',
            path: '/product/em/wholeDescribe/list',
            mockPath: '/product/em/wholeDescribe/list',
            desc: '整体管理-列表数据'
        },
        {
            name: 'resourceManagerList',
            method: 'POST',
            path: '/product/em/wholeDescribe/resourceManagerList',
            mockPath: '/product/em/wholeDescribe/resourceManagerList',
            desc: '资源管理-列表数据'
        },
        {
            name: 'entiretyManagerList',
            method: 'POST',
            path: '/product/em/wholeDescribe/projectList',
            mockPath: '/product/em/wholeDescribe/projectList',
            desc: '立项管理-列表数据'
        },
        {
            name: 'readyList',
            method: 'POST',
            path: '/product/em/wholeDescribe/projectReadyList',
            mockPath: '/product/em/wholeDescribe/projectReadyList',
            desc: '立项准备-列表数据'
        },
        {
            name: 'getDeptLeader',
            method: 'POST',
            path: '/product/em/wholeDescribe/getDeptLeader',
            mockPath: '/product/em/wholeDescribe/getDeptLeader',
            desc: '立项准备-预审领导'
        },
        {
            name: 'commitProjectReadyApprove',
            method: 'POST',
            path: '/product/em/wholeDescribe/commitProjectReadyApprove',
            mockPath: '/product/em/wholeDescribe/commitProjectReadyApprove',
            desc: '立项准备-提交立项准备的部门内部审批流程'
        },
        {
            name: 'wholeDescribeSave',
            method: 'POST',
            path: '/product/em/wholeDescribe/save',
            mockPath: '/product/em/wholeDescribe/save',
            desc: '整体管理-保存'
        },
        {
            name: 'modelTree',
            method: 'POST',
            path: '/product/repository/ModelInformation/listData',
            mockPath: '/product/repository/ModelInformation/listData',
            desc: '型号列表'
        },
        {
            name: 'projectClassifyTree',
            method: 'POST',
            path: '/product/repository/kprojectClassify/projectClassifyTree',
            mockPath: '/product/repository/kprojectClassify/projectClassifyTree',
            desc: '项目类型树'
        },
        {
            name: 'fieldModelTree',
            method: 'POST',
            path: '/product/repository/kprojectClassify/fieldModelTree',
            mockPath: '/product/repository/kprojectClassify/fieldModelTree',
            desc: '领域型号树'
        },
        {
            name: 'fieldModelTreeWhole',
            method: 'POST',
            path: '/product/repository/kprojectClassify/fieldModelTreeWhole',
            mockPath: '/product/repository/kprojectClassify/fieldModelTreeWhole',
            desc: '领域型号树'
        },
        {
            name: 'projectClassifiedTree',
            method: 'POST',
            path: '/framework/common/Tree/projectClassifiedTree',
            mockPath: '/framework/common/Tree/projectClassifiedTree',
            desc: '项目分级'
        },
        {
            name: 'projectTypeTree',
            method: 'POST',
            path: '/framework/common/Tree/projectTypeTree',
            mockPath: '/framework/common/Tree/projectTypeTree',
            desc: '所属类别'
        },
        {
            name: 'userTree',
            method: 'POST',
            path: '/framework/common/UserSelect/getUserByDeptId',
            mockPath: '/framework/common/UserSelect/getUserByDeptId',
            desc: '根据角色获取指定人员'
        },
        {
            name: 'removeProject',
            method: 'POST',
            path: '/product/em/wholeDescribe/delete',
            mockPath: '/product/em/wholeDescribe/delete',
            desc: '移除项目信息'
        },
        {
            name: 'wholeDescribeData',
            method: 'POST',
            path: '/product/em/wholeDescribe/info',
            mockPath: '/product/em/wholeDescribe/info',
            desc: '修改项目信息'
        },
        {
            name: 'complete',
            method: 'POST',
            path: '/product/em/wholeDescribe/complete',
            mockPath: '/product/em/wholeDescribe/complete',
            desc: '完成流程任务'
        },
        {
            name: 'release',
            method: 'POST',
            path: '/product/em/wholeDescribe/release',
            mockPath: '/product/em/wholeDescribe/release',
            desc: '发布流程任务'
        },
        {
            name: 'commonModelList',
            method: 'POST',
            path: '/product/modelInformation/modelPage/get',
            mockPath: '/product/modelInformation/modelPage/get',
            desc: '所属型号'
        },
        {
            name: 'getModelListData',
            method: 'POST',
            path: '/product/modelInformation/getModelListData',
            mockPath: '/product/modelInformation/getModelListData',
            desc: '所属型号-查询'
        },
        {
            name: 'deptTree',
            method: 'POST',
            path: '/framework/system/Department/deptTree',
            mockPath: '/framework/system/Department/deptTree',
            params: { id: '1' },
            desc: '部门树'
        },
        {
            name: 'checkNo',
            method: 'POST',
            path: '/framework/system/Department/checkNo',
            mockPath: '/framework/system/Department/checkNo',
            params: {},
            desc: '部门编号重复检查'
        },
        {
            name: 'deptTreeByCurrent',
            method: 'POST',
            path: '/framework/system/Department/deptTreeByCurrent',
            mockPath: '/framework/system/Department/deptTreeByCurrent',
            params: { id: '1' },
            desc: '厂所团队管理部门数'
        },
        {
            name: 'getProcessDefinitionByBusinessId',
            method: 'GET',
            path: '/bpm/manage/ProcessDefinition/getProcessDefinitionByBusinessId',
            mockPath: '/bpm/manage/ProcessDefinition/getProcessDefinitionByBusinessId',
            desc: '根据业务Id获取流程定义xml'
        },
        {
            name: 'withdraw',
            method: 'POST',
            path: '/product/em/wholeDescribe/withdraw',
            mockPath: '/product/em/wholeDescribe/withdraw',
            desc: '根据业务Id获取流程定义xml'
        },
        {
            name: 'getActivityButton',
            method: 'GET',
            path: '/product/em/wholeDescribe/getActivityButton',
            mockPath: '/product/em/wholeDescribe/getActivityButton',
            desc: '获取列表状态对应的活动button'
        },
        {
            name: 'getDicAPIByTypes',
            method: 'GET',
            path: '/framework/system/BpDictionary/getDicAPIByTypes',
            mockPath: '/framework/system/BpDictionary/getDicAPIByTypes',
            desc: 'sss'
        },
        {
            name: 'getFlowTreeData',
            method: 'GET',
            path: '/product/repository/outputFlow/getTreeData',
            mockPath: '/product/repository/outputFlow/getTreeData',
            desc: 'sss'
        },
        {
            name: 'getPermissionSetting',
            method: 'GET',
            path: '/product/em/wholeDescribe/getPermissionSetting',
            mockPath: '/product/em/wholeDescribe/getPermissionSetting',
            desc: 'sss'
        },
        {
            name: 'permissionSettingSave',
            method: 'POST',
            path: '/product/em/wholeDescribe/permissionSettingSave',
            mockPath: '/product/em/wholeDescribe/permissionSettingSave',
            desc: 'sss'
        },
        {
            name: 'teamRoleValidator',
            method: 'POST',
            path: '/product/em/wholeDescribe/teamRoleValidator',
            mockPath: '/product/em/wholeDescribe/teamRoleValidator',
            desc: 'sss'
        }
    ],
    planInfoManager: [
        {
            name: 'treeListData',
            method: 'POST',
            path: '/product/pm/planManager/treeListData',
            mockPath: '/product/pm/planManager/treeListData',
            desc: '项目管理->计划管理->列表数据查询'
        },
        {
            name: 'comprehensiveTreeListData',
            method: 'POST',
            path: '/product/pm/planManager/comprehensiveTreeListData',
            mockPath: '/product/pm/planManager/comprehensiveTreeListData',
            desc: '综合计划管理->综合计划->列表数据查询'
        },
        {
            name: 'getCommitStatus',
            method: 'POST',
            path: '/product/pm/planManager/getCommitStatus',
            mockPath: '/product/pm/planManager/getCommitStatus',
            desc: '项目管理->计划管理->获取可提交的状态集'
        },
        {
            name: 'commitStatusValidator',
            method: 'POST',
            path: '/product/pm/planManager/commitStatusValidator',
            mockPath: '/product/pm/planManager/commitStatusValidator',
            desc: '项目管理->计划管理->提交启动流程校验'
        },
        {
            name: 'commitStatusFilter',
            method: 'POST',
            path: '/product/pm/planManager/commitStatusFilter',
            mockPath: '/product/pm/planManager/commitStatusFilter',
            desc: '项目管理->计划管理->获取计划实时状态'
        },
        {
            name: 'commitStatus',
            method: 'POST',
            path: '/product/pm/planManager/commitStatus',
            mockPath: '/product/pm/planManager/commitStatus',
            desc: '项目管理->计划管理->获取可提交的状态集'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/product/pm/planManager/save',
            mockPath: '/product/pm/planManager/save',
            desc: '项目管理->计划管理->新建计划保存'
        },
        {
            name: 'getWholeDescribePage',
            method: 'POST',
            path: '/product/pm/planManager/getWholeDescribePage',
            mockPath: '/product/pm/planManager/getWholeDescribePage',
            desc: '项目管理->计划管理->计划新建-选择项目列表数据源'
        },
        {
            name: 'getWholeDescribeById',
            method: 'POST',
            path: '/product/pm/planManager/getWholeDescribeById',
            mockPath: '/product/pm/planManager/getWholeDescribeById',
            desc: '项目管理->计划管理->计划新建-选择项目后回调'
        },
        {
            name: 'getPlanInfo',
            method: 'POST',
            path: '/product/pm/planManager/getPlanInfo',
            mockPath: '/product/pm/planManager/getPlanInfo',
            desc: '项目管理->计划管理->获取计划详情',
            cancelLoading: true
        },
        {
            name: 'removePlanInfo',
            method: 'POST',
            path: '/product/pm/planManager/removePlanInfo',
            mockPath: '/product/pm/planManager/removePlanInfo',
            desc: '项目管理->计划管理->计划删除'
        },
        {
            name: 'loadLockUnlockFormData',
            method: 'POST',
            path: '/product/pm/planManager/loadLockUnlockFormData',
            mockPath: '/product/pm/planManager/loadLockUnlockFormData',
            desc: '项目管理->计划管理->计划加解锁表单数据获取'
        },
        {
            name: 'saveLockUnlockForm',
            method: 'POST',
            path: '/product/pm/planManager/saveLockUnlockForm',
            mockPath: '/product/pm/planManager/saveLockUnlockForm',
            desc: '项目管理->计划管理->计划删除'
        },
        {
            name: 'startPlanInfo',
            method: 'POST',
            path: '/product/pm/planManager/startPlanInfo',
            mockPath: '/product/pm/planManager/startPlanInfo',
            desc: '项目管理->计划管理->计划发布'
        },
        {
            name: 'loadButtonJurisdiction',
            method: 'POST',
            path: '/product/pm/planManager/loadButtonJurisdiction',
            mockPath: '/product/pm/planManager/loadButtonJurisdiction',
            desc: '项目管理->计划管理->计划删除'
        },
        {
            name: 'loadPlanStatusLimitStrategy',
            method: 'POST',
            path: '/product/pm/planManager/loadPlanStatusLimitStrategy',
            mockPath: '/product/pm/planManager/loadPlanStatusLimitStrategy',
            desc: '项目管理->计划管理->获取计划状态对应gantt操作权限'
        },
        {
            name: 'releasePlanInfoCheck',
            method: 'POST',
            path: '/product/pm/planManager/releasePlanInfoCheck',
            mockPath: '/product/pm/planManager/releasePlanInfoCheck',
            desc: '项目管理->计划管理->计划发布校验'
        },
        {
            name: 'boardTree',
            method: 'POST',
            path: '/product/pm/board/treeListData',
            mockPath: '/product/pm/board/treeListData',
            desc: '计划看板->计划看板->左侧树加载'
        },
        {
            name: 'boardData',
            method: 'POST',
            path: '/product/pm/board/listData',
            mockPath: '/product/pm/board/listData',
            desc: '计划看板->计划看板->左侧树加载'
        },
      {
        name: 'withdraw',
        method: 'POST',
        path: '/product/pm/planManager/withdraw',
        mockPath: '/product/pm/planManager/withdraw',
        desc: '项目管理->计划管理->计划撤回'
      },
      {
        name: 'getProcessDefinitionKeyByStatus',
        method: 'POST',
        path: '/product/pm/planManager/getProcessDefinitionKeyByStatus',
        mockPath: '/product/pm/planManager/getProcessDefinitionKeyByStatus',
        desc: '项目管理->计划管理->获取流程定义Key'
      }
    ],
    riskManager: [
        {
            name: 'storeListDate',
            method: 'POST',
            path: '/product/risk/riskBase/storeListDate',
            mockPath: '/product/risk/riskBase/storeListDate',
            desc: '风险管理->风险库管理->数据加载'
        },
        {
            name: 'listData',
            method: 'POST',
            path: '/product/risk/riskManage/listData',
            mockPath: '/product/risk/riskManage/listData',
            desc: '风险管理->风险库管理->数据加载'
        },
        {
            name: 'myListData',
            method: 'POST',
            path: '/product/risk/riskManage/myListData',
            mockPath: '/product/risk/riskManage/myListData',
            desc: '风险管理->风险库管理->数据加载'
        },
        {
            name: 'getRiskManageById',
            method: 'POST',
            path: '/product/risk/riskManage/getRiskManageById',
            mockPath: '/product/risk/riskManage/getRiskManageById',
            desc: '风险管理->风险库管理->修改'
        },
        {
            name: 'removeById',
            method: 'POST',
            path: '/product/risk/riskManage/removeById',
            mockPath: '/product/risk/riskManage/removeById',
            desc: '风险管理->风险库管理->删除'
        },
        {
            name: 'saveRiskBase',
            method: 'POST',
            path: '/product/risk/riskBase/saveRiskBase',
            mockPath: '/product/risk/riskBase/saveRiskBase',
            desc: '风险管理->风险库管理->保存风险库'
        },
        {
            name: 'saveRiskManage',
            method: 'POST',
            path: '/product/risk/riskManage/saveRiskManage',
            mockPath: '/product/risk/riskManage/saveRiskManage',
            desc: '风险管理->风险库管理->保存风险分配'
        },
        {
            name: 'updateRiskManage',
            method: 'POST',
            path: '/product/risk/riskManage/updateRiskManage',
            mockPath: '/product/risk/riskManage/updateRiskManage',
            desc: '风险管理->风险库管理->更新风险分配'
        },
        {
            name: 'getById',
            method: 'POST',
            path: '/product/risk/riskBase/getById',
            mockPath: '/product/risk/riskBase/getById',
            desc: '风险管理->风险库管理->风险库对象'
        },
        {
            name: 'deleteById',
            method: 'POST',
            path: '/product/risk/riskBase/deleteById',
            mockPath: '/product/risk/riskBase/deleteById',
            desc: '风险管理->风险库管理->删除风险库'
        },
        {
            name: 'myRiskProcess',
            method: 'POST',
            path: '/product/risk/riskManage/myRiskProcess',
            mockPath: '/product/risk/riskManage/myRiskProcess',
            desc: '我的任务->我的风险处理->风险分配'
        }
    ],
    planGanttManager: [
        {
            name: 'loadPlanGanttData',
            method: 'POST',
            path: '/product/pm/plan/loadPlanGanttData',
            mockPath: '/product/pm/plan/loadPlanGanttData',
            desc: '项目管理->计划管理->计划编辑 -> gantt数据加载',
            cancelLoading: true
        },
        {
            name: 'loadGanttAfterData',
            method: 'POST',
            path: '/product/pm/plan/loadGanttAfterData',
            mockPath: '/product/pm/plan/loadGanttAfterData',
            desc: '项目管理->计划管理->计划编辑 -> gantt加载后其他数据加载',
            cancelLoading: true
        },
        {
            name: 'loadPlanGanttResourceData',
            method: 'POST',
            path: '/product/pm/plan/loadPlanGanttResourceData',
            mockPath: '/product/pm/plan/loadPlanGanttResourceData',
            desc: '项目管理->计划管理->计划编辑 -> gantt资源数据加载',
            cancelLoading: true
        },
        {
            name: 'projectPlanTree',
            method: 'POST',
            path: '/product/pm/plan/projectPlanTree',
            mockPath: '/product/pm/plan/projectPlanTree',
            desc: '项目计划树'
        },
        {
            name: 'createPlanGanttData',
            method: 'POST',
            path: '/product/pm/plan/createPlanGanttData',
            mockPath: '/product/pm/plan/createPlanGanttData',
            desc: '项目管理->计划管理->计划编辑 -> 新建任务'
        },
        {
            name: 'removePlanGanttData',
            method: 'POST',
            path: '/product/pm/plan/removePlanGanttData',
            mockPath: '/product/pm/plan/removePlanGanttData',
            desc: '项目管理->计划管理->计划编辑 -> 删除任务'
        },
        {
            name: 'updatePlanGanttData',
            method: 'POST',
            path: '/product/pm/plan/updatePlanGanttData',
            mockPath: '/product/pm/plan/updatePlanGanttData',
            desc: '项目管理->计划管理->计划编辑 -> 任务更新'
        },
        {
            name: 'createPlanGanttLink',
            method: 'POST',
            path: '/product/pm/plan/createPlanGanttLink',
            mockPath: '/product/pm/plan/createPlanGanttLink',
            desc: '项目管理->计划管理->计划编辑 -> 新建前后置关系'
        },
        {
            name: 'planResourceLoad',
            method: 'POST',
            path: '/product/pm/plan/planResourceLoad',
            mockPath: '/product/pm/plan/planResourceLoad',
            desc: '项目管理->计划管理->计划编辑 -> 团队资源数据加载'
        },
        {
            name: 'resourceTaskLoad',
            method: 'POST',
            path: '/product/pm/plan/resourceTaskLoad',
            mockPath: '/product/pm/plan/resourceTaskLoad',
            desc: '项目管理->计划管理->计划编辑 -> 团队资源对应任务数据加载'
        },
        {
            name: 'removePlanGanttLink',
            method: 'POST',
            path: '/product/pm/plan/removePlanGanttLink',
            mockPath: '/product/pm/plan/removePlanGanttLink',
            desc: '项目管理->计划管理->计划编辑 -> 删除前后置关系'
        },
        {
            name: 'calculateParentForecastDate',
            method: 'POST',
            path: '/product/pm/plan/calculateParentForecastDate',
            mockPath: '/product/pm/plan/calculateParentForecastDate',
            desc: '项目管理->计划管理->计划编辑 -> 更新预计时间',
            cancelLoading: true
        },
        {
            name: 'loadMonitorPointData',
            method: 'POST',
            path: '/product/pm/plan/loadMonitorPointData',
            mockPath: '/product/pm/plan/loadMonitorPointData',
            desc: '项目管理->计划管理->计划编辑 -> 计划标识数据加载',
            cancelLoading: true
        },
        {
            name: 'updateTaskStyle',
            method: 'POST',
            path: '/product/pm/plan/updateTaskStyle',
            mockPath: '/product/pm/plan/updateTaskStyle',
            desc: '项目管理->计划管理->计划编辑 -> 任务样式更新',
            cancelLoading: true
        },
        {
            name: 'copyTasks',
            method: 'POST',
            path: '/product/pm/plan/copyTasks',
            mockPath: '/product/pm/plan/copyTasks',
            desc: '项目管理->计划管理->计划编辑 -> 任务复制'
        },
        {
            name: 'pasteTasks',
            method: 'POST',
            path: '/product/pm/plan/pasteTasks',
            mockPath: '/product/pm/plan/pasteTasks',
            desc: '项目管理->计划管理->计划编辑 -> 任务粘贴',
            cancelLoading: true
        },
        {
            name: 'loadTaskClassifyData',
            method: 'POST',
            path: '/product/pm/plan/loadTaskClassifyData',
            mockPath: '/product/pm/plan/loadTaskClassifyData',
            desc: '项目管理->计划管理->计划编辑 -> 加载任务类型',
            cancelLoading: true
        },
        {
            name: 'loadSelectOptionData',
            method: 'POST',
            path: '/product/pm/plan/loadSelectOptionData',
            mockPath: '/product/pm/plan/loadSelectOptionData',
            desc: '项目管理->计划管理->计划编辑 -> 查询下拉选数据查询',
            cancelLoading: true
        },
        {
            name: 'getActivityInfoByTaskId',
            method: 'POST',
            path: '/product/pm/plan/getActivityInfoByTaskId',
            mockPath: '/product/pm/plan/getActivityInfoByTaskId',
            desc: '项目管理->计划管理->计划编辑 -> 任务详情查询'
        },
        {
            name: 'describeSave',
            method: 'POST',
            path: '/product/pm/plan/describeSave',
            mockPath: '/product/pm/plan/describeSave',
            desc: '项目管理->计划管理->计划编辑 -> 任务描述保存'
        },
        {
            name: 'customInputInfo',
            method: 'POST',
            path: '/product/pm/plan/customInputInfo',
            mockPath: '/product/pm/plan/customInputInfo',
            desc: '项目管理->计划管理->计划编辑 -> 获取自定义任务输入物'
        },
        {
            name: 'inputSave',
            method: 'POST',
            path: '/product/pm/plan/inputSave',
            mockPath: '/product/pm/plan/inputSave',
            desc: '项目管理->计划管理->计划编辑 -> 输入物保存'
        },
        {
            name: 'inputInfo',
            method: 'POST',
            path: '/product/pm/plan/inputInfo',
            mockPath: '/product/pm/plan/inputInfo',
            desc: '项目管理->计划管理->计划编辑->输入数据获取'
        },
        {
            name: 'outputInfo',
            method: 'POST',
            path: '/product/pm/plan/outputInfo',
            mockPath: '/product/pm/plan/outputInfo',
            desc: '项目管理->计划管理->计划编辑 -> 任务输出详情查询'
        },
        {
            name: 'outputSave',
            method: 'POST',
            path: '/product/pm/plan/outputSave',
            mockPath: '/product/pm/plan/outputSave',
            desc: '项目管理->计划管理->计划编辑 -> 任务输出保存'
        },
        {
            name: 'specialInfo',
            method: 'POST',
            path: '/product/pm/plan/specialInfo',
            mockPath: '/product/pm/plan/specialInfo',
            desc: '项目管理->计划管理->计划编辑 -> 任务特别说明详情'
        },
        {
            name: 'specialSave',
            method: 'POST',
            path: '/product/pm/plan/specialSave',
            mockPath: '/product/pm/plan/specialSave',
            desc: '项目管理->计划管理->计划编辑 -> 任务特别说明保存'
        },
        {
            name: 'importActivityInfoClassifyTree',
            method: 'POST',
            path: '/product/pm/plan/importActivityInfoClassifyTree',
            mockPath: '/product/pm/plan/importActivityInfoClassifyTree',
            desc: '项目管理->计划管理->活动导入->活动导入左侧树数据源',
            cancelLoading: true
        },
        {
            name: 'importActivityInfoTree',
            method: 'POST',
            path: '/product/pm/plan/importActivityInfoTree',
            mockPath: '/product/pm/plan/importActivityInfoTree',
            desc: '项目管理->计划管理->活动导入->活动导入右侧树数据源'
        },
        {
            name: 'importActivityInfo',
            method: 'POST',
            path: '/product/pm/plan/importActivityInfo',
            mockPath: '/product/pm/plan/importActivityInfo',
            desc: '项目管理->计划管理->计划删除->活动导入',
            cancelLoading: true
        },
        {
            name: 'excelExport',
            method: 'POST',
            path: '/product/pm/plan/excelExport',
            mockPath: '/product/pm/plan/excelExport',
            desc: '项目管理->计划管理->计划编制->数据->Excel导出'
        },
        {
            name: 'excelProject',
            method: 'POST',
            path: '/product/pm/plan/excelProject',
            mockPath: '/product/pm/plan/excelProject',
            desc: '项目管理->计划管理->计划编制->数据->project导出'
        },
        {
            name: 'importExcel',
            method: 'POST',
            path: '/product/pm/plan/importExcel',
            mockPath: '/product/pm/plan/importExcel',
            desc: '项目管理->计划管理->计划编制->数据->导入excel',
            cancelLoading: true
        }, {
            name: 'importExcelCheckOut',
            method: 'POST',
            path: '/product/pm/plan/importExcelCheckOut',
            mockPath: '/product/pm/plan/importExcelCheckOut',
            desc: '知识库管理->产出流程管理->excel导入检查',
            cancelLoading: true
        }, {
            name: 'importProject',
            method: 'POST',
            path: '/product/pm/plan/importProject',
            mockPath: '/product/pm/plan/importProject',
            desc: '项目管理->计划管理->计划编制->数据->导入excel',
            cancelLoading: true
        }, {
            name: 'importProjectCheckout',
            method: 'POST',
            path: '/product/pm/plan/importProjectCheckout',
            mockPath: '/product/pm/plan/importProjectCheckout',
            desc: '知识库管理->产出流程管理->excel导入检查',
            cancelLoading: true
        }, {
            name: 'monitorTimeSave',
            method: 'POST',
            path: '/product/pm/plan/monitorTimeSave',
            mockPath: '/product/pm/plan/monitorTimeSave',
            desc: '项目管理->计划管理->计划编辑->标识管理时间保存',
            cancelLoading: true
        },
        {
            name: 'monitorTimeRemove',
            method: 'POST',
            path: '/product/pm/plan/monitorTimeRemove',
            mockPath: '/product/pm/plan/monitorTimeRemove',
            desc: '项目管理->计划管理->计划属性->标识删除'
        },
        {
            name: 'monitorTimeInfo',
            method: 'POST',
            path: '/product/pm/plan/monitorTimeInfo',
            mockPath: '/product/pm/plan/monitorTimeInfo',
            desc: '项目管理->计划管理->计划编辑->标识管理时间详情'
        },
        {
            name: 'getTaskMonitorByTaskId',
            method: 'POST',
            path: '/product/pm/plan/getTaskMonitorByTaskId',
            mockPath: '/product/pm/plan/getTaskMonitorByTaskId',
            desc: '项目管理->计划管理->计划编辑->计划属性->获取任务标识信息---弃用'
        },
        {
            name: 'saveTaskMonitorInfo',
            method: 'POST',
            path: '/product/pm/plan/saveTaskMonitorInfo',
            mockPath: '/product/pm/plan/saveTaskMonitorInfo',
            desc: '项目管理->计划管理->计划编辑->计划属性->任务标识信息保存'
        },
        {
            name: 'getDependenceByTaskId',
            method: 'POST',
            path: '/product/pm/plan/getDependenceByTaskId',
            mockPath: '/product/pm/plan/getDependenceByTaskId',
            desc: '项目管理->计划管理->计划编辑->计划属性->获取任务依赖关系详情'
        },
        {
            name: 'saveDependence',
            method: 'POST',
            path: '/product/pm/plan/saveDependence',
            mockPath: '/product/pm/plan/saveDependence',
            desc: '项目管理->计划管理->计划编辑->计划属性->任务依赖详情保存'
        },
        {
            name: 'comResourceTaskSave',
            method: 'POST',
            path: '/product/pm/comResourceTask/comResourceTaskSave',
            mockPath: '/product/pm/comResourceTask/comResourceTaskSave',
            desc: '项目管理->计划管理->计划编辑->共性资源->共性资源详情保存'
        },
        {
            name: 'unComResourceTaskSave',
            method:
                'GET',
            path:
                '/product/pm/comResourceTask/unComResourceTaskSave',
            mockPath:
                '/product/pm/comResourceTask/unComResourceTaskSave',
            desc:
                '项目管理->计划管理->计划编辑->共性资源->取消共性资源'
        },
        {
            name: 'issuePlanTasks',
            method: 'POST',
            path: '/product/pm/plan/issuePlanTasks',
            mockPath: '/product/pm/plan/issuePlanTasks',
            desc: '项目管理->计划管理->计划编辑->计划下发',
            cancelLoading: true
        },
        {
            name: 'changePlanScheduling',
            method: 'POST',
            path: '/product/pm/plan/changePlanScheduling',
            mockPath: '/product/pm/plan/changePlanScheduling',
            desc: '项目管理->计划管理->计划编辑->计划排程模式自动切换为手动',
            cancelLoading: true
        },
        {
            name: 'onGanttRenderUpdate',
            method: 'POST',
            path: '/product/pm/plan/onGanttRenderUpdate',
            mockPath: '/product/pm/plan/onGanttRenderUpdate',
            desc: '项目管理->计划管理->计划编辑->计划加载完成后数据更新',
            cancelLoading: true
        }
    ],
    projectTeam: [
    {
      name: 'index',
      method: 'POST',
      path: '/product/hr/ProjectTeam/index',
      mockPath: '/product/hr/ProjectTeam/index',
      desc: '项目管理->资源管理->团队管理'
    },
    {
      name: 'userList',
      method: 'POST',
      path: '/product/hr/ProjectTeam/roleUserList',
      mockPath: '/product/hr/ProjectTeam/roleUserList',
      desc: '项目管理->资源管理->团队管理->团队人员选择列表'
    },
    {
      name: 'myRoleList',
      method: 'POST',
      path: '/product/hr/ProjectTeam/myRoleList',
      mockPath: '/product/hr/ProjectTeam/myRoleList',
      desc: '项目管理->资源管理->团队管理->载入标准团队-我的经验团队列表'
    },
    {
      name: 'getAllKTeams',
      method: 'POST',
      path: '/product/kTeams/getAllKTeams',
      mockPath: '/product/kTeams/getAllKTeams',
      desc: '获取所有的标准团队'
    },
    {
      name: 'save',
      method: 'POST',
      path: '/product/hr/ProjectTeam/save',
      mockPath: '/product/hr/ProjectTeam/save',
      desc: '保存项目团队信息'
    },
    {
      name: 'userTaskDetail',
      method: 'POST',
      path: '/product/hr/ProjectTeam/userTaskDetail',
      mockPath: '/product/hr/ProjectTeam/userTaskDetail',
      desc: '用户任务明细'
    },
    {
      name: 'myWholeDescribeList',
      method: 'POST',
      path: '/product/hr/ProjectTeam/myWholeDescribeList',
      mockPath: '/product/hr/ProjectTeam/myWholeDescribeList',
      desc: '载入标准团队-我的经验团队项目列表'
    },
    {
      name: 'updateUserInfo',
      method: 'POST',
      path: '/product/hr/ProjectTeam/updateUserInfo',
      mockPath: '/product/hr/ProjectTeam/updateUserInfo',
      desc: '更新人员信息'
    }
  ],
    taskManager: [
        {
            name: 'normalTaskList',
            method: 'POST',
            path: '/product/my/work/task/normalTaskList',
            mockPath: '/product/my/work/task/normalTaskList',
            desc: '我的任务->列表->获取正常任务'
        }, {
            name: 'overallTaskList',
            method: 'POST',
            path: '/product/my/work/task/overallTaskList',
            mockPath: '/product/my/work/task/overallTaskList',
            desc: '我的任务->列表->获取统筹任务'
        },
        {
            name: 'withdrawTaskApprove',
            method: 'GET',
            path: '/product/my/work/task/withdrawTaskApprove',
            mockPath: '/product/my/work/task/withdrawTaskApprove',
            desc: '我的任务->列表->审批撤回'
        },
        {
            name: 'isChildrenFinished',
            method: 'GET',
            path: '/product/my/work/task/isChildrenFinished',
            mockPath: '/product/my/work/task/isChildrenFinished',
            desc: '我的任务->列表->子任务是否都完成'
        },
        {
            name: 'isHaveParentTaskUser',
            method: 'GET',
            path: '/product/my/work/task/isHaveParentTaskUser',
            mockPath: '/product/my/work/task/isHaveParentTaskUser',
            desc: '我的任务->列表->父任务是否有责任人'
        },
        {
            name: 'isHaveParentTaskParentId',
            method: 'GET',
            path: '/product/my/work/task/isHaveParentTaskParentId',
            mockPath: '/product/my/work/task/isHaveParentTaskParentId',
            desc: '我的任务->列表->父任务是否有父id(如果有则该任务非二级任务)'
        },
        {
            name: 'progressFeedback',
            method: 'POST',
            path: '/product/my/work/task/progressFeedback',
            mockPath: '/product/my/work/task/progressFeedback',
            desc: '我的任务->列表->计划执行->进度反馈-提交'
        },
        {
            name: 'progressFeedbackCheck',
            method: 'POST',
            path: '/product/my/work/task/progressFeedbackCheck',
            mockPath: '/product/my/work/task/progressFeedbackCheck',
            desc: '我的任务->列表->计划执行->进度反馈-提交'
        },
        {
            name: 'progressFeedbackHistory',
            method: 'POST',
            path: '/product/my/work/task/progressFeedbackHistory',
            mockPath: '/product/my/work/task/progressFeedbackHistory',
            desc: '我的任务->列表->计划执行->进度反馈-获取历史反馈'
        },
        {
            name: 'deviationReasons',
            method: 'POST',
            path: '/product/my/work/task/deviationReasons',
            mockPath: '/product/my/work/task/deviationReasons',
            desc: '我的任务->列表->计划执行->偏离原因-提交'
        },
        {
            name: 'deviationReasonsHistory',
            method: 'POST',
            path: '/product/my/work/task/deviationReasonsHistory',
            mockPath: '/product/my/work/task/deviationReasonsHistory',
            desc: '我的任务->列表->计划执行->偏离原因-获取历史反馈'
        },
        {
            name: 'changeRequest',
            method: 'POST',
            path: '/product/my/work/task/changeRequest',
            mockPath: '/product/my/work/task/changeRequest',
            desc: '我的任务->列表->计划执行->变更申请-提交'
        },
        {
            name: 'changeRequestHistory',
            method: 'GET',
            path: '/product/my/work/task/changeRequestHistory',
            mockPath: '/product/my/work/task/changeRequestHistory',
            desc: '我的任务->列表->计划执行->变更申请-获取历史反馈'
        },
        {
            name: 'getStatusByCurrent',
            method: 'GET',
            path: '/product/my/work/task/getStatusByCurrent',
            mockPath: '/product/my/work/task/getStatusByCurrent',
            desc: '我的任务->列表->计划执行->获取任务的下一个状态'
        },
        {
            name: 'taskInfo',
            method: 'GET',
            path: '/product/my/work/task/getTaskById',
            mockPath: '/product/my/work/task/getTaskById',
            desc: '我的任务->列表->计划执行->获取任务信息'
        },
        {
            name: 'getOutputRequire',
            method: 'GET',
            path: '/product/my/work/task/getOutputRequire',
            mockPath: '/product/my/work/task/getOutputRequire',
            desc: '我的任务->列表->计划执行->管理要素->获取输出要求'
        },
        {
            name: 'getOutputIo',
            method: 'GET',
            path: '/product/my/work/task/getOutputIo',
            mockPath: '/product/my/work/task/getOutputIo',
            desc: '我的任务->列表->计划执行->管理要素->获取输出物'
        },
        {
            name: 'saveOutputIo',
            method: 'POST',
            path: '/product/my/work/task/saveOutputIo',
            mockPath: '/product/my/work/task/saveOutputIo',
            desc: '我的任务->列表->计划执行->管理要素->保存输出物'
        },
        {
            name: 'getActivityDescription',
            method: 'GET',
            path: '/product/my/work/task/getActivityDescription',
            mockPath: '/product/my/work/task/getActivityDescription',
            desc: '我的任务->列表->计划执行->管理要素->获取活动描述'
        },
        {
            name: 'saveActivityDescription',
            method: 'POST',
            path: '/product/my/work/task/saveActivityDescription',
            mockPath: '/product/my/work/task/saveActivityDescription',
            desc: '我的任务->列表->计划执行->管理要素->保存活动描述-描述'
        },
        {
            name: 'getSpecialVersion',
            method: 'GET',
            path: '/product/my/work/task/getSpecialVersion',
            mockPath: '/product/my/work/task/getSpecialVersion',
            desc: '我的任务->列表->计划执行->管理要素->获取特别说明'
        },
        {
            name: 'getInputRequire',
            method: 'GET',
            path: '/product/my/work/task/getInputRequire',
            mockPath: '/product/my/work/task/getInputRequire',
            desc: '我的任务->列表->计划执行->关联任务->获取输入要求'
        },
        {
            name: 'getInputIo',
            method: 'GET',
            path: '/product/my/work/task/getInputIo',
            mockPath: '/product/my/work/task/getInputIo',
            desc: '我的任务->列表->计划执行->关联任务->获取关联任务数据(wbs和前后置)'
        },
        {
            name: 'getGojsData',
            method: 'GET',
            path: '/product/my/work/task/getGojsData',
            mockPath: '/product/my/work/task/getGojsData',
            desc: '我的任务->列表->计划执行->管理要素->获取输入物'
        },
        {
            name: 'taskTabSize',
            method: 'POST',
            path: '/product/my/work/task/getTaskTabSize',
            mockPath: '/product/my/work/task/getTaskTabSize',
            desc: '我的任务->选项页->正常、统筹数量'
        }
    ],
    downTaskFinishCase: [
        {
            name: 'list',
            method: 'POST',
            path: '/product/statistics/PlanTaskFinishCase/list',
            mockPath: '/product/statistics/PlanTaskFinishCase/list',
            desc: '我的任务完成情况->列表展示'
        }
    ],
    earlyWarning: [
        {
            name: 'EarlyWarningList',
            method: 'POST',
            path: '/framework/taskWarning/getDoMainList',
            mockPath: '/framework/taskWarning/getDoMainList',
            desc: '知识库管理->预警规则配置->列表'
        },
        {
            name: 'saveEarlyWarning',
            method: 'POST',
            path: '/framework/taskWarning/saveEarlyWarning',
            mockPath: '/framework/taskWarning/saveEarlyWarning',
            desc: '知识库管理->预警规则配置->保存'
        },
        {
            name: 'monitorPoints',
            method: 'POST',
            path: '/framework/taskWarning/getMonitorPointData',
            mockPath: '/framework/taskWarning/getMonitorPointData',
            desc: '知识库管理->预警规则配置->标识列表'
        }
    ],
    planChange: [
        {
            name: 'planChangeList',
            method: 'POST',
            path: '/product/pm/planChange/planChangeList',
            mockPath: '/product/pm/planChange/planChangeList',
            desc: '计划管理->计划变更->变更记录列表加载'
        },
        {
            name: 'planTaskJsonSave',
            method: 'POST',
            path: '/product/pm/planChange/planTaskJsonSave',
            mockPath: '/product/pm/planChange/planTaskJsonSave',
            desc: '计划管理->计划变更->变更gantt数据保存'
        },
        {
            name: 'removePlanChange',
            method: 'POST',
            path: '/product/pm/planChange/removePlanChange',
            mockPath: '/product/pm/planChange/removePlanChange',
            desc: '计划管理->计划变更->变更记录删除'
        },
        {
            name: 'calculateChangeInfoAndSave',
            method: 'POST',
            path: '/product/pm/planChange/calculateChangeInfoAndSave',
            mockPath: '/product/pm/planChange/calculateChangeInfoAndSave',
            desc: '计划管理->计划变更->修改数据变更校验'
        },
        {
            name: 'changeRecordInfoSave',
            method: 'POST',
            path: '/product/pm/planChange/changeRecordInfoSave',
            mockPath: '/product/pm/planChange/changeRecordInfoSave',
            desc: '计划管理->计划变更->变更数据提交审批'
        },
        {
            name: 'changeRecordInfoUpdateType',
            method: 'POST',
            path: '/product/pm/planChange/changeRecordInfoUpdateType',
            mockPath: '/product/pm/planChange/changeRecordInfoUpdateType',
            desc: '计划管理->计划变更->更新变更类型'
        },
        {
            name: 'changeRecordInfo',
            method: 'POST',
            path: '/product/pm/planChange/changeRecordInfo',
            mockPath: '/product/pm/planChange/changeRecordInfo',
            desc: '计划管理->计划变更->变更详情'
        },
        {
            name: 'teamRoleValidator',
            method: 'POST',
            path: '/product/pm/planChange/teamRoleValidator',
            mockPath: '/product/pm/planChange/teamRoleValidator',
            desc: '计划管理->计划变更->流程启动前检查'
        }
    ],
    problemManager: [
        {
            name: 'problemSave',
            method: 'POST',
            path: '/product/Problem/create',
            mockPath: '/product/Problem/create',
            desc: '问题管理->问题管理->新增问题管理'
        },
        {
            name: 'getProblemInfo',
            method: 'POST',
            path: '/product/Problem/getProblemInfo',
            mockPath: '/product/Problem/getProblemInfo',
            desc: '问题管理->问题管理->通过id获取问题数据'
        },
        {
            name: 'getProblemInfoRecord',
            method: 'POST',
            path: '/product/Problem/getProblemInfoRecord',
            mockPath: '/product/Problem/getProblemInfoRecord',
            desc: '问题管理->问题管理->问题处理记录'
        },
        {
            name: 'removeProblemInfo',
            method: 'POST',
            path: '/product/Problem/removeProblemInfo',
            mockPath: '/product/Problem/removeProblemInfo',
            desc: '问题管理->问题管理->通过主键删除问题'
        },
        {
            name: 'taskList',
            method: 'POST',
            path: '/product/Problem/taskList',
            mockPath: '/product/Problem/taskList',
            desc: '问题管理->问题管理->新增问题管理->点击计划钻取任务'
        },
        {
            name: 'ProblemPage',
            method: 'POST',
            path: '/product/Problem/myProblemPage/get',
            mockPath: '/product/Problem/myProblemPage/get',
            desc: '我的任务->我的问题处理->查看我的问题处理信息列表'
        },
        {
            name: 'myproblemProcess',
            method: 'POST',
            path: '/product/Problem/myproblemProcess',
            mockPath: '/product/Problem/myproblemProcess',
            desc: '我的任务->我的问题处理->问题分配'
        }
    ],
    upcomingManager: [
        {
            name: 'saveUpcoming',
            method: 'POST',
            path: '/product/Upcoming/myUpcomingPage/create',
            mockPath: '/product/Upcoming/myUpcomingPage/create',
            desc: '我的任务->我的待办处理->新增待办处理'
        },
        {
            name: 'getUpcomingInfo',
            method: 'POST',
            path: '/product/Upcoming/myUpcomingPage/list',
            mockPath: '/product/Upcoming/myUpcomingPage/list',
            desc: '我的任务->我的待办处理->通过id获取待办数据'
        },
        {
            name: 'upcomingPage',
            method: 'POST',
            path: '/product/Upcoming/myUpcomingPage/get',
            mockPath: '/product/Upcoming/myUpcomingPage/get',
            desc: '我的任务->我的待办处理->查看我的待办处理信息列表'
        },
        {
            name: 'okUpcoming',
            method: 'POST',
            path: '/product/Upcoming/myUpcomingPage/okUpcoming',
            mockPath: '/product/Upcoming/myUpcomingPage/okUpcoming',
            desc: '我的任务->我的待办处理->提交完成'
        }
    ],
    experimentManager: [
        {
            name: 'bigExperimentList',
            method: 'POST',
            path: '/experiment/bigExperiment/list',
            mockPath: '/experiment/bigExperiment/list',
            desc: '试验管理->大型试验管理->列表'
        },
        {
            name: 'flyExperimentList',
            method: 'POST',
            path: '/experiment/flyExperiment/list',
            mockPath: '/experiment/flyExperiment/list',
            desc: '试验管理->大型试验管理->列表'
        },
        {
            name: 'deleteBigExperiment',
            method: 'POST',
            path: '/experiment/bigExperiment/deleteBigExperiment',
            mockPath: '/experiment/bigExperiment/deleteBigExperiment',
            desc: '试验管理->大型试验管理->删除'
        },
        {
            name: 'deleteFlyExperiment',
            method: 'POST',
            path: '/experiment/bigExperiment/deleteFlyExperiment',
            mockPath: '/experiment/bigExperiment/deleteFlyExperiment',
            desc: '试验管理->大型试验管理->删除'
        },
        {
            name: 'getTaskList',
            method: 'POST',
            path: '/experiment/bigExperiment/getTaskList',
            mockPath: '/experiment/bigExperiment/getTaskList',
            desc: '试验管理->大型试验管理->获取项目信息'
        },
        {
            name: 'experimentSave',
            method: 'POST',
            path: '/experiment/bigExperiment/experimentSave',
            mockPath: '/experiment/bigExperiment/experimentSave',
            desc: '试验管理->大型试验管理->保存或编辑'
        },
        {
            name: 'flyExperimentSave',
            method: 'POST',
            path: '/experiment/bigExperiment/flyExperimentSave',
            mockPath: '/experiment/bigExperiment/flyExperimentSave',
            desc: '试验管理->大型试验管理->保存或编辑'
        },
        {
            name: 'getExperimentInfo',
            method: 'POST',
            path: '/experiment/bigExperiment/getExperimentInfo',
            mockPath: '/experiment/bigExperiment/getExperimentInfo',
            desc: '试验管理->大型试验管理->通过主键获取大型试验信息'
        },
        {
            name: 'getFlyExperimentInfo',
            method: 'POST',
            path: '/experiment/bigExperiment/getFlyExperimentInfo',
            mockPath: '/experiment/bigExperiment/getFlyExperimentInfo',
            desc: '试验管理->飞行试验管理->通过主键获取飞行试验信息'
        }
    ],
    wholeDescribeInfoManager: [
        {
            name: 'saveOrUpdate',
            method: 'POST',
            path: '/product/pmProjectTarget/save',
            mockPath: '/product/pmProjectTarget/save',
            desc: '项目管理->整体管理->立项信息->项目目标->保存'
        }
    ],
    WorkStatistics: [
        {
            name: 'taskTreeList',
            method: 'POST',
            path: '/product/statistics/WorkStatistics/treeListData',
            mockPath: '/product/statistics/WorkStatistics/treeListData',
            desc: '多项目管理->任务统计查询->列表数据查询'
        }
    ],
    PlanFinishRate: [
        {
            name: 'planRateList',
            method: 'POST',
            path: '/product/statistics/PlanFinishRate/planRateList',
            mockPath: '/product/statistics/PlanFinishRate/planRateList',
            desc: '多项目管理->项目计划完成率查询->列表数据查询'
        },
        {
            name: 'deptplanRateList',
            method: 'POST',
            path: '/product/statistics/PlanFinishRate/deptplanRateList',
            mockPath: '/product/statistics/PlanFinishRate/deptplanRateList',
            desc: '多项目管理->部门计划完成率->列表数据查询'
        }, {
            name: 'baseCommonDetail',
            method: 'POST',
            path: '/product/statistics/PlanFinishRate/baseCommonDetail',
            mockPath: '/product/statistics/PlanFinishRate/baseCommonDetail',
            desc: '多项目管理->部门计划完成率->列表页面点击数量查询明细列表'
        }, {
            name: 'getPlanData',
            method: 'POST',
            path: '/product/statistics/PlanFinishRate/getPlanData',
            mockPath: '/product/statistics/PlanFinishRate/getPlanData',
            desc: '多项目管理->部门计划完成率->获取计划详细信息'
        }
    ],
    planWarning: [
        {
            name: 'warningTaskList',
            method: 'POST',
            path: '/product/pm/planWarning/warningTaskList',
            mockPath: '/product/pm/planWarning/warningTaskList',
            desc: '项目管理->计划管理->计划预警列表'
        },
        {
            name: 'countWarningTask',
            method: 'POST',
            path: '/product/pm/planWarning/countWarningTask',
            mockPath: '/product/pm/planWarning/countWarningTask',
            desc: '项目管理->计划管理->统计计划预警任务'
        },
        {
            name: 'setWarningPointList',
            method: 'POST',
            path: '/framework/taskWarning/getMonitorPointByPlan',
            mockPath: '/framework/taskWarning/getMonitorPointByPlan',
            desc: '项目管理->计划管理->计划预警设置列表'
        }
    ],
    contractManager: [
        {
            name: 'contractListData',
            method: 'POST',
            path: '/Product/Pm/contract/list',
            mockPath: '/Product/Pm/contract/list',
            desc: '项目管理->合同管理->列表数据查询'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/Product/Pm/contract/save',
            mockPath: '/Product/Pm/contract/save',
            desc: '项目管理->合同管理->新建合同保存'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/Product/Pm/contract/remove',
            mockPath: '/Product/Pm/contract/remove',
            desc: '项目管理->合同管理->删除合同'
        },
        {
            name: 'getContract',
            method: 'POST',
            path: '/Product/Pm/contract/getContract',
            mockPath: '/Product/Pm/contract/getContract',
            desc: '项目管理->合同管理->查询合同'
        },
        {
            name: 'getCoinType',
            method: 'POST',
            path: '/Product/Pm/contract/getCoinType',
            mockPath: '/Product/Pm/contract/getCoinType',
            desc: '项目管理->合同管理->查询合同币种'
        }
    ],
    workOrder: [
        {
            name: 'save',
            method: 'POST',
            path: '/product/pm-work-order/save',
            mockPath: '/product/pm-work-order/save',
            desc: '项目管理->合同管理->新建合同保存'
        },
        {
            name: 'workOrderListData',
            method: 'POST',
            path: '/product/pm-work-order/list',
            mockPath: '/product/pm-work-order/list',
            desc: '立项管理->工作令管理->列表数据查询'
        },
        {
            name: 'getWorkOrder',
            method: 'POST',
            path: '/product/pm-work-order/getWorkOrder',
            mockPath: '/product/pm-work-order/getWorkOrder',
            desc: '立项管理->工作令管理->查询工作令'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/product/pm-work-order/remove',
            mockPath: '/product/pm-work-order/remove',
            desc: '立项管理->工作令管理->删除工作令'
        }
    ],
    ExpertDatabaseInformation: [
        {
            name: 'productTeamSelect',
            method: 'POST',
            path: '/product/expertDatabaseInformation/productTeamSelect',
            mockPath: '/product/expertDatabaseInformation/productTeamSelect',
            desc: '质量产品化->产品队伍下拉框'
        },
        {
            name: 'productTeamTree',
            method: 'GET',
            path: '/product/repository/productTeam/productTeamTree',
            mockPath: '/product/repository/productTeam/productTeamTree',
            desc: '质量产品化->产品队伍树'
        },
        {
            name: 'productTeamSave',
            method: 'POST',
            path: '/product/repository/productTeam/productTeamSave',
            mockPath: '/product/repository/productTeam/productTeamSave',
            desc: '质量产品化->产品队伍树->保存节点'
        },
        {
            name: 'productTeamRemoveNode',
            method: 'POST',
            path: '/product/repository/productTeam/productTeamRemoveNode',
            mockPath: '/product/repository/productTeam/productTeamRemoveNode',
            desc: '质量产品化->产品队伍树->删除节点'
        },
        {
            name: 'productTeamGetNodeDetail',
            method: 'POST',
            path: '/product/repository/productTeam/productTeamGetNodeDetail',
            mockPath: '/product/repository/productTeam/productTeamGetNodeDetail',
            desc: '质量产品化->产品队伍树->获取节点信息'
        },
        {
            name: 'listData',
            method: 'POST',
            path: '/product/expertDatabaseInformation/listData',
            mockPath: '/product/expertDatabaseInformation/listData',
            desc: '质量产品化->专家信息库->列表'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/product/expertDatabaseInformation/save',
            mockPath: '/product/expertDatabaseInformation/save',
            desc: '质量产品化->专家信息库->保存'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/product/expertDatabaseInformation/remove',
            mockPath: '/product/expertDatabaseInformation/remove',
            desc: '质量产品化->专家信息库->删除'
        },
        {
            name: 'getExpert',
            method: 'POST',
            path: '/product/expertDatabaseInformation/getExpert',
            mockPath: '/product/expertDatabaseInformation/getExpert',
            desc: '质量产品化->专家信息库->详情'
        }
    ],
    TypeSpectrum: [
        {
            name: 'typeSpectrumTree',
            method: 'GET',
            path: '/product/typeSpectrum/typeSpectrumTree',
            mockPath: '/product/typeSpectrum/typeSpectrumTree',
            desc: '质量产品化->型谱管理树'
        },
        {
            name: 'typeSpectrumSave',
            method: 'POST',
            path: '/product/typeSpectrum/typeSpectrumSave',
            mockPath: '/product/typeSpectrum/typeSpectrumSave',
            desc: '质量产品化->型谱管理->保存节点'
        },
        {
            name: 'typeSpectrumRemoveNode',
            method: 'POST',
            path: '/product/typeSpectrum/typeSpectrumRemoveNode',
            mockPath: '/product/typeSpectrum/typeSpectrumRemoveNode',
            desc: '质量产品化->型谱管理->删除节点'
        },
        {
            name: 'typeSpectrumGetNodeDetail',
            method: 'POST',
            path: '/product/typeSpectrum/typeSpectrumGetNodeDetail',
            mockPath: '/product/typeSpectrum/typeSpectrumGetNodeDetail',
            desc: '质量产品化->型谱管理->获取节点信息'
        },
        {
            name: 'repeatedCheck',
            method: 'POST',
            path: '/product/typeSpectrum/repeatedCheck',
            mockPath: '/product/typeSpectrum/repeatedCheck',
            desc: '编号唯一性校验'
        },
        {
            name: 'importExcel',
            method: 'POST',
            path: '/product/typeSpectrum/importExcel',
            mockPath: '/product/typeSpectrum/importExcel',
            desc: '导入Excel'
        },
        {
            name: 'listData',
            method: 'POST',
            path: '/product/expertDatabaseInformation/listData',
            mockPath: '/product/expertDatabaseInformation/listData',
            desc: '质量产品化->专家信息库->列表'
        },
        {
            name: 'save',
            method: 'POST',
            path: '/product/expertDatabaseInformation/save',
            mockPath: '/product/expertDatabaseInformation/save',
            desc: '质量产品化->专家信息库->保存'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/product/expertDatabaseInformation/remove',
            mockPath: '/product/expertDatabaseInformation/remove',
            desc: '质量产品化->专家信息库->删除'
        },
        {
            name: 'getExpert',
            method: 'POST',
            path: '/product/expertDatabaseInformation/getExpert',
            mockPath: '/product/expertDatabaseInformation/getExpert',
            desc: '质量产品化->专家信息库->详情'
        }
    ],
    projectDocument: [
        {
            name: 'proDocList',
            method: 'POST',
            path: '/product/projectDocument/proDocList',
            mockPath: '/product/projectDocument/proDocList',
            desc: '项目管理->项目文档->项目文档列表'
        },
        {
            name: 'proDocOResult',
            method: 'POST',
            path: '/product/projectDocument/proDocOResult',
            mockPath: '/product/projectDocument/proDocOResult',
            desc: '项目管理->项目文档->项目输出文档'
        },
        {
            name: 'searchProDoc',
            method: 'POST',
            path: '/product/projectDocument/searchProDoc',
            mockPath: '/product/projectDocument/searchProDoc',
            desc: '项目管理->项目文档->项目输出文档'
        }
    ],
    myExperience: [
        {
            name: 'myExperienceList',
            method: 'GET',
            path: '/product/repository/MyExperienceBase/myExperienceList',
            mockPath: '/product/repository/MyExperienceBase/myExperienceList',
            desc: '计划编制->我的经验管理->列表查询'
        },
        {
            name: 'saveExperienceInfo',
            method: 'POST',
            path: '/product/repository/MyExperienceBase/saveExperienceInfo',
            mockPath: '/product/repository/MyExperienceBase/saveExperienceInfo',
            desc: '计划编制->我的经验管理->经验信息存储'
        },
        {
            name: 'experienceClassifyTreeList',
            method: 'POST',
            path: '/product/repository/MyExperienceBase/experienceClassifyTreeList',
            mockPath: '/product/repository/MyExperienceBase/experienceClassifyTreeList',
            desc: '计划编制->我的经验类型->经验类型列表'
        },
        {
            name: 'experienceClassifyCreateOrUpdate',
            method: 'POST',
            path: '/product/repository/MyExperienceBase/experienceClassifyCreateOrUpdate',
            mockPath: '/product/repository/MyExperienceBase/experienceClassifyCreateOrUpdate',
            desc: '计划编制->我的经验类型->经验类型创建修改'
        },
        {
            name: 'myExperienceCliassifyEditData',
            method: 'GET',
            path: '/product/repository/MyExperienceBase/myExperienceCliassifyEditData',
            mockPath: '/product/repository/MyExperienceBase/myExperienceCliassifyEditData',
            desc: '计划编制->我的经验类型->经验类型数据'
        },
        {
            name: 'removeExperienceClassify',
            method: 'POST',
            path: '/product/repository/MyExperienceBase/removeExperienceClassify',
            mockPath: '/product/repository/MyExperienceBase/removeExperienceClassify',
            desc: '计划编制->我的经验库类型->删除操作'
        },
        {
            name: 'myBaseExperienceList',
            method: 'POST',
            path: '/product/repository/MyExperienceBase/myBaseExperienceList',
            mockPath: '/product/repository/MyExperienceBase/myBaseExperienceList',
            desc: '知识库管理->我的经验库->列表查询'
        },
        {
            name: 'removeExperienceInfo',
            method: 'POST',
            path: '/product/repository/MyExperienceBase/removeExperienceInfo',
            mockPath: '/product/repository/MyExperienceBase/removeExperienceInfo',
            desc: '知识库管理->我的经验库->删除知识库信息'
        },
        {
            name: 'myExperienceWholeList',
            method: 'POST',
            path: '/product/repository/MyExperienceBase/myExperienceWholeList',
            mockPath: '/product/repository/MyExperienceBase/myExperienceWholeList',
            desc: '知识库管理->我的经验库新建->项目左树信息'
        },
        {
            name: 'myExperienceWholeRightList',
            method: 'POST',
            path: '/product/repository/MyExperienceBase/myExperienceWholeRightList',
            mockPath: '/product/repository/MyExperienceBase/myExperienceWholeRightList',
            desc: '知识库管理->我的经验库新建->项目右边内容信息'
        },
        {
            name: 'myExperienceInfoImportRightList',
            method: 'POST',
            path: '/product/repository/MyExperienceBase/myExperienceInfoImportRightList',
            mockPath: '/product/repository/MyExperienceBase/myExperienceInfoImportRightList',
            desc: '计划编制->经验库导入->右边查询列表信息'
        },
        {
            name: 'importTaskEx',
            method: 'POST',
            path: '/product/repository/MyExperienceBase/importTaskEx',
            mockPath: '/product/repository/MyExperienceBase/importTaskEx',
            desc: '计划编制->经验库导入->导入执行'
        }
    ],
    productFileManage: [
        {
            name: 'productFileTree',
            method: 'GET',
            path: '/product/productFileManage/productFileTree',
            mockPath: '/product/productFileManage/productFileTree',
            desc: '产品化管理->产品化文件管理->产品化文件树'
        },
        {
            name: 'saveTree',
            method: 'POST',
            path: '/product/productFileManage/saveTree',
            mockPath: '/product/productFileManage/saveTree',
            desc: '产品化管理->产品化文件管理->产品化文件树保存'
        },
        {
            name: 'getNodeDetail',
            method: 'POST',
            path: '/product/productFileManage/getNodeDetail',
            mockPath: '/product/productFileManage/getNodeDetail',
            desc: '产品化管理->产品化文件管理->获取节点信息'
        },
        {
            name: 'removeNode',
            method: 'POST',
            path: '/product/productFileManage/removeNode',
            mockPath: '/product/productFileManage/removeNode',
            desc: '产品化管理->产品化文件管理->删除节点'
        },
        {
            name: 'upload',
            method: 'POST',
            path: '/product/productFileResource/upload',
            mockPath: '/product/productFileResource/upload',
            desc: '产品化管理->产品化文件管理->上附件'
        },
        {
            name: 'getFileList',
            method: 'POST',
            path: '/product/productFileResource/getFileList',
            mockPath: '/product/productFileResource/getFileList',
            desc: '产品化管理->产品化文件管理->获取附件列表'
        },
        {
            name: 'remove',
            method: 'POST',
            path: '/product/productFileResource/remove',
            mockPath: '/product/productFileResource/remove',
            desc: '产品化管理->产品化文件管理->删除附件'
        },
        {
            name: 'download',
            method: 'POST',
            path: '/product/productFileResource/download',
            mockPath: '/product/productFileResource/download',
            desc: '产品化管理->产品化文件管理->下载附件'
        },
        {
            name: 'productTree',
            method: 'GET',
            path: '/product/productFileManage/productTree',
            mockPath: '/product/productFileManage/productTree',
            desc: '质量产品化->产品文件树'
        }
    ],
    productOrganization: [
        {
            name: 'organizationTree',
            method: 'GET',
            path: '/product/productOrganizationManage/organizationTree',
            mockPath: '/product/productOrganizationManage/organizationTree',
            desc: '质量产品化->产品化组织机构管理->组织机构树'
        },
        {
            name: 'saveTree',
            method: 'POST',
            path: '/product/productOrganizationManage/saveTree',
            mockPath: '/product/productOrganizationManage/saveTree',
            desc: '质量产品化->产品化组织机构管理->保存组织机构'
        },
        {
            name: 'getNodeDetail',
            method: 'POST',
            path: '/product/productOrganizationManage/getNodeDetail',
            mockPath: '/product/productOrganizationManage/getNodeDetail',
            desc: '质量产品化->产品化组织机构管理->组织机构信息'
        },
        {
            name: 'removeNode',
            method: 'POST',
            path: '/product/productOrganizationManage/removeNode',
            mockPath: '/product/productOrganizationManage/removeNode',
            desc: '质量产品化->产品化组织机构管理->删除组织机构'
        },
        {
            name: 'organizationList',
            method: 'POST',
            path: '/product/productOrganizationManage/organizationList',
            mockPath: '/product/productOrganizationManage/organizationList',
            desc: '质量产品化->产品化组织机构管理->组织机构列表'
        }
    ],
    commonP8Task: [
        {
            name: 'loadPlanListData',
            method: 'POST',
            path: '/product/common/P8Task/loadPlanListData',
            mockPath: '/product/common/P8Task/loadPlanListData',
            desc: '个人工作台->任务看板->任务明细数据'
        },
        {
            name: 'loadPlanChartData',
            method: 'POST',
            path: '/product/common/P8Task/loadPlanChartData',
            mockPath: '/product/common/P8Task/loadPlanChartData',
            desc: '个人工作台->任务看板->任务完成情况数据'
        },
        {
            name: 'loadMonitorData',
            method: 'POST',
            path: '/product/common/P8Task/loadMonitorData',
            mockPath: '/product/common/P8Task/loadMonitorData',
            desc: '个人工作台->任务看板->获取计划标识明细数据'
        },
        {
            name: 'loadBudgetData',
            method: 'POST',
            path: '/product/common/P8Task/loadBudgetData',
            mockPath: '/product/common/P8Task/loadBudgetData',
            desc: '个人工作台->任务看板->获取经费节点明细'
        },
        {
          name: 'getCommonResources',
          method: 'GET',
          path: '/product/common/P8Task/getCommonResources',
          mockPath: '/product/common/P8Task/getCommonResources',
          desc: '个人工作台->任务看板->获取共性资源类型'
        }
    ],
    productSystemStandard: [
        {
            name: 'getTree',
            method: 'GET',
            path: '/product/productSystemStandard/getTree',
            mockPath: '/product/productSystemStandard/getTree',
            desc: '质量产品化->制度标准管理->制度标准树结构'
        },
        {
            name: 'list',
            method: 'POST',
            path: '/product/productSystemStandard/list',
            mockPath: '/product/productSystemStandard/list',
            desc: '质量产品化->制度标准管理->制度标准树结构'
        },
        {
            name: 'upload',
            method: 'POST',
            path: '/product/productSystemStandard/upload',
            mockPath: '/product/productSystemStandard/upload',
            desc: '质量产品化->制度标准管理->上传'
        },
        {
            name: 'removeFile',
            method: 'POST',
            path: '/product/productSystemStandard/removeFile',
            mockPath: '/product/productSystemStandard/removeFile',
            desc: '质量产品化->制度标准管理->删除'
        },
        {
            name: 'releaseFile',
            method: 'POST',
            path: '/product/productSystemStandard/releaseFile',
            mockPath: '/product/productSystemStandard/releaseFile',
            desc: '质量产品化->制度标准管理->发布'
        },
        {
            name: 'saveProblem',
            method: 'POST',
            path: '/product/systemStandardFeedback/saveProblem',
            mockPath: '/product/systemStandardFeedback/saveProblem',
            desc: '质量产品化->制度标准管理->保存问题反馈'
        },
        {
            name: 'problemList',
            method: 'POST',
            path: '/product/systemStandardFeedback/problemList',
            mockPath: '/product/systemStandardFeedback/problemList',
            desc: '质量产品化->制度标准管理->问题反馈列表'
        },
        {
            name: 'removeProblem',
            method: 'POST',
            path: '/product/systemStandardFeedback/removeProblem',
            mockPath: '/product/systemStandardFeedback/removeProblem',
            desc: '质量产品化->制度标准管理->删除问题反馈'
        },
        {
            name: 'problemInfo',
            method: 'POST',
            path: '/product/systemStandardFeedback/problemInfo',
            mockPath: '/product/systemStandardFeedback/problemInfo',
            desc: '质量产品化->制度标准管理->问题反馈详情'
        },
        {
            name: 'releaseProblem',
            method: 'POST',
            path: '/product/systemStandardFeedback/releaseProblem',
            mockPath: '/product/systemStandardFeedback/releaseProblem',
            desc: '质量产品化->制度标准管理->发布'
        }
    ],
    ProjectFileManager: [
        {
            name: 'fileClassifyTree',
            method: 'POST',
            path: '/product/projectFileManager/fileClassifyTree',
            mockPath: '/product/projectFileManager/fileClassifyTree',
            params: {},
            desc: '沟通管理-项目文档管理-文档类型树'
        },
        {
            name: 'list',
            method: 'POST',
            path: '/product/projectFileManager/list',
            mockPath: '/product/projectFileManager/list',
            desc: '沟通管理-项目文档管理-文档列表'
        },
        {
            name: 'uploadFileSave',
            method: 'POST',
            path: '/product/projectFileManager/uploadFileSave',
            mockPath: '/product/projectFileManager/uploadFileSave',
            desc: '沟通管理-项目文档管理-文档列表'
        }
    ],
  projectModelTeam: [
    {
      name: 'index',
      method: 'POST',
      path: '/product/pm-project-model-team/index',
      mockPath: '/product/pm-project-model-team/index',
      desc: '项目管理->资源管理->团队管理'
    },
    {
      name: 'userList',
      method: 'POST',
      path: '/product/pm-project-model-team/roleUserList',
      mockPath: '/product/pm-project-model-team/roleUserList',
      desc: '项目管理->资源管理->团队管理->团队人员选择列表'
    },
    {
      name: 'getAllKTeams',
      method: 'POST',
      path: '/product/kTeams/getAllKTeams',
      mockPath: '/product/kTeams/getAllKTeams',
      desc: '获取所有的标准团队'
    },
    {
      name: 'save',
      method: 'POST',
      path: '/product/pm-project-model-team/save',
      mockPath: '/product/pm-project-model-team/save',
      desc: '保存项目团队信息'
    },
    {
      name: 'userTaskDetail',
      method: 'POST',
      path: '/product/pm-project-model-team/userTaskDetail',
      mockPath: '/product/pm-project-model-team/userTaskDetail',
      desc: '用户任务明细'
    },
    {
      name: 'updateUserInfo',
      method: 'POST',
      path: '/product/pm-project-model-team/updateUserInfo',
      mockPath: '/product/pm-project-model-team/updateUserInfo',
      desc: '更新人员信息'
    },
    {
      name: 'synchronization',
      method: 'POST',
      path: '/product/pm-project-model-team/synchronization',
      mockPath: '/product/pm-project-model-team/synchronization',
      desc: '更新人员信息'
    },
    {
      name: 'list',
      method: 'POST',
      path: '/product/pm-project-model-team/list',
      mockPath: '/product/pm-project-model-team/list',
      desc: '更新人员信息'
    },
    {
      name: 'teamRelease',
      method: 'POST',
      path: '/product/pm-project-model-team/teamRelease',
      mockPath: '/product/pm-project-model-team/teamRelease',
      desc: '更新人员信息'
    },
    {
      name: 'getAllUnCreateModelId',
      method: 'POST',
      path: '/product/pm-project-model-team/getAllUnCreateModelId',
      mockPath: '/product/pm-project-model-team/getAllUnCreateModelId',
      desc: '获取所有已创建团队的型号Id'
    }
  ],
  modelCustomization: [
      {
        name: 'loadModelCustomizationLeftTree',
        method: 'POST',
        path: '/product/repository/modelCustomization/loadModelCustomizationLeftTree',
        mockPath: '/product/repository/modelCustomization/loadModelCustomizationLeftTree',
        desc: '知识库管理->院级产品树管理->左树加载列表'

      },
      {
        name: 'packageCustomizationProducts',
        method: 'POST',
        path: '/product/repository/modelCustomization/packageCustomizationProducts',
        mockPath: '/product/repository/modelCustomization/packageCustomizationProducts',
        desc: '知识库管理->院级产品树管理->定制产品树形信息加载'

      },
      {
        name: 'checkGenerateRoot',
        method: 'POST',
        path: '/product/repository/modelCustomization/checkGenerateRoot',
        mockPath: '/product/repository/modelCustomization/checkGenerateRoot',
        desc: '知识库管理->院级产品树管理->根据选择型号默认生成根校验'

      },
      {
        name: 'generateRoot',
        method: 'POST',
        path: '/product/repository/modelCustomization/generateRoot',
        mockPath: '/product/repository/modelCustomization/generateRoot',
        desc: '知识库管理->院级产品树管理->根据选择型号默认生成根'

      },
      {
        name: 'packageCustomizationProductInfoSon',
        method: 'POST',
        path: '/product/repository/modelCustomization/packageCustomizationProductInfoSon',
        mockPath: '/product/repository/modelCustomization/packageCustomizationProductInfoSon',
        desc: '知识库管理->院级产品树管理->定制产品树列表'

      },
      {
        name: 'modelCustomizationImpot',
        method: 'POST',
        path: '/product/repository/modelCustomization/modelCustomizationImpot',
        mockPath: '/product/repository/modelCustomization/modelCustomizationImpot',
        desc: '知识库管理->院级产品树管理->定制产品导入功能'

      },
      {
        name: 'removeModelCustomization',
        method: 'POST',
        path: '/product/repository/modelCustomization/removeModelCustomization',
        mockPath: '/product/repository/modelCustomization/removeModelCustomization',
        desc: '知识库管理->院级产品树管理->定制产品删除'

      },
      {
        name: 'loadingQualityChange',
        method: 'POST',
        path: '/product/repository/modelCustomization/loadingQualityChange',
        mockPath: '/product/repository/modelCustomization/loadingQualityChange',
        desc: '知识库管理->院级产品树管理->二级以下装入数量调整'

      }

  ],
  ProjectEndManagement: [
    {
      name: 'save',
      method: 'POST',
      path: '/product/projectEndManagement/save',
      mockPath: '/product/projectEndManagement/save',
      desc: '项目结项->保存'
    },
    {
      name: 'get',
      method: 'POST',
      path: '/product/projectEndManagement/get',
      mockPath: '/product/projectEndManagement/get',
      desc: '项目结项->获取'
    },
    {
      name: 'start',
      method: 'POST',
      path: '/product/projectEndManagement/start',
      mockPath: '/product/projectEndManagement/start',
      desc: '项目结项->结项启动'
    },
    {
      name: 'end',
      method: 'POST',
      path: '/product/projectEndManagement/end',
      mockPath: '/product/projectEndManagement/end',
      desc: '项目结项->结项'
    },
    {
      name: 'saveBackLog',
      method: 'POST',
      path: '/product/projectEndManagement/saveBackLog',
      mockPath: '/product/projectEndManagement/saveBackLog',
      desc: '项目结项->结项'
    },
    {
      name: 'backLogDelete',
      method: 'POST',
      path: '/product/projectEndManagement/backLogDelete',
      mockPath: '/product/projectEndManagement/backLogDelete',
      desc: '项目结项->结项'
    },
    {
      name: 'backLogList',
      method: 'POST',
      path: '/product/projectEndManagement/backLogList',
      mockPath: '/product/projectEndManagement/backLogList',
      desc: '项目结项->结项'
    }
  ],
  comprehensivePlan: [
        {
            name: 'saveUpdateComprehensivePlan',
            method: 'POST',
            path: '/product/comprehensivePlan/saveUpdateComprehensivePlan',
            mockPath: '/product/comprehensivePlan/saveUpdateComprehensivePlan',
            desc: '综合计划管理->主业计划->新建修改功能'
        },
        {
            name: 'saveUpdateComprehensivePlanCheck',
            method: 'POST',
            path: '/product/comprehensivePlan/saveUpdateComprehensivePlanCheck',
            mockPath: '/product/comprehensivePlan/saveUpdateComprehensivePlanCheck',
            desc: '综合计划管理->主业计划->新建修改年度验证'
        },
        {
            name: 'comprehensivePlanLoadList',
            method: 'POST',
            path: '/product/comprehensivePlan/comprehensivePlanLoadList',
            mockPath: '/product/comprehensivePlan/comprehensivePlanLoadList',
            desc: '综合计划管理->主业计划->综合管理计划按照类型加载计划信息'
        }

  ]
}
