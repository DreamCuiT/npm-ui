<template>
  <el-dialog
    title="待办记录列表"
    width="65%"
    :visible="visible"
    append-to-body
    destroy-on-close
    @close="handleCancel">
    <normal-layout :normalLayout="normalLayout">
        <template #north>
            <el-input placeholder="请输入待办事项内容进行搜索" v-model="taskParam.content" style="width:250px;"></el-input>
            <el-button style="margin-left: 8px" icon="search" type="primary" @click="search">搜索</el-button>
            <el-button style="margin-left: 8px" @click="reSet">重置</el-button>
        </template>
        <template #west>
        </template>
        <template #center>
          <div class="common-table">
            <div :class="{'small-table': true}" :style="{height: flexHeight }">
              <el-table
                ref="table"
                height="100%"
                stripe
                :data="data"
                row-key="id">
                <el-table-column
                  type="index"
                  label="序号"
                  width="75"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="content"
                  label="待办事项内容"
                  width="300"
                  align="left">
                </el-table-column>
                <el-table-column
                  prop="dutyUserName"
                  label="责任人"
                  width="150"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="beginTime"
                  label="计划开始时间"
                  width="200"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="endTime"
                  label="计划完成时间"
                  width="200"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="statusDisplay"
                  label="状态"
                  width="150"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="classifyDisplay"
                  label="类型"
                  width="150"
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
<!--      <el-button @click="handleCancel">取 消</el-button>-->
<!--      <el-button type="primary" @click="handleOk">确 定</el-button>-->
    </span>
  </el-dialog>
</template>
<script>
import { Dialog, Input, Button, Table, TableColumn, Pagination } from '~/index'
import Vue from 'vue'
import { P8NormalLayout as NormalLayout } from '~/index'

export default {
  name: 'SelectUser',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    wholeDescribeId: {
      type: String
    },
    rowId: {
      type: String
    },
    disabledRow: {
      type: Array,
      default: () => []
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
    return {
      flexHeight: '550px',
      queryParam: {},
      taskParam: {},
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
      let newParams = { ...this.taskParam }
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
      this.taskParam.content = ''
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
        entityId: this.rowId,
        page: {
          current: this.page.current ? this.page.current : 1,
          size: this.page.size ? this.page.size : 10,
          orders: this.page.orders ? this.page.orders : []
        }
      }
      const that = this
      this.$api['upcomingManager.upcomingPage'](params).then(function (res) {
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
