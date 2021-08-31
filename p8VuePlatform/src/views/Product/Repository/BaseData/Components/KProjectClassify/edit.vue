<template>
    <div>
        <form-list ref="form" @rendered="rendered" @saved="saved"
        :form="formData"
        :dataSource="dataSource"
        :api="saveApi"
        :other-param="otherParam">
        </form-list>
    </div>
</template>
<style scoped>
</style>
<script>
import { P8Form as FormList } from '~/index'

export default {
  name: 'EditClassify',
  components: {
    'form-list': FormList
  },
  props: {
    classifyId: {
      type: String,
      default: ''
    },
    projectCategory: {
      type: String,
      default: ''
    },
    categoryDisp: {
      type: String,
      default: ''
    },
    parentId: {
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
      saveApi: 'baseData.projectClassifySave',
      monitorPointsData: [],
      checkMonitorPointsData: [],
      formData: {
        classifyId: '',
        classifyName: '',
        classifyNo: '',
        classifyIndexNo: '',
        classifyProjectCategory: '',
        projectCategoryDisp: '',
        classifyParentId: '',
        monitorPointIds: []
      },
      dataSource: [
        {
          type: 'text',
          labelText: '项目类型名称',
          fieldName: 'classifyName',
          placeholder: '请输入项目类型名称',
          colLayout: 'singleCol',
          rules: [
            {
              required: true,
              message: '项目类型名称不能为空！'
            },
            {
              validator: (rule, value, callback) => {
                let that = this
                that.$api['baseData.pcRepeatedNameCheck']({ classifyId: that.classifyId, classifyName: value }).then(res => {
                  if (res === 'false') {
                    callback(new Error('项目类型名称已被使用！'))
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
          type: 'hidden',
          fieldName: 'classifyId',
          urlParam: true
        },
        {
          type: 'hidden',
          fieldName: 'classifyProjectCategory',
          urlParam: true
        },
        {
          type: 'hidden',
          fieldName: 'classifyParentId',
          urlParam: true
        },
        {
          type: 'text',
          labelText: '项目类型编号',
          fieldName: 'classifyNo',
          placeholder: '长度为2的大写字母或数字。例如：XK，2K',
          colLayout: 'singleCol',
          rules: [
            {
              required: true,
              message: '项目类型编号不能为空！'
            },
            {
              validator: (rule, value, callback) => {
                let that = this
                  let reg = new RegExp('^[A-Za-z0-9]{2}$')
                  if (reg.test(value)) {
                      that.$api['baseData.pcRepeatedCodeCheck']({ classifyId: that.classifyId, classifyNo: value }).then(res => {
                          if (res === 'false') {
                              callback(new Error('项目类型编号已被使用！'))
                              return
                          }
                          callback()
                      })
                  } else {
                      callback(new Error('编号格式不符合规则'))
                  }
              }
            }
          ]
        },
        {
          type: 'text',
          labelText: '所属项目类别',
          fieldName: 'projectCategoryDisp',
          colLayout: 'singleCol',
          fieldConfig: {
            readOnly: true
          }
        },
        {
          labelText: '项目类型排序号',
          type: 'number',
          fieldName: 'classifyIndexNo',
          placeholder: '请输入项目类型排序号',
          colLayout: 'singleCol'
        }
        // 2020/7/31屏蔽，与标识管理功能重复
        // ,
        // {
        //   type: 'checkboxGroup',
        //   labelText: '计划标识',
        //   fieldName: 'monitorPointIds',
        //   defaultValue: [],
        //   optionUrl: {
        //     api: 'baseData.getPCMonitorPointsData',
        //     params: {
        //
        //     },
        //     label: 'label',
        //     value: 'value'
        //   },
        //   options: []
        // }
      ],
      modify: {},
      otherParam: {
      }
    }
  },
  methods: {
    rendered () {
        console.log(this.dateNumber, '22222')
      if (this.classifyId && this.classifyId !== '') {
        this.getClassifyData(this.classifyId)
      } else {
        this.formData.classifyProjectCategory = this.projectCategory
        this.formData.projectCategoryDisp = this.categoryDisp
        this.formData.classifyParentId = this.parentId
          this.formData.classifyIndexNo = this.dateNumber
      }
    },
    clickEvent () {
      console.log('click')
    },
    getClassifyData (classifyId) {
      let that = this
      that.$api['baseData.getProjectClassifyInfo']({ classifyId: classifyId }).then(function (res) {
       if (res) {
           let data = res
           that.formData.classifyId = data.id
           that.formData.classifyName = data.name
           that.formData.classifyNo = data.no
           that.formData.classifyIndexNo = data.indexNo
           that.formData.classifyProjectCategory = data.projectCategory
           that.formData.projectCategoryDisp = data.projectCategoryDisp
           if (data.mIds) {
               that.formData.monitorPointIds = data.mIds
           }
       }
      }).catch(function (error) {
        console.log('error' + error)
      })
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

</script>
