<template>
  <form-table ref="formtable" :formData="formData" :formType="formType"
    :tableApi="tableApi" :tableParams="tableParams" :columns="columns"
    @submit="changeSubmit"></form-table>
</template>
<script>
import FormTable from './FormTable'
import moment from 'moment'
export default {
  name: 'Change',
  components: {
    FormTable
  },
  inject: ['getPlanInfo'],
  computed: {
    planInfoParams () {
      return this.getPlanInfo()
    }
  },
  data () {
    const columns = [
      {
        title: '序号',
        type: 'index',
        width: '45px',
        align: 'center'
      },
      {
        title: '变更原因分类',
        dataIndex: 'changeCauseClassify',
        width: '150px',
        align: 'left'
      },
      {
        title: '变更原因',
        dataIndex: 'reason',
        columnConfig: {
          'show-overflow-tooltip': true
        },
        align: 'left'
      },
      {
        title: '反馈时间',
        dataIndex: 'itemCreateTime',
        width: '150px',
        align: 'center'
      }
    ]
    return {
      formType: {
        constType: 'Change',
        overdue: false
      },
      formData: {
        changeCauseClassify: '',
        reason: '',
        changeDateRange: ''
      },
      tableApi: 'taskManager.changeRequestHistory',
      tableParams: { taskId: this.getPlanInfo().taskId },
      columns
    }
  },
  mounted () {
    // console.log('---ddd---', this.planInfoParams)
    this.getLastHistory()
  },
  methods: {
    getLastHistory () {
      const _this = this
      this.$api[this.tableApi]({
        taskId: _this.getPlanInfo().taskId
      }).then(res => {
        if (res && res.length) {
          let data = res[0]
          Object.keys(_this.formData).forEach(key => {
            if (key === 'changeDateRange') {
              _this.formData[key] = [data.forecastBeginDate, data.forecastEndDate]
            } else {
              _this.formData[key] = data[key]
            }
          })
        }
      })
    },
    changeSubmit (form) {
      let params = this.submitParamsHandle(form)
      // console.log('change-form-params', params)
      this.$api['taskManager.changeRequest'](params).then(res => {
        this.$refs.formtable.searchTable()
        this.$message({
          type: 'success',
          message: '变更申请反馈成功'
        })
      })
    },
    submitParamsHandle (form) {
      let _this = this
      let change = ['changeCauseClassify', 'reason', 'changeDateRange'] // 'changeDateRange'
      let params = {
        pmTaskChangeRequest: {
          planInfoId: _this.planInfoParams.planInfoId,
          pmProjectTasksId: _this.planInfoParams.taskId
        }
      }
      change.forEach(key => {
        if (key === 'changeDateRange') {
          params.pmTaskChangeRequest.forecastBeginDate = moment(form[key][0]).format('YYYY-MM-DD')
          params.pmTaskChangeRequest.forecastEndDate = moment(form[key][1]).format('YYYY-MM-DD')
        } else {
          params.pmTaskChangeRequest[key] = form[key]
        }
      })
      return params
    }
  }
}
</script>
<style lang="scss">

</style>
