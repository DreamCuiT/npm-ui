<template>
  <form-list ref="form"
             @rendered="rendered"
             style="height:100%"
             :form="formData"
             @saved="saved"
             :dataSource="dataSource"
             :api="saveApi"
             :isCustomValidate="true"
             @custom-validate="parseCheck">
  </form-list>
</template>

<style scoped>
</style>

<script>
import { P8Form as FormList } from '~/index'

// require styles
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-dark.css'
import 'codemirror/mode/sql/sql'

let dataSource = [
  {
    type: 'view',
    labelText: '计划任务',
    fieldName: 'taskName',
    colLayout: 'doubleCol'
  },
  {
    colLayout: 'doubleCol',
    type: 'view',
    labelText: '分类',
    fieldName: 'problemType'
  },
  {
    type: 'view',
    labelText: '描述',
    fieldName: 'problemDescribe',
    colLayout: 'singleCol'
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
    labelText: '处理意见',
    fieldName: 'proCustomItem2',
    placeholder: '请输入处理意见',
    colLayout: 'doubleCol'
  },
  {
    type: 'view',
    labelText: '计划开始时间',
    fieldName: 'beginTime',
    placeholder: '请输入处理意见',
    colLayout: 'doubleCol'
  },
  {
    type: 'view',
    labelText: '计划结束时间',
    fieldName: 'endTime',
    placeholder: '请输入处理意见',
    colLayout: 'doubleCol'
  },
  {
    type: 'view',
    labelText: '事项',
    fieldName: 'content',
    colLayout: 'singleCol'
  },
  {
    type: 'view',
    labelText: '备注',
    fieldName: 'remark',
    colLayout: 'singleCol'
  },
  {
    type: 'textarea',
    labelText: '处理措施',
    fieldName: 'disposeResult',
    placeholder: '请输入处理措施',
    colLayout: 'singleCol',
    rules: [{ required: true, message: '必须填写处理措施' }]
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
    defaultValue: '6503'
  }
]

export default {
  name: 'KteamsEdit',
  components: {
    FormList
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
    }
  },
  data () {
    return {
      confirmLoading: false,
      saveApi: 'upcomingManager.saveUpcoming',
      uploadActionApi: '',
      selectedRow: {},
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
        proCustomItem2: null,
        proposeTime: null,
        editType: null,
        status: null,
        taskName: null,
        beginTime: null,
        endTime: null,
        content: null,
        remark: null,
        disposeResult: null,
        getFile: []
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
      if (this.entityId && this.entityId !== '') {
        this.getUpcomingDetail(this.entityId)
      }
    },
    getUpcomingDetail (entityId) {
      let that = this
      this.$api['upcomingManager.getUpcomingInfo']({ id: entityId }).then(function (res) {
        let data = res
        that.formData.id = data.id
        that.formData.problemDescribe = data.problemDescribe
        that.formData.problemType = data.problemType
        that.formData.introDucer = data.introDucer
        that.formData.introDucerName = data.introDucerName
        that.formData.receiveUserId = data.receiveUserId
        that.formData.receiveUserName = data.receiveUserName
        that.formData.proCustomItem2 = data.proCustomItem2
        that.formData.proposeTime = data.proposeTime
        that.formData.remark = data.remark
        that.formData.beginTime = data.beginTime
        that.formData.endTime = data.endTime
        that.formData.content = data.content
        that.formData.remark = data.remark
        that.formData.taskName = data.taskName
        that.formData.disposeResult = data.disposeResult
        that.formData.getFile = data.getFile || []
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
    parseCheck (saveParams) {
      let params = { ...saveParams }
      let _this = this
      // if (params.getFile === null || params.getFile === undefined) {
      //   _this.$alert('未上传附件，不可提交完成！', '提示', {
      //     confirmButtonText: '确定',
      //     type: 'warning'
      //   })
      // return false
      // }
      _this.$refs.form.submitForm(params, _this.saveApi)
    }
  }
}
</script>
