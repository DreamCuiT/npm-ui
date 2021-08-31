<template>
  <normal-layout>
    <template #north>
      <el-button type="primary"
                 @click="createModelFlot">新建</el-button>
      <search-form-list ref="search"
                        :dataSource="searchData"
                        @search="search"
                        @re-set="reSet"></search-form-list>
    </template>
    <template #west>
      <common-tree :treeApi="treeApi"
                   @select="onSelect"></common-tree>
    </template>
    <template #center>
      <div id="table-contain">
        <common-table ref="table"
                      :comp="comp"
                      :columns="columns"
                      :params="queryParam"
                      :api="tableApi"
                      :table-Refresh="tableRefresh"
                      :pagination="true">
          <template #tableSettings="{scope}">
            <el-button type="text"
                       @click="modifyModelFlot(scope.row)">修改&#12288;</el-button>
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-button type="text"
                             @click="viewUpload(scope.row)">查看</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button type="text"
                             @click="handleDelete(scope.$index,scope.row)">删除</el-button>
                </el-dropdown-item>

              </el-dropdown-menu>
            </el-dropdown>

          </template>
        </common-table>
        <common-dialog :title="drawerTitle"
                       width="50%"
                       v-if="createDrawer"
                       :visible="createDrawer"
                       :dialogConfig="dialogConfig"
                       :showHandleBtn="showHandleBtn"
                       :dialogHeight="dialogHeight"
                       @close="onPlanViewClose">
          <template #dialog>
            <create-model :wholeId="currEntityId"
                          :rowId="rowId"
                          @save-success='onPlanViewClose'></create-model>
          </template>
        </common-dialog>
        <common-dialog :title="drawerTitle"
                       width="50%"
                       v-if="views"
                       :visible="views"
                       :dialogConfig="dialogConfig"
                       :showHandleBtn="showHandleBtn"
                       :dialogHeight="dialogHeight"
                       @close="onPlanViewClose">
          <template #dialog>
            <show-model :wholeId="currEntityId"
                        :rowId="rowId"></show-model>
          </template>
        </common-dialog>
      </div>
    </template>
  </normal-layout>
</template>
<script>
import Vue from 'vue'
import { P8NormalLayout as NormalLayout } from '~/index'
import { P8Table as CommonTable } from '~/index'
import { P8Tree as CommonTree } from '~/index'
import { P8Search as SearchFormList } from '~/index'
import { Button, Col, Dropdown, DropdownMenu, DropdownItem } from '~/index'
import { P8Dialog as CommonDialog } from '~/index'
import CreateModel from './createModel'
import ShowModel from './showModel'
export default {
  components: {
    NormalLayout,
    CommonTable,
    CommonTree,
    SearchFormList,
    ShowModel,
    // eslint-disable-next-line vue/no-unused-components
    'el-col': Col,
    CommonDialog,
    CreateModel,
    'el-button': Button,
    'el-dropdown': Dropdown,
    'el-dropdown-menu': DropdownMenu,
    'el-dropdown-item': DropdownItem

  },
  props: {
    currEntityId: {
      type: String
    },
    classifyId: {
      type: String
    },
    columns: {
      type: Array,
      default: function () {
        return [
          {
            title: '序号',
            type: 'index',
            width: '45px',
            align: 'center'
          },
          {
            title: '文档名称',
            dataIndex: 'name',
            align: 'left'
          },
          {
            title: '提交人',
            dataIndex: 'userName',
            align: 'center'
          },
          {
            title: '策划分类',
            dataIndex: 'classify',
            align: 'center'
          },
          {
            title: '操作',
            align: 'center',
            scopedSlots: { customRender: 'custom' },
            dataIndex: 'tableSettings'
          }
        ]
      }
    }
  },
  data () {
    const searchData = [
      {
        type: 'text', // 控件类型
        labelText: '文档名称', // 控件显示的文本
        fieldName: 'name',
        placeholder: '请输入文档名称'
      }
    ]
    return {
      comp: this,
      searchData,
      treeApi: 'PaModelFlot.classifyTree',
      currentRouterPath: '',
      thirdMenuParam: {
        id: ''
      },
      drawerConfig: {
        modal: false
      },
      drawerTitle: '',
      rowId: '',
      createDrawer: false,
      showHandleBtn: false,
      dialogHeight: 400,
      dialogConfig: {
        'append-to-body': true
      },
      views: false,
      queryParam: {
        wholeId: this.currEntityId
      },
      tableApi: 'PaModelFlot.paModelFlotList',
      isView: null,
      defaultMenu: {}
    }
  },
  methods: {
    mounted () {
      this.formData.wholeId = this.currEntityId
      this.queryParam.wholeId = this.currEntityId
      // this.getClassifyData()
    },
    // getClassifyData () {
    //     let that = this
    //     that.$api['PaModelFlot.paModelFlotList']({ wholeId: this.currEntityId ,classifyId:this.classifyId}).then(function (res) {
    //         let data = res
    //         that.formData.id = data.id
    //         that.formData.classifyId = data.classifyId
    //         that.formData.name = data.name
    //         that.formData.userName = data.userName
    //         that.formData.classify = data.classify
    //
    //     }).catch(function (error) {
    //         console.log('error' + error)
    //     })
    // },
    search (param) {
      this.queryParam = param
      let that = this
      Vue.nextTick(function () {
        that.$refs.table.queryList()
      })
    },
    reSet () {
      let this_ = this
      Object.keys(this.queryParam).forEach(key => {
        let temp = this_.searchData.filter(item => item.fieldName === key)
        this.queryParam[key] = temp[0].defaultValue
      })
      Vue.nextTick(function () {
        this_.$refs.table.searchData()
      })
    },
    onSelect (node) {
      this.queryParam.classifyId = node.id
      this.queryParam.wholeId = this.currEntityId
      this.$refs.table.searchData()
    },
    tableRefresh (param) {
      param
        .then(() => {
          console.log('异步成功后端做的操作')
        })
        .catch(() => {
          console.log('异步失败的操作')
        })
    },
    createModelFlot () {
      this.createDrawer = true
      this.rowId = ''
      this.drawerTitle = '新建项目策划文档'
    },
    modifyModelFlot (record) {
      this.createDrawer = true
      this.rowId = record.id
      this.drawerTitle = '修改项目策划文档'
    },
    onPlanViewClose () {
      this.createDrawer = false
      this.views = false
      this.drawerTitle = ''
      let this_ = this
      this_.$refs.table.searchData()
    },
    viewUpload (record) {
      this.drawerTitle = '查看项目策划文档'
      this.rowId = record.id
      this.views = true
    },
    handleDelete (index, row) {
      let that = this
      that.$confirm(`是否确定要删除该数据？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$refs.table.tableData.splice(index, 1)
        that.$api['PaModelFlot.deleteById']({ id: row.id }).then(function (res) {
          that.$message({
            type: 'success',
            message: '删除成功！'
          })
        }).catch(function (error) {
          console.log('error' + error)
        })
      }).catch(() => { })
    }

  }

}
</script>
<style lang="scss">
.el-dropdown-link {
  color: $base-light-color;
  font-size: 12px;
  cursor: pointer;
}
</style>
