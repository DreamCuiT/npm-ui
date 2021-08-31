<template>
  <el-dialog title="审核项目"
             width="75%"
             :visible="visible"
             append-to-body
             destroy-on-close
             @close="handleCancel">
    <list-layout>
      <template #north>
        <el-button type="success"
                   @click="pass">通 过</el-button>
        <el-button type="danger"
                   @click="reject">驳 回</el-button>
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
                               align="center"
                               :selectable='checkSelect'
                               width="50">
              </el-table-column>
              <el-table-column type="index"
                               label="序号"
                               align="center"
                               width="50">
              </el-table-column>
              <el-table-column prop="modelCode"
                               label="型号代号"
                               align="center">
              </el-table-column>
              <el-table-column prop="name"
                               label="项目"
                               align="center"
                               width="260">
              </el-table-column>
              <el-table-column prop="year"
                               label="年度"
                               align="center"
                               width="80">
              </el-table-column>
              <el-table-column prop="comeInMoney"
                               label="收款预算(万元)"
                               align="center">
              </el-table-column>
              <el-table-column prop="payMoney"
                               label="拨款预算(万元)"
                               align="center">
              </el-table-column>
              <el-table-column prop="payMoney"
                               label="系统审核结果"
                               align="center"
                               :formatter="examineResult">
              </el-table-column>
              <el-table-column prop="payMoney"
                               label="到款进度(%)"
                               align="center"
                               :formatter="getComeSchedule">
              </el-table-column>
              <el-table-column prop="payMoney"
                               label="支出进度(%)"
                               align="center"
                               :formatter="getPaySchedule">
              </el-table-column>
            </el-table>
          </div>
        </div>
        <back-year-revenue v-if="rejectVisible"
                           :visible="rejectVisible"
                           :selectedIds="selectedIds"
                           @close-modal="rejectClose"
                           @save-success="rejectCallback">
        </back-year-revenue>
      </template>
    </list-layout>
  </el-dialog>
</template>
<script>
import BackYearRevenue from './backYearRevenue'
import { Dialog, Button, Table, TableColumn } from '~/index'
import { P8ListLayout as ListLayout } from '~/index'

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
      flexHeight: '350px',
      queryParam: {},
      userParam: {},
      data: [], // 列表数据
      selectedRows: [],
      selectedIds: [],
      rejectVisible: false,
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
    'el-table-column': TableColumn,
    BackYearRevenue,
    ListLayout
  },
  mounted () {
    this.refresh()
  },
  methods: {
    examineResult (row, column) {
      let result = '未超支'
      let pay = this.getPaySchedule(row, column) || 0
      let come = this.getComeSchedule(row, column) || 0
      if (pay > come) {
        result = '超支'
      }
      return result
    },
    getPaySchedule (row, column) {
      let revenuePayMoney = row.revenuePayMoney || 0
      let payMoney = row.payMoney || 0
      let upPayYearRealMoney = row.upPayYearRealMoney || 0

      let data = revenuePayMoney !== 0 ? ((Number(upPayYearRealMoney) + Number(payMoney)) / Number(revenuePayMoney)).toFixed(2) * 100 : 0
      return data === 0 ? '' : data
    },
    getComeSchedule (row, column) {
      let upComeYearRealMoney = row.upComeYearRealMoney || 0
      let comeInMoney = row.comeInMoney || 0
      let incomeAllMoney = row.incomeAllMoney || 0

      let data = incomeAllMoney !== 0 ? ((Number(upComeYearRealMoney) + Number(comeInMoney)) / Number(incomeAllMoney)).toFixed(2) * 100 : 0
      return data === 0 ? '' : data
    },
    getSelectedIds () {
      var resultId = []
      for (var i = 0; i < this.selectedRows.length; i++) {
        var record = this.selectedRows[i]
        resultId.push(record.id)
      }

      return resultId
    },
    pass () {
      let that = this

      if (that.selectedRows.length <= 0) {
        that.$message(
          {
            message: '请选择项目',
            type: 'error'
          }
        )
      } else {
        let type = 'success'
        let msg = '保存成功！'
        let selectedIds = that.getSelectedIds()

        that.$api['RevenueYearBudget.updateYearRevenueInfoStatus']({ selectedIds: selectedIds }).then((res) => {
          if (res && res === 'true') {
            that.$refs.table.clearSelection()
            this.$emit('close-dialog', this.selectedRows, this.otherParam)
          } else {
            type = 'error'
            msg = '保存失败！'
          }
        }).catch((err) => {
          type = 'error'
          msg = '保存失败！'
          console.log(err)
        })
        that.$message(
          {
            message: msg,
            type: type
          }
        )
      }
    },
    reject (e) {
      let that = this
      if (that.selectedRows.length <= 0) {
        that.$message(
          {
            message: '请选择项目',
            type: 'error'
          }
        )
      } else {
        that.selectedIds = that.getSelectedIds()
        console.log(that.selectedIds)
        that.rejectVisible = true
      }
    },
    rejectClose (e) {
      this.rejectVisible = false
    },
    rejectCallback (e) {
      this.$refs.table.clearSelection()
      this.refresh()
      this.rejectVisible = false
    },
    handleCancel (e) {
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
    refresh () {
      let params = {
        ...this.userParam,
        ...this.queryParam,
        ...this.otherParam
      }
      const that = this
      this.$api['RevenueYearBudget.getExamineYearRevenueData'](params).then(function (res) {
        if (res) {
          res.forEach(function (item, idx) {
            item.key = item.id
          })
          that.data = res
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
}
</style>
