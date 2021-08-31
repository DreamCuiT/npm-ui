<template>
    <list-layout>
        <template #north>
            <common-button :comp="comp" :specialRoteName="roteName"></common-button>
        </template>
        <template #center>
            <common-table ref="table"
                          :comp="comp"
                          :flex="178"
                          :table-config="tableConfig"
                          :columns="columns"
                          :api="tableApi"
                          :params="queryParam"
                          :table-Refresh="tableRefresh"
                          :specialRoteName="roteName"
                          :pagination="true"
                          @requested-table-data="getTotalNum"
            >
            </common-table>
        </template>
        <template #drawer-panel>
          <common-drawer v-if="visibleEditDrawer"  :visible="visibleEditDrawer" :title="drawerTitle"  @close="onEditClose">
                <template #drawer>
                   <edit-dic @save-success="saveCallback" :dicId="dicId"  :dicType="dicType" :formType="formType" :dateNumber="dateNumber"></edit-dic>
                </template>
         </common-drawer>
        </template>
    </list-layout>
</template>

<script>

import { P8Table as CommonTable } from '~/index'
import { P8Button as CommonButton } from '~/index'
import { P8ListLayout as ListLayout } from '~/index'
import EditDic from './edit'
import { P8Drawer as CommonDrawer } from '~/index'

let columns1 = [
  {
    title: '序号',
    type: 'index',
    width: 45,
    align: 'center'
  },
  {
    title: '名称',
    dataIndex: 'meaning',
    align: 'center'
  },
  {
    title: '排序号',
    dataIndex: 'orderNo',
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 150,
    scopedSlots: { customRender: 'operation' },
    align: 'center'
  }
]

let columns2 = [
  {
    title: '序号',
    type: 'index',
    width: 45,
    align: 'center'

  },
  {
    title: '名称',
    dataIndex: 'meaning',
    align: 'center'
  },
  {
    title: '编号',
    dataIndex: 'majorCode',
    align: 'center'
  },
  {
    title: '排序号',
    dataIndex: 'orderNo',
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 150,
    scopedSlots: { customRender: 'operation' },
    align: 'center'
  }
]
export default {
  name: 'BaseDicList',
  props: {
    dicType: {// 数据字典类型
      type: String,
      default: ''
    },
    type: {// 用于判断编号列显示，1：不显示，2：显示
      type: String,
      default: ''
    },
    roteName: {// 三级菜单路由
      type: String,
      default: ''
    }
  },
  data () {
    return {
      headers: {
        authorization: 'authorization-text'
      },
      visibleEditDrawer: false,
      drawerTitle: '',
      columns: [],
      tableApi: 'baseData.dicListData',
      data: [],
      visible: false,
      comp: this,
      dicId: '',
      codeType: '',
      dateNumber: 0,
      dataLength: 0,
      queryParam: {
        dicType: this.dicType
      },
      tableConfig: {

      },
      buttonConfig: {
        icon: 'edit'
      }
    }
  },
  computed: {
    // columns () {
    //   return this.type === '1' ? columns1 : columns2
    // }
  },
  mounted () {
    this.columnsTriger()
  },
  methods: {
    columnsTriger () {
      if (this.type && this.type === '1') {
        this.columns = columns1
      } else {
        this.columns = columns2
      }
    },
    createDic () {
      this.formType = this.type
      this.dicId = ''
      this.drawerTitle = '新建'
      this.dateNumber = this.dataLength + 1
      this.visibleEditDrawer = true
    },
    editDic (record) {
      this.dicId = record.id
      this.formType = this.type
      this.codeType = this.dicType
      this.drawerTitle = '修改'
      this.visibleEditDrawer = true
    },
    showMessage (obj, message, type) {
      obj.$message({
        message: message,
        type: type
      })
    },
    deleteDic (record) {
      let that = this
      this.$confirm(`是否要删除该条数据？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$api['baseData.removeDic']({ dicId: record.id, dicType: this.dicType }).then(res => {
          if (!res) {
            this.showMessage(that, '删除失败', 'error')
            return false
          }
          this.showMessage(that, '删除成功', 'success')
          that.$refs.table.searchData()
        })
      }).catch(() => { })
    },
    onEditClose () {
      this.visibleEditDrawer = false
      this.$refs.table.searchData()
    },
    saveCallback (res) {
      this.visibleEditDrawer = false
      this.$refs.table.searchData()
    },
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
      getTotalNum (data) {
          let that = this
          console.log(that.$refs.table.page.total, '22233232')
          that.dataLength = that.$refs.table.page.total
      }
      /* getProjectTableData (data) {
          let that = this
          that.dataLength = data.length
      } */
  },
  components: {
    CommonTable,
    CommonButton,
    ListLayout,
    EditDic,
    CommonDrawer
  }
}
</script>
