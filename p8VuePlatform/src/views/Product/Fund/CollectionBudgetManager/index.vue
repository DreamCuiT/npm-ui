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
                 @click="submitChangedReason('collection')">预算变更</el-button>
      <el-button v-if="isContractChange()"
                 type="primary"
                 round
                 @click="submitAdjustReason()">同步合同
      </el-button>
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

              <template v-if="item.prop == 'tableSetting'&&isCanEdit()&&scope.row.type === '1002'">
                <el-dropdown trigger="click"
                             :hide-on-click="false">
                  <span class="el-dropdown-link">
                    <i class="el-icon-s-tools"
                       style="cursor: pointer;color:#2196F3"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if=" !scope.row.parentId">
                      <div @click="createBudgetData(scope.row,item)"><i class="p8 icon-new-subordinate"></i>新建下级</div>
                    </el-dropdown-item>
                    <el-dropdown-item v-if=" scope.row.parentId">
                      <div @click="deleteBudgetData(scope.row,item)"><i class="p8 icon-delete"></i>删除</div>
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
      </div>
      <collection-change v-if="collectionChangeDialog"
                         :visible="collectionChangeDialog"
                         :otherParam="otherParam"
                         :allcyYear="allcyYear"
                         :changeType="changeType"
                         :dialogTitle="dialogTitle"
                         :contractYear="contractYear"
                         :mapCreateDataSize="mapCreateDataSize"
                         :contractChangeSize="contractChangeSize"
                         @close-dialog='onCollectionChangeClose'></collection-change>
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
import { Button, Table, TableColumn, Dropdown, DropdownMenu, DropdownItem, Input, InputNumber, Tooltip } from '~/index'
import CollectionChange from './Components/collectionChange'
import moment from 'moment'
const mh = document.documentElement.clientHeight - 165
export default {
  name: 'CollectionBudgetManager',
  components: {
    ListLayout,
    CollectionChange,
    'el-button': Button,
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
      tableDataTemp: [],
      isListLoading: false, // 列表加载
      comp: this,
      revenueStatus: '',
      isAdJust: '',
      searchData: [],
      allcyYear: [],
      contractYear: [],
      mapCreateDataSize: 0,
      contractChangeSize: 0,
      dialogTitle: '',
      expandRowKeys: [],
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
      collectionChangeDialog: false,
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
    columnStyle ({ row, column, rowIndex, columnIndex }) {
      if (row.children && row.children.length > 0) {
        return 'font-weight: 900;'
      }
    },
    initData () {
      if (this.$route.name === 'collectionBudgetManager') {
        this.initColumns()
        this.queryList()
      }
    },
    initColumns () {
      let that = this
      const columns = [
        {
          label: '状态',
          type: 'index',
          prop: 'status',
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
        }

      ]
      that.$api['collectionBudget.getYearNode'](this.thirdMenuParam).then(res => {
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
      this.comeInRevnueChangedNum()
    },
    setItemKeyTemp (item) {
      item.key = item.id
      let that = this

      if (item.children && item.children.length > 0) {
        item.children.map(function (subItem, idx) {
          that.setItemKeyTemp(subItem)
        })
      }
    },
    setItemKey (item) {
      let that = this
      if (item.type && item.type === '1002') {
        item.key = item.id
        if (!item.parentId) {
          that.tableData.push(item)
          that.expandRowKeys.push(item.id)
        }

        if (item.children && item.children.length > 0) {
          item.children.map(function (subItem, idx) {
            that.setItemKey(subItem)
          })
        }
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
    comeInRevnueChangedNum () {
      let that = this
      that.$api['collectionBudget.comeInRevnueChangedNum'](this.thirdMenuParam).then(function (res) {
        if (res) {
          that.isAdJust = res.isAdJust
          that.allcyYear = res.allcyYear
          that.contractYear = res.contractYears
          that.mapCreateDataSize = res.mapCreateDataSize
          that.contractChangeSize = res.contractChangeSize
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    isCanEdit () {
      return this.revenueStatus === '4506'
    },
    isCanChange () {
      return false
      // return this.revenueStatus === '4526'
    },
    isContractChange () {
      return this.revenueStatus !== '4526' && this.isAdJust === 'true'
    },
    isRevenueChange () {
      return this.revenueStatus === '4526'
    },
    queryList (message, msgType) {
      const that = this
      this.isListLoading = true

      this.tableRefresh(new Promise((resolve, reject) => {
        if (that.tableApi) {
          that.$api[that.tableApi](this.thirdMenuParam).then(function (res) {
            that.isListLoading = false
            that.tableData = []
            let data = generateTree(res.records ? res.records : res, 'parentId')
            let dataTemp = generateTree(res.records ? res.records : res, 'parentId')

            if (data && data.length > 0) {
              data.forEach(function (item, idx) {
                that.setItemKey(item)
              })
            }
            if (dataTemp && dataTemp.length > 0) {
              dataTemp.forEach(function (item, idx) {
                that.setItemKeyTemp(item)
              })
            }

            that.tableDataTemp = dataTemp

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
      var cell = prop + '-Id'
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
      let parentId = row.parentId
      let type = row.type
      let result = true
      if (!parentId) {
        result = false
      }
      if (result && this.isCanEdit() && type && type === '1002') {
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
    createBudgetData (record, item) {
      let that = this
      let type = 'success'
      let msg = '保存成功！'
      that.$api['collectionBudget.createBudgetData']({ parentId: record.id, revenueName: '新节点', revenueInfoId: this.thirdMenuParam.revenueInfoId, wholeDescribeId: this.thirdMenuParam.wholeDescribeId }).then(res => {
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
    },
    updateBudgetData (params) {
      let that = this
      that.$api['collectionBudget.updateBudgetData'](params).then(res => {
        if (res && res === 'true') {
          that.queryList()
        }
      })
    },
    submitAdjustReason () {
      this.collectionChangeDialog = true
      this.otherParam = Object.assign({}, this.thirdMenuParam)
      this.dialogTitle = '同步合同'
    },
    submitChangedReason (type) {
      this.changeType = type
      let historyColumns = JSON.stringify(this.columns)
      let historyData = JSON.stringify(this.tableDataTemp)
      this.otherParam = Object.assign({}, this.thirdMenuParam)
      this.otherParam.historyData = historyData
      this.otherParam.historyColumns = historyColumns
      this.collectionChangeDialog = true
      this.dialogTitle = '收款预算变更'
    },
    onCollectionChangeClose () {
      this.collectionChangeDialog = false
      this.dialogTitle = ''
      this.otherParam = Object.assign({}, this.thirdMenuParam)
      this.initColumns()
      this.queryList()
    },
    deleteBudgetData (record, item) {
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
          that.$api['collectionBudget.deleteBudgetData']({ id: record.id }).then(res => {
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
      let type = 'success'
      let msg = '提交成功！'
      that.$api['collectionBudget.comeInValidateInfo'](this.thirdMenuParam).then(res => {
        if (res) {
          let resultMsg = ''
          let temp = '&#12288;&#12288;'
          /// //////////////////////////////////////////////////////////金额检查//////////////////////////////////////////////////////////////////////////////////////

          let manyYearObj = res.manyYear
          let noResolveObj = res.noResolve

          /// ////////////////////////////////////////多个年度金额检查//////////////////////////////////////////////////////////////////////////////////////////////

          if (manyYearObj && manyYearObj.length > 0) {
            let manyYearMsg = '<font style="color: red">年度预算检查项</font>:<br/>'

            for (let i = 0; i < manyYearObj.length; i++) {
              let name = manyYearObj[i].name
              manyYearMsg = manyYearMsg + temp + name + '<br/>'
            }
            manyYearMsg = manyYearMsg + temp + '以上收款节点有多个年度预算<br/>'
            resultMsg = resultMsg + manyYearMsg
          }
          /// ////////////////////////////////////////未分解//////////////////////////////////////////////////////////////////////////////////////////////

          if (noResolveObj && noResolveObj.length > 0) {
            let noResolveMsg = '<font style="color: red">未分解检查项</font>:<br/>'

            for (let i = 0; i < noResolveObj.length; i++) {
              let name = noResolveObj[i].name
              noResolveMsg = noResolveMsg + temp + name + '<br/>'
            }
            noResolveMsg = noResolveMsg + temp + '以上收款未分解年度预算<br/>'
            resultMsg = resultMsg + noResolveMsg
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
            that.$confirm(`确认要提交收款预算吗`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              that.$api['collectionBudget.updateProjectRevenueInfoComeIn']({ ...this.thirdMenuParam, tempType: 'come' }).then(res => {
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
