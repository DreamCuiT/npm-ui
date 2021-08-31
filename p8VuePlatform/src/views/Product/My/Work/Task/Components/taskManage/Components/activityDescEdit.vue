<template>
  <form-list
    ref="form"
    :dataSource="dataSource"
    :form="formData"
    :api="saveApi"
    :is-custom-validate="isCustomValidate"
    @custom-validate="customValidate"
    @saved="saved"
  ></form-list>
</template>
<script>
import { P8Form as FormList } from '~/index'
export default {
  name: 'ActivityDesc',
  inject: ['getPlanInfo'],
  components: {
    FormList
  },
  props: {
    activityDescData: {
      type: Array
    }
  },
  data () {
    const dataSource = [
      {
        type: 'view',
        labelText: '活动名称:',
        fieldName: 'name',
        colLayout: 'doubleCol'
      },
      {
        type: 'view',
        labelText: '时限(天):',
        fieldName: 'duration',
        colLayout: 'doubleCol'
      },
      // {
      //   type: 'view',
      //   labelText: '活动类型',
      //   fieldName: 'type',
      //   colLayout: 'doubleCol'
      // },
      {
        type: 'textarea',
        labelText: '活动描述:',
        fieldName: 'description',
        colLayout: 'singleCol'
      }
    ]
    return {
      saveApi: 'taskManager.saveActivityDescription',
      dataSource,
      formData: {
        name: '',
        duration: '',
        description: ''
      },
      isCustomValidate: true
    }
  },
  watch: {
    activityDescData: {
      handler: function (val, oldVal) {
        if (val && val.length) {
          let data = val[0]
          Object.keys(this.formData).forEach(key => {
            this.formData[key] = data[key]
          })
        } else {
          Object.keys(this.formData).forEach(key => {
            this.formData[key] = ''
          })
        }
        console.log('watch-formdata', this.formData)
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    saved () {
      this.$emit('editSaveOK', 'activityDesc')
    },
    customValidate (saveParams) {
      console.log('saveParams', saveParams)
      let params = {
        activityInfoId: this.activityDescData[0].activityInfoId,
        description: saveParams.description
      }
      let _this = this
      this.$refs.form.submitForm(params, _this.saveApi)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
