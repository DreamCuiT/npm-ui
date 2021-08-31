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
                     :visible="visibleProblemEdit"
                     :title="title"
                     @close="closeModal"
                     :drawerConfig="drawerConfig"
                     @save-success="saveCallback">
        <template #drawer>
          <problem-edit :entityId="rowId"
                        :wholeDescribeId="wholeDescribeId">
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
    title: '项目编号',
    dataIndex: 'pjCode',
    minWidth: 150,
    align: 'center'
  },
  {
    title: '项目名称',
    dataIndex: 'pjName',
    minWidth: 300,
    align: 'left'
  },
  {
    title: '问题任务',
    dataIndex: 'name',
    minWidth: 300,
    align: 'left'
  },
  {
    title: '问题内容',
    dataIndex: 'problemDescribe',
    minWidth: 300,
    align: 'left'
  },
  {
    title: '问题类型',
    dataIndex: 'typeDisplay',
    width: 120,
    align: 'center'
  },
  {
    title: '问题分类',
    dataIndex: 'problemTypeDisplay',
    width: 120,
    align: 'center'
  },
  {
    title: '提出人',
    dataIndex: 'introDucerName',
    width: 90,
    align: 'center'
  },
  {
    title: '提出时间',
    dataIndex: 'proposeTime',
    width: 100,
    align: 'center'
  },
  {
    title: '分配人',
    dataIndex: 'userName',
    width: 90,
    align: 'center'
  },
  {
    title: '分配时间',
    dataIndex: 'allocateTime',
    width: 100,
    align: 'center'
  },
  {
    title: '状态',
    dataIndex: 'myProblemStatusDisplay',
    width: 90,
    align: 'center'
  },
  {
    title: '所在部门',
    dataIndex: 'deptName',
    minWidth: 150,
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
    'problem-edit': Edit,
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
    }
  },
  data () {
    return {
      drawerTitle: '',
      queryParam: {},
      drawerConfig: {
        modal: true
      },
      visibleProblemEdit: false,
      visibleProblemSelect: false,
      visibleUpcomingSelect: false,
      visibleKTeamsDisposeDrawer: false,
      tableApi: 'problemManager.ProblemPage',
      columns: columns,
      tableHeight: 1,
      teamsId: '',
      comp: this,
      searchData: [
        {
          type: 'text',
          labelText: '问题内容',
          fieldName: 'problemDescribe',
          placeholder: '请输入问题内容',
          fieldEvent: {
            'click': 'clickEvent(this)'
          }
        },
        {
          type: 'select',
          labelText: '问题状态',
          fieldName: 'myProblemStatusDisplay',
          optionUrl: {
            api: 'thirdPartInterface.getDic',
            params: { dicType: 'PROBLEM_STATUS' }
          },
          options: [],
          colLayout: 'doubleCol'
        },
        {
          type: 'select',
          labelText: '问题分类',
          fieldName: 'problemTypeDisplay',
          optionUrl: {
            api: 'thirdPartInterface.getDic',
            params: { dicType: 'SUMMARY_PROGRESS' }
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
    processProblem (record) {
      this.wholeDescribeId = this.id
      this.rowId = record.id
      this.title = '问题分配'
      this.visibleProblemEdit = true
    },
    selectProblem (record) {
      this.wholeDescribeId = this.id
      this.rowId = record.id
      this.title = '问题处理情况'
      this.visibleProblemSelect = true
    },
    selectAllUpcoming (record) {
      this.wholeDescribeId = this.id
      this.rowId = record.id
      this.title = '查看待办记录'
      this.visibleUpcomingSelect = true
    },

    disposeKTeams (record) {
      this.teamsId = record.id
      console.log(record.id)
      this.drawerTitle = '项目团队设置'
      this.visibleKTeamsDisposeDrawer = true
    },
    removeProblem (record) {
      let that = this
      that.$confirm(`是否要删除该条数据？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$api['problemManager.removeProblemInfo']({ id: record.id }).then(res => {
          that.$refs.table.searchData()
        })
      }).catch(() => console.log('Oops errors!'))
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
