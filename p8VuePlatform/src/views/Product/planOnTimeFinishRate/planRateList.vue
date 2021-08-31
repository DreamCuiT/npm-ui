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
                      :flex="214"
                      :columns="columns"
                      :table-Refresh="tableRefresh"
                      :params="queryParam"
                      :api="tableApi"
                      :comp="comp"
                      :pagination="true">
          <template #taskCount="{scope}">
            <span class="number-click"
                  @click="test(scope.row,'','任务总数')">{{ scope.row.taskCount }}</span>
          </template>
          <template #unfinishedCount="{scope}">
            <span class="number-click"
                  @click="test(scope.row,'6020','未完成任务')">{{ scope.row.unfinishedCount }}</span>
          </template>
          <template #planFinishedCount="{scope}">
            <span class="number-click"
                  @click="test(scope.row,'6070','已完成任务')">{{ scope.row.planFinishedCount }}</span>
          </template>
        </common-table>
      </div>
    </template>
    <template #drawer-panel>
      <common-drawer v-if="visibleDetailDrawer"
                     size="100%"
                     :title="drawerTitle"
                     :visible="visibleDetailDrawer"
                     @close="onDetailClose">
        <template #drawer>
          <test-Detail :id="id"
                       :planType='planType'
                       :planId='planId'
                       :deptId='deptId'></test-Detail>
        </template>
      </common-drawer>
    </template>
  </list-layout>
</template>

<style scoped>
.number-click {
  text-decoration: underline;
  cursor: pointer;
}
</style>
<script>
import Vue from 'vue'
import { P8ListLayout as ListLayout } from '~/index'
import { P8Table as CommonTable } from '~/index'
import { P8Button as CommonButton } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'
import { P8Search as SearchFormList } from '~/index'
import testDetail from './testDetail'
import { getTaskStatusInfo } from './commonBusinessJs'
const columns = [
  {
    title: '序号',
    type: 'index',
    width: 55,
    align: 'center'
  },
  {
    title: '所属领域',
    dataIndex: 'territoryDicName',
    width: 100,
    align: 'center'
  },
  {
    title: '项目名称',
    dataIndex: 'taskName',
    align: 'left',
    minWidth: 200
  },
  {
    title: '项目类型',
    dataIndex: 'projectClassifyName',
    width: 100,
    align: 'center'
  },
  {
    title: '任务总数',
    scopedSlots: { customRender: 'custom' },
    dataIndex: 'taskCount',
    width: 150,
    align: 'left'
  },
  {
    title: '已完成任务',
    scopedSlots: { customRender: 'custom' },
    dataIndex: 'planFinishedCount',
    width: 150,
    align: 'left'
  },
  {
    title: '未完成任务',
    scopedSlots: { customRender: 'custom' },
    dataIndex: 'unfinishedCount',
    width: 150,
    align: 'left'
  },
  {
    title: '计划完成率',
    dataIndex: 'plannedCompletionRate',
    width: 150,
    align: 'left'
  },
    {
    title: '备注',
    scopedSlots: { customRender: 'custom' },
    dataIndex: 'remark',
    width: 150,
    align: 'left'
  }
]

export default {
  name: 'ModelList',
  components: {
    ListLayout,
    CommonTable,
    CommonButton,
    SearchFormList,
    CommonDrawer,
    'test-Detail': testDetail
  },
  provide () { // 使用 provide对深层组件进行数据信息传递 例:taskOperating/Progress.vue中 inject搭配computed接收数据
    return {
      getPlanInfo: () => this.planInfo
    }
  },
  data () {
    return {
      drawerTitle: '',
      comp: this,
      visibleDetailDrawer: false,
      queryParam: {},
      planInfo: {},
      planId: '',
      planType: '',
      deptId: '',
      tableApi: 'PlanFinishRate.planCompleteList',
      columns: columns,
      tableHeight: 1,
      id: '',
      allStatus: [],
      searchData: [
        {
          type: 'datetimeRange',
          labelText: '计划完成时间',
          fieldName: 'beginEndTime',
          defaultValue: [],
          placeholder: ['开始日期', '结束日期'],
          fieldConfig: {
            format: 'YYYY-MM-DD'
          }
        },
        {
          type: 'treeSelect',
          labelText: '所属型号',
          fieldName: 'modelIds',
          placeholder: '请选择所属型号',
          multiple: true,
          optionUrl: {
            api: 'commonModelTree.modelTree',
            // label: 'modelCode',
            params: { dicType: 'OWNER_TYPE' }
          },
          treeData: []
        },
        {
          type: 'treeSelect',
          labelText: '项目类型',
          fieldName: 'kprojectClassifyId',
          placeholder: '请选择项目类型',
          multiple: true,
          optionUrl: {
            api: 'ProjectApply.projectClassifyTree',
            params: {},
            // label: 'name',
            value: 'id'
          },
          treeData: []
        }
        // {
        //   type: 'multiple', // 控件类型
        //   labelText: '项目分级', // 控件显示的文本
        //   fieldName: 'projectOrderIds',
        //   placeholder: '请选择项目分级',
        //   optionUrl: {
        //     api: 'thirdPartInterface.getDic',
        //     params: { dicType: 'PROJECT_ORDER' }
        //   },
        //   options: []
        // }
      ]
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
  computed: {

  },
  methods: {
    getAllStatusOptions () {
      let _this = this
      getTaskStatusInfo({ currentStatus: 'all' }).then(data => {
        _this.allStatus = data
        let multipleData = _this.searchData.filter(item => item.type === 'multiple')
        multipleData[1].options = data
      })
      _this.$api['planInfoManager.loadPlanStatusLimitStrategy']().then(function (res) {
        console.log(res, 'res')
        if (res) {
          _this.$store.dispatch('setPlanStatusLockMap', res['plan'])
          _this.$store.dispatch('setTaskStatusLockMap', res['task'])
        }
      })
    },
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
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
      Object.keys(that.queryParam).forEach(key => { that.queryParam[key] = '' })
      Vue.nextTick(function () {
        that.$refs.table.searchData()
      })
    },
    test (row, type, title) {
      console.log(row, '查看type的构建参数')
      this.visibleDetailDrawer = true
      this.drawerTitle = '查看' + (row.modelName || '') + (title || '')
      let types = []
      if (type) {
        types.push(type)
      } else {
        types.push('')
      }
      this.planType = types
      console.log(row.wholeId)
      this.planId = row.id
    },
    onDetailClose () {
      this.visibleDetailDrawer = false
    }
  }
}

</script>
