<template>
  <div>
    <common-dialog title="发起当前项目年度预算"
                   :visible="visible"
                   @close="handleCancel"
                   width="300px"
                   :dialogHeight="150"
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
                   :isCustomValidate="true"
                   @custom-validate="customValidate"
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
    revenueInfoId: {
      type: String,
      default: ''
    },
    wholeDescribeId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      confirmLoading: false,
      labelWidth: '80px',
      revenueInfoIdTemp: '',
      formData: {},
      saveApi: 'YearRevenueInfo.saveSingleYearRevenue',
      dataSource: [
      ],
      dialogConfig: {
        'append-to-body': true
      }
    }
  },
  created () {
    this.revenueInfoIdTemp = this.revenueInfoId
    this.formData = Object.assign({}, { revenueInfoId: this.revenueInfoId, wholeDescribeId: this.wholeDescribeId })
    this.initColumns()
  },
  methods: {
    initColumns () {
      let that = this
      let dataSource = [
        {
          type: 'hidden',
          fieldName: 'revenueInfoId'
        },
        {
          type: 'hidden',
          fieldName: 'wholeDescribeId'
        },
        {
          type: 'select',
          labelText: '选择年份',
          placeholder: '请选择年份',
          fieldName: 'years',
          colLayout: 'singleCol',
          optionUrl: {
            api: 'YearRevenueInfo.getYearData',
            params: { revenueInfoId: that.revenueInfoId }
          },
          options: [],
          rules: [{ required: true, message: '必须选择年份' }]

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
    customValidate (saveParams) {
      let that = this
      console.log('saveParams', saveParams)
      that.$api['YearRevenueInfo.checkIsGoYearRevenue'](saveParams).then(res => {
        console.log('res', res)
        if (res) {
          var name = res.name
          var year = res.year
          let resultMsg = '该项目:' + '[' + name + '] ' + year + '年度预算未发布'
          that.showMessage(that, resultMsg, 'error')
        } else {
          that.$refs.form.submitForm(saveParams, this.saveApi)
        }
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
<style lang="scss" scoped>
.el-dialog__body {
  padding: 15px !important;
}
</style>
