<template>
  <el-dialog title='项目选择'
             :visible.sync='visible'
             width='1200px'
             :before-close="cancel"
             :append-to-body='true'>
    <list-layout>
      <template #north>
        <el-button type="primary" @click="submit">确 定</el-button>
        <search-form-list ref="search" :dataSource="searchData" @search="search" @re-set="reSet"></search-form-list>
      </template>
      <template #center>
        <common-table ref='tableCom'
                      :columns='columns'
                      :params='queryParam'
                      :flex='500'
                      :api='tableApi'
                      :table-Refresh='tableRefresh'
                      :table-config='tableConfig'
                      @row-click='rowClick'></common-table>
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
  },

  // {
  //   title: '项目分级',
  //   dataIndex: 'projectOrderDisplay',
  //   width: 120,
  //   align: 'center'
  // },
  // {
  //   title: '管理部门',
  //   dataIndex: 'departmentName',
  //   width: 180,
  //   align: 'center'
  // },
  {
    title: '排序号',
    dataIndex: 'indexNo',
    width: 90,
    align: 'center'
  }
]
const searchData = [
  // {
  //   type: 'treeSelect',
  //   labelText: '管理部门',
  //   fieldName: 'deptId',
  //   defaultValue: [],
  //   placeholder: '选择管理部门',
  //   optionUrl: {
  //     api: 'ProjectApply.deptTree',
  //     params: {}
  //   },
  //   treeData: []
  // },
  {
    type: 'text', // 控件类型
    labelText: '项目名称', // 控件显示的文本
    fieldName: 'productName',
    placeholder: '请输入项目名称'
  },
  {
    type: 'text', // 控件类型
    labelText: '项目代码', // 控件显示的文本
    fieldName: 'projectCode',
    placeholder: '请输入项目代码', // 默认控件的空值文本
    fieldEvent: {
      click: 'clickEvent(this)'
    }
  },
  {
    type: 'select',
    labelText: '所属型号',
    fieldName: 'modelCode',
    placeholder: '选择所属型号',
    optionUrl: {
      api: 'ProjectApply.getModelListData',
      label: 'modelCode',
      value: 'id',
      params: {}
    },
    treeData: []
  },
  {
    type: 'treeSelect',
    labelText: '项目类型',
    fieldName: 'projectClassifyId',
    placeholder: '请输入项目代码',
    multiple: true,
    optionUrl: {
      api: 'ProjectApply.projectClassifyTree',
      params: {},
      // label: 'name',
      value: 'id'
    },
    treeData: []
  },
  {
    type: 'select', // 控件类型
    optionUrl: {
      api: 'thirdPartInterface.getDic',
      params: { dicType: 'PROJECT_ORDER' }
    }
    // options: [],
    // labelText: '项目分级', // 控件显示的文本
    // fieldName: 'projectOrderId',
    // placeholder: '请输入项目代码'
  }
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
        mark: 'mark_02'
      },
      searchData: searchData,
      tableApi: 'planInfoManager.getWholeDescribePage',
      columns: columns
    }
  },
  methods: {
    rowClick (row, column, event) {
      this.$refs.tableCom.$refs.table.setCurrentRow(row)
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
