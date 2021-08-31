<template>
  <el-dialog title='项目计划'
             :visible.sync='visible'
             width='1200px'
             :before-close="cancel"
             :append-to-body='true'>
    <list-layout>
      <template #north>
        <el-button type="primary"
                   @click="submit">确 定</el-button>
        <search-form-list ref="search"
                          :dataSource="searchData"
                          @search="search"
                          @re-set="reSet"></search-form-list>
      </template>
      <template #center>
        <common-table ref='tableCom'
                      :columns='columns'
                      :params='queryParam'
                      :flex='500'
                      :api='tableApi'
                      :table-Refresh='tableRefresh'
                      :table-config='tableConfig'
                      @select="select"
                      @select-all="selectAll"
                      @row-click='rowClick'
                      @row-dblclick='rowDblclick'></common-table>
      </template>
    </list-layout>
  </el-dialog>
</template>
<style>
</style>
<script>
import { P8Table as CommonTable } from '~/index'
import { P8ListLayout as ListLayout } from '~/index'
import { Dialog, Button } from '~/index'
import { P8Search as SearchFormList } from '~/index'
import Vue from 'vue'

const columns = [
  {
    type: 'selection',
    width: 45,
    align: 'center'
  },
  {
    title: '序号',
    type: 'index',
    width: 45,
    align: 'center'
  },
  {
    title: '项目编码',
    dataIndex: 'pjCode',
    width: 180,
    align: 'center'
  },
  {
    title: '项目名称',
    dataIndex: 'name',
    minWidth: 300,
    align: 'left'
  },
  {
    title: '项目类型',
    dataIndex: 'kprojectClassifyname',
    width: 120,
    align: 'center'
  }

  // {
  //   title: '项目分级',
  //   dataIndex: 'projectOrderDisplay',
  //   width: 120,
  //   align: 'center'
  // }
  // ,
  // {
  //   title: '管理部门',
  //   dataIndex: 'departmentName',
  //   width: 180,
  //   align: 'center',
  //   formatter: function (row) {
  //     if (row.pdepartmentName) {
  //       return row.pdepartmentName + '-' + row.departmentName
  //     } else {
  //       return row.departmentName
  //     }
  //   }
  // }
]
const searchData = [
  {
    type: 'text', // 控件类型
    labelText: '项目名称', // 控件显示的文本
    fieldName: 'productName',
    placeholder: '请输入项目名称'
  },
  {
    type: 'text', // 控件类型
    labelText: '项目编号', // 控件显示的文本
    fieldName: 'pjCode',
    placeholder: '请输入项目编号', // 默认控件的空值文本
    fieldEvent: {
      click: 'clickEvent(this)'
    }
  },
  {
    type: 'multiple',
    labelText: '所属型号11111111111',
    fieldName: 'modelInformationId',
    placeholder: '请选择型号代号111111111111111',
    optionUrl: {
      api: 'ProjectApply.getModelListData',
      label: 'modelCode',
      value: 'id',
      params: {}
    },
    treeData: []
  },
  // {
  //   type: 'treeSelect',
  //   multiple: true,
  //   labelText: '管理部门',
  //   fieldName: 'departmentId',
  //   defaultValue: [],
  //   placeholder: '请选择管理部门',
  //   optionUrl: {
  //     api: 'ProjectApply.deptTree',
  //     params: {}
  //   },
  //   treeData: []
  // },
  {
    type: 'treeSelect',
    labelText: '项目类型',
    fieldName: 'kprojectClassifyId',
    placeholder: '请选择项目类型',
    multiple: true,
    optionUrl: {
      api: 'ProjectApply.projectClassifyTree',
      params: {},
      // label: 'name',
      value: 'id'
    },
    treeData: []
  }
  // {
  //   type: 'multiple',
  //   optionUrl: {
  //     api: 'thirdPartInterface.getDic',
  //     params: { dicType: 'PROJECT_ORDER' }
  //   },
  //   options: [],
  //   labelText: '项目分级', // 控件显示的文本
  //   fieldName: 'projectOrder',
  //   placeholder: '请选择项目分级'
  // }
]

export default {
  name: 'SelectProject',
  props: ['selectedRow', 'visible'],
  components: {
    'el-dialog': Dialog,
    CommonTable,
    SearchFormList,
    ListLayout,
    'el-button': Button
  },
  data () {
    return {
      tableConfig: {
        queryParam: {},
        highlightCurrentRow: true
      },
      currentRow: {},
      queryParam: {
      },
      searchData: searchData,
      tableApi: 'ProjectApply.projectList',
      columns: columns
    }
  },
  methods: {
    selectAll () {
      this.$refs.tableCom.$refs.table.clearSelection()
    },
    rowClick (row, column, event) {
      this.$refs.tableCom.$refs.table.clearSelection()
      this.$refs.tableCom.$refs.table.setCurrentRow(row)
      this.$refs.tableCom.$refs.table.toggleRowSelection(row, true)
      this.currentRow = row
    },
    // 双击行，直接关闭抽屉、回填值
    rowDblclick (row, column, event) {
      this.$refs.tableCom.$refs.table.clearSelection()

      this.$refs.tableCom.$refs.table.setCurrentRow(row)
      this.currentRow = row
      this.submit()
    },
    select (selection, row) {
      this.$refs.tableCom.$refs.table.clearSelection()
      this.$refs.tableCom.$refs.table.toggleRowSelection(row, true)
      this.currentRow = row
    },
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
    cancel () {
      this.$emit('close-modal', {})
    },
    submit () {
      this.$emit('close-modal', this.currentRow)
    },
    search (param) {
      let newParams = {
        ...param,
        ...(this.queryParam.roleName
          ? { roleName: this.queryParam.roleName }
          : {})
      }
      this.queryParam = newParams
      let that = this
      Vue.nextTick(function () {
        that.$refs.tableCom.queryList()
      })
    },
    reSet () {
      Object.keys(this.queryParam).forEach(key => {
        this.queryParam[key] = ''
      })
      Vue.nextTick(function () {
        this.$refs.tableCom.searchData()
      })
    }
  }
}
</script>
