<template>
  <list-layout>
    <template #north>
      <el-button type="primary" round @click="edit">新建</el-button>
    </template>
    <template #center>
      <common-table
        ref="table"
        :columns="columns"
        api="formGenerator.tableList"
        :tableRefresh="tableRefresh"
      >
        <template #operation="{ scope }">
          <el-button type="text" @click="modify(scope)">修改</el-button>
          <el-button type="text" @click="remove(scope)">删除</el-button>
          <el-button type="text" @click="functionTest(scope)">功能测试</el-button>
          <el-button type="text" @click="tableAddress(scope)">报表配置地址</el-button>
          <!-- <el-button type="text" @click="viewAddress(scope)">查看配置地址</el-button> -->
        </template>
      </common-table>
    </template>
    <template #drawer-panel>
      <common-drawer
        :title="drawerTitle"
        :visible="visible"
        size="100%"
        @close="tableEditClose"
      >
        <template #drawer>
          <table-list-edit
            :record="record"
            @saveSuccess="saveCallback"
          ></table-list-edit>
        </template>
      </common-drawer>
      <common-drawer
        :title="functionTestTitle"
        :visible="functionTestVisible"
        size="100%"
        @close="functionTestClose"
      >
        <template #drawer>
          <table-render
            :code="record.code"
            @saveSuccess="saveCallback"
            :reportParam="{}"
          ></table-render>
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
import TableListEdit from './Components/edit'
import TableRender from './Components/tableRender'
export default {
  name: 'TableList',
  components: {
    ListLayout,
    CommonTable,
    CommonDrawer,
    TableListEdit,
    TableRender,
    'el-button': Button
  },
  data () {
    const columns = [
      {
        title: '报表编码',
        dataIndex: 'code'
      },
      {
        title: '报表名字',
        dataIndex: 'name'
      },
      {
        title: '报表SQLId',
        dataIndex: 'sqlid',
        width: 200
      },
      {
        title: '描述',
        dataIndex: 'content'
      },
      {
        title: '修改人id',
        dataIndex: 'updateBy'
      },
      {
        title: '创建人id',
        dataIndex: 'createBy'
      },
      {
        title: '创建时间',
        dataIndex: 'itemCreateTime'
      },
      {
        title: '修改时间',
        dataIndex: 'itemModifyTime'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: 250,
        scopedSlots: { customRender: 'custom' }
      }
    ]
    return {
      columns: columns,
      visible: false,
      drawerTitle: '',
      functionTestVisible: false,
      functionTestTitle: '',
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
      this.drawerTitle = '新建报表'
      this.visible = true
    },
    modify (scope) {
      this.record = Object.assign({}, scope.row)
      this.drawerTitle = '修改报表'
      this.visible = true
    },
    remove (scope) {
      let that = this
      this.$confirm(`是否确定要删除该报表？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$api['formGenerator.tableRemove']({
          reportId: scope.row.id
        }).then(res => {
          console.log(res, '删除')
          that.$refs.table.searchData()
        })
      }).catch((e) => { console.log(e) })
    },
    functionTest (scope) {
      this.functionTestTitle = '功能测试'
      this.record = Object.assign({}, scope.row)
      this.functionTestVisible = true
    },
    tableAddress (scope) {
      this.$confirm('Framework/ComponentsMananger/Grid/Components/tableRender?code=' + scope.row.code, '报表配置地址', {
        confirmButtonText: '确定',
        showCancelButton: false,
        type: 'info'
      })
    },
    viewAddress (scope) {
      this.$confirm('Framework/ComponentsMananger/Grid/Components/viewRender?code=XXX&record={XXX:XXX}', '查看页面配置地址', {
        confirmButtonText: '确定',
        showCancelButton: false,
        type: 'info'
      })
    },
    tableEditClose () {
      this.visible = false
    },
    functionTestClose () {
      this.functionTestVisible = false
    },
    saveCallback () {
      this.$refs.table.searchData()
      this.tableEditClose()
    }
  }
}
</script>
<style lang="scss">
.el-message-box__message p {
  word-wrap: break-word;
}
</style>
