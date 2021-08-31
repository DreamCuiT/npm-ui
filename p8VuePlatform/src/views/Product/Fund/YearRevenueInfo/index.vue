<template>
  <list-layout>
    <template #north>
      <el-button type="primary"
                 round
                 @click="goYearRevenue()">发起年度预算</el-button>
    </template>
    <template #center>
      <div id="table-contain">
        <common-table ref="table"
                      :comp="comp"
                      :columns="columns"
                      :params="queryParam"
                      :api="tableApi"
                      @row-click="tempRowClick"
                      :table-Refresh="tableRefresh"
                      :pagination="true">
        </common-table>
        <edit v-if="goYearRevenueVisible"
              :visible="goYearRevenueVisible"
              :revenueInfoId="revenueInfoId"
              :wholeDescribeId="wholeDescribeId"
              @close-modal="goYearRevenueClose"
              @save-success="saveCallback">
        </edit>
        <show-tree-year-revenue v-if="showTreeYearRevenueVisible"
                                :visible="showTreeYearRevenueVisible"
                                :title="drawerTitle"
                                :year="year"
                                :revenueYearInfoId="revenueYearInfoId"
                                @close-dialog="showTreeYearClose">
        </show-tree-year-revenue>
        <year-revenue-come v-if="yearRevenueComeInVisible"
                           :visible="yearRevenueComeInVisible"
                           :title="drawerTitle"
                           :year="year"
                           :revenueYearInfoId="revenueYearInfoId"
                           @close-dialog="yearRevenueComeIClose">
        </year-revenue-come>
        <year-revenue-pay v-if="yearRevenuePayVisible"
                          :visible="yearRevenuePayVisible"
                          :title="drawerTitle"
                          :year="year"
                          :revenueYearInfoId="revenueYearInfoId"
                          @close-dialog="yearRevenuePayClose">
        </year-revenue-pay>
      </div>
    </template>
  </list-layout>
</template>

<script>
import Edit from './Components/edit'
import ShowTreeYearRevenue from './Components/showTreeYearRevenue'
import YearRevenueCome from './Components/yearRevenueComeIn'
import YearRevenuePay from './Components/yearRevenuePay'
import { P8Table as CommonTable } from '~/index'

import { P8ListLayout as ListLayout } from '~/index'
import { Button } from '~/index'
export default {
  name: 'YearRevenueInfo',
  components: {
    'el-button': Button,
    Edit,
    ShowTreeYearRevenue,
    YearRevenueCome,
    YearRevenuePay,
    CommonTable,
    ListLayout
  },
  props: {
    thirdMenuParam: {
      type: Object,
      default: function () {
        return {}
      }
    },
    columns: {
      type: Array,
      default: function () {
        return [
          {
            title: '序号',
            type: 'index'
          },
          {
            title: '年度',
            align: 'center',
            dataIndex: 'year'
          },
          {
            title: '收入预算',
            align: 'center',
            dataIndex: 'inComeBudget'
          },
          {
            title: '支出预算',
            align: 'center',
            dataIndex: 'payBudget'
          },
          {
            title: '收款预算是否结转',
            align: 'center',
            dataIndex: 'isCarryOverCome'
          },
          {
            title: '支出预算是否结转',
            align: 'center',
            dataIndex: 'isCarryOverPay'
          }
        ]
      }
    }
  },
  data () {
    return {
      tableApi: 'YearRevenueInfo.yearRevenueInfoListData',
      comp: this,
      year: '',
      drawerTitle: '',
      revenueInfoId: '',
      revenueYearInfoId: '',
      wholeDescribeId: '',
      goYearRevenueVisible: false,
      showTreeYearRevenueVisible: false,
      yearRevenueComeInVisible: false,
      yearRevenuePayVisible: false,
      queryParam: {},
      drawerConfig: {
        'append-to-body': true,
        'modal-append-to-body': false
      }

    }
  },
  created () {
    this.revenueInfoId = this.thirdMenuParam.revenueInfoId
    this.wholeDescribeId = this.thirdMenuParam.wholeDescribeId
    this.queryParam = Object.assign({}, this.thirdMenuParam)
  },
  mounted () {

  },
  computed: {
  },
  methods: {
    tableRefresh (param) {
      param
        .then(() => {
          console.log('异步成功后端做的操作')
        })
        .catch(() => {
          console.log('异步失败的操作')
        })
    },
    tempRowClick (record, column, event) {
      this.revenueYearInfoId = record.id
      this.year = record.year
      this.drawerTitle = record.year + '年度'
      if (column.property === 'inComeBudget') {
        this.yearRevenueComeInVisible = true
      } else if (column.property === 'payBudget') {
        this.yearRevenuePayVisible = true
      } else if (column.property === 'year') {
        this.showTreeYearRevenueVisible = true
      }
    },
    releaseMenu (record) {
      let that = this
      this.$confirm(`是否确定要发布该项目？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$api['ProjectApply.complete']({
          processDefinitionKey: 'project-release',
          id: record.id,
          status: record.status
        }).then(function (res) {
          if (res.errorMsg) {
            that.$message({
              message: res.errorMsg,
              type: 'error'
            })
          } else {
            that.$refs.table.queryList()
            that.$message({
              message: '操作成功',
              type: 'success'
            })
          }
        }).catch(function (error) {
          console.log(error)
        })
      }).catch(() => { })
    },
    goYearRevenue () {
      this.goYearRevenueVisible = true
    },
    goYearRevenueClose () {
      this.goYearRevenueVisible = false
    },
    showTreeYearClose () {
      this.showTreeYearRevenueVisible = false
    },
    yearRevenueComeIClose () {
      this.yearRevenueComeInVisible = false
    },
    yearRevenuePayClose () {
      this.yearRevenuePayVisible = false
    },
    saveCallback () {
      this.$refs.table.searchData()
      this.goYearRevenueClose()
    }
  }
}
</script>
