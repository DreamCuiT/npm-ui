<template>
  <el-dialog :title="title"
             :visible="visible"
             append-to-body
             destroy-on-close
             width="80%"
             :style="{'--height':flexHeight+'px'}"
             @close="handleCancel">
    <div class="tableDiv">
      <el-table :data="tableData"
                :max-height="flexHeight"
                highlight-current-row
                row-key="id"
                v-bind="tableConfig"
                :cell-style="columnStyle"
                :default-expand-all="true">
        <el-table-column v-for="(item, index) in columns"
                         :key="index"
                         :prop="item.prop"
                         :align='item.align'
                         :type="item.type"
                         :label="item.label"
                         :width="item.width">
          <template slot-scope="scope">
            <template v-if="item.prop == 'status'&&showStatus(scope.row)">

              <el-tooltip effect="light"
                          placement="right">
                <div slot="content">
                  <p v-html="statusDisplay(scope.row)"></p>
                </div>
                <i class="icon-filled-circle p8"
                   :style="statusColor(scope.row.status)">
                </i>
              </el-tooltip>
            </template>
            <template v-else>
              <span>{{ scope.row[item.prop] }}</span>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>
<script>

import { Dialog, Table, TableColumn, Tooltip } from '~/index'
import moment from 'moment'
const mh = document.documentElement.clientHeight - 265
export default {
  name: 'BudgetReviewManager',
  components: {
    'el-dialog': Dialog,
    'el-table': Table,
    'el-tooltip': Tooltip,
    'el-table-column': TableColumn
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    thirdMenuParam: {
      type: Object,
      default: function () {
        return {}
      }
    },
    title: {
      type: String,
      default: ''
    },
    historyColumns: {
      type: String,
      default: ''
    },
    historyData: {
      type: String,
      default: ''
    }
  },
  data () {
    return {

      flexHeight: mh,
      content: null,
      columns: [],
      tableData: [],
      revenuePayStatusObj: {
        8000: '已关联',
        8003: '待拨付,排队等待',
        8005: '待拨付,排队等待',
        8007: '已拨付'
      },
      revenueStatusObj: {

        7001: '待收款',
        7003: '收款中',
        7005: '收款完成',
        7009: '待收款'
      },
      tableConfig: {
        expandIconColumnIndex: 1
      }
    }
  },
  created () {
    this.initData()
  },
  computed: {
    statusColor () {
      return function (status) {
        if (status === '7003') {
          return 'cursor: pointer;color:#1bbf9e'
        } else if (status === '7005') {
          return 'cursor: pointer;color:#00acee'
        } else if (status === '7009') {
          return 'cursor: pointer;color:#d4d4d4'
        } else if (status === '8007') {
          return 'cursor: pointer;color:#1bbf9e'
        } else {
          return 'cursor: pointer;color:#d4d4d4'
        }
      }
    }
  },
  methods: {
    initData () {
      let historyColumns = JSON.parse(this.historyColumns)
      let historyData = JSON.parse(this.historyData)
      this.columns = historyColumns
      this.tableData = historyData
    },
    columnStyle ({ row, column, rowIndex, columnIndex }) {
      if (row.children && row.children.length > 0) {
        return 'font-weight: 900;'
      }
    },
    showStatus (row) {
      let planType = row.planType
      let nodeType = row.nodeType
      let taskStatus = row.taskStatus
      let status = row.status
      let type = row.type
      let parentId = row.parentId
      let result = false
      if (status || taskStatus) {
        if (planType && (planType === 'task' || planType === 'otherDeptTask')) {
          result = true
        }
        if ((nodeType && nodeType === 'true') || (type === '1002' && parentId !== '')) {
          result = true
        }
      }
      return result
    },
    statusDisplay (row) {
      let planType = row.planType
      let nodeType = row.nodeType
      let type = row.type
      let parentId = row.parentId
      if (planType && (planType === 'task' || planType === 'otherDeptTask')) {
        return this.initPayIcon(row)
      }
      if ((nodeType && nodeType === 'true') || (type === '1002' && parentId !== '')) {
        return this.initIncomeIcon(row)
      }
    },
    initPayIcon (row) {
      let taskStatus = row.taskStatus
      let status = row.status
      let taskName = row.taskName
      let endDate = row.endDate
      let showStr = ''
      if (taskStatus && taskStatus !== '') {
        showStr = showStr + "<font style='color: #4ea640;'>任务名称</font>：" + taskName + '<br/>'
        showStr = showStr + "<font style='color: #4ea640;'>计划完成时间</font>：" + moment(endDate).format('YYYY-MM-DD') + '<br/>'
        showStr = showStr + "<font style='color: #4ea640;'>任务状态</font>：" + taskStatus + '<br/>'
      }
      if (status && status !== '') {
        showStr = showStr + "<font style='color: #4ea640;'>拨款节点状态</font>：" + this.revenuePayStatusObj[status]
      }

      return showStr
    },
    initIncomeIcon (row) {
      let status = row.status
      let nodeMoney = row.nodeMoney
      let endDate = row.nodeEndTime
      let nodeType = row.nodeType
      let comeMoneyData = row.comeMoneyData
      let showStr = ''
      if (nodeType && nodeType === 'true') {
        if (endDate) {
          endDate = moment(endDate).format('YYYY-MM-DD')
        }
        showStr = showStr + "<font style='color: #4ea640;'>合同节点金额</font>：" + nodeMoney + '(万元)'
        showStr = showStr + "</br><font style='color: #4ea640;'>合同节点时间</font>：" + endDate
      }
      if (status && status !== '') {
        showStr = showStr + "</br><font style='color: #4ea640;'>状态</font>：" + this.revenueStatusObj[status]
        if (status === '7005' || status === '7003') {
          if (comeMoneyData && comeMoneyData.length > 0) {
            showStr = showStr + "<div style='width:100%;height: 1px;line-height: 1px; overflow:hidden;border-bottom: #cecece 1px solid;margin: 2px 0px;'></div>"

            for (let i = 0; i < comeMoneyData.length; i++) {
              let msg = ''

              let time = comeMoneyData[i].incomeTime
              if (time) {
                time = moment(comeMoneyData[i].incomeTime).format('YYYY-MM-DD')
              }
              let alreadyMoney = comeMoneyData[i].alreadyMoney

              if (alreadyMoney && alreadyMoney !== '') {
                msg = msg + "<span style='color: #ff1815;font-style: italic;'>收款金额</span>：" + alreadyMoney + '(万元)'
              }
              if (time && time !== '') {
                msg = msg + "<span style='color: #ff1815;font-style: italic;'>收款时间</span>：" + time + ''
              }
              if (msg && msg !== '') {
                showStr = showStr + msg
              }
              showStr = showStr + '<br/>'
            }
          }
        }
      } else {
        showStr = showStr + "</br><font style='color: #4ea640;'>状态</font>：待收款"
      }

      return showStr
    },
    handleCancel () {
      this.$emit('close-dialog')
    },
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    }
  }
}
</script>
