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
                  :useTreeFormat='useTreeFormat'
                  :useTreePId='useTreePId'
                  :params="queryParam"
                  :api="tableApi"
                  :table-Refresh="tableRefresh"
                  :customHeight="customHeight"
                  :pagination="false">
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
    columns: {
      type: Array,
      default: function () {
        return [
          {
            title: '项目/单位',
            align: 'left',
            dataIndex: 'name'
          },
          {
            title: '金额(万元)',
            align: 'center',
            dataIndex: 'money'
          }
        ]
      }
    }
  },
  data () {
    const mh = document.documentElement.clientHeight - 250
    return {
      tableApi: 'YearRevenueInfo.listTreeData',
      comp: this,
      renderDialogHeight: mh,
      customHeight: mh,
      useTreeFormat: true,
      useTreePId: 'parentId',
      queryParam: {}
    }
  },
  created () {
    this.queryParam.revenueYearInfoId = this.revenueYearInfoId
    this.queryParam.year = this.year
    this.queryParam = Object.assign({}, this.queryParam)
  },
  mounted () {

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
