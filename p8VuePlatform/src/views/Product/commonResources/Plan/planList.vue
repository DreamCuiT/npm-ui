<template>
  <list-layout>
    <template #north>
      <search-form-list :dataSource="searchData"
                        @search="search"
                        @re-set="reSet"></search-form-list>
    </template>
    <template #center>
      <common-table ref="table"
                    :flex="214"
                    :api="tableApi"
                    :columns="columns"
                    :params='queryParam'
                    :pagination="true"
                    :table-refresh='tableRefresh'
                    :table-config='tableConfig'
                    @requested-table-data="requestedTableData">
        <template #monitorpoint='{scope}'>
          <span v-for="item in monitorpointIconHandle(scope.row)"
                :key="item"
                style="padding: 0 2px">
            <i :class="item"></i>
          </span>
        </template>
        <template #overdue='{scope}'>
          <div v-html="overdueTextHandle(scope.row.taskStatus, scope.row.taskPlanEndDate, scope.row.taskRealEndDate)"></div>
        </template>
        <template #tableSettings="{scope}">
          <el-button type="text"
                     v-if="scope.row.ctyName"
                     @click="setUpDutyUser(scope.row)">设置责任人&#12288;</el-button>
        </template>
      </common-table>
      <select-user v-if="tableRowVisible"
                   :visible="tableRowVisible"
                   :selected-row='selectedRow'
                   @close-dialog="closeModal"
                   :selectType="1"></select-user>
    </template>
  </list-layout>
</template>
<script>
import Vue from 'vue'
import { P8SelectUser as SelectUser } from '~/index'
import { P8ListLayout as ListLayout } from '~/index'
import { P8Table as CommonTable } from '~/index'
import { P8Search as SearchFormList } from '~/index'
import { Button } from '~/index'
import moment from 'moment'

export default {
  name: 'list',
  provide () { // 使用 provide对深层组件进行数据信息传递 例:taskOperating/Progress.vue中 inject搭配computed接收数据
    return {
      getPlanInfo: () => this.planInfo
    }
  },
  data () {
    const columns = [
      // {
      //     title: '标记',
      //     dataIndex: 'monitorpoint',
      //     type: 'index',
      //     width: '100px',
      //     align: 'center',
      //     scopedSlots: {
      //         customRender: 'custom'
      //     }
      // },
      {
        title: '型号/任务',
        dataIndex: 'name',
        fixed: 'left',
        minWidth: 200
      },
      {
        title: '资源类别',
        width: 100,
        align: 'center',
        dataIndex: 'ctyName'
      },
      {
        title: '项目名称',
        minWidth: 250,
        align: 'left',
        dataIndex: 'projectName'
      },
      {
        title: '联系人',
        width: 90,
        align: 'center',
        dataIndex: 'contact'
      },
      {
        title: '联系电话',
        width: 130,
        align: 'center',
        dataIndex: 'tel'
      },
      {
        title: '任务责任人',
        width: 120,
        align: 'center',
        dataIndex: 'realName'
      },
      {
        title: '部门',
        minWidth: 180,
        align: 'center',
        dataIndex: 'parDepartmentName',
        formatter: function (row) {
          if (row.parDepartmentName) {
            return row.parDepartmentName + '-' + row.deptName
          } else {
            return row.deptName
          }
        }
      },
      {
        title: '任务状态',
        width: 95,
        align: 'center',
        dataIndex: 'statusDisplay'
      },
      {
        title: '计划完成时间',
        width: 120,
        align: 'center',
        dataIndex: 'taskPlanEndDate'
      },
      {
        title: '剩余/超期天数',
        width: 100,
        align: 'center',
        dataIndex: 'overdue',
        scopedSlots: {
          customRender: 'custom'
        }
      },
      {
        title: '责任人',
        width: 90,
        align: 'center',
        dataIndex: 'dutyUser'
      },
      {
        title: '接收时间',
        width: 100,
        align: 'center',
        dataIndex: 'receiveTime'
      },
      {
        title: '共性资源计划完成时间',
        minWidth: 180,
        align: 'center',
        dataIndex: 'planEndTime'
      },
      {
        title: '状态',
        width: 100,
        align: 'center',
        dataIndex: 'commStatusDisplay'
      },
      {
        title: '操作',
        width: 100,
        dataIndex: 'tableSettings',
        scopedSlots: {
          customRender: 'custom'
        }
      }
    ]
    return {
      columns: columns,
      tableApi: 'commonResourcesPlan.plan',
      parentId: 'parentId',
      planInfo: {},
      queryParam: {},
      allStatus: [],
      selectedRow: [],
      currentRowId: null,
      tableRowVisible: false,
      tableConfig: {
        'default-expand-all': true
      },
      searchData: [
        {
          type: 'text',
          labelText: '项目名称',
          fieldName: 'projectName',
          defaultValue: '',
          placeholder: '请输入项目名称'
        },
        {
          type: 'text',
          labelText: '任务名称',
          fieldName: 'name',
          defaultValue: '',
          placeholder: '请输入任务名称'
        },
        {
          type: 'select',
          labelText: '状态',
          placeholder: '请选择状态',
          fieldName: 'status',
          colLayout: 'singleCol',
          optionUrl: {
            api: 'thirdPartInterface.getDic',
            params: { dicType: 'COMM_RESOURCES_STATUS' }
          },
          options: []
        },
        {
          type: 'multiple',
          defaultValue: [],
          optionUrl: {
            api: 'baseData.getPublicResourceTypes',
            label: 'label',
            value: 'value',
            params: {}
          },
          options: [],
          labelText: '共性资源类别', // 控件显示的文本
          fieldName: 'commonResourceTypesId',
          placeholder: '请选择共性资源类别'
        },
        {
          type: 'datetimeRange',
          labelText: '共性资源计划完成时间',
          fieldName: 'beginEndTime',
          defaultValue: [],
          placeholder: ['开始日期', '结束日期']
        }
      ]
    }
  },
  mounted () {
    this.customValidate()
    let _this = this
    this.$bus.$on('refresh', function () {
      Vue.nextTick(function () {
        _this.$refs.table.searchData()
      })
    })
  },
  methods: {
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
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
      Object.keys(that.queryParam).forEach(key => {
        that.queryParam[key] = ''
      })
      Vue.nextTick(function () {
        that.$refs.table.searchData()
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
    overdueTextHandle (currStatus, taskPlanEndDate, taskRealEndDate) {
      if (!currStatus) {
        return ''
      }
      let currDate = taskRealEndDate || moment().format('YYYY-MM-DD')
      let diffDays = Math.abs(moment(taskPlanEndDate).diff(moment(currDate), 'days'))
      let text = ''
      if (currStatus === '6000') {
        // 已完成
        if (moment(currDate).isAfter(moment(taskPlanEndDate))) {
          text = `<span style="color: #F80012">超期${diffDays}天完成</span>`
        } else if (diffDays === 0) {
          text = `<span style="color: #1892FF">当天完成</span>`
        } else {
          text = `<span style="color: #1892FF">提前${diffDays}天完成</span>`
        }
      } else {
        if (moment(currDate).isAfter(moment(taskPlanEndDate))) {
          text = `<span style="color: #F80012">超期${diffDays}天</span>`
        } else {
          text = `<span style="color: #1BBF9E">剩余${diffDays}天</span>`
        }
      }
      return text
    },
    customValidate (params) {
      let currentRow = this.tableData.filter(item => item.id === this.currentRowId)
      this.$set(currentRow[0], 'commStatusDisplay', this.dicData.filter(item => item.value === params['commStatusDisplay'])[0].label)
      this.$set(currentRow[0], 'status', params['commStatusDisplay'])
      this.tableRowVisible = false
    },
    closeModal (selectedRow) {
      this.tableRowVisible = false
      this.selectedRow = selectedRow
      // let dutyUserName = this.selectedRow[0].realName
      let dutyUserId = this.selectedRow[0].id
      if (this.selectedRow) {
        this.$api['commonResourcesPlan.comResourceDutyUserSave']({ dutyUserId: dutyUserId, id: this.currentRowId }).then(res => {
          // 成功之后的回调
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        })
        this.search()
        // let that = this
        // that.tableApi = Object.assign({}, that.tableApi)
      }
    },
    setUpDutyUser (row) {
      this.currentRowId = row.id
      this.tableRowVisible = true
    }
  },
  components: {
    'el-button': Button,
    SelectUser,
    ListLayout,
    CommonTable,
    SearchFormList
  }
}
</script>

<style scoped>
</style>
