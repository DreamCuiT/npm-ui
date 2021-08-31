<template>
    <common-dialog
                :title="title"
                :visible="visible"
                  destroy-on-close
                @close="handleCancel"
                 width="1200px"
                  :dialogHeight="dialogHeight"
                 :showHandleBtn="false"
                 :dialogConfig="dialogConfig"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
        >
     <template #dialog>
              <form-list ref="form"
                @rendered="rendered"
                :form="formData"
                @saved="saved"
                :dataSource="dataSource"
                :existDefaultBtn="false"
                :existCustomBtn='true'
                :api="saveApi">
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
                      <el-button type="primary" size="mini" @click="fpHandle">保存并分配</el-button>
                      <el-button type="primary" size="mini" @click="submitHandle">保存</el-button>
                    </template>
              </form-list>
              <select-user v-if="visible1" :visible="visible1" :selected-row='selectedRow' @close-dialog="closeModal" :selectType='1'></select-user>
              <select-user v-if="visible2" :visible="visible2" :selected-row='selectedRow1' @close-dialog="closeModal1" :selectType='1'></select-user>
              <select-task v-if="visible3" :visible="visible3" :selected-row='selectedRow2' :wholeDescribeId="wholeDescribeId" @close-dialog="closeModal2"></select-task>
      </template>
    </common-dialog>
</template>

<style scoped>

</style>

<script>
import { Input, Button } from '~/index'
import { P8Form as FormList } from '~/index'
import { P8Dialog as CommonDialog } from '~/index'
import { P8SelectUser as SelectUser } from '~/index'
import SelectTask from './SelectTask'

let dataSource = [
  {
      type: 'blank',
      labelText: '问题信息',
      fieldName: 'name',
      slotName: 'name',
      colLayout: 'singleCol',
      rules: [{ required: true, message: '必须选择问题信息' }]
  },
  {
    type: 'textarea',
    labelText: '问题描述',
    fieldName: 'problemDescribe',
    placeholder: '请输入问题描述',
    colLayout: 'singleCol',
    rules: [{ required: true, message: '必须输入问题描述' }]
  },
  {
    placeholder: '请选择问题分类',
    colLayout: 'singleCol',
    type: 'select',
    labelText: '问题分类',
    fieldName: 'problemType',
    optionUrl: {
      api: 'thirdPartInterface.getDic',
      params: { dicType: 'SUMMARY_PROGRESS' }
    },
    options: [],
    rules: [{ required: true, message: '必须选择问题分类' }]
  },
  {
      type: 'blank',
      labelText: '提出人',
      fieldName: 'introDucerName',
      slotName: 'introDucerName',
      colLayout: 'singleCol',
      rules: [{ required: true, message: '必须选择提出人' }]
  },
  {
    type: 'datetime', // 控件类型
    labelText: '提出时间', // 控件显示的文本
    placeholder: '请选择提出时间',
    fieldName: 'proposeTime',
    fieldConfig: {
      size: 'small'
    },
    rules: [{ required: true, message: '必须选择提出时间' }]
  },
  {
      type: 'blank',
      labelText: '处理人',
      fieldName: 'receiveUserName',
      slotName: 'receiveUserName',
      colLayout: 'singleCol',
      rules: [{ required: true, message: '必须选择处理人' }]
  },
  {
    type: 'textarea',
    labelText: '处理意见',
    fieldName: 'customItem2',
    placeholder: '请输入处理意见',
    colLayout: 'singleCol'
  },
  {
    type: 'hidden',
    fieldName: 'type',
    defaultValue: '11502'
  },
  {
    type: 'hidden',
    fieldName: 'editType',
    defaultValue: 'problem'
  },
  {
    type: 'hidden',
    fieldName: 'status',
    defaultValue: ''
  }
]

export default {
  name: 'KteamsEdit',
  components: {
    'el-input': Input,
    'el-button': Button,
    FormList,
    CommonDialog,
    SelectUser,
    SelectTask
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
    rowId: {
      type: String
    },
    wholeDescribeId: {
      type: String
    }
  },
  data () {
    return {
      confirmLoading: false,
      saveApi: 'problemManager.problemSave',
      visible1: false,
      visible2: false,
      visible3: false,
      selectedRow: {},
      selectedRow1: {},
      selectedRow2: {},
      dialogHeight: 600,
      dataSource: [],
      formData: {
        id: null,
        problemDescribe: null,
        problemType: null,
        introDucer: null,
        introDucerName: null,
        receiveUserId: null,
        receiveUserName: null,
        customItem2: null,
        proposeTime: null,
        name: null,
        projectTasksId: null,
        editType: null,
        status: null
      },
      dialogConfig: {
        modal: true,
        appendToBody: true,
        modalAppendToBody: true
      }
    }
  },
  created () {
    this.formTrigger()
  },
  mounted () {
  },
  methods: {
    submitHandle (e) {
      this.$refs.form.handleSubmit(e)
    },
    fpHandle (e) {
      this.formData.status = '6507'
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
      if (this.rowId && this.rowId !== '') {
        this.getProblemDetail(this.rowId)
      }
    },
    getProblemDetail (rowId) {
      let that = this
      this.$api['problemManager.getProblemInfo']({ id: rowId }).then(function (res) {
        let data = res
        that.formData.id = data.id
        that.formData.problemDescribe = data.problemDescribe
        that.formData.problemType = data.problemType
        that.formData.introDucer = data.introDucer
        that.formData.introDucerName = data.introDucerName
        that.formData.receiveUserId = data.receiveUserId
        that.formData.receiveUserName = data.receiveUserName
        that.formData.customItem2 = data.customItem2
        that.formData.proposeTime = data.proposeTime
        that.formData.name = data.name
        that.formData.projectTasksId = data.wtxxId
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
    closeModal (selectedRow) {
      this.visible1 = false
      this.selectedRow = selectedRow
      console.log(this.selectedRow)
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
    }
  }
}
</script>
