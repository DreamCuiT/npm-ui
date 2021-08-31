<template>
  <form-table ref="formtable"
              :formData="formData"
              :formType="formType"
              :tableApi="tableApi"
              :tableParams="tableParams"
              :columns="columns"
              @submit="deviateSubmit"></form-table>
</template>
<script>
import FormTable from './FormTable'
export default {
  name: 'Deviate',
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
        width: '55px',
        align: 'center'
      },
      {
        title: '偏离类型',
        dataIndex: 'deviationType',
        width: '100px',
        align: 'center'
      },
      {
        title: '偏离原因',
        dataIndex: 'deviationCauses',
        columnConfig: { // 表格列内容过长隐藏并显示Tooltip
          'show-overflow-tooltip': true
        },
        align: 'left'
      },
      {
        title: '偏离影响',
        dataIndex: 'deviationImpact',
        columnConfig: { // 表格列内容过长隐藏并显示Tooltip
          'show-overflow-tooltip': true
        },
        align: 'left'
      },
      {
        title: '进展情况',
        dataIndex: 'progress',
        columnConfig: { // 表格列内容过长隐藏并显示Tooltip
          'show-overflow-tooltip': true
        },
        align: 'left'
      },
      {
        title: '解决方案',
        dataIndex: 'solutions',
        columnConfig: { // 表格列内容过长隐藏并显示Tooltip
          'show-overflow-tooltip': true
        },
        align: 'left'
      },
      {
        title: '反馈时间',
        dataIndex: 'itemCreateTime',
        align: 'left'
      }
    ]
    return {
      formType: {
        constType: 'Deviate',
        overdue: false
      },
      formData: {
        deviationType: '',
        deviationCauses: '', // 偏离原因
        deviationImpact: '', // 偏离影响
        deviationProgress: '',
        solutions: '' // 偏离备注
      },
      tableApi: 'taskManager.deviationReasonsHistory',
      tableParams: { taskId: this.getPlanInfo().taskId },
      columns
    }
  },
  mounted () {
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
            if (key === 'deviationProgress') {
              _this.formData[key] = data.progress
            } else {
              _this.formData[key] = data[key]
            }
          })
        }
      })
    },
    deviateSubmit (form) {
      let params = this.submitParamsHandle(form)
      // console.log('deviate-form-params', params)
      this.$api['taskManager.deviationReasons'](params).then(res => {
        this.$refs.formtable.searchTable()
        this.$message({
          type: 'success',
          message: '偏离原因反馈成功'
        })
      })
    },
    submitParamsHandle (form) {
      let _this = this
      let deviate = ['deviationType', 'deviationCauses', 'deviationImpact', 'deviationProgress', 'solutions']
      let params = {
        pmTaskDeviationCauses: {
          planInfoId: _this.planInfoParams.planInfoId,
          pmProjectTasksId: _this.planInfoParams.taskId
        }
      }
      deviate.forEach(key => {
        if (key === 'deviationProgress') {
          params.pmTaskDeviationCauses.progress = form[key]
        } else {
          params.pmTaskDeviationCauses[key] = form[key]
        }
      })
      return params
    }
  }
}
</script>
<style lang="scss">
</style>
