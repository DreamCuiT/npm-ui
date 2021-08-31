<template>
  <normal-layout :normalLayout="layoutConfig">
    <template #north>
      <el-row class="planListOperation">
        <!-- <el-col :span="12" class="planListOperation"> -->
          <el-button type="primary" @click="connectTask()">关联院计划</el-button>
          <el-button type="primary" @click="disConnectTask()">取消关联</el-button>
          <el-button type="primary" @click="addYTask()">添加院计划</el-button>
          <el-button type="primary" @click="deleteYTask()">删除院计划</el-button>
          <el-dropdown split-button type="primary" @click="setAsssessmentPlan">
            所计划
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="cancelAsssessmentPlan">取消所计划</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <label style="float:right;">关联查询
            <el-select v-model="isConnectYtask" style="width:100px;" @change="planConnectSearch">
              <el-option label="已关联" value="1"></el-option>
              <el-option label="未关联" value="0"></el-option>
            </el-select>
          </label> -->
        <!-- </el-col>
        <el-col :span="12"> -->
          <!-- <label style="float:right;">关联查询
            <el-select v-model="isConnectTask" style="width:100px;" @change="yplanConnectSearch">
              <el-option label="已关联" value="1"></el-option>
              <el-option label="未关联" value="0"></el-option>
            </el-select>
          </label> -->
        <!-- </el-col> -->
      </el-row>
    </template>
    <template #center>
      <task-Index ref="taskIndex" :planId = "planId" :planTaskId="taskId"  @rowClick="layBack" ></task-Index>
    </template>
    <template #west>
      <common-table class="planList"
                    ref="table"
                    :api="tableApi"
                    :columns="columns"
                    :params="tableOtherParams"
                    :tableConfig="tableConfig"
                    :isStripe="false"
                    :pagination="false"
                    :useTreeFormat="true"
                    :useTreePId="parentId"
                    :table-refresh='tableRefresh'
                    :rowClassNameCalc="rowClassNameCalc"
                    @row-click='rowClick'
                    @requested-table-data="requestedTableData">
        <template #monitorpoint='{scope}'>
          <i class="p8 icon-courtyard-plan" v-if="scope.row.ytaskId" :class="{'connectRow': scope.row.connectStatus}"></i>
          <i class="p8 icon-assessment-plan" v-if="scope.row.ytaskId || (scope.row.staskId && scope.row.staskId !== '0')"></i>
        </template>
        <template #overdue='{scope}'>
          <div v-html="overdueTextHandle(scope.row.status, scope.row.planEndDate, scope.row.realEndDate)"></div>
        </template>
      </common-table>
    </template>
  </normal-layout>
</template>
<script>
  import { P8NormalLayout as NormalLayout } from '~/index'
  import { P8Table as CommonTable } from '~/index'
  import { getTaskStatusInfo } from './commonBusinessJs'
  import TaskIndex from './ganttIndex'
  import moment from 'moment'
  import Vue from 'vue'
  import { Row, Button } from '~/index'
  export default {
    name: 'Test',
    components: {
      NormalLayout,
      TaskIndex,
      CommonTable,
      'el-button': Button,
      'el-row': Row
      // 'el-col': Col
      // 'el-select': Select,
      // 'el-option': Option
    },
    props: {
      businessId: {
        type: String,
        default: ''
      },
      planInfoId: {
        type: String,
        default: ''
      },
      planId: {
        type: String,
        default: ''
      }
    },
    watch: {
      taskIds (val) {
        if (val) {
          let taskIssArr = val.split(',')
          if (taskIssArr.length) {
            this.toggleSelectRow(this.tableDataAll, taskIssArr)
          }
        } else {
          // this.$refs.table.$refs.table.setCurrentRow()
        }
      }
    },
    data () {
      const columns = [
        {
          title: '院所考核',
          dataIndex: 'monitorpoint',
          type: 'index',
          width: 70,
          align: 'center',
          scopedSlots: {
            customRender: 'custom'
          }
        },
        {
          title: 'LP项目/计划',
          dataIndex: 'name',
          minWidth: 300,
          filterable: false, // 列上增加输入框搜索
          iconDisplay: false, // 表头点击搜索图标，出现搜索条件
          filter: {
            val: '',
            type: 'text'
          },
          formatter: function (row) {
            if (row.name) {
              return row.name
            } else {
              return row.dataType === 'plan' ? '项目' : row.dataType === 'task' ? '任务' : ''
            }
          }
        },
        // {
        //   title: '计划状态',
        //   dataIndex: 'planStatus',
        //   width: 95,
        //   align: 'center'
        // },
        {
          title: '责任人',
          dataIndex: 'realName',
          width: 100,
          align: 'center',
          filterable: false, // 列上增加输入框搜索
          iconDisplay: false, // 表头点击搜索图标，出现搜索条件
          filter: {
            val: '',
            type: 'text'
          }
        },
        {
          title: '角色',
          dataIndex: 'roleName',
          width: 100,
          align: 'center',
          filterable: false, // 列上增加输入框搜索
          iconDisplay: false, // 表头点击搜索图标，出现搜索条件
          filter: {
            val: '',
            type: 'text'
          }
        },
        {
          title: '部门',
          dataIndex: 'deptName',
          width: 150,
          formatter: function (row) {
            if (row.dname) {
              return row.dname + '-' + row.deptName
            } else {
              return row.deptName
            }
          },
          align: 'center',
          filterable: false, // 列上增加输入框搜索
          iconDisplay: false, // 表头点击搜索图标，出现搜索条件
          filter: {
            val: '',
            type: 'text'
          }
        },
        {
          title: '计划开始时间',
          dataIndex: 'planBeginDate',
          width: 120,
          align: 'center'
        },
        {
          title: '计划完成时间',
          dataIndex: 'planEndDate',
          width: 120,
          align: 'center'
        },
        // {
        //   title: '完成情况',
        //   dataIndex: 'status',
        //   width: 100,
        //   formatter: (row) => {
        //     let currStatus = this.allStatus.filter(item => item.value === row.status)
        //     if (row.dataType === 'task' && currStatus.length) {
        //       return `${row.managerStatusDisplay},${currStatus[0].label}`
        //     }
        //   },
        //   align: 'center'
        // },
        // {
        //   title: '完成百分比',
        //   dataIndex: 'progress',
        //   width: 100,
        //   align: 'center',
        //   formatter: function (row) {
        //     if (row.dataType === 'task') {
        //       return (row.progress * 100).toFixed(0) + '%'
        //     }
        //   }
        // },
        {
          title: '超期/剩余天数',
          dataIndex: 'overdue',
          width: 100,
          scopedSlots: {
            customRender: 'custom'
          },
          align: 'center'
        },
        {
          title: '预测开始时间',
          dataIndex: 'forecastBeginDate',
          width: 120,
          align: 'center'
        },
        {
          title: '预测完成时间',
          dataIndex: 'forecastEndDate',
          width: 120,
          align: 'center'
        },
        {
          title: '院计划开始时间',
          dataIndex: 'avBeginDate',
          width: 120,
          align: 'center'
        },
        {
          title: '院计划结束时间',
          dataIndex: 'avEndDate',
          width: 120,
          align: 'center',
          formatter: function (row) {
            if (row.avEndDate) {
              return moment(new Date(row.avEndDate)).subtract(1, 'days').format('YYYY-MM-DD')
            }
          }
        },
        {
          title: '院计划数量',
          dataIndex: 'num',
          width: 100,
          align: 'center'
        },
        // {
        //   title: '批次号',
        //   dataIndex: 'batchNumber',
        //   width: 120,
        //   align: 'center'
        // },
        // {
        //   title: '图号',
        //   dataIndex: 'mapCode',
        //   width: 120,
        //   align: 'center'
        // },
        // {
        //   title: '产品代号',
        //   dataIndex: 'productCode',
        //   width: 120,
        //   align: 'center'
        // },
        {
          title: '实际开始时间',
          dataIndex: 'realBeginDate',
          width: 120,
          align: 'center'
        },
        {
          title: '实际完成时间',
          dataIndex: 'realEndDate',
          width: 120,
          align: 'center'
        }
      ]
      return {
        visible: false,
        tableApi: 'WorkStatistics.taskListDataByBId',
        columns,
        parentId: 'parentId',
        layTaskId: '',
        layTaskParentId: '',
        taskIds: '',
        planTaskId: '',
        taskId: '',
        planTaskName: '',
        planTaskEndDate: null,
        tableOtherParams: { planInfoId: this.planInfoId },
        tableConfig: {
          defaultExpandAllRows: true,
          scroll: { x: 1300 },
          expandIconColumnIndex: 6,
          'default-expand-all': true,
          'highlight-current-row': true
        },
        planInfo: {},
        drawerConfig: {
          modal: false
        },
        layoutConfig: {
          west: {
            xs: 12, sm: 12, md: 12, lg: 12, xl: 12
          },
          center: {
            xs: 12, sm: 12, md: 12, lg: 12, xl: 12
          }
        },
        allStatus: [],
        tableDataAll: [],
        multipleSelection: [],
        isCtrl: false,
        selectRow: {}, // 设置所考核计划
        isConnectYtask: '', // 任务是否关联院任务
        isConnectTask: '' // 院任务是否关联任务
      }
    },
    mounted () {
      var isWin = (navigator.platform === 'Win32') || (navigator.platform === 'Windows')
      var isMac = (navigator.platform === 'Mac68K') || (navigator.platform === 'MacPPC') || (navigator.platform === 'Macintosh') || (navigator.platform === 'MacIntel')
      document.addEventListener('keydown', e => {
      if ((e.keyCode === 17 && isWin) || (e.keyCode === 91 && isMac)) {
          this.isCtrl = true
          }
      })
      document.addEventListener('keyup', e => {
      if ((e.keyCode === 17 && isWin) || (e.keyCode === 91 && isMac)) {
          this.isCtrl = false
        }
      })

      this.getAllStatusOptions()
      let _this = this
      this.$bus.$on('refresh', function () {
        Vue.nextTick(function () {
          _this.$refs.table.searchData()
        })
      })
    },
    methods: {
      // // 任务是否关联院任务
      // planConnectSearch (val) {
      //   this.tableOtherParams = { ...this.tableOtherParams, ...{ isConnectYtask: val } }
      // },
      // // 院任务是否关联任务
      // yplanConnectSearch (val) {
      //   this.tableOtherParams = { ...this.tableOtherParams, ...{ isConnectTask: val } }
      // },
      // 设置关联任务背景色（绿色）
      rowClassNameCalc (obj) {
        let property = obj.row
        if (property && property.ytaskId) {
          return 'relationRow'
        }
        if (property && this.multipleSelection.some(i => { return i.id === property.id })) {
          return 'current-row'
        }
      },
      // 设置所考核计划标识
      setAsssessmentPlan () {
        if (this.selectRow.parentId) {
          let _this = this
          if (Object.keys(this.selectRow).length) {
            this.$api['courtyardPlanManager.connectClassTaskTwo']({
              taskIds: this.multipleSelection.map(i => i.id)
            }).then(function (res) {
              // _this.selectRow.staskId = '1'
              _this.$refs.table.searchData()
            })
          } else {
            this.$message({
              type: 'info',
              message: '请选择一条任务'
            })
          }
        } else {
            this.$message({
            type: 'error',
            message: '根任务不可标记所计划！'
          })
        }
      },
      // 取消所考核计划标识
      cancelAsssessmentPlan () {
        let _this = this
        if (Object.keys(this.selectRow).length) {
          this.$api['courtyardPlanManager.disConnectClassTaskTwo']({
            taskIds: this.multipleSelection.map(i => i.id)
          }).then(function (res) {
            // _this.selectRow.staskId = '0'
            _this.$refs.table.searchData()
          })
        } else {
          this.$message({
            type: 'info',
            message: '请选择一条任务'
          })
        }
      },
      toggleSelectRow (data, keyArr) {
        data.forEach(item => {
          if (item.children && item.children.length) {
            if (keyArr.includes(item.id)) {
              item.connectStatus = true
            } else {
              item.connectStatus = false
            }
            this.toggleSelectRow(item.children, keyArr)
          } else {
            if (keyArr.includes(item.id)) {
              item.connectStatus = true
            } else {
              item.connectStatus = false
            }
          }
        })
      },
      onSelect (node) {
        let that = node
        if (that.layersParams) {
          if (that.layersParams.modelId) {
            this.tableOtherParams.modelId = that.layersParams.modelId
            this.tableOtherParams.classify = that.layersParams.classifyId
            this.tableOtherParams.rootTerId = that.layersParams.rootTerId
          } else if (that.layersParams.classifyId) {
            this.tableOtherParams.classify = that.layersParams.classifyId
            this.tableOtherParams.rootTerId = that.layersParams.rootTerId
            this.tableOtherParams.modelId = ''
          } else if (that.layersParams.rootTerId) {
            this.tableOtherParams.rootTerId = that.layersParams.rootTerId
            this.tableOtherParams.classify = ''
            this.tableOtherParams.modelId = ''
          }
        }
        this.$refs.table.searchData()
      },
      connectTask () {
        if (this.selectRow.parentId && this.layTaskParentId) {
          let _this = this
          if (this.planTaskId && this.layTaskId) {
            _this.$api['courtyardPlanManager.connectTask']({
              taskId: this.planTaskId,
              avTaskId: this.layTaskId,
              avTaskName: this.planTaskName
            }).then(function (res) {
              _this.$refs.table.searchData()
              _this.$refs.taskIndex.refreshTableData()
            })
          }
        } else {
            this.$message({
            type: 'error',
            message: '根任务不可关联！'
          })
        }
      },
      addYTask () {
        let _this = this
        if (this.planTaskId && this.layTaskId) {
            _this.$api['courtyardPlanManager.createTaskByAvTASK']({
              taskId: this.planTaskId,
              avTaskId: this.layTaskId
            }).then(function (res) {
              _this.$refs.table.searchData()
              _this.$refs.taskIndex.refreshTableData()
            })
          } else {
          _this.$message({
            type: 'success',
            message: '请选择一条任务'
          })
        }
      },
      deleteYTask () {
        let _this = this
        if (this.planTaskId) {
          _this.$api['courtyardPlanManager.deleteTaskByAvTASK']({
            taskId: this.planTaskId,
            avTaskId: this.layTaskId
          }).then(function (res) {
            _this.$refs.table.searchData()
            _this.$refs.taskIndex.refreshTableData()
          })
        } else {
          _this.$message({
            type: 'success',
            message: '请选择一条任务'
          })
        }
      },
      disConnectTask () {
        let _this = this
        if (this.planTaskId) {
          _this.$api['courtyardPlanManager.disConnectTask']({ taskId: this.planTaskId
          }).then(function (res) {
            _this.$refs.table.searchData()
            _this.$refs.taskIndex.refreshTableData()
          })
        } else {
          _this.$message({
            type: 'success',
            message: '请选择一条任务'
          })
        }
      },
      layBack (row) {
        this.layTaskParentId = row.parentId
        this.layTaskId = row.id
        this.taskIds = row.taskIds
        this.planTaskName = row.name
      },
      rowClick (row) {
        this.taskId = row.ytaskId
        this.planTaskId = row.id
        this.selectRow = row
        this.toggleSelectRowIcon(this.tableDataAll, row.id)
        if (this.isCtrl) {
            // list -- 已选的数据
            let index = this.multipleSelection.findIndex((item) => {
            // 判断已选数组中是否已存在该条数据
              return item.id === row.id
            })
            if (index === -1) {
              this.multipleSelection.push(row)
            } else {
              this.multipleSelection.splice(index, 1)
            }
            this.$refs.table.$refs.table.setCurrentRow()
        } else {
          this.multipleSelection = [row]
        }
        console.log('xuanzhong', this.multipleSelection)
      },
      toggleSelectRowIcon (data, key) {
        data.forEach(item => {
          if (item.children && item.children.length) {
            if (item.id === key) {
              item.connectStatus = true
            } else {
              item.connectStatus = false
            }
            this.toggleSelectRowIcon(item.children, key)
          } else {
            if (item.id === key) {
              item.connectStatus = true
            } else {
              item.connectStatus = false
            }
          }
        })
      },
      search (param) {
        console.log(this.tableOtherParams)
        let newParams = { ...param, ...(this.tableOtherParams.id ? { id: this.tableOtherParams.id } : {}) } // 项目类别ID
        this.tableOtherParams = newParams
        let _this = this
        Vue.nextTick(function () {
          _this.$refs.table.searchData()
        })
      },
      reset () {
        let kprojectClassifyId // 项目类别ID
        if (this.tableOtherParams.kprojectClassifyId) {
          kprojectClassifyId = this.tableOtherParams.kprojectClassifyId
        }
        let that = this
        Object.keys(that.tableOtherParams).forEach(function (key) { return (that.tableOtherParams[key] = '') })
        if (kprojectClassifyId) {
          this.tableOtherParams.kprojectClassifyId = kprojectClassifyId
        }
        let _this = this
        Vue.nextTick(function () {
          _this.$refs.table.searchData()
        })
      },
      tableRefresh (param) {
        param.then(() => {
          console.log('异步成功后端做的操作')
        }).catch(() => {
          console.log('异步失败的操作')
        })
      },
      requestedTableData (tableData) {
        this.tableDataAll = tableData
        if (Object.keys(this.planInfo).length) {
          const _this = this
          let filterItem = null
          tableData.forEach(item => {
            filterItem = item.children.filter(citem => citem.id === _this.planInfo.id)
          })
          console.log('requestedTableData', filterItem)
          if (filterItem) {
            _this.planInfo = { allStatus: this.allStatus, ...filterItem[0], progress: filterItem[0].progress * 100 }
          }
        }
      },
      getAllStatusOptions () {
        let _this = this
        getTaskStatusInfo({ currentStatus: 'all' }).then(data => {
          _this.allStatus = data
          if (_this.searchData) {
            let multipleData = _this.searchData.filter(item => item.type === 'multiple')
            multipleData[0].options = data
            console.log(data, 'data1')
          }
        })
        // 加载通用gantt操作权限决策，并存入vuex
        _this.$api['planInfoManager.loadPlanStatusLimitStrategy']().then(function (res) {
          console.log(res, 'res1')
          if (res) {
            _this.$store.dispatch('setPlanStatusLockMap', res['plan'])
            _this.$store.dispatch('setTaskStatusLockMap', res['task'])
          }
        })
      },
      overdueTextHandle (currStatus, planEndDate, realEndDate) {
        if (!currStatus) {
          return ''
        }
        let currDate = realEndDate || moment().format('YYYY-MM-DD')
        let diffDays = Math.abs(moment(planEndDate).diff(moment(currDate), 'days'))
        let text = ''
        if (currStatus === '6700') {
          // 已完成
          if (moment(currDate).isAfter(moment(planEndDate))) {
            text = `<span style="color: #F80012">超期${diffDays}天完成</span>`
          } else if (diffDays === 0) {
            text = `<span style="color: #1892FF">当天完成</span>`
          } else {
            text = `<span style="color: #1892FF">提前${diffDays}天完成</span>`
          }
        } else {
          if (moment(currDate).isAfter(moment(planEndDate))) {
            text = `<span style="color: #F80012">超期${diffDays}天</span>`
          } else {
            text = `<span style="color: #1BBF9E">剩余${diffDays}天</span>`
          }
        }
        return text
      },
      withdrawTaskApprove (rowInfo) {
        let taskId = rowInfo.taskId
        const url = 'taskManager.withdrawTaskApprove'
        const _this = this
        _this.$confirm('是否要撤回审批', '提示', {
          confirmButtonText: '撤回',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$api[url]({ taskId: taskId }).then(res => {
            _this.$message({
              type: 'success',
              message: '审批已撤回'
            })
            Vue.nextTick(function () {
              _this.$refs.table.searchData()
            })
          })
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  /deep/ .custom-drawer {
    background-color: #FAFBFF;
    .el-drawer__close-btn {
      z-index: 10;
    }
  }
  .base-custom-style {
    color: $base-white-color;
    padding: 0 2px;
    font-size: 12px;
    border-radius: 10px;
    cursor: pointer;
    &.approve {
      background-color: $base-red-color
    }
    &.leaf {
      background-color: $base-green-color
    }
  }
  .connectRow{
    color: #F87500;
  }
</style>

<style lang="scss">
.planList{
  .el-table .el-table__body tr.relationRow td{
    background-color:#CCE69D;
  }
}
.planListOperation{
  .el-dropdown{
    margin-left:10px;
    // .el-button--small{
    //   padding-top:5px;

    //   &.el-dropdown__caret-button{
    //     padding-top:9px;
    //   }
    // }
  }
}
</style>
