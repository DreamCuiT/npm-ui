<template>
  <list-layout :headerVisible="headerVisible">
    <template #center>
      <div id='table-contain'>
        <!--去掉全选控制 :disabledCheckAll="approvalResult && approvalResult === '1'" -->
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
                      :flex="tableFlex"
                      @select-all="selectAll"
                      @selection-change='handleSelectionChange'>
          <template #name="{scope,thirdMenuData}">
            <span v-if="scope.row.leaf"
                  class="underline"  @click="drillCol(scope,thirdMenuData)"
                  >{{ scope.row.name }}</span>
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </common-table>
        <common-drawer v-if="visibleThirdDrawer"
                       :visible="visibleThirdDrawer"
                       placement="top"
                       direction="ttb"
                       :drawerConfig="drawerConfig"
                       size="100%"
                       :isNeedCustomDrawerClass="false"
                       @close="onThirdMenuClose">
          <template #drawer>
            <PlanGanttView
                    :planInfoId="thirdMenuParam.planInfoId" :ganttLayoutFirstWidth="ganttLayoutFirstWidth"
            ></PlanGanttView>
          </template>
        </common-drawer>
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
  </list-layout>
</template>

<style lang="scss" scoped>
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
    margin-left: -15px;
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
import { P8MenuLayout as MenuLayout } from '~/index'
import { P8Table as CommonTable } from '~/index'
import PlanGanttView from './planGanttView'
import { P8ListLayout as ListLayout } from '~/index'
import SelectApproveUser from '@/views/Framework/BusinessActivity/ProcessApproval/selectApproveUser'
import SelectApproveUserBeforehand from '@/views/Framework/BusinessActivity/ProcessApproval/selectApproveUserBeforehand'
import { nextApproveUserBeforehand } from '@/assets/commonJS/BusinessActivity/nextApproveUserBeforehand'

export default {
  name: 'planInfoList',
  props: {
    taskId: {
      type: String,
      default: null
    },
    businessId: {
      type: String,
      default: null
    },
    approvalResult: { // 审批结果: '1'-通过 / '0'-驳回
      type: String,
      default: null
    },
    tableFlex: {
        type: Number,
        default: 160
    },
    headerVisible: {
        type: Boolean,
        default: true
    },
    filterTemplateData: {
        type: Object,
        default: () => {}
    },
    compType: {
      type: String
    },
    approveData: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    CommonTable,
    ListLayout,
    SelectApproveUser,
    CommonDrawer,
    // eslint-disable-next-line vue/no-unused-components
    MenuLayout,
    PlanGanttView,
    SelectApproveUserBeforehand

  },
  data () {
    const columns = [
      {
        title: '',
        width: 35,
        type: 'selection',
        selectable: (row, index) => {
          if (this.compType !== 'approvalHistoryView') {
            return true
          } else {
            return false
          }
        }
      },
      {
        title: '',
        type: 'index',
        isshow: false,
        dataIndex: 'executeState',
        width: 60
      },
      {
        title: '项目/计划',
        dataIndex: 'name',
        drillable: true,
        scopedSlots: { customRender: 'custom' },
        // fixed: 'left',
        minWidth: 300
      },
      {
        title: '项目类型',
        width: 150,
        dataIndex: 'kprojectClassifyName',
        align: 'center',
        formatter (row, column, cellValue, index) {
          return cellValue
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
      },
      {
        title: '计划完成时间',
        width: 120,
        dataIndex: 'planEndDate',
        align: 'center',
        formatter (row, column, cellValue, index) {
          return cellValue
        }
      },
      {
        title: '预测开始时间',
        width: 120,
        dataIndex: 'forecastBeginDate',
        align: 'center',
        formatter (row, column, cellValue, index) {
          return cellValue
        }
      },
      {
        title: '预测完成时间',
        width: 120,
        dataIndex: 'forecastEndDate',
        align: 'center',
        formatter (row, column, cellValue, index) {
          return cellValue
        }
      },
      {
        title: '状态',
        width: 70,
        dataIndex: 'executeStateDisplay',
        align: 'center',
        formatter (row, column, cellValue, index) {
          return cellValue
        }
      },
      {
        title: '领域',
        align: 'center',
        dataIndex: 'dicName',
        width: 150
      },
      {
        title: '创建时间',
        width: 100,
        dataIndex: 'createDate',
        align: 'center',
        formatter (row, column, cellValue, index) {
          return cellValue
        }
      }
    ]
    return {
      ganttLayoutFirstWidth: document.documentElement.clientWidth * 0.9,
      visibleBpmView: false,
      processDefinitionKey: '',
      isSelectApproveUserView: false,
      selectUserDataSource: [],
      selectUserFormData: {},
      statusName: 'planStatus',
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
      dialogHeight: 200,
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
      drawerThirdTitle: '',
      planInfoId: '',
      thirdMenuParam: {},
      thirdMenuTitle: '',
      defaultMenu: {},
      drawerTitle: '加锁/解锁',
      queryParam: { taskId: this.taskId, businessId: this.businessId, filterTemplateData: this.filterTemplateData, compType: this.compType },
      tableApi: 'planInfoManager.businessTreeListData',
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
      ],
      selectAllChecked: false // 全选flag
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
  watch: {
    approvalResult (val) {
      if (this.selectedRowKeys.length > 0) {
        return
      }
      if (val === '1') {
        this.$refs.table.$refs.table.clearSelection()
        // this.$refs.table.$refs.table.toggleAllSelection()
      } else {
        this.$refs.table.$refs.table.clearSelection()
      }
      this.$emit('selection-ids', { selectedRowKeys: this.selectedRowKeys, treeData: this.$refs.table.$refs.table.data })
    }
  },
  mounted () {
    let that = this
    that.currentRouterPath = that.$route.path
    if (this.compType === 'approvalHistoryView') {
      let timer = setTimeout(() => {
        let t = that.$refs.table.$refs.table.data
        if (t && t.length > 0) {
          let plans = []
            t.forEach(p => {
              plans = plans.concat(p.children)
          })
          plans.forEach(row => {
            if (that.approveData &&
              that.approveData.selectedRowKeys &&
              that.approveData.selectedRowKeys.length > 0 &&
              that.approveData.selectedRowKeys.indexOf(row.id) !== -1) {
              that.$refs.table.$refs.table.toggleRowSelection(row)
            }
          })
          clearTimeout(timer)
        } else {
          console.log('11111111111111')
        }
      }, 300)
    } else if (that.approvalResult === '1') {
      let timer = setTimeout(() => {
        that.$refs.table.$refs.table.clearSelection()
        // that.$refs.table.$refs.table.toggleAllSelection()
        if (this.selectedRowKeys.length > 0) {
          clearTimeout(timer)
        }
      }, 300)
    }
  },
  methods: {
    // 点击项目/计划列钻取进入三级菜单-计划编制页面
    drillCol (scope, thirdMenuData) {
        let planManager = thirdMenuData.filter(o => o.name === 'planManager')
        this.openThirdMenu(scope.row, planManager[0])
    },
    handleSelectionChange (val) {
      this.selectedRowKeys = []
      this.selectedRows = []
      this.multipleSelection = val
      val.map(item => {
        this.selectedRowKeys.push(item.id)
        this.selectedRows.push(item)
      })
      this.$emit('selection-ids', { selectedRowKeys: this.selectedRowKeys, treeData: this.$refs.table.$refs.table.data })
    },
    selectAll (tableData) {
      this.selectAllChecked = !this.selectAllChecked
      this.selectAllRow(tableData, this.selectAllChecked)
      this.$emit('selection-ids', { selectedRowKeys: this.selectedRowKeys, treeData: this.$refs.table.$refs.table.data })
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
      this.planInfoId = record.id
      this.visiblePlanViewDrawer = true
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
      if (this.commitStatus) {
        this.releaseMenuParams = { status: [this.commitStatus], ids: this.selectedRowKeys }
        let this_ = this
        if (this.isBeforehand) {
          this.$api['planInfoManager.commitStatusValidator'](this_.releaseMenuParams).then(res => {
            if (res && res.result === true) {
              let processDefinitionKey = res.processDefinitionKey
              this_.$api['planInfoManager.releasePlanInfoCheck']({ planInfoArray: this.selectedRowKeys }).then(res => {
                if (res && !res.success) {
                  this_.$message({
                    message: res.message,
                    type: 'warning'
                  })
                } else {
                  this_.nextApproveUserBeforehand(processDefinitionKey)
                }
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
      console.log('1111111111', this.thirdMenuParam)
      this.visibleThirdDrawer = true
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
      this.$api['planInfoManager.commitStatus'](this_.releaseMenuParams).then(res => {
        this_.commitClose()
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
        }
        Vue.nextTick(function () {
          this_.$refs.table.searchData()
        })
      })
    },
    processApprovalView (record) {
      if (record.manageStatus === '6620' || record.manageStatus === '6621') {
        this.processDefinitionKey = 'planApproveRelease'
      } else if (record.manageStatus === '6630' || record.manageStatus === '6631') {
        this.processDefinitionKey = 'planApproveFinish'
      } else {
        this.$message({
          message: '没有可查看的流程',
          type: 'warning'
        })
        return
      }
      this.visibleBpmView = true
      this.businessId = record.id
    },
    onVisibleBpmViewClose () {
      this.visibleBpmView = false
      this.businessId = undefined
      this.processDefinitionKey = undefined
    },
    approveCommitVerification (e, msg) {
      let this_ = this
      let msg1 = '请选择需要'
      if (this.approvalResult === '1') {
        msg1 = msg1 + '通过'
      } else {
        msg1 = msg1 + '完善'
      }
      if (this.selectedRowKeys.length === 0) {
        this_.$confirm(msg1 + `的计划,否则无法提交！`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // this_.$emit('approve-submit', e)
        }).catch(() => {
        })
      } else {
        this_.$emit('approve-submit', e, msg)
      }
    }
  }
}
</script>
