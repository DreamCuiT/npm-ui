<template>
  <div>
    <list-layout>
      <template #north>
        <common-button :comp="comp"></common-button>
      </template>
      <template #center>
        <common-table ref="table"
                      :comp="comp"
                      :flex="260"
                      :table-config="tableConfig"
                      :columns="columns"
                      :menu-state="menuState"
                      :api="tableApi"
                      :params="queryParam"
                      :table-refresh="tableRefresh"
                      :specialRoteName="roteName"
                      :pagination="false">
        </common-table>
      </template>
      <template #drawer-panel>
        <common-drawer v-if="visibleClassifyEditDrawer"
                       :title="drawerTitle"
                       :visible="visibleClassifyEditDrawer"
                       @close="onEditClose">
          <template #drawer>
            <edit-classify @saveSuccess="saveCallback"
                           :classifyId="classifyId"
                           :parentId="parentId"
                           :projectCategory="projectCategory"
                           :categoryDisp="projectCategoryDisp" :dateNumber="dateNumber"></edit-classify>
          </template>
        </common-drawer>
        <common-drawer v-if="visibleCategoryEditDrawer"
                       :title="drawerTitle"
                       :visible="visibleCategoryEditDrawer"
                       @close="onEditClose">
          <template #drawer>
            <edit-dic @close-modal="closeModal"
                      @save-success="saveCallback"
                      :title="drawerTitle"
                      :dicId="classifyId"
                      :dicType="codeType"
                      :formType='formType' :dateNumber="dateNumber"></edit-dic>
          </template>
        </common-drawer>
      </template>
    </list-layout>
    <div>
      <common-dialog title="设置类型标记"
                     :visible="isCommitVisible"
                     @handle-cancel="commitClose"
                     @handle-ok="commitSave"
                     @close="commitClose">
        <template #dialog>
          <div style="padding: 30px;">
            <el-row>
              <el-col :span="4">
                <span style="height: 30px;line-height: 30px;">类型标记</span>
              </el-col>
              <el-col :span="20">
                <el-select v-model="commitStatus"
                           placeholder="请选择">
                  <el-option v-for="item in commitOptions"
                             :key="item.id"
                             :label="item.cmeaning"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </div>
        </template>
      </common-dialog>
    </div>
  </div>
</template>

<script>
import EditDic from '../Dictionary/edit'
import EditClassify from './edit'
import { P8ListLayout as ListLayout } from '~/index'
import { P8Table as CommonTable } from '~/index'
import { P8Button as CommonButton } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'
import { P8Dialog as CommonDialog } from '~/index'
import { Select, Option, Row, Col } from '~/index'

const menuState = [
  {
    id: '05040202', // 修改
    hidden: {
      field: 'id',
      status: ['0'],
      title: ['根节点不可修改']
    }
  }, {
    id: '05040203', // 删除
    hidden: {
      field: 'id',
      status: ['0'],
      title: ['根节点不可删除']
    }
  }
]

let columns = [
  {
    title: '项目类别/类型名称',
    dataIndex: 'name',
    width: 650,
    align: 'left'
  },
  {
    title: '项目类型编号',
    dataIndex: 'no',
    width: 200,
    align: 'center'
  },
  {
    title: '类别/类型',
    dataIndex: 'type',
    width: 300,
    align: 'center',
    formatter: function (row) {
      if (row && row.type === '1') {
        return '项目类别'
      } else {
        return '项目类型'
      }
    }
  },
  {
    title: '排序号',
    dataIndex: 'indexNo',
    width: 90,
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
    width: 170,
    align: 'center'
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
    'edit-classify': EditClassify,
    ListLayout,
    CommonTable,
    CommonButton,
    CommonDrawer,
    CommonDialog,
    'el-select': Select,
    'el-option': Option,
    'el-row': Row,
    'el-col': Col
  },
  data () {
    return {
      headers: {
        authorization: 'authorization-text'
      },
      comp: this,
      menuState: menuState, // 按钮的权限配置
      columns: columns,
      tableApi: 'baseData.classifyTreeData',
      visibleCategoryEditDrawer: false,
      visibleClassifyEditDrawer: false,
      drawerTitle: '',
      classifyId: '',
      projectCategory: '',
      projectCategoryDisp: '',
      isCommitVisible: false,
      commitStatus: undefined,
      commitOptions: [],
      record: {},
      codeType: '',
      parentId: '',
      formType: '1',
      dateNumber: 0,
      queryParam: {
      },
      tableConfig: {
        'default-expand-all': true
      },
      buttonConfig: {
        icon: 'edit'
      }

    }
  },

  methods: {
    createClassify (record, b) {
      let that = this
      console.log(record, 'record')
      that.classifyId = ''
      let type = record.type
      if (type && type === '1' && record.id === '0') {
        that.codeType = that.dicType
        that.drawerTitle = '新建项目类别'
        // 查询其排序号带入子界面中
        // that.$api['baseData.getMaxIndexNumber']({ projectCategory: '', parentId: 'root' }).then(function (res) {
        //   that.dateNumber = res
        // }).catch(function (error) {
        //   console.log(error)
        // })
        that.dateNumber = 0
        that.visibleCategoryEditDrawer = true
      } else {
        if (type && type === '1') {
          that.projectCategory = record.id
          that.parentId = ''
          that.projectCategoryDisp = record.name
          if (record.children) {
            that.dateNumber = record.children.length
          } else {
            that.dateNumber = 0
          }
        } else {
          that.projectCategory = record.projectCategory
          that.parentId = record.id
          that.projectCategoryDisp = record.projectCategoryDisp
          console.log(that.parentId, '333')
          if (record.children) {
            that.dateNumber = record.children.length
          } else {
            that.dateNumber = 0
          }
        }
        that.drawerTitle = '新建项目类型'
        that.visibleClassifyEditDrawer = true
      }
    },
    editClassify (record, b) {
      this.classifyId = record.id
      let type = record.type
      this.codeType = record.dicType
      if (type && type === '1') {
        this.drawerTitle = '修改项目类别'
        this.visibleCategoryEditDrawer = true
      } else {
        this.drawerTitle = '修改项目类型'
        this.visibleClassifyEditDrawer = true
      }
    },
    deleteClassify (record, b) {
      let that = this
      this.$confirm(`是否要删除该条数据？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$api['baseData.pcRemove']({ classifyId: record.id, classifyType: record.type, dicType: record.dicType }).then(res => {
          if (!res) {
            this.showMessage(that, '删除失败', 'error')
            return false
          }
          this.showMessage(that, '删除成功', 'success')
          that.$refs.table.searchData()
        })
      }).catch(() => { })
    },
    markClassify (record, item) {
      let that = this
      that.$api['baseData.getMarkPointsData']().then(res => {
        that.commitOptions = res
        that.isCommitVisible = true
        that.record = record
      })
    },
    showMessage (obj, message, type) {
      obj.$message({
        message: message,
        type: type
      })
    },
    onEditClose () {
      this.visibleClassifyEditDrawer = false
      this.visibleCategoryEditDrawer = false
      this.$refs.table.searchData()
    },
    closeModal () {
      this.visibleCategoryEditDrawer = false
      this.$refs.table.searchData()
    },
    saveCallback (res) {
      this.visibleClassifyEditDrawer = false
      this.visibleCategoryEditDrawer = false
      this.$refs.table.searchData()
    },
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
    commitClose () {
      this.isCommitVisible = false
      this.commitStatus = undefined
      this.record = {}
    },
    commitSave () {
      let that = this
      that.$api['baseData.saveMarkPointsData']({ classifyId: that.record.id, classifyName: this.commitStatus }).then(res => {
        if (!res) {
          this.showMessage(that, '保存失败', 'error')
          return false
        }
        this.showMessage(that, '保存成功', 'success')
        // that.$refs.table.searchData()
        that.commitClose()
      })
    }
  }
}
</script>
