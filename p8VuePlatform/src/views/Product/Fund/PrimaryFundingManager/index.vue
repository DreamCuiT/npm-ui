<template>
  <list-layout>
    <template #north>
      <el-button v-if="isCanEdit()"
                 type="primary"
                 round
                 @click="submitComeIn()">提交</el-button>
      <el-button v-if="isRevenueChange()"
                 type="primary"
                 round
                 @click="submitChangedReason('first')">预算变更</el-button>
      <div style="float: right;">
        <el-tag>收款总金额： {{ comeInMoney  }} (万元)</el-tag>
        <el-tag style="margin-left: 20px;">可分配金额： {{ confirmMoney }} (万元)</el-tag>
      </div>
    </template>
    <template #center>
      <div class="tableDiv">
        <el-table ref="treeData"
                  :data="tableData"
                  :max-height="flexHeight"
                  highlight-current-row
                  row-key="id"
                  v-loading="isListLoading"
                  element-loading-text="拼命加载中"
                  element-loading-spinner="el-icon-loading"
                  :cell-style="columnStyle"
                  v-bind="tableConfig"
                  :expand-row-keys="expandRowKeys"
                  @cell-click="cellClick">
          <el-table-column v-for="(item, index) in columns"
                           :key="index"
                           :prop="item.prop"
                           :align='item.align'
                           :type="item.type"
                           :label="item.label"
                           :width="item.width">
            <template slot-scope="scope">
              <el-input-number v-if="item.moneyEdit"
                               size="small"
                               :precision="4"
                               :step="1"
                               :min="0"
                               v-model="scope.row[item.prop]"
                               @blur="removeClass"
                               @change="moneyChange(item.prop, item.label,scope.row[item.prop],scope.row)">
              </el-input-number>
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
        <edit-change-form v-if="revenueChangeDialog"
                          :visible="revenueChangeDialog"
                          :otherParam="otherParam"
                          :changeType="changeType"
                          :dialogTitle="dialogTitle"
                          @close-dialog='onRevenueChangeClose'
                          @save-success='onRevenueChangeCallBack'></edit-change-form>
      </div>
    </template>
  </list-layout>
</template>
<style scoped>
.tableDiv .el-input-number {
  display: none;
}
.current-cell .el-input-number {
  display: block;
}
.current-cell .el-input-number + span {
  display: none;
}
</style>

<script>
import Vue from 'vue'
import { generateTree } from '@/utils/generateTree'
import { P8ListLayout as ListLayout } from '~/index'
import EditChangeForm from './Components/editChangeForm'
import { Button, Tag, Table, TableColumn, InputNumber, Tooltip } from '~/index'
import moment from 'moment'
const mh = document.documentElement.clientHeight - 165
export default {
  name: 'PrimaryFundingManager',
  components: {
    ListLayout,
    EditChangeForm,
    'el-button': Button,
    'el-tag': Tag,
    'el-table': Table,
    'el-tooltip': Tooltip,
    'el-table-column': TableColumn,
    'el-input-number': InputNumber
  },
  props: {
    thirdMenuParam: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      tableApi: 'secondaryFunding.loadBudgetCommonData',
      flexHeight: mh,
      content: null,
      queryParam: {},
      columns: [],
      tableData: [],
      isListLoading: false, // 列表加载
      comp: this,
      planStatus: {},
      comeInMoney: 0, // 收款总金额
      confirmMoney: 0, // 可分配金额
      revenueStatus: '',
      expandRowKeys: [],
      searchData: [],
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
      revenueChangeDialog: false,
      dialogTitle: '',
      changeType: '',
      tableConfig: {
        expandIconColumnIndex: 2
      }
    }
  },
  watch: {
    '$route': 'initData'
  },
  created () {
    this.initColumns()
  },
  mounted () {
    this.queryList()
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
    initData () {
      if (this.$route.name === 'primaryFundingManager') {
        this.initColumns()
        this.queryList()
      }
    },
    initColumns () {
      let that = this
      const columns = [
        {
          label: '状态',
          prop: 'status',
          type: 'index',
          width: '80',
          align: 'center'
        },
        {
          label: '项目节点',
          prop: 'name',
          'min-width': '300',
          align: 'left',
          nameEdit: true

        },
        {
          label: '金额(万元)',
          prop: 'money',
          width: '150',
          align: 'center'
        },
        {
          label: '比例(%)',
          prop: 'scale',
          width: '150',
          align: 'center'
        }

      ]
      that.$api['secondaryFunding.getYearNode'](this.thirdMenuParam).then(res => {
        if (res) {
          res.forEach(function (item, idx) {
            let cell = {
              label: '2019',
              prop: 'years2019',
              width: '150',
              align: 'center',
              moneyEdit: true
            }
            cell.label = item.years + ''
            cell.prop = 'years' + item.years
            columns.push(cell)
          })
          that.columns = columns
        }
      })
      this.getRevenueStatus()
    },
    setItemKey (item) {
      item.key = item.id
      let that = this
      if (item.code && item.code === '002') {
        that.comeInMoney = item.money || 0 // 收款总金额
      }
      if (item.code && item.code === '001') {
        that.confirmMoney = (that.comeInMoney - item.money) || 0 // 可分配金额
        item.scale = that.comeInMoney === 0 ? 0 : (Number(item.money || 0) / Number(that.comeInMoney) * 100).toFixed(2)
      }
      if (item.classify && (item.classify === 'PAY_ROOT' || item.classify === 'STAIR_FUNDS')) {
        that.expandRowKeys.push(item.id)
      }
      if (item.children && item.children.length > 0) {
        item.children.map(function (subItem, idx) {
          that.setItemKey(subItem)
          if (subItem.type && subItem.type === '1001') {
            subItem.scale = that.comeInMoney === 0 ? 0 : (Number(subItem.money || 0) / Number(that.comeInMoney) * 100).toFixed(2)
          }
        })
      }
    },
    getRevenueStatus () {
      let that = this
      that.$api['revenueFullBudget.getRevenueStatus'](this.thirdMenuParam).then(function (res) {
        if (res) {
          that.revenueStatus = res.revenueStatus
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    isCanEdit () {
      return this.revenueStatus === '4516'
    },
    isRevenueChange () {
      return this.revenueStatus === '4526'
    },
    submitChangedReason (type) {
      let historyColumns = JSON.stringify(this.columns)
      let historyData = JSON.stringify(this.$refs.treeData.data)
      this.otherParam = Object.assign({}, this.thirdMenuParam)
      this.otherParam.historyData = historyData
      this.otherParam.historyColumns = historyColumns
      this.changeType = type
      this.revenueChangeDialog = true
      this.dialogTitle = '一级经费变更'
    },
    onRevenueChangeClose () {
      this.revenueChangeDialog = false
      this.dialogTitle = ''
      this.otherParam = Object.assign({}, this.thirdMenuParam)
    },
    onRevenueChangeCallBack () {
      this.revenueChangeDialog = false
      this.dialogTitle = ''
      this.otherParam = Object.assign({}, this.thirdMenuParam)
      this.getRevenueStatus()
      this.queryList()
    },
    queryList () {
      const that = this
      this.isListLoading = true
      this.tableRefresh(new Promise((resolve, reject) => {
        if (that.tableApi) {
          that.$api[that.tableApi](this.thirdMenuParam).then(function (res) {
            that.isListLoading = false

            let data = generateTree(res.records ? res.records : res, 'parentId')

            if (data && data.length > 0) {
              data.forEach(function (item, idx) {
                that.setItemKey(item)
              })
            }
            that.tableData = data
            resolve()// 调用列表接口成功后的回调方法
          }).catch(function (error) {
            reject(error) // 调用列表接口失败后的回调方法
          })
        }
      }))
    },
    moneyChange (prop, label, value, row) {
      let cell = prop + '-Id'

      let params = {
        year: label,
        yearIdEnName: row[cell],
        yearEnName: value,
        id: row.id,
        parentId: row.parentId,
        updateType: 'money',
        revenueInfoId: this.thirdMenuParam.revenueInfoId,
        wholeDescribeId: this.thirdMenuParam.wholeDescribeId
      }
      this.updateBudgetData(params)
    },
    cellClick (row, column, cell, event) {
      for (let i = 0; i < document.getElementsByClassName('current-cell').length; i++) {
        document.getElementsByClassName('current-cell')[i].classList.remove('current-cell')
      }
      // 是否禁用编辑器

      let classify = row.classify
      let result = true

      if (classify !== 'STAIR_FUNDS') {
        result = false
      }
      if (result && this.isCanEdit()) {
        cell.classList.add('current-cell')
      }
    },
    removeClass () {
      document.getElementsByClassName('current-cell')[0].classList.remove('current-cell')
    },
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
    updateBudgetData (params) {
      let that = this
      that.$api['secondaryFunding.updateBudgetData'](params).then(res => {
        if (res && res === 'true') {
          that.queryList()
        }
      })
    },
    submitComeIn () {
      let that = this
      let type = 'success'
      let msg = '提交成功！'
      that.$api['secondaryFunding.firstPayValidateInfo'](this.thirdMenuParam).then(res => {
        if (res) {
          let resultMsg = ''
          let temp = '&#12288;&#12288;'
          /// //////////////////////////////////////////////////////////收支平衡检查项//////////////////////////////////////////////////////////////////////////////////////

          let payInCheck = res[0].payInCheck

          let incomeMoney = payInCheck.incomeMoney
          let payMoney = payInCheck.payMoney
          let result = payInCheck.result

          let checkBalance = res[0].checkBalance

          if (result && result === 'false' && checkBalance === 'true') {
            let payInCheckMsg = '<font style="color: red">收支平衡检查项</font>:<br/>'

            payInCheckMsg = payInCheckMsg + temp + '收支不平衡<br/>'

            payInCheckMsg = payInCheckMsg + temp + '   收款：' + incomeMoney + '<br/>'
            payInCheckMsg = payInCheckMsg + temp + '   支出：' + payMoney + '<br/>'

            payInCheckMsg = payInCheckMsg + temp + '      余：' + (Number(incomeMoney) - Number(payMoney)).toFixed(5) + '<br/>'
            resultMsg = resultMsg + payInCheckMsg
          }

          if (resultMsg !== '') {
            that.$message(
              {
                showClose: true,
                dangerouslyUseHTMLString: true,
                message: resultMsg,
                type: 'error'
              }
            )
          } else {
            that.$confirm(`确认要提交一级经费编制吗?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              that.$api['collectionBudget.updateProjectRevenueInfoComeIn']({ ...this.thirdMenuParam, tempType: 'firstPay' }).then(res => {
                if (res && res === 'true') {
                  that.getRevenueStatus()
                  that.queryList()
                } else {
                  type = 'error'
                  msg = '提交失败！'
                }
              })
              that.$message(
                {
                  message: msg,
                  type: type
                }
              )
            }).catch(() => { })
          }
        }
      })
    },
    search (param) {
      if (param) {
        this.queryParam = param
      }
      let that = this
      Vue.nextTick(function () {
        that.$refs.table.searchData()
      })
    },
    reSet () {
      let that = this
      Object.keys(that.queryParam).forEach(key => { that.queryParam[key] = null })
      Vue.nextTick(function () {
        that.$refs.table.searchData()
      })
    }
  }
}
</script>
