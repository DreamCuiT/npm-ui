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
                      :pagination="true"
                      @selection-change="select"
                      @requested-table-data="getTotalNum">
          <template #statusIcon="{scope}">
            <el-tooltip placement="right"
                        :disabled="!scope.row.statusDisplay"
                        :content="scope.row.statusDisplay">
              <i :class="scope.row.statusClass"
                 :style="{color:scope.row.statusColor}"></i>
            </el-tooltip>
          </template>
        </common-table>
        <copy-list-select :visible="copyVisible" @save-success="saveCloseModal" @close-modal="closeModal"></copy-list-select>
        <TargetList v-if="targetListVisible" :visible="targetListVisible" :duty="selectedRow" @dialog-close="dialogClose"></TargetList>
      </div>
    </template>
    <template #drawer-panel>
      <select-plan :visible="selectPlanVisible" ></select-plan>
      <common-drawer v-if="visibleDutyIndexDrawer"
                     :title='createDutyTitle'
                     :visible="visibleDutyIndexDrawer"
                     placement="top"
                     size="50%"
                     @close="onCreateDutyClose">
        <template #drawer>
          <create-duty @save-success='onCreateSettingsClose'
                       :plan-info-id='planDutyId'
                       :dateNumber="dateNumber"></create-duty>
        </template>
      </common-drawer>

      <common-drawer v-if="updateDutyIndexDrawer"
                     :title='updateDutyTitle'
                     :visible="updateDutyIndexDrawer"
                     placement="top"
                     size="50%"
                     @close="onEditDutyClose">
        <template #drawer>
          <edit-duty @save-success='onEditSettingsClose'
                     :plan-info-id='editDutyId'></edit-duty>
        </template>
      </common-drawer>

      <common-drawer v-if="dutyMemberIndexDrawer"
                     :title='dutyMemberTitle'
                     :visible="dutyMemberIndexDrawer"
                     placement="top"
                     size="50%"
                     @close="onMemberDutyClose">
        <template #drawer>
          <duty-member @save-success='onMemberSettingsClose'
                       :curr-entity-id='memberDutyId'
                       :curr-entity-name='memberDutyName'></duty-member>
        </template>
      </common-drawer>

      <common-drawer v-if="visibleBpmView"
                     :title='viewDutyTitle'
                     :visible="visibleBpmView"
                     placement="top"
                     size="50%"
                     @close="onVisibleBpmViewClose">
        <template #drawer>
          <duty-view :plan-info-id='editDutyId'
                     @save-success='onVisibleBpmViewClose'></duty-view>
        </template>
      </common-drawer>
    </template>
  </list-layout>
</template>

<script>
import Vue from 'vue'
import { P8Table as CommonTable, P8Button as CommonButton, P8Drawer as CommonDrawer, P8ListLayout as ListLayout, P8Search as SearchFormList, Tooltip } from '~/index'
import CreateDuty from './createDuty'
import EditDuty from './editDuty'
import DutyMember from './dutyMember'
import DutyView from './dutyInfoView'
import CopyListSelect from './copyListSelect'
import SelectPlan from './selectPlan'
import TargetList from './TargetList'

export default {
  name: 'projectDutyList',
  components: {
    CommonTable,
    CommonButton,
    CommonDrawer,
    ListLayout,
    SearchFormList,
    CreateDuty,
    EditDuty,
    DutyMember,
    DutyView,
    CopyListSelect,
    SelectPlan,
    TargetList,
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
            width: 55,
            align: 'center'
          },
          {
            title: '责任令组名称',
            dataIndex: 'name',
            minWidth: 300,
            align: 'left'
          },
          {
            title: '关联项目名称',
            dataIndex: 'planName',
            minWidth: 300,
            align: 'left'
          },
          {
            title: '责任令组简称',
            dataIndex: 'shortName',
            width: 300,
            align: 'center'
          },
          {
            title: '年度',
            dataIndex: 'year',
            width: 120,
            align: 'center'
          },
          {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: { customRender: 'operation' },
            width: 160,
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
            labelText: '责任令组名称', // 控件显示的文本
            fieldName: 'name',
            placeholder: '请输入名称'
          },
          {
            type: 'select',
            labelText: '年度',
            optionUrl: {
              api: 'thirdPartInterface.getYear'
            },
            fieldName: 'year',
            colLayout: 'singleCol'
          }
        ]
      }
    }
  },
  data () {
    return {
      comp: this,
      currentRouterPath: '',
      thirdMenuParam: {},
      drawerTitle: '',
      visibleDutyIndexDrawer: false,
      updateDutyIndexDrawer: false,
      dutyMemberIndexDrawer: false,
      visibleDutyViewDrawer: false,
      copyVisible: false,
      targetListVisible: false,
      selectPlanVisible: false,
      visibleBpmView: false, // 查看流程图
      queryParam: { flag: 'list' },
      tableApi: 'DutyToken.projectList',
      currEntityId: '',
      isView: null,
      planDutyId: '',
      editDutyId: '',
      memberDutyId: '',
      memberDutyName: '',
      dateNumber: 0,
      dateLength: 0,
      createDutyTitle: '新建责任令组',
      updateDutyTitle: '修改责任令组',
      viewDutyTitle: '查看责任令',
      dutyMemberTitle: '责任令组成员编辑',
      buttonConfig: {},
      defaultMenu: {},
      businessId: '',
      processDefinitionKey: 'project-release-approval-process',
      processDefinitionApi: 'ProjectApply.getProcessDefinitionByBusinessId',
      approvalApi: 'PersonalProcessApproval.approvalInfos',
      selectedRows: [],
      selectedRow: null,
      selectType: 'single'
    }
  },
  mounted () {
    this.currentRouterPath = this.$route.path
  },
  computed: {},
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
    copyDutyGroup () {
      this.copyVisible = true
    },
    saveCloseModal () {
      this.copyVisible = false
      this.$message({ message: '复制成功', type: 'success' })
      this.$refs.table.queryList()
    },
    resolve () {
      if (this.selectedRow) {
        this.targetListVisible = true
      } else {
        this.$message({
          message: '没有选中数据',
          type: 'warning'
        })
      }
    },
    dialogClose () {
      this.targetListVisible = false
    },
    closeModal () {
      this.$refs.table.queryList()
      this.copyVisible = false
    },
    delMenu () {
      if (this.selectedRow) {
        let record = this.selectedRow
        let that = this
        console.log(record, '删除责任令组！')
        this.$confirm(`是否确定要删除该责任令组以及组里面的成员？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$api['DutyToken.deleteDuty']({ id: record.id })
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
        }).catch(() => {
        })
      }
    },
    createProject () {
      this.thirdMenuParam.currEntityId = ''
      this.drawerTitle = '新建责任令组'
      this.dateNumber = this.dataLength + 1
      console.log(this.dateNumber, '333333')
      this.visibleDutyIndexDrawer = true
      this.isView = '0'
      this.thirdMenuParam.isView = this.isView
    },
    modifyMenu () {
      if (this.selectedRow) {
        let record = this.selectedRow
        this.editDutyId = record.id
        this.drawerTitle = '修改责任令组信息'
        this.updateDutyIndexDrawer = true
        this.isView = '0'
        this.thirdMenuParam.isView = this.isView
      }
    },
    viewMenu () {
      if (this.selectedRow) {
        let record = this.selectedRow
        this.memberDutyId = record.id
        this.memberDutyName = record.name
        this.dutyMemberIndexDrawer = true
        this.isView = '1'
        this.thirdMenuParam.isView = this.isView
      }
    },
    findView (record) {
      this.visibleBpmView = true
      this.editDutyId = record.id
    },
    closeDrawer () {
      this.visibleDutyIndexDrawer = false
    },
    onCreateDutyClose () {
      this.$router.push({ path: this.currentRouterPath })
      this.visibleDutyIndexDrawer = false
      if (this.isView === '0') {
        this.$refs.table.searchData()
      }
    },
    onEditDutyClose () {
      this.$router.push({ path: this.currentRouterPath })
      this.updateDutyIndexDrawer = false
      if (this.isView === '0') {
        this.$refs.table.searchData()
      }
    },
    onMemberDutyClose () {
      this.$router.push({ path: this.currentRouterPath })
      this.dutyMemberIndexDrawer = false
      if (this.isView === '0') {
        this.$refs.table.searchData()
      }
    },
    onVisibleBpmViewClose () {
      this.visibleBpmView = false
    },
    onCreateSettingsClose () {
      this.visibleDutyIndexDrawer = false
      this.$refs.table.queryList()
    },
    onEditSettingsClose () {
      this.updateDutyIndexDrawer = false
      this.$refs.table.queryList()
    },
    onMemberSettingsClose () {
      this.dutyMemberIndexDrawer = false
    },
    saveCallback () {
      this.$refs.table.searchData()
      this.onEditDutyClose()
    },
    search (param) {
      this.queryParam = param
      let that = this
      Vue.nextTick(function () {
        that.$refs.table.queryList()
      })
    },
    reSet () {
      Object.keys(this.queryParam).forEach(key => {
        this.queryParam[key] = ''
      })
      this.queryParam.flag = 'list'
      Vue.nextTick(function () {
        this.$refs.table.searchData()
      })
    },
    viewAllDuty (record) {
      this.thirdMenuParam.currEntityId = record.id
      this.visibleDutyIndexDrawer = true
      this.isView = '1'
      this.thirdMenuParam.isView = this.isView
    },
    getTotalNum (data) {
      let that = this
      that.dataLength = that.$refs.table.page.total
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
    }
  }
}
</script>
