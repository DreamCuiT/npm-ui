<template>
  <el-dialog title="选择拨款预算节点"
             width="70%"
             :visible="visible"
             append-to-body
             destroy-on-close
             @close="handleCancel">
    <list-layout>
      <template #north>
        <el-button type="primary"
                   @click="handleOk">确 定</el-button>
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
                      @selection-change="handleSelectionChange">
              <el-table-column type="selection"
                               :selectable='checkSelect'
                               width="50">
              </el-table-column>
              <el-table-column align="center"
                               width="50">
                <template slot-scope="scope">
                  <el-tooltip effect="light"
                              placement="right"
                              v-if="scope.row.status">
                    <div slot="content">
                      <p v-html="statusDisplay(scope.row)"></p>
                    </div>
                    <i class="icon-filled-circle p8"
                       :style="statusColor(scope.row.status)">
                    </i>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column type="index"
                               label="序号"
                               align="center"
                               width="50">
              </el-table-column>
              <el-table-column prop="revenueName"
                               label="全周期预算节点"
                               align="center"
                               width="260">
              </el-table-column>
              <el-table-column prop="taskName"
                               label="任务节点"
                               align="center"
                               width="260">
              </el-table-column>
              <el-table-column prop="revenueMoney"
                               label="预算金额"
                               align="center">
              </el-table-column>
              <el-table-column prop="deptName"
                               label="拨付单位"
                               align="center">
              </el-table-column>
              <el-table-column prop="allYear"
                               label="全周期预算年度"
                               align="center">
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
    </list-layout>
  </el-dialog>
</template>
<script>
import { Dialog, Button, Table, TableColumn, Pagination, Tooltip } from '~/index'
import { P8ListLayout as ListLayout } from '~/index'
import Vue from 'vue'
import moment from 'moment'
const mh = document.documentElement.clientHeight - 365
export default {
  name: 'addRevenue',
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
      default: () => { }
    }
  },
  data () {
    return {
      flexHeight: mh + 'px',
      queryParam: {},
      userParam: {},
      data: [], // 列表数据
      page: {
        current: 1,
        size: 10,
        total: 0,
        orders: []
      }, // 分页
      selectedRows: [],
      revenuePayStatusObj: {
        8000: '已关联',
        8003: '待拨付,排队等待',
        8005: '待拨付,排队等待',
        8007: '已拨付'
      },
      treeConfig: {
        'expand-on-click-node': false,
        'check-on-click-node': true
      }
    }
  },
  components: {
    'el-dialog': Dialog,
    'el-button': Button,
    'el-table': Table,
    'el-tooltip': Tooltip,
    'el-table-column': TableColumn,
    'el-pagination': Pagination,
    ListLayout
  },
  mounted () {
    this.refresh()
  },
  computed: {
    statusColor () {
      return function (status) {
        if (status === '8007') {
          return 'cursor: pointer;color:#1bbf9e'
        } else {
          return 'cursor: pointer;color:#d4d4d4'
        }
      }
    }
  },
  methods: {
    statusDisplay (row) {
      let taskStatus = row.taskStatus
      let status = row.status
      let taskName = row.taskName
      let endDate = row.endDate
      let showStr = ''
      if (taskStatus && taskStatus !== '') {
        showStr = showStr + "<font style='color: #4ea640;'>任务名称</font>：" + taskName + '<br/>'
        showStr = showStr + "<font style='color: #4ea640;'>计划完成时间</font>：" + moment(endDate).format('YYYY-MM-DD') + '<br/>'
        showStr = showStr + "<font style='color: #4ea640;'>任务状态</font>：" + taskStatus + '<br/>'
      }
      if (status && status !== '') {
        showStr = showStr + "<font style='color: #4ea640;'>拨款节点状态</font>：" + this.revenuePayStatusObj[status]
      }

      return showStr
    },
    formatterMoney (row, column) {
      let allMoney = row.allMoney || 0
      let alreadyMoney = row.alreadyMoney || 0
      return (Number(allMoney) - Number(alreadyMoney)).toFixed(4)
    },
    handleCancel () {
      this.$refs.table.clearSelection()
      this.$emit('close-dialog', this.selectedRows, this.otherParam)
    },
    handleOk (e) {
      this.$emit('close-dialog', this.selectedRows, this.otherParam)
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
      let newParams = { ...this.userParam, ...(this.queryParam.departmentId ? { departmentId: this.queryParam.departmentId } : {}) }
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
      this.$api['PayRevenue.getYearPayData'](params).then(function (res) {
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
</style>
