<template>
  <list-layout>
    <template #north>
      <el-button type="primary" round @click="edit">新建</el-button>
    </template>
    <template #center>
      <common-table
        ref="table"
        :columns="columns"
        api="formGenerator.formList"
        :tableRefresh="tableRefresh"
      >
        <template #operation="{scope}">
          <el-button type="text" @click="modify(scope)">修改</el-button>
          <el-button type="text" @click="remove(scope)">删除</el-button>
          <el-button type="text" @click="formDesign(scope)">表单设计</el-button>
          <el-button type="text" @click="dataView(scope)">数据查看</el-button>
          <el-button type="text" @click="formDesignCopy(scope)">表单设计复制</el-button>
        </template>
      </common-table>
    </template>
    <template #drawer-panel>
      <!-- 表单设计器 -->
      <common-drawer :visible="visible" direction="ttb" size="100%" @close="formDesignClose">
        <template #drawer>
          <form-generator :record="record"></form-generator>
        </template>
      </common-drawer>
      <!-- 表单新建 -->
      <common-drawer :title="drawerTitle" :visible="editVisible" size="50%" @close="formEditClose">
        <template #drawer>
          <form-list-edit @saveSuccess="saveCallback" :record="record"></form-list-edit>
        </template>
      </common-drawer>
      <!-- 表单数据查看 -->
      <common-drawer :title="dataViewTitle" :visible="dataViewVisible" size="100%" @close="dataViewClose">
        <template #drawer>
          <form-data-list :record="record"></form-data-list>
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
import { P8FormGenerator as FormGenerator } from '~/index'
import FormListEdit from './Components/edit'
import FormDataList from './Components/formDataList'
export default {
  name: 'CustomFormGenerator',
  components: {
    ListLayout,
    CommonTable,
    CommonDrawer,
    FormGenerator,
    FormListEdit,
    FormDataList,
    'el-button': Button
  },
  data () {
    const columns = [
      {
        title: '表单编码',
        dataIndex: 'desformCode'
      },
      {
        title: '表单名称',
        dataIndex: 'desformName'
      },
      // {
      //   title: '数据源',
      //   dataIndex: 'cgFormTableName'
      // },
      {
        title: '表单状态',
        dataIndex: 'desformStatus'
      },
      {
        title: '描述',
        dataIndex: 'desformDesc'
      },
      {
        title: '操作',
        width: 300,
        dataIndex: 'operation',
        scopedSlots: { customRender: 'custom' }
      }
    ]
    return {
      columns: columns,
      visible: false,
      editVisible: false,
      drawerTitle: '',
      dataViewVisible: false,
      dataViewTitle: '',
      record: {},
      desCopyApi: 'formGenerator.desCopy'
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
      this.drawerTitle = '新建表单'
      this.editVisible = true
    },
    modify (scope) {
      this.record = Object.assign({}, scope.row)
      this.drawerTitle = '修改表单'
      this.editVisible = true
    },
    remove (scope) {
      let that = this
      this.$confirm(`是否确定要删除该表单？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$api['formGenerator.formListRemove']({
          ids: [scope.row.id]
        }).then(res => {
          console.log(res, '删除')
          that.$refs.table.searchData()
        })
      }).catch((e) => { console.log(e) })
    },
    formDesign (scope) {
      this.visible = true
      this.record = Object.assign({}, scope.row)
      console.log(scope, 'scope')
    },
    dataView (scope) {
      this.dataViewTitle = '表单数据查看列表'
      this.record = Object.assign({}, scope.row)
      this.dataViewVisible = true
    },
    formDesignCopy (scope) {
      // this.$refs.table.searchData() // 刷新列表
      const _this = this
      this.$api[_this.desCopyApi]({
        desFormId: scope.row.id
      }).then(res => {
        _this.$message({
          message: '复制成功',
          type: 'success'
        })
        _this.$refs.table.searchData() // 刷新列表
      })
    },
    formDesignClose () {
      this.visible = false
    },
    formEditClose () {
      this.editVisible = false
    },
    saveCallback () {
      this.$refs.table.searchData()
      this.formEditClose()
    },
    dataViewClose () {
      this.dataViewVisible = false
    }
  }
}
</script>
