<template>
  <list-layout>
    <template #north>
      <common-button :comp="comp"
                     :button-config="buttonConfig"></common-button>
      <search-form-list ref="search"
                        :dataSource="searchData"
                        @search="search"
                        @re-set="reSet"></search-form-list>
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
          <template #status="{ scope }">
            <div class="task-count">
              <template v-if="scope.row.isChanged&&scope.row.isChanged!==''">
                <el-tooltip effect="light"
                            content="变更中"
                            placement="right">
                  <i class="icon-filled-circle p8"
                     style="cursor: pointer;color:red;margin-right: 10px;">
                  </i>
                </el-tooltip>
              </template>
            </div>
          </template>
        </common-table>
        <back-edit v-if="backEditVisible"
                   :visible="backEditVisible"
                   :revenueInfoId="revenueInfoId"
                   :wholeDescribeId="wholeDescribeId"
                   @close-modal="backEditClose"
                   @save-success="backEditCallback">
        </back-edit>
      </div>
    </template>

    <template #drawer-panel>
      <common-drawer v-if="visibleDrawer"
                     :visible="visibleDrawer"
                     placement="left"
                     size="100%"
                     @close="onEditProjectClose">
        <template #drawer>
          <menu-layout :third-menu-param="thirdMenuParam"
                       :default-menu="defaultMenu"></menu-layout>
        </template>
      </common-drawer>
      <common-drawer v-if="visibleBpmView"
                     :visible="visibleBpmView"
                     :isNeedCustomDrawerClass="false"
                     direction="ttb"
                     size="100%"
                     @close="onVisibleBpmViewClose">
        <template #drawer>
          <process-approval-view :processObj="processObj">
          </process-approval-view>
        </template>
      </common-drawer>
    </template>
  </list-layout>
</template>

<script>
import Vue from 'vue'
import BackEdit from './Components/backEdit'
import { P8Table as CommonTable } from '~/index'
import { P8Button as CommonButton } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'
import { P8ListLayout as ListLayout } from '~/index'
import { P8Search as SearchFormList } from '~/index'
import { P8MenuLayout as MenuLayout } from '~/index'
import { P8ProcessApproval as ProcessApprovalView } from '~/index'
import commonWorkflow from '@/utils/commonWorkflow'
import { Tooltip } from '~/index'

export default {
  name: 'RevenueFullBudget',
  components: {
    'el-tooltip': Tooltip,
    CommonTable,
    CommonButton,
    CommonDrawer,
    ListLayout,
    SearchFormList,
    BackEdit,
    ProcessApprovalView,
    MenuLayout // 缺少三级菜单MenuLayout组件
  },
  props: {
    columns: {
      type: Array,
      default: function () {
        return [
          {
            title: '',
            dataIndex: 'status',
            scopedSlots: { customRender: 'custom' },
            width: 45,
            align: 'center'
          },
          {
            title: '序号',
            type: 'index',
            width: 55,
            align: 'center'
          },
          {
            title: '所属型号',
            dataIndex: 'modelCode',
            width: 120,
            align: 'center'
          },
          {
            title: '项目编号',
            dataIndex: 'pjCode',
            width: 140,
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
            dataIndex: 'classifyName',
            width: 150,
            align: 'center'
          },
          {
            title: '收款预算金额(万元)',
            dataIndex: 'totalMoney',
            width: 180,
            align: 'center'
          },
          {
            title: '状态',
            dataIndex: 'statusDisplay',
            width: 150,
            align: 'center'
          },
          {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: { customRender: 'operation' },
            width: 120,
            align: 'center'
          }
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
            fieldName: 'projectCode',
            placeholder: '请输入项目编号', // 默认控件的空值文本
            fieldEvent: {
              click: 'clickEvent(this)'
            }
          },
          // {
          //   type: 'select',
          //   defaultValue: [],
          //   optionUrl: {
          //     api: 'thirdPartInterface.getDic',
          //     params: { dicType: 'PROJECT_ORDER' }
          //   },
          //   options: [],
          //   labelText: '项目分级', // 控件显示的文本
          //   fieldName: 'projectOrderId',
          //   placeholder: '选择项目分级',
          //   fieldConfig: {
          //     multiple: true
          //   }
          // },
          {
            type: 'treeSelect',
            defaultValue: [],
            labelText: '项目类型',
            fieldName: 'projectClassifyId',
            placeholder: '选择项目类型',
            defaultExpandAll: true,
            multiple: true,
            optionUrl: {
              api: 'ProjectApply.projectClassifyTree',
              params: {},
              // label: 'name',
              value: 'id'
            },
            treeData: []
          },
          {
            type: 'select',
            defaultValue: [],
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
          }
          // ,
          // {
          //   type: 'treeSelect',
          //   multiple: true,
          //   labelText: '管理部门',
          //   fieldName: 'deptId',
          //   defaultExpandedKeys: ['1'],
          //   defaultValue: [],
          //   placeholder: '选择管理部门',
          //   optionUrl: {
          //     api: 'ProjectApply.deptTree',
          //     params: {}
          //   },
          //   treeData: []
          // }
        ]
      }
    }
  },
  data () {
    return {
      tableApi: 'revenueFullBudget.list',
      comp: this,
      currentRouterPath: '',
      thirdMenuParam: {},
      revenueInfoId: '',
      wholeDescribeId: '',
      visibleDrawer: false,
      backEditVisible: false,
      queryParam: {},
      buttonConfig: {
        icon: 'edit'
      },
      processObj: {},
      defaultMenu: {},
      businessId: '',
      processDefinitionKey: 'allRevenueStatus-collocation',
      visibleBpmView: false
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
    tempRowClick (record, columns) {
      let column = columns.property
      if (column && column !== 'operation') {
        this.visibleDrawer = true
      }
      this.revenueInfoId = record.revenueInfoId
      this.wholeDescribeId = record.wholeDescribeId
      this.thirdMenuParam.revenueInfoId = record.revenueInfoId
      this.thirdMenuParam.wholeDescribeId = record.wholeDescribeId
    },
    repealRevenueEdit (record) {
      this.revenueInfoId = record.revenueInfoId
      this.wholeDescribeId = record.wholeDescribeId
      this.thirdMenuParam.revenueInfoId = record.revenueInfoId
      this.thirdMenuParam.wholeDescribeId = record.wholeDescribeId
      this.visibleDrawer = true
    },
    returnRevenueInfo (record) {
      this.revenueInfoId = record.revenueInfoId
      this.wholeDescribeId = record.wholeDescribeId
      this.thirdMenuParam.revenueInfoId = record.revenueInfoId
      this.thirdMenuParam.wholeDescribeId = record.wholeDescribeId
      this.backEditVisible = true
    },
    backEditClose () {
      this.backEditVisible = false
    },
    backEditCallback () {
      this.$refs.table.queryList()
      this.backEditVisible = false
    },
    releaseRevenueInfo (record) {
      let that = this
      let status = record.status
      console.log(status)
      if (status && status !== '4521') {
        that.$message(
          {
            message: '经费正在编制中，不能发布！',
            type: 'error'
          }
        )
      } else {
        that.$confirm(`确认要发布预算吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$api['collectionBudget.updateProjectRevenueInfoComeIn']({ revenueInfoId: record.revenueInfoId, wholeDescribeId: record.wholeDescribeId, flag: 'release' }).then(res => {
            if (res && res === 'true') {
              that.$refs.table.queryList()
            } else {
              that.$message(
                {
                  message: '提交失败！',
                  type: 'error'
                }
              )
            }
          })
        }).catch(() => { })
      }
    },
    selectFlow (record) {
      var params = {
        businessId: record.businessId,
        processDefinitionKey: 'allRevenueStatus-collocation'
      }
      commonWorkflow.actions.findWorkFlowView(params).then(data => {
        this.processObj = data
      })
      this.visibleBpmView = true
      this.businessId = record.businessId
    },
    onVisibleBpmViewClose () {
      this.visibleBpmView = false
    },
    repealRevenueChange (record) {
      let that = this
      that.$message({
        message: '当前状态下不能进行该操作',
        type: 'error'
      })
    },
    onEditProjectClose () {
      this.$router.push({ path: this.currentRouterPath })
      this.visibleDrawer = false
      this.$refs.table.searchData()
    },
    saveCallback () {
      this.$refs.table.searchData()
      this.onEditProjectClose()
    },
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
    }
  }
}
</script>
