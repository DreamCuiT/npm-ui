<template>
  <normal-layout :normal-layout="normalLayout">
    <template #north>
      <el-button type="primary" @click="importSelect">导入</el-button>
    </template>
    <template #west>
      <common-tree :tree-api="treeApi" @select="onSelect" :tree-config="treeConfig" :tree-Param="treeParam"></common-tree>
    </template>
    <template #center>
      <div id="table-contain">
        <common-table ref='table'
                      :comp='comp'
                      :columns='columns'
                      :params='queryParam'
                      :useTreeFormat='useTreeFormat'
                      :useTreePId='useTreePId'
                      :pagination='pagination'
                      :api='tableApi'
                      :table-refresh='tableRefresh'
                      :table-config='tableConfig'
                      @selection-change='handleSelectionChange'>
        </common-table>
      </div>
    </template>
  </normal-layout>
</template>

<style>
  .ant-drawer-body{
    height: calc(100% - 55px);
  }
  .table-page-search-wrapper .ant-form-inline .ant-form-item {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    margin-bottom: 24px;
    margin-right: 0;
  }
  .table-page-search-wrapper .ant-form-inline .ant-form-item .ant-form-item-control-wrapper {
    -webkit-box-flex: 1;
    -ms-flex: 1 1;
    flex: 1 1;
    display: inline-block;
    vertical-align: middle;
  }
</style>
<script>
import { P8Table as CommonTable } from '~/index'
import { Button } from '~/index'
import { P8Tree as CommonTree } from '~/index'
import { P8NormalLayout as NormalLayout } from '~/index'

export default {
  name: 'ActivityImport',
  components: {
    NormalLayout,
    CommonTable,
    'el-button': Button,
    CommonTree
  },
  props: {
    taskId: {
      type: String,
      default: ''
    },
    activityImportType: {
      type: String,
      default: ''
    },
    autoScheduling: {
      type: String,
      default: ''
    },
    createPage: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      comp: this,
      queryParam: {},
      useTreeFormat: true,
      useTreePId: 'parentId',
      pagination: false,
      treeApi: 'planGanttManager.importActivityInfoClassifyTree',
      tableApi: 'planGanttManager.importActivityInfoTree',
      columns: [
        {
          title: '',
          type: 'selection'
        },
        {
          title: '活动名称',
          minWidth: 200,
          dataIndex: 'name'
        },
        {
          title: '活动编号',
          minWidth: 120,
          dataIndex: 'code'
        }
      ],
      treeConfig: {
        // showLine: true,
        // checkable: true
      },
      treeParam: {
        dataRange: 'select-all'
      },
      tableConfig: {
        defaultExpandAll: true
      },
      normalLayout: {
        west: {
          xs: 12, sm: 11, md: 10, lg: 9, xl: 8
        },
        center: {
          xs: 12, sm: 13, md: 14, lg: 15, xl: 16
        }
      },
      selectedRowKeys: [],
      multipleSelection: []
    }
  },
  methods: {
    onSelect (obj) {
      this.queryParam.activityInfoId = obj.id
      this.$refs.table.searchData()
    },
    handleSelectionChange (val) {
      this.selectedRowKeys = []
      this.multipleSelection = val
      val.map(item => {
        // 过滤根节点
        if (item.parentId) {
          this.selectedRowKeys.push(item.id)
        }
      })
    },
    importSelect () {
      let that = this
      that.$api['planGanttManager.importActivityInfo']({ selectTaskId: this.taskId, selectedActivityIds: this.selectedRowKeys, activityImportType: this.activityImportType, autoScheduling: this.autoScheduling, createPage: this.createPage }).then(function (res) {
        if (res === 'true') {
          that.showMessage('活动导入成功！', 'success')
          that.$emit('save-success', res)
        } else {
          that.showMessage('活动导入失败！', 'error')
        }
      }).catch(function (error) {
        that.showMessage('活动导入失败！', 'error')
        console.log(error)
      })
    },
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
    showMessage (message, type) {
      this.$message({
        message: message,
        type: type
      })
    }
  }
}

</script>
