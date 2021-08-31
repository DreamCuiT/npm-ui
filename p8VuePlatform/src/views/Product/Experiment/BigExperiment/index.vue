<template>
  <list-layout>
    <template #north>
      <common-button :comp="comp"></common-button>
      <search-form-list ref="search"
                        :dataSource="dataSource"
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
                      :pagination=true>
        </common-table>
        <experiment-edit v-if="visibleProblemEdit"
                         :visible="visibleProblemEdit"
                         :title="title"
                         @close-modal="closeModal"
                         @save-success="saveCallback"
                         :rowId="rowId">
        </experiment-edit>

      </div>
    </template>
    <template #drawer-panel>
      <common-drawer :title="drawerTitle">
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
    width: 45,
    align: 'center'
  },
  {
    title: '型号名称',
    dataIndex: 'modelName',
    width: 120,
    align: 'center'
  },
  {
    title: '项目名称',
    dataIndex: 'projectName',
    minWidth: 300,
    align: 'left'
  },
  {
    title: '项目类型',
    dataIndex: 'projectType',
    width: 120,
    align: 'center'
  },
  {
    title: '试验名称',
    dataIndex: 'testName',
    minWidth: 250,
    align: 'left'
  },
  {
    title: '试验地点',
    dataIndex: 'testPlaceDisplay',
    width: 120,
    align: 'center'
  },
  {
    title: '试验时间（开始时间）',
    dataIndex: 'realBeginTime',
    width: 165,
    align: 'center'
  },
  {
    title: '试验时间（完成时间）',
    dataIndex: 'realEndTime',
    width: 165,
    align: 'center'
  },
  {
    title: '计划发射数（最小数）',
    dataIndex: 'minNum',
    width: 165,
    align: 'center'
  },
  {
    title: '计划发射数（最大数）',
    dataIndex: 'maxNum',
    width: 165,
    align: 'center'
  },
  {
    title: '完成状态',
    dataIndex: 'currentStatusDisplay',
    width: 95,
    align: 'center'
  },
  {
    title: '备注',
    dataIndex: 'note',
    minWidth: 200,
    align: 'left'
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
    'experiment-edit': Edit,
    ListLayout,
    CommonTable,
    CommonButton,
    CommonDrawer,
    SearchFormList
  },
  data () {
    const dataSource = [
      {
        type: 'datetimeRange',
        labelText: '起始时间',
        fieldName: 'beginEndTime',
        colLayout: 'singleCol',
        placeholder: ['开始日期', '完成日期'],
        fieldConfig: {
          style: 'width: 100%',
          'value-format': 'yyyy-MM-dd'
        }
      },
      {
        type: 'select',
        labelText: '试验地点',
        fieldName: 'testPlaceDisplay',
        optionUrl: {
          api: 'thirdPartInterface.getDic',
          params: { dicType: 'TEST_PLACE' }
        },
        options: [],
        colLayout: 'doubleCol'
      },
      {
        type: 'select',
        labelText: '完成状态',
        fieldName: 'currentStatus',
        options: [
          { 'key': '0', 'label': '完成', 'value': '0' },
          { 'key': '1', 'label': '未完成', 'value': '1' }
        ],
        colLayout: 'doubleCol'
      },
      {
        type: 'select',
        defaultValue: [],
        labelText: '型号代号',
        fieldName: 'modelInformationId',
        placeholder: '选择所属型号',
        optionUrl: {
          api: 'ProjectApply.getModelListData',
          label: 'modelCode',
          value: 'id',
          params: {}
        },
        treeData: [],
        fieldConfig: {
          multiple: true
        }
      },
      {
        type: 'treeSelect',
        defaultValue: [],
        labelText: '项目类型',
        fieldName: 'kprojectClassifyId',
        placeholder: '请输入项目代码',
        multiple: true,
        optionUrl: {
          api: 'ProjectApply.projectClassifyTree',
          params: {},
          // label: 'name',
          value: 'id'
        },
        treeData: []
      },
      {
        type: 'text',
        labelText: '项目名称',
        fieldName: 'projectName',
        placeholder: '请输入项目名称',
        fieldEvent: {
          'click': 'clickEvent(this)'
        }
      }
      // {
      //   type: 'select',
      //   defaultValue: [],
      //   optionUrl: {
      //     api: 'thirdPartInterface.getDic',
      //     params: { dicType: 'PROJECT_ORDER' }
      //   },
      //   options: [],
      //   labelText: '项目分级', // 控件显示的文本
      //   fieldName: 'projectOrder',
      //   placeholder: '请输入项目代码',
      //   fieldConfig: {
      //     multiple: true
      //   }
      // }
    ]
    return {
      drawerTitle: '',
      dataSource,
      visibleProblemEdit: false,
      queryParam: {
        testType: '3111'
      },
      tableApi: 'experimentManager.bigExperimentList',
      columns: columns,
      tableHeight: 1,
      comp: this

    }
  },
  mounted () {

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
    createBigExperiment () {
      this.rowId = ''
      this.title = '新建试验信息'
      this.visibleProblemEdit = true
    },
    updateBigExperiment (record) {
      this.rowId = record.id
      this.title = '修改试验信息'
      this.visibleProblemEdit = true
    },
    removeBigExperiment (record) {
      let that = this
      that.$confirm(`是否要删除该条数据？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$api['experimentManager.deleteBigExperiment']({ id: record.id }).then(res => {
          that.$refs.table.searchData()
        })
      }).catch(() => console.log('Oops errors!'))
    },
    closeModal () {
      this.visibleProblemEdit = false
      this.$refs.table.searchData()
    },
    saveCallback (res) {
      this.visibleProblemEdit = false
      this.$refs.table.searchData()
    },
    search (params) {
      params.testType = '3111'
      let newParams = { ...params }
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
