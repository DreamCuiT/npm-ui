<template>
    <list-layout>
        <template #north>
            <search-form-list ref="search" :dataSource="searchData" @search="search" @re-set="reSet"></search-form-list>
        </template>
        <template #center>
            <div id="table-contain">
                <common-table ref="table"
                              :flex="260"
                              :columns="columns"
                              :table-Refresh="tableRefresh"
                              :params="queryParam"
                              :api="tableApi"
                              :comp="comp"
                              :useTreeFormat="true"
                              :pagination="false"
                >
         <template #overdue='{scope}'>
          <div v-html="overdueTextHandle(scope.row.status, scope.row.planEndDate, scope.row.realEndDate)"></div>
        </template>
                </common-table>
            </div>
        </template>
         <template #drawer-panel>
        </template>
    </list-layout>
</template>

<style scoped>
</style>
<script>
import Vue from 'vue'
import { P8ListLayout as ListLayout } from '~/index'
import { P8Table as CommonTable } from '~/index'
import { P8Search as SearchFormList } from '~/index'
import { getTaskStatusInfo } from '@/utils/commonBusiness'
import moment from 'moment'

export default {
  components: {
    ListLayout,
    CommonTable,
    SearchFormList
  },
  data () {
      const columns = [
        {
          title: '序号',
          type: 'index',
          width: '50',
          align: 'center'
        },
        {
          title: '任务名称',
          dataIndex: 'taskName',
          width: '260px',
          align: 'left'

        },
        {
          title: '完成情况',
          dataIndex: 'status',
          width: '120px',
          formatter: (row) => {
            let currStatus = this.allStatus.filter(item => item.value === row.status)
            if (row.dataType === 'task' && currStatus.length) {
              return `${currStatus[0].label}`
            }
          },
          align: 'left'
        },
        {
          title: '计划开始时间',
          dataIndex: 'planBeginDate',
          width: '100px',
          align: 'center'
        },
        {
          title: '计划完成时间',
          dataIndex: 'planEndDate',
          width: '100px',
          align: 'center'
        },
        {
            title: '责任人',
            dataIndex: 'dutyName',
            align: 'center'
        },
        {
          title: '责任单位',
          dataIndex: 'dName',
          width: '100px',
          align: 'center'
        },
        {
          title: '进度',
          dataIndex: 'progress',
          width: '100px'
        },
        {
          title: '超期/剩余天数',
          dataIndex: 'overdue',
          width: '100px',
          scopedSlots: {
            customRender: 'custom'
          }
        },
        {
          title: '预测开始时间',
          dataIndex: 'forecastBeginDate',
          width: '100px'
        },
        {
          title: '预测完成时间',
          dataIndex: 'forecastEndDate',
          width: '100px'
        },
        {
          title: '完成百分比',
          dataIndex: 'progress',
          width: '80px',
          align: 'center',
          formatter: function (row) {
            if (row.dataType === 'task') {
              return (row.progress * 100).toFixed(2) + '%'
            }
          }
        },
        {

          title: '实际开始时间',
          dataIndex: 'realBeginDate',
          width: '100px'
        },
        {
          title: '实际完成时间',
          dataIndex: 'realEndDate',
          width: '100px'
        }
      ]
    let searchData = [
        {
          type: 'datetimeRange',
          labelText: '计划时间',
          fieldName: 'recordingTime',
          defaultValue: '',
          placeholder: ''
        },
        {
          type: 'text',
          labelText: '任务名称',
          fieldName: 'taskName',
          placeholder: '请输入任务名称',
          fieldEvent: {
            'click': 'clickEvent(this)'
          }
        },
        {
          type: 'multiple',
          labelText: '任务状态',
          fieldName: 'status',
          defaultValue: '',
          placeholder: '',
          options: []
        }
      ]
    return {
      drawerTitle: '',
      tableApi: 'downTaskFinishCase.list',
      columns: columns,
      searchData,
      tableHeight: 1,
      comp: this,
      queryParam: {},
      allStatus: []

    }
  },
  mounted () {
        this.getAllStatusOptions()
  },
  computed: {

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
        console.log(param, 'param')

    if (param && param.recordingTime && param.recordingTime.length === 2) {
        let planDates = []
        planDates[0] = moment(param.recordingTime[0]).format('YYYY-MM-DD')
        planDates[1] = moment(param.recordingTime[1]).format('YYYY-MM-DD')
        param.planDates = planDates
      }
      if (param) {
        this.queryParam = param
      }
      console.log(this.queryParam, 'queryParam')
      let _this = this
      Vue.nextTick(function () {
        _this.$refs.table.searchData()
      })
    },
    reSet () {
      let that = this
      Object.keys(that.queryParam).forEach(key => { that.queryParam[key] = null })
      Vue.nextTick(function () {
        that.$refs.table.searchData()
      })
    },
overdueTextHandle (currStatus, planEndDate, realEndDate) {
      if (!currStatus) {
        return ''
      }
      let currStatusInfo = this.allStatus.filter(item => item.value === currStatus)
      if (!currStatusInfo.length) {
        console.log('我的任务列表:', 'currStatus not found in state pool')
        return
      }
      let currDate = realEndDate || moment().format('YYYY-MM-DD')
      let diffDays = Math.abs(moment(planEndDate).diff(moment(currDate), 'days'))
      let text = ''
      if (Number(currStatusInfo[0].progressRange[1]) === 1) {
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
  getAllStatusOptions () {
      let _this = this
      getTaskStatusInfo({ currentStatus: 'all' }).then(data => {
        _this.allStatus = data
        console.log(_this.allStatus, '_this.allStatus')

        let multipleData = _this.searchData.filter(item => item.type === 'multiple')
        multipleData[0].options = data
      })
    }
  }
}

</script>
