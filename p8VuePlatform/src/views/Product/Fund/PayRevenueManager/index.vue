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
        <i class="el-icon-plus"></i>添加拨款节点</el-tag>
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
                        placement="right"
                        v-if="scope.row.status">
              <div slot="content">
                <p v-html="statusDisplay(scope.row)"></p>
              </div>
              <i class="icon-filled-circle p8"
                 :style="statusColor(scope.row.status)">
              </i>
            </el-tooltip>
          </template>
          <template #statusDisplay="{scope}">
            <span v-if="scope.row.status">{{ revenuePayStatusObj[scope.row.status] }}</span>
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
      tableApi: 'PayRevenue.payYearBudgetsList',
      columns: [
        {
          title: '',
          type: 'index',
          align: 'center',
          scopedSlots: { customRender: 'custom' },
          dataIndex: 'status'
        },
        {
          title: '序号',
          type: 'index'
        },
        {
          title: '拨付单位',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '项目节点',
          align: 'center',
          dataIndex: 'revenueName'
        },
        {
          title: '金额(万元)',
          align: 'center',
          dataIndex: 'money'
        },
        {
          title: '状态',
          align: 'center',
          scopedSlots: { customRender: 'custom' },
          dataIndex: 'statusDisplay'
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: { customRender: 'custom' },
          dataIndex: 'tableSet'
        }
      ],
      comp: this,
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
      revenuePayStatusObj: {
        8000: '已关联',
        8003: '待拨付,排队等待',
        8005: '待拨付,排队等待',
        8007: '已拨付'
      },
      queryParam: {},
      otherParam: {}
    }
  },
  created () {
    this.revenueInfoId = this.thirdMenuParam.revenueInfoId
    this.wholeDescribeId = this.thirdMenuParam.wholeDescribeId
    this.queryParam = Object.assign({}, this.thirdMenuParam)
    this.payYearBudgetsList()
  },
  mounted () {
  },
  computed: {
    statusColor () {
      return function (status) {
        if (status === '8007') {
          return 'cursor: pointer;color:#1bbf9e'
        } else {
          return 'cursor: pointer;color:#d4d4d4'
        }
      }
    }
  },
  methods: {
    statusDisplay (row) {
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
    payYearBudgetsList () {
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
          that.queryParam.revenueYearInfoId = res.revenueYearInfoId
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
        that.disabledRow.push(item.taskId)
      })

      that.addRevenueVisible = true
    },
    addRevenueClose (selectedRows) {
      let that = this
      selectedRows.map(item => {
        let row = {}

        row.name = item.deptName
        row.revenueName = item.revenueName

        row.money = item.revenueMoney || 0

        row.taskId = item.id
        row.taskName = item.taskName
        row.deptId = item.deptId
        row.revenueBudgetId = item.revenueId
        row.planType = item.revenuePlanType

        row.wholeDescribeId = that.wholeDescribeId
        row.yearRevenueInfoId = that.revenueYearInfoId
        row.taskStatus = item.taskStatus
        row.status = item.status
        row.taskName = item.taskName
        row.endDate = item.endDate
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
          that.$api['PayRevenue.saveOrUpdatePayData']({ type: tag, revenueYearInfoId: that.revenueYearInfoId, revenueYearBudgetsList: trRow }).then((res) => {
            if (res && res === 'true') {
              that.payYearBudgetsList()
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
        that.$api['PayRevenue.saveOrUpdatePayData']({ type: tag, revenueYearInfoId: that.revenueYearInfoId, revenueYearBudgetsList: trRow }).then((res) => {
          if (res && res === 'true') {
            that.payYearBudgetsList()
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
      this.otherParam.changeFrom = 'pay'
      this.otherParam.changeTitle = '支出预算编制变更'
    },
    editChangeClose () {
      this.editChangeDialog = false
    },
    editChangeCallback () {
      this.editChangeDialog = false
      this.payYearBudgetsList()
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
        that.$api['PayRevenue.carryPayOver']({ revenueYearInfoId: that.revenueYearInfoId }).then((res) => {
          if (res && res === 'true') {
            this.payYearBudgetsList()
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
        that.$api['PayRevenue.showBack']({ revenueYearInfoId: that.revenueYearInfoId, value: 'pay' }).then((res) => {
          if (res && res === 'true') {
            this.payYearBudgetsList()
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
