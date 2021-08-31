<template>
  <list-layout>
    <template #north>
      <div class="search-container">
        <search-form-list ref="search"
                          :dataSource="dataSource"
                          @search="search"
                          @re-set="reset"></search-form-list>
      </div>
    </template>
    <template #center>
      <common-table ref="table"
                    :comp="comp"
                    :columns="columns"
                    :params="queryParams"
                    :api="tableApi"
                    @open-third-menu="openThirdMenu">
        <template #name="{scope,thirdMenuData}">
          <span class="underline"
                @click="drillCol(scope,thirdMenuData)">{{ scope.row.name }}</span>
        </template>
      </common-table>
      <!-- @row-click="tempRowClick" -->
    </template>
    <template #drawer-panel>
      <common-drawer v-if="visibleResourcesDrawer"
                     :visible="visibleResourcesDrawer"
                     placement="top"
                     direction="ttb"
                     size="100%"
                     @close="onEditResourcesClose">
        <template #drawer>
          <!-- <menu-layout :defaultMenu="defaultMenu"
            :third-menu-param="thirdMenuParam"></menu-layout> -->
          <!-- <temp-menu></temp-menu>  v-if="drawerTitle"-->
          <!-- <problem-list :thirdMenuParam="thirdMenuParam"></problem-list> -->
          <menu-layout :third-menu-param='thirdMenuParam'
                       :default-menu="defaultMenu"></menu-layout>
        </template>
      </common-drawer>
    </template>
  </list-layout>
</template>
<script>
import Vue from 'vue'
import { P8ListLayout as ListLayout } from '~/index'
// import { P8MenuLayout as MenuLayout } from '~/index'
import { P8Table as CommonTable } from '~/index'
import { P8Search as SearchFormList } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'
// import TempMenu from './tempMenu'
import { P8MenuLayout as MenuLayout } from '~/index'
export default {
  name: 'resourceManagementr',
  data () {
    const dataSource = [

      {
        type: 'text', // 控件类型
        labelText: '项目名称', // 控件显示的文本
        fieldName: 'productName',
        placeholder: '请输入项目名称'
      },
      {
        type: 'text', // 控件类型
        labelText: '项目编号', // 控件显示的文本
        fieldName: 'pjCode',
        placeholder: '请输入项目编号', // 默认控件的空值文本
        fieldEvent: {
          click: 'clickEvent(this)'
        }
      },
      {
        type: 'multiple',
        labelText: '所属型号',
        defaultValue: [],
        fieldName: 'modelInformationId',
        placeholder: '请选择所属型号',
        optionUrl: {
          api: 'ProjectApply.getModelListData',
          label: 'modelCode',
          value: 'id',
          params: {}
        },
        treeData: []
      },
      // {
      //   type: 'treeSelect',
      //   multiple: true,
      //   labelText: '管理部门',
      //   fieldName: 'departmentId',
      //   defaultValue: [],
      //   placeholder: '请选择管理部门',
      //   optionUrl: {
      //     api: 'ProjectApply.deptTree',
      //     params: {}
      //   },
      //   treeData: []
      // },
      {
        type: 'treeSelect',
        labelText: '项目类型',
        defaultValue: [],
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
      //   type: 'multiple',
      //   defaultValue: [],
      //   optionUrl: {
      //     api: 'thirdPartInterface.getDic',
      //     params: { dicType: 'PROJECT_ORDER' }
      //   },
      //   options: [],
      //   labelText: '项目分级', // 控件显示的文本
      //   fieldName: 'projectOrderId',
      //   placeholder: '请选择项目分级'
      // }
    ]
    const columns = [
      {
        title: '序号',
        type: 'index',
        width: 55,
        align: 'center'
      },
      {
        title: '#',
        type: 'index',
        dataIndex: 'thirdMenu',
        scopedSlots: { customRender: 'thirdMenu' },
        width: 45,
        align: 'center'
      },
      {
        title: '型号代号',
        width: 200,
        align: 'center',
        dataIndex: 'modelCode'
      },
      {
        title: '项目编号',
        dataIndex: 'pjCode',
        minWidth: 200,
        align: 'center'
      },
      {
        title: '项目名称',
        drillable: true,
        scopedSlots: { customRender: 'custom' },
        dataIndex: 'name',
        minWidth: 500,
        align: 'left'
      },
      {
        title: '项目类型',
        width: 200,
        align: 'center',
        dataIndex: 'kprojectClassifyname'
      }
      // {
      //   title: '项目分级',
      //   width: 200,
      //   align: 'center',
      //   dataIndex: 'projectOrderDisplay'
      // }
      // ,
      // {
      //   title: '管理部门',
      //   width: 200,
      //   align: 'center',
      //   dataIndex: 'departmentName',
      //   formatter: function (row) {
      //     if (row.pdepartmentName) {
      //       return row.pdepartmentName + '-' + row.departmentName
      //     } else {
      //       return row.departmentName
      //     }
      //   }
      // }
    ]
    return {
      comp: this,
      dataSource,
      columns,
      queryParams: {},
      tableApi: 'ProjectApply.projectList',
      record: {},
      drawerTitle: '',
      visibleResourcesDrawer: false,
      defaultMenu: {},
      thirdMenuParam: {},
      currentRouterPath: ''
    }
  },
  mounted () {
    this.currentRouterPath = this.$route.path
  },
  methods: {
    // 点击项目/计划列钻取进入三级菜单-计划编制页面
    drillCol (scope, thirdMenuData) {
      console.log(scope, 'scope')
      if (thirdMenuData.length) {
        let planManager = thirdMenuData.filter(o => o.name === 'planManager')
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
    search (params) {
      this.queryParams = params
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
    },
    // tempRowClick (record) {
    //   this.drawerTitle = '问题管理'
    //   this.thirdMenuParam.id = record.id
    //   this.visibleResourcesDrawer = true
    // },
    openThirdMenu (record, item) {
      this.visibleResourcesDrawer = true
      this.defaultMenu = item
      this.thirdMenuParam.id = record.id
    },
    onEditResourcesClose () {
      this.$router.push({ path: this.currentRouterPath })
      this.visibleResourcesDrawer = false
    }
  },
  components: {
    ListLayout,
    // MenuLayout,
    CommonTable,
    SearchFormList,
    CommonDrawer,
    MenuLayout
    // TempMenu,
  }
}
</script>
<style lang="scss" scoped>
i.el-icon-menu {
  color: #1890ff;
  font-size: 16px;
}
.three-menu {
  .menu-item {
    display: flex;
    align-items: center;
    padding: 5px;
    &:hover {
      background-color: #e6f7ff;
      cursor: pointer;
    }
    span {
      padding-left: 6px;
      font-size: 14px;
    }
  }
}
/deep/ .el-container .el-main > div > div {
  background: none;
}
/deep/ .custom-drawer {
  background-color: #fafbff;
}
</style>
