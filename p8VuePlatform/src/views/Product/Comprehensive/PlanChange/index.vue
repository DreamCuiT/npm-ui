<template>
    <div class='couerDivClass' id='couerDiv'>
<!--      <div class='top' style="height:300px;">-->
<!--        <el-row :gutter="20" style="height: 300px;">-->
<!--          <el-col :span="6" style="padding-left: 10px;padding-right: 5px;"><div class="top-content"></div></el-col>-->
<!--          <el-col :span="6" style="padding-left: 5px;padding-right: 5px;"><div class="top-content"></div></el-col>-->
<!--          <el-col :span="6" style="padding-left: 5px;padding-right: 5px;"><div class="top-content"></div></el-col>-->
<!--          <el-col :span="6" style="padding-left: 5px;padding-right: 10px;"><div class="top-content"></div></el-col>-->
<!--        </el-row>-->
<!--      </div>-->
      <div class='bottom' style="height: 100%">
        <list-layout>
          <template #north>
            <common-button :comp="comp"></common-button >
            <search-form-list ref="search" :dataSource="searchData" @search="search" @re-set="reSet"></search-form-list>
          </template>
          <template #center>
            <div id="table-contain">
              <common-table ref="table"
                            :columns="columns"
                            :table-Refresh="tableRefresh"
                            :params="queryParam"
                            :api="tableApi"
                            :comp="comp"
                            :table-config='tableConfig'
                            :menu-state='menuStateObj'
                            :pagination=true
              >
              </common-table>
            </div>
          </template>
          <template #drawer-panel>
            <el-drawer
                :title="title"
                :append-to-body="true"
                size="100%"
                :destroy-on-close="true"
                :wrapperClosable="false"
                @closed="onClose"
                :visible.sync="drawerVisible">
              <change-index :plan-info-id="planInfoId" :task-id="taskId" :plan-info-status="planInfoStatus" @closed="onClose" :create-page="createPage" :read-only="readOnlyVisible" :change-id="changeId"></change-index>
            </el-drawer>
            <el-drawer
                :title="title"
                :append-to-body="true"
                size="100%"
                :destroy-on-close="true"
                :wrapperClosable="false"
                @closed="onClose"
                :visible.sync="analysisVisible">
              <impact-analysis :plan-info-id="planInfoId" @closed="onClose" :create-page="createPage" :read-only="readOnlyVisible" :change-id="changeId"></impact-analysis>
            </el-drawer>
            <submit-change
                v-if="submitChangeValidate"
                :visible="submitChangeValidate"
                :change-id="changeId"
                @save-success="submitChangeSave">
            </submit-change>
            <selectApproveUser v-if="isSelectApproveUserView"
                               :isSelectApproveUserView="isSelectApproveUserView"
                               :selectUserDataSource="selectUserDataSource"
                               :selectUserFormData="selectUserFormData"
                               @close-modal="closeSelectApproveUser"
                               @commit="commitSelectApproveUser"
            ></selectApproveUser>
          </template>
        </list-layout>
      </div>
    </div>
</template>
<style lang="scss" scoped>
  .couerDivClass{
    height: calc(100% - 2px)!important;
    padding-top:1px;
    box-sizing: border-box;
    overflow:scroll;
    overflow-x:hidden;
    overflow-y:hidden;
    z-index:2!important;
  }
  .top {
    position: relative;
    margin-bottom:8px;
    background:$base-white-color;
    border:1px solid $base-line-color;
    border-radius: 6px;
    overflow:hidden;
  }
  .bottom {
    height:calc(100% - 192px);
    position: relative;
    border:1px solid $base-line-color;
    border-radius:6px;
    box-shadow:5px 5px 13px $base-bg-shadow;
    background:$base-white-color;
    overflow:hidden;
  }

  .el-row {
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 5px;
  }
  .top-content {
    border-radius: 5px;
    height: 300px;
    background: #f4d1d1;
  }
  .bottom-content {
    border-radius: 5px;
    height: 300px;
    background: #f3dada;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
<script>
import Vue from 'vue'
// import { Row, Col, Drawer } from '~/index'
import SubmitChange from './Components/submitChange'
import { Drawer } from '~/index'
import { P8ListLayout as ListLayout } from '~/index'
import { P8Table as CommonTable } from '~/index'
import { P8Search as SearchFormList } from '~/index'
import ChangeIndex from './Components/changeIndex'
import ImpactAnalysis from './Components/impactAnalysis'
import { P8Button as CommonButton } from '~/index'
// import { nextApproveUser } from '@/assets/commonJS/BusinessActivity/nextApproveUser'
import SelectApproveUser from '@/views/Framework/BusinessActivity/ProcessApproval/selectApproveUser'
import moment from 'moment'
export default {
  name: 'PlanChange',
  components: {
    // 'el-row': Row,
    // 'el-col': Col,
    'el-drawer': Drawer,
    ListLayout,
    SearchFormList,
    CommonTable,
    ChangeIndex,
    CommonButton,
    ImpactAnalysis,
    SubmitChange,
    SelectApproveUser
  },
  props: {
    thirdMenuParam: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      comp: this,
      queryParam: {
        createPage: '',
        planInfoId: ''
      },
      title: '',
      planInfoId: '',
      changeId: '',
      taskId: '',
      createPage: '',
      planInfoStatus: '',
      drawerVisible: false,
      analysisVisible: false,
      submitChangeValidate: false,
      readOnlyVisible: false, // 分析页面只读参数定义
      isSelectApproveUserView: false,
      selectUserDataSource: [],
      selectUserFormData: {},
      selectedRowKeys: [],
      tableApi: 'planChange.planChangeList',
      searchData: [
        {
          type: 'select',
          labelText: '变更状态',
          fieldName: 'changeState',
          colLayout: 'singleCol',
          placeholder: '选择变更状态',
          optionUrl: {
            api: 'thirdPartInterface.getDic',
            params: { dicType: 'CHANGE_STATUS' },
            label: 'label',
            value: 'value'
          },
          options: []
        },
        {
          type: 'text',
          labelText: '变更人',
          fieldName: 'createUserName',
          placeholder: '请输入变更人员',
          colLayout: 'doubleCol'
        },
        {
          type: 'datetimeRange',
          labelText: '创建日期',
          fieldName: 'recordingTime',
          placeholder: ['开始日期', '结束日期'],
          fieldConfig: {
            format: 'YYYY-MM-DD'
          }
        },
        {
          type: 'select',
          labelText: '变更原因分类',
          fieldName: 'changeType',
          colLayout: 'singleCol',
          placeholder: '选择变更原因分类',
          optionUrl: {
            api: 'thirdPartInterface.getDic',
            params: { dicType: 'ADJUST_ClASSIFY' },
            label: 'label',
            value: 'value'
          },
          options: []
        }
      ],
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 50,
          align: 'center'
        },
        {
          title: '变更人',
          dataIndex: 'createUserName',
          align: 'center'
        },
        {
          title: '部门',
          dataIndex: 'deptName',
          align: 'center'
        },
        {
          title: '发起时间',
          dataIndex: 'triggerTime',
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          align: 'center'
        },
        {
          title: '是否产生变更记录',
          dataIndex: 'weatherChange',
          formatter: function (row) {
            if (row.weatherChange === '0') {
              return '是'
            } else if (row.weatherChange === '1') {
              return '否'
            }
          },
          align: 'center'
        },
        {
          title: '变更计划数',
          dataIndex: 'changeCount',
          align: 'center'
        },
        {
          title: '变更原因分类',
          dataIndex: 'changeTypeDisp',
          align: 'center'
        },
        {
          title: '变更原因',
          dataIndex: 'reason',
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'changeStateDisp',
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
          width: 120,
          fixed: 'right'
        }
      ],
      tableConfig: {
      },
      menuStateObj: []
    }
  },
  mounted () {
    this.planInfoId = this.thirdMenuParam.planInfoId
    this.planInfoStatus = this.thirdMenuParam.planInfoStatus
    this.taskId = this.thirdMenuParam.taskId
    if (this.thirdMenuParam.createPage === 'compile') {
      this.createPage = 'planChange'
    } else if (this.thirdMenuParam.createPage === 'decompose') {
      this.createPage = 'userChange'
    }
    if (this.planInfoId && this.createPage) {
      this.queryParam.createPage = this.createPage
      this.queryParam.planInfoId = this.planInfoId
      // this.getChangeInfo(this.planInfoId)
    }
  },
  methods: {
    search (param) {
      if (param && param.recordingTime && param.recordingTime.length === 2) {
        param.beginTime = moment(param.recordingTime[0]).format('YYYY-MM-DD')
        param.endTime = moment(param.recordingTime[1]).format('YYYY-MM-DD')
      }
      param.createPage = this.createPage
      param.planInfoId = this.planInfoId
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
    handleSelectionChange (val) {
      this.selectedRowKeys = []
      val.map(item => {
        this.selectedRowKeys.push(item.id)
      })
    },
    getChangeInfo (planInfoId) {
    },
    releaseChange () {
      this.changeId = ''
      this.drawerVisible = true
      this.readOnlyVisible = false
    },
    approveChange (record) {
      this.changeId = record.id
      this.submitChangeValidate = true
    },
    modifyChange (record) {
      this.changeId = record.id
      this.drawerVisible = true
      this.readOnlyVisible = false
    },
    changAnalyze (record) {
      this.changeId = record.id
      this.analysisVisible = true
      this.readOnlyVisible = true
    },
    removeChange (record) {
      let that = this
      that.$confirm(`是否要删除该变更记录？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let type = 'success'
        let msg = '删除成功！'
        that.$api['planChange.removePlanChange']({ id: record.id }).then(res => {
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
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
    onClose () {
      this.drawerVisible = false
      this.submitChangeValidate = false
      this.$refs.table.searchData()
    },
    submitChangeSave (obj) {
      /* let this_ = this
      if (obj && obj.processInstanceIds && obj.processInstanceIds.length > 0) {
        nextApproveUser.initDataSource(obj.approveTime, obj.processInstanceIds, this_).then(res1 => {
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
      } */
      this.submitChangeValidate = false
    },
    closeSelectApproveUser () {
      this.isSelectApproveUserView = false
      this.$emit('approved', this.formData.taskId)
    },
    commitSelectApproveUser (fullParams) {
      this.$refs.form.submitForm(fullParams, this.saveApi)
      this.closeModal()
      this.$emit('closed', true)
    }
  }
}
</script>
