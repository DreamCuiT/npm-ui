<template>
  <el-dialog title="选择人员"
             width="60%"
             :visible="visible"
             append-to-body
             destroy-on-close
             v-bind="dialogConfig"
             @close="handleCancel">
    <normal-layout>
      <template #north>
        <el-input placeholder="请输入人员姓名进行搜索"
                  v-model="userParam.userName"
                  style="width:250px;"></el-input>
        <el-button style="margin-left: 8px"
                   icon="search"
                   type="primary"
                   @click="search">搜索</el-button>
        <el-button style="margin-left: 8px"
                   @click="reSet">重置</el-button>
      </template>
      <template #west>
        <div style="height:392px;width:300px">
          <common-tree treeApi="userManager.deptTree"
                       @select="onSelect"
                       :defaultExpandAll="defaultExpandAll"
                       :defaultExpandedKeys="defaultExpandedKeys"
                       :treeConfig="treeConfig"></common-tree>
        </div>
      </template>
      <template #center>
        <div class="common-select-table">
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
                      @row-dblclick="rowDblClick">
              <el-table-column type="selection"
                               :reserve-selection="reserveSelection"
                               :selectable='checkSelect'
                               align="center"
                               min-width="50">
              </el-table-column>
              <el-table-column prop="num"
                               label="序号"
                               align="center"
                               min-width="50">
              </el-table-column>
              <el-table-column prop="realName"
                               label="用户名称"
                               align="center"
                               min-width="120">
              </el-table-column>
              <el-table-column prop="departmentName"
                               label="所属部门"
                               align="center"
                               min-width="260">
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
import { Dialog, Input, Button, Table, TableColumn, Pagination } from 'element-ui'
import NormalLayout from 'packages/normalLayout/src'
import CommonTree from 'packages/tree/src'
import Vue from 'vue'

export default {
  name: 'P8SelectUser',
  componentName: 'P8SelectUser',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    disabledRow: {
      type: Array,
      default: () => []
    },
    otherParam: {
      type: Object,
      default: () => {
        return {}
      }
    },
    selectType: {
      type: String,
      default: '0'
    },
    dialogConfig: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      flexHeight: '350px',
      queryParam: {},
      userParam: {},
      data: [], // 列表数据
      checkedGh: [],
      defaultExpandAll: false,
      defaultExpandedKeys: ['1'],
      page: {
        current: 1,
        size: 10,
        total: 0,
        orders: []
      }, // 分页
      selectedRows: [],
      reserveSelection: true,
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
    NormalLayout,
    CommonTree
  },
  mounted () {
    this.refresh()
  },
  methods: {
    handleCancel () {
      this.$refs.table.clearSelection()
      this.$emit('close-dialog', this.selectedRows, this.otherParam)
    },
    handleOk (e) {
      this.$emit('close-dialog', this.selectedRows, this.otherParam)
    },
    onSelect (obj) {
      this.queryParam.departmentId = obj.id
      this.searchData()
    },
    select (selection, row) {
      // this.$refs.table.clearSelection()
      // this.$refs.table.toggleRowSelection(row)
      this.selectedRows[0] = row
    },
    // 单击选中行
    rowClick (row, column, event) {
      let check = this.isCheck(this.disabledRow, row)
      if (check) {
        this.$refs.table.toggleRowSelection(row)
      }
      // this.selectedRows[0] = row
    },
    // 双击行，直接关闭抽屉、回填值
    rowDblClick (row, column, event) {
      let check = this.isCheck(this.disabledRow, row)
      if (check) {
        this.$refs.table.clearSelection()
        this.$refs.table.toggleRowSelection(row)
        this.selectedRows[0] = row
        this.handleOk()
      }
    },
    handleSelectionChange (selection) {
      if (this.selectType === '0') {
        this.selectedRows = selection
      } else {
      //  this.checkedGh = selection[0].realName
        this.selectedRows = []
        this.selectedRows = selection
        if (selection.length > 1) {
          this.$refs.table.clearSelection()
          this.$refs.table.toggleRowSelection(selection.pop())
        }
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
      let newParams = { ...this.userParam, ...(this.queryParam.departmentId ? { departmentId: this.queryParam.departmentId } : {}) }
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
      this.userParam.userName = ''
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
        ...this.userParam,
        ...this.queryParam,
        ...this.otherParam,
        page: {
          current: this.page.current ? this.page.current : 1,
          size: this.page.size ? this.page.size : 10,
          orders: this.page.orders ? this.page.orders : []
        }
      }
      const that = this
      this.$api['userManager.list'](params).then(function (res) {
        const data = res.records
        data.forEach(function (item, idx) {
          item.key = item.id
          item.num = idx + 1
        })
        that.data = data
        that.page = {
          total: res.total,
          current: res.current,
          size: res.size,
          orders: res.orders
        }
        data.forEach(function (item, idx) {
          item.num = res.size * (res.current - 1) + idx + 1
        })
      }).catch(function (error) {
        console.log(error)
      })
    },
    isCheck (disabledRow, row) {
      if (disabledRow.includes(row.id)) {
        return false
      } else {
        return true
      }
    }
  }
}
</script>