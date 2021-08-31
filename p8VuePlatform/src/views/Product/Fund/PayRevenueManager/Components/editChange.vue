<template>
  <div>
    <common-dialog :title="changeTitle"
                   :visible="visible"
                   @close="handleCancel"
                   width="500px"
                   :dialogHeight="180"
                   :showHandleBtn="false"
                   :dialogConfig="dialogConfig"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false">
      <template #dialog>
        <form-list ref="form"
                   :form="formData"
                   @saved="saved"
                   :labelWidth="labelWidth"
                   :dataSource="dataSource"
                   :api="saveApi">
        </form-list>
      </template>
    </common-dialog>
  </div>
</template>

<style scoped>
</style>

<script>

import { P8Form as FormList } from '~/index'
import { P8Dialog as CommonDialog } from '~/index'

export default {
  name: 'Edit',
  components: {
    FormList,
    CommonDialog
  },
  props: {
    visible: {
      type: Boolean
    },
    otherParam: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      confirmLoading: false,
      labelWidth: '140px',
      revenueYearInfoId: '',
      changeTitle: '',
      formData: {},
      saveApi: 'ComeInRevenue.submitRevenueChangedReason',
      dataSource: [
      ],
      dialogConfig: {
        'append-to-body': true
      }
    }
  },
  created () {
    this.formData = Object.assign({}, { ...this.otherParam, reason: '' })
    this.revenueYearInfoId = this.otherParam.revenueYearInfoId
    this.changeTitle = this.otherParam.changeTitle
    this.initColumns()
  },
  methods: {
    initColumns () {
      let that = this
      let dataSource = [

        {
          type: 'textarea',
          labelText: '年度预算变更原因',
          fieldName: 'reason',
          colLayout: 'singleCol',
          placeholder: '请输入原因',
          rules: [
            {
              required: true,
              message: '必填'
            }
          ]
        }

      ]
      that.dataSource = dataSource
    },
    showMessage (obj, message, type) {
      obj.$message({
        message: message,
        type: type
      })
    },
    saved (res) {
      console.log('edit saved', res)
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
<style lang="scss" scoped>
.el-dialog__body {
  padding: 15px !important;
}
</style>
