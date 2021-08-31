<template>
    <div>
      <form-list ref="form" :form="formData" @saved="saved" :dataSource="dataSource" :api="saveApi"  @rendered="rendered">
      </form-list>
    </div>
</template>

<style scoped>

</style>

<script>

import { P8Form as FormList } from '~/index'

export default {
  name: 'EditDic',
  components: {
    FormList
  },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
  data () {
    return {
      confirmLoading: false,
      saveApi: 'commonResourcesPlan.myTaskStatusSave',
      dataSource: [
          {
              type: 'radio',
              labelText: '状态',
              fieldName: 'status',
              options: [
                  { label: '已接收', value: '12302' },
                  { label: '进行中', value: '12303' },
                  { label: '已完成', value: '12304' }
              ],
              colLayout: 'singleCol',
              rules: [
                  {
                      required: true,
                      message: '必填'
                  }
              ]
          },
          {
              type: 'hidden', // 控件类型
              fieldName: 'id',
              colLayout: 'singleCol'
          }
      ],
      formData: {}
    }
  },
  watch: {
      id: {
          handler: function (val, oldVal) {
              this.formData.id = val
          },
          immediate: true // 当前页面一进来就对 id 进行监听
      }
  },
  methods: {
      rendered () {
          if (this.formData.id && this.formData.id !== '') {
              this.getStatus(this.formData.id)
          }
      },
      getStatus (id) {
          let that = this
          that.$api['commonResourcesPlan.getCommResourcesPlanById']({ id: id }).then(function (res) {
              this.formData = Object.assign({}, res)
          }).catch(function (error) {
              console.log(error)
          })
      },
      saved (res) {
          this.$emit('save-success', res)
      }
  }
}
</script>
