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
          <template #taskName="{ scope }">
          <span v-if="scope.row.parentId"
            class="underline"
            >{{ scope.row.taskName }}</span
          >
          <span v-if="!scope.row.parentId"
          >{{ scope.row.taskName }}</span
          >
        </template>
              <template #customIcon="{ scope }">
                <common-status-icon v-if="scope.row.dataType"
                                    :status-name="statusName"
                                    :status-key="scope.row.managerStatus"></common-status-icon>
              </template>
              <template #monitorpoint="{ scope }">
                <span
                  v-for="item in monitorpointIconHandle(scope.row)"
                  :key="item"
                  style="padding: 0 2px"
                >
                  <i :class="item"></i>
                </span>
              </template>
         <template #overdue='{scope}'>
               <div v-html="overdueTextFun(scope.row)"></div>
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
import { P8StatusIcon as CommonStatusIcon } from '~/index'
import { P8ListLayout as ListLayout } from '~/index'
import { P8Table as CommonTable } from '~/index'
import { P8Search as SearchFormList } from '~/index'
import { getTaskStatusInfo } from '@/utils/commonBusiness'
import { overdueTextHandle } from '@/utils/common'
import langCn from '@/config/const/lang_cn'

export default {
  components: {
    CommonStatusIcon,
    ListLayout,
    CommonTable,
    SearchFormList
  },
  data () {
      const columns = [
        {
        title: '',
        type: 'index',
        dataIndex: 'customIcon',
        width: 45,
        align: 'center',
        scopedSlots: {
          customRender: 'custom'
        }
      },
      {
        title: langCn.identification,
        type: 'index',
        dataIndex: 'monitorpoint',
        width: 120,
        align: 'center',
        scopedSlots: {
          customRender: 'custom'
        }
      },
        {
          title: langCn.projectAndTask,
          dataIndex: 'taskName',
          drillable: false,
          minWidth: 300,
          align: 'left',
          scopedSlots: {
            customRender: 'custom'
          }

        },
        {
          title: langCn.taskStatus,
          dataIndex: 'taskStatusShow',
          width: '120px',
          align: 'center'
        },
        {
            title: langCn.personLiable,
            dataIndex: 'dutyName',
            align: 'center',
            minWidth: 85
        },
        {
          title: langCn.department,
          dataIndex: 'dName',
          minWidth: 180,
          align: 'center'
        }, {
          title: langCn.planStartDate,
          dataIndex: 'planBeginDate',
          width: '120px',
          align: 'center'
        },
        {
          title: langCn.planEndDate,
          dataIndex: 'planEndDate',
          width: '120px',
          align: 'center'
        },
        {
          title: langCn.overdueRemainingDays,
          dataIndex: 'overdue',
          width: '100px',
          scopedSlots: {
            customRender: 'custom'
          }
        },
        {
          title: langCn.progress,
          dataIndex: 'progress',
          width: '110px',
          align: 'center',
          formatter: function (row) {
            if (row.dataType === 'task') {
                let result = Number((row.progress * 100)) || 0
                if (result === 0) {
                   return ''
                }
              return result
            }
          }
        },
        {

          title: langCn.actualStartDate,
          dataIndex: 'realBeginDate',
          width: '120px'
        },
        {
          title: langCn.actualEndDate,
          dataIndex: 'realEndDate',
          width: '120px'
        }
      ]
    let searchData = [
        {
          type: 'datetimeRange',
          labelText: langCn.planEndDate,
          fieldName: 'planDates',
          defaultValue: [],
          placeholder: ''
        },
        {
          type: 'text',
          labelText: langCn.projectAndTask,
          fieldName: 'taskName',
          placeholder: '请输入任务名称',
          fieldEvent: {
            'click': 'clickEvent(this)'
          }
        },
       {
        type: 'multiple',
        defaultValue: [],
        optionUrl: {
          api: 'thirdPartInterface.getDic',
          params: { dicType: 'TASK_STATUS' }
        },
        options: [],
        labelText: langCn.progress, // 控件显示的文本
        fieldName: 'status'
      }
      ]
    return {
      drawerTitle: '',
      tableApi: 'downTaskFinishCase.list',
      columns: columns,
      searchData,
      tableHeight: 1,
      comp: this,
      statusName: 'managerStatus',
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
         let newParams = { ...this.queryParam, ...param }
      // 项目类别ID
      this.queryParam = newParams
      let _this = this
      Vue.nextTick(function () {
        _this.$refs.table.queryList()
      })
    },
    reSet () {
      let that = this
      Object.keys(that.queryParam).forEach(key => { that.queryParam[key] = null })
      Vue.nextTick(function () {
        that.$refs.table.searchData()
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
  // 超期/剩余天数调用公共方法
    overdueTextFun (row) {
      return overdueTextHandle(row)
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
