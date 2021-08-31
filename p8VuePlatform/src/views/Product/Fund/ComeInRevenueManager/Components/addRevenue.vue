<template>
  <el-dialog title="选择收款预算节点"
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
                              placement="right">
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
              <el-table-column prop="nodeName"
                               label="全周期预算节点"
                               align="center"
                               width="260">
              </el-table-column>
              <el-table-column prop="allMoney"
                               label="预算金额"
                               align="center">
              </el-table-column>
              <el-table-column prop="alreadyMoney"
                               label="历史已收金额"
                               align="center">
              </el-table-column>
              <el-table-column prop="currYearMoney"
                               label="本年已收金额"
                               align="center">
              </el-table-column>
              <el-table-column prop="allMoney"
                               label="本年预算金额"
                               align="center"
                               :formatter="formatterMoney">
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
      revenueStatusObj: {
        7001: '待收款',
        7003: '收款中',
        7005: '收款完成',
        7009: '待收款'
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
        if (status === '7003') {
          return 'cursor: pointer;color:#1bbf9e'
        } else if (status === '7005') {
          return 'cursor: pointer;color:#00acee'
        } else if (status === '7009') {
          return 'cursor: pointer;color:#d4d4d4'
        } else {
          return 'cursor: pointer;color:#d4d4d4'
        }
      }
    }
  },
  methods: {
    statusDisplay (row) {
      let status = row.status
      let nodeMoney = row.contractMoney
      let endDate = row.contractEndTime
      let nodeType = row.nodeType
      let comeMoneyData = row.comeMoneyData
      let showStr = ''
      if (nodeType && nodeType === 'true') {
        if (endDate) {
          endDate = moment(endDate).format('YYYY-MM-DD')
        }
        showStr = showStr + "<font style='color: #4ea640;'>合同节点金额</font>：" + nodeMoney + '(万元)'
        showStr = showStr + "</br><font style='color: #4ea640;'>合同节点时间</font>：" + endDate
      }
      if (status && status !== '') {
        showStr = showStr + "</br><font style='color: #4ea640;'>状态</font>：" + this.revenueStatusObj[status]
        if (status === '7005' || status === '7003') {
          if (comeMoneyData && comeMoneyData.length > 0) {
            showStr = showStr + "<div style='width:100%;height: 1px;line-height: 1px; overflow:hidden;border-bottom: #cecece 1px solid;margin: 2px 0px;'></div>"

            for (let i = 0; i < comeMoneyData.length; i++) {
              let msg = ''

              let time = comeMoneyData[i].incomeTime
              if (time) {
                time = moment(comeMoneyData[i].incomeTime).format('YYYY-MM-DD')
              }
              let alreadyMoney = comeMoneyData[i].alreadyMoney

              if (alreadyMoney && alreadyMoney !== '') {
                msg = msg + "<span style='color: #ff1815;font-style: italic;'>收款金额</span>：" + alreadyMoney + '(万元)'
              }
              if (time && time !== '') {
                msg = msg + "<span style='color: #ff1815;font-style: italic;'>收款时间</span>：" + time + ''
              }
              if (msg && msg !== '') {
                showStr = showStr + msg
              }
              showStr = showStr + '<br/>'
            }
          }
        }
      } else {
        showStr = showStr + "</br><font style='color: #4ea640;'>状态</font>：待收款"
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
      this.$api['ComeInRevenue.getYearComeInData'](params).then(function (res) {
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
