<template>
  <list-layout>
    <template #north>
      <div style="float: right;">
        <el-tag>预算总金额： {{ comeInMoney  }} (万元)</el-tag>
        <el-tag style="margin-left: 20px;">已确认金额： {{ confirmMoney }} (万元)</el-tag>
      </div>
    </template>
    <template #center>
      <div class="tableDiv">
        <el-table :data="tableData"
                  :height="flexHeight"
                  highlight-current-row
                  row-key="id"
                  v-bind="tableConfig"
                  :cell-style="columnStyle"
                  :default-expand-all="true">
          <el-table-column v-for="(item, index) in columns"
                           :key="index"
                           :prop="item.prop"
                           :align='item.align'
                           :type="item.type"
                           :label="item.label"
                           :width="item.width">
            <template slot-scope="scope">
              <template v-if="item.prop == 'tableSetting'&&tableSetting (scope.row)">
                <el-dropdown trigger="click"
                             :hide-on-click="false">
                  <span class="el-dropdown-link">
                    <i class="el-icon-s-tools"
                       style="cursor: pointer;color:#2196F3"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="isShowMenu(scope.row,'create')">
                      <div @click="onCreateOpen(scope.row)"><i class="p8 icon-new-subordinate"></i>新建下级</div>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="isShowMenu(scope.row,'other') ">
                      <div @click="onUpdateOpen(scope.row)"><i class="p8 icon-delete"></i>修改</div>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="isShowMenu(scope.row,'other') ">
                      <div @click="confirmRevenue(scope.row)"><i class="p8 icon-delete"></i>确认</div>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="isShowMenu(scope.row,'other') ">
                      <div @click="deleteBudgetData(scope.row)"><i class="p8 icon-delete"></i>删除</div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
              <template v-if="item.prop == 'status'">
                <el-tooltip effect="light"
                            :content="statusDisplay(scope.row.status)"
                            placement="right">
                  <i class="icon-filled-circle p8"
                     :style="statusColor(scope.row.status)">
                  </i>
                </el-tooltip>
              </template>
              <template v-else-if="item.prop == 'isLast'">
                <span v-if="scope.row[item.prop]===1">
                  <i class="el-icon-check"
                     style="font-size:25px;color:#2196F3"></i>
                </span>
              </template>
              <template v-else-if="item.prop == 'revenueMoney'">
                <span>{{ scope.row[item.prop] }}{{ scope.row['alreadyMoney'] }}</span>
              </template>
              <template v-else>
                <span>{{ scope.row[item.prop] }}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <edit v-if="visibleEditDialog"
              :visible="visibleEditDialog"
              :canUseMoneyTemp="canUseMoneyTemp"
              :isLastCountTemp="isLastCountTemp"
              :formParam="formParam"
              @close-modal="onCreateClose"
              @save-success="saveCallback">
        </edit>
      </div>
    </template>
  </list-layout>
</template>
<style scoped>
.tableDiv .el-input-number {
  display: none;
}
.current-cell .el-input-number {
  display: block;
}
.current-cell .el-input-number + span {
  display: none;
}
.tableDiv .el-textarea {
  display: none;
}
.current-cell .el-textarea {
  display: block;
}
.current-cell .el-textarea + span {
  display: none;
}
</style>

<script>
import Vue from 'vue'
import Edit from './Components/edit'
import { generateTree } from '@/utils/generateTree'
import { P8ListLayout as ListLayout } from '~/index'
import { Table, TableColumn, Dropdown, DropdownMenu, DropdownItem, Tag, Tooltip } from '~/index'

const mh = document.documentElement.clientHeight - 160
export default {
  name: 'CollectionBudgetManager',
  components: {
    Edit,
    ListLayout,
    'el-table': Table,
    'el-tag': Tag,
    'el-table-column': TableColumn,
    'el-dropdown': Dropdown,
    'el-tooltip': Tooltip,
    'el-dropdown-menu': DropdownMenu,
    'el-dropdown-item': DropdownItem
  },
  props: {
    thirdMenuParam: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      tableApi: 'collectionManager.loadBudgetCommonData',
      flexHeight: mh,
      content: null,
      queryParam: {},
      columns: [],
      tableData: [],
      visibleEditDialog: false,
      isListLoading: false, // 列表加载
      comp: this,
      formParam: {},
      canUseMoneyTemp: 0,
      isLastCountTemp: 0,
      comeInMoney: 0, // 预算总金额
      payMoney: 0, // 当前已编收款
      confirmMoney: 0, // 当前已确认收款
      revenueInfoStatus: '',
      revenueInfoId: '',
      wholeDescribeId: '',
      planStatus: {},
      searchData: [],
      tableConfig: {
        expandIconColumnIndex: 2
      }
    }
  },
  watch: {
    '$route': 'initData'
  },
  created () {
    this.initColumns()
  },
  mounted () {
    this.revenueInfoId = this.thirdMenuParam.revenueInfoId
    this.wholeDescribeId = this.thirdMenuParam.wholeDescribeId
    this.queryList()
  },
  computed: {
    statusDisplay () {
      return function (status) {
        if (status === '7003') {
          return '收款中'
        } else if (status === '7005') {
          return '收款完成'
        } else if (status === '7007') {
          return '已确认'
        } else if (status === '7009') {
          return '待收款'
        } else {
          return '待收款'
        }
      }
    },
    statusColor () {
      return function (status) {
        if (status === '7003') {
          return 'cursor: pointer;color:#1bbf9e'
        } else if (status === '7005') {
          return 'cursor: pointer;color:#00acee'
        } else if (status === '7007') {
          return 'cursor: pointer;color:#ee8800'
        } else if (status === '7009') {
          return 'cursor: pointer;color:#d4d4d4'
        } else {
          return 'cursor: pointer;color:#d4d4d4'
        }
      }
    }
  },
  methods: {
    columnStyle ({ row, column, rowIndex, columnIndex }) {
      if (row.children && row.children.length > 0) {
        return 'font-weight: 900;'
      }
    },
    initData () {
      if (this.$route.name === 'collectionManager') {
        this.queryList()
      }
    },
    tableSetting (row) {
      let result = true
      let status = row.status
      if (status === '7005') {
        result = false
      }

      if (status === '7007') {
        result = false
      }
      return result
    },
    isShowMenu (row, rowType) {
      let result = false
      let parentId = row.parentId
      if (rowType === 'create') {
        if (!parentId) {
          result = true
        } else {
          result = false
        }
      }
      if (rowType === 'other') {
        if (parentId) {
          result = true
        } else {
          result = false
        }
      }

      return result
    },
    initColumns () {
      let that = this
      const columns = [
        {
          label: '状态',
          prop: 'status',
          type: 'index',
          width: '80',
          align: 'center'
        },
        {
          label: '操作',
          prop: 'tableSetting',
          type: 'index',
          width: '80',
          align: 'center'
        },
        {
          label: '项目节点',
          prop: 'revenueName',
          'min-width': '300',
          align: 'left'
        },
        {
          label: '是否最后一笔回款',
          prop: 'isLast',
          width: '150',
          align: 'center'
        },
        {
          label: '金额(万元)',
          prop: 'revenueMoney',
          width: '150',
          align: 'center'
        },
        {
          label: '收款时间',
          prop: 'incomeTime',
          width: '150',
          align: 'center'
        }

      ]
      that.columns = columns
    },
    setItemKey (item) {
      item.key = item.id
      let that = this
      if (item.children && item.children.length > 0) {
        item.children.map(function (subItem, idx) {
          that.setItemKey(subItem)
        })
      }
    },
    getRevenueData () {
      let that = this
      that.$api['collectionManager.getRevenueData'](this.thirdMenuParam).then(res => {
        if (res) {
          that.revenueInfoStatus = res.revenueInfoStatus
          that.comeInMoney = res.comeInMoney
          that.payMoney = res.payMoney
          that.confirmMoney = res.confirmMoney
        }
      })
    },
    queryList () {
      const that = this
      this.isListLoading = true
      this.tableRefresh(new Promise((resolve, reject) => {
        if (that.tableApi) {
          that.$api[that.tableApi](this.thirdMenuParam).then(function (res) {
            that.isListLoading = false

            let data = generateTree(res.records ? res.records : res, 'parentId')

            if (data && data.length > 0) {
              data.forEach(function (item, idx) {
                that.setItemKey(item)
              })
            }
            that.tableData = data
            that.getRevenueData()
            resolve()// 调用列表接口成功后的回调方法
          }).catch(function (error) {
            reject(error) // 调用列表接口失败后的回调方法
          })
        }
      }))
    },
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
    getReceiveManager (entityId, parentId) {
      let that = this
      this.$api['collectionManager.getReceiveManager']({ id: entityId, parentId: parentId }).then(function (res) {
        that.formParam = Object.assign({}, res)
        that.canUseMoneyTemp = res.canUseMoney
        that.isLastCountTemp = res.isLastCount
        that.visibleEditDialog = true
      }).catch(function (error) {
        console.log(error)
      })
    },
    onCreateOpen (row) {
      this.getReceiveManager('', row.id)
    },
    onUpdateOpen (row) {
      this.getReceiveManager(row.id, row.parentId)
    },
    onCreateClose () {
      this.visibleEditDialog = false
    },
    saveCallback () {
      this.visibleEditDialog = false
      this.queryList()
    },
    confirmRevenue (record, item) {
      let type = 'success'
      let msg = '保存成功！'

      let that = this
      let last = record.isLast
      let parentId = record.parentId
      let id = record.id
      // 最后一笔收款
      if (last === 1) {
        that.$api['collectionManager.checkIsLastConfirm']({ id: id, parentId: parentId }).then(res => {
          if (res && res === 'yes') {
            if (that.revenueInfoStatus === '4526') {
              that.$confirm(`确认后不可修改,该项收款金额会充入可分配金额中,是否确认？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                that.$api['collectionManager.confirmRevenue']({ id: record.id }).then(res => {
                  if (res && res === 'yes') {
                    that.queryList()
                  } else {
                    type = 'error'
                    msg = '保存失败！'
                  }
                })
                that.$message(
                  {
                    message: msg,
                    type: type
                  }
                )
              }).catch(() => { })
            } else {
              that.$message(
                {
                  message: '预算未发布,不能收款!',
                  type: 'error'
                }
              )
            }
          } else {
            that.$message(
              {
                message: '其他节点收款完成，最后一笔收款才能确认!',
                type: 'error'
              }
            )
          }
        })
      } else {
        if (that.revenueInfoStatus === '4526') {
          that.$confirm(`确认后不可修改,该项收款金额会充入可分配金额中,是否确认？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            that.$api['collectionManager.confirmRevenue']({ id: record.id }).then(res => {
              if (res && res === 'yes') {
                that.queryList()
              } else {
                type = 'error'
                msg = '保存失败！'
              }
            })
            that.$message(
              {
                message: msg,
                type: type
              }
            )
          }).catch(() => { })
        } else {
          that.$message(
            {
              message: '预算未发布,不能收款!',
              type: 'error'
            }
          )
        }
      }
    },
    deleteBudgetData (record, item) {
      let type = 'success'
      let msg = '删除成功！'

      let that = this
      that.$confirm(`是否要删除该节点？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$api['collectionManager.removeRevenue']({ id: record.id }).then(res => {
          if (res && res === 'true') {
            that.queryList()
          } else {
            type = 'error'
            msg = '删除失败！'
          }
        })
        this.$message(
          {
            message: msg,
            type: type
          }
        )
      }).catch(() => { })
    },
    search (param) {
      if (param) {
        this.queryParam = param
      }
      let that = this
      Vue.nextTick(function () {
        that.$refs.table.searchData()
      })
    },
    reSet () {
      let that = this
      Object.keys(that.queryParam).forEach(key => { that.queryParam[key] = null })
      Vue.nextTick(function () {
        that.$refs.table.searchData()
      })
    }
  }
}
</script>
