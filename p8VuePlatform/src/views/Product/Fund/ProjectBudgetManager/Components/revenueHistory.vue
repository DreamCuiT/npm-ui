<template>
  <el-dialog :title="title"
             width="60%"
             :visible="visible"
             append-to-body
             destroy-on-close
             :style="{'--height':renderDialogHeight+'px'}"
             @close="handleCancel">
    <common-table ref="table"
                  :comp="comp"
                  :columns="columns"
                  :params="queryParam"
                  :api="tableApi"
                  :customHeight="customHeight"
                  :table-Refresh="tableRefresh"
                  @row-click="tempRowClick"
                  :pagination="false">
    </common-table>
    <revenue-history-detail v-if="showRevenueHistoryDetail"
                            :visible="showRevenueHistoryDetail"
                            :historyData="historyData"
                            :historyColumns="historyColumns"
                            :title="dialogTitle"
                            @close-dialog='onRevenueHistoryDetailClose'>
    </revenue-history-detail>
  </el-dialog>
</template>

<script>
import { Dialog } from '~/index'
import { P8Table as CommonTable } from '~/index'
import RevenueHistoryDetail from './revenueHistoryDetail'
export default {
  name: 'RevenueHistory',
  components: {
    'el-dialog': Dialog,
    RevenueHistoryDetail,
    CommonTable
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
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
            type: 'index',
            width: '55px',
            align: 'center'
          },
          {
            title: '变更人',
            align: 'center',
            dataIndex: 'realName'
          },
          {
            title: '版本',
            align: 'center',
            dataIndex: 'version'
          },
          {
            title: '调整原因',
            align: 'center',
            dataIndex: 'reason'
          },
          {
            title: '创建时间',
            align: 'center',
            dataIndex: 'itemCreateTime'
          }
        ]
      }
    }
  },
  data () {
    const mh = document.documentElement.clientHeight - 300
    return {
      tableApi: 'revenueFullBudget.historyData',
      comp: this,
      renderDialogHeight: mh,
      customHeight: mh,
      dialogTitle: '',
      historyData: '',
      historyColumns: '',
      showRevenueHistoryDetail: false,
      queryParam: {}
    }
  },
  created () {
    this.queryParam = Object.assign({}, this.thirdMenuParam)
  },
  mounted () {
  },
  computed: {
  },
  methods: {
    tempRowClick (record, column, event) {
      this.historyColumns = record.historyColumns
      this.historyData = record.historyData
      this.dialogTitle = '查看历史预算版本明细'
      this.showRevenueHistoryDetail = true
    },
    onRevenueHistoryDetailClose () {
      this.showRevenueHistoryDetail = false
      this.dialogTitle = ''
      this.historyColumns = ''
      this.historyData = ''
    },
    handleCancel () {
      this.$emit('close-dialog')
    },
    tableRefresh (param) {
      param
        .then(() => {
          console.log('异步成功后端做的操作')
        })
        .catch(() => {
          console.log('异步失败的操作')
        })
    }
  }
}
</script>
