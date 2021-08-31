<template>
  <normal-layout>
    <template #north>
      <common-button :comp="comp" :customButtonData="buttons"></common-button>
<!--      <search-form-list ref="search" :dataSource="searchData" @search="search" @re-set="reSet"></search-form-list>-->
    </template>
    <template #west>
      <common-tree :data="treeData" @select="onTreeNodeSelect" :treeConfig="treeCfg"></common-tree>
    </template>
    <template #center>
      <div id="table-contain">
        <common-table ref="table"
                      :comp="comp"
                      :columns="columns"
                      :customButtonData="buttons"
                      :params="queryParam"
                      :api="tableApi"
                      :pagination=true
        >
        </common-table>
      </div>
    </template>
    <template #drawer-panel>
      <common-drawer v-if="visibleEditDrawer" :title="drawerTitle" :visible="visibleEditDrawer" @close="onEditSelectionClose" >
        <template #drawer>
          <selection-edit :id="recordId" :selectionTypeId="selectionTypeId" @saveSuccess="onSave"></selection-edit>
        </template>
      </common-drawer>
    </template>
  </normal-layout>
</template>

<script>
import { P8NormalLayout as NormalLayout } from '~/index'
import { P8Tree as CommonTree } from '~/index'
import { P8Button as CommonButton } from '~/index'
import { P8Table as CommonTable } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'
import SelectionEdit from './Components/edit'
import moment from 'moment'
// import { P8Search as SearchFormList } from '~/index'

const BTN_DATA = [
  {
    'id': 'btn-001',
    'enable': '1',
    'indexNumber': 1,
    'eventHandle': 'onCreate',
    'image': 'fdddfont icon-add-new',
    'title': '新建',
    'location': 'head'
  },
  {
    'id': 'btn-002',
    'enable': '1',
    'indexNumber': 2,
    'eventHandle': 'onUpdate',
    'image': 'fdddfont icon-add-new',
    'title': '修改',
    'location': 'row'
  },
  {
    'id': 'btn-003',
    'enable': '1',
    'indexNumber': 3,
    'eventHandle': 'onDelete',
    'image': 'fdddfont icon-add-new',
    'title': '删除',
    'location': 'row'
  },
  {
    'id': 'btn-004',
    'enable': '1',
    'indexNumber': 4,
    'eventHandle': 'onView',
    'image': 'fdddfont icon-add-new',
    'title': '预览',
    'location': 'row'
  }
]

const TREE_DATA = [
  {
    'id': 'root',
    'label': '选项类别',
    'value': 'root',
    'children': [
      {
        'id': 1,
        'label': '目录类',
        'value': 1
      },
      {
        'id': 2,
        'label': '树形类',
        'value': 2
      },
      {
        'id': 3,
        'label': '表格类',
        'value': 3
      }
    ]
  }
]

export default {
  name: 'Select',
  components: {
    NormalLayout,
    CommonTree,
    CommonButton,
    CommonTable,
    CommonDrawer,
    SelectionEdit
    // ,
    // SearchFormList
  },
  data () {
    return {
      comp: this,
      visibleEditDrawer: false,
      drawerTitle: '',
      buttons: BTN_DATA,
      treeData: TREE_DATA,
      selectionTypeId: 1,
      recordId: '',
      tableApi: 'selection.list',
      treeCfg: {
        'current-node-key': 1
      },
      columns: [
        {
          title: '序号',
          type: 'index',
          width: '50',
          align: 'center'
        },
        {
          title: '编码',
          dataIndex: 'selectionCode',
          align: 'center'
        },
        {
          title: '名称',
          dataIndex: 'selectionName',
          align: 'center'
        },
        {
          title: '类别',
          dataIndex: 'selectionType',
          align: 'center'
        },
        {
          title: '数据来源',
          dataIndex: 'dataSourceType',
          align: 'center'
        },
        {
          title: '创建人',
          dataIndex: 'createUser',
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          formatter: function (row, column, cellValue, index) {
            let date = ''
            if (cellValue && cellValue !== '') {
              date = moment(cellValue).format('YYYY-MM-DD')
            }
            // console.log('date', date)
            return date
          },
          align: 'center'
        },
        {
          title: '修改人',
          dataIndex: 'updateUser',
          align: 'center'
        },
        {
          title: '修改时间',
          dataIndex: 'updateTime',
          formatter: function (row, column, cellValue, index) {
            let date = ''
            if (cellValue && cellValue !== '') {
              date = moment(cellValue).format('YYYY-MM-DD')
            }
            // console.log('date', date)
            return date
          },
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: '150',
          scopedSlots: {
            customRender: 'operation'
          },
          align: 'center'
        }
      ]
    }
  },
  computed: {
    queryParam () {
      return { selectionType: this.selectionTypeId }
    }
  },
  methods: {
    onCreate () {
      this.recordId = ''
      this.visibleEditDrawer = true
      this.drawerTitle = '新建'
    },
    onUpdate (record) {
      this.recordId = record.id
      this.visibleEditDrawer = true
      this.drawerTitle = '修改'
    },
    onEditSelectionClose () {
      this.visibleEditDrawer = false
    },
    onTreeNodeSelect (node) {
      console.log('node', node)
      this.selectionTypeId = node.id
      // this.$refs.table.searchData()
    },
    onSave (res) {
      console.log('修改页面关闭时的回调方法')
      this.$refs.table.searchData()
      this.onEditSelectionClose()
    },
    onDelete (record) {
      let that = this
      this.$confirm(`是否确定要删除该选项？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$api['selection.remove']({
          id: record.id
        }).then(res => {
          console.log(res)
          that.$refs.table.searchData()
        })
      }).catch((e) => { console.log(e) })
    },
    onView (record) {

    }
  }
}
</script>
