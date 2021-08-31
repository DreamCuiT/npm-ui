<template>
  <common-dialog
      :title="title"
      @close="handleCancel"
      :visible="visible"
      :dialogConfig="dialogConfig"
      :showHandleBtn="false"
      :dialog-height=460
  >
    <template #dialog>
      <form-list
          ref='form'
          @rendered='rendered'
          @saved='saved'
          :form='formData'
          :dataSource='dataSource'
          :is-custom-validate='isCustomValidate'
          @custom-validate='customValidate'
          :api='saveApi'
          :other-param='otherParam'
      >
      </form-list>
        <selectApproveUserBeforehand v-if="isSelectApproveUserBeforehandView"
                                     :isSelectApproveUserBeforehandView="isSelectApproveUserBeforehandView"
                                     :selectUserBeforehandDataSource="selectUserBeforehandDataSource"
                                     :selectUserBeforehandFormData="selectUserBeforehandFormData"
                                     @close-modal="closeSelectApproveUserBeforehand"
                                     @commit="commitSelectApproveUserBeforehand"></selectApproveUserBeforehand>
    </template>
  </common-dialog>
</template>
<script>
import { P8Form as FormList } from '~/index'
import { P8Dialog as CommonDialog } from '~/index'
import SelectApproveUserBeforehand from '@/views/Framework/BusinessActivity/ProcessApproval/selectApproveUserBeforehand'
import { nextApproveUserBeforehand } from '@/assets/commonJS/BusinessActivity/nextApproveUserBeforehand'
export default {
  name: 'submitChange',
  components: {
    FormList,
    CommonDialog,
    SelectApproveUserBeforehand
  },
  props: {
    changeId: {
      type: String,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    },
    createPage: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      saveApi: 'planChange.changeRecordInfoSave',
      isCustomValidate: true,
      title: '计划变更提交',
      isSelectApproveUserBeforehandView: false,
      selectUserBeforehandDataSource: [],
      selectUserBeforehandFormData: {},
      isBeforehand: true, // 是否预先设置审批人模式
      saveParams: {},
      dialogConfig: {
        modal: false
      },
      dataSource: [
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
          rules: [
            {
              required: true,
              message: '必填'
            }
          ],
          options: []
        },
        {
          labelText: '变更原因',
          type: 'textarea',
          fieldName: 'reason',
          placeholder: '请输入活动描述',
          colLayout: 'singleCol',
          fieldConfig: {
            rows: '6'
          },
          rules: [
            {
              required: true,
              message: '必填'
            }
          ]
        },
        {
          labelText: '影响分析',
          type: 'textarea',
          fieldName: 'measure',
          placeholder: '请输入活动描述',
          colLayout: 'singleCol',
          fieldConfig: {
            rows: '6'
          }
        },
        {
          type: 'select',
          labelText: '是否记录变更',
          fieldName: 'weatherChange',
          colLayout: 'singleCol',
          placeholder: '选择排程类型',
          options: [
            { 'label': '是', 'value': '0' },
            { 'label': '否', 'value': '1' }
          ]
        }
      ],
      modify: {},
      otherParam: {
        id: ''
      },
      formData: {}
    }
  },
  methods: {
    rendered () {
      let that = this
      if (that.changeId) {
        this.$api['planChange.changeRecordInfo']({ id: that.changeId }).then(function (res) {
          if (res) {
            that.formData.changeType = res.changeType
            that.formData.reason = res.reason
            that.formData.measure = res.measure
            that.formData.weatherChange = res.weatherChange
            that.otherParam = { id: res.id, planInfoId: res.planInfoId }
            that.formData = Object.assign({}, that.formData)
          }
        }).catch(function (error) {
          console.log(error)
        })
      }
    },
    customValidate (saveParams) {
      this.saveParams = saveParams
      if (this.isBeforehand) {
        this.nextApproveUserBeforehand()
      } else {
        this.$refs.form.submitForm(saveParams, this.saveApi)
      }
    },
    saved (res) {
      if (res && res.processInstanceIds && res.processInstanceIds.length > 0) {
        this.$emit('save-success', res)
      }
    },
    handleCancel () {
      this.$emit('save-success', true)
    },
    nextApproveUserBeforehand () {
      let that = this
      let processDefinitionKey = ''
      if (this.createPage === 'planChange') {
        processDefinitionKey = 'planChangeApprove'
        this.saveParams.processDefinitionKey = 'planChangeApprove'
      } else if (this.createPage === 'userChange') {
        processDefinitionKey = 'planChangeApproveTask'
        this.saveParams.processDefinitionKey = 'planChangeApproveTask'
      } else {
        this.$message({
          message: '操作失败！参数异常',
          type: 'warning'
        })
      }
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
      this.saveParams.beforehandParams = { ...fullParams }
      this.$refs.form.submitForm(this.saveParams, this.saveApi)
    }
  }
}
</script>
