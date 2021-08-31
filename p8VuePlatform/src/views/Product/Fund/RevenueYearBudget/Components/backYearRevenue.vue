<template>
  <div>
    <common-dialog title="年度预算退回"
                   :visible="visible"
                   @close="handleCancel"
                   width="400px"
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
    },
    selectedIds: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      confirmLoading: false,
      labelWidth: '80px',
      formData: {},
      saveApi: 'RevenueYearBudget.saveBackYearRevenueInfo',
      dataSource: [
      ],
      dialogConfig: {
        'append-to-body': true
      }
    }
  },
  created () {
    this.formData = Object.assign({}, { sendBack: [], selectedIds: this.selectedIds })
    this.initColumns()
  },
  methods: {
    initColumns () {
      let that = this
      let dataSource = [
        {
          type: 'checkboxGroup',
          labelText: '指定环节',
          fieldName: 'sendBack',
          options: [
            { label: '收款预算编制', value: 'inCome' },
            { label: '支出预算编制', value: 'pay' }
          ],
          colLayout: 'singleCol',
          rules: [
            {
              required: true,
              message: '请选择指定环节'
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
