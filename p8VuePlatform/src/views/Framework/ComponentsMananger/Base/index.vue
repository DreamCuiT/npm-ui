<template>
  <list-layout>
    <template #north>
      <el-button type="primary" round @click="edit">新建</el-button>
    </template>
    <template #center>
      <common-table
        ref="table"
        :flex="200"
        :columns="columns"
        api="formGenerator.compList"
        :tableRefresh="tableRefresh"
        :pagination="false"
      >
      <template #operation="{scope}">
        <el-button type="text" @click="modify(scope)">修改</el-button>
        <el-button type="text" @click="remove(scope)">删除</el-button>
        <!-- <el-button type="text" @click="enable(scope)">启用</el-button> -->
      </template>
      </common-table>
    </template>
    <template #drawer-panel>
      <common-drawer :title="drawerTitle" :visible="visible" size="50%" @close="compEditClose">
        <template #drawer>
          <comp-list-edit :record="record" @saveSuccess="saveCallback"></comp-list-edit>
        </template>
      </common-drawer>
    </template>
  </list-layout>
</template>

<script>
import { Button } from '~/index'
import { P8ListLayout as ListLayout } from '~/index'
import { P8Table as CommonTable } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'
import CompListEdit from './Components/edit'
export default {
  name: 'CompList',
  components: {
    ListLayout,
    CommonTable,
    CommonDrawer,
    CompListEdit,
    'el-button': Button
  },
  data () {
    const columns = [
      {
        title: '组件名称',
        dataIndex: 'compName'
      },
      {
        title: '组件标识',
        dataIndex: 'compCode'
      },
      {
        title: '启用状态',
        dataIndex: 'compStatus'
      },
      {
        title: '组件类型',
        dataIndex: 'compType'
      },
      {
        title: 'icon',
        dataIndex: 'compIcon'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'custom' }
      }
    ]
    return {
      columns: columns,
      visible: false,
      drawerTitle: '',
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
    edit () {
      this.record.id = ''
      this.drawerTitle = '新建组件'
      this.visible = true
    },
    modify (scope) {
      this.record = Object.assign({}, scope.row)
      this.drawerTitle = '修改组件'
      this.visible = true
    },
    remove (scope) {
      let that = this
      this.$confirm(`是否确定要删除该组件？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$api['formGenerator.compRemove']({
          ids: [scope.row.id]
        }).then(res => {
          console.log(res, '删除')
          that.$refs.table.searchData()
        })
      }).catch((e) => { console.log(e) })
    },
    enable (scope) {

    },
    compEditClose () {
      this.visible = false
    },
    saveCallback () {
      this.$refs.table.searchData()
      this.compEditClose()
    }
  }
}
</script>
