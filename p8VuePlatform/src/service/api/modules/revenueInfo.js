/**
 * 经费
 */

export const revenueApi = {
  revenueFullBudget: [
    {
      name: 'list',
      method: 'POST',
      path: '/product/fund/revenueInfo/list',
      mockPath: '/product/fund/revenueInfo/list',
      desc: '经费管理->全周期预算->列表数据'
    },
    {
      name: 'getRevenueStatus',
      method: 'POST',
      path: '/product/fund/revenueInfo/getRevenueStatus',
      mockPath: '/product/fund/revenueInfo/getRevenueStatus',
      desc: '经费管理->全周期预算->获取全周期预算状态'
    },
    {
      name: 'getRevenueStatusData',
      method: 'POST',
      path: '/product/fund/revenueInfo/getRevenueStatusData',
      mockPath: '/product/fund/revenueInfo/getRevenueStatusData',
      desc: '经费管理->全周期预算->预算退回状态'
    },
    {
      name: 'deblockingRevenueInfo',
      method: 'POST',
      path: '/product/fund/revenueInfo/deblockingRevenueInfo',
      mockPath: '/product/fund/revenueInfo/deblockingRevenueInfo',
      desc: '经费管理->全周期预算->保存预算退回状态'
    },
    {
      name: 'historyData',
      method: 'POST',
      path: '/product/fund/revenueInfo/historyData',
      mockPath: '/product/fund/revenueInfo/historyData',
      desc: '经费管理->全周期预算->项目预算->历史版本'
    },
    {
      name: 'loadBudgetHistoryData',
      method: 'POST',
      path: '/product/fund/revenueInfo/loadBudgetHistoryData',
      mockPath: '/product/fund/revenueInfo/loadBudgetHistoryData',
      desc: '经费管理->全周期预算->项目预算->历史版本预算数据'
    }
  ],
  revenueUser: [
    {
      name: 'getRevenueUser',
      method: 'POST',
      path: '/product/fund/revenueUser/getRevenueUser',
      mockPath: '/product/fund/revenueUser/getRevenueUser',
      desc: '经费管理->全周期预算->全周期预算配置->列表数据'
    },
    {
      name: 'saveUserConfig',
      method: 'POST',
      path: '/product/fund/revenueUser/saveUserConfig',
      mockPath: '/product/fund/revenueUser/saveUserConfig',
      desc: '经费管理->全周期预算->全周期预算配置->保存'
    }
  ],
  collectionBudget: [
    {
      name: 'loadCollectionRevenueCommonData',
      method: 'POST',
      path: '/product/fund/revenueBudget/loadCollectionRevenueCommonData',
      mockPath: '/product/fund/revenueBudget/loadCollectionRevenueCommonData',
      desc: '经费管理->全周期预算->收款预算->列表数据'
    },
    {
      name: 'getYearNode',
      method: 'POST',
      path: '/product/fund/revenueBudget/getYearNode',
      mockPath: '/product/fund/revenueBudget/getYearNode',
      desc: '经费管理->全周期预算->收款预算->年度列数据及数据权限'
    },
    {
      name: 'comeInValidateInfo',
      method: 'POST',
      path: '/product/fund/revenueBudget/comeInValidateInfo',
      mockPath: '/product/fund/revenueBudget/comeInValidateInfo',
      desc: '经费管理->全周期预算->收款预算->提交前校验'
    },
    {
      name: 'updateProjectRevenueInfoComeIn',
      method: 'POST',
      path: '/product/fund/revenueBudget/updateProjectRevenueInfoComeIn',
      mockPath: '/product/fund/revenueBudget/updateProjectRevenueInfoComeIn',
      desc: '经费管理->全周期预算->收款预算->提交保存'
    },
    {
      name: 'createBudgetData',
      method: 'POST',
      path: '/product/fund/revenueBudget/createBudgetData',
      mockPath: '/product/fund/revenueBudget/createBudgetData',
      desc: '经费管理->全周期预算->收款预算->新建下级'
    },
    {
      name: 'updateBudgetData',
      method: 'POST',
      path: '/product/fund/revenueBudget/updateBudgetData',
      mockPath: '/product/fund/revenueBudget/updateBudgetData',
      desc: '经费管理->全周期预算->收款预算->更新数据'
    },
    {
      name: 'deleteBudgetData',
      method: 'POST',
      path: '/product/fund/revenueBudget/deleteBudgetData',
      mockPath: '/product/fund/revenueBudget/deleteBudgetData',
      desc: '经费管理->全周期预算->收款预算->删除节点'
    },
    {
      name: 'comeInRevnueChangedNum',
      method: 'POST',
      path: '/product/fund/revenueInfo/comeInRevnueChangedNum',
      mockPath: '/product/fund/revenueInfo/comeInRevnueChangedNum',
      desc: '经费管理->全周期预算->收款预算->获取收款合同节点'

    },
    {
      name: 'addToFirstContractData',
      method: 'POST',
      path: '/product/fund/revenueInfo/addToFirstContractData',
      mockPath: '/product/fund/revenueInfo/addToFirstContractData',
      desc: '经费管理->全周期预算->收款预算->查询增补合同数据'

    },
    {
      name: 'contractChange',
      method: 'POST',
      path: '/product/fund/revenueInfo/contractChange',
      mockPath: '/product/fund/revenueInfo/contractChange',
      desc: '经费管理->全周期预算->收款预算->查询合同变更数据'
    },
    {
      name: 'submitRevenueChangedReason',
      method: 'POST',
      path: '/product/fund/revenueInfo/submitRevenueChangedReason',
      mockPath: '/product/fund/revenueInfo/submitRevenueChangedReason',
      desc: '经费管理->全周期预算->收款预算->保存同步的合同节点预算变更'
    },
    {
      name: 'submitRevenueChangedReasonOther',
      method: 'POST',
      path: '/product/fund/revenueInfo/submitRevenueChangedReasonOther',
      mockPath: '/product/fund/revenueInfo/submitRevenueChangedReasonOther',
      desc: '经费管理->全周期预算->一级经费二级经费预算->预算变更'
    }
  ],
  secondaryFunding: [
    {
      name: 'loadBudgetCommonData',
      method: 'POST',
      path: '/product/fund/revenueBudget/loadBudgetCommonData',
      mockPath: '/product/fund/revenueBudget/loadBudgetCommonData',
      desc: '经费管理->全周期预算->二级经费编制->列表数据'
    },
    {
      name: 'getYearNode',
      method: 'POST',
      path: '/product/fund/revenueBudget/getYearNode',
      mockPath: '/product/fund/revenueBudget/getYearNode',
      desc: '经费管理->全周期预算->二级经费编制->年度列数据及数据权限'
    },
    {
      name: 'createSecondBudgetData',
      method: 'POST',
      path: '/product/fund/revenueBudget/createSecondBudgetData',
      mockPath: '/product/fund/revenueBudget/createSecondBudgetData',
      desc: '经费管理->全周期预算->二级经费编制->新建节点'
    },
    {
      name: 'updateBudgetData',
      method: 'POST',
      path: '/product/fund/revenueBudget/updateBudgetData',
      mockPath: '/product/fund/revenueBudget/updateBudgetData',
      desc: '经费管理->全周期预算->二级经费编制->更新数据'
    },
    {
      name: 'deleteBudgetData',
      method: 'POST',
      path: '/product/fund/revenueBudget/deleteBudgetData',
      mockPath: '/product/fund/revenueBudget/deleteBudgetData',
      desc: '经费管理->全周期预算->二级经费编制->删除节点'
    },
    {
      name: 'deptTree',
      method: 'POST',
      path: '/product/fund/revenueBudget/getDeptTreeData',
      mockPath: '/product/fund/revenueBudget/getDeptTreeData',
      desc: '经费管理->全周期预算->二级经费编制->单位树数据'
    },
    {
      name: 'otherDeptTree',
      method: 'POST',
      path: '/product/fund/revenueBudget/getOtherDeptTreeData',
      mockPath: '/product/fund/revenueBudget/getOtherDeptTreeData',
      desc: '经费管理->全周期预算->二级经费编制->外协树数据'
    },
    {
      name: 'secondPayValidateInfo',
      method: 'POST',
      path: '/product/fund/revenueBudget/payValidateInfo',
      mockPath: '/product/fund/revenueBudget/payValidateInfo',
      desc: '经费管理->全周期预算->二级经费编制->提交前校验'
    },
    {
      name: 'firstPayValidateInfo',
      method: 'POST',
      path: '/product/fund/revenueBudget/payValidateInfo',
      mockPath: '/product/fund/revenueBudget/payValidateInfo',
      desc: '经费管理->全周期预算->一级经费编制->提交前校验'
    }
  ],
  collectionManager: [
    {
      name: 'loadBudgetCommonData',
      method: 'POST',
      path: '/product/fund/revenueBudgetTemporary/loadBudgetCommonData',
      mockPath: '/product/fund/revenueBudgetTemporary/loadBudgetCommonData',
      desc: '经费管理->全周期预算->收款管理->列表数据'
    },
    {
      name: 'getReceiveManager',
      method: 'POST',
      path: '/product/fund/revenueBudgetTemporary/getReceiveManager',
      mockPath: '/product/fund/revenueBudgetTemporary/getReceiveManager',
      desc: '经费管理->全周期预算->收款管理->表单数据'
    },
    {
      name: 'saveOrUpdate',
      method: 'POST',
      path: '/product/fund/revenueBudgetTemporary/saveOrUpdate',
      mockPath: '/product/fund/revenueBudgetTemporary/saveOrUpdate',
      desc: '经费管理->全周期预算->收款管理->保存数据'
    },
    {
      name: 'removeRevenue',
      method: 'POST',
      path: '/product/fund/revenueBudgetTemporary/removeRevenue',
      mockPath: '/product/fund/revenueBudgetTemporary/removeRevenue',
      desc: '经费管理->全周期预算->收款管理->删除数据'
    },
    {
      name: 'confirmRevenue',
      method: 'POST',
      path: '/product/fund/revenueBudgetTemporary/confirmRevenue',
      mockPath: '/product/fund/revenueBudgetTemporary/confirmRevenue',
      desc: '经费管理->全周期预算->收款管理->确认收款'
    },
    {
      name: 'checkIsLastConfirm',
      method: 'POST',
      path: '/product/fund/revenueBudgetTemporary/checkIsLastConfirm',
      mockPath: '/product/fund/revenueBudgetTemporary/checkIsLastConfirm',
      desc: '经费管理->全周期预算->收款管理->检查最后一笔收款'
    },
    {
      name: 'getRevenueData',
      method: 'POST',
      path: '/product/fund/revenueBudgetTemporary/getRevenueData',
      mockPath: '/product/fund/revenueBudgetTemporary/getRevenueData',
      desc: '经费管理->全周期预算->收款管理->获取预算数据'
    }
  ],
  FundingManager: [
    {
      name: 'fundingListData',
      method: 'POST',
      path: '/product/fund/revenueInfo/fundingListData',
      mockPath: '/product/fund/revenueInfo/fundingListData',
      desc: '经费管理->全周期预算->收款管理->列表数据'
    },
    {
      name: 'getUsableMoney',
      method: 'POST',
      path: '/product/fund/revenueInfo/getUsableMoney',
      mockPath: '/product/fund/revenueInfo/getUsableMoney',
      desc: '经费管理->全周期预算->收款管理->可支配总金额'
    },
    {
      name: 'appropriation',
      method: 'POST',
      path: '/product/fund/revenueInfo/appropriation',
      mockPath: '/product/fund/revenueInfo/appropriation',
      desc: '经费管理->全周期预算->收款管理->拨款'
    }
  ],
  RevenueYearBudget: [
    {
      name: 'list',
      method: 'POST',
      path: '/product/fund/yearRevenueInfo/list',
      mockPath: '/product/fund/yearRevenueInfo/list',
      desc: '经费管理->年度预算->列表数据'
    },
    {
      name: 'findRevenueYearInfoIdByNew',
      method: 'POST',
      path: '/product/fund/yearRevenueInfo/findRevenueYearInfoIdByNew',
      mockPath: '/product/fund/yearRevenueInfo/findRevenueYearInfoIdByNew',
      desc: '经费管理->年度预算->审核校验'
    },
    {
      name: 'getExamineYearRevenueData',
      method: 'POST',
      path: '/product/fund/yearRevenueInfo/getExamineYearRevenueData',
      mockPath: '/product/fund/yearRevenueInfo/getExamineYearRevenueData',
      desc: '经费管理->年度预算->审核页面数据'
    },
    {
      name: 'updateYearRevenueInfoStatus',
      method: 'POST',
      path: '/product/fund/yearRevenueInfo/updateYearRevenueInfoStatus',
      mockPath: '/product/fund/yearRevenueInfo/updateYearRevenueInfoStatus',
      desc: '经费管理->年度预算->审核通过'
    },
    {
      name: 'backYearRevenueInfoEdit',
      method: 'POST',
      path: '/product/fund/yearRevenueInfo/backYearRevenueInfoEdit',
      mockPath: '/product/fund/yearRevenueInfo/backYearRevenueInfoEdit',
      desc: '经费管理->年度预算->审核驳回页面数据'
    },
    {
      name: 'saveBackYearRevenueInfo',
      method: 'POST',
      path: '/product/fund/yearRevenueInfo/saveBackYearRevenueInfo',
      mockPath: '/product/fund/yearRevenueInfo/saveBackYearRevenueInfo',
      desc: '经费管理->年度预算->审核驳回'
    },
    {
      name: 'saveYearRevenue',
      method: 'POST',
      path: '/product/fund/yearRevenueInfo/saveYearRevenue',
      mockPath: '/product/fund/yearRevenueInfo/saveYearRevenue',
      desc: '经费管理->年度预算->发起所有年度预算'
    }
  ],
  YearRevenueInfo: [
    {
      name: 'yearRevenueInfoListData',
      method: 'POST',
      path: '/product/fund/yearRevenueInfo/yearRevenueInfoListData',
      mockPath: '/product/fund/yearRevenueInfo/yearRevenueInfoListData',
      desc: '经费管理->年度预算->年度预算列表->列表数据'
    },
    {
      name: 'getYearData',
      method: 'POST',
      path: '/product/fund/yearRevenueInfo/getYearData',
      mockPath: '/product/fund/yearRevenueInfo/getYearData',
      desc: '经费管理->年度预算->年度预算列表->获取年份数据'
    },
    {
      name: 'saveSingleYearRevenue',
      method: 'POST',
      path: '/product/fund/yearRevenueInfo/saveSingleYearRevenue',
      mockPath: '/product/fund/yearRevenueInfo/saveSingleYearRevenue',
      desc: '经费管理->年度预算->年度预算列表->发起当前项目年度预算'
    },
    {
      name: 'checkIsGoYearRevenue',
      method: 'POST',
      path: '/product/fund/yearRevenueInfo/checkIsGoYearRevenue',
      mockPath: '/product/fund/yearRevenueInfo/checkIsGoYearRevenue',
      desc: '经费管理->年度预算->年度预算列表->发起当前项目年度预算校验'
    },
    {
      name: 'yearPayListData',
      method: 'POST',
      path: '/product/fund/yearRevenueInfo/yearPayListData',
      mockPath: '/product/fund/yearRevenueInfo/yearPayListData',
      desc: '经费管理->年度预算->年度预算列表->查看支出预算'
    },
    {
      name: 'comeInListData',
      method: 'POST',
      path: '/product/fund/yearRevenueInfo/comeInListData',
      mockPath: '/product/fund/yearRevenueInfo/comeInListData',
      desc: '经费管理->年度预算->年度预算列表->查看收入预算'
    },
    {
      name: 'listTreeData',
      method: 'POST',
      path: '/product/fund/yearRevenueInfo/listTreeData',
      mockPath: '/product/fund/yearRevenueInfo/listTreeData',
      desc: '经费管理->年度预算->年度预算列表->查看全部预算'
    }
  ],
  ComeInRevenue: [
    {
      name: 'comeYearBudgetsList',
      method: 'POST',
      path: '/product/fund/yearRevenueInfo/comeYearBudgetsList',
      mockPath: '/product/fund/yearRevenueInfo/comeYearBudgetsList',
      desc: '经费管理->年度预算->收款预算编制->列表数据'
    },
    {
      name: 'getYearComeInData',
      method: 'POST',
      path: '/product/fund/yearRevenueInfo/getYearComeInData',
      mockPath: '/product/fund/yearRevenueInfo/getYearComeInData',
      desc: '经费管理->年度预算->收款预算编制->添加收款节点'
    },
    {
      name: 'saveOrUpdateComeInData',
      method: 'POST',
      path: '/product/fund/yearRevenueInfo/saveOrUpdateComeInData',
      mockPath: '/product/fund/yearRevenueInfo/saveOrUpdateComeInData',
      desc: '经费管理->年度预算->收款预算编制->保存收款节点'
    },
    {
      name: 'showBack',
      method: 'POST',
      path: '/product/fund/yearRevenueInfo/showBack',
      mockPath: '/product/fund/yearRevenueInfo/showBack',
      desc: '经费管理->年度预算->收款预算编制->收回'
    },
    {
      name: 'carryComeOver',
      method: 'POST',
      path: '/product/fund/yearRevenueInfo/carryComeOver',
      mockPath: '/product/fund/yearRevenueInfo/carryComeOver',
      desc: '经费管理->年度预算->收款预算编制->结转'
    },
    {
      name: 'submitRevenueChangedReason',
      method: 'POST',
      path: '/product/fund/yearRevenueInfo/submitRevenueChangedReason',
      mockPath: '/product/fund/yearRevenueInfo/submitRevenueChangedReason',
      desc: '经费管理->年度预算->收款预算编制->变更保存'
    }
  ],
  PayRevenue: [
    {
      name: 'payYearBudgetsList',
      method: 'POST',
      path: '/product/fund/yearRevenueInfo/payYearBudgetsList',
      mockPath: '/product/fund/yearRevenueInfo/payYearBudgetsList',
      desc: '经费管理->年度预算->支出预算编制->列表数据'
    },
    {
      name: 'getYearPayData',
      method: 'POST',
      path: '/product/fund/yearRevenueInfo/getYearPayData',
      mockPath: '/product/fund/yearRevenueInfo/getYearPayData',
      desc: '经费管理->年度预算->支出预算编制->添加收款节点'
    },
    {
      name: 'saveOrUpdatePayData',
      method: 'POST',
      path: '/product/fund/yearRevenueInfo/saveOrUpdatePayData',
      mockPath: '/product/fund/yearRevenueInfo/saveOrUpdatePayData',
      desc: '经费管理->年度预算->支出预算编制->保存收款节点'
    },
    {
      name: 'showBack',
      method: 'POST',
      path: '/product/fund/yearRevenueInfo/showBack',
      mockPath: '/product/fund/yearRevenueInfo/showBack',
      desc: '经费管理->年度预算->支出预算编制->收回'
    },
    {
      name: 'carryPayOver',
      method: 'POST',
      path: '/product/fund/yearRevenueInfo/carryPayOver',
      mockPath: '/product/fund/yearRevenueInfo/carryPayOver',
      desc: '经费管理->年度预算->支出预算编制->结转'
    }
  ],
  TaskRevenueInfo: [
    {
      name: 'getRelationData',
      method: 'POST',
      path: '/product/fund/revenueInfo/getRelationData',
      mockPath: '/product/fund/revenueInfo/getRelationData',
      desc: '计划编辑试图-挂接经费节点->列表数据'
    },
    {
      name: 'saveRelation',
      method: 'POST',
      path: '/product/fund/revenueInfo/saveRelation',
      mockPath: '/product/fund/revenueInfo/saveRelation',
      desc: '计划编辑试图-挂接经费节点->保存挂接经费节点'
    },
    {
      name: 'isInYearRevenue',
      method: 'POST',
      path: '/product/fund/revenueInfo/isInYearRevenue',
      mockPath: '/product/fund/revenueInfo/isInYearRevenue',
      desc: '计划编辑试图-挂接经费节点->数据校验'
    },
    {
      name: 'removeRelation',
      method: 'POST',
      path: '/product/fund/revenueInfo/removeRelation',
      mockPath: '/product/fund/revenueInfo/removeRelation',
      desc: '计划编辑试图-挂接经费节点->取消挂接'
    }
  ]
}
