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
  name: 'FormListEdit',
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
      saveApi: 'formGenerator.formListSave',
      dataSource: [
        {
          type: 'text',
          labelText: '表单编码',
          fieldName: 'desformCode',
          placeholder: '请输入表单编码',
          colLayout: 'singleCol',
          rules: [
            {
              required: true
            }
          ]
        },
        {
          type: 'text',
          labelText: '表单名称',
          fieldName: 'desformName',
          placeholder: '请输入表单名称',
          colLayout: 'singleCol',
          rules: [
            {
              required: true
            }
          ]
        },
        {
          type: 'textarea',
          labelText: '表单描述',
          fieldName: 'desformDesc',
          colLayout: 'singleCol',
          placeholder: '请输入表单描述'
        },
        // {
        //   type: 'select',
        //   labelText: '绑定数据源',
        //   fieldName: 'cgFormTableId',
        //   placeholder: '选择数据源',
        //   colLayout: 'singleCol',
        //   options: [
        //     {
        //       label: 'text1',
        //       value: '0'
        //     },
        //     {
        //       label: 'text2',
        //       value: '1'
        //     }
        //   ],
        //   rules: [
        //     {
        //       required: true
        //     }
        //   ]
        // },
        {
          type: 'select',
          labelText: '发布状态',
          fieldName: 'desformStatus',
          placeholder: '下拉选择你要的',
          colLayout: 'singleCol',
          options: [
            {
              label: '未发布',
              value: '0'
            },
            {
              label: '已发布',
              value: '1'
            }
          ],
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
