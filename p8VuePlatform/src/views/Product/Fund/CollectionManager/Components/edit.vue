<template>
  <div>
    <common-dialog title="收款节点信息"
                   :visible="visible"
                   @close="handleCancel"
                   width="500px"
                   :dialogHeight="340"
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
    canUseMoneyTemp: {
      type: Number
    },
    isLastCountTemp: {
      type: Number
    },
    formParam: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      confirmLoading: false,
      labelWidth: '120px',
      formData: {},
      canUseMoney: 0,
      isLastCount: 0,
      saveApi: 'collectionManager.saveOrUpdate',
      dataSource: [
      ],
      dialogConfig: {
        'append-to-body': true
      }
    }
  },
  created () {
    this.formData = Object.assign({}, this.formParam)
    this.canUseMoney = this.canUseMoneyTemp
    this.isLastCount = this.isLastCountTemp
    this.initColumns()
  },
  methods: {
    initColumns () {
      let that = this
      let dataSource = [
        {
          type: 'hidden',
          fieldName: 'id'
        },
        {
          type: 'hidden',
          fieldName: 'parentId'
        },
        {
          type: 'checkbox',
          labelText: '是否最后一笔收款',
          fieldName: 'lastOne',
          label: '当前节点为合同最后一笔回款时,请选择',
          colLayout: 'singleCol'
        },
        {
          type: 'text',
          labelText: '节点名称',
          fieldName: 'revenueName',
          placeholder: '请输入节点名称',
          colLayout: 'singleCol',
          rules: [
            {
              required: true,
              message: '必填'
            }
          ]
        },
        {
          type: 'number',
          labelText: '金额(万元)',
          fieldName: 'alreadyMoney',
          placeholder: '请输入金额',
          colLayout: 'singleCol',
          precision: 4,
          step: 1,
          max: this.canUseMoney,
          min: 0,
          rules: [
            {
              required: true,
              message: '必填'
            }
          ]
        },
        {
          type: 'datetime',
          labelText: '收款时间',
          fieldName: 'incomeTime',
          placeholder: '请选择收款时间',
          colLayout: 'singleCol',
          fieldConfig: {
            'value-format': 'yyyy-MM-dd'
          },
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
