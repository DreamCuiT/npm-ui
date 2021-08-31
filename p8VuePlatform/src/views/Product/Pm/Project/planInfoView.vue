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
          labelText: '计划开始时间',
          fieldName: 'beginTime',
          colLayout: 'doubleCol'
        },
        {
          type: 'view',
          labelText: '计划完成时间',
          fieldName: 'endTime',
          colLayout: 'doubleCol'
        },
        {
          type: 'view',
          labelText: '预计起始时间',
          fieldName: 'forecastBeginTime',
          colLayout: 'doubleCol'
        },
        {
          type: 'view',
          labelText: '预计完成时间',
          fieldName: 'forecastEndTime',
          colLayout: 'doubleCol'
        },
        {
          type: 'view',
          labelText: '责任令组',
          fieldName: 'dutyGroupName',
          colLayout: 'singleCol'
        },
        {
          type: 'view',
          labelText: '组长',
          fieldName: 'groupL',
          colLayout: 'doubleCol'
        },
        {
          type: 'view',
          labelText: '副组长',
          fieldName: 'groupLF',
          colLayout: 'doubleCol'
        },
        {
          type: 'view',
          labelText: '总调度',
          fieldName: 'dispatcher',
          colLayout: 'doubleCol'
        },
        {
          type: 'view',
          labelText: '副总调度',
          fieldName: 'dispatcherF',
          colLayout: 'doubleCol'
        },
        {
          type: 'view',
          labelText: '团队成员',
          fieldName: 'member',
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
            that.formData.dutyGroupName = res.dutyGroupName
            that.formData.indexNo = res.indexNo
            that.formData.groupL = res.groupL
            that.formData.groupLF = res.groupLF
            that.formData.dispatcher = res.dispatcher
            that.formData.dispatcherF = res.dispatcherF
            that.formData.member = res.member
            that.formData.beginTime = moment(res.planBeginDate).format('YYYY-MM-DD')
            that.formData.endTime = moment(res.planEndDate).format('YYYY-MM-DD')
            that.formData.forecastBeginTime = moment(res.forecastBeginDate).format('YYYY-MM-DD')
            that.formData.forecastEndTime = moment(res.forecastEndDate).format('YYYY-MM-DD')
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
  },
  watch: {
    planInfoId () {
      this.rendered()
    }
  }
}
</script>
