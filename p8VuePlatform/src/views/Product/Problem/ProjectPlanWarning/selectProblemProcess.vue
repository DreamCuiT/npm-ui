<template>
  <common-dialog :title="title"
                 :visible="visible"
                 destroy-on-close
                 @close="handleCancel"
                 width="1200px"
                 :dialogHeight="dialogHeight"
                 :showHandleBtn="false"
                 :dialogConfig="dialogConfig"
                 :close-on-click-modal="false"
                 :close-on-press-escape="false">
    <template #dialog>
      <form-list ref="form"
                 @rendered="rendered"
                 style="height:100%"
                 :form="formData"
                 :dataSource="dataSource"
                 :existDefaultBtn="false"
                 :existCustomBtn='false'>
      </form-list>
    </template>
  </common-dialog>
</template>
<style scoped>
</style>
<script>
import { P8Form as FormList } from '~/index'
import { P8Dialog as CommonDialog } from '~/index'
// require styles
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-dark.css'
import 'codemirror/mode/sql/sql'

let dataSource = [
  {
    type: 'view',
    labelText: '计划任务',
    fieldName: 'name',
    colLayout: 'singleCol'
  },
  {
    type: 'view',
    labelText: '问题描述',
    fieldName: 'problemDescribe',
    colLayout: 'singleCol'
  },
  {
    colLayout: 'doubleCol',
    type: 'view',
    labelText: '问题分类',
    fieldName: 'problemTypeDisplay',
    optionUrl: {
      api: 'thirdPartInterface.getDic',
      params: { dicType: 'SUMMARY_PROGRESS' }
    },
    options: []
  },
  {
    colLayout: 'doubleCol',
    type: 'view',
    labelText: '问题类型',
    fieldName: 'typeDisplay',
    optionUrl: {
      api: 'thirdPartInterface.getDic',
      params: { dicType: 'SUMMARY_PROGRESS' }
    },
    options: []
  },
  {
    type: 'view',
    labelText: '提出人',
    fieldName: 'introDucerName',
    colLayout: 'doubleCol'
  },
  {
    type: 'view', // 控件类型
    labelText: '提出时间', // 控件显示的文本
    placeholder: '请选择提出时间',
    fieldName: 'proposeTime',
    colLayout: 'doubleCol',
    fieldConfig: {
      size: 'small'
    }
  },
  {
    type: 'view',
    labelText: '处理人',
    fieldName: 'receiveUserName',
    colLayout: 'doubleCol'
  },
  {
    type: 'view',
    labelText: '处理状态',
    fieldName: 'statusDisplay',
    colLayout: 'doubleCol'
  },
  {
    type: 'view',
    labelText: '处理意见',
    fieldName: 'customItem2',
    placeholder: '请输入处理意见',
    colLayout: 'singleCol'
  },
  {
    type: 'view',
    labelText: '处理结果',
    fieldName: 'customItem5',
    colLayout: 'singleCol'
  }
  // {
  //   type: 'upload',
  //   labelText: '文件上传',
  //   fieldName: 'getFile',
  //   colLayout: 'singleCol',
  //   uploadConfig: {
  //     drag: false
  //   },
  //   listType: 'text' // 带密级的上传附件为'secret'，不带密级的listType分为'text'、'picture'、'picture-card'
  // }
]

export default {
  name: 'KteamsEdit',
  components: {
    FormList,
    CommonDialog
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
    const height = document.documentElement.clientHeight - 660
    return {
      renderHeight: height + 'px',
      confirmLoading: false,
      dialogHeight: 600,
      dataSource: [],
      formData: {
        id: null,
        problemDescribe: null,
        problemTypeDisplay: null,
        typeDisplay: null,
        introDucer: null,
        introDucerName: null,
        receiveUserId: null,
        receiveUserName: null,
        statusDisplay: null,
        customItem2: null,
        customItem5: null,
        proposeTime: null,
        name: null,
        projectTasksId: null,
        editType: null
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
      this.$api['problemManager.getProblemInfoRecord']({ id: rowId }).then(function (res) {
        let data = res
        that.formData.id = data.id
        that.formData.problemDescribe = data.problemDescribe
        that.formData.problemTypeDisplay = data.problemTypeDisplay
        that.formData.typeDisplay = data.typeDisplay
        that.formData.introDucer = data.introDucer
        that.formData.introDucerName = data.introDucerName
        that.formData.receiveUserId = data.receiveUserId
        that.formData.receiveUserName = data.receiveUserName
        that.formData.statusDisplay = data.statusDisplay
        that.formData.customItem2 = data.customItem2
        that.formData.customItem5 = data.customItem5
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
    }
  }
}
</script>
