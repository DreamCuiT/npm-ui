<template>
  <el-dialog title="选择项目"
             width="70%"
             :visible="visible"
             append-to-body
             destroy-on-close
             :style="{'--height':renderDialogHeight+'px'}"
             @close="handleCancel">
    <normal-layout :normalLayout="normalLayout">
      <template #north>
        <el-input placeholder="请输入项目名称进行搜索"
                  v-model="taskParam.projectName"
                  style="width:250px;"></el-input>
        <el-button style="margin-left: 8px"
                   icon="search"
                   type="primary"
                   @click="search">搜索</el-button>
        <el-button style="margin-left: 8px"
                   @click="reSet">重置</el-button>
      </template>
      <template #west>
      </template>
      <template #center>
        <div class="common-table">
          <div :class="{'small-table': true}"
               :style="{height: flexHeight }">
            <el-table ref="table"
                      height="100%"
                      stripe
                      :data="data"
                      row-key="id"
                      @selection-change="handleSelectionChange"
                      @select="select"
                      @row-click='rowClick'
                      @row-dblclick='rowDblclick'>
              <el-table-column type="selection"
                               :selectable='checkSelect'
                               align="center"
                               width="45">
              </el-table-column>
              <el-table-column type="index"
                               label="序号"
                               align="center"
                               width="45">
              </el-table-column>
              <el-table-column prop="projectName"
                               label="项目名称"
                               align="left"
                               width="280">
              </el-table-column>
              <el-table-column prop="projectCode"
                               label="项目编号"
                               align="center"
                               width="230">
              </el-table-column>
              <el-table-column prop="modelName"
                               label="型号代号"
                               align="center"
                               width="230">
              </el-table-column>
              <el-table-column prop="projectType"
                               label="项目类型"
                               align="center"
                               width="220">
              </el-table-column>
            </el-table>
          </div>
          <div class="panination">
            <el-pagination background
                           layout="total, prev, pager, next"
                           :current-page="page.current"
                           :page-size="page.size"
                           :total="page.total"
                           @current-change="changePage"></el-pagination>
          </div>
        </div>
      </template>
    </normal-layout>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary"
                 @click="handleOk">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { Dialog, Input, Button, Table, TableColumn, Pagination } from '~/index'
import { P8NormalLayout as NormalLayout } from '~/index'
import Vue from 'vue'

export default {
  name: 'SelectUser',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    disabledRow: {
      type: Array,
      default: () => []
    },
    dialogHeight: {
      type: Number,
      default: 200
    },
    normalLayout: {
      type: Object,
      default: function () {
        return {
          west: {
            xs: 0, sm: 0, md: 0, lg: 0, xl: 0
          },
          center: {
            xs: 24, sm: 24, md: 24, lg: 24, xl: 24
          }
        }
      }
    }
  },
  data () {
    const mh = document.documentElement.clientHeight - 300
    return {
      dialogMaxHeight: mh + 'px',
      flexHeight: '405px',
      queryParam: {},
      taskParam: {},
      checkedGh: [],
      planInfoId: '',
      data: [], // 列表数据
      page: {
        current: 1,
        size: 1000,
        total: 0,
        orders: []
      }, // 分页
      selectedRows: [],
      treeConfig: {
        'expand-on-click-node': false,
        'check-on-click-node': true
      }
    }
  },
  components: {
    'el-dialog': Dialog,
    'el-input': Input,
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-pagination': Pagination,
    NormalLayout
  },
  created () {
    this.formTrigger()
  },
  mounted () {
    this.refresh()
  },
  computed: {
    renderDialogHeight () {
      return this.dialogHeight > this.dialogMaxHeight ? this.dialogMaxHeight : this.dialogHeight
    }
  },
  methods: {
    formTrigger () {
    },
    select (selection, row) {
      this.$refs.table.clearSelection()
      this.$refs.table.toggleRowSelection(row)
      this.selectedRows[0] = row
    },
    // 单击选中行
    rowClick (row, column, event) {
      this.$refs.table.toggleRowSelection(row)
      this.selectedRows[0] = row
    },
    // 双击行，直接关闭抽屉、回填值
    rowDblclick (row, column, event) {
      this.$refs.table.clearSelection()
      this.$refs.table.toggleRowSelection(row)
      this.selectedRows[0] = row
      this.handleOk()
    },
    handleCancel () {
      this.$refs.table.clearSelection()
      this.$emit('close-dialog', this.selectedRows)
    },
    handleOk (e) {
      this.$emit('close-dialog', this.selectedRows)
    },
    handleSelectionChange (selection) {
      this.checkedGh = selection[0].name
      this.selectedRows = []
      this.selectedRows = selection
      if (selection.length > 1) {
        this.$refs.table.clearSelection()
        this.$refs.table.toggleRowSelection(selection.pop())
      }
    },
    checkSelect (row, index) {
      if (this.disabledRow.includes(row.id)) {
        return false
      } else {
        return true
      }
    },
    search () {
      let newParams = { ...this.taskParam, ...(this.queryParam.departmentId ? { departmentId: this.queryParam.departmentId } : {}) }
      this.queryParam = newParams
      let that = this
      Vue.nextTick(function () {
        that.searchData()
      })
    },
    reSet () {
      let that = this
      Object.keys(that.queryParam).forEach(key => {
        return (that.queryParam[key] = null)
      })
      this.taskParam.projectName = ''
      Vue.nextTick(function () {
        that.searchData()
      })
    },
    searchData () { // 查询列表数据时调用列表数据接口
      this.refresh()
    },
    changePage (pageNo) { // 分页时调用列表数据接口
      this.page.current = pageNo
      this.refresh()
    },
    refresh () {
      let params = {
        ...this.taskParam,
        ...this.queryParam,
        planInfoId: this.planInfoId,
        page: {
          current: this.page.current ? this.page.current : 1,
          size: this.page.size ? this.page.size : 10,
          orders: this.page.orders ? this.page.orders : []
        }
      }
      const that = this
      this.$api['experimentManager.getTaskList'](params).then(function (res) {
        const data = res.records
        data.forEach(function (item, idx) {
          item.key = item.id
        })
        that.data = data

        that.page = {
          total: res.total,
          current: res.current,
          size: res.size,
          orders: res.orders
        }
      }).catch(function (error) {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="scss">
.common-table {
  &.flex-table {
    display: flex;
    flex-direction: column;
  }
  .small-table {
    width: 100%;
    flex: 1;
    display: inherit;
    // thead th, tbody td { padding: 7px 0 !important; }
  }
  .panination {
    margin: 9px 0;
    display: flex;
    flex: none;
    justify-content: flex-end;
  }
}
.normal-west {
  .custom-tree-node {
    > span {
      font-size: 13px;
    }
  }
}
</style>
