<template>
    <div>
      <form-list ref="form" @rendered="rendered" :form="formData"
                @saved="saved" :dataSource="dataSource" :api="saveApi">
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
let dataSource1 = [
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
              callback(new Error('名称已被使用！'))
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
    placeholder: '长度为1的大写字母。例如：X',
    colLayout: 'singleCol',
    rules: [
      {
        required: true,
        message: '必填'
      },
      {
        validator: (rule, value, callback) => {
            let reg = new RegExp('^[A-Za-z]{1}$')
            if (reg.test(value)) {
                api['baseData.dicRepeatedCodeCheck']({ dicMajorCode: value, dicId: dicId, dicType: dicType }).then(res => {
                    if (res === 'false') {
                        callback(new Error('项目分级编号已被使用！'))
                        return
                    }
                    callback()
                }).catch(function (error) {
                    console.log(error)
                })
            } else {
                callback(new Error('项目分级编号格式不符合规则'))
            }
        }
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
  name: 'EditDic',
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
    },
      dateNumber: {
          type: Number,
          default: 0
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
      dicType = this.dicType
      me = this
        console.log(this.formType)
      if (this.formType && this.formType === '1') {
        // this.dataSource = dataSource1
        this.dataSource = Object.assign([], dataSource1)
      } else {
        this.dataSource = Object.assign([], dataSource2)
      }
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
        this.formData.dicType = this.dicType
          this.formData.dicOrderNo = this.dateNumber
      }
    },
    getDicInfo (dicId) {
      let that = this
      this.$api['baseData.getDicInfo']({ dicId: dicId }).then(function (res) {
        let data = res
        that.formData.dicId = data.id
        that.formData.dicType = that.dicType
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
