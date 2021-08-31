<template>
  <div style="position: relative;height: 520px;">
    <form-list class="describe-form" ref="form"
               :comp="comp"
               @rendered="rendered"
               form-layout="vertical"
               @saved="saved"
               :dataSource="dataSource"
               :api="saveApi"
               :is-custom-validate="isCustomValidate"
               @custom-validate="customValidate"
               :other-param="otherParam"
               :form="formData">
    </form-list>
  </div>
</template>
<style lang="scss" scoped>
  .describe-form {
    & /deep/ .view-item .el-form-item__label span {
      font-weight: normal !important;
    }
  }
</style>
<script>
import { P8Form as FormList } from '~/index'
import { mapGetters } from 'vuex'
import { GanttObject, updateforecastDate } from '@/assets/commonJS/ganttJS/ganttObject'
import { taskDescribesEditCheck, checkKeys } from '@/assets/commonJS/ganttJS/changeGantt'
import moment from 'moment'

export default {
  name: 'PlanDescribeEdit',
  components: {
    FormList
  },
  props: {
    taskId: {
      type: String,
      default: null
    },
    ganttName: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      comp: this,
      saveApi: 'planGanttManager.describeSave',
      isCustomValidate: true,
      ownerDataOptions: [],
      dataSource: [
        {
          labelText: '任务名称',
          type: 'text',
          fieldName: 'name',
          placeholder: '请输入任务名称',
          colLayout: 'singleCol',
          rules: [
            {
              required: true,
              message: '必填'
            }
          ]
        },
        {
          type: 'datetime',
          labelText: '计划开始时间',
          fieldName: 'start_date',
          colLayout: 'doubleCol',
          placeholder: '选择计划开始时间',
          rules: [
            {
              required: true,
              message: '必填'
            }
          ],
          fieldConfig: {
            clearable: false,
            disabled: false,
            'picker-options': this.startDateOptions()
          },
          eventHandle: {
            change: 'startDateChangeHandle'
          }
        },
        {
          type: 'datetime',
          labelText: '计划完成时间',
          fieldName: 'end_date',
          colLayout: 'doubleCol',
          placeholder: '选择计划完成时间',
          fieldConfig: {
            clearable: false,
            disabled: false,
            'picker-options': this.endDateOptions()
          },
          rules: [
            {
              required: true,
              message: '必填'
            }
          ],
          eventHandle: {
            change: 'endDateChangeHandle'
          }
        },
        // {
        //   type: 'select',
        //   labelText: '排程类型',
        //   fieldName: 'autoScheduling',
        //   colLayout: 'doubleCol',
        //   placeholder: '选择排程类型',
        //   options: [
        //     { 'label': '自动', 'value': '1' },
        //     { 'label': '手动', 'value': '2' }
        //   ],
        //   eventHandle: {
        //     change: 'autoSchedulingChangeHandle'
        //   }
        // },
        {
          type: 'view',
          labelText: '工期',
          fieldName: 'duration',
          colLayout: 'doubleCol',
          placeholder: '选择填写工期',
          min: 1,
          fieldConfig: {
            disabled: false
          }
          // ,
          // eventHandle: {
          //   change: 'durationChangeHandle'
          // }
        },
        {
          type: 'select',
          labelText: '任务类型',
          fieldName: 'planType',
          colLayout: 'doubleCol',
          placeholder: '选择任务类型',
          optionUrl: {
            api: 'thirdPartInterface.getDic',
            params: { dicType: 'ACTIVITY_TYPE' },
            label: 'label',
            value: 'value'
          },
          options: []
        },
        {
          type: 'select',
          labelText: '责任人',
          fieldName: 'owner_id',
          colLayout: 'doubleCol',
          placeholder: '选择责任人',
          fieldConfig: {
            filterable: true
          },
          options: []
        },
        {
          labelText: '预计开始时间',
          type: 'view',
          fieldName: 'forecastBeginDate',
          colLayout: 'doubleCol'
        },
        {
          labelText: '预计完成时间',
          type: 'view',
          fieldName: 'forecastEndDate',
          colLayout: 'doubleCol'
        },
        {
          labelText: '实际开始时间',
          type: 'view',
          fieldName: 'realBeginDate',
          colLayout: 'doubleCol'
        },
        {
          labelText: '实际开始时间',
          type: 'view',
          fieldName: 'realEndDate',
          colLayout: 'doubleCol'
        },
        {
          labelText: '任务描述',
          type: 'textarea',
          fieldName: 'describes',
          placeholder: '请输入活动描述',
          colLayout: 'singleCol',
          fieldConfig: {
            rows: '6'
          }
        }
      ],
      item1: {
        labelText: '任务名称',
        type: 'text',
        fieldName: 'name',
        placeholder: '请输入任务名称',
        colLayout: 'doubleCol',
        rules: [
          {
            required: true,
            message: '必填'
          }
        ]
      },
      item2: {
        type: 'select',
        labelText: '是否可控',
        fieldName: 'weatherControl',
        colLayout: 'doubleCol',
        placeholder: '选择是否可控',
        options: [
          { 'label': '是', 'value': '1' },
          { 'label': '否', 'value': '0' }
        ]
      },
      formData: {},
      otherParam: {
        activityInfoId: ''
      },
      describes: '',
      oldFormData: {},
      ganttObject: null
    }
  },
  watch: {
    ganttName: {
      handler (val) {
        this.ganttObject = GanttObject.getGanttObject(this.ganttName)
        // const df = this.dateFormat()
        // const minStartDate = df.format(this.ganttObject.config.plan_limit(this.ganttObject, this.taskId, 'min', 'start'))
        // const maxEndDate = df.format(this.ganttObject.config.plan_limit(this.ganttObject, this.taskId, 'max', 'end'))
        // let durationMax = df.durationByStamp((df.stamp(maxEndDate) - df.stamp(minStartDate)))
        // let durationOption = this.dataSource.filter(item => item.fieldName === 'duration')
        // durationOption[0].max = Number(durationMax)
        if (val === 'changeGantt') {
          this.dataSource.splice(0, 1, this.item1, this.item2)
        }
      },
      immediate: true
    },
    taskId (val) {
      this.rendered()
    },
    ownerDataOptions (newValue) {
      if (newValue) {
        let options = []
        newValue.forEach(function (item) {
          options.push({ 'value': item.id, 'label': `${item.name}[${item.deptName}]-${item.roleName}` }) // '[' + item.deptName + ']' + item.name + '-' + item.roleName
        })
        let select = this.dataSource.filter(item => item.fieldName === 'owner_id')
        select[0].options = options
      }
    }
  },
  computed: {
    ...mapGetters(['vueThis', 'taskStatusLockMap', 'planStatusLockMap'])
  },
  mounted () {
    console.log(moment(this.ganttObject.config.plan_limit(this.ganttObject, this.taskId, 'min', 'start')).format('YYYY-MM-DD'), 'start-min')
    console.log(moment(this.ganttObject.config.plan_limit(this.ganttObject, this.taskId, 'max', 'start')).format('YYYY-MM-DD'), 'start-max')
    console.log(moment(this.ganttObject.config.plan_limit(this.ganttObject, this.taskId, 'min', 'end')).format('YYYY-MM-DD'), 'end-min')
    console.log(moment(this.ganttObject.config.plan_limit(this.ganttObject, this.taskId, 'max', 'end')).format('YYYY-MM-DD'), 'end-max')
  },
  methods: {
    rendered () {
      if (this.taskId && this.taskId !== '') {
        this.getDescribeData(this.taskId)
      }
    },
    startDateOptions () {
      const _this = this
      return {
        disabledDate: (time) => {
          let currTime = moment(time).format('YYYY-MM-DD')
          let minStartTime = moment(_this.ganttObject.config.plan_limit(_this.ganttObject, _this.taskId, 'min', 'start')).format('YYYY-MM-DD')
          let maxStartTime = moment(_this.ganttObject.config.plan_limit(_this.ganttObject, _this.taskId, 'max', 'start')).format('YYYY-MM-DD')
          let timeSpace = (currTime > maxStartTime) || (currTime < minStartTime)
          return timeSpace
        }
      }
    },
    endDateOptions () {
      const _this = this
      return {
        disabledDate: (time) => {
          let currTime = moment(time).format('YYYY-MM-DD')
          let minEndTime = moment(_this.ganttObject.config.plan_limit(_this.ganttObject, _this.taskId, 'min', 'end')).format('YYYY-MM-DD')
          let maxEndTime = moment(_this.ganttObject.config.plan_limit(_this.ganttObject, _this.taskId, 'max', 'end')).format('YYYY-MM-DD')
          let timeSpace = (currTime > maxEndTime) || (currTime < minEndTime)
          return timeSpace
        }
      }
    },
    getDescribeData (taskId) {
      let that = this
      let ganttObject = GanttObject.getGanttObject(that.ganttName)
      that.ownerDataOptions = ganttObject.serverList('resourceDatas')
      let task = ganttObject.getTask(taskId)
      that.formData.name = task.name
      that.formData.start_date = task.start_date
      that.formData.end_date = ganttObject.date.add(task.end_date, -1, 'day')
      // that.formData.autoScheduling = task.autoScheduling
      that.formData.duration = task.duration
      that.formData.planType = task.planType
      that.formData.owner_id = task.owner_id
      that.formData.weatherControl = task.weatherControl
      that.formData.forecastBeginDate = moment(task.forecastBeginDate).format('YYYY-MM-DD')
      that.formData.forecastEndDate = moment(task.forecastEndDate).format('YYYY-MM-DD')
      if (task.realBeginDate) that.formData.realBeginDate = moment(task.realBeginDate).format('YYYY-MM-DD')
      if (task.realEndDate) that.formData.realEndDate = moment(task.realEndDate).format('YYYY-MM-DD')
      this.updataDataSource(task.autoScheduling)
      // 获取描述信息
      that.$api['planGanttManager.getActivityInfoByTaskId']({ taskId: taskId }).then(function (res) {
        if (res) {
          that.formData.describes = res.describes
          that.describes = that.formData.describes
          that.otherParam.activityInfoId = res.activityInfoId
        }
        // 变更进入时先查看newTaskMap中是否存在对应值若存在，显示，否则加载任务描述数据
        if (that.ganttName === 'changeGantt' && that.vueThis.newTaskMap && Object.keys(that.vueThis.newTaskMap).length > 0 &&
          that.vueThis.newTaskMap[taskId] && that.vueThis.newTaskMap[taskId].updateInfo.indexOf('describes') !== -1) {
          that.formData.describes = that.vueThis.newTaskMap[taskId].describes
        }
        that.oldFormData = that.formData
        that.formData = Object.assign({}, that.formData)
      }).catch(function (error) {
        console.log('error' + error)
      })
    },
    saved (res) {
      let that = this
      if (res && res === 'true') {
        let ganttObject = GanttObject.getGanttObject(that.ganttName)
        if (that.formData && JSON.stringify(that.formData) !== '{}') {
          let check = false
          let task = ganttObject.getTask(that.taskId)
          that.formData.start_date = moment(that.formData.start_date).toDate()
          that.formData.end_date = moment(that.formData.end_date).toDate()
          that.formData.autoScheduling = '2'
          for (let key in that.formData) {
            if (key !== '' && checkKeys.indexOf(key) !== -1 && task[key] !== that.formData[key]) {
              if (key === 'end_date') {
                if (ganttObject.date.add(that.formData[key], 1, 'day') !== task[key]) {
                  task[key] = ganttObject.date.add(that.formData[key], 1, 'day')
                  check = true
                }
              } else {
                task[key] = that.formData[key]
                if (key === 'duration' || key === 'start_date' || key === 'predecessors') {
                  check = true
                }
              }
            }
          }
          if (check) {
            updateforecastDate(task, ganttObject)
            ganttObject.updateTask(task.id)
            GanttObject.updateTaskNew(ganttObject, task.id, that.vueThis)
          } else {
            ganttObject.updateTask(task.id)
          }
        }
      }
    },
    customValidate (saveParams) {
      let that = this
      /**
       * 任务描述信息变更记录逻辑：
       *    1.修改编辑锁定任务时，记录变更
       *    2.修改非编辑任务时，非编辑锁定任务包含锁定标识时，修改标识锁定列时，记录变更
       */
      if (that.taskId) {
        if (that.ganttName === 'planGantt') { // 计划编辑
          that.$refs.form.submitForm(saveParams, that.saveApi)
        } else if (that.ganttName === 'changeGantt') { // 变更校验
          let ganttObject = GanttObject.getGanttObject(that.ganttName)
          taskDescribesEditCheck(saveParams, that.oldFormData, that.vueThis, that.taskId, ganttObject)
          that.vueThis.hasSave = true
          this.$message({
            type: 'success',
            message: '保存成功！'
          })
        }
        // 同步左下角任务名称
        that.vueThis.selectTaskName = saveParams.name
      }
    },
    startDateChangeHandle (val) {
      const _this = this
      const df = this.dateFormat()
      let minStartDate
      let maxStartDate
      let maxEndDate
      if (this.ganttName === 'changeGantt') {
        minStartDate = df.format(this.ganttObject.getTaskByWBSCode('1').start_date)
        maxStartDate = this.formData.end_date
        // const minEndDate = df.format(this.ganttObject.config.plan_limit(this.ganttObject, this.taskId, 'min', 'end'))
        maxEndDate = df.format(this.ganttObject.getTaskByWBSCode('1').end_date)
      } else {
        minStartDate = df.format(this.ganttObject.config.plan_limit(this.ganttObject, this.taskId, 'min', 'start'))
        maxStartDate = df.format(this.ganttObject.config.plan_limit(this.ganttObject, this.taskId, 'max', 'start'))
        // const minEndDate = df.format(this.ganttObject.config.plan_limit(this.ganttObject, this.taskId, 'min', 'end'))
        maxEndDate = df.format(this.ganttObject.config.plan_limit(this.ganttObject, this.taskId, 'max', 'end'))
      }
      /**
       * 1. 计划开始时间的最大最小限制
       */
      let value = val
      if (df.stamp(val) > df.stamp(maxStartDate)) {
        value = maxStartDate
        this.formData.start_date = maxStartDate
      } else if (df.stamp(val) < df.stamp(minStartDate)) {
        value = minStartDate
        this.formData.start_date = minStartDate
      }
      // 根据gantt时间工期联动策略适配
      if (this.ganttObject.config.inline_editors_date_processing && this.ganttObject.config.inline_editors_date_processing === 'keepDates') {
        this.formData.duration = df.durationByStamp((df.stamp(this.formData.end_date) - df.stamp(value)))
      } else {
        let expectEndDate = df.format((df.stamp(value) + df.stampByDuration(_this.formData.duration)))
        /**
         * 2. 计划结束时间的最大限制
         */
        if (df.stamp(expectEndDate) > df.stamp(maxEndDate)) {
          this.formData.end_date = maxEndDate
          this.formData.duration = df.durationByStamp((df.stamp(maxEndDate) - df.stamp(value)))
          return
        }
        this.formData.end_date = expectEndDate
      }
    },
    endDateChangeHandle (val) {
      const _this = this
      const df = this.dateFormat()
      /**
       * 1. 计划结束时间的最大最小限制
       */
      let minEndDate
      let maxEndDate
      if (this.ganttName === 'changeGantt') {
        minEndDate = df.format(this.ganttObject.getTask(this.taskId).start_date)
        maxEndDate = df.format(this.ganttObject.getTaskByWBSCode('1').end_date)
      } else {
        minEndDate = df.format(this.ganttObject.config.plan_limit(this.ganttObject, this.taskId, 'min', 'end'))
        maxEndDate = df.format(this.ganttObject.config.plan_limit(this.ganttObject, this.taskId, 'max', 'end'))
      }
      let value = val
      if (df.stamp(val) > df.stamp(maxEndDate)) {
        value = maxEndDate
        this.formData.end_date = maxEndDate
        // this.$message({
        //   type: 'warning',
        //   message: `计划完成时间截止期限为${maxEndDate}`
        // })
      } else if (df.stamp(val) < df.stamp(minEndDate)) {
        value = minEndDate
        this.formData.end_date = minEndDate
        // this.$message({
        //   type: 'warning',
        //   message: `计划完成时间最小期限为${minEndDate}`
        // })
      }
      let duration = df.durationByStamp((df.stamp(value) - df.stamp(_this.formData.start_date)))
      this.formData.duration = duration
      if (duration < 1) {
        _this.formData.start_date = _this.formData.end_date
      }
    },
    durationChangeHandle (val) {
      const _this = this
      const df = this.dateFormat()
      let rootTask = this.ganttObject.getTaskByWBSCode('1')
      let maxDuration = df.durationByStamp((df.stamp(rootTask.end_date) - df.stamp(_this.formData.start_date)))
      if ((maxDuration - 1) < val) {
        this.formData.end_date = rootTask.end_date
        this.formData.duration = maxDuration
      } else {
        /**
         * 设置计数器最大值
         */
        this.formData.end_date = df.format((df.stamp(_this.formData.start_date) + df.stampByDuration(val)))
      }
    },
    dateFormat () {
      let d = {
        format: (date) => {
          return moment(date).format('YYYY-MM-DD')
        },
        stamp: (date) => {
          return new Date(date).getTime() // 时间戳
        },
        stampByDuration: (duration) => { // (工期天数) 对应的毫秒值
          const MS = 24 * 60 * 60 * 1000
          return (duration - 1) * MS
        },
        durationByStamp: (stamp) => { // (毫秒值) 对应的工期天数
          const MS = 24 * 60 * 60 * 1000
          return ((stamp / MS) + 1).toFixed(0)
        }
      }
      return d
    },
    autoSchedulingChangeHandle (val) {
      this.updataDataSource(val)
    },
    updataDataSource (autoSchedulingValue) {
      if (this.ganttObject.hasChild(this.taskId)) {
        const valueObj = {
          '1': true,
          '2': false
        }
        let startDate = this.dataSource.filter(item => item.fieldName === 'start_date')
        let endDate = this.dataSource.filter(item => item.fieldName === 'end_date')
        let duration = this.dataSource.filter(item => item.fieldName === 'duration')
        startDate[0].fieldConfig.disabled = valueObj[autoSchedulingValue]
        endDate[0].fieldConfig.disabled = valueObj[autoSchedulingValue]
        duration[0].fieldConfig.disabled = valueObj[autoSchedulingValue]
      }
    }
  }
}
</script>
