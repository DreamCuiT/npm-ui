<template>
  <list-layout>
    <template #north>
    </template>
    <template #center>
      <common-table ref="table"
                    :comp="comp"
                    :columns="columns"
                    :params="queryParam"
                    :api="tableApi"
                    :table-Refresh="tableRefresh"
                    :pagination="true">
      </common-table>
    </template>
    <template #drawer-panel>
      <common-drawer :title="drawerTitle"
                     :visible="drawerVisible"
                     size="70%"
                     @close="onDrawerClose">
        <template #drawer>
          <warning-edit @saveSuccess="saveCallback"
                        :record="record"></warning-edit>
        </template>
      </common-drawer>
    </template>
  </list-layout>
</template>
<script>
import Vue from 'vue'
import { P8ListLayout as ListLayout } from '~/index'
import { P8Table as CommonTable } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'
import WarningEdit from './edit'

export default {
  name: 'earlyWarningList',
  data () {
    const columns = [
      {
        title: '序号',
        type: 'index',
        width: 55,
        align: 'center'
      },
      {
        title: '领域',
        dataIndex: 'meaning',
        align: 'center'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: 220,
        scopedSlots: { customRender: 'operation' },
        align: 'center'
      }
    ]
    return {
      columns: columns,
      tableApi: 'earlyWarning.EarlyWarningList',
      queryParam: {},
      comp: this,
      drawerTitle: null,
      drawerVisible: false,
      record: {}
    }
  },
  methods: {
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
    reSet () {
      let that = this
      Object.keys(that.queryParam).forEach(key => { that.queryParam[key] = '' })
      Vue.nextTick(function () {
        that.$refs.table.searchData()
      })
    },
    createEarlyWarning (type) {
      this.drawerVisible = true
      this.record = {}
    },
    updateEarlyWarning (record) {
      this.drawerVisible = true
      this.record = record
    },
    onDrawerClose () { // 抽屉关闭
      this.drawerVisible = false
      this.record = {}
    },
    saveCallback () {
      this.$refs.table.searchData()
      this.onDrawerClose()
    }
  },
  components: {
    ListLayout,
    CommonTable,
    CommonDrawer,
    WarningEdit
  }
}
</script>

<style scoped>
</style>
