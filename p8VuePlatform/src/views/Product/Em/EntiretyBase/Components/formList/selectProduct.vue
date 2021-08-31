<template>
  <el-dialog title='选择产品'
             :visible.sync='visible'
             width='700px'
             :before-close="cancel"
             :style="{'--height':renderDialogHeight+'px'}"
             :append-to-body='true'>
    <list-layout>
      <template #north>
        <el-button type="primary" @click="submit">确 定</el-button>
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
                      :customHeight="customHeight"
                      :api='tableApi'
                      :table-Refresh='tableRefresh'
                      :table-config='tableConfig'
                      @row-click="rowClick"
                      @row-dblclick='rowDblclick'>
        </common-table>
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
const mh = document.documentElement.clientHeight - 260
const columns = [
  {
    title: '序号',
    type: 'index',
    width: 55,
    align: 'center'
  },
  {
    title: '产品名称',
    dataIndex: 'mapName',
    minWidth: 300,
    align: 'left'
  },
  {
    title: '产品图号',
    dataIndex: 'mapCode',
    width: 180,
    align: 'center'
  },
  {
    title: '产品代号',
    dataIndex: 'productCode',
    width: 180,
    align: 'center'
  }
]
const searchData = [
  {
    type: 'text', // 控件类型
    labelText: '产品图号 ', // 控件显示的文本
    fieldName: 'mapCode',
    placeholder: '请输入产品图号 '
  },
  {
    type: 'text', // 控件类型
    labelText: '产品名称', // 控件显示的文本
    fieldName: 'mapName',
    placeholder: '请输入产品名称', // 默认控件的空值文本
    fieldEvent: {
      click: 'clickEvent(this)'
    }
  },
  {
    type: 'text', // 控件类型
    labelText: '产品代号', // 控件显示的文本
    fieldName: 'productCode',
    placeholder: '请输入产品代号', // 默认控件的空值文本
    fieldEvent: {
      click: 'clickEvent(this)'
    }
  }
]

export default {
  name: 'SelectProject',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'el-dialog': Dialog,
    'el-button': Button,
    CommonTable,
    SearchFormList,
    ListLayout

  },
  data () {
    return {
      renderDialogHeight: mh,
      customHeight: mh,
      tableConfig: {
        highlightCurrentRow: true
      },
      currentRow: {},
      queryParam: {
      },
      searchData: searchData,
      tableApi: 'productInfo.getProductList',
      columns: columns,
      drawerConfig: {
        modal: false,
        'modal-append-to-body': false,
        'append-to-body': true
      },
      drawerTitle: '',
      productId: ''
    }
  },
  methods: {
    showMessage (obj, message, type) {
      obj.$message({
        message: message,
        type: type
      })
    },
    // 单击选中行
    rowClick (row, column, event) {
      this.currentRow = row
    },
    // 双击行，直接关闭抽屉、回填值
    rowDblclick (row, column, event) {
      this.currentRow = row
      this.submit()
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
