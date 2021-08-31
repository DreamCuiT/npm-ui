<template>
  <normal-layout :normalLayout="layoutConfig">
    <template #north>
      <el-button type="primary" @click="connectTask()">关联院任务</el-button>
    </template>
    <template #west>
      <task-Index :planId = "planId"  @rowClick="layBack"></task-Index>
    </template>
    <template #center>
      <common-table ref="table"
                    :api="tableApi"
                    :columns="columns"
                    :params="tableOtherParams"
                    :tableConfig="tableConfig"
                    :pagination="true"
                    :useTreeFormat="true"
                    :useTreePId="parentId"
                    :table-refresh='tableRefresh'
                    @row-click='rowClick'
                    @requested-table-data="requestedTableData">
        <template #customIcon>
        </template>
        <template #monitorpoint='{scope}'>
          <span v-for="item in monitorpointIconHandle(scope.row)" :key="item" style="padding: 0 2px">
            <i :class="item"></i>
          </span>
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
  import { Button } from '~/index'
  export default {
    name: 'Test',
    components: {
      NormalLayout,
      TaskIndex,
      CommonTable,
      'el-button': Button
    },
    props: {
      businessId: {
        type: String,
        default: ''
      },
      planId: {
        type: String,
        default: ''
      }
    },
    data () {
      const columns = [
        {
          title: '标记',
          dataIndex: 'monitorpoint',
          type: 'index',
          width: 100,
          align: 'center',
          scopedSlots: {
            customRender: 'custom'
          }
        },
        {
          title: '项目/计划',
          dataIndex: 'name',
          fixed: 'left',
          minWidth: 300,
          formatter: function (row) {
            if (row.name) {
              return row.name
            } else {
              return row.dataType === 'plan' ? '项目' : row.dataType === 'task' ? '任务' : ''
            }
          }
        },
        {
          title: '计划状态',
          dataIndex: 'planStatus',
          width: 95,
          align: 'center'
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
        {
          title: '责任人',
          dataIndex: 'realName',
          width: 85,
          align: 'center'
        },
        {
          title: '角色',
          dataIndex: 'roleName',
          width: 100,
          align: 'center'
        },
        {
          title: '部门',
          dataIndex: 'deptName',
          width: 180,
          formatter: function (row) {
            if (row.dname) {
              return row.dname + '-' + row.deptName
            } else {
              return row.deptName
            }
          },
          align: 'center'
        },
        {
          title: '完成情况',
          dataIndex: 'status',
          width: 100,
          formatter: (row) => {
            let currStatus = this.allStatus.filter(item => item.value === row.status)
            if (row.dataType === 'task' && currStatus.length) {
              return `${row.managerStatusDisplay},${currStatus[0].label}`
            }
          },
          align: 'center'
        },
        {
          title: '完成百分比',
          dataIndex: 'progress',
          width: 100,
          align: 'center',
          formatter: function (row) {
            if (row.dataType === 'task') {
              return (row.progress * 100).toFixed(0) + '%'
            }
          }
        },
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
      let searchData = [
        {
          type: 'datetimeRange',
          labelText: '计划完成时间',
          fieldName: 'beginEndTime',
          defaultValue: '',
          placeholder: ['开始日期', '结束日期'],
          fieldConfig: {
            'value-format': 'yyyy-MM-dd'
          }
        },
        {
          type: 'multiple',
          labelText: '任务状态',
          fieldName: 'status',
          defaultValue: '',
          placeholder: '选择状态',
          options: []
        },
        {
          type: 'text',
          labelText: '任务名称',
          fieldName: 'taskName',
          defaultValue: '',
          placeholder: '请输入任务名称'
        },
        // {
        //   type: 'multiple', // 控件类型
        //   labelText: '项目分级', // 控件显示的文本
        //   fieldName: 'projectOrderIds',
        //   placeholder: '请输入项目代码',
        //   optionUrl: {
        //     api: 'thirdPartInterface.getDic',
        //     params: { dicType: 'PROJECT_ORDER' }
        //   },
        //   options: []
        // },
        {
          type: 'text',
          labelText: '项目编号',
          fieldName: 'projectCode',
          defaultValue: '',
          placeholder: '请输入项目编号'
        },
        {
          type: 'text',
          labelText: '项目名称',
          fieldName: 'projectName',
          defaultValue: '',
          placeholder: '请输入项目名称'
        }
      ]
      return {
        visible: false,
        tableApi: 'WorkStatistics.taskListDataByBussinessId',
        columns,
        parentId: 'parentId',
        layTaskId: '',
        planTaskId: '',
        planTaskName: '',
        planTaskEndDate: null,
        searchData,
        tableOtherParams: { businessId: this.businessId },
        tableConfig: {
          defaultExpandAllRows: true,
          scroll: { x: 1300 },
          expandIconColumnIndex: 6
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
        allStatus: []
      }
    },
    mounted () {
      this.getAllStatusOptions()
      let _this = this
      this.$bus.$on('refresh', function () {
        Vue.nextTick(function () {
          _this.$refs.table.searchData()
        })
      })
    },
    methods: {
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
        let _this = this
        if (this.planTaskId !== '' && this.layTaskId !== '') {
          _this.$api['courtyardPlanManager.connectTask']({ taskId: this.planTaskId,
avTaskId: this.layTaskId,
            avTaskName: this.planTaskName
            }).then(function (res) {
            _this.$refs.table.searchData()
          })
        }
      },
      layBack (row) {
        this.layTaskId = row.id
        this.planTaskName = row.name
      },
      rowClick (row) {
        this.planTaskId = row.id
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
          let multipleData = _this.searchData.filter(item => item.type === 'multiple')
          multipleData[0].options = data
          console.log(data, 'data1')
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
      monitorpointIconHandle (row) {
        if (row.monitorpointArray && row.monitorpointIconArray) {
          let monitorpointArray = row.monitorpointArray.split(',')
          let monitorpointIconArray = row.monitorpointIconArray.split(',')
          let tempIcon = []
          monitorpointArray.forEach((item, index) => {
            tempIcon.push(monitorpointIconArray[index])
          })
          return tempIcon
        }
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
</style>
