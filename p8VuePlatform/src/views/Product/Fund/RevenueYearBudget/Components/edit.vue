<template>
  <div>
    <common-dialog title="发起年度预算"
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
    }
  },
  data () {
    return {
      confirmLoading: false,
      labelWidth: '80px',
      formData: {},
      saveApi: 'RevenueYearBudget.saveYearRevenue',
      dataSource: [
      ],
      dialogConfig: {
        'append-to-body': true
      }
    }
  },
  created () {
    this.initColumns()
  },
  methods: {
    initColumns () {
      let that = this
      let dataSource = [

        {
          type: 'select',
          labelText: '选择年份',
          placeholder: '请选择年份',
          fieldName: 'years',
          colLayout: 'singleCol',
          optionUrl: {
            api: 'YearRevenueInfo.getYearData',
            params: { revenueInfoId: '' }
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
