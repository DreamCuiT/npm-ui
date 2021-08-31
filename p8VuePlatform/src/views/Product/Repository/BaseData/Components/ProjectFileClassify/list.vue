<template>
    <list-layout>
        <template #north>
            <common-button :comp="comp"></common-button>
        </template>
        <template #center>
            <common-table ref="table"
                          :comp="comp"
                          :table-config="tableConfig"
                          :columns="columns"
                          :menu-state="menuState"
                          :api="tableApi"
                          :params="queryParam"
                          :table-refresh="tableRefresh"
                          :specialRoteName="roteName"
                          :pagination=false
            >
            </common-table>
        </template>
        <template #drawer-panel>
            <common-drawer v-if="visibleClassifyEditDrawer" :title="drawerTitle" :visible="visibleClassifyEditDrawer" @close="onEditClose">
                <template #drawer>
                    <edit-dic @close-modal="closeModal" @save-success="saveCallback" :title="drawerTitle" :dicId="classifyId"  :parentId="parentId" :dicType="codeType" :formType='formType'></edit-dic>
                </template>
            </common-drawer>
        </template>
    </list-layout>
</template>

<script>
import EditDic from '../ProjectFileClassify/edit'
import { P8ListLayout as ListLayout } from '~/index'
import { P8Table as CommonTable } from '~/index'
import { P8Button as CommonButton } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'

const menuState = [
  {
    id: '05040502', // 修改
    hidden: {
      field: 'id',
      status: ['0'],
      title: ['根节点不可修改']
    }
  }, {
    id: '05040503', // 删除
    hidden: {
      field: 'id',
      status: ['0'],
      title: ['根节点不可删除']
    }
  }
]

let columns = [
  {
    title: '项目文档名称',
    dataIndex: 'meaning'
  },
  {
    title: '排序号',
    dataIndex: 'orderNo',
    width: 150
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
    width: 150
  }
]

export default {
  name: 'ProjectClassifyList',
  props: {
    dicType: {// 数据字典类型
      type: String,
      default: ''
    },
    roteName: {// 三级菜单路由
      type: String,
      default: ''
    }
  },
  components: {
    'edit-dic': EditDic,
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
      menuState: menuState, // 按钮的权限配置
      columns: columns,
      tableApi: 'baseData.fileClassifyTreeData',
      visibleClassifyEditDrawer: false,
      drawerTitle: '',
      classifyId: '',
      projectCategory: '',
      projectCategoryDisp: '',
      codeType: '',
      parentId: '',
      formType: '1',
      queryParam: {
      },
      tableConfig: {
      },
      buttonConfig: {
        icon: 'edit'
      }

    }
  },
  methods: {
    createFileClassify (record) {
      this.parentId = record.id
      this.codeType = this.dicType
      this.drawerTitle = '新建文档类型'
      this.visibleClassifyEditDrawer = true
    },
    editFileClassify (record) {
      this.classifyId = record.id
      this.codeType = this.dicType
      this.drawerTitle = '修改文档类型'
      this.visibleClassifyEditDrawer = true
    },
    deleteFileClassify (record) {
      let that = this
      this.$confirm(`是否要删除该条数据？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$api['baseData.removeDics']({ dicId: record.id, dicType: this.dicType }).then(res => {
          if (!res) {
            this.showMessage(that, '删除失败', 'error')
            return false
          }
          this.showMessage(that, '删除成功', 'success')
          that.$refs.table.searchData()
        })
      }).catch(() => { })
    },
    showMessage (obj, message, type) {
      obj.$message({
        message: message,
        type: type
      })
    },
    onEditClose () {
      this.visibleClassifyEditDrawer = false
      this.$refs.table.searchData()
    },
    closeModal () {
      this.visibleClassifyEditDrawer = false
      this.$refs.table.searchData()
    },
    saveCallback (res) {
      this.visibleClassifyEditDrawer = false
      this.$refs.table.searchData()
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
