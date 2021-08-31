<template>
  <el-dialog
    title="选择计划任务"
    width="80%"
    :visible="visible"
    append-to-body
    destroy-on-close
    @close="handleCancel">
    <normal-layout>
        <template #north>
            <el-input placeholder="请输入任务名称进行搜索" v-model="taskParam.name" style="width:250px;"></el-input>
            <el-button icon="search" type="primary" @click="search">搜索</el-button>
        </template>
        <template #west>
            <div style="height:550px;width: 100%">
              <common-tree :tree-api="treeApi" @select="onSelect" :treeParam='treeParam'></common-tree>
            </div>
        </template>
        <template #center>
          <div class="common-table">
            <div :class="{'small-table': true}" :style="{height: flexHeight }">
              <el-table
                ref="table"
                height="100%"
                stripe
                :data="data"
                row-key="id"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  :selectable='checkSelect'
                  width="50">
                </el-table-column>
                <el-table-column
                  type="index"
                  label="序号"
                  width="50"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="任务名称"
                  width="130"
                  align="left">
                </el-table-column>
                <el-table-column
                  prop="ownerName"
                  label="责任人"
                  width="100"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="departmentName"
                  label="责任单位"
                  width="100"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="statusDisplay"
                  label="任务状态"
                  width="100"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="duration"
                  label="工期（天）"
                  width="100"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="start_date"
                  label="计划开始时间"
                  width="100"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="end_date"
                  label="计划完成时间"
                  width="100"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="forecastBeginDate"
                  label="预计开始时间"
                  width="100"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="forecastEndDate"
                  label="预计完成时间"
                  width="100"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="realBeginDate"
                  label="实际开始时间"
                  width="100"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="realEndDate"
                  label="实际完成时间"
                  width="100"
                  align="center">
                </el-table-column>
              </el-table>
              </div>
            <div class="panination">
              <el-pagination
                background
                layout="total, prev, pager, next"
                :current-page="page.current"
                :page-size="page.size"
                :total="page.total"
                @current-change="changePage"
              ></el-pagination>
            </div>
          </div>
        </template>
    </normal-layout>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleOk">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { Dialog, Input, Button, Table, TableColumn, Pagination } from '~/index'
import { P8NormalLayout as NormalLayout } from '~/index'
import { P8Tree as CommonTree } from '~/index'
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
    wholeDescribeId: {
      type: String
    }
  },
  data () {
    return {
      treeApi: 'planGanttManager.projectPlanTree',
      flexHeight: '550px',
      queryParam: {},
      taskParam: {},
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
      },
      treeParam: {
        wholeDescribeId: this.wholeDescribeId
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
  created () {
    this.formTrigger()
  },
  mounted () {
    this.refresh()
  },
  methods: {
    formTrigger () {
    },
    handleCancel () {
      this.$refs.table.clearSelection()
      this.$emit('close-dialog', this.selectedRows)
    },
    handleOk (e) {
      this.$emit('close-dialog', this.selectedRows)
    },
    onSelect (obj) {
      this.queryParam.id = obj.id
      this.planInfoId = obj.id
      this.searchData()
    },
    handleSelectionChange (selection) {
      this.selectedRows = selection
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
        wholeDescribeId: this.wholeDescribeId,
        planInfoId: this.planInfoId,
        page: {
          current: this.page.current ? this.page.current : 1,
          size: this.page.size ? this.page.size : 10,
          orders: this.page.orders ? this.page.orders : []
        }
      }
      const that = this
      this.$api['problemManager.taskList'](params).then(function (res) {
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
  .custom-tree-node{
    >span{
      font-size:13px;
    }
  }
}

</style>
