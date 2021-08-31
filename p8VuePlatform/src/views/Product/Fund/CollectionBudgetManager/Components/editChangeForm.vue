<template>
  <form-list ref="form"
             :form="formData"
             @saved="saved"
             :labelWidth="labelWidth"
             :dataSource="dataSource"
             :existCustomBtn="existCustomBtn"
             :api="saveApi">
  </form-list>
</template>
<script>

import { P8Form as FormList } from '~/index'
export default {
  name: 'EditChangeForm',
  components: {
    FormList
  },
  data () {
    return {

      saveApi: '',
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

  methods: {
    saved (res) {
      console.log('edit saved')
      this.$emit('save-success', res)
    }
  }
}
</script>
