<template>
  <div>
    <form-list
        ref='form'
        @rendered='rendered'
        :form='formData'
        :dataSource='dataSource'
        :other-param='otherParam'
        :existDefaultBtn="false"
    >
    </form-list>
  </div>
</template>
<script>
import { P8Form as FormList } from '~/index'
export default {
  name: 'DutyView',
  components: {
    FormList
  },
  props: {
    planInfoId: String
  },
  data () {
    return {
      labelWidth: 'auto',
      dataSource: [
        {
          type: 'view',
          labelText: '责任令组名称',
          slotName: 'select-project',
          fieldName: 'name',
          colLayout: 'singleCol'
        },
        {
          type: 'view',
          labelText: '责任令组简称',
          fieldName: 'short_name',
          colLayout: 'singleCol'
        },
        {
          type: 'view',
          labelText: '年度',
          fieldName: 'year',
          colLayout: 'singleCol'
        },
        {
          type: 'view',
          labelText: '排序号',
          fieldName: 'index_no',
          colLayout: 'singleCol'
        }
      ],
      otherParam: {},
      modify: {},
      formData: {}
    }
  },
  methods: {
    rendered () {
      if (this.planInfoId) {
        let that = this
        this.$api['DutyToken.editDuty']({ id: that.planInfoId }).then(function (res) {
          if (res) {
            that.formData.id = res.id
            that.formData.createUserId = res.createUserId
            that.formData.year = res.year
            that.formData.name = res.name
            that.formData.short_name = res.short_name
            that.formData.index_no = res.index_no
            that.formData = Object.assign({}, that.formData)
          }
        }).catch(function (error) {
          console.log(error)
        })
      }
    },
    closeModal () {
      this.selectProjectVisible = false
    }
  }
}
</script>
