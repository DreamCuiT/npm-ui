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
                  :pagination="true">
    </common-table>
  </el-dialog>
</template>

<script>
import { Dialog } from '~/index'
import { P8Table as CommonTable } from '~/index'
export default {
  name: 'YearRevenueInfo',
  components: {
    'el-dialog': Dialog,
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
    year: {
      type: Number
    },
    revenueYearInfoId: {
      type: String
    },
    thirdMenuParam: {
      type: Object,
      default: function () {
        return {}
      }
    }

  },
  data () {
    const mh = document.documentElement.clientHeight - 250
    return {

      tableApi: 'YearRevenueInfo.comeInListData',
      comp: this,
      columns: [],
      renderDialogHeight: mh,
      customHeight: mh,
      queryParam: {}
    }
  },
  created () {
    let revenueStatusObj = {
      7001: '待收款',
      7003: '收款中',
      7005: '收款完成',
      7009: '待收款'
    }
    this.queryParam.revenueYearInfoId = this.revenueYearInfoId
    this.queryParam.year = this.year
    this.queryParam = Object.assign({}, this.queryParam)
    let columnsTemp = [
      {
        title: '序号',
        type: 'index'
      },
      {
        title: '项目节点',
        align: 'center',
        dataIndex: 'name'
      },
      {
        title: '金额(万元)',
        align: 'center',
        dataIndex: 'money'
      },
      {
        title: '全周期预算状态',
        align: 'center',
        dataIndex: 'status',
        formatter: function (row, column, cellValue, index) {
          let result = '待收款'
          if (cellValue && cellValue !== '') result = revenueStatusObj[cellValue]
          return result
        }
      }
    ]
    this.columns = columnsTemp
  },
  mounted () {

  },
  computed: {
  },
  methods: {
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
