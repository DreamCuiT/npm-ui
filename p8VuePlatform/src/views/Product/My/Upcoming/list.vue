<template>
  <list-layout>
    <template #north>
      <common-button :comp="comp"></common-button>
      <search-form-list ref="search"
                        :dataSource="searchData"
                        @search="search"
                        @re-set="reSet"></search-form-list>
    </template>
    <template #center>
      <div id="table-contain">
        <common-table ref="table"
                      :fiex="200"
                      :columns="columns"
                      :table-Refresh="tableRefresh"
                      :params="queryParam"
                      :api="tableApi"
                      :comp="comp"
                      :tableConfig="tableConfig"
                      :specialRoteName="roteName"
                      :pagination=true>
        </common-table>
      </div>
    </template>
    <template #drawer-panel>
      <common-drawer v-if="visibleUpcomingEdit"
                     :visible="visibleUpcomingEdit"
                     :title="title"
                     :drawerConfig="drawerConfig"
                     @close="closeModal">
        <template #drawer>
          <problem-edit :entityId="rowId"
                        :wholeDescribeId="wholeDescribeId"
                        @save-success="saveCallback">
          </problem-edit>
        </template>
      </common-drawer>
    </template>
  </list-layout>
</template>

<style scoped>
</style>
<script>
import Vue from 'vue'
import Edit from './edit'
import { P8ListLayout as ListLayout } from '~/index'
import { P8Table as CommonTable } from '~/index'
import { P8Button as CommonButton } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'
import { P8Search as SearchFormList } from '~/index'
const columns = [
  {
    title: '序号',
    type: 'index',
    width: 55,
    align: 'center'
  },
  {
    title: '任务名称',
    dataIndex: 'taskName',
    minWidth: 300,
    align: 'left'
  },
  {
    title: '待办事项内容',
    dataIndex: 'content',
    minWidth: 300,
    align: 'left'
  },
  {
    title: '类型',
    dataIndex: 'classifyDisplay',
    width: 120,
    align: 'center'
  },
  {
    title: '计划开始时间',
    dataIndex: 'beginTime',
    width: 120,
    align: 'center'
  },
  {
    title: '计划完成时间',
    dataIndex: 'endTime',
    width: 120,
    align: 'center'
  },
  {
    title: '状态',
    dataIndex: 'statusDisplay',
    width: 90,
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
    width: 180,
    align: 'center'
  }
]

export default {
  components: {
    'problem-edit': Edit,
    ListLayout,
    CommonTable,
    CommonButton,
    CommonDrawer,
    SearchFormList
  },
  props: {
    thirdMenuParam: {
      type: Object,
      default: function () {
        return {}
      }
    },
    roteName: {// 三级菜单路由
      type: String,
      default: ''
    }
  },
  data () {
    return {
      drawerTitle: '',
      queryParam: {},
      drawerConfig: {
        modal: false
      },
      visibleUpcomingEdit: false,
      visibleKTeamsDisposeDrawer: false,
      tableApi: 'upcomingManager.upcomingPage',
      columns: columns,
      tableHeight: 1,
      teamsId: '',
      comp: this,
      tableConfig: {
        height: '200px'
      },
      searchData: [
        {
          type: 'datetimeRange',
          labelText: '计划完成时间',
          fieldName: 'datetimeRange',
          colLayout: 'singleCol',
          placeholder: '选择发件时间',
          fieldConfig: {
            'value-format': 'yyyy-MM-dd'
          }
        },
        {
          type: 'select',
          labelText: '状态',
          fieldName: 'statusDisplay',
          optionUrl: {
            api: 'thirdPartInterface.getDic',
            params: { dicType: 'BACKLOG_STATUS' }
          },
          options: [],
          colLayout: 'doubleCol'
        },
        {
          type: 'select',
          labelText: '类型',
          fieldName: 'classifyDisplay',
          optionUrl: {
            api: 'thirdPartInterface.getDic',
            params: { dicType: 'BACKLOG_CLASSIFY' }
          },
          options: [],
          colLayout: 'doubleCol'
        }
      ]
    }
  },
  mounted () {
    this.id = this.thirdMenuParam.id
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
    processUpcoming (record) {
      this.wholeDescribeId = this.id
      this.rowId = record.id
      this.title = '待办事项处理'
      this.visibleUpcomingEdit = true
    },
    okUpcoming (record) {
      let that = this
      that.$confirm(`是否要提交完成该条数据？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$api['upcomingManager.okUpcoming']({ id: record.id }).then(res => {
          that.$refs.table.searchData()
        })
      }).catch(() => console.log('Oops errors!'))
    },
    disposeKTeams (record) {
      this.teamsId = record.id
      console.log(record.id)
      this.drawerTitle = '项目团队设置'
      this.visibleKTeamsDisposeDrawer = true
    },
    closeModal () {
      this.visibleUpcomingEdit = false
      this.$refs.table.searchData()
    },
    saveCallback (res) {
      this.visibleUpcomingEdit = false
      this.$refs.table.searchData()
    },
    onDisposeKTeamsClose () {
      this.visibleKTeamsDisposeDrawer = false
    },
    search (param) {
      let searchDate = {}
      if (param.datetimeRange) {
        searchDate = { searchBeginTime: param.datetimeRange[0], searchEndTime: param.datetimeRange[1] }
      }
      let newParams = { ...param, ...searchDate }
      this.queryParam = newParams
      let that = this
      Vue.nextTick(function () {
        that.$refs.table.searchData()
      })
    },
    reSet () {
      let that = this
      Object.keys(that.queryParam).forEach(key => {
        return (that.queryParam[key] = null)
      })
      Vue.nextTick(function () {
        that.$refs.table.searchData()
      })
    }
  }
}

</script>
