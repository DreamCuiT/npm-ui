<template>
  <list-layout>
    <template #north>
      <common-button :comp='comp'
                     :selectRecords="selectedRows"
                     :button-config='buttonConfig'></common-button>
      <search-form-list ref='search'
                        :dataSource='searchData'
                        @search='search'
                        @re-set='reSet'></search-form-list>
    </template>
    <template #center>
      <div id='table-contain'>
        <common-table ref='table'
                      v-on="{'open-third-menu':openThirdMenu}"
                      :comp='comp'
                      :columns='columns'
                      :params='queryParam'
                      :api='tableApi'
                      :hidden-root-operation='true'
                      :table-refresh='tableRefresh'
                      :menu-state='menuStateObj'
                      :table-config='tableConfig'
                      @selection-change='handleSelectionChange'>
          <template #executeState="{scope}">
            <el-tooltip effect="dark"
                        :content="planStatusDisp(scope.row.executeState)"
                        placement="right">
              <i v-if="!scope.row.whetherRoot"
                 :class="planStatusIcon(scope.row.executeState)"
                 :style="planStatusColor(scope.row.executeState)"></i>
            </el-tooltip>
          </template>
          <template #name="{scope,thirdMenuData}">
            <el-tooltip v-if="scope.row.manageStatus"
                        class="item"
                        effect="dark"
                        :content="scope.row.manageStatusDisplay"
                        placement="right">
              <span class="base-custom-style approve"
                    title="scope.row.manageStatus">审</span>
            </el-tooltip>
            <span v-if="scope.row.leaf"
                  class="underline"
                  @click="drillCol(scope,thirdMenuData)">{{ scope.row.name }}</span>
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </common-table>

        <common-dialog title="提交"
                       :visible="isCommitVisible"
                       @handle-cancel="commitClose"
                       @handle-ok="commitSave"
                       @close="commitClose">
          <template #dialog>
            <div style="padding: 30px;">
              <el-row>
                <el-col :span="4">
                  <span style="height: 30px;line-height: 30px;">提交</span>
                </el-col>
                <el-col :span="20">
                  <el-select v-model="commitStatus"
                             placeholder="请选择1111111111111111">
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
          </template>

        </common-dialog>
        <selectApproveUser v-if="isSelectApproveUserView"
                           :isSelectApproveUserView="isSelectApproveUserView"
                           :selectUserDataSource="selectUserDataSource"
                           :selectUserFormData="selectUserFormData"
                           @close-modal="closeSelectApproveUser"
                           @commit="commitSelectApproveUser"></selectApproveUser>
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
                     @close='onCreateSettingsClose'>
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
                     @close='onPlanViewClose'>
        <template #drawer>
          <plan-view :plan-info-id='planInfoId'
                     @save-success='onPlanViewClose'></plan-view>
        </template>
      </common-drawer>
      <common-drawer v-if="visibleThirdDrawer"
                     :visible="visibleThirdDrawer"
                     placement="top"
                     direction="ttb"
                     :drawerConfig="drawerConfig"
                     size="100%"
                     @close="onThirdMenuClose">
        <template #drawer>
          <menu-layout :third-menu-param='thirdMenuParam'
                       :default-menu="defaultMenu"></menu-layout>
        </template>
      </common-drawer>
    </template>
  </list-layout>
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
import { P8Drawer as CommonDrawer } from '~/index'
import { P8Dialog as CommonDialog } from '~/index'
import { P8Search as SearchFormList } from '~/index'
import { P8Table as CommonTable } from '~/index'
import { P8Button as CommonButton } from '~/index'
import { P8MenuLayout as MenuLayout } from '~/index'
import { P8ListLayout as ListLayout } from '~/index'
import SelectApproveUser from '@/views/Framework/BusinessActivity/ProcessApproval/selectApproveUser'
import LockUnlock from './lockUnlock'
import CreatePlan from './createPlan'
import PlanView from './planInfoView'
import { Tooltip, Select, Option, Row, Col } from '~/index'
import { nextApproveUser } from '@/assets/commonJS/BusinessActivity/nextApproveUser'

const columns = [
  {
    title: '',
    width: 45,
    align: 'center',
    type: 'selection'
  },
  {
    title: '序号',
    type: 'index',
    width: 55,
    align: 'center'
  },
  {
    title: '状态',
    type: 'index',
    dataIndex: 'executeState',
    scopedSlots: { customRender: 'custom' },
    width: 55,
    align: 'center'
  },
  {
    title: '#',
    type: 'index',
    dataIndex: 'treeMenuIcon',
    scopedSlots: { customRender: 'thirdMenu' },
    width: 45,
    align: 'center',
    formatter: function (row) {
      // 控制三级菜单是否显示
      if (row.leaf) {
        return true
      }
      return false
    }
  },
  {
    title: '项目/计划',
    dataIndex: 'name',
    drillable: true,
    scopedSlots: { customRender: 'custom' },
    minWidth: 300,
    align: 'left'
  },
  {
    title: '项目类型',
    width: 150,
    align: 'center',
    dataIndex: 'kprojectClassifyName',
    formatter (row, column, cellValue, index) {
      return cellValue
    }
  },
  // {
  //   title: '项目分级',
  //   width: 120,
  //   align: 'center',
  //   dataIndex: 'projectOrder',
  //   formatter (row, column, cellValue, index) {
  //     return cellValue
  //   }
  // },
  // {
  //   title: '管理部门',
  //   minWidth: 150,
  //   align: 'center',
  //   dataIndex: 'deptName',
  //   formatter (row, column, cellValue, index) {
  //     return cellValue
  //   }
  // },
  {
    title: '计划开始时间',
    width: 120,
    align: 'center',
    dataIndex: 'planBeginDate',
    formatter (row, column, cellValue, index) {
      return cellValue
    }
  },
  {
    title: '计划完成时间',
    width: 120,
    align: 'center',
    dataIndex: 'planEndDate',
    formatter (row, column, cellValue, index) {
      return cellValue
    }
  },
  {
    title: '预测开始时间',
    width: 120,
    align: 'center',
    dataIndex: 'forecastBeginDate',
    formatter (row, column, cellValue, index) {
      return cellValue
    }
  },
  {
    title: '预测完成时间',
    width: 120,
    align: 'center',
    dataIndex: 'forecastEndDate',
    formatter (row, column, cellValue, index) {
      return cellValue
    }
  },
  {
    title: '状态',
    width: 90,
    align: 'center',
    dataIndex: 'executeStateDisplay',
    formatter (row, column, cellValue, index) {
      return cellValue
    }
  },
  {
    title: '创建时间',
    width: 100,
    align: 'center',
    dataIndex: 'createDate',
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

export default {
  name: 'planInfoList',
  components: {
    CommonDrawer,
    CommonDialog,
    SearchFormList,
    CommonTable,
    CommonButton,
    ListLayout,
    SelectApproveUser,
    CreatePlan,
    LockUnlock,
    PlanView,
    MenuLayout,
    'el-tooltip': Tooltip,
    'el-select': Select,
    'el-option': Option,
    'el-row': Row,
    'el-col': Col
  },
  data () {
    return {
      isSelectApproveUserView: false,
      selectUserDataSource: [],
      selectUserFormData: {},
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
        expandIconColumnIndex: 4,
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
      drawerThirdTitle: '',
      planInfoId: '',
      thirdMenuParam: {},
      thirdMenuTitle: '',
      defaultMenu: {},
      drawerTitle: '加锁/解锁',
      queryParam: { mark: 'mark_02' },
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
          placeholder: ['开始日期', '结束日期'],
          fieldConfig: {
            format: 'yyyy-MM-dd'
          }
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
      ]
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
    this.currentRouterPath = this.$route.path
    // 加载计划状态
    let that = this
    that.$api['userManager.dicData']({ dicType: 'EXECUTE_STATE' }).then(function (res) {
      let dataTemp = []
      let statusKey = []
      res.forEach(function (item) {
        let temp = {}
        temp.id = item.value
        temp.name = item.label
        temp.iconKey = 'planStatus-icon-' + item.value
        temp.colorKey = 'planStatus-color-' + item.value
        dataTemp.push(temp)
        statusKey.push('planStatus-icon-' + item.value)
        statusKey.push('planStatus-color-' + item.value)
      })
      that.$api['SystemSettings.getBaseConfigSettings']({ keys: statusKey }).then(function (res) {
        res.settings.forEach(function (item) {
          dataTemp.forEach(function (itemData) {
            if (item.key === itemData.iconKey) {
              itemData.icon = item.value
            }
            if (item.key === itemData.colorKey) {
              itemData.color = item.value
            }
            that.planStatus[itemData.id] = itemData
          })
        })
      })
    })
    // 加载通用gantt操作权限决策，并存入vuex
    that.$api['planInfoManager.loadPlanStatusLimitStrategy']().then(function (res) {
      if (res) {
        that.$store.dispatch('setPlanStatusLockMap', res['plan'])
        that.$store.dispatch('setTaskStatusLockMap', res['task'])
      }
    })
  },
  methods: {
    drillCol (scope, thirdMenuData) {
      console.log(scope, 'scope')
      console.log(thirdMenuData, 'thirdMenuData')
      if (thirdMenuData.length) {
        let planManager = thirdMenuData.filter(o => o.name === 'comprehensiveManager')
        this.openThirdMenu(scope.row, planManager[0])
      }
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
    tableRefresh (param) {
      param.then(() => {
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
      this.planInfoId = record.id
      this.visiblePlanViewDrawer = true
    },
    onPlanViewClose () {
      this.planInfoId = ''
      this.visiblePlanViewDrawer = false
    },
    onCreateSettingsClose () {
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
    modifySettings (record) {
      this.visibleCreatePlanDrawer = true
      this.planInfoId = record.id
      this.$refs.table.searchData()
    },
    removeSettings (record) {
      let that = this
      that.$confirm(`是否要删除该计划？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let type = 'success'
        let msg = '删除成功！'
        that.$api['planInfoManager.removePlanInfo']({ planInfoId: record.id }).then(res => {
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
      that.$api['planInfoManager.commitStatusFilter']({ ids: this.selectedRowKeys }).then(statusArray => {
        that.$api['planInfoManager.getCommitStatus']({ status: statusArray }).then(res => {
          that.commitOptions = res.options
          that.isCommitVisible = true
        })
      })
    },
    commitClose () {
      this.isCommitVisible = false
      this.commitStatus = undefined
    },
    commitSave () {
      let this_ = this
      this.$api['planInfoManager.commitStatus']({ status: [this.commitStatus], ids: this.selectedRowKeys }).then(res => {
        this_.commitClose()
        nextApproveUser.initDataSource(res.approveTime, res.processInstanceIds, this_).then(res1 => {
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
        })
      })
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
      this.thirdMenuParam.createPage = 'compile'
      this.drawerThirdTitle = record.name
      this.defaultMenu = item
      this.visibleThirdDrawer = true
    },
    onThirdMenuClose () {
      this.$router.push({ path: this.currentRouterPath })
      this.visibleThirdDrawer = false
    },
    search (param) {
      if (param && param.recordingTime && param.recordingTime.length === 2) {
        param.createBeginDate = param.recordingTime[0]
        param.createEndDate = param.recordingTime[1]
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
    }
  }
}
</script>
