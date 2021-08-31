<template>
  <el-dialog :title="dialogTitle"
             width="50%"
             :visible="visible"
             append-to-body
             destroy-on-close
             @close="handleCancel">
    <div :style="{'height':flexHeight+'px'}">
      <form-list ref="form"
                 :form="formData"
                 @saved="saved"
                 :labelWidth="labelWidth"
                 :dataSource="dataSource"
                 :api="saveApi">
      </form-list>
    </div>
  </el-dialog>
</template>
<script>
import { Dialog } from '~/index'
import { P8Form as FormList } from '~/index'
const mh = document.documentElement.clientHeight - 425
export default {
  name: 'EditChangeForm',
  components: {
    'el-dialog': Dialog,
    FormList
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    otherParam: {
      type: Object,
      default: () => { }
    },
    changeType: {
      type: String,
      default: ''
    },
    dialogTitle: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      flexHeight: mh,
      saveApi: 'collectionBudget.submitRevenueChangedReasonOther',
      labelWidth: '120px',
      comp: this,
      existCustomBtn: true,
      formData: {},
      dataSource: [
        {
          type: 'textarea',
          labelText: '预算变更原因',
          placeholder: '请填写变更原因',
          fieldName: 'textMsg',
          colLayout: 'singleCol',
          options: [],
          rules: [{ required: true, message: '必须填写变更原因' }]

        }
      ]
    }
  },
  created () {
    this.formData = Object.assign({}, this.otherParam)
    this.formData.flag = this.changeType
  },
  methods: {
    handleCancel () {
      this.$emit('close-dialog', this.otherParam)
    },
    saved (res) {
      console.log('edit saved')
      this.$emit('save-success', res)
    }
  }
}
</script>
