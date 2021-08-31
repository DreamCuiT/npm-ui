<template>
  <normal-layout :splitLayout="false">
    <template #north>
      <!-- <search-form-list :dataSource="searchData"
                        :resetAfterToSearch="false"
                        @search="search"
                        @re-set="reset"></search-form-list> -->
    </template>
    <template #west>
      <common-tree :treeApi="treeApi"
                   :treeParam="{taskTabType:'overall'}"
                   @select="onSelect"></common-tree>
    </template>
    <template #center>
      <common-table ref="table"
                    :api="tableApi"
                    :columns="columns"
                    :params="tableOtherParams"
                    :tableConfig="tableConfig"
                    :pagination="true"
                    :showSearchRow="true"
                    :flex="250"
                    filter-third-menu="planChange"
                    @open-third-menu="openThirdMenu"
                    @requested-table-data="requestedTableData">
        <template #name="{ scope, thirdMenuData }">
<!--           <el-tooltip-->
<!--                  effect="dark"-->
<!--                  :content="'未分解'"-->
<!--                  placement="top"-->
<!--                  class="icon-style"-->
<!--           >-->
<!--               <span v-if="scope.row.parentId && scope.row.isLeaf === 0" class="p8 icon-undifferentiated"></span>-->
<!--           </el-tooltip>-->
          <span
                class="underline"
                @click="drillCol(scope, thirdMenuData)">{{ scope.row.name }}</span>
         <!-- <span v-if="!scope.row.parentId">{{ scope.row.name }}</span>-->
        </template>
        <template #customIcon="{ scope }">
          <common-status-icon v-if="scope.row.dataType"
                              :status-name="statusName"
                              :status-key="scope.row.managerStatus"></common-status-icon>
        </template>
        <template #monitorpoint="{ scope }">
          <span v-for="item in monitorpointIconHandle(scope.row)"
                :key="item"
                style="padding: 0 2px">
            <i :class="item"></i>
          </span>
        </template>
        <template #overdue="{ scope }">
          <div v-html="overdueTextFun(scope.row)"></div>
        </template>
        <template #forecastBeginDate="{ scope }">
          <div v-html=" setForecastDateStyle( scope.row ,'forecastBeginDate')">
          </div>
        </template>
        <template #forecastEndDate="{ scope }">
          <div v-html=" setForecastDateStyle( scope.row ,'forecastEndDate')">
          </div>
        </template>
      </common-table>
      <revenue-view v-if="revenueBudgetVisible"
                    :visible="revenueBudgetVisible"
                    :otherParam="revenueBudgetParam"
                    @close-dialog="revenueBudgetClose">
      </revenue-view>
    </template>
    <template #drawer-panel>
      <common-drawer size="100%"
                     :visible="visible"
                     direction="ttb"
                     :drawerConfig="drawerConfig"
                     @close="closeDrawer">
        <template #drawer>
          <menu-layout :third-menu-param="thirdMenuParam"
                       :default-menu="defaultMenu"
                       filter-third-menu="planChangeplanExecute"></menu-layout>
        </template>
      </common-drawer>
    </template>

  </normal-layout>
</template>
<script>
import { P8NormalLayout as NormalLayout } from '~/index'
import { P8Tree as CommonTree } from '~/index'
import { P8Table as CommonTable } from '~/index'
import { P8StatusIcon as CommonStatusIcon } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'
import { P8MenuLayout as MenuLayout } from '~/index'
// import { P8Search as SearchFormList } from '~/index'
import { getTaskStatusInfo } from '@/utils/commonBusiness'
import { overdueTextHandle } from '@/utils/common'
import { getMonitorData, getBudgetData } from '@/components/workLayout/Components/projectProgress/Components/layoutData'
import RevenueView from '@/components/workLayout/Components/projectProgress/Components/taskProgressInformation/Components/revenueView'
import moment from 'moment'
import Vue from 'vue'
import langCn from '@/config/const/lang_cn'
// import { Tooltip } from '~/index'
export default {
  name: 'Normal',
  components: {
    NormalLayout,
    CommonDrawer,
    CommonStatusIcon,
    CommonTree,
    CommonTable,
    // SearchFormList,
    MenuLayout,
    RevenueView
    // 'el-tooltip': Tooltip
  },
  data () {
    const columns = [
        {
            title: '序号',
            type: 'index',
            width: 45,
            align: 'center'
        },
      // {
      //   title: '',
      //   type: 'index',
      //   dataIndex: 'customIcon',
      //   width: 45,
      //   align: 'center',
      //   scopedSlots: {
      //     customRender: 'custom'
      //   }
      // },
      // {
      //   title: langCn.thirdMenu,
      //   type: 'index',
      //   dataIndex: 'treeMenuIcon',
      //   scopedSlots: { customRender: 'thirdMenu' },
      //   width: 45,
      //   align: 'center',
      //   formatter: function (row) {
      //     // 控制三级菜单是否显示
      //     // if (row.dataType !== 'task') {
      //     //   return false
      //     // }
      //     return true
      //   }
      // },
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
          type: 'multiple',
          optionUrl: {
            api: 'ProjectApply.getModelListData',
            label: 'modelCode',
            value: 'id',
            params: {}
          }
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
      // {
      //   title: langCn.taskStatus,
      //   dataIndex: 'statusdisplay',
      //   width: 100,
      //   align: 'center'
      // },
      {
        title: langCn.overdueRemainingDays,
        dataIndex: 'overdue',
        width: 120,
        align: 'center',
        scopedSlots: {
          customRender: 'custom'
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
      // {
      //   title: langCn.actualStartDate,
      //   dataIndex: 'realBeginDate',
      //   width: 120,
      //   align: 'center'
      // },
      // {
      //   title: langCn.actualEndDate,
      //   dataIndex: 'realEndDate',
      //   width: 120,
      //   align: 'center'
      // },
      {
        title: langCn.forecastStartDate,
        dataIndex: 'forecastBeginDate',
        width: 120,
        align: 'center',
        scopedSlots: {
          customRender: 'custom'
        }
      },
      {
        title: langCn.forecastEndDate,
        dataIndex: 'forecastEndDate',
        width: 120,
        align: 'center',
        scopedSlots: {
          customRender: 'custom'
        }
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
      // {
      //   type: 'checkbox',
      //   labelText: '展示父级任务',
      //   fieldName: 'isShowParent',
      //   defaultValue: false
      // }
    ]
    return {
      visible: false,
      treeApi: 'commonProjectTree.projectTreeByMyTask',
      tableApi: 'taskManager.overallTaskList',
      columns,
      statusName: 'managerStatus',
      searchData,
      tableOtherParams: {},
      layersParams: {},
      monitorpointDataArray: [],
      revenueBudgetParam: {},
      revenueBudgetVisible: false,
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
    let that = this
    getMonitorData({ monitorId: [] }).then(res => {
      that.monitorpointDataArray = res
    })
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
    // 点击项目/计划列钻取进入三级菜单-计划编制页面
    drillCol (scope, thirdMenuData) {
      // 三级菜单过滤计划变更
      if (thirdMenuData.length) {
        let planManager = thirdMenuData.filter(o => o.name === 'ProblemListManagement')
        this.openThirdMenu(scope.row, planManager[0])
      }
    },
    handleSelectionChange (val) {
      this.selectedRowKeys = []
      this.selectedRows = []
      this.multipleSelection = val
      val.map(item => {
        this.selectedRowKeys.push(item.id)
        this.selectedRows.push(item)
      })
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
    openThirdMenu (record, item) {
      this.defaultMenu = item
      this.thirdMenuParam = {
        ...record,
        allStatus: this.allStatus,
        progress: Number((record.progress * 100).toFixed(0)),
        taskId: record.taskId,
        wholeDescribeId: record.wholeDescribeId,
        planInfoId: record.planInfoId,
        planInfoStatus: record.executeState,
        createPage: 'decompose',
        currentPage: 'overallPlanning'
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
    },
    monitorpointIconHandle (row) {
      let that = this
      let tempIcon = []
      if (row.monitorpointArray && row.monitorpointIconArray) {
        let monitorpointArray = row.monitorpointArray.split(',')
        monitorpointArray.forEach((item, index) => {
          tempIcon.push({ 'id': item, 'icon': that.monitorpointDataArray[item].icon, 'title': that.monitorpointDataArray[item].name })
        })
      }
      if (row.revenueBudgetId) {
        tempIcon.push({ 'id': row.revenueBudgetId, 'icon': 'p8 icon-cost', 'title': '经费标识' })
      }
      return tempIcon
    },
    iconClick (row) {
      let that = this
      if (row.revenueBudgetId) {
        getBudgetData({ revenueBudgetId: row.revenueBudgetId }).then(res => {
          that.revenueBudgetParam = res
          that.revenueBudgetVisible = true
        })
      }
    },
    revenueBudgetClose () {
      this.revenueBudgetVisible = false
      this.revenueBudgetParam = Object.assign({})
    },
    setForecastDateStyle (row, type) {
      if (row.forecastBeginDate || row.forecastEndDate) {
        if (type === 'forecastBeginDate') {
          let forecastBeginDate = new Date(row.forecastBeginDate)
          let planBeginDate = new Date(row.planBeginDate)
          if (forecastBeginDate.getTime() === planBeginDate.getTime()) {
            return moment(row.forecastBeginDate).format('YYYY-MM-DD')
          } else {
            let currDate = moment(row.forecastBeginDate).format('YYYY-MM-DD')
            return `<span style="color: #F80012">${currDate}</span>`
          }
        }
        if (type === 'forecastEndDate') {
          let forecastEndDate = new Date(row.forecastEndDate)
          let planEndDate = new Date(row.planEndDate)
          if (forecastEndDate.getTime() === planEndDate.getTime()) {
            return moment(row.forecastEndDate).format('YYYY-MM-DD')
          } else {
            let currDate = moment(row.forecastEndDate).format('YYYY-MM-DD')
            return `<span style="color: #F80012">${currDate}</span>`
          }
        }
      }

      return ''
    },
     // 超期/剩余天数调用公共方法
    overdueTextFun (row) {
      return overdueTextHandle(row)
    },
    withdrawTaskApprove (rowInfo) {
      let taskId = rowInfo.taskId
      const url = 'taskManager.withdrawTaskApprove'
      const _this = this
      _this.$confirm('是否要撤回审批', '提示', {
        confirmButtonText: '撤回',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.$api[url]({ taskId: taskId }).then(res => {
          _this.$message({
            type: 'success',
            message: '审批已撤回'
          })
          // 注释之后页面撤回审批后才可刷新
          // Vue.nextTick(function () {
          _this.$refs.table.searchData()
          // })
        })
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
