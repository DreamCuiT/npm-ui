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
          <template #planCount="{scope}">
            <span class="number-click"
                  @click="test(scope.row,'' ,'计划项')">{{ scope.row.planCount }}</span>
          </template>
          <template #unfinishedCount="{scope}">
            <span class="number-click"
                  @click="test(scope.row,'6020', '未完成项')">{{ scope.row.unfinishedCount }}</span>
          </template>
          <template #planFinishedCount="{scope}">
            <span class="number-click"
                  @click="test(scope.row,'6070', '完成项')">{{ scope.row.planFinishedCount }}</span>
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
    width: 50,
    align: 'center'
  },
  {
    title: '部门名称',
    dataIndex: 'deptUnitName',
    align: 'center',
    width: 200
  },
  {
    title: '计划项',
    scopedSlots: { customRender: 'custom' },
    dataIndex: 'planCount',
    align: 'left',
    minWidth: 200
  },
  {
    title: '未完成项',
    scopedSlots: { customRender: 'custom' },
    dataIndex: 'unfinishedCount',
    align: 'left',
    minWidth: 200
  },
  {
    title: '完成项',
    scopedSlots: { customRender: 'custom' },
    dataIndex: 'planFinishedCount',
    align: 'left',
    minWidth: 200
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
  data () {
    return {
      drawerTitle: '',
      comp: this,
      visibleDetailDrawer: false,
      queryParam: {},
      tableApi: 'PlanFinishRate.deptplanRateList',
      columns: columns,
      tableHeight: 1,
      planId: '',
      planType: '',
      deptId: '',
      id: '',
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
          fieldName: 'modelCodes',
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
          fieldName: 'kProjectClassifyIds',
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
        //  {
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
        // ,
        // {
        //   type: 'treeSelect',
        //   labelText: '管理部门',
        //   fieldName: 'manageDeptId',
        //   defaultValue: [],
        //   placeholder: '请选择管理部门',
        //   optionUrl: {
        //     api: 'ProjectApply.deptTree',
        //     params: {}
        //   },
        //   treeData: []
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
        multipleData[2].options = data
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
      this.visibleDetailDrawer = true
      this.drawerTitle = '查看' + row.deptUnitName + title
      this.deptId = row.unitId ? row.unitId : ''
      let types = []
      console.log(type, '查看type的构建参数')
      if (type) {
        types.push(type)
      } else {
        types.push('')
      }
      this.planType = types
      console.log(this.drawerTitle, this.deptId, this.planType, '构建请求参数！')
    },
    onDetailClose () {
      this.visibleDetailDrawer = false
    }
  }
}

</script>
