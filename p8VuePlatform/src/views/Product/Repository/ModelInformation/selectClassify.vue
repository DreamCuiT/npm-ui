<template>
  <el-dialog title='所属领域选择'
             :visible.sync='visible'
             width='800px'
             append-to-body
             :close-on-click-modal="false"
             :before-close='cancel'>
    <list-layout>
      <template #north>
        <el-button type="primary"
                   round
                   @click="submit">确 定</el-button>
        <el-button type="primary"
                   round
                   @click="addMenu">新 建</el-button>
        <!-- <search-form-list ref="search" :dataSource="searchData" @search="search" @re-set="reSet"></search-form-list> -->
      </template>
      <template #center>
        <common-table ref='tableCom'
                      :columns='columns'
                      :params='queryParam'
                       :customHeight="300"
                      :api='tableApi'
                      :table-Refresh='tableRefresh'
                      :table-config='tableConfig'
                      @row-click='rowClick'
                      @row-dblclick='rowDblclick'>

          <template #opers="{scope}">
            <span class="el-tooltip"
                  tabindex="0">
              <button type='button'
                      class="el-button el-button--text el-button--small">
                <span @click="opersClick(scope)">修改</span>
              </button>
            </span>
            <div class="el-divider el-divider--vertical">

            </div>
            <span class="el-tooltip"
                  tabindex='0'>

              <button type='button'
                      class="el-button el-button--text el-button--small">
                <span @click="checkDeleteDic(scope)">删除</span>
              </button>
            </span>
            <!-- <span @click="modifyMenu(scope)">修改</span><i style="">|</i> -->
            <!-- <span @click="opersClick(scope)">删除</span> -->
          </template>

        </common-table>
      </template>
      <template #drawer-panel>
        <common-drawer v-if="visibleModelEditDrawer"
                       :drawerConfig='drawerConfig'
                       size="50%"
                       :title="drawerTitle"
                       :visible="visibleModelEditDrawer"
                       @close="onEditModelClose">
          <template #drawer>
            <classify-edit @save-success="saveCallback"
                           :dicId="dicId"></classify-edit>
          </template>
        </common-drawer>
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
import Vue from 'vue'
import { P8Drawer as CommonDrawer } from '~/index'
import ClassifyEdit from './classifyEdit'
const columns = [
  {
    width: 60,
    title: '序号',
    type: 'index',
    align: 'center'
  },
  {
    title: '所属领域',
    dataIndex: 'meaning',
    align: 'center'
  },
  {
    title: '所属领域代码',
    dataIndex: 'majorCode',
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'opers',
    scopedSlots: { customRender: 'custom' },
    align: 'center'
  }

]
const searchData = [
  // {
  //   type: 'text', // 控件类型
  //   labelText: '所属领域', // 控件显示的文本
  //   fieldName: 'name',
  //   placeholder: '请输入所属领域'
  // }
]

export default {
  name: 'SelectClassify',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectedClassifyId: {
      type: String,
      default: ''
    },
    selectedRow: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  components: {
    'el-dialog': Dialog,
    CommonTable,
    ListLayout,
    'el-button': Button,
    CommonDrawer,
    ClassifyEdit
  },
  data () {
    return {
      tableConfig: {
        queryParam: {},
        highlightCurrentRow: true
      },
      drawerConfig: {
        modal: false,
        'modal-append-to-body': false,
        'append-to-body': true
      },
      currentRow: {},
      searchData: searchData,
      tableApi: 'baseData.dicListData',
      columns: columns,
      queryParam: {
        dicType: 'OWNER_TYPE'
      },
      visibleModelEditDrawer: false,
      drawerTitle: ''
    }
  },
  methods: {
    addMenu () {
      this.formType = this.type
      this.dicId = ''
      this.drawerTitle = '新建所属领域'
      this.visibleModelEditDrawer = true
    },
    opersClick (record) {
      //  console.log(record.row.id, 'record---icon')
      this.dicId = record.row.id
      // console.log(this.dicId,'-----我的标识');
      this.formType = this.type
      this.codeType = 'OWNER_TYPE'
      this.drawerTitle = '修改所属领域'
      this.visibleModelEditDrawer = true
    },
    showMessage (obj, message, type) {
      obj.$message({
        message: message,
        type: type
      })
    },
    checkDeleteDic (record) {
      let that = this
      if (that.selectedClassifyId === record.row.id) {
        that.$alert('该所属领域已被使用，不可删除！', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        }).catch(() => { })
      } else {
        that.$api['modelInformation.checkDeleteDic']({ classify: record.row.id }).then(res => {
          if (res && res === 'true') {
            that.deleteDic(record)
          } else {
            that.$alert('该所属领域已被使用，不可删除！', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            }).catch(() => { })
          }
        })
      }
    },
    deleteDic (record) {
      let that = this
      that.$confirm(`是否要删除该条数据？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$api['baseData.removeDic']({ dicId: record.row.id, dicType: 'OWNER_TYPE' }).then(res => {
          if (!res) {
            that.showMessage(that, '删除失败', 'error')
            return false
          }
          that.showMessage(that, '删除成功', 'success')
          that.$refs.tableCom.searchData()
        })
      }).catch(() => { })
    },
    onEditModelClose () {
      this.visibleModelEditDrawer = false
      this.$refs.tableCom.searchData()
    },
    saveCallback () {
      console.log('修改页面关闭时的回调方法')
      this.visibleModelEditDrawer = false
      this.$refs.tableCom.searchData()
    },
    rowClick (row, column, event) {
      this.$refs.tableCom.$refs.table.setCurrentRow(row)
      this.currentRow = row
    },
    // 双击行，直接关闭页页面、回填值
    rowDblclick (row, column, event) {
      this.$refs.tableCom.$refs.table.setCurrentRow(row)
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
<style scoped>
</style>
