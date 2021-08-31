<template>
    <form-list ref="form"
               @rendered="rendered"
               @saved="saved"
               :dataSource="dataSource"
               :api="saveApi"
               :form="modify"
               :other-param="otherParam">
    </form-list>
</template>

<script>
import { P8Form as FormList } from '~/index'
export default {
  name: 'DocumentEdit',
  props: {
    record: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    FormList
  },
  data () {
    return {
      saveApi: 'documentManagement.saveDocumentManagement',
      modify: {},
      otherParam: {},
      dataSource: [
        {
          type: 'text',
          labelText: '文件名称',
          fieldName: 'name',
          placeholder: '请输入流程名称',
          colLayout: 'singleCol',
          rules: [
            {
              required: true,
              message: '必填'
            }
          ]
        },
        {
          type: 'textarea',
          fieldName: 'description',
          labelText: '标识描述',
          placeholder: '请输入文件描述',
          colLayout: 'doubleCol'
        }
      ]
    }
  },
  mounted () {
    this.modify = Object.assign({}, this.record)
  },
  methods: {
    saved () {
      this.$emit('close')
    },
    rendered () {

    }
  }
}
</script>

<style scoped>

</style>
