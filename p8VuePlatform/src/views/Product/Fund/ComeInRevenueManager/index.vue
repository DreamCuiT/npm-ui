<template>
  <list-layout>
    <template #north>
      <el-button v-if="pageView==='edit'"
                 type="primary"
                 round
                 @click="submitRevenue('1')">提交</el-button>
      <el-button v-if="pageView==='edit'"
                 type="primary"
                 round
                 @click="submitRevenue('0')">保存</el-button>
      <el-button v-if="isShowChanged&&isShowChanged==='yes'"
                 type="primary"
                 round
                 @click="changedSubmit()">变更</el-button>
      <el-button v-if="isShowCarryOver&&isShowCarryOver==='yes'"
                 type="primary"
                 round
                 @click="carryOver()">结转</el-button>
      <el-button v-if="showBack&&showBack==='yes'"
                 type="primary"
                 round
                 @click="showBackRevenue()">收回</el-button>
      <el-tag v-if="pageView==='edit'"
              size="medium"
              style="cursor: pointer;margin-left: 20px;"
              @click="addRevenueNode()">
        <i class="el-icon-plus"></i>添加收款节点</el-tag>
      <div style="float: right;">
        <el-tag> {{ years }} 年</el-tag>
      </div>
    </template>
    <template #center>
      <div id="table-contain">

        <common-table ref="table"
                      :comp="comp"
                      :columns="columns"
                      :params="queryParam"
                      :noApiTableData="noApiTableData"
                      :table-Refresh="tableRefresh"
                      :pagination="false">
          <template #tableSet="{scope}">
            <el-button v-if="pageView==='edit'"
                       size="
                       mini"
                       style="cursor: pointer"
                       type="danger"
                       @click="handleDelete(scope.$index,scope.row)"><i class="el-icon-delete"></i></el-button>
          </template>
          <template #status="{scope}">
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
        </common-table>
      </div>
      <add-revenue v-if="addRevenueVisible"
                   :visible="addRevenueVisible"
                   :otherParam="queryParam"
                   @close-dialog="addRevenueClose"
                   :disabled-row="disabledRow"></add-revenue>
      <edit-change v-if="editChangeDialog"
                   :visible="editChangeDialog"
                   :otherParam="otherParam"
                   @close-modal="editChangeClose"
                   @save-success="editChangeCallback"></edit-change>
    </template>
  </list-layout>

</template>

<script>
import addRevenue from './Components/addRevenue'
import EditChange from './Components/editChange'
import { P8Table as CommonTable } from '~/index'
import { P8ListLayout as ListLayout } from '~/index'
import { Button, Tag, Tooltip } from '~/index'
import moment from 'moment'
export default {
  name: 'ComeInRevenueManager',
  components: {
    'el-button': Button,
    'el-tag': Tag,
    'el-tooltip': Tooltip,
    addRevenue,
    EditChange,
    CommonTable,
    ListLayout
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
      tableApi: 'ComeInRevenue.comeYearBudgetsList',
      comp: this,
      columns: [],
      revenueInfoId: '',
      wholeDescribeId: '',
      drawerTitle: '',
      addRevenueVisible: false,
      editChangeDialog: false,
      noApiTableData: [],
      disabledRow: [],
      years: {},
      revenueYearInfoId: '',
      pageView: '',
      showCarryOverMsg: '',
      isShowCarryOver: '',
      isShowChanged: '',
      showBack: '',
      revenueStatusObj: {
        7001: '待收款',
        7003: '收款中',
        7005: '收款完成',
        7009: '待收款'
      },
      queryParam: {},
      otherParam: {}
    }
  },
  created () {
    let that = this
    let columnsTemp = [
      {
        title: '',
        type: 'index',
        align: 'center',
        scopedSlots: { customRender: 'custom' },
        dataIndex: 'status'
      },
      {
        title: '序号',
        type: 'index',
        width: '55px',
        align: 'center'
      },
      {
        title: '项目节点',
        dataIndex: 'name',
        align: 'left'
      },
      {
        title: '金额(万元)',
        align: 'center',
        dataIndex: 'money'
      },
      {
        title: '状态',
        align: 'center',
        dataIndex: 'status',
        formatter: function (row, column, cellValue, index) {
          let result = '待收款'
          if (cellValue && cellValue !== '') result = that.revenueStatusObj[cellValue]
          return result
        }
      },
      {
        title: '操作',
        align: 'center',
        scopedSlots: { customRender: 'custom' },
        dataIndex: 'tableSet'
      }
    ]
    this.columns = columnsTemp
    this.revenueInfoId = this.thirdMenuParam.revenueInfoId
    this.wholeDescribeId = this.thirdMenuParam.wholeDescribeId
    this.queryParam = Object.assign({}, this.thirdMenuParam)
    this.comeYearBudgetsList()
  },
  mounted () {
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
        } else {
          return 'cursor: pointer;color:#d4d4d4'
        }
      }
    }
  },
  methods: {
    statusDisplay (row) {
      let status = row.status
      let nodeMoney = row.contractMoney
      let endDate = row.contractEndTime
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
    comeYearBudgetsList () {
      let that = this
      that.$api[that.tableApi](that.queryParam).then((res) => {
        if (res) {
          that.$refs.table.tableData = res.records
          that.years = res.years
          that.revenueYearInfoId = res.revenueYearInfoId
          that.pageView = res.pageView
          that.showCarryOverMsg = res.showCarryOverMsg
          that.isShowCarryOver = res.isShowCarryOver
          that.isShowChanged = res.isShowChanged
          that.showBack = res.showBack
          that.disabledRow = []
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    addRevenueNode () {
      let that = this
      that.disabledRow = []
      that.$refs.table.tableData.forEach(function (item, idx) {
        that.disabledRow.push(item.revenueBudgetId)
      })

      that.addRevenueVisible = true
    },
    addRevenueClose (selectedRows) {
      let that = this
      selectedRows.map(item => {
        let row = {}
        row.name = item.nodeName
        let allMoney = item.allMoney || 0
        let alreadyMoney = item.alreadyMoney || 0
        row.money = Number((Number(allMoney) - Number(alreadyMoney)).toFixed(4))
        row.revenueMoney = allMoney
        row.revenueBudgetId = item.id
        row.wholeDescribeId = that.wholeDescribeId
        row.yearRevenueInfoId = that.revenueYearInfoId
        row.comeMoneyData = item.comeMoneyData
        row.status = item.status
        row.contractMoney = item.contractMoney
        row.contractEndTime = item.contractEndTime
        row.nodeType = item.nodeType

        that.$refs.table.tableData.push(row)
      })
      that.addRevenueVisible = false
    },
    submitRevenue (tag) {
      let that = this
      let type = 'success'
      let msg = '保存成功！'
      let trRow = that.$refs.table.tableData
      let message = ''
      if (tag === '1') {
        if (trRow.length > 0) {
          message = '确定要提交吗?'
        } else {
          message = '无收款节点，确定要提交吗??'
        }
        that.$confirm(message, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$api['ComeInRevenue.saveOrUpdateComeInData']({ type: tag, revenueYearInfoId: that.revenueYearInfoId, revenueYearBudgetsList: trRow }).then((res) => {
            if (res && res === 'true') {
              this.comeYearBudgetsList()
            } else {
              type = 'error'
              msg = '保存失败！'
            }
          }).catch((err) => {
            type = 'error'
            msg = '保存失败！'
            console.log(err)
          })
          that.$message(
            {
              message: msg,
              type: type
            }
          )
        }).catch(() => { })
      } else {
        that.$api['ComeInRevenue.saveOrUpdateComeInData']({ type: tag, revenueYearInfoId: that.revenueYearInfoId, revenueYearBudgetsList: trRow }).then((res) => {
          if (res && res === 'true') {
            this.comeYearBudgetsList()
          } else {
            type = 'error'
            msg = '保存失败！'
          }
        }).catch((err) => {
          type = 'error'
          msg = '保存失败！'
          console.log(err)
        })
        that.$message(
          {
            message: msg,
            type: type
          }
        )
      }
    },
    handleDelete (index, row) {
      this.$refs.table.tableData.splice(index, 1)
    },
    tableRefresh (param) {
      param
        .then(() => {
          console.log('异步成功后端做的操作')
        })
        .catch(() => {
          console.log('异步失败的操作')
        })
    },
    changedSubmit () {
      this.editChangeDialog = true
      this.otherParam.revenueYearInfoId = this.revenueYearInfoId
      this.otherParam.changeFrom = 'comeIn'
      this.otherParam.changeTitle = '收款预算编制变更'
    },
    editChangeClose () {
      this.editChangeDialog = false
    },
    editChangeCallback () {
      this.editChangeDialog = false
      this.comeYearBudgetsList()
    },
    carryOver () {
      let that = this
      let type = 'success'
      let msg = '保存成功！'
      that.$confirm('结转后不可恢复，确定要结转' + that.years + '年度预算吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$api['ComeInRevenue.carryComeOver']({ revenueYearInfoId: that.revenueYearInfoId }).then((res) => {
          if (res && res === 'true') {
            this.comeYearBudgetsList()
          } else {
            type = 'error'
            msg = '保存失败！'
          }
        }).catch((err) => {
          type = 'error'
          msg = '保存失败！'
          console.log(err)
        })
        that.$message(
          {
            message: msg,
            type: type
          }
        )
      }).catch(() => { })
    },
    showBackRevenue () {
      let that = this
      let type = 'success'
      let msg = '保存成功！'
      that.$confirm('确定要收回吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$api['ComeInRevenue.showBack']({ revenueYearInfoId: that.revenueYearInfoId, value: 'comeIn' }).then((res) => {
          if (res && res === 'true') {
            this.comeYearBudgetsList()
          } else {
            type = 'error'
            msg = '保存失败！'
          }
        }).catch((err) => {
          type = 'error'
          msg = '保存失败！'
          console.log(err)
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
}
</script>
