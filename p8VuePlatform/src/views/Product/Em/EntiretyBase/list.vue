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
                   :treeParam="leftTreeParam"
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
                      :selectAllHidden="true"
                      @selection-change="select"
                      >
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
                     @saveSuccess="saveCallback"
                     @close="closeVisible">
        <template #drawer>
          <menu-layout :third-menu-param="thirdMenuParam"
                       :default-menu="defaultMenu" @saveSuccess="closeVisible"></menu-layout>
        </template>
      </common-drawer>
<!--      <select-config v-if="visibleProjectIndexDrawer"-->
<!--                     :visible="visibleProjectIndexDrawer"-->
<!--                     placement="top"-->
<!--                     size="100%"-->
<!--                     @close="onEditProjectClose">-->
<!--      </select-config>
          弹出选择业务范围、来源及类型数据
-->
      <select-config v-if="visibleProjectIndexDrawer"
                     :visible="visibleSelectConfig"
                     :defaultEmData = defaultEmData
                     placement="top"
                     size="100%"
                     @close="onEditProjectClose">
      </select-config>
      <!-- 查看历史审批记录-->
      <common-drawer v-show="approvalDrawer"
                     :visible="approvalDrawer"
                     placement="top"
                     size="100%"
                     @close="onEditProjectClose">
        <template #drawer>
          <approval-record :processInstId="businessId"></approval-record>
        </template>
      </common-drawer>
      <!-- 权限设置-->
      <PermissionSetting v-if="isPermissionSettingView"
                         :isPermissionSettingView="isPermissionSettingView"
                         :record="whoData"
                         @close-permissionSetting="closePermissionSetting">
      </PermissionSetting>
      <selectApproveUser v-if="isSelectApproveUserView"
                         :isSelectApproveUserView="isSelectApproveUserView"
                         :selectUserDataSource="selectUserDataSource"
                         :selectUserFormData="selectUserFormData"
                         @close-modal="closeSelectApproveUser"
                         @commit="commitSelectApproveUser">
      </selectApproveUser>
      <!-- 预先设置审批人-->
      <selectApproveUserBeforehand v-if="isSelectApproveUserBeforehandView"
                                   :isSelectApproveUserBeforehandView="isSelectApproveUserBeforehandView"
                                   :selectUserBeforehandDataSource="selectUserBeforehandDataSource"
                                   :selectUserBeforehandFormData="selectUserBeforehandFormData"
                                   @close-modal="closeSelectApproveUserBeforehand"
                                   @commit="commitSelectApproveUserBeforehand"></selectApproveUserBeforehand>
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
      <!-- 决策事项文件查看-->
      <common-drawer v-if="publishPageSelect"
                     :visible="publishPageSelect"
                     size="100%"
                     title="立项决策文件查看"
                     @close="onVisibleBpmViewClose">
        <template #drawer>
          <select-publish :currEntityId="thirdMenuParam.currEntityId "
                          :thirdMenuParam="thirdMenuParam">
          </select-publish>
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
import Vue from 'vue'
import { P8Table as CommonTable } from '~/index'
import { P8Button as CommonButton } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'
import { P8ListLayout as ListLayout } from '~/index'
import { P8NormalLayout as NormalLayout } from '~/index'
import { P8Tree as CommonTree } from '~/index'
// import { P8Search as SearchFormList } from '~/index'
import { P8MenuLayout as MenuLayout } from '~/index'
import { P8ProcessApproval as ProcessApprovalView } from '~/index'
import PermissionSetting from './Components/PermissionSetting'
import SelectApproveUserBeforehand from '@/views/Framework/BusinessActivity/ProcessApproval/selectApproveUserBeforehand'
import { nextApproveUserBeforehand } from '@/assets/commonJS/BusinessActivity/nextApproveUserBeforehand'
import ApprovalRecord from './Components/ApprovalRecord'
import { Tooltip } from '~/index'
import { nextApproveUser } from '@/assets/commonJS/BusinessActivity/nextApproveUser'
import SelectApproveUser from '@/views/Framework/BusinessActivity/ProcessApproval/selectApproveUser'
import SelectConfig from './Components/FindConfig'
import CreatePublish from './Components/createPublish'
import SelectPublish from './Components/selectPublish'
import ProjectAndSelectPublish from './Components/projectAndSelectPublish'
import moment from 'moment'
export default {
  name: 'projectInfoList',
  components: {
    CreatePublish,
    SelectPublish,
    ProjectAndSelectPublish,
    SelectConfig,
    CommonTable,
    ApprovalRecord,
    CommonButton,
    CommonDrawer,
    // eslint-disable-next-line vue/no-unused-components
    ListLayout,
    NormalLayout,
    CommonTree,
    MenuLayout, // 缺少三级菜单MenuLayout组件
    ProcessApprovalView,
    'el-tooltip': Tooltip,
    SelectApproveUser,
    SelectApproveUserBeforehand,
    PermissionSetting
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
            scopedSlots: { customRender: 'custom' },
            filterable: true, // 列上增加输入框搜索
            iconDisplay: false, // 表头点击搜索图标，出现搜索条件
            filter: {
              val: '',
              defaultExpandAll: true,
              type: 'select',
              optionUrl: {
                api: 'thirdPartInterface.getDic',
                params: { dicType: 'STAND_PROJECT_STATUS' }
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
            align: 'left',
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
            title: '项目密级',
            dataIndex: 'secretGradeDisplay',
            width: 150,
            align: 'center',
            filterable: true, // 列上增加输入框搜索
            iconDisplay: false, // 表头点击搜索图标，出现搜索条件
            filter: {
              val: '',
              type: 'select',
              alias: 'secretGrade',
              optionUrl: {
                api: 'thirdPartInterface.getDic',
                params: { dicType: 'SECRET_LEVEL' }
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
              alias: 'deptName',
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
              alias: 'mainLeadUser',
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
            type: 'multiple',
            defaultValue: [],
            optionUrl: {
              api: 'thirdPartInterface.getDic',
              params: { dicType: 'STAND_PROJECT_STATUS' }
            },
            options: [],
            labelText: '状态', // 控件显示的文本
            fieldName: 'status',
            placeholder: '选择状态'
          },
          {
            type: 'text', // 控件类型
            labelText: '项目名称', // 控件显示的文本
            fieldName: 'productName',
            placeholder: '请输入项目名称'
          },
          // {
          //   type: 'text', // 控件类型
          //   labelText: '项目编号', // 控件显示的文本
          //   fieldName: 'pjCode',
          //   placeholder: '请输入项目编号', // 默认控件的空值文本
          //   fieldEvent: {
          //     click: 'clickEvent(this)'
          //   }
          // },
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
          //   placeholder: '请选择项目分级',
          //   fieldConfig: {
          //     multiple: true
          //   }
          // },
          {
            type: 'treeSelect',
            defaultValue: [],
            labelText: '项目类型',
            fieldName: 'kprojectClassifyId',
            placeholder: '请选择项目类型',
            defaultExpandAll: true,
            multiple: true,
            optionUrl: {
              api: 'ProjectApply.projectClassifyTree',
              params: {},
              // label: 'name',
              value: 'id'
            },
            treeData: []
          }
          // ,
          // {
          //   type: 'multiple',
          //   defaultValue: [],
          //   optionUrl: {
          //     api: 'thirdPartInterface.getDic',
          //     params: { dicType: 'FILED' }
          //   },
          //   options: [],
          //   labelText: '业务范围', // 控件显示的文本
          //   fieldName: 'config',
          //   placeholder: '请选择业务范围',
          //   fieldConfig: {
          //     multiple: true
          //   }
          // }
          // ,
          // {
          //   type: 'treeSelect',
          //   multiple: true,
          //   labelText: '管理部门',
          //   fieldName: 'departmentId',
          //   defaultValue: [],
          //   placeholder: '请选择管理部门',
          //   defaultExpandedKeys: ['1'],
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
      thirdMenuParam: {},
      reportParam: {},
      drawerTitle: '',
      configId: '',
      visibleProjectIndexDrawer: false,
      visibleSelectConfig: false,
      publishPage: false,
      publishPageSelect: false,
      projectAndPublishPageSelect: false,
      visibleProjectcreate: false,
      visibleProjectViewDrawer: false,
      approvalDrawer: false,
      visibleBpmView: false,
      queryParam: {},
      layersParams: {},
      selectedRowKeys: [],
      selectedRows: [],
      multipleSelection: [],
      selectedRow: null,
      emConfig: {
        id: '',
        filedId: '',
        sourceId: '',
        classifyId: '',
        processDefinationOneKey: '',
        processDefinationTwoKey: '',
        processDefinationThreeKey: ''
      },
      tableApi: 'ProjectApply.entiretyManagerList',
      currEntityId: '',
      isView: null,
      showWestTree: { // 是否采用上左右结构
        type: Boolean,
        default: false
      },
      buttonConfig: {
        icon: 'edit'
      },
      defaultMenu: {},
      businessId: '',
      processDefinitionKey: '',
      processDefinitionApi: 'ProjectApply.getProcessDefinitionByBusinessId',
      approvalApi: 'PersonalProcessApproval.approvalInfos',
      isPermissionSettingView: false,
      whoData: undefined,
      selectUserDataSource: [],
      selectUserFormData: {},
      isSelectApproveUserBeforehandView: false,
      selectUserBeforehandDataSource: [],
      selectUserBeforehandFormData: {},
      isBeforehand: true, // 是否预先设置审批人模式
      releaseMenuParams: {

      },
      leftTreeParam: { resources: [] },
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
      isSelectApproveUserView: false,
      selectAllChecked: false, // 全选flag
      designFileName: '',
      defaultEmData: { classifyId: '100601', filedId: '100401', sourceId: '100501' }
    }
  },
  mounted () {
    this.currentRouterPath = this.$route.path
    this.$bus.$off('setProjectEntityId', this.setProjectEntityId)
    this.$bus.$on('setProjectEntityId', this.setProjectEntityId)
    this.$bus.$off('setProjectEntityClose', this.setProjectEntityClose)
    this.$bus.$on('setProjectEntityClose', this.setProjectEntityClose)
    this.leftTreeParam.resources.push(this.$route.meta.id)

    this.$bus.$on('CLOSEDRAWER', () => {
      this.closeVisible()
    })
  },
  computed: {
  },
  methods: {
    // openThirdMenu (record, item) {
    //     console.log(item, 'openThirdMenu')
    //   this.thirdMenuParam.currEntityId = record.id
    //   this.drawerTitle = '修改项目信息'
    //   this.visibleProjectIndexDrawer = true
    //   this.isView = '0'
    //   this.thirdMenuParam.isView = this.isView
    //   this.defaultMenu = item
    // },
    setProjectEntityId (entityId) {
      if (entityId) {
        this.thirdMenuParam.id = entityId
      }
    },
     setProjectEntityClose (isPush) {
      if (isPush) {
        // let that = this
        this.$refs.table.searchData()
        this.$refs.tree.initTreeData()
        this.visibleProjectcreate = false
        // this.getEmConfig(this.thirdMenuParam.id)

        // this.currEntityId = this.thirdMenuParam.id
        // this.$confirm(`是否提交决策形式确认？`, '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   that.releaseMenuParams = {
        //     processDefinitionKey: that.emConfig.processDefinationOneKey,
        //     id: that.thirdMenuParam.id,
        //     startStatus: 'project-create'
        //   }
        //   that.nextApproveUserBeforehand(that.emConfig.processDefinationOneKey)
        // }).catch(() => { })
      }
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
      this.designFileName = '"' + this.selectedRows[0].name + '"项目，决策文件上传'
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
    tableRefresh (param) {
      param
        .then(() => {
          console.log('异步成功后端做的操作')
        })
        .catch(() => {
          console.log('异步失败的操作')
        })
    },
    directRelease () { // 发布
      let record = this.selectedRow
      let that = this
      // that.$api['ProjectApply.releaseCheck']({
      //   entityId: record.id,
      //   checkType: 'projectReleaseCheck'
      // }).then(function (res) {
      //   if (res && (res.success === 'false' || !res.success)) {
      //     that.$message({
      //       message: res.message,
      //       type: 'warning',
      //       dangerouslyUseHTMLString: true,
      //       duration: 5000
      //     })
      //   } else {
          that.$confirm(`是否确定要发布项目？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            that.$api['ProjectApply.directRelease']({
              businessKey: record.id

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
      //   }
      // }).catch(() => {})
    },
    delMenu (record) {
      record = this.selectedRow
      let that = this
      this.$confirm(`是否确定要删除该项目？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$api['ProjectApply.removeProject']({ entityId: record.id })
          .then(function (res) {
            that.$refs.table.queryList()
            that.$refs.tree.initTreeData()
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
    createProject () {
      this.thirdMenuParam.currEntityId = ''
      this.thirdMenuParam.id = ''
      this.drawerTitle = '新建项目'
      this.visibleProjectIndexDrawer = true
      this.isView = '0'
      this.thirdMenuParam.isView = this.isView
      this.thirdMenuParam.currentRouterPath = this.currentRouterPath
    },
    modifyMenu (record) {
      record = this.selectedRow
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
    viewMenu (record) {
      record = this.selectedRow
      this.thirdMenuParam.planInfoId = record.id
      this.thirdMenuParam.configId = record.configId
      this.thirdMenuParam.modifyOrView = 'view'
      this.thirdMenuParam.emData = {}
      this.thirdMenuParam.emData.configId = record.configId
      this.thirdMenuParam.emData.configName = record.configName
      this.thirdMenuParam.emData.filedId = record.filedId
      this.thirdMenuParam.emData.sourceId = record.sourceId
      this.thirdMenuParam.emData.classifyId = record.classifyId
      this.thirdMenuParam.emData.filedName = record.filedName
      this.thirdMenuParam.emData.sourceName = record.sourceName
      this.thirdMenuParam.emData.classifyName = record.classifyName
      this.drawerTitle = '查看项目信息'
      this.visibleProjectcreate = true
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
    findView () {
      let record = this.selectedRow
      let that = this
      that.$api['ProjectApply.getEmConfig']({ entityId: record.id }).then(function (res) {
        that.businessId = record.id
        that.processDefinitionKey = res.processDefinationOneKey
        that.visibleBpmView = true
        }).catch(() => {})
    },
    policyFile (record) {
      record = this.selectedRow
      this.getEmConfig(record.id)
      this.thirdMenuParam.currEntityId = record.id
      this.drawerTitle = '上传立项决策报告'
      this.publishPage = true
    },
    policyFileSelect (record) {
      record = this.selectedRow
      this.getEmConfig(record.id)
      this.thirdMenuParam.currEntityId = record.id
      this.drawerTitle = '查看立项决策文件'
      this.publishPageSelect = true
    },
    projectAndPolicyFileSelect (record) {
      this.getEmConfig(record.id)
      this.thirdMenuParam.currEntityId = record.id
      this.drawerTitle = '查看项目概况和立项决策文件'
      this.projectAndPublishPageSelect = true
    },
    withdraw () {
      let record = this.selectedRow
      let that = this
      that.$api['ProjectApply.getEmConfig']({ entityId: record.id })
        .then(function (res) {
          that.$confirm(`是否确定要撤回流程？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            that.$api['ProjectApply.withdraw']({
              businessKey: record.id,
              processDefinitionKey: that.processDefinitionKey,
              status: record.status
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
        }).catch(() => {})
    },
    releaseMenu (record) {
      record = this.selectedRow
      this.getEmConfig(record.id)
      let that = this
      this.currEntityId = record.id
      this.$confirm(`是否提交决策形式确认？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.releaseMenuParams = {
          processDefinitionKey: this.emConfig.processDefinationOneKey,
          id: record.id,
          startStatus: 'project-create'
        }
        this.nextApproveUserBeforehand(this.emConfig.processDefinationOneKey)
      }).catch(() => { })
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
    nextApproveUserBeforehand (processDefinationKey) {
      let that = this
      nextApproveUserBeforehand.initDataSource(processDefinationKey, that).then(res1 => {
        if (res1 === true) {
          that.isSelectApproveUserBeforehandView = true
        }
      })
      that.$refs.table.queryList()
    },
    closeDrawer () {
      this.visibleProjectIndexDrawer = false
    },
    closeVisible () {
      this.$router.push({ path: this.currentRouterPath })
      this.visibleProjectcreate = false
      if (this.thirdMenuParam.modifyOrView === 'modify') {
        this.$refs.table.searchData()
        this.$refs.tree.initTreeData()
      }
    },
    onEditProjectClose (emData) {
      console.log(emData, 'onEditProjectClose')
      this.visibleProjectIndexDrawer = false
      let filedId = emData.filedId
      let classifyId = emData.classifyId
      let sourceId = emData.sourceId
      this.configId = emData.configId
      this.thirdMenuParam.configId = this.configId
      this.thirdMenuParam.now = moment().format('YYYY-MM-DD')
      this.thirdMenuParam.planInfoId = ''
      this.thirdMenuParam.modifyOrView = 'modify'
      this.thirdMenuParam.filedId = filedId
      this.thirdMenuParam.classifyId = classifyId
      this.thirdMenuParam.sourceId = sourceId
      this.thirdMenuParam.emData = emData
      let that = this
      if (filedId) {
        Vue.nextTick(function () {
          that.visibleProjectcreate = true
        })
      }
    },
    onVisibleBpmViewClose () {
      this.visibleBpmView = false
      this.publishPage = false
      this.publishPageSelect = false
      this.projectAndPublishPageSelect = false
      this.$refs.table.searchData()
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
    saveCallback () {
      this.visibleProjectcreate = false
      this.$refs.table.searchData()
      // this.onEditProjectClose()
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
      let _this = this
      Vue.nextTick(function () {
        _this.$refs.table.queryList()
      })
    },
    reSet () {
      let this_ = this
      Object.keys(this.queryParam).forEach(key => {
        return (this_.queryParam[key] = null)
      })
      this.queryParam.layersParams = Object.assign({}, this.layersParams)
      Vue.nextTick(function () {
        this_.$refs.table.searchData()
      })
    },
    viewAllProject (record) {
      this.thirdMenuParam.currEntityId = record.id
      // this.drawerTitle = "查看项目信息";
      this.visibleProjectIndexDrawer = true
      this.isView = '1'
      this.thirdMenuParam.isView = this.isView
    },
    ApprovalRecord (record) {
      this.drawerTitle = '历史审批记录'
      this.approvalDrawer = true
      this.businessId = record.id
    },
    permissionSetting (record) {
      record = this.selectedRow
      this.isPermissionSettingView = true
      this.whoData = record
    },
    closePermissionSetting () {
      this.isPermissionSettingView = false
    },
    closeSelectApproveUser () {
      this.isSelectApproveUserView = false
    },
    commitSelectApproveUser (fullParams) {
      this.$refs.form.submitForm(fullParams, this.saveApi)
      this.closeModal()
    },

    // todo
    closeSelectApproveUserBeforehand () {
      this.isSelectApproveUserBeforehandView = false
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
    }
  }
}
</script>
