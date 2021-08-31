<template>
  <form-list
    ref="form"
    :dataSource="dataSource"
    :form="formData"
    :api="saveApi"
    @saved="saved"
    labelWidth="90px"
    @rendered="rendered"
  ></form-list>
</template>

<script>
import { P8Form as FormList } from '~/index'
export default {
  name: 'CompEdit',
  components: {
    FormList
  },
  props: {
    record: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      saveApi: 'formGenerator.compSave',
      dataSource: [
        {
          type: 'text',
          labelText: '组件名称',
          fieldName: 'compName',
          placeholder: '请输入组件名称',
          colLayout: 'singleCol',
          rules: [
            {
              required: true
            }
          ]
        },
        {
          type: 'text',
          labelText: '组件标识',
          fieldName: 'compCode',
          placeholder: '请输入组件标识',
          colLayout: 'singleCol',
          rules: [
            {
              required: true
            }
          ]
        },
        {
          type: 'select',
          labelText: '启用状态',
          fieldName: 'compStatus',
          placeholder: '下拉选择你要的',
          colLayout: 'singleCol',
          options: [
            {
              label: '未启用',
              value: '0'
            },
            {
              label: '已启用',
              value: '1'
            }
          ],
          rules: [
            {
              required: true
            }
          ]
        },
        {
          type: 'select',
          labelText: '组件类型',
          fieldName: 'compType',
          placeholder: '下拉选择你要的',
          colLayout: 'singleCol',
          options: [
            {
              label: '输入型组件',
              value: '8001'
            },
            {
              label: '选择型组件',
              value: '8002'
            },
            {
              label: '布局型组件',
              value: '8003'
            }
          ],
          rules: [
            {
              required: true
            }
          ]
        },
        {
          type: 'text',
          labelText: 'icon',
          fieldName: 'compIcon',
          placeholder: '请选择icon',
          colLayout: 'singleCol',
          rules: [
            {
              required: true
            }
          ]
        },
        {
          type: 'textarea',
          labelText: 'jsonData',
          fieldName: 'jsonData',
          placeholder: '请填写jsonData',
          colLayout: 'singleCol',
          rules: [
            {
              required: true
            }
          ]
        }
      ],
      formData: {}
    }
  },
  methods: {
    rendered () {
      // 所有表单元素渲染后调用rendered
      if (this.record.id) {
        this.getFormData()
      }
    },
    getFormData () {
      this.formData = Object.assign({}, this.record)
    },
    saved (res) {
      console.log('修改页面关闭时的回调方法')
      this.$emit('saveSuccess', res)
    }
  }
}
</script>
