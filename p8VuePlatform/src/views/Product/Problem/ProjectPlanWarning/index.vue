<template>
  <list-layout>
    <template #north>
      <common-button :comp="comp"></common-button>
      <search-form-list ref="search"
                        :dataSource="searchData"
                        @search="search"></search-form-list>
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
                      :pagination=true>
        </common-table>
        <problem-edit v-if="visibleProblemEdit"
                      :visible="visibleProblemEdit"
                      :title="title"
                      @close-modal="closeModal"
                      @save-success="saveCallback"
                      :rowId="rowId"
                      :wholeDescribeId="wholeDescribeId">
        </problem-edit>
        <problem-select v-if="visibleProblemSelect"
                        :visible="visibleProblemSelect"
                        :title="title"
                        @close-modal="closeModal1"
                        @save-success="saveCallback1"
                        :rowId="rowId"
                        :wholeDescribeId="wholeDescribeId">
        </problem-select>

      </div>
    </template>
    <template #drawer-panel>
      <common-drawer v-if="visibleKTeamsDisposeDrawer"
                     :title="drawerTitle"
                     :visible="visibleKTeamsDisposeDrawer"
                     @close="onDisposeKTeamsClose">
        <template #drawer>
          <dispose-kteams @save-Success="saveCallback"
                          :teamsId="teamsId"></dispose-kteams>
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
import DisposeKteams from './disposeKteams'
import { P8ListLayout as ListLayout } from '~/index'
import { P8Table as CommonTable } from '~/index'
import { P8Button as CommonButton } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'
import { P8Search as SearchFormList } from '~/index'

const columns = [
  {
    title: '序号',
    type: 'index',
    width: 45,
    align: 'center'
  },
  {
    title: '任务名称',
    dataIndex: 'name',
    minWidth: 250,
    align: 'left'
  },
  {
    title: '问题内容',
    dataIndex: 'problemDescribe',
    minWidth: 250,
    align: 'left'
  },
  {
    title: '问题类型',
    dataIndex: 'typeDisplay',
    width: 180,
    align: 'center'
  },
  {
    title: '责任人',
    dataIndex: 'receiveUserName',
    width: 100,
    align: 'center'
  },
  {
    title: '问题分类',
    dataIndex: 'problemTypeDisplay',
    width: 180,
    align: 'center'
  },
  {
    title: '提出人',
    dataIndex: 'introDucerName',
    width: 100,
    align: 'center'
  },
  {
    title: '提出时间',
    dataIndex: 'proposeTime',
    width: 120,
    align: 'center'
  },
  {
    title: '状态',
    dataIndex: 'statusDisplay',
    width: 80,
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
    'dispose-kteams': DisposeKteams,
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
    }
  },
  data () {
    return {
      drawerTitle: '',
      visibleProblemEdit: false,
      visibleProblemSelect: false,
      visibleKTeamsDisposeDrawer: false,
      queryParam: {
        type: '11502'
      },
      tableApi: 'baseData.JhyjPage',
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
          fieldName: 'statusDisplay',
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
  computed: {},
  methods: {
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
    createProblem () {
      this.wholeDescribeId = this.id
      this.rowId = ''
      this.title = '新建问题信息'
      this.visibleProblemEdit = true
    },
    updateProblem (record) {
      this.wholeDescribeId = this.id
      this.rowId = record.id
      this.title = '修改问题信息'
      this.visibleProblemEdit = true
    },
    selectProblem (record) {
      this.wholeDescribeId = this.id
      this.rowId = record.id
      this.title = '问题处理情况'
      this.visibleProblemSelect = true
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
    saveCallback (res) {
      this.visibleProblemEdit = false
      this.$refs.table.searchData()
    },
    saveCallback1 (res) {
      this.visibleProblemSelect = false
      this.$refs.table.searchData()
    },
    onDisposeKTeamsClose () {
      this.visibleKTeamsDisposeDrawer = false
    },
    search (param) {
      param.type = '11502'
      let newParams = { ...param }
      this.queryParam = newParams
      let that = this
      Vue.nextTick(function () {
        that.$refs.table.searchData()
      })
    },
    reset () {
      let that = this
      Object.keys(that.queryParams).forEach(key => {
        return (that.queryParams[key] = null)
      })
      Vue.nextTick(function () {
        that.$refs.table.searchData()
      })
    }
  }
}

</script>
