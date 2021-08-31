<template>
    <form-list ref="form"
               @rendered="rendered"
               @saved="saved"
               :dataSource="dataSource"
               :api="saveApi"
               :form="modify"
               :other-param="otherParam"
               :existDefaultBtn="false">
    </form-list>
</template>

<script>
import { P8Form as FormList } from '~/index'
export default {
  name: 'DocumentView',
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
      saveApi: '',
      modify: {},
      otherParam: {},
      dataSource: [
        {
          type: 'view',
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
          type: 'view',
          labelText: '上传人',
          fieldName: 'createUserName',
          colLayout: 'singleCol'
        },
        {
          type: 'view',
          fieldName: 'description',
          labelText: '标识描述',
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
      this.$emit('editSaveOK')
    },
    rendered () {

    }
  }
}
</script>

<style scoped>

</style>
