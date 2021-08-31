<template>
    <common-dialog
      title="选择要复制的项目"
      destroy-on-close
      :visible="visible"
      :confirm-loading="confirmLoading"
      :dialogConfig="dialogConfig"
      width="70%"
      @close="handleCancel"
      @handle-cancel="handleCancel"
      @handle-ok="handleOk"
    >
        <template #dialog>
          <list-layout>
            <template #north>
              <search-form-list ref="search" :dataSource="searchData" @search="search" @re-set="reSet"></search-form-list>
            </template>
            <template #center>
              <div id="table-contain">
                <common-table ref="table"
                              :comp="comp"
                              :columns="columns"
                              :params="queryParam"
                              :api="tableApi"
                              :table-Refresh="tableRefresh"
                              :pagination="true"
                              :tableConfig="tableConfig"
                              @current-change="currentChange">
                  >
                </common-table>
              </div>
            </template>
          </list-layout>

          <common-drawer
            :title="drawerTitle"
            destroy-on-close
            :visible="visibleProjectViewDrawer"
            size="50%"
            @close="closeDrawer"
            :drawerConfig="drawerConfig"
          >
            <template #drawer>
                <project-view
                        :curr-entity-id="sourceTaskBookId"
                        @copy-data="copyData"
                ></project-view>
            </template>
          </common-drawer>
        </template>
    </common-dialog>
</template>

<script>
import Vue from 'vue'
import ProjectView from '@/views/Product/Em/EntiretyBase/Components/wholeDescribeView'
import { P8ListLayout as ListLayout } from '~/index'
import { P8Dialog as CommonDialog } from '~/index'
import { P8Table as CommonTable } from '~/index'
import { P8Search as SearchFormList } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'
export default {
  name: 'copyIndex',
  components: {
    CommonDrawer,
    ProjectView,
    CommonDialog,
    ListLayout,
    CommonTable,
    SearchFormList
  },
  props: ['visible', 'disabled-row'],
  data () {
    return {
      comp: this,
      tableApi: 'ProjectApply.projectList',
      confirmLoading: false,
      queryParam: {},
      tableConfig: {
        highlightCurrentRow: true
      },
      columns: [
        {
          title: '序号',
          type: 'index'
        },
        {
          title: '所属型号',
          dataIndex: 'modelCode'
        },
        {
          title: '项目代码',
          dataIndex: 'pjCode'
        },
        {
          title: '项目名称',
          dataIndex: 'name'
        },
        {
          title: '项目类型',
          dataIndex: 'kprojectClassifyname'
        },

        // {
        //   title: '项目分级',
        //   dataIndex: 'projectOrderDisplay'
        // },
        {
          title: '责任部门',
          dataIndex: 'departmentName'
        },
        {
          title: '状态',
          dataIndex: 'statusDisplay'
        },
        {
          title: '排序号',
          dataIndex: 'indexNo'
        }
      ],
      loading: false,
      skeletonLoading: true,
      visibleProjectViewDrawer: false,
      selectedCopyRowKeys: [],
      selectedCopyRows: [],
      selectData: [],
      deptData: [],
      statusData: [],
      value: '',
      name: '',
      sourceTaskBookId: '',
      drawerTitle: '项目信息',
      sourceCopyData: {},
      dialogConfig: {
        modal: true,
        appendToBody: true,
        modalAppendToBody: true
      },
      drawerConfig: { /// z-index
        destroyOnClose: true,
        modal: false,
        appendToBody: true,
        wrapperClosable: true
      },
      searchData: [
        {
          type: 'treeSelect',
          multiple: true,
          labelText: '责任部门',
          fieldName: 'deptId',
          defaultValue: [],
          placeholder: '选择责任部门',
          optionUrl: {
            api: 'ProjectApply.deptTree',
            params: {}
          },
          treeData: []
        },
        {
          type: 'select',
          optionUrl: {
            api: 'thirdPartInterface.getDic',
            params: { dicType: 'STAND_PROJECT_STATUS' }
          },
          options: [],
          labelText: '状态', // 控件显示的文本
          fieldName: 'status',
          placeholder: '选择状态',
          fieldConfig: {
            multiple: true
          }
        },
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
          treeData: [],
          fieldConfig: {
            multiple: true
          }
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
        }
        // {
        //   type: 'select', // 控件类型
        //   optionUrl: {
        //     api: 'thirdPartInterface.getDic',
        //     params: { dicType: 'PROJECT_ORDER' }
        //   },
        //   fieldConfig: {
        //     multiple: true
        //   },
        //   options: [],
        //   labelText: '项目分级', // 控件显示的文本
        //   fieldName: 'projectOrderId',
        //   placeholder: '请输入项目代码'
        // }
      ]
    }
  },
  mounted () {
  },
  computed: {
  },
  methods: {
    handleOk (e) {
      if (this.sourceCopyData && Object.keys(this.sourceCopyData).length) {
        this.$emit(
          'close-copy-project',
          this.sourceTaskBookId,
          this.sourceCopyData
        )
      } else {
        this.$message({ message: '没有选中的记录', type: 'error' })
      }
    },
    handleCancel (e) {
      this.visible = false
      this.$emit('close-copy-project', {})
    },
    refresh () {

    },
    closeDrawer () {
      this.visibleProjectViewDrawer = false
    },
    copyData (copyData) {
      this.sourceCopyData = copyData
    },
    currentChange (currentRow, oldCurrentRow) {
      this.selectedRowKeys = []
      this.selectedRowKeys.push(currentRow.id)
      this.sourceTaskBookId = currentRow.id
      this.visibleProjectViewDrawer = true
    },
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
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
        that.$refs.table.queryList()
      })
    },
    reSet () {
      Object.keys(this.queryParam).forEach(key => {
        this.queryParam[key] = ''
      })
      Vue.nextTick(function () {
        this.$refs.table.search()
      })
    }
  },
  watch: {
    sourceTaskBookId: function (val, oldVal) {
      this.$emit('change-task-book-id', val)
    }
  }
}
</script>

<style scoped></style>
