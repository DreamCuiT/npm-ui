/**
 * 策划管理相关api
 */

export const planningApi = {
  planningManager: [
    {
      name: 'list',
      method: 'POST',
      path: '/product/pm/projectPlanning/list',
      mockPath: '/product/pm/projectPlanning/list',
      desc: '策划管理->列表数据获取'
    },
    {
      name: 'getPlanningConfigItem',
      method: 'POST',
      path: '/product/pm/projectPlanning/getPlanningConfigItem',
      mockPath: '/product/pm/projectPlanning/getPlanningConfigItem',
      desc: '策划管理->获取策划项信息'
    },
    {
      name: 'approveSubmit',
      method: 'POST',
      path: '/product/pm/projectPlanning/approveSubmit',
      mockPath: '/product/pm/projectPlanning/approveSubmit',
      desc: '策划管理->策划发布提交'
    },
    {
      name: 'getRelevancePlanInfo',
      method: 'POST',
      path: '/product/pm/projectPlanning/getRelevancePlanInfo',
      mockPath: '/product/pm/projectPlanning/getRelevancePlanInfo',
      desc: '策划管理->获取策划里程碑关联计划信息'
    },
    {
      name: 'getRelevanceMilestoneInfo',
      method: 'POST',
      path: '/product/pm/projectPlanning/getRelevanceMilestoneInfo',
      mockPath: '/product/pm/projectPlanning/getRelevanceMilestoneInfo',
      desc: '策划管理->获取关联策划里程碑信息'
    },
    {
      name: 'getPlanningAuthorityInfo',
      method: 'POST',
      path: '/product/pm/projectPlanning/getPlanningAuthorityInfo',
      mockPath: '/product/pm/projectPlanning/getPlanningAuthorityInfo',
      desc: '策划管理->获取项目策划项信息'
    },

    {
      name: 'getModelPlannings',
      method: 'POST',
      path: '/product/pmmodelplanning/getModelPlannings',
      mockPath: '/product/pmmodelplanning/getModelPlannings',
      desc: '策划管理->型号数字化大纲策划  列表展示'
    },
    {
      name: 'planningItemSubmitCheck',
      method: 'POST',
      path: '/product/pm/projectPlanning/planningItemSubmitCheck',
      mockPath: '/product/pm/projectPlanning/planningItemSubmitCheck',
      desc: '策划管理->列表提交策划项校验'
    },
    {
      name: 'planningItemSubmit',
      method: 'POST',
      path: '/product/pm/projectPlanning/planningItemSubmit',
      mockPath: '/product/pm/projectPlanning/planningItemSubmit',
      desc: '策划管理->列表提交策划项'
    }
  ],
  projectTarget: [
    {
      name: 'saveProjectTarget',
      method: 'POST',
      path: '/product/pm/projectTarget/saveProjectTarget',
      mockPath: '/product/pm/projectTarget/saveProjectTarget',
      desc: '策划管理->目标和范围策划->保存'
    },
    {
      name: 'getProjectTargetInfo',
      method: 'POST',
      path: '/product/pm/projectTarget/getProjectTargetInfo',
      mockPath: '/product/pm/projectTarget/getProjectTargetInfo',
      desc: '策划管理->目标和范围策划->获取列表数据'
    },
    {
      name: 'checkProjectTargetIsSubmit',
      method: 'POST',
      path: '/product/pm/projectTarget/checkProjectTargetIsSubmit',
      mockPath: '/product/pm/projectTarget/checkProjectTargetIsSubmit',
      desc: '策划管理->目标和范围策划是否已提交'
    }
  ],
  modelPlanning: [
    {
      name: 'checkSubmit',
      method: 'POST',
      path: '/product/pm/modelPlanning/checkSubmit',
      mockPath: '/product/pm/modelPlanning/checkSubmit',
      desc: '策划管理->型号数字化大纲策划->校验状态'
    },
    {
      name: 'save',
      method: 'POST',
      path: '/product/pm/modelPlanning/save',
      mockPath: '/product/pm/modelPlanning/save',
      desc: '策划管理->型号数字化大纲策划->保存'
    },
    {
      name: 'download',
      method: 'POST',
      path: '/product/pm/modelPlanning/download',
      mockPath: '/product/pm/modelPlanning/download',
      desc: '策划管理->型号数字化大纲策划->下载'
    },
    {
      name: 'listData',
      method: 'POST',
      path: '/product/pm/modelPlanning/listData',
      mockPath: '/product/pm/modelPlanning/listData',
      desc: '策划管理->型号数字化大纲策划->列表'
    }
  ],
  riskPlanning: [
    {
      name: 'listData',
      method: 'POST',
      path: '/product/pm/riskPlanning/listData',
      mockPath: '/product/pm/riskPlanning/listData',
      desc: '策划管理->项目风险策划->列表'
    },
    {
      name: 'download',
      method: 'POST',
      path: '/product/pm/riskPlanning/download',
      mockPath: '/product/pm/riskPlanning/download',
      desc: '策划管理->项目风险策划->下载附件'
    },
    {
      name: 'checkSubmit',
      method: 'POST',
      path: '/product/pm/riskPlanning/checkSubmit',
      mockPath: '/product/pm/riskPlanning/checkSubmit',
      desc: '策划管理->项目风险策划->校验提交'
    },
    {
      name: 'save',
      method: 'POST',
      path: '/product/pm/riskPlanning/save',
      mockPath: '/product/pm/riskPlanning/save',
      desc: '策划管理->项目风险策划->保存'
    }
  ],
  materialSupportPlanning: [
    {
      name: 'listData',
      method: 'POST',
      path: '/product/pm/materialSupportPlanning/listData',
      mockPath: '/product/pm/materialSupportPlanning/listData',
      desc: '策划管理->物资保障策划 ->列表'
    },
    {
      name: 'download',
      method: 'POST',
      path: '/product/pm/materialSupportPlanning/download',
      mockPath: '/product/pm/materialSupportPlanning/download',
      desc: '策划管理->物资保障策划 ->下载'
    },
    {
      name: 'checkSubmit',
      method: 'POST',
      path: '/product/pm/materialSupportPlanning/checkSubmit',
      mockPath: '/product/pm/materialSupportPlanning/checkSubmit',
      desc: '策划管理->物资保障策划 ->校验状态'
    },
    {
      name: 'save',
      method: 'POST',
      path: '/product/pm/materialSupportPlanning/save',
      mockPath: '/product/pm/materialSupportPlanning/save',
      desc: '策划管理->物资保障策划 -> 保存'
    }
  ],
  budgetPlanning: [
    {
      name: 'budgetSave',
      method: 'POST',
      path: '/product/pm/budgetPlanning/save',
      mockPath: '/product/pm/budgetPlanning/save',
      desc: '策划管理->项目全周期预算策划->保存'
    },
    {
      name: 'budgetListAttachment',
      method: 'POST',
      path: '/product/pm/budgetPlanning/listAttachment',
      mockPath: '/product/pm/budgetPlanning/listAttachment',
      desc: '策划管理->项目全周期预算策划附件查询->查询'
    },
    {
      name: 'budgetCheckSubmit',
      method: 'POST',
      path: '/product/pm/budgetPlanning/checkSubmit',
      mockPath: '/product/pm/budgetPlanning/checkSubmit',
      desc: '策划管理->项目全周期预算策划状->状态查询'
    },
    {
      name: 'budgetFileDownload',
      method: 'POST',
      path: '/product/pm/budgetPlanning/downloadAttachment',
      mockPath: '/product/pm/budgetPlanning/downloadAttachment',
      desc: '策划管理->项目全周期预算策划->附件下载'
    }
  ],
  milestonePlanning: [
    {
      name: 'getMilestonePlanningInfo',
      method: 'POST',
      path: '/product/pm/milestonePlanning/getMilestonePlanningInfo',
      mockPath: '/product/pm/milestonePlanning/getMilestonePlanningInfo',
      desc: '策划管理->里程碑节点策划信息获取'
    },
    {
      name: 'saveMilestone',
      method: 'POST',
      path: '/product/pm/milestonePlanning/saveMilestone',
      mockPath: '/product/pm/milestonePlanning/saveMilestone',
      desc: '策划管理->里程碑节点策划保存'
    },
    {
      name: 'checkMilestonePlanningIsSubmit',
      method: 'POST',
      path: '/product/pm/milestonePlanning/checkMilestonePlanningIsSubmit',
      mockPath: '/product/pm/milestonePlanning/checkMilestonePlanningIsSubmit',
      desc: '策划管理->检查里程碑节点策划是否已提交'
    }
  ],
  productConPlanning: [
    {
      name: 'getProductConPlanningInfo',
      method: 'POST',
      path: '/product/pm/productConPlanning/list',
      mockPath: '/product/pm/productConPlanning/list',
      desc: '策划管理->产包活动列表信息获取'
    },
    {
      name: 'saveProductConPlanning',
      method: 'POST',
      path: '/product/pm/productConPlanning/save',
      mockPath: '/product/pm/productConPlanning/save',
      desc: '策划管理->产包活动列表信息保存'
    },
    {
      name: 'checkProductConPlanningIsSubmit',
      method: 'POST',
      path: '/product/pm/productConPlanning/checkSubmit',
      mockPath: '/product/pm/productConPlanning/checkSubmit',
      desc: '策划管理->产包活动列表信息策划是否提交'
    }
  ],
  keyResourcesPlanning: [
    {
      name: 'getKeyResourcesPlanningInfo',
      method: 'POST',
      path: '/product/pm/resourcePlanning/list',
      mockPath: '/product/pm/resourcePlanning/list',
      desc: '策划管理->关键资源策划列表信息获取'
    },
    {
      name: 'saveKeyResourcesPlanning',
      method: 'POST',
      path: '/product/pm/resourcePlanning/save',
      mockPath: '/product/pm/resourcePlanning/save',
      desc: '策划管理->关键资源策划列表信息保存'
    },
    {
      name: 'checkSubmit',
      method: 'POST',
      path: '/product/pm/resourcePlanning/checkSubmit',
      mockPath: '/product/pm/resourcePlanning/checkSubmit',
      desc: '策划管理->关键资源策划列表信息策划是否提交'
    }
  ],
  spectrumAndProduct: [
    {
      name: 'listData',
      method: 'POST',
      path: '/product/pm/spectrumProductPlanning/listData',
      mockPath: '/product/pm/spectrumProductPlanning/listData',
      desc: '策划管理->型谱、产品选用策划->列表数据加载'
    },
    {
      name: 'create',
      method: 'POST',
      path: '/product/pm/spectrumProductPlanning/create',
      mockPath: '/product/pm/spectrumProductPlanning/create',
      desc: '策划管理->型谱、产品选用策划->数据创建'
    },
    {
      name: 'update',
      method: 'POST',
      path: '/product/pm/spectrumProductPlanning/update',
      mockPath: '/product/pm/spectrumProductPlanning/update',
      desc: '策划管理->型谱、产品选用策划->数据更新'
    },
    {
      name: 'getAllProductChild',
      method: 'POST',
      path: '/product/pm/spectrumProductPlanning/getAllProductChild',
      mockPath: '/product/pm/spectrumProductPlanning/getAllProductChild',
      desc: '策划管理->型谱、产品选用策划->获取取子中所有从产品结构树的产品导入的任务'
    },
    {
      name: 'remove',
      method: 'POST',
      path: '/product/pm/spectrumProductPlanning/remove',
      mockPath: '/product/pm/spectrumProductPlanning/remove',
      desc: '策划管理->型谱、产品选用策划->数据删除'
    },
    {
      name: 'submit',
      method: 'POST',
      path: '/product/pm/spectrumProductPlanning/submit',
      mockPath: '/product/pm/spectrumProductPlanning/submit',
      desc: '策划管理->型谱、产品选用策划->提交'
    },
    {
      name: 'importData',
      method: 'POST',
      path: '/product/pm/spectrumProductPlanning/importData',
      mockPath: '/product/pm/spectrumProductPlanning/importData',
      desc: '策划管理->型谱、产品选用策划->数据导入'
    },
    {
      name: 'loadProductTree',
      method: 'POST',
      path: '/product/pm/spectrumProductPlanning/loadProductTree',
      mockPath: '/product/pm/spectrumProductPlanning/loadProductTree',
      desc: '策划管理->型谱、产品选用策划->导入产品结构树列表数据加载'
    },
    {
      name: 'wholeDescribeData',
      method: 'POST',
      path: '/product/pm/spectrumProductPlanning/wholeDescribeData',
      mockPath: '/product/pm/spectrumProductPlanning/wholeDescribeData',
      desc: '策划管理->型谱、产品选用策划->获取项目信息'
    }
  ],
  divisionPlanning: [
    {
      name: 'listData',
      method: 'POST',
      path: '/product/pm/divisionPlanning/listData',
      mockPath: '/product/pm/divisionPlanning/listData',
      desc: '策划管理->型谱、产品选用策划->列表数据加载'
    },
    {
      name: 'update',
      method: 'POST',
      path: '/product/pm/divisionPlanning/update',
      mockPath: '/product/pm/divisionPlanning/update',
      desc: '策划管理->型谱、产品选用策划->数据更新'
    }
  ]
}
