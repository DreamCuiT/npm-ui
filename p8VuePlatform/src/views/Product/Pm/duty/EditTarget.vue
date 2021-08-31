<template>
    <div>
        <form-list
                ref='form'
                @rendered='rendered'
                @saved='saved'
                :form='formData'
                :dataSource='dataSource'
                :api='saveApi'
                :other-param='otherParam'
        >
        </form-list>
    </div>
</template>

<script>
import { P8Form as FormList } from '~/index'
export default {
  name: 'editTarget',
  props: {
    dutyGroupId: {
      type: String,
      default: undefined
    }
  },
  components: {
    FormList
  },
  data () {
    return {
      saveApi: 'DutyGroupTarget.createOrUpdate',
      belongToView: false,
      formData: {
        id: '',
        dutyGroupId: this.dutyGroupId,
        belongToUnitName: undefined,
        belongTo: undefined
      },
      otherParam: {},
      dataSource: [
        {
          type: 'text',
          labelText: '目标名称',
          fieldName: 'targetName',
          placeholder: '请输入目标名称',
          colLayout: 'singleCol',
          rules: [{ required: true, message: '必填' }]
        },
        {
          type: 'select',
          labelText: '类型',
          fieldName: 'type',
          colLayout: 'singleCol',
          options: [
            {
              label: '生产交付',
              value: '0'
            },
            {
              label: '回款',
              value: '1'
            }
          ],
          rules: [{ required: true, message: '必填' }]
        },
        {
          type: 'number',
          labelText: '金额',
          fieldName: 'amount',
          colLayout: 'singleCol',
          placeholder: '请输入表单描述'
        },
        {
          type: 'datetime',
          labelText: '时间要求',
          fieldName: 'timeOrder',
          colLayout: 'singleCol',
          rules: [{ required: true, message: '必填' }]
        },
        {
          type: 'select',
          multiple: false,
          labelText: '所属单位',
          fieldName: 'belongTo',
          defaultValue: [],
          placeholder: '请选择所属部门',
          optionUrl: {
            api: 'DutyGroupTarget.getDeptByType',
            params: {}
          },
          treeData: [],
          rules: [{ required: true, message: '必填' }]
        }
      ]
    }
  },
  methods: {
    mounted () {},
    rendered () {},
    saved (res) {
      if (res && res.id) {
        this.formData.id = res.id
      }
      this.$emit('save-success', res)
    },
    closeBelongToView (selectedRows) {
      this.belongToView = false
      if (selectedRows) {
        this.formData.belongTo = selectedRows.id
        this.formData.belongToUnitName = selectedRows.name
        this.formData = Object.assign({}, this.formData)
      }
    }
  }
}
</script>

<style scoped>

</style>
