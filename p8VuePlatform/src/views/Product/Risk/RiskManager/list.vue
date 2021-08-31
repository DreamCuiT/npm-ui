<template>
  <list-layout>
    <template #north>
      <search-form-list ref="search"
                        :dataSource="searchData"
                        @search="search"
                        @re-set="reSet"></search-form-list>
    </template>
    <template #center>
      <div id="table-contain">
        <common-table ref="table"
                      :comp="comp"
                      @row-click="rowClick"
                      :columns="columns"
                      :params="queryParam"
                      :api="tableApi"
                      :table-Refresh="tableRefresh"
                      :pagination="true">
        </common-table>
      </div>
      <manager-list v-if="visible"
                    :visible="visible"
                    :dialogHeight="dialogHeight"
                    :customHeight="customHeight"
                    :title="title"
                    :whole-id="whole.id"
                    @close-modal="closeDrawer">
      </manager-list>
    </template>
    <template #drawer-panel>
      <!--            <common-drawer v-if="visible" size="100%" :visible='visible'  @close="closeDrawer">-->
      <!--                <template #drawer>-->
      <!--                    <manager-list :whole-id="whole.id" ></manager-list>-->
      <!--                </template>-->
      <!--            </common-drawer>-->
    </template>
  </list-layout>
</template>

<script>
import Vue from 'vue'
import { P8Table as CommonTable } from '~/index'
import { P8ListLayout as ListLayout } from '~/index'
import { P8Search as SearchFormList } from '~/index'
import ManagerList from './Components/list'
export default {
  name: 'projectInfoList',
  components: {
    CommonTable,
    ManagerList,
    ListLayout,
    SearchFormList
  },
  props: {
    columns: {
      type: Array,
      default: function () {
        return [
          {
            title: '序号',
            type: 'index',
            width: 55,
            align: 'center'
          },
          {
            title: '所属型号',
            dataIndex: 'modelCode',
            width: 200,
            align: 'center'
          },
          {
            title: '项目编号',
            dataIndex: 'pjCode',
            width: 200,
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
            width: 200,
            align: 'center'
          }
          // {
          //   title: '项目分级',
          //   dataIndex: 'projectOrderDisplay',
          //   width: 120,
          //   align: 'center'
          // }
          // ,
          // {
          //   title: '管理部门',
          //   dataIndex: 'departmentName',
          //   minWidth: 180,
          //   align: 'center',
          //   formatter: function (row) {
          //     if (row.pdepartmentName) {
          //       return row.pdepartmentName + '-' + row.departmentName
          //     } else {
          //       return row.departmentName
          //     }
          //   }
          // }

        ]
      }
    },
    searchData: {
      type: Array,
      default: function () {
        return [
          {
            type: 'text', // 控件类型
            labelText: '项目名称', // 控件显示的文本
            fieldName: 'productName',
            placeholder: '请输入项目名称'
          },
          {
            type: 'text', // 控件类型
            labelText: '项目编号', // 控件显示的文本
            fieldName: 'pjCode',
            placeholder: '项目编号', // 默认控件的空值文本
            fieldEvent: {
              click: 'clickEvent(this)'
            }
          },
          {
            type: 'multiple',
            defaultValue: [],
            labelText: '所属型号',
            fieldName: 'modelInformationId',
            placeholder: '选择所属型号',
            optionUrl: {
              api: 'ProjectApply.getModelListData',
              label: 'modelCode',
              value: 'id',
              params: {}
            },
            treeData: []
          },
          // {
          //   type: 'treeSelect',
          //   multiple: true,
          //   labelText: '管理部门',
          //   fieldName: 'departmentId',
          //   defaultValue: [],
          //   placeholder: '选择管理部门',
          //   optionUrl: {
          //     api: 'ProjectApply.deptTree',
          //     params: {}
          //   },
          //   treeData: []
          // },
          {
            type: 'treeSelect',
            defaultValue: [],
            labelText: '项目类型',
            fieldName: 'kprojectClassifyId',
            placeholder: '请选择项目类型',
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
          //   type: 'multiple',
          //   defaultValue: [],
          //   optionUrl: {
          //     api: 'thirdPartInterface.getDic',
          //     params: { dicType: 'PROJECT_ORDER' }
          //   },
          //   options: [],
          //   labelText: '项目分级', // 控件显示的文本
          //   fieldName: 'projectOrderId',
          //   placeholder: '请选择项目代码'
          // }
        ]
      }
    }
  },
  data () {
    const mh = document.documentElement.clientHeight - 160
    const ch = mh - 75
    return {
      comp: this,
      currentRouterPath: '',
      thirdMenuParam: {},
      title: '',
      visible: false,
      whole: [],
      queryParam: {},
      dialogHeight: mh,
      customHeight: ch,
      tableApi: 'ProjectApply.projectList',
      currEntityId: '',
      isView: null,
      buttonConfig: {
        icon: 'edit'
      },
      defaultMenu: {}
    }
  },
  mounted () {
    this.currentRouterPath = this.$route.path
  },
  computed: {
  },
  methods: {
    tableRefresh (param) {
      param
        .then(() => {
          console.log('异步成功后端做的操作')
        })
        .catch(() => {
          console.log('异步失败的操作')
        })
    },
    delMenu (record) {
      let that = this
      this.$confirm(`是否确定要删除该项目？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$api['ProjectApply.removeProject']({ entityId: record.id })
          .then(function (res) {
            that.$refs.table.queryList()
            that.$message({
              message: '删除成功',
              type: 'success'
            })
          })
          .catch(function (error) {
            console.log(error)
          })
      }).catch(() => { })
    },
    closeDrawer () {
      this.visible = false
    },
    saveCallback () {
      this.$refs.table.searchData()
      this.onEditProjectClose()
    },
    search (param) {
      let newParams = { ...param }
      this.queryParam = newParams
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
    rowClick (row) {
      this.visible = true
      this.title = '风险信息'
      this.whole = { allStatus: this.allStatus, ...row, progress: row.progress * 100 }
    }

  }
}
</script>
