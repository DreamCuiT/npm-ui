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
              <editable-table :columns="paramColumns" :addRow="addRow" :data="tableData"
                style="height:48%;margin-top: -5px;" :renderHeight="renderHeight" @save-param-data="saveParamData"
                :deleteCheck="deleteCheck" :deleteErrorInfo="deleteErrorInfo">
                <template #dutyUserName="{scope, data}">
                  <el-input v-model="scope.row.dutyUserName" :disabled="viewCheck(scope.row)" @blur="saveParamData(data)">
                      <i
                        v-if='!viewCheck(scope.row)'
                        class='el-icon-link'
                        slot='suffix'
                        type='link'
                        @click='showModal3(scope, data)'
                        :style='{ fontSize: "16px", color: "#08c" }'
                      ></i>
                  </el-input>
                </template>
                <template #beginTime="{scope, data}">
                  <el-date-picker v-model="scope.row.beginTime"  type="date" placeholder="选择日期" style="width:100%" :disabled="viewCheck(scope.row)" @blur="saveParamData(data)"></el-date-picker>
                </template>
                <template #endTime="{scope, data}">
                  <el-date-picker v-model="scope.row.endTime" type="date" placeholder="选择日期" style="width:100%" :disabled="viewCheck(scope.row)" @blur="saveParamData(data)"></el-date-picker>
                </template>
                <template #content="{scope, data}">
                  <el-input type="textarea" v-model="scope.row.content" :disabled="viewCheck(scope.row)" @blur="saveParamData(data)"></el-input>
                </template>
                <template #remark="{scope, data}">
                  <el-input type="textarea" v-model="scope.row.remark" :disabled="viewCheck(scope.row)" @blur="saveParamData(data)"></el-input>
                </template>
                  <template #status="{scope, data}">
                  <el-input type="String" :value="showStatus(scope.row)" :disabled="true" ></el-input>
                </template>
              </editable-table>
              <select-user v-if="visible1" :visible="visible1" :selected-row='selectedRow' @close-dialog="closeModal" :selectType='1'></select-user>
              <select-user v-if="visible2" :visible="visible2" :selected-row='selectedRow1' @close-dialog="closeModal1" :selectType='1'></select-user>
              <select-user v-if="visible4" :visible="visible4" :selected-row='selectedRow3' @close-dialog="closeModal3" :selectType='1'></select-user>
              <select-task v-if="visible3" :visible="visible3" :selected-row='selectedRow2' :wholeDescribeId="wholeDescribeId" @close-dialog="closeModal2"></select-task>
    </div>
</template>

<style scoped>

</style>

<script>
import { Input, Button, Upload, DatePicker } from '~/index'
import { P8Form as FormList } from '~/index'
import { P8SelectUser as SelectUser } from '~/index'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-dark.css'
import 'codemirror/mode/sql/sql'
import { P8EditTable as EditableTable } from '~/index'

let dataSource = [
  {
      type: 'view',
      labelText: '问题信息',
      fieldName: 'name',
      slotName: 'name',
      colLayout: 'singleCol',
      rules: [{ required: true, message: '必须选择问题信息' }]
  },
  {
      type: 'view',
      labelText: '处理人',
      fieldName: 'receiveUserName',
      slotName: 'receiveUserName',
      colLayout: 'doubleCol',
      rules: [{ required: true, message: '必须选择处理人' }]
  },
  {
    colLayout: 'doubleCol',
    type: 'view',
    labelText: '问题分类',
    fieldName: 'problemTypeDisplay'
  },
  {
      type: 'view',
      labelText: '提出人',
      fieldName: 'introDucerName',
      slotName: 'introDucerName',
      colLayout: 'doubleCol',
      rules: [{ required: true, message: '必须选择提出人' }]
  },
  {
    type: 'view', // 控件类型
    labelText: '提出时间', // 控件显示的文本
    placeholder: '请选择提出时间',
    fieldName: 'proposeTime',
    colLayout: 'doubleCol',
    fieldConfig: {
      size: 'small'
    },
    rules: [{ required: true, message: '必须选择提出时间' }]
  },
  {
    type: 'view',
    labelText: '问题描述',
    fieldName: 'problemDescribe',
    placeholder: '请输入问题描述',
    colLayout: 'doubleCol',
    rules: [{ required: true, message: '必须输入问题描述' }]
  },
  {
    type: 'view',
    labelText: '处理意见',
    fieldName: 'customItem2',
    placeholder: '请输入处理意见',
    colLayout: 'doubleCol'
  },
  {
    type: 'textarea',
    labelText: '处理结果',
    fieldName: 'customItem5',
    placeholder: '请输入处理结果',
    colLayout: 'singleCol',
    rules: [{ required: true, message: '必须输入处理结果' }]
  },
  {
    type: 'upload',
    labelText: '文件上传',
    defaultValue: [],
    fieldName: 'getFile',
    colLayout: 'singleCol',
    filesLayout: 'row',
    uploadConfig: {
      drag: false
    },
    listType: 'text' // 带密级的上传附件为'secret'，不带密级的listType分为'text'、'picture'、'picture-card'
  },
  {
    type: 'hidden',
    fieldName: 'flag',
    defaultValue: '2'
  },
  {
    type: 'hidden',
    fieldName: 'status',
    defaultValue: '6503'
  }
]

export default {
  name: 'KteamsEdit',
  components: {
      // eslint-disable-next-line vue/no-unused-components
    'el-upload': Upload,
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
    const height = document.documentElement.clientHeight - 480
    return {
      renderHeight: height + 'px',
      confirmLoading: false,
      saveApi: 'problemManager.myproblemProcess',
      uploadActionApi: '',
      visible1: false,
      visible2: false,
      visible3: false,
      visible4: false,
      addRow: true,
      deleteErrorInfo: '进行中和已完成的问题分配无法删除',
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
          dataIndex: 'remark',
          maxWidth: 140,
          default: '',
          scopedSlots: { customRender: 'custom' }
        },
          {
              title: '状态',
              type: 'String',
              dataIndex: 'status',
              maxWidth: 10,
              default: '未处理',
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
      this.formData.saveType = '1'
      this.$refs.form.handleSubmit(e)
    },
    fpHandle (e) {
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
      // if (this.entityId && this.entityId !== '') {
      //   this.getProblemDetail(this.entityId)
      // }
    },
    getProblemDetail (entityId) {
      let that = this
      this.$api['problemManager.getProblemInfo']({ id: entityId }).then(function (res) {
        let data = res
        that.formData.id = data.id
        that.formData.problemDescribe = data.problemDescribe
        that.formData.problemType = data.problemType
        that.formData.introDucer = data.introDucer
        that.formData.introDucerName = data.introDucerName
        that.formData.receiveUserId = data.receiveUserId
        that.formData.receiveUserName = data.receiveUserName
        that.formData.customItem2 = data.customItem2
        that.formData.customItem5 = data.customItem5
        that.formData.proposeTime = data.proposeTime
        that.formData.name = data.name
        that.formData.projectTasksId = data.wtxxId
        that.formData.problemTypeDisplay = data.problemTypeDisplay
        that.tableData = data.bpBackLogRequests
          if (data.getFile !== null) {
              that.formData.getFile = data.getFile
          } else {
              that.formData.getFile = []
          }
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
          // eslint-disable-next-line no-unused-vars
        let that = this
        this.editTableData[this.editTableIndex].dutyUserName = this.selectedRow3[0].realName
        this.editTableData[this.editTableIndex].dutyUserId = this.selectedRow3[0].id
        this.sqlParams['bpBackLogRequests'] = this.editTableData
      }
    },
    saveParamData (data) {
      this.sqlParams['bpBackLogRequests'] = data
    },
      viewCheck (data) {
       if (data.status === '11704' || data.status === '11705') {
           return true
       } else {
           return false
       }
      },
      showStatus (data) {
        console.log(data, '状态显示数据')
        if (data.status === '11702') {
            return '未处理'
        }
          if (data.status === '11704') {
              return '处理中'
          }
          if (data.status === '11705') {
              return '已完成'
          }
          return '未处理'
      },
      deleteCheck (data) {
          if (data.row.status === '11704' || data.row.status === '11705') {
              return false
          } else {
              return true
          }
      },
    parseCheck (saveParams) {
        console.log(saveParams, 'saveParams信息')
      let params = { ...saveParams, ...this.sqlParams }
      let _this = this
      // 如果是提交完成需要判断是否存在待办，如果存在待办，需要提示选择问题分配。提交完成需要判断附件，必须要上传附件
      if (params.saveType === '1') {
          console.log(params.bpBackLogRequests, '任务分配状态！')
          let finished = true
          params.bpBackLogRequests.forEach(function (data) {
            if (data.status !== '11705') {
                _this.$alert('存在未完成的问题待办，不可提交完成！', '提示', {
                    confirmButtonText: '确定',
                    type: 'warning'
                })
                finished = false
            }
          })
          if (!finished) {
              return false
          }
      }
      // 问题分配必选存在待办。
      if (params.saveType === '0') {
        if (params.bpBackLogRequests.length === 0) {
            _this.$alert('未添加待办，不可执行此操作！', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            })
            return false
        }
      }
      for (let i in params.bpBackLogRequests) {
          // eslint-disable-next-line eqeqeq
        if (params.bpBackLogRequests[i].beginTime != '' && params.bpBackLogRequests[i].endTime != '') {
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
        if (params.bpBackLogRequests[i].dutyUserName === '') {
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
