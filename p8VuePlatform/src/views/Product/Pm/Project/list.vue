<template>
  <normal-layout>
    <template #north>
      <common-button :comp='comp'
                     :selectRecords="selectedRows"
                     :button-config='buttonConfig'></common-button>
      <!-- <search-form-list ref='search'
                        :dataSource='searchData'
                        @search='search'
                        @re-set='reSet'></search-form-list> -->
    </template>
    <template #west>
    <common-tree ref="tree"
                :treeApi="treeApi"
                :treeParam="leftTreeParam"
                @select="onSelect"></common-tree>
    </template>
    <template #center>
      <div id='table-contain'>
        <common-table ref='table'
                      v-on="{'open-third-menu':openThirdMenu}"
                      :comp='comp'
                      :columns='columns'
                      :params='queryParam'
                      :api='tableApi'
                      :showSearchRow="true"
                      :hidden-root-operation='true'
                      :table-refresh='tableRefresh'
                      :menu-state='menuStateObj'
                      :table-config='tableConfig'
                      @select-all="selectAll"
                      @selection-change='handleSelectionChange'>
          <template #executeState="{scope}">
            <common-status-icon v-if="!scope.row.whetherRoot"
                                :status-name="statusName"
                                :status-key="scope.row.executeState"></common-status-icon>
            <el-tooltip v-if="scope.row.monitorPointLockArray && scope.row.monitorPointLockArray.length >0 "
                        effect="dark"
                        :content="'被锁定的任务标识：'+scope.row.monitorPointLockArray"
                        placement="left">
              <i class="el-icon-lock"
                 style="font-size: 16px"></i>
            </el-tooltip>
            <el-tooltip v-if="scope.row.switchType && scope.row.switchType==='9010' "
                        effect="dark"
                        :content="'项目暂停'"
                        placement="left">
              <i class="p8 icon-tip"
                 style="font-size: 16px"></i>
            </el-tooltip>
            <el-tooltip v-if="scope.row.switchType && scope.row.switchType==='9020' "
                        effect="dark"
                        :content="'项目禁止'"
                        placement="left">
              <i class="element_icon el-icon-error"
                 style="font-size: 16px"></i>
            </el-tooltip>
          </template>
          <template #manageStatus="{scope}">
            <common-status-icon v-if="!scope.row.whetherRoot"
                                :status-name="planManagerStatus"
                                :status-key="scope.row.manageStatus"></common-status-icon>
          </template>
          <template #name="{scope,thirdMenuData}">
           <el-tooltip v-if="scope.row.manageStatus"
                        effect="dark"
                        :content="scope.row.manageStatusDisplay"
                        placement="left">
              <span v-if="scope.row.manageStatus==='6611' || scope.row.manageStatus==='6621'|| scope.row.manageStatus==='6641'"
                    class="base-custom-style approve" @click="getBoHui(scope)">驳</span>
              <span v-else
                    class="base-custom-style approve" >审</span>
            </el-tooltip>
            <span v-if="scope.row.leaf"
                  class="underline"
                  @click="drillCol(scope,thirdMenuData)">{{ scope.row.name }}</span>
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </common-table>

        <common-dialog :title="commitTitle"
                        width="600px"
                        ref="dialogCommit"
                       :visible="isCommitVisibleDialog"
                       :dialogHeight="dialogHeight"
                       @isfullscreen="isfullscreen"
                       @handle-cancel="commitClose"
                       @handle-ok="commitSave"
                       @close="commitClose">
          <template #dialog>
            <div style="padding: 30px;" v-if="isCommitVisible">
              <el-row>
                <el-col :span="4">
                  <span style="height: 30px;line-height: 30px;">提交</span>
                </el-col>
                <el-col :span="20">
                  <el-select style="width:400px" v-model="commitStatus"
                             placeholder="请选择">
                    <el-option v-for="item in commitOptions"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"
                               :disabled="item.disabled">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
            </div>
            <submit v-if="packageNodeInfoVisible" :dataInfos="packageNodeInfos" :width="echartsWidth" :height="echartsHeight" ref="nodeCharts"></submit>
          </template>
        </common-dialog>
        <selectApproveUser v-if="isSelectApproveUserView"
                           :isSelectApproveUserView="isSelectApproveUserView"
                           :selectUserDataSource="selectUserDataSource"
                           :selectUserFormData="selectUserFormData"
                           @close-modal="closeSelectApproveUser"
                           @commit="commitSelectApproveUser"></selectApproveUser>
        <selectApproveUserBeforehand v-if="isSelectApproveUserBeforehandView"
                                     :isSelectApproveUserBeforehandView="isSelectApproveUserBeforehandView"
                                     :selectUserBeforehandDataSource="selectUserBeforehandDataSource"
                                     :selectUserBeforehandFormData="selectUserBeforehandFormData"
                                     @close-modal="closeSelectApproveUserBeforehand"
                                     @commit="commitSelectApproveUserBeforehand"></selectApproveUserBeforehand>
      </div>
    </template>
    <template #drawer-panel>
      <lock-unlock v-if='visible'
                   @close-lock-unlock='onLockUnlockSettingsClose'
                   :content='content'
                   :visible='visible'
                   :plan-info-array='selectedRowKeys'></lock-unlock>
      <common-drawer v-if='visibleCreatePlanDrawer'
                     :title='createPlanTitle'
                     :visible='visibleCreatePlanDrawer'
                     size='50%'
                     :drawer-config='drawerConfigClose'
                     @close='onPlanCreateClose'>
        <template #drawer>
          <create-plan @save-success='onCreateSettingsClose'
                       :plan-info-id='planInfoId'></create-plan>
        </template>
      </common-drawer>
      <common-drawer v-if='visiblePlanViewDrawer'
                     :title='viewPlanTitle'
                     :visible='visiblePlanViewDrawer'
                     size='50%'
                     :drawer-config='drawerConfigClose'
                     :isNeedCustomDrawerClass="false"
                     @close='onPlanViewClose'>
        <template #drawer>
          <plan-view :plan-info-id='planInfoId'
                     @save-success='onPlanViewClose'></plan-view>
        </template>
      </common-drawer>
      <common-drawer v-if="visibleThirdDrawer"
                     :visible="visibleThirdDrawer"
                     direction="ttb"
                     :drawerConfig="drawerConfig"
                     size="100%"
                     @close="onThirdMenuClose">
        <template #drawer>
          <menu-layout :third-menu-param='thirdMenuParam'
                       :default-menu="defaultMenu" exclude="PlanChange"></menu-layout>
        </template>
      </common-drawer>
      <common-drawer v-if="visibleBpmView"
                     :visible="visibleBpmView"
                     :isNeedCustomDrawerClass="false"
                     direction="ttb"
                     size="100%"
                     @close="onVisibleBpmViewClose">
        <template #drawer>
          <process-approval-view :businessObj="{
                          businessId: businessId,
                          processDefinitionKey: processDefinitionKey
                        }">
          </process-approval-view>
        </template>
      </common-drawer>
      <common-drawer v-if="connectAvTaskView"
                     :visible="connectAvTaskView"
                     direction="ttb"
                     size="100%"
                     :isNeedCustomDrawerClass="false"
                     @close="connectview">
        <template #drawer>
          <connect-index :planInfoId = "selectedRowKeys[0]" :headerVisible="false" @close="connectview">
          </connect-index>
        </template>
      </common-drawer>
      <common-drawer v-if="yplanConnect"
                     :visible="yplanConnect"
                     :title="drawerTitle"
                     placement="top"
                     direction="ttb"
                     :drawerConfig="drawerConfig"
                     size="100%"
                     @close="connectview">
        <template #drawer>
          <gantt-Index :planId="yplanId" :planInfoId = "planInfoId"></gantt-Index>
        </template>
      </common-drawer>
    </template>
  </normal-layout>
</template>

<style lang="scss">
.ant-drawer-wrapper-body {
  height: calc(100% + 52px);
}
.ant-drawer-body {
  height: 100%;
}
i.el-icon-menu {
  color: #1890ff;
  font-size: 16px;
}
.three-menu {
  .menu-item {
    display: flex;
    align-items: center;
    padding: 5px;
    &:hover {
      background-color: #e6f7ff;
      cursor: pointer;
    }
    span {
      padding-left: 6px;
      font-size: 14px;
    }
  }
}
.base-custom-style {
  color: $base-white-color;
  padding: 0 2px;
  font-size: 12px;
  border-radius: 10px;
  cursor: pointer;
  &.approve {
    background-color: $base-red-color;
  }
  &.leaf {
    background-color: $base-green-color;
  }
}
</style>
<script>
import Vue from 'vue'
import moment from 'moment'
import { P8Drawer as CommonDrawer } from '~/index'
import { P8Dialog as CommonDialog } from '~/index'
import { P8StatusIcon as CommonStatusIcon } from '~/index'
// import { P8Search as SearchFormList } from '~/index'
import { P8Table as CommonTable } from '~/index'
import { P8Button as CommonButton } from '~/index'
import { P8MenuLayout as MenuLayout } from '~/index'
import SelectApproveUser from '@/views/Framework/BusinessActivity/ProcessApproval/selectApproveUser'
import LockUnlock from './lockUnlock'
import CreatePlan from './createPlan'
import PlanView from './planInfoView'
import { Tooltip, Select, Option, Row, Col } from '~/index'
import ConnectIndex from './../Plan/Components/planGanttView/connectCourtyardPlan/selectAssociationYplan'
import GanttIndex from './../Plan/Components/planGanttView/connectCourtyardPlan/index'
// import { nextApproveUser } from '@/assets/commonJS/BusinessActivity/nextApproveUser'
import SelectApproveUserBeforehand from '@/views/Framework/BusinessActivity/ProcessApproval/selectApproveUserBeforehand'
import { nextApproveUserBeforehand } from '@/assets/commonJS/BusinessActivity/nextApproveUserBeforehand'
import { P8ProcessApproval as ProcessApprovalView } from '~/index'
import { P8Tree as CommonTree } from '~/index'
import { P8NormalLayout as NormalLayout } from '~/index'
import Submit from './submit'

export default {
  name: 'planInfoList',
  components: {
    CommonDrawer,
    CommonDialog,
    ConnectIndex,
    GanttIndex,
    // SearchFormList,
    CommonTable,
    CommonButton,
    NormalLayout,
    SelectApproveUser,
    CommonStatusIcon,
    CreatePlan,
    CommonTree,
    LockUnlock,
    PlanView,
    MenuLayout,
    'el-tooltip': Tooltip,
    'el-select': Select,
    'el-option': Option,
    'el-row': Row,
    'el-col': Col,
    SelectApproveUserBeforehand,
    ProcessApprovalView,
    Submit
  },
  data () {
    let columns = [
            {
              title: '',
              width: 35,
              type: 'selection'
            },
            {
              title: '状态',
              type: 'index',
              dataIndex: 'executeState',
              scopedSlots: { customRender: 'custom' },
              width: 60
            },
            // {
            //   title: '',
            //   type: 'index',
            //   dataIndex: 'manageStatus',
            //   scopedSlots: { customRender: 'custom' },
            //   width: 30
            // },
            {
              title: '#',
              type: 'index',
              dataIndex: 'treeMenuIcon',
              scopedSlots: { customRender: 'thirdMenu' },
              width: 40,
              formatter: function (row) {
                // 控制三级菜单是否显示
                if (row.leaf) {
                  return true
                }
                return false
              }
            },
            {
              title: '型号代号',
              width: 130,
              dataIndex: 'modelCode',
              align: 'center',
              formatter (row, column, cellValue, index) {
                return cellValue
              },
              filterable: true,
              iconDisplay: false,
              filter: {
                val: '',
                type: 'multiple',
                optionUrl: {
                    api: 'ProjectApply.getModelListData',
                    label: 'modelCode',
                    value: 'id',
                    params: {}
                  }
              }
            },
            {
              title: '项目/计划',
              dataIndex: 'name',
              drillable: true,
              scopedSlots: { customRender: 'custom' },
              minWidth: 300,
              filterable: true, // 列上增加输入框搜索
              iconDisplay: false, // 表头点击搜索图标，出现搜索条件
              filter: {
                val: '',
                type: 'text'
              }
            },
            {
              title: '项目类型',
              width: 150,
              dataIndex: 'kprojectClassifyName',
              align: 'center',
              formatter (row, column, cellValue, index) {
                return cellValue
              },
              filterable: true, // 列上增加输入框搜索
              iconDisplay: false, // 表头点击搜索图标，出现搜索条件
              filter: {
                alias: 'kprojectClassifyIds',
                val: '',
                defaultExpandAll: true,
                multiple: true,
                type: 'treeSelect',
                optionUrl: {
                  api: 'ProjectApply.projectClassifyTree',
                  params: {},
                  // label: 'name',
                  value: 'id'
                }
              }
            },
            // {
            //   title: '项目分级',
            //   width: 95,
            //   dataIndex: 'projectOrder',
            //   align: 'center',
            //   formatter (row, column, cellValue, index) {
            //     return cellValue
            //   }
            // },
            // {
            //   title: '管理部门',
            //   width: 150,
            //   dataIndex: 'deptName',
            //   align: 'center',
            //   formatter (row, column, cellValue, index) {
            //     return cellValue
            //   }
            // },
            {
              title: '计划开始时间',
              width: 120,
              dataIndex: 'planBeginDate',
              align: 'center',
              formatter (row, column, cellValue, index) {
                return cellValue
              }
              // filterable: true, // 列上增加输入框搜索
              // iconDisplay: false, // 表头点击搜索图标，出现搜索条件
              // filter: {
              //   val: '',
              //   type: 'datetime',
              //   fieldConfig: {
              //     valueFormat: 'yyyy-MM-dd'
              //   }
              // }
            },
            {
              title: '计划完成时间',
              width: 120,
              dataIndex: 'planEndDate',
              align: 'center',
              formatter (row, column, cellValue, index) {
                return cellValue
              }
              // filterable: true, // 列上增加输入框搜索
              // iconDisplay: false, // 表头点击搜索图标，出现搜索条件
              // filter: {
              //   val: '',
              //   type: 'datetime',
              //   fieldConfig: {
              //     valueFormat: 'yyyy-MM-dd'
              //   }
              // }
            },
            {
              title: '预测开始时间',
              width: 120,
              dataIndex: 'forecastBeginDate',
              align: 'center',
              formatter (row, column, cellValue, index) {
                return cellValue
              }
              // filterable: true, // 列上增加输入框搜索
              // iconDisplay: false, // 表头点击搜索图标，出现搜索条件
              // filter: {
              //   val: '',
              //   type: 'datetime',
              //   fieldConfig: {
              //     valueFormat: 'yyyy-MM-dd'
              //   }
              // }
            },
            {
              title: '预测完成时间',
              width: 120,
              dataIndex: 'forecastEndDate',
              align: 'center',
              formatter (row, column, cellValue, index) {
                return cellValue
              }
              // filterable: true, // 列上增加输入框搜索
              // iconDisplay: false, // 表头点击搜索图标，出现搜索条件
              // filter: {
              //   val: '',
              //   type: 'datetime',
              //   fieldConfig: {
              //     valueFormat: 'yyyy-MM-dd'
              //   }
              // }
            },
            // {
            //   title: '状态',
            //   width: 150,
            //   dataIndex: 'executeStateDisplay',
            //   align: 'center',
            //   formatter (row, column, cellValue, index) {
            //     return cellValue
            //   },
            //   filterable: true, // 列上增加输入框搜索
            //   iconDisplay: false, // 表头点击搜索图标，出现搜索条件
            //   filter: {
            //     alias: 'executeStates', // dataIndex 对应过滤字段的别名
            //     val: '',
            //     type: 'multiple',
            //     optionUrl: {
            //       api: 'thirdPartInterface.getDic',
            //       params: { dicType: 'EXECUTE_STATE' }
            //     }
            //   }

            // },
            {
              title: '创建时间',
              width: 100,
              dataIndex: 'createDate',
              align: 'center',
              formatter (row, column, cellValue, index) {
                return cellValue
              }
            },
            {
              title: '操作',
              dataIndex: 'operation',
              scopedSlots: { customRender: 'operation' },
              width: 120,
              align: 'center'
            }
          ]

    return {
      treeApi: 'commonProjectTree.projectTreeByPlan',
      leftTreeParam: { resources: [] },
      visibleBpmView: false,
      connectAvTaskView: false,
      yplanConnect: false,
      businessId: undefined,
      processDefinitionKey: '',
      isSelectApproveUserView: false,
      selectUserDataSource: [],
      selectUserFormData: {},
      statusName: 'planStatus',
      planManagerStatus: 'planManagerStatus',
      isSelectApproveUserBeforehandView: false,
      selectUserBeforehandDataSource: [],
      selectUserBeforehandFormData: {},
      isBeforehand: true, // 是否预先设置审批人模式
      sourceTemplate: {
        processInstanceEl: {
          type: 'text',
          labelText: '业务名称',
          fieldName: 'businessName',
          disabled: true,
          colLayout: 'singleCol',
          fieldConfig: {
            disabled: true
          }
        },
        approveNode: {
          type: 'select',
          labelText: '审批节点',
          fieldName: 'nextTaskNodeId',
          options: [],
          multiple: false,
          disabled: true,
          placeholder: '选择节点',
          colLayout: 'doubleCol',
          fieldConfig: {
            disabled: true
          }
        },
        approveNodeUsers: {
          type: 'treeSelect',
          labelText: '审批人',
          fieldName: '',
          multiple: false,
          placeholder: '选择节点审批人',
          colLayout: 'doubleCol',
          treeData: []
        }
      },
      isCommitVisible: false,
      isCommitVisibleDialog: false,
      dialogHeight: document.documentElement.clientHeight * 0.5,
      commitStatus: undefined,
      commitOptions: [],
      menuStateObj: [],
      drawerConfig: {
        modal: false
      },
      drawerConfigClose: {
        destroyOnClose: true
      },
      tableConfig: {
        'default-expand-all': true,
        scroll: { x: 1300 },
        expandIconColumnIndex: 3,
        'highlight-current-row': true,
        rowSelection: {
          type: 'checkbox',
          onChange: (selectedRowKeys, selectedCopyRows) => {
            this.selectedRowKeys = selectedRowKeys
            this.selectedCopyRows = selectedCopyRows
          },
          getCheckboxProps: record => ({
            props: {
              // 这里只禁用，应该不展示，待处理
              disabled: record.parentId == null,
              name: record.parentId
            }
          })
        }
      },
      visible: false,
      planVisible: false,
      content: null,
      currentRouterPath: '',
      visibleCreatePlanDrawer: false,
      visibleThirdDrawer: false,
      visiblePlanViewDrawer: false,
      createPlanTitle: '新建计划',
      viewPlanTitle: '查看计划',
      commitTitle: '',
      drawerThirdTitle: '',
      planInfoId: '',
      thirdMenuParam: {},
      thirdMenuTitle: '',
      defaultMenu: {},
      drawerTitle: '关联院计划',
      queryParam: {},
      tableApi: 'planInfoManager.treeListData',
      buttonConfig: {},
      columns: columns,
      selectedRowKeys: [],
      selectedCopyRows: [],
      multipleSelection: [],
      buttonJurisdiction: {},
      selectedRows: [],
      statusStyle: {},
      comp: this,
      planStatus: {},
      createPlanId: '', // 新建计划的id，用于选中新建计划
      searchData: [
        {
          type: 'multiple',
          optionUrl: {
            api: 'thirdPartInterface.getDic',
            params: { dicType: 'EXECUTE_STATE' }
          },
          options: [],
          labelText: '状态',
          fieldName: 'executeStates',
          placeholder: '选择状态'
        },
        {
          type: 'text',
          labelText: '计划名称',
          fieldName: 'planName',
          placeholder: '请输入计划名称'
        },
        {
          type: 'text',
          labelText: '计划编号',
          fieldName: 'planCode',
          placeholder: '请输入计划编号'
        },
        {
          type: 'datetimeRange',
          labelText: '创建日期',
          defaultValue: [],
          fieldName: 'recordingTime',
          placeholder: ['开始日期', '结束日期']
        },
        {
          type: 'text',
          labelText: '项目名称',
          fieldName: 'name',
          placeholder: '请输入项目名称'
        },
        // {
        //   type: 'multiple', // 控件类型
        //   labelText: '项目分级', // 控件显示的文本
        //   fieldName: 'projectOrderIds',
        //   placeholder: '请选择项目分级',
        //   optionUrl: {
        //     api: 'thirdPartInterface.getDic',
        //     params: { dicType: 'PROJECT_ORDER' }
        //   },
        //   options: []
        // },
        {
          type: 'treeSelect',
          labelText: '项目类型',
          fieldName: 'kprojectClassifyIds',
          placeholder: '请选择项目类型',
          multiple: true,
          defaultExpandAll: true,
          optionUrl: {
            api: 'ProjectApply.projectClassifyTree',
            params: {},
            // label: 'name',
            value: 'id'
          },
          treeData: []
        },
        {
          type: 'multiple',
          labelText: '所属型号',
          fieldName: 'modelCode',
          placeholder: '选择所属型号',
          optionUrl: {
            api: 'ProjectApply.getModelListData',
            label: 'modelCode',
            value: 'id',
            params: {}
          },
          treeData: []
        }
        // ,
        // {
        //   type: 'treeSelect',
        //   labelText: '管理部门',
        //   fieldName: 'manageDeptId',
        //   multiple: false,
        //   defaultExpandedKeys: ['1'],
        //   defaultValue: '',
        //   placeholder: '选择管理部门',
        //   optionUrl: {
        //     api: 'ProjectApply.deptTree',
        //     params: {}
        //   },
        //   treeData: []
        // }
      ],
      selectAllChecked: false, // 全选flag
      packageNodeInfos: null,
      processDefinitionKeyByCommitStatus: null,
      packageNodeInfoVisible: false,
      echartsWidth: 600,
      echartsHeight: 600
    }
  },
  computed: {
    planStatusColor () {
      return function (status) {
        if (this.planStatus[status]) {
          return 'color: ' + this.planStatus[status].color
        }
        return ''
      }
    },
    planStatusIcon () {
      return function (status) {
        if (this.planStatus[status]) {
          return 'p8 ' + this.planStatus[status].icon
        }
        return ''
      }
    },
    planStatusDisp () {
      return function (status) {
        if (this.planStatus[status]) {
          return this.planStatus[status].name
        }
        return ''
      }
    }
  },
  mounted () {
    let that = this
    that.currentRouterPath = that.$route.path
    // 加载通用gantt操作权限决策，并存入vuex
    that.$api['planInfoManager.loadPlanStatusLimitStrategy']().then(function (res) {
      if (res) {
        that.$store.dispatch('setPlanStatusLockMap', res['plan'])
        that.$store.dispatch('setTaskStatusLockMap', res['task'])
      }
    })
    this.leftTreeParam.resources.push(this.$route.meta.id)
  },
  methods: {
    isfullscreen (fullscreen) {
      this.$nextTick(() => {
        this.$refs.nodeCharts.resize()
      })
    },
    withdraw (record) {
      let that = this
      if (that.selectedRowKeys && that.selectedRowKeys.length === 1) {
        that.$confirm(`确定撤回当前审批流程？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          if (this.selectedRowKeys && this.selectedRowKeys.length === 1) {
            that.$api['planInfoManager.withdraw']({ businessKey: that.selectedRowKeys[0], processDefinitionKey: that.processDefinitionKey, status: that.selectedRows[0].status }).then(function (res) {
              if (res && res.result === false && res.errorMsg) {
                that.$message({ message: res.errorMsg, type: 'error' })
              } else if (res && res.result && res.successMsg) {
                that.$message({ message: '成功！' + res.successMsg, type: 'success' })
              } else {
                that.$message({ message: '操作失败！', type: 'error' })
              }
              that.$refs.table.queryList()
            }).catch(() => {})
          }
        }).catch(() => {})
      } else {
        that.$message({
          message: '只能选择一条进行撤回！',
          type: 'warning'
        })
      }
    },
    onSelect (node) {
      let me = node
      if (me.layersParams) {
        this.layersParams = me.layersParams
        this.queryParam.layersParams = Object.assign({}, me.layersParams)
      } else {
        this.layersParams = {}
      }
      this.$refs.table.searchData()
    },
    // 点击项目/计划列钻取进入三级菜单-计划编制页面
    drillCol (scope, thirdMenuData) {
      console.log(scope, 'scope')
      if (thirdMenuData.length) {
        let planManager = thirdMenuData.filter(o => o.name === 'planManager')
        this.openThirdMenu(scope.row, planManager[0])
      }
    },
    // 查看驳回意见
    getBoHui (scope) {
      let that = this
      console.log(scope, 'scope')
      console.log(scope.row.id, 'scope.row.id')
      that.$api['planInfoManager.customGetPlanReject']({ planInfoId: scope.row.id }).then(res => {
        if (res && res.message) {
          that.$message({
            message: '驳回意见: ' + res.message,
            type: 'success'
          })
        }
      })
    },
    handleSelectionChange (val) {
      this.selectedRowKeys = []
      this.selectedRows = []
      this.multipleSelection = val
      val.map(item => {
        this.selectedRowKeys.push(item.id)
        this.selectedRows.push(item)
      })
    },
    selectAll (tableData) {
      this.selectAllChecked = !this.selectAllChecked
      this.selectAllRow(tableData, this.selectAllChecked)
    },
    /**
     * 处理数据，全选行，默认只选子不选父
     */
    selectAllRow (data, flag) {
      let _this = this
      data.map(row => {
        if (row.children) {
          _this.selectAllRow(row.children)
        } else {
          _this.$refs.table.$refs.table.toggleRowSelection(row, flag)
        }
      })
    },
    tableRefresh (param) {
      let _this = this
      param.then((res) => {
        if (this.createPlanId) {
          res.records.map(item => {
            if (item.children.length) {
              item.children.map(childItem => {
                if (childItem.id === _this.createPlanId) {
                  _this.$refs.table.$refs.table.setCurrentRow(childItem)
                }
              })
            }
          })
        }
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
    createSettings () {
      this.visibleCreatePlanDrawer = true
      this.planInfoId = ''
    },
    detailsProjectInfoSettings (record) {
      let that = this
      if (this.selectedRowKeys && this.selectedRowKeys.length === 1) {
        this.planInfoId = this.selectedRowKeys[0]
        this.visiblePlanViewDrawer = true
      } else {
        that.$message({
          message: '只能选择一条查看！',
          type: 'warning'
        })
      }
    },
    onPlanViewClose () {
      this.planInfoId = ''
      this.visiblePlanViewDrawer = false
    },
    onPlanCreateClose () {
      this.planInfoId = ''
      this.visibleCreatePlanDrawer = false
    },
    onCreateSettingsClose (res) {
      this.createPlanId = res.planId
      this.visibleCreatePlanDrawer = false
      this.$refs.table.searchData()
    },
    lockUnlockSettings () {
      if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
        this.content = null
        this.visible = true
      } else {
        this.$message({
          message: '请选择需要加解锁的计划！',
          type: 'error'
        })
      }
    },
    onLockUnlockSettingsClose () {
      this.visible = false
      this.$refs.table.searchData()
    },
    modifySettings (record) { // 修改
      let that = this
      if (that.selectedRowKeys && that.selectedRowKeys.length === 1) {
        that.visibleCreatePlanDrawer = true
        that.planInfoId = that.selectedRowKeys[0]
        that.$refs.table.searchData()
      } else {
        that.$message({
          message: '只能选择一条修改！',
          type: 'warning'
        })
      }
    },
    removeSettings (record) { // 删除
      let that = this
      if (that.selectedRowKeys && that.selectedRowKeys.length === 1) {
        that.$confirm(`是否要删除该计划？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let type = 'success'
          let msg = '删除成功！'
          that.$api['planInfoManager.removePlanInfo']({ planInfoId: that.selectedRowKeys[0] }).then(res => {
            if (res && res === 'true') {
              that.$refs.table.searchData()
            } else {
              type = 'error'
              msg = '删除失败！'
            }
          }).catch(function (error) {
            type = 'error'
            msg = '删除失败！'
            console.log(error, 'error')
          })
          this.$message(
                  {
                    message: msg,
                    type: type
                  }
          )
        }).catch(() => { })
      } else {
        that.$message({
          message: '只能选择一条删除！',
          type: 'warning'
        })
      }
    },
    connectAvTask () {
      let that = this
      if (this.selectedRowKeys && this.selectedRowKeys.length === 1) {
        this.yplanId = this.selectedRows[0].yplanId
        if (this.yplanId) {
          this.planInfoId = this.selectedRowKeys[0]
          this.drawerTitle = '关联院计划'
          this.yplanConnect = true
        } else {
          this.connectAvTaskView = true
        }
      } else {
        that.$message({
          message: '只能选择一条进行关联！',
          type: 'warning'
        })
      }
    },
    connectview () {
      this.connectAvTaskView = false
      this.yplanConnect = false
      this.$refs.table.searchData()
    },
    releaseSettings () { // 发布
      if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
        this.content = '计划发布'
        let that = this
        that.$api['planInfoManager.startPlanInfo']({ planInfoArray: that.selectedRowKeys, content: that.content }).then(res => {
          if (res) {
            that.$refs.table.searchData()
            that.$message({
              message: '发布成功！',
              type: 'success'
            })
          } else {
            that.$message({
              message: '发布失败！',
              type: 'error'
            })
          }
        }).catch(function (error) {
          that.$message({
            message: '发布失败！',
            type: 'error'
          })
          console.log(error, 'error')
        })
      } else {
        this.$message({
          message: '请选择需要发布的计划！',
          type: 'error'
        })
      }
    },
    commit (record, item) {
      let that = this
      let temp = {}
      this.selectedRows.forEach((k, v) => {
        temp[k.executeState] = k.executeState
      })

      console.log(temp, 'temp')
      if (Object.keys(temp).length > 1) {
        this.$message({
          message: '请选择相同状态的计划进行提交。',
          type: 'warning'
        })
        return
      }

      this.$api['planInfoManager.releasePlanInfoCheck']({ planInfoArray: this.selectedRowKeys }).then(res => {
          if (res && !res.success) {
            this.$message({
              message: res.message,
              type: 'warning'
            })
          } else {
            let currStatus = this.selectedRows[0].executeState
            if (currStatus === '1070' && this.selectedRows.length === 1) {
              that.$api['planInfoManager.commitStatusFilter']({ ids: this.selectedRowKeys }).then(statusArray => {
                that.$api['planInfoManager.getCommitStatus']({ status: statusArray }).then(res => {
                  that.commitOptions = res.options
                  that.commitStatus = res.options[0].value
                  that.isCommitVisibleDialog = true
                  that.isCommitVisible = true
                })
              })
            } else if (currStatus !== '1070') {
              that.$api['planInfoManager.commitStatusFilter']({ ids: this.selectedRowKeys }).then(statusArray => {
                that.$api['planInfoManager.getCommitStatus']({ status: statusArray }).then(res => {
                  that.commitOptions = res.options
                  that.commitStatus = res.options[0].value
                  that.isCommitVisibleDialog = true
                  that.isCommitVisible = true
                })
              })
            } else {
              this.$message({
                message: '请选择需要一条计划完成！',
                type: 'warning'
              })
            }
          }
      })
    },
    commitClose () {
      let that = this
      that.$confirm(`审批还未提交，是否提交？`, '提示', {
        confirmButtonText: '提交',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.commitSave()
      }).catch(() => {
        that.isCommitVisibleDialog = false
        that.isCommitVisible = false
        that.commitStatus = undefined
        that.packageNodeInfoVisible = false
      })
    },
    closeDialog () {
      this.isCommitVisibleDialog = false
      this.isCommitVisible = false
      this.commitStatus = undefined
      this.packageNodeInfoVisible = false
    },
    // 分发统筹
    distributionCoordinator () {
      if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
        this.releaseMenuParams = { ids: this.selectedRowKeys }
        let that = this
        that.$api['planInfoManager.releasePlanInfoCheck']({ planInfoArray: that.selectedRowKeys, checkerSign: 'overallPlanningPlanInfo' }).then(res => {
          if (res && !res.success) {
            that.$message({
              message: res.message,
              type: 'warning',
              dangerouslyUseHTMLString: true,
              duration: 5000
            })
          } else {
            that.$confirm(`是否统筹选中的计划？`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                that.commitStatus = '1010'
                that.releaseMenuParams = { status: [that.commitStatus], ids: that.selectedRowKeys }
                that.updateStatusAction()
            }).catch(() => { })
          }
        })
      }
    },
    // 统筹审核
    distributionAudit () {
      if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
        this.releaseMenuParams = { ids: this.selectedRowKeys }
        let that = this
        that.$api['planInfoManager.releasePlanInfoCheck']({ planInfoArray: that.selectedRowKeys, checkerSign: 'releasePlanInfo' }).then(res => {
          if (res && !res.success) {
            that.$message({
              message: res.message,
              dangerouslyUseHTMLString: true,
              duration: 5000,
              type: 'warning'
            })
          } else {
            // that.$confirm(`是否统筹审核选中的计划？`, '提示', {
            //   confirmButtonText: '确定',
            //   cancelButtonText: '取消',
            //   type: 'warning'
            // }).then(() => {
              that.commitStatus = '1030'
              that.releaseMenuParams = { status: [that.commitStatus], ids: that.selectedRowKeys }
              that.isCommitVisibleDialog = true
              that.isCommitVisible = true
              that.commitTitle = '统筹审核确认'
              that.commitSave()
          //   }).catch(() => { })
          }
        })
      }
    },
    // 领域计划审核
    distributionPlanAudit () {
      if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
        this.releaseMenuParams = { ids: this.selectedRowKeys }
        let that = this
        that.$api['planInfoManager.releasePlanInfoCheck']({ planInfoArray: that.selectedRowKeys, checkerSign: 'releasePlanInfo' }).then(res => {
          if (res && !res.success) {
            that.$message({
              message: res.message,
               dangerouslyUseHTMLString: true,
              duration: 5000,
              type: 'warning'
            })
          } else {
            // that.$confirm(`是否领域计划审核选中的计划？`, '提示', {
            //   confirmButtonText: '确定',
            //   cancelButtonText: '取消',
            //   type: 'warning'
            // }).then(() => {
              that.commitStatus = '1080'
              that.releaseMenuParams = { status: [that.commitStatus], ids: that.selectedRowKeys }
              that.isCommitVisibleDialog = true
              that.isCommitVisible = true
              that.commitTitle = '领域计划审核确认'
              that.commitSave()
            // }).catch(() => { })
          }
        })
      }
    },
    // 发布审核
    distributionCommit () {
      if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
        this.releaseMenuParams = { ids: this.selectedRowKeys }
        let that = this
        that.$api['planInfoManager.releasePlanInfoCheck']({ planInfoArray: that.selectedRowKeys, checkerSign: 'releasePlanInfo' }).then(res => {
          if (res && !res.success) {
            that.$message({
              message: res.message,
               dangerouslyUseHTMLString: true,
              duration: 5000,
              type: 'warning'
            })
          } else {
            // that.$confirm(`是否发布审核选中的计划？`, '提示', {
            //   confirmButtonText: '确定',
            //   cancelButtonText: '取消',
            //   type: 'warning'
            // }).then(() => {
              that.commitStatus = '1060'
              that.releaseMenuParams = { status: [that.commitStatus], ids: that.selectedRowKeys }
              that.isCommitVisibleDialog = true
              that.isCommitVisible = true
              that.commitTitle = '发布审核确认'
              that.commitSave()
            // }).catch(() => { })
          }
        })
      }
    },
    commitSave () {
      if (this.isCommitVisible) {
        if (this.commitStatus) {
          this.isCommitVisible = false
          this.releaseMenuParams = { status: [this.commitStatus], ids: this.selectedRowKeys }
          let this_ = this
          this_.processDefinitionKeyByCommitStatus = null
          if (this.isBeforehand) {
            this.$api['planInfoManager.commitStatusValidator'](this_.releaseMenuParams).then(res => {
              console.log('&& ', res.result)
              if (res && res.result === true) {
                this_.processDefinitionKeyByCommitStatus = res.processDefinitionKey
                this_.packageNodeInfoVisible = true
                // this_.$nextTick(() => {
                //   this_.$refs.dialogCommit.isfullscreen = true
                // })
                let getPackageNodeInfoParams = {
                  processDefinitionKey: res.processDefinitionKey,
                  ids: this_.selectedRowKeys
                }
                this.$api['planInfoManager.getPackageNodeInfo'](getPackageNodeInfoParams).then(res => {
                  this_.packageNodeInfos = res
                })
              } else if (res && res.result === false && res.isContinue === true) {
                this.commitStatusAction()
              } else {
                let msg = ''
                Object.keys(res).forEach(k => {
                  if (res[k]) {
                    msg = msg + res[k]
                  }
                })
                this_.$message({
                  message: '操作失败！' + msg,
                  type: 'warning'
                })
                this_.closeDialog()
              }
            })
          } else {
            this.commitStatusAction()
          }
        } else {
          this.$message({
            message: '提交目标状态未选择',
            type: 'warning '
          })
        }
      } else if (this.packageNodeInfoVisible) {
        this.nextApproveUserBeforehand(this.processDefinitionKeyByCommitStatus)
      }
    },
    closeSelectApproveUser () {
      this.isSelectApproveUserView = false
      this.$emit('approved', this.formData.taskId)
    },
    commitSelectApproveUser (fullParams) {
      this.$refs.form.submitForm(fullParams, this.saveApi)
      this.closeModal()
    },
    openThirdMenu (record, item) {
      this.thirdMenuParam.planInfoId = record.id
      this.thirdMenuParam.planInfoStatus = record.executeState
      this.thirdMenuParam.taskId = ''
      this.thirdMenuParam.wholeDescribeId = record.wholeDescribeId
      this.thirdMenuParam.createPage = 'compile'
      let selectRecord = []
      selectRecord.push(record)
      this.thirdMenuParam.selectRecord = selectRecord
      this.drawerThirdTitle = record.name
      this.defaultMenu = item
      this.visibleThirdDrawer = true
      console.log('fgfgfgf', this.thirdMenuParam)
    },
    onThirdMenuClose () {
      this.$router.push({ path: this.currentRouterPath })
      this.visibleThirdDrawer = false
      let _this = this
      setTimeout(() => {
        _this.$refs.table.$refs.table.doLayout()
      })
    },
    search (param) {
      if (param && param.recordingTime && param.recordingTime.length === 2) {
        param.createBeginDate = new Date(moment(param.recordingTime[0]).format('YYYY-MM-DD'))
        param.createEndDate = new Date(moment(param.recordingTime[1]).format('YYYY-MM-DD'))
      }
      if (param) {
        this.queryParam = param
      }
      let that = this
      Vue.nextTick(function () {
        that.$refs.table.searchData()
      })
    },
    reSet () {
      let that = this
      Object.keys(that.queryParam).forEach(key => { that.queryParam[key] = null })
      Vue.nextTick(function () {
        that.$refs.table.searchData()
      })
    },
    nextApproveUserBeforehand (processDefinitionKey) {
      let that = this
      nextApproveUserBeforehand.initDataSource(processDefinitionKey, that).then(res1 => {
        if (res1 === true) {
          that.isSelectApproveUserBeforehandView = true
          that.isCommitVisibleDialog = false
        } else {
          that.commitStatusAction()
        }
      })
    },
    closeSelectApproveUserBeforehand () {
      this.isSelectApproveUserBeforehandView = false
    },
    commitSelectApproveUserBeforehand (fullParams) {
      this.releaseMenuParams.beforehandParams = { ...fullParams }
      this.commitStatusAction()
    },
    commitStatusAction () {
      let this_ = this
    this.$confirm(`是否要提交选中的计划？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
    this.$api['planInfoManager.commitStatus'](this_.releaseMenuParams).then(res => {
        this_.closeDialog()
        if (res === undefined) {
          this_.$message({
            message: '操作失败！请检查项目信息是否正确，如团队角色和人员等。',
            type: 'error'
          })
        } else if (!res.approveTime) {
          this_.$message({
            type: 'success',
            message: '提交成功'
          })
        } else {
          /* nextApproveUser.initDataSource(res.approveTime, res.processInstanceIds, this_).then(res1 => {
            if (res1 === true) {
              this_.$confirm(`检测到后一个审批任务，是否手动指定（变更）节点的审批人？`, '操作成功！', {
                confirmButtonText: '手动指定',
                cancelButtonText: '不指定',
                type: 'warning'
              }).then(() => {
                this_.isSelectApproveUserView = true
              }).catch(() => {
              })
            }
          }) */
          this_.$message({
            type: 'success',
            message: '提交成功'
          })
        }
        Vue.nextTick(function () {
          this_.$refs.table.searchData()
        })
      })
      }).catch(() => { })
    },
    updateStatusAction () {
      let this_ = this
      this.$api['planInfoManager.updateStatus'](this_.releaseMenuParams).then(res => {
        this_.closeDialog()
          this_.$message({
            type: 'success',
            message: '提交成功'
          })
        Vue.nextTick(function () {
          this_.$refs.table.searchData()
        })
      })
    },
    processApprovalView (record) { // 查看流程图按钮
      let this_ = this
      if (this_.selectedRowKeys && this_.selectedRowKeys.length === 1) {
        this_.$api['planInfoManager.getProcessDefinitionKeyByStatus']({ executeState: this_.selectedRows[0].executeState, businessId: this_.selectedRowKeys[0] }).then(res => {
          if (res && res.result === true) {
            this_.processDefinitionKey = res.processDefinitionKey
            this_.businessId = res.businessId
            this_.visibleBpmView = true
          } else {
            if (res && res.result === false && res.errorMsg) {
              this_.$message({
                message: res.errorMsg,
                type: 'warning'
              })
            } else {
              this_.$message({
                message: '未知错误',
                type: 'error'
              })
            }
          }
        })
      } else {
        this_.$message({
          message: '只能选择一条进行查看流程图！',
          type: 'warning'
        })
      }
    },
    onVisibleBpmViewClose () {
      this.visibleBpmView = false
      this.businessId = undefined
      this.processDefinitionKey = undefined
    }
  }
}
</script>
