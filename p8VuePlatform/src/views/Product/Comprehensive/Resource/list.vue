<template>
  <list-layout>
    <template #north>
      <div class="search-container">
        <search-form-list ref="search" :dataSource="dataSource" @search="search" @re-set="reset"></search-form-list>
      </div>
    </template>
    <template #center>
      <common-table
        ref="table"
        :comp="comp"
        :columns="columns"
        :params="queryParams"
        :api="tableApi"
        @open-third-menu="openThirdMenu"
      >
      <!--  -->
      </common-table>
    </template>
    <template #drawer-panel>
      <common-drawer
        v-if="visibleResourcesDrawer"
        :visible="visibleResourcesDrawer"
        :title="drawerTitle"
        :drawerConfig="drawerConfig"
        placement="top"
        direction="ttb"
        size="100%"
        @close="onEditResourcesClose"
      >

        <template #drawer>
          <menu-layout :third-menu-param = 'thirdMenuParam' :default-menu="defaultMenu"></menu-layout>
          <!-- <team-manager :thirdMenuParam="thirdMenuParam"></team-manager> -->
        </template>
      </common-drawer>
    </template>
  </list-layout>
</template>
<script>
import Vue from 'vue'
import { P8ListLayout as ListLayout } from '~/index'
import { P8MenuLayout as MenuLayout } from '~/index'
import { P8Table as CommonTable } from '~/index'
import { P8Search as SearchFormList } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'
// import TempMenu from './tempMenu'
// import TeamManager from './teamManager'
export default {
  name: 'resourceManager',
  data () {
    const dataSource = [
      {
        type: 'treeSelect',
        multiple: true,
        labelText: '责任部门',
        fieldName: 'departmentId',
        defaultValue: [],
        placeholder: '选择责任部门',
        optionUrl: {
          api: 'ProjectApply.deptTree',
          params: {}
        },
        treeData: []
      },
      {
        type: 'select',
        optionUrl: {
          api: 'thirdPartInterface.getDic',
          params: { dicType: 'STAND_PROJECT_STATUS' }
        },
        options: [],
        labelText: '状态', // 控件显示的文本
        fieldName: 'status',
        placeholder: '选择状态',
        fieldConfig: {
          multiple: true
        }
      },
      {
        type: 'text', // 控件类型
        labelText: '项目名称', // 控件显示的文本
        fieldName: 'name',
        placeholder: '请输入项目名称'
      },
      {
        type: 'text', // 控件类型
        labelText: '内部流水代码', // 控件显示的文本
        fieldName: 'projectCode',
        placeholder: '请输入项目代码', // 默认控件的空值文本
        fieldEvent: {
          click: 'clickEvent(this)'
        }
      },
      // {
      //   type: 'select',
      //   optionUrl: {
      //     api: 'thirdPartInterface.getDic',
      //     params: { dicType: 'PROJECT_ORDER' }
      //   },
      //   options: [],
      //   labelText: '项目分级', // 控件显示的文本
      //   fieldName: 'projectOrder',
      //   placeholder: '选择项目分级',
      //   fieldConfig: {
      //     multiple: true
      //   }
      // },
      {
        type: 'select',
        labelText: '所属型号',
        fieldName: 'modelInformationId',
        placeholder: '选择型号代号1111',
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
        labelText: '项目类型',
        fieldName: 'kprojectClassifyId',
        placeholder: '选择项目类型',
        multiple: true,
        optionUrl: {
          api: 'ProjectApply.projectClassifyTree',
          params: {},
          // label: 'name',
          value: 'id'
        },
        treeData: []
      }
    ]
    const columns = [
      {
        title: '序号',
        type: 'index',
        width: 45,
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
        width: 120,
        align: 'center',
        dataIndex: 'modelCode'
      },
      {
        title: '项目编号',
        dataIndex: 'pjCode',
        minWidth: 180,
        align: 'center'
      },
      {
        title: '项目名称',
        dataIndex: 'name',
        minWidth: 300,
        align: 'left'
      },
      {
        title: '项目类型',
        width: 120,
        align: 'center',
        dataIndex: 'kprojectClassifyname'
      },
      // {
      //   title: '项目分级',
      //   width: 120,
      //   align: 'center',
      //   dataIndex: 'projectOrderDisplay'
      // },
      {
        title: '责任部门',
        minWidth: 180,
        align: 'center',
        dataIndex: 'departmentName',
        formatter: function (row) {
                if (row.pdepartmentName) {
                    return row.pdepartmentName + '-' + row.departmentName
                } else {
                    return row.departmentName
                }
            }
      },
      {
        title: '状态',
        width: 90,
        align: 'center',
        dataIndex: 'statusDisplay'
      },
      {
        title: '排序号',
        width: 90,
        align: 'center',
        dataIndex: 'indexNo'
      }
    ]
    return {
      drawerConfig: {
        modal: false
      },
      comp: this,
      dataSource,
      columns,
      queryParams: {},
      currentRouterPath: '',
      tableApi: 'ProjectApply.projectList',
      record: {},
      drawerTitle: '',
      visibleResourcesDrawer: false,
      defaultMenu: {},
      thirdMenuParam: {}
    }
  },
  mounted () {
    this.currentRouterPath = this.$route.path
  },
  methods: {
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
    //   this.drawerTitle = '团队管理'
    //   this.thirdMenuParam.id = record.id
    //   this.visibleResourcesDrawer = true
    // },
    openThirdMenu (record, item) {
      // debugger
      console.log(item)
      console.log(record)
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
    MenuLayout,
    CommonTable,
    SearchFormList,
    CommonDrawer
    // TempMenu
    // TeamManager
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
  background: none
}
/deep/ .custom-drawer {
  background-color: #FAFBFF;
}
</style>
