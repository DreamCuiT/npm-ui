<template>

  <div class="tableDiv">
    <el-table :data="tableData"
              :height="flexHeight"
              highlight-current-row
              row-key="id"
              v-bind="tableConfig"
              :default-expand-all="true">
      <el-table-column v-for="(item, index) in columns"
                       :key="index"
                       :prop="item.prop"
                       :align="item.align"
                       :type="item.type"
                       :label="item.label"
                       :formatter="formatDate"
                       :width="item.width">
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
import { Table, TableColumn } from '~/index'
import moment from 'moment'
const mh = document.documentElement.clientHeight - 265
export default {
  name: 'SupplementaryContract',
  components: {
    'el-table': Table,
    'el-table-column': TableColumn
  },
  props: {
    record: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      tableApi: 'collectionBudget.contractChange',
      flexHeight: mh,
      columns: [],
      tableData: [],
      comp: this,
      tableConfig: {
      }
    }
  },
  created () {
    this.initColumns()
  },
  mounted () {
    this.queryList()
  },
  methods: {
    formatDate (row, column, cellValue, index) {
      if (column && column.property === 'endTime' && cellValue) {
        if (!row.time) {
          return moment(cellValue).format('YYYY-MM-DD')
        }
      } else if (column && column.property === 'modifyIdentify') {
        if (cellValue === 'update') {
          return '修改'
        } else if (cellValue === 'add') {
          return '新增'
        } else if (cellValue === 'del') {
          return '删除'
        }
      }
      return cellValue
    },
    initColumns: function () {
      let that = this
      const columns = [
        {
          label: '序号',
          type: 'index',
          align: 'center'
        },
        {
          label: '节点名称',
          prop: 'nodeName',
          align: 'center'
        },
        {
          label: '金额(万元)',
          prop: 'nodeMoney',
          align: 'center'
        },
        {
          label: '时间',
          prop: 'endTime',
          align: 'center'
        },
        {
          label: '类型',
          prop: 'modifyIdentify',
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
    queryList () {
      const that = this
      this.tableRefresh(new Promise((resolve, reject) => {
        if (that.tableApi) {
          that.$api[that.tableApi](this.record).then(function (res) {
            let data = res.records ? res.records : res
            data.forEach(function (item, idx) {
              that.setItemKey(item)
            })
            that.tableData = data
            console.log()
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
    }
  }
}
</script>
