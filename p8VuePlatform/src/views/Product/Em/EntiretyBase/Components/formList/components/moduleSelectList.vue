<template>
  <common-dialog title="选择型号"
                 :visible="visible"
                 :showHandleBtn="true"
                 :dialogConfig="dialogConfig"
                 :dialogHeight="dialogHeight"
                 @handle-cancel="handleCancel"
                 @handle-ok="handleOk"
                 @close="handleCancel"
                 @isfullscreen="fullScreen"
                 width="60%">
    <template #dialog>
      <list-layout>
        <template #north>
              <el-input placeholder="请输入型号代号或型号名称搜索"
                        v-model="queryParam.modelParam"
                        style="width:250px;"></el-input>
              <el-button style="margin-left: 8px"
                        icon="search"
                        type="primary"
                        @click="search">搜索</el-button>
              <el-button style="margin-left: 8px"
                        @click="reSet">重置</el-button>
        </template>
        <template #center>
          <el-table
                  ref="table"
                  :data="tableData"
                  style="width: 100%;margin-bottom: 20px;"
                  row-key="id"
                  border
                  default-expand-all
                  highlight-current-row
                  @select="select"
                  @row-click="rowClick"
                  @row-dblclick="rowDblclick"
                  :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column
                    type="selection"
                    width="55"
                    :selectable='selectable'
            >
            </el-table-column>
            <el-table-column
                    prop="code"
                    label="型号代号"
                    sortable
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="label"
                    label="型号名称"
            >
            </el-table-column>
              <el-table-column
                    prop="simpleName"
                    label="型号简称"
                    width="90">
            </el-table-column>
              <el-table-column
                      prop="secrit"
                      label="型号密级"
                      width="150">
              </el-table-column>
          </el-table>
        </template>
      </list-layout>
    </template>
  </common-dialog>
</template>

<script>
  // import { P8Table as CommonTable } from '~/index'
  import { P8Dialog as CommonDialog } from '~/index'
  import { P8ListLayout as ListLayout } from '~/index'
  import { getTableHeightInDialog } from '@/utils/common'
  import { Input, Button } from '~/index'

  export default {
    name: 'SelectModel',
    components: {
      // CommonTable,
      CommonDialog,
      ListLayout,
     'el-input': Input,
    'el-button': Button
    },
    props: [
      'visible', 'disabled-row', 'filedId'
      ],
    data () {
      return {
        dialogHeight: getTableHeightInDialog() + 120,
        comp: this,
        confirmLoading: false,
        fixParam: {
          dicType: 'OWNER_TYPE', filedId: this.filedId
        },
        queryParam: {},
        tableApi: 'documentManagement.getPAmodel',
        loading: false,
        skeletonLoading: true,
        selectedRow: null,
        multipleSelection: [],
        selectData: [],
        dialogConfig: {
          beforeClose: this.handleCancel,
          destroyOnClose: 'true',
          modal: false
        },
        tableConfig: {
          highlightCurrentRow: true,
          showOverflowTooltip: true
        },
        searchData: [
        ],
        tableData: []
      }
    },
    mounted () {
        this.init(this.fixParam)
    },
    computed: {
    },
    methods: {
      init (param) {
          const that = this
          this.$api['documentManagement.getPAmodel'](param).then(function (res) {
              if (res) {
                console.log(res, '查看数据信息')
                that.tableData = res
              }
          }).catch(function (error) {
              console.log(error)
          })
        },
      fullScreen (isfullscreen) {
        const docHeight = document.documentElement.clientHeight
        if (isfullscreen) {
          this.dialogHeight = docHeight - 50
        } else {
          this.dialogHeight = getTableHeightInDialog()
        }
      },
      handleOk (e) {
        if (this.selectedRow) {
          this.$emit('close-dialog', this.selectedRow)
        } else {
          this.$message({ message: '未选择型号', type: 'error' })
        }
      },
      handleCancel (e) {
        this.$emit('close-dialog')
      },
      search () {
        let newParams = { ...this.queryParam, ...this.fixParam }
        this.init(newParams)
      },
      reSet () {
        this.queryParam = {}
       this.init(this.fixParam)
      },
      // 单击选中行
      rowClick (row, column, event) {
        if (row.TYPE === '1') {
          this.$refs.table.clearSelection()
          this.$refs.table.toggleRowSelection(row)
          this.selectedRow = row
          return true
        } else {
          return false
        }
      },
      // 勾选复选框选中行
      select (selection, row) {
        this.$refs.table.clearSelection()
        this.$refs.table.toggleRowSelection(row)
        this.selectedRow = row
      },
      // 双击行，直接关闭抽屉、回填值
      rowDblclick (row, column, event) {
        if (row.TYPE === '1') {
          this.$refs.table.clearSelection()
          this.$refs.table.toggleRowSelection(row)
          this.selectedRow = row
          this.handleOk()
          return true
        } else {
          return false
        }
      },
      selectable (row, index) {
        if (row.TYPE === '1') {
          return true
        } else {
          return false
        }
      }
    }
  }
</script>

<style scoped>
</style>
