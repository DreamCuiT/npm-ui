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
                      :flex="tableFlex"
                      :columns="columns"
                      :table-Refresh="tableRefresh"
                      :params="queryParam"
                      :api="tableApi"
                      :comp="comp"
                      :specialRoteName="roteName"
                      :pagination=true>
        </common-table>
        <problem-select v-if="visibleProblemSelect"
                        :visible="visibleProblemSelect"
                        :title="title"
                        @close-modal="closeModal1"
                        @save-success="saveCallback1"
                        :rowId="rowId"
                        :wholeDescribeId="wholeDescribeId">
        </problem-select>
        <upcoming-select v-if="visibleUpcomingSelect"
                         :visible="visibleUpcomingSelect"
                         :title="title"
                         @close-dialog="closeModal2"
                         @save-success="saveCallback2"
                         :rowId="rowId"
                         :wholeDescribeId="wholeDescribeId">
        </upcoming-select>
      </div>
    </template>
    <template #drawer-panel>
      <common-drawer v-if="visibleProblemEdit"
                     size="50%"
                     :drawerConfig="drawerConfig"
                     :title="drawerTitle"
                     :visible="visibleProblemEdit"
                     @close="closeModal"
                     @save-success="saveCallback">
        <template #drawer>
          <risk-edit :entityId="rowId"
                     :wholeDescribeId="wholeDescribeId"></risk-edit>
        </template>
      </common-drawer>
    </template>
  </list-layout>
</template>

<style scoped>
</style>
<script>
import Vue from 'vue'
import RiskEdit from './edit'
import SelectProblemProcess from './selectProblemProcess'
import SelectUpcoming from './SelectUpcoming'
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
    title: '项目名称',
    dataIndex: 'name',
    minWidth: 300,
    align: 'left'
  },
  {
    title: '风险任务',
    dataIndex: 'projectTaskName',
    minWidth: 250,
    align: 'left'
  },
  {
    title: '风险起点任务',
    dataIndex: 'startProjectTaskName',
    minWidth: 250,
    align: 'left'
  },
  {
    title: '风险终点任务',
    dataIndex: 'endProjectTaskName',
    minWidth: 250,
    align: 'left'
  },
  {
    title: '风险描述',
    dataIndex: 'riskDesc',
    minWidth: 250,
    align: 'left'
  },
  {
    title: '风险结果',
    dataIndex: 'riskResult',
    minWidth: 200,
    align: 'left'
  },
  {
    title: '风险类型',
    dataIndex: 'riskType',
    width: 120,
    align: 'center'
  },
  {
    title: '提出人',
    dataIndex: 'riskLaunchUser',
    width: 90,
    align: 'center'
  },
  {
    title: '处理人',
    dataIndex: 'riskDutyUser',
    width: 90,
    align: 'center'
  },
  {
    title: '风险等级',
    dataIndex: 'riskLevel',
    width: 120,
    align: 'center'
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 90,
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
    width: 120,
    align: 'center'
  }
]

export default {
  components: {
    RiskEdit,
    'problem-select': SelectProblemProcess,
    'upcoming-select': SelectUpcoming,
    ListLayout,
    CommonTable,
    CommonButton,
    CommonDrawer,
    SearchFormList
  },
  props: {
    // id: {
    //   type: String
    // },
    thirdMenuParam: {
      type: Object,
      default: function () {
        return {}
      }
    },
    roteName: {// 三级菜单路由
      type: String,
      default: ''
    },
    tableFlex: {
      type: Number,
      default: 200
    }
  },
  data () {
    return {
      drawerTitle: '',
      queryParam: { ifCreate: true },
      drawerConfig: {
        modal: false
      },
      visibleProblemEdit: false,
      visibleProblemSelect: false,
      visibleUpcomingSelect: false,
      visibleKTeamsDisposeDrawer: false,
      tableApi: 'riskManager.myListData',
      columns: columns,
      tableHeight: 1,
      teamsId: '',
      comp: this,
      searchData: [
        {
          type: 'text',
          labelText: '风险描述',
          fieldName: 'riskDesc',
          placeholder: '请输入风险描述',
          fieldEvent: {
            'click': 'clickEvent(this)'
          }
        },
        {
          type: 'text',
          labelText: '项目名称',
          fieldName: 'name',
          placeholder: '请输入项目名称',
          fieldEvent: {
            'click': 'clickEvent(this)'
          }
        },
        {
          type: 'text',
          labelText: '风险任务',
          fieldName: 'riskName',
          placeholder: '请输入风险任务',
          fieldEvent: {
            'click': 'clickEvent(this)'
          }
        },
        {
          type: 'select',
          labelText: '状态',
          optionUrl: {
            api: 'thirdPartInterface.getDic',
            params: { dicType: 'RISK_MANAGE' }
          },
          options: [],
          fieldName: 'status',
          colLayout: 'singleCol'
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
    processRisk (record) {
      this.wholeDescribeId = this.id
      this.rowId = record.id
      this.title = '风险处理'
      this.visibleProblemEdit = true
    },
    selectRisk (record) {
      this.wholeDescribeId = this.id
      this.rowId = record.id
      this.title = '风险处理情况'
      this.visibleProblemSelect = true
    },
    selectAllUpcoming (record) {
      this.wholeDescribeId = this.id
      this.rowId = record.id
      this.title = '查看待办记录'
      this.visibleUpcomingSelect = true
    },
    closeModal () {
      this.visibleProblemEdit = false
      this.$refs.table.searchData()
    },
    closeModal1 () {
      this.visibleProblemSelect = false
      this.$refs.table.searchData()
    },
    closeModal2 () {
      this.visibleUpcomingSelect = false
      this.$refs.table.searchData()
    },
    saveCallback (res) {
      this.visibleProblemEdit = false
      this.$refs.table.searchData()
    },
    saveCallback1 (res) {
      this.visibleProblemSelect = false
      this.$refs.table.searchData()
    },
    saveCallback2 (res) {
      this.visibleUpcomingSelect = false
      this.$refs.table.searchData()
    },
    onDisposeKTeamsClose () {
      this.visibleKTeamsDisposeDrawer = false
    },
    search (param) {
      let newParams = { ...param }
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
