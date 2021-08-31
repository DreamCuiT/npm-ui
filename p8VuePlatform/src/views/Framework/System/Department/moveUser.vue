<template>
  <form-list
    ref="form"
    :api="saveApi"
    :dataSource="dataSource"
    :form="formData"
    @saved="saved"
    @rendered="rendered"
    :is-custom-validate="isCustomValidate"
    @custom-validate="customValidate"></form-list>
</template>
<script>
import { P8Form as FormList } from '~/index'
export default {
  name: 'DepartmentMoveUserView',
  components: {
    FormList
  },
  props: {
    recordId: {
      type: String,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: ''
    }
  },
  data () {
    return {
      saveApi: 'departmentManger.moveUser',
      detailApi: 'departmentManger.deptInfo',
      isCustomValidate: true,
      formData: {
        name: '',
        parentId: '',
        id: ''
      },
      dataSource: [
        {
          type: 'text',
          labelText: '原部门名称',
          fieldName: 'name',
          defaultValue: '',
          fieldConfig: {
            disabled: true
          }
        },
        {
          type: 'treeSelect',
          labelText: '所属部门',
          fieldName: 'parentId',
          defaultValue: [],
          optionUrl: { api: 'departmentManger.deptTree', params: { deptId: this.recordId } },
          clearable: true,
          defaultExpandAll: true,
          multiple: false,
          disabled: false,
          checkStrictly: true,
          treeData: [],
          // treeProps: {
          //   value: 'value',
          //   children: 'children',
          //   label: 'label'
          // },
          rules: [
            {
              required: true,
              message: '必须选择部门',
              trigger: 'input'
            }
          ]
        }
      ]
    }
  },
  methods: {
    rendered () {
      this.getInfo()
    },
    saved (res) {
      this.$emit('saveSuccess', res)
    },
    getInfo () {
      if (this.recordId) {
        this.$api[this.detailApi]({ id: this.recordId }).then(res => {
          Object.keys(this.formData).forEach(key => {
            this.formData[key] = res[key]
          })
        })
      } else {
        Object.keys(this.formData).forEach(key => {
          this.formData[key] = ''
        })
      }
    },
    customValidate (saveParams) {
      let params = {
        deptId: saveParams.parentId,
        oldDeptId: this.recordId
      }
      console.log('customValidate', saveParams, params)
      this.$refs.form.submitForm(params, this.saveApi)
    }
  }
}
</script>
