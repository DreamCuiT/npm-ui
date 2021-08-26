<template>
  <form-list :labelWidth="labelWidth" :form="formData" :dataSource="dataSource" :existDefaultBtn="false"></form-list>
</template>
<script>
import FormList from 'packages/form'
export default {
  name: 'viewRender',
  components: {
    FormList
  },
  props: {
    code: {
      type: String,
      default: ''
    },
    record: {
      type: Object,
      default: () => {
        return {}
      }
    },
    labelWidth: {
      type: String,
      defalut: '100px'
    }
  },
  data () {
    return {
      dataSource: [],
      formData: {}
    }
  },
  async mounted () {
    let _this = this
    let res = await this.$api['formGenerator.tableGetInfo']({ reportCode: this.code })
    if (res.reportItems.length) {
      res.reportItems.map(item => {
        if (item.isViewShow) {
          _this.dataSource.push({
            type: 'view',
            labelText: item.fieldTxt,
            fieldName: item.fieldName,
            colLayout: 'doubleCol'
          })
        }
      })
    }
    this.formData = Object.assign({}, this.record)
  }
}
</script>
