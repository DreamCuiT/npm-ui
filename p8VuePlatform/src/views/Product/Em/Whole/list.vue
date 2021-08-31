<template>
  <normal-layout>
    <template #north>
      <common-button :comp="comp"
                     :button-config="buttonConfig" :select-records="selectedRows"></common-button>
      <!-- <search-form-list ref="search"
                        :dataSource="searchData"
                        @search="search"
                        @re-set="reSet"></search-form-list> -->
    </template>
    <template #west>
      <common-tree ref="tree"
                   :treeApi="treeApi"
                   :treeParam="queryParam"
                   @select="onSelect"></common-tree>
    </template>
    <template #center>
      <div id="table-contain">
        <common-table ref="table"
                      :comp="comp"
                      :columns="columns"
                      :params="queryParam"
                      :api="tableApi"
                      :showSearchRow="true"
                      :table-Refresh="tableRefresh"
                      @selection-change="select"
                      :pagination="true">
          <template #statusIcon="{scope}">
            <el-tooltip placement="right"
                        :disabled="!scope.row.statusDisplay"
                        :content="scope.row.statusDisplay">
              <i :class="scope.row.statusClass"
                 :style="{color:scope.row.statusColor}"></i>
            </el-tooltip>
          </template>
        </common-table>
      </div>
    </template>
    <template #drawer-panel>
         <common-drawer v-if="visibleProjectcreate"
                     :visible="visibleProjectcreate"
                     placement="top"
                     size="100%"
                     @saveSuccess="onEditProjectClose"
                     @close="closeVisible">
        <template #drawer>
          <index-whole :third-menu-param="thirdMenuParam"
                       @saveSuccess="onEditProjectClose"></index-whole>
        </template>
      </common-drawer>
      <common-drawer v-if="overview"
                     :visible="overview"
                     placement="top"
                     size="100%"
                     @close="onEditProjectClose">
        <template #drawer>
          <whole-view :currEntityId="currEntityId" :thirdMenuParam="thirdMenuParam"></whole-view>
        </template>
      </common-drawer>
      <common-drawer v-if="overview1"
                     :visible="overview1"
                     placement="top"
                     size="100%"
                     @close="onEditProjectClose">
        <template #drawer>
          <whole-view1 :currEntityId="currEntityId" :thirdMenuParam="thirdMenuParam"></whole-view1>
        </template>
      </common-drawer>
      <common-drawer v-if="overview2"
                     :visible="overview2"
                     placement="top"
                     size="100%"
                     @close="onEditProjectClose">
        <template #drawer>
          <whole-view2 :currEntityId="currEntityId" :thirdMenuParam="thirdMenuParam"></whole-view2>
        </template>
      </common-drawer>
      <!-- 立项信息-->
      <common-drawer v-if="information"
                     :visible="information"
                     placement="top"
                     size="100%"
                     @close="onEditProjectClose">
        <template #drawer>
          <create-update :currEntityId="currEntityId"
                         :whoData="whoData"
                         :thirdMenuParam="thirdMenuParam"></create-update>
        </template>
      </common-drawer>
      <common-drawer v-if="informationView"
                     :visible="informationView"
                     placement="top"
                     size="100%"
                     @close="onEditProjectClose">
        <template #drawer>
          <create-update-view :currEntityId="currEntityId"
                         :whoData="whoData"
                         :thirdMenuParam="thirdMenuParam"></create-update-view>
        </template>
      </common-drawer>
      <common-drawer v-if="projectPlan"
                     :visible="projectPlan"
                     placement="top"
                     :title="drawerTitle"
                     size="100%"
                     @close="onEditProjectClose">
        <template #drawer>
          <project-plan :currEntityId="currEntityId"></project-plan>
        </template>
      </common-drawer>
      <common-drawer v-show="approvalDrawer"
                     :visible="approvalDrawer"
                     placement="top"
                     size="100%"
                     @close="onEditProjectClose">
        <template #drawer>
          <approval-record :processInstId="businessId"></approval-record>
        </template>
      </common-drawer>
      <selectApproveUser v-if="isSelectApproveUserView"
                         :isSelectApproveUserView="isSelectApproveUserView"
                         :selectUserDataSource="selectUserDataSource"
                         :selectUserFormData="selectUserFormData"
                         @close-modal="closeSelectApproveUser"
                         @commit="commitSelectApproveUser">
      </selectApproveUser>
      <selectApproveUserBeforehand v-if="isSelectApproveUserBeforehandView"
                                   :isSelectApproveUserBeforehandView="isSelectApproveUserBeforehandView"
                                   :selectUserBeforehandDataSource="selectUserBeforehandDataSource"
                                   :selectUserBeforehandFormData="selectUserBeforehandFormData"
                                   @close-modal="closeSelectApproveUserBeforehand"
                                   @commit="commitSelectApproveUserBeforehand"></selectApproveUserBeforehand>
      <PermissionSetting v-if="isPermissionSettingView"
                         :isPermissionSettingView="isPermissionSettingView"
                         :record="whoData"
                         @close-permissionSetting="closePermissionSetting">
      </PermissionSetting>
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
      <!-- 决策事项文件维护-->
      <common-drawer v-if="publishPage"
                     :visible="publishPage"
                     size="100%"
                     :title= "designFileName"
                     :beforeClose = "onVisibleBuildBpmViewClose"
                     @close="onVisibleBpmViewClose">
        <template #drawer>
          <create-publish :currEntityId="thirdMenuParam.currEntityId "
                          :thirdMenuParam="thirdMenuParam">
          </create-publish>
        </template>
      </common-drawer>
      <!-- 项目概况和决策事项文件查看-->
      <common-drawer v-if="projectAndPublishPageSelect"
                     :visible="projectAndPublishPageSelect"
                     size="100%"
                     @close="onVisibleBpmViewClose">
        <template #drawer>
          <project-and-select-publish :currEntityId="thirdMenuParam.currEntityId "
                                      :thirdMenuParam="thirdMenuParam" @close-drawer="projectAndPublishPageSelect = false">
          </project-and-select-publish>
        </template>
      </common-drawer>
    </template>
  </normal-layout>
</template>

<script>

import { nextApproveUserBeforehand } from '@/assets/commonJS/BusinessActivity/nextApproveUserBeforehand'
import SelectApproveUserBeforehand from '@/views/Framework/BusinessActivity/ProcessApproval/selectApproveUserBeforehand'
import { nextApproveUser } from '@/assets/commonJS/BusinessActivity/nextApproveUser'
import { P8Table as CommonTable } from '~/index'
import { P8Button as CommonButton } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'
import { P8ListLayout as ListLayout } from '~/index'
import { P8NormalLayout as NormalLayout } from '~/index'
import { P8Tree as CommonTree } from '~/index'
import { P8MenuLayout as MenuLayout } from '~/index'
import { P8ProcessApproval as ProcessApprovalView } from '~/index'
import indexWhole from '../../Em/EntiretyBase/indexWholeDescribeEntry'
import WholeView from '../../Em/EntiretyBase/Components/formList/researchModuleView'
import WholeView1 from '../../Em/EntiretyBase/Components/formList/MCIntegrationModuleView'
import WholeView2 from '../../Em/EntiretyBase/Components/formList/techInnovationModuleView'
import CreateUpdate from './Components/createOrUpdate'
import CreateUpdateView from './ComponentsView/createOrUpdate'
import ProjectPlan from './Components/projectPlan'
import { Tooltip } from '~/index'
import CreatePublish from './.././EntiretyBase/Components/createPublish'
import PermissionSetting from './.././EntiretyBase/Components/PermissionSetting'
export default {
  name: 'projectInfoList',
  components: {
    CommonTable,
    CommonButton,
    CreatePublish,
    PermissionSetting,
    CommonDrawer,
    WholeView,
    indexWhole,
    WholeView1,
    WholeView2,
    CreateUpdate,
    CreateUpdateView,
    SelectApproveUserBeforehand,
    // eslint-disable-next-line vue/no-unused-components
    ListLayout,
    ProjectPlan,
    NormalLayout,
    CommonTree,
    // SearchFormList,
    // eslint-disable-next-line vue/no-unused-components
    MenuLayout, // 缺少三级菜单MenuLayout组件
    // eslint-disable-next-line vue/no-unused-components
    ProcessApprovalView,
    'el-tooltip': Tooltip
  },
  props: {
    columns: {
      type: Array,
      default: function () {
        return [
          {
            title: '',
            width: 35,
            type: 'selection'
          },
          {
            title: '序号',
            type: 'index',
            minWidth: 55,
            align: 'center'
          },
          {
            title: '状态',
            dataIndex: 'statusIcon',
            align: 'center',
            width: 45,
            scopedSlots: { customRender: 'custom' }
          },
          // {
          //   title: '业务来源',
          //   dataIndex: 'sourceName',
          //   width: 100,
          //   align: 'center',
          //   filterable: true, // 列上增加输入框搜索
          //   iconDisplay: false, // 表头点击搜索图标，出现搜索条件
          //   filter: {
          //     val: '',
          //     type: 'select',
          //     optionUrl: {
          //       api: 'thirdPartInterface.getDic',
          //       params: { dicType: 'SOURCE' }
          //     }
          //   }
          // },
          // {
          //   title: '业务范围',
          //   dataIndex: 'filedName',
          //   width: 100,
          //   align: 'center',
          //   filterable: true, // 列上增加输入框搜索
          //   iconDisplay: false, // 表头点击搜索图标，出现搜索条件
          //   filter: {
          //     val: '',
          //     type: 'select',
          //     optionUrl: {
          //       api: 'thirdPartInterface.getDic',
          //       params: { dicType: 'FILED' }
          //     }
          //   }
          // },
          // {
          //   title: '业务类型',
          //   dataIndex: 'classifyName',
          //   width: 200,
          //   align: 'center',
          //   filterable: true, // 列上增加输入框搜索
          //   iconDisplay: false, // 表头点击搜索图标，出现搜索条件
          //   filter: {
          //     val: '',
          //     type: 'select',
          //     optionUrl: {
          //       api: 'thirdPartInterface.getDic',
          //       params: { dicType: 'CLASSFIY' }
          //     }
          //   }
          // },
          {
            title: '项目类型',
            dataIndex: 'kprojectClassifyname',
            width: 150,
            align: 'center',
            filterable: true, // 列上增加输入框搜索
            iconDisplay: false, // 表头点击搜索图标，出现搜索条件
            filter: {
              val: '',
              defaultExpandAll: true,
              type: 'treeSelect',
              optionUrl: {
                api: 'ProjectApply.projectClassifyTree',
                params: {},
                // label: 'name',
                value: 'id'
              }
            }
          },
          {
            title: '型号代号',
            dataIndex: 'modelCode',
            width: 130,
            align: 'center',
            filterable: true, // 列上增加输入框搜索
            iconDisplay: false, // 表头点击搜索图标，出现搜索条件
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
            title: '产品代号',
            dataIndex: 'productCode',
            width: 130,
            align: 'center',
            filterable: true, // 列上增加输入框搜索
            iconDisplay: false, // 表头点击搜索图标，出现搜索条件
            filter: {
              val: '',
              type: 'text'
            }
          },
          // {
          //   title: '项目编号',
          //   dataIndex: 'pjCode',
          //   width: 120,
          //   align: 'center',
          //   filterable: true, // 列上增加输入框搜索
          //   iconDisplay: false, // 表头点击搜索图标，出现搜索条件
          //   filter: {
          //     val: '',
          //     type: 'text'
          //   }
          // },
          {
            title: '项目名称',
            dataIndex: 'name',
            minWidth: 300,
            align: 'left',
            filterable: true, // 列上增加输入框搜索
            iconDisplay: false, // 表头点击搜索图标，出现搜索条件
            filter: {
              val: '',
              type: 'text'
            }
          },
          {
            title: '项目密级',
            dataIndex: 'secretGradeDisplay',
            width: 150,
            align: 'center',
            filterable: true, // 列上增加输入框搜索
            iconDisplay: false, // 表头点击搜索图标，出现搜索条件
            filter: {
              val: '',
              type: 'select',
              optionUrl: {
                api: 'thirdPartInterface.getDic',
                params: { dicType: 'TASK_SOURCE' }
              }
            }
          },
          {
            title: '概算总额(万元)',
            dataIndex: 'totalBudget',
            minWidth: 150,
            align: 'left',
            filterable: true, // 列上增加输入框搜索
            iconDisplay: false, // 表头点击搜索图标，出现搜索条件
            filter: {
              val: '',
              type: 'text'
            }
          },
          {
            title: '项目来源',
            dataIndex: 'sourceDisplay',
            width: 150,
            align: 'center',
            filterable: true, // 列上增加输入框搜索
            iconDisplay: false, // 表头点击搜索图标，出现搜索条件
            filter: {
              val: '',
              type: 'select',
              optionUrl: {
                api: 'thirdPartInterface.getDic',
                params: { dicType: 'TASK_SOURCE' }
              }
            }
          },
          // {
          //   title: '项目分级',
          //   dataIndex: 'projectOrderDisplay',
          //   width: 100,
          //   align: 'center'
          // },
          // {
          //   title: '管理部门',
          //   dataIndex: 'departmentName',
          //   formatter: function (row) {
          //     if (row.pdepartmentName) {
          //       return row.pdepartmentName + '-' + row.departmentName
          //     } else {
          //       return row.departmentName
          //     }
          //   },
          //   width: 150,
          //   align: 'center'
          // },
          {
            title: '项目开始时间',
            dataIndex: 'beginTime',
            width: 150,
            align: 'center',
            filterable: true, // 列上增加输入框搜索
            iconDisplay: false, // 表头点击搜索图标，出现搜索条件
            filter: {
              val: '',
              type: 'datetime',
              fieldConfig: {
                valueFormat: 'yyyy-MM-dd'
              }
            }
          },
          {
            title: '项目完成时间',
            dataIndex: 'endTime',
            width: 150,
            align: 'center',
            filterable: true, // 列上增加输入框搜索
            iconDisplay: false, // 表头点击搜索图标，出现搜索条件
            filter: {
              val: '',
              type: 'datetime',
              fieldConfig: {
                valueFormat: 'yyyy-MM-dd'
              }
            }
          },
          {
            title: '创建人',
            dataIndex: 'userName',
            width: 120,
            align: 'center',
            filterable: true, // 列上增加输入框搜索
            iconDisplay: false, // 表头点击搜索图标，出现搜索条件
            filter: {
              val: '',
              type: 'text'
            }
          },
          {
            title: '主承部门',
            dataIndex: 'mainDeptName',
            width: 150,
            align: 'center',
            filterable: true, // 列上增加输入框搜索
            iconDisplay: false, // 表头点击搜索图标，出现搜索条件
            filter: {
              val: '',
              defaultExpandAll: true,
              type: 'treeSelect',
              optionUrl: {
                api: 'ProjectApply.deptTree',
                params: {},
                // label: 'name',
                value: 'id'
              }
            }
          },
          {
            title: '主管所领导',
            dataIndex: 'mainLeadUserName',
            width: 150,
            align: 'center',
            filterable: true, // 列上增加输入框搜索
            iconDisplay: false, // 表头点击搜索图标，出现搜索条件
            filter: {
              val: '',
              type: 'text'
            }
          },
          {
            title: '申请日期',
            dataIndex: 'applyTime',
            width: 150,
            align: 'center',
            filterable: true, // 列上增加输入框搜索
            iconDisplay: false, // 表头点击搜索图标，出现搜索条件
            filter: {
              val: '',
              type: 'datetime',
              fieldConfig: {
                valueFormat: 'yyyy-MM-dd'
              }
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
            labelText: '项目编码', // 控件显示的文本
            fieldName: 'pjCode',
            placeholder: '请输入项目编码', // 默认控件的空值文本
            fieldEvent: {
              click: 'clickEvent(this)'
            }
          },
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
          //   placeholder: '请选择项目分级'
          // },
          {
            type: 'treeSelect',
            defaultValue: [],
            labelText: '项目类型',
            fieldName: 'kprojectClassifyId',
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
            defaultValue: [],
            labelText: '所属型号',
            fieldName: 'modelInformationId',
            placeholder: '请选择所属型号',
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
          //   multiple: true,
          //   labelText: '管理部门',
          //   fieldName: 'departmentId',
          //   defaultValue: [],
          //   defaultExpandedKeys: ['1'],
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
      comp: this,
      selectType: 'single',
      treeApi: 'commonProjectTree.projectTree',
      // treeApi: 'ProjectApply.fieldModelTreeWhole',
      currentRouterPath: '',
      thirdMenuParam: {
        id: ''
      },
      drawerTitle: '',
      isSelectApproveUserBeforehandView: false,
      visibleProjectIndexDrawer: false,
      visibleProjectViewDrawer: false,
      isSelectApproveUserView: false,
      isPermissionSettingView: false,
      approvalDrawer: false,
      informationView: false,
      visibleProjectcreate: false,
      information: false,
      projectAndPublishPageSelect: false,
      publishPageSelect: false,
      overview: false,
      overview1: false,
      overview2: false,
      publishPage: false,
      projectPlan: false,
      visibleBpmView: false,
      queryParam: {},
      layersParams: {},
      tableApi: 'ProjectApply.projectList',
      currEntityId: '',
      designFileName: '',
      isView: null,
      selectedRows: [],
      selectedRowKeys: [],
      buttonConfig: {
        icon: 'edit'
      },
      emConfig: {
        id: '',
        filedId: '',
        sourceId: '',
        classifyId: '',
        releaseMenuParams: {},
        processDefinationOneKey: '',
        processDefinationTwoKey: '',
        processDefinationThreeKey: ''
      },
      defaultMenu: {},
      businessId: '',
      whoData: undefined,
      selectUserFormData: {},
      selectUserDataSource: [],
      selectUserBeforehandDataSource: [],
      selectUserBeforehandFormData: {},
      processDefinitionKey: 'project-release-approval-process',
      processDefinitionApi: 'ProjectApply.getProcessDefinitionByBusinessId',
      approvalApi: 'PersonalProcessApproval.approvalInfos'
    }
  },
  created () {
    this.queryParam.status = ['2205', '2206', '2209', '2210', '2211']
    let resourcesId = this.$route.meta.id
    this.queryParam.resources = new Array(resourcesId)
  },
  mounted () {
    this.currentRouterPath = this.$route.path
    this.$bus.$off('setProjectEntityClose', this.setProjectEntityClose)
    this.$bus.$on('setProjectEntityClose', this.setProjectEntityClose)
  },
  computed: {
  },
  methods: {
    setProjectEntityClose (isPush) {
      this.visibleProjectcreate = false
      if (isPush) {
        this.implementRelease()
      }
      this.$refs.table.queryList()
      this.$refs.tree.initTreeData()
    },
    withdrawImplementRelease (record) {
      let that = this
      record = this.selectedRow
      this.getEmConfig(record.id)
      this.$confirm(`是否确定要撤回立项实施发布？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$api['ProjectApply.withdrawImplementRelease']({
          processDefinitionKey: this.emConfig.processDefinationThreeKey,
          businessKey: record.id,
          status: record.status
        }).then(function (res) {
          if (res && res.result) {
            that.$refs.table.queryList()
            that.$message({
              message: '操作成功',
              type: 'success'
            })
          } else if (res && !res.result) {
            that.$message({
              message: res.errorMsg,
              type: 'error'
            })
          }
        }).catch(function (error) {
            console.log(error)
        })
      }).catch(() => { })
    },
    projectAndPolicyFileSelect (record) {
      this.getEmConfig(record.id)
      this.thirdMenuParam.currEntityId = record.id
      this.drawerTitle = '查看项目概况和立项决策文件'
      this.projectAndPublishPageSelect = true
    },
    policyFile (record) {
      record = this.selectedRow
      this.getEmConfig(record.id)
      this.thirdMenuParam.currEntityId = record.id
      this.drawerTitle = '上传立项决策报告'
      this.publishPage = true
    },
    onVisibleBuildBpmViewClose (done) {
      let that = this
      that.$api['PaReport.getReportList']({ wholeId: this.thirdMenuParam.currEntityId, page: { current: 1, size: 13, orders: [] }
      }).then(res => {
        let a = false
        let b = false
        res.records.forEach(function (item, index) {
          if (item.classifyId === '1003001') {
            a = true
          }
          if (item.classifyId === '1003002') {
            b = true
          }
        })
        if (a && b) {
          done()
        } else {
          that.$confirm(`决策报告与所务会清抄未提交完整，是否退出编辑？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            done()
          }).catch(() => { })
        }
      })
    },
    onVisibleBpmViewClose () {
      this.visibleBpmView = false
      this.publishPage = false
      this.publishPageSelect = false
      this.projectAndPublishPageSelect = false
      this.$refs.table.queryList()
    },
    permissionSetting (record) {
      record = this.selectedRow
      this.isPermissionSettingView = true
      this.whoData = record
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
    onSelect (node) {
      let me = node
      if (me.layersParams) {
        this.layersParams = me.layersParams
        this.queryParam.layersParams = Object.assign({}, me.layersParams)
      } else {
        this.layersParams = {}
      }
      this.$refs.table.queryList()
    },
    informationMenu () {
      this.whoData = this.selectedRow
      this.currEntityId = this.whoData.id
      this.thirdMenuParam.id = this.whoData.id
      this.thirdMenuParam.cbbId = this.whoData.cbbId
      this.thirdMenuParam.patentId = this.whoData.patentId
      this.status = this.whoData.status
      this.drawerTitle = '立项信息'
      this.information = true
    },
    closeVisible () {
      this.$router.push({ path: this.currentRouterPath })
      this.visibleProjectcreate = false
    },
    viewWholeMenu () {
      this.whoData = this.selectedRow
      this.currEntityId = this.selectedRow.id
      this.drawerTitle = '查看项目信息'
      this.informationView = true
    },
    updateWholeMenu () {
      let record = this.selectedRow
      this.thirdMenuParam.id = record.id
      this.thirdMenuParam.planInfoId = record.id
      this.thirdMenuParam.configId = record.configId
      this.thirdMenuParam.modifyOrView = 'modify'
      this.thirdMenuParam.emData = {}
      this.thirdMenuParam.emData.configId = record.configId
      this.thirdMenuParam.emData.configName = record.configName
      this.thirdMenuParam.emData.filedId = record.filedId
      this.thirdMenuParam.emData.sourceId = record.filedId
      this.thirdMenuParam.emData.classifyId = record.classifyId
      this.thirdMenuParam.emData.filedName = record.filedName
      this.thirdMenuParam.emData.sourceName = record.sourceName
      this.thirdMenuParam.emData.classifyName = record.classifyName
      this.visibleProjectcreate = true
    },
    wholePlan (record) {
      record = this.selectedRow
      this.currEntityId = record.id
      this.drawerTitle = '项目策划文档'
      this.projectPlan = true
    },
    finishMenu (record) {
      record = this.selectedRow
      let that = this
      this.$confirm(`是否确定要完成该项目？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$api['ProjectApply.complete']({
          processDefinitionKey: 'project-release',
          id: record.id,
          status: record.status
        }).then(function (res) {
          that.$refs.table.queryList()
          that.$message({
            message: '操作成功',
            type: 'success'
          })
        }).catch(function (error) {
          console.log(error)
        })
      }).catch(() => { })
    },
    select (val) {
      if (this.selectType === 'single') {
        if (val.length >= 2) {
          // 删除索引为0的
          // console.log(val.splice(0,val.length-1),'被删除的')
          let arrays = val.splice(0, val.length - 1)
          arrays.forEach(row => {
            this.$refs.table.$refs.table.toggleRowSelection(row) // 除了当前点击的，其他的全部取消选中
          })
        }
      }
      this.selectedRows = val
      this.selectedRow = val[0]
    },
    findView (record) {
      let that = this
      record = this.selectedRow

      that.$api['ProjectApply.getEmConfig']({ entityId: record.id })
        .then(function (res) {
          that.processDefinitionKey = res.processDefinationThreeKey
          that.visibleBpmView = true
          that.businessId = record.id
        }).catch(function (error) {
          console.log(error)
        })
    },
    closeDrawer () {
      this.visibleProjectIndexDrawer = false
    },
    onEditProjectClose () {
      this.$router.push({ path: this.currentRouterPath })
      this.overview = false
      this.overview1 = false
      this.overview2 = false
      this.information = false
      this.projectPlan = false
      this.informationView = false
      this.visibleProjectcreate = false
      this.$refs.table.queryList()
    },
    search (param) {
      /* if (param) {
        Object.keys(param).map(function (key) {
          if (param[key] instanceof Array && param[key].length > 0) {
            param[key] = param[key].join(',')
          }
        })
      } */
      let newParams = { ...this.queryParam, ...param }
      // 项目类别IDthis.queryParam = newParams
      this.queryParam = newParams
      this.queryParam.status = ['2205', '2206', '2209', '2210', '2211']
    },
    reSet () {
      let this_ = this
      Object.keys(this.queryParam).forEach(key => {
        return (this_.queryParam[key] = null)
      })
      this.queryParam.layersParams = Object.assign({}, this.layersParams)
      this.queryParam.status = ['2205', '2206', '2209', '2210', '2211']
    },
    viewAllProject (record) {
      this.thirdMenuParam.currEntityId = record.id
      // this.drawerTitle = "查看项目信息";
      this.visibleProjectIndexDrawer = true
      this.isView = '1'
      this.thirdMenuParam.isView = this.isView
    },
    getEmConfig (entityId) {
      let that = this
      that.$api['ProjectApply.getEmConfig']({ entityId: entityId })
              .then(function (res) {
                let data = res
                that.emConfig.id = data.id
                that.emConfig.filedId = data.filedId
                that.emConfig.sourceId = data.sourceId
                that.emConfig.classifyId = data.classifyId
                that.emConfig.processDefinationOneKey = data.processDefinationOneKey
                that.emConfig.processDefinationTwoKey = data.processDefinationTwoKey
                that.emConfig.processDefinationThreeKey = data.processDefinationThreeKey
                that.emConfig = Object.assign({}, that.emConfig)
              })
              .catch(function (error) {
                console.log(error)
              })
    },
    nextApproveUserBeforehand (processDefinationThreeKey) {
      let that = this
      nextApproveUserBeforehand.initDataSource(processDefinationThreeKey, that).then(res1 => {
        if (res1 === true) {
          that.isSelectApproveUserBeforehandView = true
        }
      })
      that.$refs.table.queryList()
    },
    directRelease () {
      let record = this.selectedRow
      let that = this
      that.$api['ProjectApply.releaseCheck']({
        entityId: record.id,
        checkType: 'projectReleaseCheck'
      }).then(function (res) {
        if (res && (res.success === 'false' || !res.success)) {
          that.$message({
            message: res.message,
            type: 'warning',
            dangerouslyUseHTMLString: true,
            duration: 5000
          })
        } else {
          that.$confirm(`是否确定要直接发布项目？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            that.$api['ProjectApply.directRelease']({
              businessKey: record.id,
              startStatus: 'released'

            }).then(function (res) {
              if (res.errorMsg) {
                that.$message({
                  message: res.errorMsg,
                  type: 'error'
                })
              } else {
                that.$message({
                  message: '操作成功',
                  type: 'success'
                })
              }
              that.$refs.table.queryList()
            }).catch(() => {})
          }).catch(() => { })
        }
      }).catch(() => {})
    },
    implementRelease () {
      let that = this
      let record = that.selectedRow
      let teamCount = record.teamCount
      if (teamCount === 0) {
        that.$message({
            message: '请先创建项目团队后再发布项目！',
            type: 'warning'
          })
      } else {
        that.$api['ProjectApply.releaseCheck']({
          entityId: record.id,
          checkType: 'projectReleaseCheck'
        }).then(function (res) {
          if (res && (res.success === 'false' || !res.success)) {
            that.$message({
              message: res.message,
              type: 'warning',
              dangerouslyUseHTMLString: true,
              duration: 5000
            })
          } else {
            that.getEmConfig(record.id)
            that.processDefinitionKey = that.emConfig.processDefinationThreeKey
            that.currEntityId = record.id
            that.$confirm(`是否确定要提交立项实施发布？`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              that.releaseMenuParams = {
                processDefinitionKey: that.emConfig.processDefinationThreeKey,
                id: record.id,
                startStatus: 'project-decision'
              }
              that.nextApproveUserBeforehand(that.emConfig.processDefinationThreeKey)
            }).catch(() => { })
          }
        }).catch(() => {})
      }
    },
    commitSelectApproveUser (fullParams) {
      this.$refs.form.submitForm(fullParams, this.saveApi)
      this.closeModal()
    },
    closeSelectApproveUserBeforehand () {
      this.isSelectApproveUserBeforehandView = false
    },
    closeSelectApproveUser () {
      this.isSelectApproveUserView = false
    },
    closePermissionSetting () {
      this.isPermissionSettingView = false
    },
    commitSelectApproveUserBeforehand (fullParams) {
      let that = this
      this.releaseMenuParams.beforehandParams = { ...fullParams }
      this.$api['ProjectApply.startProcessByPocessDefinitionKey']({ userMap: this.releaseMenuParams }).then(function (res) {
        that.$refs.table.queryList()
        that.$message({
          message: '操作成功',
          type: 'success'
        })
      }).catch(function (error) {
        console.error(error)
      })
      that.isSelectApproveUserBeforehandView = false
    },
    nextApproveUser (res) {
      let that = this
      nextApproveUser.initDataSource(res.approveTime, res.processInstanceIds, that).then(res1 => {
        if (res1 === true) {
          that.$confirm(`检测到后一个审批任务，是否手动指定（变更）节点的审批人？`, '操作成功！', {
            confirmButtonText: '手动指定',
            cancelButtonText: '不指定',
            type: 'warning'
          }).then(() => {
            that.isSelectApproveUserView = true
          }).catch(() => {
          })
        }
      })
      that.$refs.table.queryList()
    },
    ApprovalRecord (record) {
      this.drawerTitle = '历史审批记录'
      this.approvalDrawer = true
      this.businessId = record.id
    }
  }
}
</script>
