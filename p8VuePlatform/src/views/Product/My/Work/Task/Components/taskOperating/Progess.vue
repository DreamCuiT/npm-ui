<template>
  <form-table ref="formtable"
              :formData="formData"
              :formType="formType"
              :leafChildrenIsFinished="leafChildrenIsFinished"
              :isHaveParentTaskParentId="isHaveParentTaskParentId"
              :formRules="formRules"
              :tableApi="tableApi"
              :tableParams="tableParams"
              :columns="columns"
              @submit="progressSubmit"
              @progress-date-change="progressDateChange"
              @progress-change="progressChange">
    <!-- @progressReal="progressReal"  -->
    <!--      <template #dialog-con>-->
    <!--        <common-dialog title="偏离类型填写提示" width="300px" :visible="dialogVisible" :dialogConfig="dialogConfig"-->
    <!--          @handle-cancel="dialogCancel" @handle-ok="dialogOk">-->
    <!--          <template #dialog>-->
    <!--            <div class="dialog-content">超期任务, 是否填写本次偏离信息?</div>-->
    <!--          </template>-->
    <!--        </common-dialog>-->
    <!--      </template>-->
  </form-table>
</template>
<script>
import FormTable from './FormTable'
import moment from 'moment'
// import { P8Dialog as CommonDialog } from '~/index'
export default {
  name: 'Progess',
  components: {
    FormTable
  },
  inject: ['getPlanInfo'],
  computed: {
    planInfoParams () {
      return this.getPlanInfo()
    }
  },
  watch: {
    leafChildrenIsFinished () {
      this.progressChange(this.getPlanInfo().progress)
    }
  },
  data () {
    let columns = [
      {
        title: '序号',
        type: 'index',
        width: '55px',
        align: 'center'
      },
      {
        title: '状态',
        dataIndex: 'status',
        formatter: (row) => {
          if (this.planInfoParams.allStatus && row.status) {
            return this.planInfoParams.allStatus.filter(item => item.value === row.status)[0].label
          }
        },
        align: 'center'
      },
      {
        title: '进度',
        dataIndex: 'progress',
        formatter: (row) => {
          return row.progress * 100 + '%'
        },
        align: 'center'
      },
      {
        title: '进度说明',
        minWidth: 200,
        dataIndex: 'content',
        align: 'center'

      },
      {
        title: '反馈时间',
        dataIndex: 'itemCreateTime',
        align: 'center'

      }
    ]
    return {
      leafChildrenIsFinished: false,
      isHaveParentTaskParentId: false,
      formType: {
        constType: 'Progress',
        overdue: false,
        overdueChange: false,
        progressRealEnd: false,
        progressRealBegin: false
      },
      formData: {
        progress: 0,
        // status: '',
        forecastDateRange: '',
        // statusOptions: [],
        forecastBeginDate: '',
        forecastEndDate: '',
        realBeginDate: '',
        realEndDate: '',
        content: ''
        // deviationType: '',
        // deviationCauses: '', // 偏离原因
        // deviationImpact: '', // 偏离影响
        // deviationSolutions: '' // 偏离备注
      },
      formRules: {
        deviationType: [
          { required: true, message: '请选择偏离类型' }
        ],
        forecastBeginDate: [
          { required: true, message: '必选' }
        ],
        forecastEndDate: [
          { required: true, message: '必选' }
        ],
        realBeginDate: [
          { required: true, message: '必选' }
        ],
        realEndDate: [
          { required: true, message: '必选' },
          {
            validator: (rule, value) => {
              let that = this
              return new Promise((resolve, reject) => {
                console.log(that.formData, 'that.formData')
                let isBefore = moment(value).isBefore(moment(that.formData.realBeginDate))
                if (isBefore) {
                  let msg = `不得早于实际开始日期: ${that.formData.realBeginDate}`
                  reject(msg)
                } else {
                  resolve()
                }
              })
            }
          }
        ]
      },
      tableApi: 'taskManager.progressFeedbackHistory',
      tableParams: { taskId: this.getPlanInfo().taskId },
      columns,
      dialogVisible: false,
      dialogConfig: {
        modal: false,
        // 'append-to-body': false,
        'modal-append-to-body': false,
        'custom-class': 'custom-dialog-class',
        'show-close': false
      }
    }
  },
  created () {
    this.leafChildIsFinished()
  },
  mounted () {
    // console.log('---ddd---', this.planInfoParams)
    this.initUpdateFromData()
    this.progressChange(this.getPlanInfo().progress)
  },
  methods: {
    initUpdateFromData () {
      this.formData.progress = this.planInfoParams.progress
      this.formData.forecastDateRange = [this.planInfoParams.forecastBeginDate, this.planInfoParams.forecastEndDate]
      this.formData.forecastBeginDate = this.planInfoParams.forecastBeginDate
      this.formData.forecastEndDate = this.planInfoParams.forecastEndDate
      this.formData.realBeginDate = this.planInfoParams.realBeginDate
      this.formData.realEndDate = this.planInfoParams.realEndDate
      this.formData.content = this.planInfoParams.content
      let leaf = this.getPlanInfo().isLeaf
      // eslint-disable-next-line eqeqeq
      if (leaf == '0') {
        this.formData.leaf = true
      } else {
        this.formData.leaf = false
      }
      // progress-下, 判断当前任务是否超期, 超期展示弹窗提示
      if (!(moment().isBefore(this.planInfoParams.forecastEndDate))) {
        const statusEnd = this.planInfoParams.allStatus.filter(item => item.progressRange[0] === '1') // ('6600'. '6700')
        if (!(statusEnd.find((item) => item.value === this.planInfoParams.status))) {
          this.dialogVisible = true
        }
      }
    },
    leafChildIsFinished () {
      /**
       * 叶子节点 isLeaf: 0--判断是否是叶子节点, 不是请求接口确认子节点是否完
       */
      if (this.getPlanInfo().isLeaf) {
        const api = 'taskManager.isChildrenFinished'
        const _this = this
        this.$api[api]({ taskId: _this.getPlanInfo().taskId }).then(res => {
          if (res) {
            _this.leafChildrenIsFinished = res
          }
        })
        /**
         * 任务的父任务是否有父id
         */
        const apiIsHaveParentTaskParentId = 'taskManager.isHaveParentTaskParentId'
        this.$api[apiIsHaveParentTaskParentId]({ taskId: _this.getPlanInfo().taskId }).then(res => {
          if (res) {
            _this.isHaveParentTaskParentId = res
          }
        })
      } else {
        /**
         * 任务的父任务是否有父id
         */
        const _this = this
        const apiIsHaveParentTaskParentId = 'taskManager.isHaveParentTaskParentId'
        this.$api[apiIsHaveParentTaskParentId]({ taskId: _this.getPlanInfo().taskId }).then(res => {
          if (res) {
            _this.isHaveParentTaskParentId = res
          }
        })
      }
    },
    dialogCancel () {
      this.dialogVisible = false
    },
    dialogOk () {
      // 弹窗提示点击确定--表示人员要填写偏离相关的信息, 展示偏离模块(信息为必填)
      this.dialogVisible = false
      this.formType.overdue = true
      let deviation = {
        deviationType: '',
        deviationCauses: '', // 偏离原因
        deviationImpact: '', // 偏离影响
        deviationProgress: '', // 进展情况
        solutions: '' // 偏离备注
      }
      this.formData = { ...this.formData, ...deviation }
    },
    progressDateChange (date) {
      let endTime = date.maxDate
      if (!endTime) {
        this.formType.overdueChange = false
        return
      }
      if (!(moment(endTime).isBefore(this.planInfoParams.forecastEndDate))) {
        this.formType.overdueChange = true
        this.formData = { ...this.formData, ...{ changeCauseClassify: '', reason: '' } }
      } else {
        this.formType.overdueChange = false
      }
      this.formData.forecastDateRange = [date.minDate, date.maxDate]
    },
    progressChange (val) {
      /**
       *
       * val= 0: 编辑 预计开始/预计完成
       * 0< val<100: 编辑 预计完成/实际开始
       * val= 100: 编辑 实际开始/实际完成
       * 审批中 完成: 取消所有时间框编辑
       */

      let rst = this.progressToShowRealDate(val)
      this.formType.progressRealBegin = rst.realBeginDate
      this.formRules.realBeginDate[0].required = !rst.realBeginDate
      this.formType.progressRealEnd = rst.realEndDate
      this.formRules.realEndDate[0].required = false // 点击保存或提交审批时再校验是否选填了实际完成时间
      this.formType.progressForecastBegin = rst.forecastBeginDate
      this.formRules.forecastBeginDate[0].required = !rst.forecastBeginDate
      this.formType.progressForecastEnd = rst.forecastEndDate
      this.formRules.forecastEndDate[0].required = !rst.forecastEndDate
    },
    progressToShowRealDate (newProgress) {
      let key = ''
      let managerStatus = this.getPlanInfo().managerStatus // 当前管理状态  [6406,6409]审批中 完成
      let normalProgress = this.getPlanInfo().progress || 0 // 数据库的已保存的进度  newProgress 实时更改的进度
      let isLeaf = this.getPlanInfo().isLeaf // 是否子 0: 是    1: 否
      let leafChildrenIsFinished = this.leafChildrenIsFinished // 子是否完成
      let autoScheduling = this.autoScheduling // 任务排程  '1' 自动  '2'：手动
      // 父任务
      if (isLeaf) { // 父任务不能修改实际开始时间
        if (managerStatus === '6406' || managerStatus === '6409') { // 管理状态为 审批中/完成
          key = 'finish'
        } else {
          if (autoScheduling === '1') {
            key = 'autofinish' // 排程自动 不能修改预计时间 子完成 可以修改实际完成时间 子未完成 不能修改实际完成时间
          } else {
            key = 'unAutofinish' // 排程手动 未开始可以修改预计时间 进行中只可修改预计完成时间
          }
        }
      } else {
        key = managerStatus === '6406' || managerStatus === '6409' ? 'finish' : normalProgress === 0 ? 'mix' : normalProgress === 100 ? 'max' : 'middle'
      }

      let obj = {
        'finish': () => { // 管理状态为 审批中/完成
          return { 'realBeginDate': true, 'realEndDate': true, 'forecastBeginDate': true, 'forecastEndDate': true }
        },
        'mix': () => { // 子任务初始normalProgress 为0
          return { 'realBeginDate': newProgress === 0, 'realEndDate': newProgress !== 100, 'forecastBeginDate': newProgress > 0, 'forecastEndDate': newProgress === 100 }
        },
        'middle': () => { // 子任务初始normalProgress 为0-100
          return { 'realBeginDate': false, 'realEndDate': newProgress !== 100, 'forecastBeginDate': true, 'forecastEndDate': newProgress === 100 }
        },
        'max': () => { // 子任务初始normalProgress 为100
          return { 'realBeginDate': false, 'realEndDate': false, 'forecastBeginDate': true, 'forecastEndDate': true }
        },
        'unAutofinish': () => { // 父任务排程手动
          return { 'realBeginDate': true, 'realEndDate': !leafChildrenIsFinished, 'forecastBeginDate': normalProgress > 0, 'forecastEndDate': false }
        },
        'autofinish': () => { // 父任务排程自动
          return { 'realBeginDate': true, 'realEndDate': !leafChildrenIsFinished, 'forecastBeginDate': true, 'forecastEndDate': true }
        }
      }
      return obj[key]()
    },
    progressSubmit (form, submitType) {
      let params = this.submitParamsHandle(form, submitType)
      // console.log('progress-form-params', params)
      const _this = this
      this.$api['taskManager.progressFeedback'](params).then(res => {
        _this.progressChange(_this.getPlanInfo().progress)
        _this.$message({
          type: 'success',
          message: '成功'
        })
        _this.$bus.$emit('refresh')
      })
    },
    submitParamsHandle (form, submitType) {
      let _this = this
      let progress = ['progress', 'content', 'realBeginDate', 'realEndDate', 'forecastBeginDate', 'forecastEndDate']
      let deviate = ['deviationType', 'deviationCauses', 'deviationImpact', 'deviationProgress', 'solutions']
      let params = {
        pmTaskProgressFeedback: {
          planInfoId: _this.planInfoParams.planInfoId,
          pmProjectTasksId: _this.planInfoParams.taskId,
          status: _this.statusByProgress(submitType),
          content: form.content,
          customItem1: submitType,
          customItem2: submitType
        }
      }
      progress.forEach(key => {
        if (key === 'forecastDateRange') {
          params.pmTaskProgressFeedback.forecastBeginDate = moment(form[key][0]).format('YYYY-MM-DD')
          params.pmTaskProgressFeedback.forecastEndDate = moment(form[key][1]).format('YYYY-MM-DD')
        } else if (key === 'progress') {
          params.pmTaskProgressFeedback['progress'] = form['progress'] / 100
        } else if (key === 'content') {
          params.pmTaskProgressFeedback['content'] = form[key]
        } else if ((key === 'realBeginDate' && form[key]) || (key === 'realEndDate' && form[key])) {
          params.pmTaskProgressFeedback[key] = moment(form[key]).format('YYYY-MM-DD')
        } else if (key === 'forecastBeginDate' && form[key]) {
          params.pmTaskProgressFeedback.forecastBeginDate = moment(form[key]).format('YYYY-MM-DD')
        } else if (key === 'forecastEndDate' && form[key]) {
          params.pmTaskProgressFeedback.forecastEndDate = moment(form[key]).format('YYYY-MM-DD')
        }
      })

      if (this.formType.overdue) {
        params.pmTaskDeviationCauses = {
          planInfoId: _this.planInfoParams.planInfoId,
          pmProjectTasksId: _this.planInfoParams.taskId
        }
        deviate.forEach(key => {
          if (key === 'deviationProgress') {
            params.pmTaskDeviationCauses.progress = form[key]
          }
          params.pmTaskDeviationCauses[key] = form[key]
        })
      }
      if (this.formType.overdueChange) {
        params.pmTaskChangeRequest = {
          planInfoId: _this.planInfoParams.planInfoId,
          pmProjectTasksId: _this.planInfoParams.taskId,
          forecastBeginDate: moment(form.forecastDateRange[0]).format('YYYY-MM-DD'),
          forecastEndDate: moment(form.forecastDateRange[1]).format('YYYY-MM-DD'),
          changeCauseClassify: form.changeCauseClassify,
          reason: form.reason
        }
      }
      return params
    },
    statusByProgress (submitType) { // 根据进度--获取对应的状态 --需优化
      let progress = this.formData.progress
      let normalStatus = this.planInfoParams.status
      let status = ''
      if (progress === 0) {
        if (normalStatus === '6020') {
          status = '6020'
        }
        // if (normalStatus === '6100' || normalStatus === '6200') {
        //   status = '6200'
        // }
      } else {
        status = '6050' // 6500
      }
      // else if (progress === 100) {
      //   status = submitType === 'progress' ? '6500' : '6600'
      // }

      return status
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__wrapper {
  position: absolute !important;
  background-color: rgba(0, 0, 0, 0.1);
  .custom-dialog-class {
    width: 30% !important;
    height: 160px;
    min-width: 200px;
    div.el-dialog__body {
      height: 60px;
    }
    div.dialog-content {
      padding: 8px 20px;
    }
  }
}
</style>
