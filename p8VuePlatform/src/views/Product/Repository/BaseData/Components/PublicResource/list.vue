<template>
    <list-layout>
        <template #north>
            <common-button :comp="comp" :specialRoteName="roteName" :button-config="buttonConfig"></common-button>
        </template>
        <template #center>
            <common-table ref="table"
                          :comp="comp"
                          :flex="178"
                          :table-config="tableConfig"
                          :columns="columns"
                          :api="tableApi"
                          :specialRoteName="roteName"
                          :params="queryParam"
                          :table-Refresh="tableRefresh"
                          :pagination="true"
                          @requested-table-data="getTotalNum"
            >
            </common-table>
        </template>
        <template #drawer-panel>
            <common-drawer v-if="visibleEditDrawer" :title="drawerTitle" :visible="visibleEditDrawer" @close="onEditClose">
                <template #drawer>
                    <edit-resource  @saveSuccess="saveCallback" :resId="resId" :formType="formType" :dateNumber="dateNumber"></edit-resource>
                </template>
            </common-drawer>
        </template>
    </list-layout>
</template>

<script>
import Edit from './edit'
import { P8ListLayout as ListLayout } from '~/index'
import { P8Table as CommonTable } from '~/index'
import { P8Button as CommonButton } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'

// columns1为共性资源库列表，columns2为共性资源类型列表，列表展示根据路由传入type参数值决定
let columns1 = [
  {
    title: '序号',
    type: 'index'
  },
  {
    title: '资源类型',
    dataIndex: 'typeName'
  },
  {
    title: '资源名称',
    dataIndex: 'name'
  },
  {
    title: '资源编号',
    dataIndex: 'code'
  },
  {
    title: '排序号',
    dataIndex: 'orderNo'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]

let columns2 = [
  {
    title: '序号',
    type: 'index'

        },
        {
            title: '名称',
            dataIndex: 'name'
        },
        {
            title: '管理厂所',
            dataIndex: 'deptName'
        },
        {
            title: '排序号',
            dataIndex: 'orderNo'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: { customRender: 'operation' }
        }
    ]

export default {
  name: 'PublicResourceList',
  props: {
    type: {// 用于区分共性资源库(1)和共性资源类型(2)
      type: String,
      default: ''
    },
    roteName: {
      type: String
    }
  },
  components: {
    'edit-resource': Edit,
    ListLayout,
    CommonTable,
    CommonButton,
    CommonDrawer

  },
  data () {
    return {
      headers: {
        authorization: 'authorization-text'
      },
      comp: this,
      columns: [],
      tableApi: 'baseData.resList',
      visibleEditDrawer: false,
      drawerTitle: '',
      formType: '',
      resId: '',
      queryParam: {
        resType: this.type
      },
      tableConfig: {
      },
        dateNumber: 0,
        dataLength: 0,
      buttonConfig: {
        icon: 'edit'
      }
    }
  },
  created () {
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
    createRes () {
      this.resId = ''
      this.formType = this.type
      this.drawerTitle = '新建'
      this.dateNumber = this.dataLength + 1
      this.visibleEditDrawer = true
    },
    editRes (record) {
      this.resId = record.id
      this.formType = this.type
      this.drawerTitle = '修改'
      this.visibleEditDrawer = true
    },
    showMessage (obj, message, type) {
      obj.$message({
        message: message,
        type: type
      })
    },
    deleteRes (record) {
      let that = this
      this.$confirm(`是否要删除该条数据？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$api['baseData.removeRes']({ resId: record.id, resType: that.type }).then(res => {
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
         that.dataLength = that.$refs.table.page.total
     }
  }
}
</script>
