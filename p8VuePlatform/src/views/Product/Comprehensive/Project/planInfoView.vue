<template>
  <div>
    <form-list
        ref='form'
        @rendered='rendered'
        :form='formData'
        :dataSource='dataSource'
        :other-param='otherParam'
    >
    </form-list>
  </div>
</template>
<script>
import moment from 'moment'
import { P8Form as FormList } from '~/index'
export default {
  name: 'PlanView',
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
          labelText: '项目',
          slotName: 'select-project',
          fieldName: 'name',
          colLayout: 'singleCol'
        },
        {
          type: 'view',
          labelText: '计划编号',
          fieldName: 'planCode',
          colLayout: 'singleCol'
        },
        {
          type: 'view',
          labelText: '计划名称',
          fieldName: 'planName',
          colLayout: 'singleCol'
        },
        {
          type: 'view',
          labelText: '排序号',
          fieldName: 'indexNo',
          colLayout: 'singleCol'
        },
        {
          type: 'view',
          labelText: '计划起始时间',
          fieldName: 'beginEndTime',
          colLayout: 'singleCol'
        },
        {
          type: 'view',
          labelText: '预计起始时间',
          fieldName: 'forecastTime',
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
        this.$api['planInfoManager.getPlanInfo']({ planInfoId: that.planInfoId }).then(function (res) {
          if (res) {
            that.formData.name = res.name
            that.formData.planCode = res.planCode
            that.formData.planName = res.planName
            that.formData.indexNo = res.indexNo
            that.formData.beginEndTime = [moment(res.planBeginDate).format('YYYY-MM-DD'), moment(res.planEndDate).format('YYYY-MM-DD')]
            that.formData.forecastTime = [moment(res.forecastBeginDate).format('YYYY-MM-DD'), moment(res.forecastEndDate).format('YYYY-MM-DD')]
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
