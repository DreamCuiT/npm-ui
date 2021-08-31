<template>
    <common-dialog title="分解目标列表"
                   v-if="visible"
                   :visible="visible"
                   :width="dialogWidth"
                   :dialogHeight="dialogHeight"
                   :dialogConfig="dialogConfig"
                   :showHandleBtn="false"
                   @handle-cancel="dialogClose"
                   @handle-ok="dialogClose"
                   @close="dialogClose">
        <template #dialog>
            <list-layout>
                <template #north>
                    <el-button type="primary" size="mini" @click="addTarget">添加</el-button>
                    <el-button type="primary" size="mini" @click="deleteTarget">删除</el-button>
                    <search-form-list ref="search"
                                      :dataSource="searchData"
                                      @search="search"
                                      @re-set="reSet"></search-form-list>
                </template>
                <template #center>
                    <common-table ref="table"
                                  :comp="comp"
                                  :columns="columns"
                                  :params="queryParam"
                                  :api="tableApi"
                                  :table-Refresh="tableRefresh"
                                  :pagination="true"
                                  @selection-change="handleSelectionChange">
                    </common-table>
                    <div id="table-contain">
                    </div>
                </template>
                <template #drawer-panel>
                    <div>
                        <common-drawer style="width: 50%;right: 0;left: auto;position: absolute"
                                       v-if="editTargetView"
                                       :visible="editTargetView"
                                       :drawerConfig="drawerConfig"
                                       title='增加'
                                       size="100%"
                                       @close="editTargetViewClose">
                            <template #drawer>
                                <EditTarget :dutyGroupId="duty.id" @save-success="editTargetViewClose"></EditTarget>
                            </template>
                        </common-drawer>
                    </div>
                </template>
            </list-layout>
        </template>
    </common-dialog>
</template>

<script>
import Vue from 'vue'
import { P8Dialog as CommonDialog, P8Table as CommonTable, P8Drawer as CommonDrawer, P8Search as SearchFormList, P8ListLayout as ListLayout } from '~/index'
import EditTarget from './EditTarget'

export default {
  name: 'targetList',
  props: {
    duty: {
      type: Object,
      default: undefined
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    CommonDialog,
    ListLayout,
    CommonTable,
    CommonDrawer,
    SearchFormList,
    EditTarget
  },
  data () {
    return {
      comp: this,
      queryParam: { dutyGroupId: this.duty ? this.duty.id : '' },
      tableApi: 'DutyGroupTarget.listByDutyId',
      columns: [
        {
          title: '',
          width: 35,
          type: 'selection'
        },
        {
          title: '序号',
          type: 'index',
          width: 55,
          align: 'center'
        },
        {
          title: '目标名称',
          minWidth: 120,
          dataIndex: 'targetName',
          align: 'center'
        },
        {
          title: '类型',
          dataIndex: 'typeDisplay',
          align: 'center'
        },
        {
          title: '金额',
          dataIndex: 'amount',
          align: 'center'
        },
        {
          title: '时间要求',
          minWidth: 120,
          dataIndex: 'timeOrder',
          align: 'center',
          formatter (row, column, cellValue, index) {
            if (cellValue) {
              return cellValue.slice(0, 9)
            }
          }
        },
        {
          title: '所属单位',
          minWidth: 120,
          dataIndex: 'belongToDisplay',
          align: 'center'
        }
      ],
      searchData: [],
      selectedRowKeys: [],
      selectedRows: [],
      editTargetView: false,
      dialogConfig: {
        modal: false,
        appendToBody: true,
        modalAppendToBody: true
      },
      drawerConfig: { /// z-index
        destroyOnClose: true,
        modal: false,
        appendToBody: true,
        wrapperClosable: true
      },
      dialogWidth: '80%',
      dialogHeight: 800
    }
  },
  mounted () {},
  methods: {
    dialogClose () {
      this.$emit('dialog-close')
    },
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
    handleSelectionChange (val) {
      this.selectedRowKeys = []
      this.selectedRows = val
      val.map(item => {
        this.selectedRowKeys.push(item.id)
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
      let that = this
      Object.keys(that.queryParam).forEach(key => { that.queryParam[key] = '' })
      Vue.nextTick(function () {
        that.$refs.table.searchData()
      })
    },
    addTarget () {
      this.editTargetView = true
    },
    editTargetViewClose () {
      this.editTargetView = false
      this.$refs.table.queryList()
    },
    deleteTarget () {
      let that = this
      if (this.selectedRowKeys.length === 0) {
        this.$message({ type: 'warning', message: '没有选择的数据' })
        return
      }
      this.$api['DutyGroupTarget.deleteByIds']({ ids: this.selectedRowKeys }).then(res => {
        this.$message({ type: 'success', message: '删除成功' })
        that.$refs.table.searchData()
      })
    }
  }
}
</script>

<style scoped>
</style>
