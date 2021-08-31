<template>
    <normal-layout class="process-approval-layout" :headerVisible="false" :fullHeight="true" :normalLayout="layoutConfig">
        <template #west>
            <common-tabs class="custom-common-tabs" :activeTabs="activeTabs"
                         type="border-card"
                         :tabsData="tabs"
                         height="auto"
                         @tab-click="tabClick"
            >
                <template #pending_label>
                    <el-badge :value="pendingTotal" :max="99" class="item">
                    </el-badge>
                </template>
                <template #pending>
                    <pending-list v-if="activeTabs === 'pending'"
                            :approvedTaskId="approvedTaskId"
                            :refreshFlag="refreshFlag"
                            @itemClick="select"
                            ref="pending"
                    ></pending-list>
                </template>

                <template #claim_label>
                    <el-badge :value="claimTotal" :max="99" class="item" type="warning">
                    </el-badge>
                </template>
                <template #claim>
                    <claim-list
                            :approvedTaskId="approvedTaskId"
                            @itemClick="claimSelect"
                            ref="claim"
                    ></claim-list>
                </template>

                <template #history>
                    <history-list v-if="activeTabs === 'history'"
                            @itemClick="historySelect"
                            :refreshFlag="refreshFlag"
                            ref="history"
                    ></history-list>
                </template>
            </common-tabs>
            <refresh-btn class="refresh-style" @refresh="refreshHandle"></refresh-btn>
        </template>
        <template #center>
            <approval v-if="activeTabs == 'pending' && pendingSelected"
                      :selectedApproval="pendingSelected"
                      :dataSource="approveDataSource"
                      @approved="approved"/>
            <claim v-if="activeTabs == 'claim' && claimSelected"
                      :selectedApproval="claimSelected"
                      @approved="approved"/>
            <history v-if="activeTabs == 'history' && historySelected"
                      :selectedApproval="historySelected"/>
        </template>
    </normal-layout>
</template>

<script>
import { P8Tabs as CommonTabs } from '~/index'
import { P8NormalLayout as NormalLayout } from '~/index'
import PendingList from './pendingList'
import ClaimList from './claimList'
import HistoryList from './historyList'
import Approval from './approval'
import Claim from './claim'
import History from './history'
import { Badge } from '~/index'
import RefreshBtn from './refreshBtn'

export default {
  name: 'ProcessApproval',
  components: {
    CommonTabs,
    NormalLayout,
    PendingList,
    ClaimList,
    HistoryList,
    Approval,
    Claim,
    History,
    'el-badge': Badge,
    RefreshBtn
  },
  data () {
    return {
      activeTabs: 'pending',
      pendingSelected: null,
      approveDataSource: [],
      claimSelected: null,
      historySelected: null,
      claimTotal: 0,
      pendingTotal: 0,
      approvedTaskId: '',
      layoutConfig: {
        west: {
          xs: 9, sm: 8, md: 8, lg: 7, xl: 7
        },
        center: {
          xs: 15, sm: 16, md: 16, lg: 17, xl: 17
        }
      },
      tabs: [
        {
          label: '待处理',
          name: 'pending'
        },
        // {
        //   label: '待认领',
        //   name: 'claim'
        // },
        {
          label: '已处理',
          name: 'history'
        }
      ],
      refreshFlag: 1
    }
  },
  mounted () {
    let this_ = this
    setInterval(function () {
      // if (this_.$refs &&
      //   this_.$refs.claim &&
      //   this_.$refs.pending) {
      //   this_.claimTotal = this_.$refs.claim.$data.pageInfo.total
      //   this_.pendingTotal = this_.$refs.pending.$data.pageInfo.total
      // }
      if (this_.$refs &&
        this_.$refs.pending) {
        this_.pendingTotal = this_.$refs.pending.$data.pageInfo.total
      }
    }, 300)
  },
  computed: {
  },
  methods: {
    refreshHandle (flag) {
      this.refreshFlag = flag
    },
    select (r) {
      let options = [{ label: '通过', value: '1' }]
      if (r && (r.isMultipleInstance === '0' || r.taskDefKey.indexOf('notMultiInstance') !== -1)) {
        options.push({ label: '完善计划', value: '0' })
      }
      this.approveDataSource = [
        {
          type: 'radio', // 控件类型
          labelText: '审批结果', // 控件显示的文本
          fieldName: 'approvalResult',
          colLayout: 'doubleCol',
          options: options,
          rules: [
            {
              required: true,
              message: '必填'
            }
          ]
        },
        {
          type: 'textarea',
          labelText: '审批意见',
          fieldName: 'approvalComment',
          colLayout: 'doubleCol',
          placeholder: '请输入审批意见'
        }
      ]
      this.pendingSelected = r
    },
    claimSelect (r) {
      this.claimSelected = r
    },
    historySelect (r) {
      this.historySelected = r
    },
    approved (taskId) {
      this.approvedTaskId = taskId
      this.$emit('approved')
    },
    tabClick (target) {
      this.activeTabs = target.name
      this.refreshFlag = 1
    }
  }
}
</script>

<style lang="scss" scoped>
// 隐藏 el-tabs列表上的border
.custom-common-tabs{
  height: calc(100% - 2px) !important;
  border: 0px;
  /deep/ &.el-tabs--border-card {
    .el-tabs__nav {
      border: none;
      background: #F5F7FA;
    }
    .el-tabs__content {
      padding: 0;
    }
    .el-tabs__nav-wrap {
      margin-bottom: 0;
    }
  }
}
.process-approval-layout.normal-layout {
  /deep/ .normal-west {
    .scroll-area {
      height: 100% !important;
    }
  }
}
.refresh-style {
  position: absolute;
  right: 10px;
  top: 4px;
  z-index: 10;
}
</style>
