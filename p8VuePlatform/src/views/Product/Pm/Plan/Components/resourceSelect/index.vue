<template>
  <common-dialog
      :title="title"
      @close="handleCancel"
      :visible="visible"
      :dialogConfig="dialogConfig"
      :showHandleBtn="true"
      :dialog-height="dialogHeight"
      :width="dialogWidth"
      @handle-ok="handleOk"
      @handle-cancel="handleCancel"
      @isfullscreen="isfullscreen"
  >
    <template #dialog>
      <list-layout>
        <template #north>
          <div class="input-con">
            <el-input
              class="input-name input-search-name"
              placeholder="支持人员名称、部门、角色模糊查询，例如：李四、lisi、部门1、计划经理"
              v-model="queryParam.searchName"
              size="small"
            ></el-input>
          </div>
          <i class="el-icon-d-arrow-right" v-if="tableV" @click="() => {tableV = !tableV;resourceWidth = '100%'}"></i>
        </template>
        <template #center>
          <div id="table-contain">
            <div class="resourceList" :style="{'width':resourceWidth}">
              <common-table ref='tableCom'
                          :columns='columns'
                          :params='queryParam'
                          :api='tableApi'
                          :style="{height: customHeight + 'px'}"
                          :table-Refresh='tableRefresh'
                          :table-config='tableConfig'
                          :tableSetting="false"
                          :disabledCheckAll="true"
                          @row-click="rowClick"
                          @select="select"
                          @row-dblclick='rowDblclick'
                          @requested-table-data="requestedTableData">
                          <template #taskCount="{scope}">
                            <i v-if="scope.row.taskCount>0" class="p8 icon-conflict" @click="showUserLoad(scope.row)"></i>
                          </template>
              </common-table>
            </div>
            <div class="resourceLoad">
              <common-table ref='table'
                          v-if="tableV"
                          :columns='columnsT'
                          :params='queryParamT'
                          :style="{height: customHeight + 'px'}"
                          :api='tableApiT'
                          :table-Refresh='tableRefreshT'
                          :table-config='tableConfigT'
                          :tableSetting="false"
                          >
              </common-table>
            </div>
          </div>
        </template>
      </list-layout>
    </template>
  </common-dialog>
</template>
<style lang="scss" scoped>
  .date-range-con,
  .input-con {
    float: left;
    height: 30px;
    width:500px;
  }
  .input-con {
    margin-left: 10px;
  }
  .search-btn {
    float: right;
    height: 30px;
  }
  .el-icon-d-arrow-right{
    float:right;
    font-size:20px;
    margin-top:6px;
    cursor:pointer;
  }
  .icon-conflict{
    cursor:pointer;
    font-size:20px;
    color:#ff0000;
  }
  .input-search-name.el-input--mini {
    width: 470px !important;
  }
  .table-con .small-table {
    overflow-y: auto;
  }
  .resourceList{
    float:left;
    width:calc(50% - 5px);
  }
  .resourceLoad{
    float:right;
    width:50%;
  }
</style>
<script>
import { P8Table as CommonTable } from '~/index'
import { P8Dialog as CommonDialog } from '~/index'
import { P8ListLayout as ListLayout } from '~/index'
import { Input } from '~/index'
import Vue from 'vue'
export default {
  name: 'ResourceSelect',
  components: {
    'el-input': Input,
    CommonTable,
    CommonDialog,
    ListLayout
  },
  props: ['startTaskId', 'endTaskId', 'planInfoId', 'visible', 'selectTaskOwnerId'],
  data () {
    return {
      comp: this,
      title: '选择责任人',
      dialogWidth: '60%',
      dialogHeight: 580,
      tableV: false,
      dialogConfig: {
        modal: false
      },
      tableApi: 'planGanttManager.planResourceLoad',
      queryParam: {
        planInfoId: this.planInfoId,
        startTaskId: this.startTaskId,
        endTaskId: this.endTaskId,
        searchName: ''
      },
      tableConfig: {
        'highlight-current-row': true
      },
      resourceWidth: '100%',
      customHeight: 462,
      columns: [
        {
          title: '',
          width: 35,
          type: 'selection',
          selectable: function (row, index) {
            if (row.weatherOut === '1') {
              return false
            }
            return true
          }
        },
        {
          title: '序号',
          type: 'index',
          align: 'center',
          width: 60
        },
        {
          title: '人员',
          dataIndex: 'name',
          align: 'center',
          width: 85
        },
        {
          title: '部门',
          dataIndex: 'deptName',
          align: 'center',
          minWidth: 130
        },
        {
          title: '角色',
          dataIndex: 'roleName',
          align: 'center',
          minWidth: 130
        },
        {
          title: '负载',
          dataIndex: 'taskCount',
          align: 'center',
          width: 60,
          scopedSlots: { customRender: 'custom' }
        }
      ],
      columnsT: [
        {
          title: '序号',
          type: 'index',
          align: 'center',
          width: 60
        },
        {
          title: '项目名称',
          dataIndex: 'projectName',
          sortable: false
        },
        {
          title: '计划名称',
          dataIndex: 'planName',
          sortable: false
        },
        {
          title: '任务名称',
          dataIndex: 'taskName',
          sortable: false
        },
        {
          title: '计划开始时间',
          dataIndex: 'planBeginDate',
          align: 'center',
          width: 110,
          sortable: false
        },
        {
          title: '计划完成时间',
          dataIndex: 'planEndDate',
          align: 'center',
          width: 110,
          sortable: false
        }
      ],
      queryParamT: {
        planInfoId: this.planInfoId,
        startTaskId: this.startTaskId,
        endTaskId: this.endTaskId,
        userId: ''
      },
      tableApiT: 'planGanttManager.resourceTaskLoad',
      tableConfigT: {}
    }
  },
  mounted () {
  },
  methods: {
    // 单击选中行
    rowClick (row, column, event) {
      if (row.weatherOut === '0') {
        this.$refs.tableCom.$refs.table.clearSelection()
        this.$refs.tableCom.$refs.table.toggleRowSelection(row)
        this.currentRow = row
      }
    },
    // 勾选复选框选中行
    select (selection, row) {
      this.$refs.tableCom.$refs.table.clearSelection()
      this.$refs.tableCom.$refs.table.toggleRowSelection(row)
      this.currentRow = row
    },
    // 双击行，直接关闭抽屉、回填值
    rowDblclick (row, column, event) {
      if (row.weatherOut === '0') {
        this.$refs.tableCom.$refs.table.clearSelection()
        this.$refs.tableCom.$refs.table.toggleRowSelection(row)
        this.currentRow = row
        this.submit()
      }
    },
    showUserLoad (row) {
      if (row.weatherOut === '0') {
        this.getUserTaskInfo(row)
        this.tableV = true
        this.resourceWidth = 'calc( 50% - 5px )'
      }
    },
    isfullscreen (isfullscreen) {
      if (isfullscreen) {
        this.customHeight = document.documentElement.clientHeight - 170
      } else {
        this.customHeight = 462
      }
    },
    // 默认选中页面已选的责任人
    requestedTableData (data) {
      let _this = this
      if (data.length) {
        this.$nextTick(() => {
          data.map(item => {
          if (item.id === _this.selectTaskOwnerId) {
            _this.$refs.tableCom.$refs.table.setCurrentRow(item)
            _this.$refs.tableCom.$refs.table.toggleRowSelection(item, true)
          }
        })
        })
      }
    },
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
    submit () {
      this.$emit('resource-selected', this.currentRow.id)
    },
    search () {
      let that = this
      Vue.nextTick(function () {
        that.$refs.tableCom.searchData()
      })
    },
    handleCancel () {
      this.$emit('closed')
    },
    getUserTaskInfo (row) {
      this.$set(this.queryParamT, 'resourceId', row.id)
    },
    tableRefreshT (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
    handleOk () {
      if (this.currentRow && Object.keys(this.currentRow).length > 0) {
        this.submit()
      } else {
        this.$message({
          message: '请选择责任人！',
          type: 'warning'
        })
      }
    }
  }

}

</script>
