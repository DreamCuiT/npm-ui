<template>
  <div>
    <form-list ref="form"
               @rendered="rendered"
               :form="formData"
               @saved="saved"
               :dataSource="dataSource"
               :api="saveApi">
    </form-list>
  </div>
</template>

<style scoped>
</style>

<script>

import { P8Form as FormList } from '~/index'
import api from '@/plugins/api'
let dicId = ''
let dicType = ''
let me = {}
let dataSource2 = [
  {
    type: 'text',
    labelText: '名称',
    fieldName: 'dicMeaning',
    placeholder: '请输入名称',
    colLayout: 'singleCol',
    rules: [
      {
        required: true,
        message: '必填'
      },
      {
        validator: (rule, value, callback) => {
          api['baseData.dicRepeatedNameCheck']({ dicMeaning: value, dicId: dicId, dicType: dicType }).then(res => {
            if (res === 'false') {
              me.showMessage(me, '名称重复', 'error')
              return
            }
            callback()
          }).catch(function (error) {
            console.log(error)
          })
        },
        trigger: 'blur'
      }
    ]
  },
  {
    type: 'text',
    labelText: '编号',
    fieldName: 'dicMajorCode',
    placeholder: '请输入编号',
    colLayout: 'singleCol',
    rules: [
      {
        required: true,
        message: '必填'
      },
      {
        validator: (rule, value, callback) => {
          api['baseData.dicRepeatedCodeCheck']({ dicMajorCode: value, dicId: dicId, dicType: dicType }).then(res => {
            if (res === 'false') {
              me.showMessage(me, '编号重复', 'error')
              return
            }
            callback()
          }).catch(function (error) {
            console.log(error)
          })
        },
        trigger: 'blur'
      }
    ]
  },
  {
    type: 'number',
    labelText: '排序号',
    fieldName: 'dicOrderNo',
    placeholder: '请输入排序号',
    colLayout: 'singleCol'
  }
]

export default {
  name: 'ClassifyEdit',
  components: {
    FormList
  },
  props: {
    record: {
      type: Object
    },
    visible: {
      type: Boolean
    },
    title: {
      type: String
    },
    dicId: {
      type: String
    },
    dicType: {
      type: dicType
    },
    formType: {
      type: String
    }
  },
  data () {
    return {
      confirmLoading: false,
      saveApi: 'baseData.dicSave',
      dataSource: [],
      formData: {}
    }
  },
  created () {
    this.formTrigger()
  },
  methods: {
    formTrigger () {
      dicId = this.dicId
      dicType = 'OWNER_TYPE'
      me = this
      this.dataSource = Object.assign([], dataSource2)
    },
    showMessage (obj, message, type) {
      obj.$message({
        message: message,
        type: type
      })
    },
    rendered () {
      if (this.dicId && this.dicId !== '') {
        this.getDicInfo(this.dicId)
      } else {
        this.formData.dicType = 'OWNER_TYPE'
      }
    },
    getDicInfo (dicId) {
      let that = this
      this.$api['baseData.getDicInfo']({ dicId: dicId }).then(function (res) {
        let data = res
        console.log(data)
        that.formData.dicId = data.id
        that.formData.dicType = 'OWNER_TYPE'
        that.formData.dicMeaning = data.meaning
        that.formData.dicMajorCode = data.majorCode
        that.formData.dicOrderNo = data.orderNo
        that.formData.remark = data.remark
        that.formData = Object.assign({}, that.formData)
      }).catch(function (error) {
        console.log(error)
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
