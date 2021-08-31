<template>
  <normal-layout :normalLayout="normalLayout">
    <template #north>
      <el-button type="primary"
                 @click="importTaskEx">导入</el-button>
    </template>
    <template #west>
      <common-tree :tree-api="treeApi"
                   @select="onSelect"
                   :tree-config="treeConfig"
                   :tree-Param="treeParam"></common-tree>
    </template>
    <template #center>
      <div id="table-contain">
        <common-table ref="table"
                      :comp="comp"
                      :columns="columns"
                      :params="queryParam"
                      :useTreeFormat="useTreeFormat"
                      :useTreePId="useTreePId"
                      :pagination="pagination"
                      :api="tableApi"
                      :table-refresh="tableRefresh"
                      :table-config="tableConfig"
                      @select-all="selectAll"
                      @select="onTableSelect"
                      @selection-change="handleSelectionChange">
        </common-table>
      </div>
    </template>
  </normal-layout>
</template>
<style>
  .ant-drawer-body {
    height: calc(100% - 55px);
  }
  .table-page-search-wrapper .ant-form-inline .ant-form-item {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    margin-bottom: 24px;
    margin-right: 0;
  }
  .table-page-search-wrapper
  .ant-form-inline
  .ant-form-item
  .ant-form-item-control-wrapper {
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
import { mapGetters } from 'vuex'

export default {
  name: 'ExperienceImport',
  components: {
    NormalLayout,
    CommonTree,
    CommonTable,
    'el-button': Button
  },
  props: {
    planInfoId: {
      type: String,
      default: null
    },
    parentTaskId: {
      type: String,
      default: null
    },
    createPage: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      comp: this,
      flex: 520,
      drawerSize: '70%',
      treeApi: 'myExperience.experienceClassifyTreeList',
      queryParam: { classifyId: '' },
      useTreeFormat: true,
      useTreePId: 'parentId',
      treeConfig: {},
      tableApi: 'myExperience.myExperienceInfoImportRightList',
      columns: [
        {
          title: '',
          dataIndex: 'checkbox',
          type: 'selection',
          width: '35'
        },
        {
          title: '任务名称',
          dataIndex: 'taskName',
          align: 'left'
        },
        {
          title: '工期',
          dataIndex: 'durations',
          width: '110'
        }
      ],
      treeParam: {},
      pagination: false,
      selectAllChecked: false, // 全选flag
      tableConfig: {
        selectOnIndeterminate: true,
        'default-expand-all': true,
        scroll: { x: 1300 },
        expandIconColumnIndex: 3,
        'highlight-current-row': true,
        rowSelection: {
          type: 'checkbox',
          onChange: (selectedRowKeys, selectedCopyRows) => {
            this.selectedRowKeys = selectedRowKeys
            this.selectedCopyRows = selectedCopyRows
          },
          getCheckboxProps: record => ({
            props: {
              // 这里只禁用，应该不展示，待处理
              disabled: record.parentId == null,
              name: record.parentId
            }
          })
        }
      },
      selectedCopyRows: [],
      selectedRowKeys: [],
      multipleSelection: [],
      rows: null,
      normalLayout: {
        west: {
          xs: 9, sm: 9, md: 9, lg: 9, xl: 8
        },
        center: {
          xs: 15, sm: 15, md: 15, lg: 15, xl: 16
        }
      }
    }
  },
  mounted () {},
  computed: {
    ...mapGetters(['vueThis'])
  },
  watch: {
    rows: function (newRow) {
      let checkRowLeng = newRow.length
      this.selectedRowKeys = []
      if (checkRowLeng > 0) {
        newRow.forEach(col => {
          this.selectedRowKeys.push(col.id)
        })
        this.selectedRowKeys = Array.from(new Set(this.selectedRowKeys))
      } else {
        this.selectedRowKeys = []
      }
    }
  },
  methods: {
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
    },
    selectAll (tableData) {
      this.selectAllChecked = !this.selectAllChecked
      this.selectAllRow(tableData, this.selectAllChecked)
      if (!this.selectAllChecked) {
        this.selectedRowKeys = []
      }
    },
    /**
     * 处理数据，全选行，默认只选子不选父
     */
    selectAllRow (data, flag) {
      let _this = this
      data.map(row => {
        if (row.children && row.children.length > 0) {
          _this.selectAllRow(row.children, flag)
        }
        this.selectedRowKeys.push(row.id)
        row.isCheck = flag
        _this.$refs.table.$refs.table.toggleRowSelection(row, flag)
      })
    },
    onTableSelect (select, row) {
      this.rows = this.$refs.table.$refs.table.selection // 获取表格中所有选中的数据
      let checkrow = []
      checkrow.push(row)
      if (row.isCheck === true) {
        if (select === 1) {
          this.$refs.table.$refs.table.toggleRowSelection(row, false)
        }
        this.clearRow(checkrow)
      } else {
        if (select === 1) {
          this.$refs.table.$refs.table.toggleRowSelection(row, true)
        }
        this.checkRow(checkrow)
      }
    },
    handleSelectionChange (val) {
      // this.selectedRowKeys = []
      // this.multipleSelection = val
      // val.map(item => {
      //   // 过滤根节点
      //   // if (item.parentId) {
      //   this.selectedRowKeys.push(item.id)
      //   // }
      // })
    },
    // 取消选中递归
    clearRow (data) {
      Array.from(data).forEach(row => {
        row.isCheck = false // 给这行数据设置一个选中字段为false
        this.$refs.table.$refs.table.toggleRowSelection(row, false)
        if (row.children) this.clearRow(row.children) // 有子集就递归  没子集了就不循环了
      })
    },
    // 选中递归
    checkRow (data) {
      Array.from(data).forEach(row => {
        row.isCheck = true // 选中是字段值为true
        this.$refs.table.$refs.table.toggleRowSelection(row, true)
        if (row.children) this.checkRow(row.children)
      })
    },
    onSelect (obj) {
      this.$set(this.queryParam, 'classifyId', obj.id)
    },
    importTaskEx () {
      let that = this
      let selectNums = that.selectedRowKeys.length
      if (selectNums === 0) {
        this.$alert('请勾选要导入的经验', '提示', {
          confirmButtonText: '确定'
        })
      } else {
        that.$api['myExperience.importTaskEx']({ parentTaskId: that.parentTaskId, experienceInfoIds: that.selectedRowKeys, planInfoId: that.planInfoId, createPage: that.createPage }).then(res => {
          if (!res) {
            that.showImportMessage('经验库导入失败', 'error')
          } else {
            that.showImportMessage('经验库导入成功', 'success')
            this.$emit('save-success', true)
          }
        })
      }
    },
    showImportMessage (message, type) {
      this.$message({
        message: message,
        type: type
      })
    }
  }
}

</script>
