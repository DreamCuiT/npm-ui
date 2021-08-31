<template>
  <normal-layout :splitLayout="false">
    <template #north>
    </template>
    <template #west>
      <common-tree :treeApi="treeApi"
                   @select="onSelect"></common-tree>
    </template>
    <template #center>
      <common-table ref="table"
                    :api="tableApi"
                    :columns="columns"
                    :params="tableOtherParams"
                    :tableConfig="tableConfig"
                    :customHeight="customHeight"
                    :pagination="true"
                    :showSearchRow="true"
                    :flex="250"
                    filter-third-menu="planChange"
                    @open-third-menu="openThirdMenu"
                    @requested-table-data="requestedTableData">
        <template #name="{ scope, thirdMenuData }">
          <span
                class="underline"
                @click="drillCol(scope, thirdMenuData)">{{ scope.row.name }}</span>
        </template>
      </common-table>
    </template>
    <template #drawer-panel>
      <common-drawer size="100%"
                     :visible="visible"
                     direction="ttb"
                     :drawerConfig="drawerConfig"
                     @close="closeDrawer">
        <template #drawer>
          <courtyard-task-index :third-menu-param="thirdMenuParam"
                       :default-menu="defaultMenu"
                       filter-third-menu="planChangeplanExecute"></courtyard-task-index>
        </template>
      </common-drawer>
    </template>

  </normal-layout>
</template>
<script>
import CourtyardTaskIndex from './Components/courtyardTaskIndex'
import { P8NormalLayout as NormalLayout } from '~/index'
import { P8Tree as CommonTree } from '~/index'
import { P8Table as CommonTable } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'
import { getTaskStatusInfo } from '@/utils/commonBusiness'
import Vue from 'vue'
import langCn from '@/config/const/lang_cn'
const mh = document.documentElement.clientHeight - 130
export default {
  name: 'Normal',
  components: {
    NormalLayout,
    CommonDrawer,
    CommonTree,
    CommonTable,
    CourtyardTaskIndex
  },
  data () {
    const columns = [
      {
            title: '序号',
            type: 'index',
            width: 45,
            align: 'center'
      },
      {
        title: langCn.modelCode,
        width: 130,
        dataIndex: 'modelCode',
        align: 'center',
        formatter (row, column, cellValue, index) {
          return cellValue
        },
        filterable: true, // 列上增加输入框搜索
        iconDisplay: false, // 表头点击搜索图标，出现搜索条件
        filter: {
              val: '',
              type: 'text'
        }
      },
      {
        title: langCn.pjcode,
        minWidth: 150,
        dataIndex: 'projectCode',
        align: 'center',
        formatter (row, column, cellValue, index) {
          return cellValue
        },
        filterable: true, // 列上增加输入框搜索
        iconDisplay: false, // 表头点击搜索图标，出现搜索条件
        filter: {
              val: '',
              type: 'text'
        }
      },
      {
        title: langCn.projectAndPlan,
        dataIndex: 'name',
        drillable: true,
        minWidth: 300,
        align: 'left',
        scopedSlots: {
          customRender: 'custom'
        },
        filterable: true, // 列上增加输入框搜索
        iconDisplay: false, // 表头点击搜索图标，出现搜索条件
        filter: {
              val: '',
              type: 'text'
        }
      },
      {
        title: langCn.planStartDate,
        dataIndex: 'planBeginDate',
        width: 120,
        align: 'center'
      },
      {
        title: langCn.planEndDate,
        dataIndex: 'planEndDate',
        width: 120,
        align: 'center'
      },
      {
        title: langCn.status,
        dataIndex: 'executeStateDisplay',
        width: 120,
        align: 'center'
      }
    ]
    let searchData = [
      {
        type: 'datetimeRange',
        labelText: '计划时间',
        fieldName: 'beginEndTime',
        defaultValue: [],
        placeholder: ['开始日期', '结束日期']
      },
      {
        type: 'text',
        labelText: '任务名称',
        fieldName: 'taskName',
        defaultValue: '',
        placeholder: '请输入任务名称'
      },
      {
        type: 'text',
        labelText: '项目编号',
        fieldName: 'projectCode',
        defaultValue: '',
        placeholder: '请输入项目编号'
      },
      {
        type: 'text',
        labelText: '项目名称',
        fieldName: 'projectName',
        defaultValue: '',
        placeholder: '请输入项目名称'
      }
    ]
    return {
      customHeight: mh,
      visible: false,
      treeApi: 'courtyardTask.threeLayersTree',
      tableApi: 'courtyardTask.getWholeMyCourtTask',
      columns,
      searchData,
      tableOtherParams: {},
      layersParams: {},
      tableConfig: {
        'default-expand-all': true
      },
      planInfo: {},
      drawerConfig: {
        modal: false
      },
      allStatus: [],
      currentRouterPath: '',
      defaultMenu: {},
      thirdMenuParam: {}
    }
  },
  created () {

  },
  mounted () {
    this.currentRouterPath = this.$route.path
    this.getAllStatusOptions()
    let _this = this
    this.$bus.$on('refresh', function () {
      Vue.nextTick(function () {
        _this.$refs.table.searchData()
      })
    })
  },
  methods: {
    // 点击项目/计划列钻取-计划编制页面
    drillCol (scope, thirdMenuData) {
      this.openThirdMenu(scope.row)
    },
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
    closeDrawer () {
      this.visible = false
      this.$router.push({ path: this.currentRouterPath })
    },
    onSelect (node) {
      let me = node
      if (me.layersParams) {
        this.layersParams = me.layersParams
        this.tableOtherParams.layersParams = Object.assign({}, me.layersParams)
      } else {
        this.layersParams = {}
      }
      this.$refs.table.searchData()
    },
    search (param) {
      let newParams = { ...this.tableOtherParams, ...param }
      // 项目类别ID
      this.tableOtherParams = newParams
      let _this = this
      Vue.nextTick(function () {
        _this.$refs.table.queryList()
      })
    },
    reset () {
      let that = this
      Object.keys(that.tableOtherParams).forEach(function (key) { return (that.tableOtherParams[key] = null) })
      this.tableOtherParams.layersParams = Object.assign({}, this.layersParams)
      // console.log(this.tableOtherParams, 'this.tableOtherParams-opop')
      let _this = this
      Vue.nextTick(function () {
        _this.$refs.table.searchData()
      })
    },
    requestedTableData (tableData) {
      if (Object.keys(this.planInfo).length) {
        const _this = this
        let filterItem = null
        tableData.forEach(item => {
          filterItem = item.children.filter(citem => citem.id === _this.planInfo.id)
        })
        if (filterItem) {
          _this.planInfo = { allStatus: this.allStatus, ...filterItem[0], progress: filterItem[0].progress * 100 }
        }
      }
    },
    openThirdMenu (record) {
      this.thirdMenuParam = {
        ...record,
        allStatus: this.allStatus,
        progress: Number((record.progress * 100).toFixed(0)),
        taskId: record.taskId,
        wholeDescribeId: record.wholeDescribeId,
        planInfoId: record.planInfoId,
        planInfoStatus: record.executeState,
        createPage: 'decompose',
        currentPage: 'courtyardTaskGantt'
      }
      this.visible = true
    },
    getAllStatusOptions () {
      let _this = this
      getTaskStatusInfo({ currentStatus: 'all' }).then(data => {
        _this.allStatus = data
      })
      // 加载通用gantt操作权限决策，并存入vuex
      _this.$api['planInfoManager.loadPlanStatusLimitStrategy']().then(function (res) {
        if (res) {
          _this.$store.dispatch('setPlanStatusLockMap', res['plan'])
          _this.$store.dispatch('setTaskStatusLockMap', res['task'])
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.base-custom-style {
  color: $base-white-color;
  padding: 0 2px;
  font-size: 12px;
  border-radius: 10px;
  cursor: pointer;
  &.approve {
    background-color: $base-red-color;
    padding-right: 6px;
  }
  &.leaf {
    background-color: $base-green-color;
  }
  &.canApprove {
    background-color: $base-green-color;
    padding-right: 6px;
  }
}
</style>
