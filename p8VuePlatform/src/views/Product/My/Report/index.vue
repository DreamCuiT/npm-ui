<template>
  <el-container>
    <el-header>
      <el-menu :default-active="activeIndex"
               class="el-menu-demo"
               mode="horizontal"
               text-color="#333333"
               active-text-color="#1890ff"
               @select="menuSelect">
        <el-menu-item index="1">周报</el-menu-item>
        <el-menu-item index="2">月报</el-menu-item>
        <el-menu-item index="3">日报</el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <template v-if="activeIndex == 1">
        <weak-report></weak-report>
      </template>
      <template v-if="activeIndex == 2">
        <month-report></month-report>
      </template>
      <template v-if="activeIndex == 3">
        <day-report></day-report>
      </template>
    </el-main>
  </el-container>
</template>
<script>
import { Container, Header, Main, Menu, MenuItem } from '~/index'
import dayReport from './Components/dayReport'
import monthReport from './Components/monthReport'
import weakReport from './Components/weakReport'
import Vue from 'vue'
export default {
  name: 'myTask',
  components: {
    dayReport,
    weakReport,
    monthReport,
    'el-container': Container,
    'el-header': Header,
    'el-main': Main,
    'el-menu': Menu,
    'el-menu-item': MenuItem
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
        title: '#',
        type: 'index',
        dataIndex: 'treeMenuIcon',
        scopedSlots: { customRender: 'thirdMenu' },
        width: 45,
        align: 'center',
        formatter: function (row) {
          // 控制三级菜单是否显示
          if (row.dataType !== 'task') {
            return false
          }
          return true
        }
      },
      {
        title: '项目/任务',
        dataIndex: 'name',
        drillable: true,
        minWidth: 300,
        align: 'left',
        scopedSlots: {
          customRender: 'custom'
        }
      },
      {
        title: '任务标识',
        dataIndex: 'monitorpoint',
        width: 120,
        align: 'center',
        scopedSlots: {
          customRender: 'custom'
        }
      },
      {
        title: '完成情况',
        dataIndex: 'status',
        width: 120,
        align: 'center',
        formatter: (row) => {
          let currStatus = this.allStatus.filter(item => item.value === row.status)
          if (row.dataType === 'task' && currStatus.length) {
            return `${row.managerstatusdisplay},${currStatus[0].label}`
          }
        }
      },
      {
        title: '超期/剩余天数',
        dataIndex: 'overdue',
        width: 120,
        align: 'center',
        scopedSlots: {
          customRender: 'custom'
        }
      },
      {
        title: '责任人',
        dataIndex: 'realName',
        width: 90,
        align: 'center'
      },
      {
        title: '角色',
        dataIndex: 'roleName',
        minWidth: 120,
        align: 'center'
      },
      {
        title: '部门',
        dataIndex: 'dName',
        minWidth: 150,
        align: 'center'
      },
      {
        title: '预测开始时间',
        dataIndex: 'forecastBeginDate',
        width: 100,
        align: 'center'
      },
      {
        title: '预测完成时间',
        dataIndex: 'forecastEndDate',
        width: 100,
        align: 'center'
      },
      {
        title: '完成百分比',
        dataIndex: 'progress',
        width: 100,
        align: 'center',
        formatter: function (row) {
          if (row.dataType === 'task') {
            return (row.progress * 100).toFixed(0) + '%'
          }
        }
      },
      {
        title: '计划开始时间',
        dataIndex: 'planBeginDate',
        width: 100,
        align: 'center'
      },
      {
        title: '计划完成时间',
        dataIndex: 'planEndDate',
        width: 100,
        align: 'center'
      },
      {
        title: '实际开始时间',
        dataIndex: 'realBeginDate',
        width: 100,
        align: 'center'
      },
      {
        title: '实际完成时间',
        dataIndex: 'realEndDate',
        width: 100,
        align: 'center'
      }
    ]
    let searchData = [
      {
        type: 'datetimeRange',
        labelText: '计划时间',
        fieldName: 'beginEndTime',
        defaultValue: '',
        placeholder: ['开始日期', '结束日期'],
        fieldConfig: {
          format: 'YYYY-MM-DD'
        }
      },
      {
        type: 'multiple',
        labelText: '任务状态',
        fieldName: 'status',
        defaultValue: '',
        placeholder: '',
        optionUrl: {
          lable: 'label'
        },
        options: []
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
      },
      {
        type: 'checkbox',
        labelText: '展示父级任务',
        fieldName: 'isShowParent',
        defaultValue: false
      }
    ]
    return {
      comp: this,
      visible: false,
      activeIndex: '1',
      treeApi: 'commonProjectTree.projectTreeByMyTask',
      // treeApi: 'ProjectApply.fieldModelTree',
      tableApi: 'taskManager.taskList',
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
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
    menuSelect (index, indexPath) {
      this.activeIndex = index
      if (index === '1') {
        this.tableOtherParams = {}
      } else {
        this.tableOtherParams = { mark: 'mark_02' }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .custom-drawer {
  background-color: #fafbff;
  .el-drawer__close-btn {
    z-index: 10;
  }
}
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
}
.el-header {
  padding: 0;
  height: 50px !important;
}
</style>
