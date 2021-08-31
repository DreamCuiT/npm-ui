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
                 @click="submitChangedReason('second')">预算变更</el-button>
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
                  v-bind="tableConfig"
                  :cell-style="columnStyle"
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
              <div v-if="item.nameEdit"
                   class="editNameDiv">
                <el-input type="text"
                          size="mini"
                          v-model="scope.row[item.prop]"
                          @blur="removeClass"
                          @change="nameChange(item.prop, item.label,scope.row[item.prop],scope.row)">
                </el-input>
              </div>
              <div v-if="item.moneyEdit"
                   class="editMoneyDiv">
                <el-input-number size="mini"
                                 :precision="4"
                                 :step="1"
                                 :min="0"
                                 v-model="scope.row[item.prop]"
                                 @blur="removeClass"
                                 @change="moneyChange(item.prop, item.label,scope.row[item.prop],scope.row)">
                </el-input-number>
              </div>

              <template v-if="item.prop == 'tableSetting'&&tableSetting(scope.row)&&isCanEdit()">
                <el-dropdown trigger="click"
                             :hide-on-click="false">
                  <span class="el-dropdown-link">
                    <i class="el-icon-s-tools"
                       style="cursor: pointer;color:#2196F3"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="isShowMenu(scope.row,'create')">
                      <div @click="createBudgetData(scope.row,'新节点','')"><i class="p8 icon-new-subordinate"></i>新建下级</div>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="isShowMenu(scope.row,'otherDept')">
                      <div @click="selectOtherDeptOut(scope.row)"><i class="p8 icon-new-subordinate"></i>添加外协单位</div>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="isShowMenu(scope.row,'otherDeptTask')">
                      <div @click="createBudgetData(scope.row,'合同节点','otherDeptTask')"><i class="p8 icon-new-subordinate"></i>新建外协合同节点</div>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="isShowMenu(scope.row,'dept')">
                      <div @click="selectDeptOut(scope.row)"><i class="p8 icon-new-subordinate"></i>添加拨付厂所</div>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="isShowMenu(scope.row,'task')">
                      <div @click="createBudgetData(scope.row,'合同节点','task')"><i class="p8 icon-new-subordinate"></i>新建厂所合同节点</div>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="isShowMenu(scope.row,'delete')">
                      <div @click="deleteBudgetData(scope.row)"><i class="p8 icon-delete"></i>删除</div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
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
        <select-dept v-if="deptOutDialog"
                     :visible="deptOutDialog"
                     :title="deptTitle"
                     :treeApi="treeApi"
                     @close-dialog="selectDeptCallback"
                     :disabledRow="disabledDept"></select-dept>
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
<style  lang="scss">
.tableDiv .editMoneyDiv {
  display: none;
}
.current-cell .editMoneyDiv {
  display: block;
}
.current-cell .editMoneyDiv + span {
  display: none;
}
.tableDiv .editNameDiv {
  margin-left: 20px;
  margin-top: -22px;
  display: none;
}
.current-cell .editNameDiv {
  display: block;
}
.current-cell .editNameDiv + span {
  display: none;
}
</style>

<script>
import Vue from 'vue'
import { generateTree } from '@/utils/generateTree'
import { P8ListLayout as ListLayout } from '~/index'
import selectDept from './Components/SelectDept'
import EditChangeForm from './Components/editChangeForm'
import { Button, Tag, Table, TableColumn, Dropdown, DropdownMenu, DropdownItem, Input, InputNumber, Tooltip } from '~/index'
import moment from 'moment'
const mh = document.documentElement.clientHeight - 165
export default {
  name: 'SecondaryFundingManager',
  components: {
    ListLayout,
    selectDept,
    EditChangeForm,
    'el-button': Button,
    'el-tag': Tag,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-input': Input,
    'el-tooltip': Tooltip,
    'el-dropdown': Dropdown,
    'el-dropdown-menu': DropdownMenu,
    'el-dropdown-item': DropdownItem,
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
      otherParam: {},
      columns: [],
      tableData: [],
      isListLoading: false, // 列表加载
      comp: this,
      planStatus: {},
      comeInMoney: 0, // 收款总金额
      confirmMoney: 0, // 可分配金额
      revenueStatus: '',
      searchData: [],
      expandRowKeys: [],
      tableConfig: {
        expandIconColumnIndex: 2
      },
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
      treeApi: '',
      disabledDept: [],
      selectRowData: {},
      revenueChangeDialog: false,
      dialogTitle: '',
      changeType: '',
      deptOutDialog: false
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
      if (this.$route.name === 'secondaryFundingManager') {
        this.initColumns()
        this.queryList()
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
      return this.revenueStatus === '4511'
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
      this.dialogTitle = '二级经费变更'
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
          label: '操作',
          type: 'index',
          prop: 'tableSetting',
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
      if (item.type && item.type === '1001') {
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
    queryList (message, msgType) {
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
            if (msgType) {
              that.$message(
                {
                  message: message,
                  type: msgType
                }
              )
            }
            resolve()// 调用列表接口成功后的回调方法
          }).catch(function (error) {
            reject(error) // 调用列表接口失败后的回调方法
          })
        }
      }))
    },
    nameChange (prop, label, value, row) {
      let params = {
        revenueName: value,
        id: row.id,
        revenueInfoId: this.thirdMenuParam.revenueInfoId,
        wholeDescribeId: this.thirdMenuParam.wholeDescribeId
      }
      this.updateBudgetData(params)
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
    cellClick (row, columns, cell, event) {
      for (let i = 0; i < document.getElementsByClassName('current-cell').length; i++) {
        document.getElementsByClassName('current-cell')[i].classList.remove('current-cell')
      }
      // 是否禁用编辑器
      let parentId = row.parentId
      let classify = row.classify
      let isClassifyRoot = row.isClassifyRoot
      let dataFromType = row.dataFromType
      let planType = row.planType
      let type = row.type
      let result = true
      let column = columns.property
      if (!parentId) {
        result = false
      }
      if (type && type === '1002') {
        result = false
      }
      if (isClassifyRoot && isClassifyRoot === 1) {
        result = false
      }
      if (column === 'name') { // name
        if (dataFromType && dataFromType === 1) {
          result = false
        }
      }
      if (planType && (planType === 'dept' || planType === 'otherDept')) { // 部门不可编辑
        result = false
      }

      if (classify === 'STAIR_FUNDS' && column !== 'scale') { // 非一级经费
        result = false
      }
      if (planType && planType === 'dept' && column === 'name') {
        result = false
      }
      if (planType && planType === 'otherDept' && column === 'name') {
        result = false
      }
      if (!(isClassifyRoot && isClassifyRoot === 1) && classify === 'CURRENT_PAY' && dataFromType === 1) {
        let hasChild = row.children

        if (hasChild && hasChild.length > 0) {
          result = false
        }
      }
      if (result && this.isCanEdit()) {
        cell.classList.add('current-cell')
      }
    },
    removeClass () {
      document.getElementsByClassName('current-cell')[0].classList.remove('current-cell')
    },
    tableSetting (row) {
      let result = false
      let classify = row.classify
      let isClassifyRoot = row.isClassifyRoot
      let dataFromType = row.dataFromType
      if (classify === 'SECOND_MOVE') {
        if (isClassifyRoot && isClassifyRoot === 1) {
          result = true
        } else if (dataFromType === 0) {
          result = true
        }
      }

      if (classify === 'CURRENT_PAY') {
        if (!(isClassifyRoot && isClassifyRoot === 1)) {
          result = true
        }
      }
      return result
    },
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
    getDisabledDept (data, planType) {
      let that = this
      if (data && data.length > 0) {
        data.forEach(function (item, idx) {
          if (planType === item.planType) {
            that.disabledDept.push(item.deptId)
          }
          if (item.children && item.children.length > 0) {
            that.getDisabledDept(item.children, planType)
          }
        })
      }
    },
    selectDeptOut (row) {
      this.deptOutDialog = true
      this.treeApi = 'secondaryFunding.deptTree'
      this.deptTitle = '选择厂所单位'
      this.selectRowData = row
      this.selectPlanType = 'dept'
      this.disabledDept = []
      this.disabledDept.push('1') // 根默认不能选择
      this.getDisabledDept(this.tableData, 'dept')// 不能选择的节点
    },
    selectOtherDeptOut (row) {
      this.deptOutDialog = true
      this.treeApi = 'secondaryFunding.otherDeptTree'
      this.deptTitle = '选择外协单位'
      this.selectRowData = row
      this.selectPlanType = 'otherDept'
      this.disabledDept = []
      this.disabledDept.push('1') // 根默认不能选择
      this.getDisabledDept(this.tableData, 'otherDept')// 不能选择的节点
    },
    selectDeptCallback (param) {
      let that = this
      this.deptOutDialog = false
      if (param && param.length > 0) {
        param.forEach(function (item, idx) {
          if (item.pId) {
            that.createBudgetData(that.selectRowData, item.label, that.selectPlanType, item.id)
          }
        })
      }
    },
    createBudgetData (record, revenueName, deptType, deptId) {
      let money = record.money
      let that = this
      let hasChild = record.children
      let result = false

      if (!deptType && money > 0) {
        if (!(hasChild && hasChild.length > 0)) {
          result = true
        }
      }

      if (result) {
        that.$message(
          {
            message: '新建下级前请手动设置年度预算为0！',
            type: 'error'
          }
        )
      } else {
        let type = 'success'
        let msg = '保存成功！'
        that.$api['secondaryFunding.createSecondBudgetData']({ parentId: record.id, revenueName: revenueName, deptId: deptId, type: record.type, classify: record.classify, deptType: deptType, revenueInfoId: this.thirdMenuParam.revenueInfoId, wholeDescribeId: this.thirdMenuParam.wholeDescribeId }).then(res => {
          if (res && res === 'true') {
            that.queryList(msg, type)
          } else {
            that.$message(
              {
                message: '保存失败！',
                type: 'error'
              }
            )
          }
        })
      }
    },
    updateBudgetData (params) {
      let that = this
      that.$api['secondaryFunding.updateBudgetData'](params).then(res => {
        if (res && res === 'true') {
          that.queryList()
        }
      })
    },
    deleteBudgetData (record) {
      let money = record.money
      let type = 'success'
      let msg = '删除成功！'
      if (money && money > 0) {
        type = 'error'
        msg = '请手动设置年度预算为0！'
        this.$message(
          {
            message: msg,
            type: type
          }
        )
      } else {
        let that = this
        that.$confirm(`是否要删除该节点？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$api['secondaryFunding.deleteBudgetData']({ id: record.id }).then(res => {
            if (res && res === 'true') {
              that.queryList(msg, type)
            } else {
              that.$message(
                {
                  msg: '删除失败！',
                  type: 'error'
                }
              )
            }
          })
        }).catch(() => { })
      }
    },
    submitComeIn () {
      let that = this

      that.$api['secondaryFunding.secondPayValidateInfo'](this.thirdMenuParam).then(res => {
        if (res) {
          let resultMsg = ''
          let temp = '&#12288;&#12288;'

          /// //////////////////////////////////////////////////////////经费未分解校验//////////////////////////////////////////////////////////////////////////////////////

          let noResolveObj = res[0].noResolve
          let noDept = noResolveObj.noDept
          let secondRevenue = noResolveObj.secondRevenue
          let otherDeptNoNode = noResolveObj.otherDeptNoNode

          //
          if (secondRevenue === 'false') {
            let noResolveMsg = '<font style="color: red">拨付节点检查项</font><br/>'

            noResolveMsg = noResolveMsg + temp + '未分解拨款节点<br/>'
            resultMsg = resultMsg + noResolveMsg
          }

          if (noDept === 'false') {
            let noDeptMsg = '<font style="color: red">拨付场所检查项</font>:<br/>'

            noDeptMsg = noDeptMsg + temp + '有节点未关联院内场所或者外协单位<br/>'
            resultMsg = resultMsg + noDeptMsg
          }

          if (otherDeptNoNode === 'true') {
            let otherDeptNoNodeMsg = '<font style="color: red">单位未分解检查项</font>:<br/>'

            otherDeptNoNodeMsg = otherDeptNoNodeMsg + temp + '有单位未分解拨款节点<br/>'
            resultMsg = resultMsg + otherDeptNoNodeMsg
          }

          /// //////////////////////////////////////////////////////////拨款节点为0检查项//////////////////////////////////////////////////////////////////////////////////////

          let payNoResolveList = res[0].payNoResolveList

          if (payNoResolveList && payNoResolveList.length > 0) {
            let payNoResolveListMsg = '<font style="color: red">拨款节点非空校验检查项</font>:<br/>'

            for (let i = 0; i < payNoResolveList.length; i++) {
              let name = payNoResolveList[i].name
              payNoResolveListMsg = payNoResolveListMsg + temp + name + '<br/>'
            }
            payNoResolveListMsg = payNoResolveListMsg + temp + '以上节点值为空<br/>'
            resultMsg = resultMsg + payNoResolveListMsg
          }

          /// //////////////////////////////////////////////////////////金额检查//////////////////////////////////////////////////////////////////////////////////////

          let moneyCheckObj = res[0].moneyCheck

          if (moneyCheckObj && moneyCheckObj.length > 0) {
            let checkMoneyMsg = '<font style="color: red">科目金额检查项</font>:<br/>'

            for (let i = 0; i < moneyCheckObj.length; i++) {
              let parentName = moneyCheckObj[i].parentName
              let name = moneyCheckObj[i].name
              checkMoneyMsg = checkMoneyMsg + temp + '[' + parentName + ']:' + name + '<br/>'
            }
            checkMoneyMsg = checkMoneyMsg + temp + '以上科目与年度预算金额不相等<br/>'
            resultMsg = resultMsg + checkMoneyMsg
          }

          /// ////////////////////////////////////////多个年度金额检查//////////////////////////////////////////////////////////////////////////////////////////////

          let manyYearObj = res[0].taskManyYear

          if (manyYearObj && manyYearObj.length > 0) {
            let manyYearMsg = '<font style="color: red">年度预算检查项</font>:<br/>'

            for (let i = 0; i < manyYearObj.length; i++) {
              let name = manyYearObj[i].name
              manyYearMsg = manyYearMsg + temp + name + '<br/>'
            }
            manyYearMsg = manyYearMsg + temp + '以上科目有多个年度预算<br/>'
            resultMsg = resultMsg + manyYearMsg
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
            that.$confirm(`确认要提交二级经费编制吗?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              that.$api['collectionBudget.updateProjectRevenueInfoComeIn']({ ...this.thirdMenuParam, tempType: 'secondPay' }).then(res => {
                if (res && res === 'true') {
                  that.getRevenueStatus()
                  that.queryList()
                } else {
                  that.$message(
                    {
                      message: '提交失败！',
                      type: 'error'
                    }
                  )
                }
              })
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
    },
    isShowMenu (row, rowType) {
      let result = false
      let otherDeptTask = '270402'
      let planType = row.planType
      let dictId = row.dictId
      let classify = row.classify
      let isClassifyRoot = row.isClassifyRoot
      let dataFromType = row.dataFromType
      if (dataFromType !== 1) { // 除过初始化过的节点
        if (planType && planType === 'dept') {
          if (rowType === 'task' || rowType === 'delete') {
            result = true
          }
        } else if (planType && planType === 'task') {
          if (rowType === 'delete') {
            result = true
          }
        }
      } else if (classify === 'SECOND_MOVE') {
        if (isClassifyRoot && isClassifyRoot === 1) {
          if (rowType === 'dept') {
            result = true
          }
        }
      }

      if (classify && classify === 'CURRENT_PAY') {
        if (dictId && dictId === otherDeptTask) {
          if (rowType === 'otherDept') {
            result = true
          }
        } else {
          if (!(isClassifyRoot && isClassifyRoot === 1)) {
            if (rowType === 'create' && dataFromType === 1) {
              result = true
            }
          }

          if (dataFromType !== 1) {
            if (rowType === 'delete') {
              result = true
            }
          }
        }

        if (planType === 'otherDept') {
          if (rowType === 'otherDeptTask' || rowType === 'delete') {
            result = true
          }
        }
      }

      return result
    }
  }
}
</script>
