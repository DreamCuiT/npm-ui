<template>
    <div>
              <form-list ref="form"
                @rendered="rendered"
                style="height:54%"
                :form="formData"
                @saved="saved"
                :dataSource="dataSource"
                :existDefaultBtn="false"
                :existCustomBtn='true'
                :api="saveApi"
                :isCustomValidate="true"
                @custom-validate="parseCheck">
                    <template #introDucerName>
                      <el-input v-model='formData["introDucerName"]' readonly autosize placeholder="请选择提出人">
                        <i
                          v-if='selectedRow'
                          class='el-icon-link'
                          slot='suffix'
                          type='link'
                          @click='showModal'
                          :style='{ fontSize: "16px", color: "#08c" }'
                        ></i>
                      </el-input>
                    </template>
                    <template #receiveUserName>
                      <el-input v-model='formData["receiveUserName"]' readonly autosize placeholder="请选择处理人">
                        <i
                          v-if='selectedRow1'
                          class='el-icon-link'
                          slot='suffix'
                          type='link'
                          @click='showModal1'
                          :style='{ fontSize: "16px", color: "#08c" }'
                        ></i>
                      </el-input>
                    </template>
                    <template #name>
                      <el-input v-model='formData["name"]' readonly autosize placeholder="请选择计划任务">
                        <i
                          v-if='selectedRow2'
                          class='el-icon-link'
                          slot='suffix'
                          type='link'
                          @click='showModal2'
                          :style='{ fontSize: "16px", color: "#08c" }'
                        ></i>
                      </el-input>
                    </template>
                    <template #customBtn>
                      <el-button type="primary" size="mini" @click="fpHandle">问题分配</el-button>
                      <el-button type="primary" size="mini" @click="submitHandle">提交完成</el-button>
                    </template>
              </form-list>
        <template>
              <editable-table :columns="paramColumns" :addRow="true" :data = "tableData"
                style="height:40%;margin-top: -20px;" :renderHeight="renderHeight" @save-param-data="saveParamData">
                <template #dutyUserName="{scope, data}">
                  <el-input v-model="scope.row.dutyUserName" @blur="saveParamData(data)">
                      <i
                        v-if='selectedRow3'
                        class='el-icon-link'
                        slot='suffix'
                        type='link'
                        @click='showModal3(scope, data)'
                        :style='{ fontSize: "16px", color: "#08c" }'
                      ></i>
                  </el-input>
                </template>
                <template #beginTime="{scope, data}">
                  <el-date-picker v-model="scope.row.beginTime" type="date" placeholder="选择日期" style="width:100%" @blur="saveParamData(data)"></el-date-picker>
                </template>
                <template #endTime="{scope, data}">
                  <el-date-picker v-model="scope.row.endTime" type="date" placeholder="选择日期" style="width:100%" @blur="saveParamData(data)"></el-date-picker>
                </template>计划编号
                <template #content="{scope, data}">
                  <el-input type="textarea" v-model="scope.row.content" @blur="saveParamData(data)"></el-input>
                </template>
                <template #remark="{scope, data}">
                  <el-input type="textarea" v-model="scope.row.remark" @blur="saveParamData(data)"></el-input>
                </template>
              </editable-table>
              <select-user v-if="visible1" :visible="visible1" :selected-row='selectedRow' @close-dialog="closeModal" :selectType='1' ></select-user>
              <select-user v-if="visible2" :visible="visible2" :selected-row='selectedRow1' @close-dialog="closeModal1" :selectType='1' ></select-user>
              <select-user v-if="visible4" :visible="visible4" :selected-row='selectedRow3' @close-dialog="closeModal3"  :selectType='1' ></select-user>
              <select-task v-if="visible3" :visible="visible3" :selected-row='selectedRow2' :wholeDescribeId="wholeDescribeId" @close-dialog="closeModal2"></select-task>
        </template>
    </div>
</template>

<style scoped>

</style>

<script>
import { Input, Button, DatePicker } from '~/index'
import { P8Form as FormList } from '~/index'
import { P8SelectUser as SelectUser } from '~/index'
// require styles
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-dark.css'
import 'codemirror/mode/sql/sql'
import { P8EditTable as EditableTable } from '~/index'

let dataSource = [
  {
      type: 'view',
      labelText: '项目信息',
      fieldName: 'name',
      slotName: 'name',
      colLayout: 'singleCol'

  },
  {
      type: 'view',
      labelText: '风险任务',
      fieldName: 'projectTaskName',
      colLayout: 'doubleCol'

  },
  {
    colLayout: 'doubleCol',
    type: 'view',
    labelText: '风险起点任务',
    fieldName: 'startProjectTaskName'
  },
  {
      type: 'view',
      labelText: '风险终点任务',
      slotName: 'endProjectTaskName',
      colLayout: 'doubleCol'
  },
  {
    type: 'view',
    labelText: '风险等级',
    fieldName: 'riskLevel',
    colLayout: 'doubleCol'
  },
  {
    type: 'view',
    labelText: '风险描述',
    fieldName: 'riskDesc',
    colLayout: 'doubleCol'

  },
    {
        type: 'view',
        labelText: '提出人',
        fieldName: 'riskLaunchUser',
        colLayout: 'doubleCol'

    },
    {
        type: 'view',
        labelText: '影响kpi',
        fieldName: 'kpiEffrct',
        colLayout: 'doubleCol'

    },
  {
    type: 'textarea',
    labelText: '处理结果',
    fieldName: 'riskResult',
    placeholder: '请输入处理结果',
    colLayout: 'singleCol'
  },
  {
    type: 'upload',
    labelText: '文件上传',
    fieldName: 'getFile',
    colLayout: 'singleCol',
    uploadConfig: {
      drag: false
    },
    listType: 'secret' // 带密级的上传附件为'secret'，不带密级的listType分为'text'、'picture'、'picture-card'
  },
  {
    type: 'hidden',
    fieldName: 'flag',
    defaultValue: '2'
  },
  {
    type: 'hidden',
    fieldName: 'status',
    defaultValue: '7502'
  }
]

export default {
  name: 'risk',
  components: {
    'el-input': Input,
    'el-button': Button,
    'el-date-picker': DatePicker,
    FormList,
    SelectUser,
    EditableTable
  },
  props: {
    record: {
      type: Object
    },
    visible: {
      type: Boolean
    },
    title: {
      type: String
    },
    entityId: {
      type: String
    },
    wholeDescribeId: {
      type: String
    }
  },
  data () {
    const height = document.documentElement.clientHeight - 600
    return {
      renderHeight: height + 'px',
      confirmLoading: false,
      // saveApi: 'riskManager.updateRiskManage',
      saveApi: 'riskManager.myRiskProcess',
      uploadActionApi: '',
      visible1: false,
      visible2: false,
      visible3: false,
      visible4: false,
      selectedRow: {},
      selectedRow1: {},
      selectedRow2: {},
      selectedRow3: {},
      dialogHeight: 760,
      dataSource: [],
      tableData: [],
      formData: {
        id: null,
        problemDescribe: null,
        problemType: null,
        introDucer: null,
        introDucerName: null,
        receiveUserId: null,
        receiveUserName: null,
        customItem2: null,
        customItem5: null,
        proposeTime: null,
        name: null,
        projectTasksId: null,
        editType: null,
        status: null,
        saveType: null,
        problemTypeDisplay: null,
        bpBackLogRequests: [],
        getFile: []
      },
      dialogConfig: {
        modal: true,
        appendToBody: true,
        modalAppendToBody: true
      },
      paramColumns: [
        {
          title: '责任人',
          dataIndex: 'dutyUserName',
          maxWidth: 50,
          default: '',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '计划开始时间',
          dataIndex: 'beginTime',
          maxWidth: 70,
          default: '',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '计划完成时间',
          dataIndex: 'endTime',
          maxWidth: 70,
          default: '',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '事项',
          dataIndex: 'content',
          maxWidth: 140,
          default: '',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '备注',
          type: 'textarea',
          dataIndex: 'remark',
          maxWidth: 140,
          default: '',
          scopedSlots: { customRender: 'custom' }
        }
      ],
      editTableIndex: 0,
      editTableData: [],
      sqlParams: {}
    }
  },
  created () {
    this.formTrigger()
  },
  mounted () {
      if (this.entityId && this.entityId !== '') {
          this.getProblemDetail(this.entityId)
      }
  },
  methods: {
    submitHandle (e) {
      this.formData.status = '7503'
      this.formData.saveType = '1'
      this.$refs.form.handleSubmit(e)
    },
    fpHandle (e) {
      this.formData.status = '7502'
      this.formData.saveType = '0'
      this.$refs.form.handleSubmit(e)
    },
    formTrigger () {
      this.dataSource = Object.assign([], dataSource)
    },
    showMessage (obj, message, type) {
      obj.$message({
        message: message,
        type: type
      })
    },
    rendered () {
      // if (this.rowId && this.rowId !== '') {
      //   this.getProblemDetail(this.rowId)
      // }
    },
    getProblemDetail (entityId) {
      let that = this
      this.$api['riskManager.getRiskManageById']({ id: entityId }).then(function (res) {
        let data = res
        that.formData.id = data.id
        that.formData.endProjectTaskName = data.endProjectTaskName
        that.formData.kpiEffrct = data.kpiEffrct
        that.formData.projectTaskName = data.projectTaskName
        that.formData.riskDutyUser = data.riskDutyUser
        that.formData.riskLaunchUser = data.riskLaunchUser
        that.formData.receiveUserName = data.receiveUserName
        that.formData.riskLevel = data.riskLevel
        that.formData.riskMeasure = data.riskMeasure
        that.formData.riskDesc = data.riskDesc
        that.formData.riskResult = data.riskResult
        that.formData.name = data.name
        that.formData.startProjectTaskName = data.startProjectTaskName
        that.formData.statusDis = data.statusDis
        that.tableData = data.bpBackLogResponses
        // that.formData.getFile = data.getFile
        that.formData = Object.assign({}, that.formData)
      }).catch(function (error) {
        console.log(error)
      })
    },
    saved (res) {
      console.log('edit saved')
      this.$emit('save-success', res)
    },
    handleOk (e) {
      this.$emit('close-modal')
    },
    handleCancel (e) {
      this.$emit('close-modal')
    },
    showModal () {
      this.visible1 = true
    },
    showModal1 () {
      this.visible2 = true
    },
    showModal2 () {
      this.visible3 = true
    },
    showModal3 (scope, data) {
      this.visible4 = true
      this.editTableIndex = scope.$index
      this.editTableData = data
    },
    closeModal (selectedRow) {
      this.visible1 = false
      this.selectedRow = selectedRow
      if (this.selectedRow) {
        let that = this
        that.formData.introDucerName = this.selectedRow[0].realName
        that.formData.introDucer = this.selectedRow[0].id
        that.formData = Object.assign({}, that.formData)
      }
    },
    closeModal1 (selectedRow1) {
      this.visible2 = false
      this.selectedRow1 = selectedRow1
      if (this.selectedRow1) {
        let that = this
        that.formData.receiveUserName = this.selectedRow1[0].realName
        that.formData.receiveUserId = this.selectedRow1[0].id
        that.formData = Object.assign({}, that.formData)
      }
    },
    closeModal2 (selectedRow2) {
      this.visible3 = false
      this.selectedRow2 = selectedRow2
      if (this.selectedRow2) {
        let that = this
        that.formData.projectTasksId = this.selectedRow2[0].id
        that.formData.name = this.selectedRow2[0].name
        that.formData = Object.assign({}, that.formData)
      }
    },
    closeModal3 (selectedRow3) {
      this.visible4 = false
      this.selectedRow3 = selectedRow3
      if (this.selectedRow3 && this.selectedRow3.length) {
        this.editTableData[this.editTableIndex].dutyUserName = this.selectedRow3[0].realName
        this.editTableData[this.editTableIndex].dutyUserId = this.selectedRow3[0].id
        this.sqlParams['bpBackLogRequests'] = this.editTableData
      }
    },
    saveParamData (data) {
      this.sqlParams['bpBackLogRequests'] = data
    },
    parseCheck (saveParams) {
      let params = { ...saveParams, ...this.sqlParams }
      let _this = this
      // 如果是提交完成需要判断是否存在待办，如果存在待办，需要提示选择问题分配。提交完成需要判断附件，必须要上传附件
      if (params.saveType === '1') {
        if (params.getFile === null || params.getFile === undefined) {
          _this.$alert('未上传附件，不可提交完成！', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          })
        return false
        }
        if (params.bpBackLogRequests !== null && params.bpBackLogRequests.length > 0) {
          _this.$alert('存在问题待办，请选择问题分配！', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          })
        return false
        }
      }
      // 问题分配必选存在待办。
      if (params.saveType === '0') {
        if (params.bpBackLogRequests === null || params.bpBackLogRequests === undefined) {
            _this.$alert('未添加待办，不可执行此操作！', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            })
            return false
        }
      }
      for (let i in params.bpBackLogRequests) {
        if (params.bpBackLogRequests[i].beginTime !== '' && params.bpBackLogRequests[i].endTime !== '') {
          if (params.bpBackLogRequests[i].beginTime > params.bpBackLogRequests[i].endTime) {
            this.$alert('结束时间不能大于开始时间！', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
            })
            return false
          }
        } else {
          this.$alert('未选择时间，不可执行此操作', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
            })
            return false
        }
        if (params.bpBackLogRequests[i].realName === '') {
          this.$alert('未选择责任人，不可执行此操作', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
          })
          return false
        }
      }
      _this.$refs.form.submitForm(params, _this.saveApi)
    }
  }
}
</script>
