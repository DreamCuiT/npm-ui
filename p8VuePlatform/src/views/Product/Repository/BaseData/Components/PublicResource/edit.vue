<template>
    <div>
        <form-list ref="form"
         :form="formData"
         @rendered="rendered" @saved="saved" :dataSource="dataSource" :api="saveApi" :otherParam="otherParam">
        </form-list>
    </div>
</template>
<style scoped>
</style>
<script>
import { P8Form as FormList } from '~/index'
let me = {}
// dataSource1为共性资源库列表，dataSource2为共性资源类型列表，列表展示根据父组件传入formType参数值决定
let dataSource1 = [
  {
    type: 'text',
    labelText: '资源名称',
    fieldName: 'resName',
    placeholder: '请输入资源名称',
    colLayout: 'singleCol',
    rules: [
      {
        required: true,
        message: '必填'
      },
      {
        validator: (rule, value, callback) => {
          me.$api['baseData.repeatedNameCheck']({ resId: resId, resName: value, resType: resType }).then(res => {
            if (res === 'false') {
              callback(new Error('名称已被使用！'))
              return
            }
            callback()
          })
        },
        trigger: 'blur'
      }
    ]
  },
  {
    type: 'hidden', // 控件类型
    fieldName: 'resId',
    urlParam: true
  },
  {
    type: 'text', // 控件类型
    labelText: '资源编号', // 控件显示的文本
    fieldName: 'resCode',
    placeholder: '请输入资源编号', // 默认控件的空值文本
    colLayout: 'singleCol',
    rules: [
      {
        required: true,
        message: '必填'
      },
      {
        validator: (rule, value, callback) => {
          me.$api['baseData.repeatedCodeCheck']({ resId: resId, resCode: value, resType: resType }).then(res => {
            if (res === 'false') {
              callback(new Error('编号重复'))
              return
            }
            callback()
          })
        },
        trigger: 'blur'
      }
    ]
  },
  {
    labelText: '资源类型',
    type: 'select',
    fieldName: 'resCommonResourceTypesId',
    placeholder: '请选择资源类型',
    colLayout: 'singleCol',
    optionUrl: {
      api: 'baseData.getPublicResourceTypes',
      params: {

      }
    },

    options: [],
    rules: [
      {
        required: true,
        message: '必填'
      }
    ]
  },
  {
    labelText: '排序号',
    type: 'number',
    fieldName: 'resOrderNo',
    placeholder: '请输入排序号',
    colLayout: 'singleCol'
  },
  {
    type: 'textarea',
    labelText: '备注',
    fieldName: 'resRemark',
    placeholder: '请输入备注',
    colLayout: 'singleCol',
    rules: [
      {
        maxLength: 128
      }
    ]
  }

]

let dataSource2 = [
  {
    type: 'hidden',
    fieldName: 'resId',
    urlParam: true
  },
  {
    type: 'text',
    labelText: '名称',
    fieldName: 'resName',
    placeholder: '请输入名称',
    colLayout: 'singleCol',
    rules: [
      {
        required: true,
        message: '必填'
      },
      {
        validator: (rule, value, callback) => {
          me.$api['baseData.repeatedNameCheck']({ resId: resId, resName: value, resType: resType }).then(res => {
            if (res === 'false') {
              callback(new Error('名称重复'))
              return
            }
            callback()
          })
        },
        trigger: 'blur'
      }
    ]
  },
    {
        type: 'multiple',
        labelText: '管理厂所',
        fieldName: 'deptIdArr',
        defaultValue: '',
        placeholder: '',
        optionUrl: {
                api: 'userManager.getThreeLvDept',
                value: 'id',
                label: 'name'
            },
        rules: [
            {
                required: true,
                message: '必填'
            }
        ]
    },
  {
    type: 'number',
    labelText: '排序号',
    fieldName: 'resOrderNo',
    placeholder: '请输入排序号',
    colLayout: 'singleCol'
  }
]

let resType = ''
let resId = ''

export default {
  name: 'EditResource',
  components: {
    FormList
  },
  props: {
    resId: {
      type: String,
      default: ''
    },
    formType: {
      type: String,
      default: ''
    },
      dateNumber: {
          type: Number,
          default: 0
      }
  },
  data () {
    return {
      saveApi: 'baseData.resSave',
      dataSource: '',
      modify: {},
      otherParam: {
        resType: this.formType
      },
      formData: {

      }
    }
  },

  created () {
    this.formTrigger()
  },
  methods: {
    formTrigger () {
      resType = this.formType
      resId = this.resId
      me = this
      if (this.formType && this.formType === '1') {
        this.dataSource = dataSource1
      } else {
        this.dataSource = dataSource2
      }
    },
    showMessage (obj, message, type) {
      obj.$message({
        message: message,
        type: type
      })
    },
    rendered () {
      console.log(this.resId)
      if (this.resId && this.resId !== '') {
        this.getResData(this.resId)
      } else {
          this.formData.resOrderNo = this.dateNumber
      }
    },
    clickEvent () {
      console.log('click')
    },
    getResData (resId) {
      let that = this
      if (that.formType) {
        that.$api['baseData.getPublicResourceInfo']({ resId: resId, resType: that.formType }).then(function (res) {
          let data = res
          // if(that.formType == "1"){
          that.formData.resId = data.id
          that.formData.resName = data.name
          that.formData.resCode = data.code
          that.formData.resOrderNo = data.orderNo
          that.formData.deptIdArr = data.deptIdArr
          that.formData.resCommonResourceTypesId = data.resCommonResourceTypesId
          that.formData.resRemark = data.remark
          that.formData = Object.assign({}, that.formData)
        }).catch(function (error) {
          console.log('error' + error)
        })
      }
    },
    saved (res) {
      console.log('edit saved')
      this.$emit('saveSuccess', res)
    },
    handleChange (info) {
      console.log(info, 'info')
    }
  }

}

// function repeatedNameCheck (rule, value) {
//   console.log(this.formType)
//   let that = this
//   return new Promise((resolve, reject) => {
//     resRepeatedNameCheckAPI({ resId: that.resId, resName: value, resType: that.formType }).then(res => {
//       console.log(res.data.content)
//       if (res.data.content && res.data.content == 'error') {
//         reject('名称已被使用！')
//       } else {
//         resolve()
//       }
//     })
//   })
// }

</script>
