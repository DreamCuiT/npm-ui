<template>
  <div>
    <common-dialog title="预算退回"
                   :visible="visible"
                   @close="handleCancel"
                   width="500px"
                   :dialogHeight="200"
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
      labelWidth: '120px',
      revenueInfoIdTemp: '',
      formData: {},
      saveApi: 'revenueFullBudget.deblockingRevenueInfo',
      dataSource: [
      ],
      dialogConfig: {
        'append-to-body': true
      }
    }
  },
  created () {
    this.revenueInfoIdTemp = this.revenueInfoId
    this.formData = Object.assign({}, { status: '', revenueInfoId: this.revenueInfoId, wholeDescribeId: this.wholeDescribeId })
    this.initColumns()
  },
  methods: {
    initColumns () {
      let that = this
      let dataSource = [

        {
          type: 'radioButton',
          labelText: '预算退回状态',
          fieldName: 'nextId',
          colLayout: 'singleCol',
          fieldConfig: {
            'size': 'mini'
          },
          optionUrl: {
            api: 'revenueFullBudget.getRevenueStatusData',
            params: { revenueInfoId: that.revenueInfoId }
          },
          options: [],
          // options: [
          //   { label: '收款预算编制', value: 'inCome' },
          //   { label: '二级经费编制', value: 'pay' },
          //   { label: '一级经费编制', value: 'pay1' }

          // ],
          rules: [
            {
              required: true,
              message: '请选择预算退回状态'
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
