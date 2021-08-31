<template>
  <list-layout>
    <template #north>
      <div>
        <el-tag>可支配总金额： {{ usableMoney  }} (万元)</el-tag>
        <search-form-list ref="search"
                          :dataSource="searchData"
                          @search="search"
                          @re-set="reSet"></search-form-list>
      </div>
    </template>
    <template #center>
      <div id="table-contain">
        <common-table ref="table"
                      :comp="comp"
                      :table-config="tableConfig"
                      :columns="columns"
                      :params="queryParam"
                      :api="tableApi"
                      :table-Refresh="tableRefresh"
                      :pagination="true"
                      @icon-click="iconClick">
          <template slot="tableSet"
                    slot-scope="scope">
            <el-dropdown trigger="click"
                         v-if="scope.scope.row.status!=='8007'"
                         placement='bottom-start'
                         :hide-on-click="false">
              <span class="el-dropdown-link">
                <i class="el-icon-s-tools"
                   style="cursor: pointer;color:#2196F3"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="appropriation(scope.scope.row)"><i class="p8 icon-logout"></i>拨款</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </common-table>
      </div>
    </template>
  </list-layout>
</template>
<script>

import Vue from 'vue'
import { Dropdown, DropdownMenu, DropdownItem, Tag } from '~/index'
import { P8Table as CommonTable } from '~/index'
import { P8Search as SearchFormList } from '~/index'
import { P8ListLayout as ListLayout } from '~/index'
import moment from 'moment'
const columns = [
  {
    title: '序号',
    type: 'index',
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'tableSet',
    property: 'tableSet',
    width: '80',
    align: 'center',
    scopedSlots: {
      customRender: 'custom'
    }
  },
  {
    title: '任务名称',
    align: 'center',
    width: '450',
    dataIndex: 'taskName'
  },
  {
    title: '实际完成时间',
    align: 'center',
    dataIndex: 'realEndDate',
    formatter: function (row, column, cellValue, index) {
      let date = ''
      if (cellValue && cellValue !== '') {
        date = moment(cellValue).format('YYYY-MM-DD')
      }
      return date
    }
  },
  {
    title: '拨付厂所',
    align: 'center',
    dataIndex: 'deptName'
  },
  {
    title: '关联经费节点',
    align: 'center',
    dataIndex: 'budgetName'
  },
  {
    title: '预算金额',
    align: 'center',
    dataIndex: 'revenueMoney'
  }
]
export default {
  name: 'FundingManager',
  components: {
    'el-tag': Tag,
    'el-dropdown': Dropdown,
    'el-dropdown-menu': DropdownMenu,
    'el-dropdown-item': DropdownItem,
    CommonTable,
    SearchFormList,
    ListLayout
  },
  props: {
    thirdMenuParam: {
      type: Object,
      default: function () {
        return {}
      }
    },
    searchData: {
      type: Array,
      default: function () {
        return [
          {
            type: 'text', // 控件类型
            labelText: '任务名称', // 控件显示的文本
            fieldName: 'taskName',
            placeholder: '请输入任务名称'
          },
          {
            type: 'text', // 控件类型
            labelText: '经费节点', // 控件显示的文本
            fieldName: 'revenueName',
            placeholder: '请输入经费节点'
          },
          {
            type: 'text', // 控件类型
            labelText: '拨付厂所', // 控件显示的文本
            fieldName: 'deptName',
            placeholder: '请输入拨付厂所'
          }

        ]
      }
    }
  },
  data () {
    return {
      comp: this,
      queryParam: {},
      tableApi: 'FundingManager.fundingListData',
      columns: columns,
      usableMoney: 0,
      tableConfig: {
      },
      buttonConfig: {
        icon: 'edit'
      }
    }
  },
  watch: {
    '$route': 'initData'
  },
  created () {
    this.queryParam = Object.assign({}, this.thirdMenuParam)
    this.getUsableMoney()
  },
  mounted () {

  },
  methods: {
    initData () {
      if (this.$route.name === 'fundingManager') {
        this.getUsableMoney()
        this.$refs.table.searchData()
      }
    },
    getUsableMoney () {
      let that = this
      that.$api['FundingManager.getUsableMoney'](that.thirdMenuParam).then(res => {
        if (res) {
          that.usableMoney = res.usableMoney
        }
      })
    },
    appropriation (record) {
      let revenueInfoId = this.thirdMenuParam.revenueInfoId
      let wholeDescribeId = this.thirdMenuParam.wholeDescribeId
      let that = this
      this.$confirm(`是否确认拨款？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$api['FundingManager.appropriation']({ taskId: record.id, revenueBudgetId: record.revenueBudgetId, revenueInfoId: revenueInfoId, wholeDescribeId: wholeDescribeId }).then(res => {
          if (res && res === 'true') {
            that.$message({ message: `拨款成功！`, type: 'success' })
          } else {
            that.$message({ message: res, type: 'error' })
          }
        })
      }).catch((error) => {
        console.log(error)
      })
    },
    tableRefresh (param) {
      param
        .then(() => {
          console.log('异步成功后端做的操作')
        })
        .catch(() => {
          console.log('异步失败的操作')
        })
    },
    search (param) {
      this.queryParam = param
      let that = this
      Vue.nextTick(function () {
        that.$refs.table.queryList()
      })
    },
    reSet () {
      let this_ = this
      Object.keys(this.queryParam).forEach(key => {
        let temp = this_.searchData.filter(item => item.fieldName === key)
        this.queryParam[key] = temp[0].defaultValue
      })
      this.queryParam = Object.assign({}, this.thirdMenuParam)
      Vue.nextTick(function () {
        this_.$refs.table.searchData()
      })
    },
    iconClick (record) {

    }
  }
}
</script>
<style scoped>
</style>
