<template>
    <div style="position: relative;height: 520px;">
        <form-list ref="form"
                   :comp="comp"
                   @rendered="rendered"
                   form-layout="vertical"
                   @saved="saved"
                   :dataSource="dataSource"
                   :api="saveApi"
                   :is-custom-validate="isCustomValidate"
                   @custom-validate = "customValidate"
                   :other-param="otherParam"
                   :form="formData">
        </form-list>
    </div>
</template>
<style scoped>
</style>
<script>
import { P8Form as FormList } from '~/index'
import { mapGetters } from 'vuex'
import { GanttObject } from '@/assets/commonJS/ganttJS/ganttObject'
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
          // fieldConfig: {
          //   'value-format': 'yyyy-MM-dd'
          // },
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
          // fieldConfig: {
          //   'value-format': 'yyyy-MM-dd'
          // },
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
        {
          type: 'select',
          labelText: '排程类型',
          fieldName: 'autoScheduling',
          colLayout: 'doubleCol',
          placeholder: '选择排程类型',
          options: [
            { 'label': '自动', 'value': '1' },
            { 'label': '手动', 'value': '2' }
          ]
        },
        {
          type: 'number',
          labelText: '工期',
          fieldName: 'duration',
          colLayout: 'doubleCol',
          placeholder: '选择填写工期',
          min: 0,
          max: 99999,
          eventHandle: {
            change: 'durationChangeHandle'
          }
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
      formData: {},
      otherParam: {
        activityInfoId: ''
      },
      describes: '',
      oldFormData: {}
    }
  },
  watch: {
    taskId (val) {
      this.rendered()
    },
    ownerDataOptions (newValue) {
      if (newValue) {
        let options = []
        newValue.forEach(function (item) {
          options.push({ 'value': item.id, 'label': '[' + item.deptName + ']' + item.name + '-' + item.roleName })
        })
        let select = this.dataSource.filter(item => item.fieldName === 'owner_id')
        select[0].options = options
      }
    }
  },
  computed: {
    ...mapGetters([ 'vueThis', 'taskStatusLockMap', 'planStatusLockMap' ])
  },
  mounted () {

  },
  methods: {
    rendered () {
      if (this.taskId && this.taskId !== '') {
        this.getDescribeData(this.taskId)
      }
    },
    getDescribeData (taskId) {
      let that = this
      let ganttObject = GanttObject.getGanttObject(that.ganttName)
      that.ownerDataOptions = ganttObject.serverList('resourceDatas')
      let task = ganttObject.getTask(taskId)
      that.formData.name = task.name
      that.formData.start_date = task.start_date
      that.formData.end_date = task.end_date
      that.formData.autoScheduling = task.autoScheduling
        console.log(that.vueThis, 'that.vueThis11ww')
        that.formData.duration = Math.round(ganttObject.calculateDuration(task) / that.vueThis.workTime)
      that.formData.planType = task.planType
      that.formData.owner_id = task.owner_id
      that.formData.forecastBeginDate = task.forecastBeginDate
      that.formData.forecastEndDate = task.forecastEndDate
      that.formData.realBeginDate = task.realBeginDate
      that.formData.realEndDate = task.realEndDate
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
        console.log(that.formData, 'that.formData-------that.formData')
      }).catch(function (error) {
        console.log('error' + error)
      })
    },
    saved (res) {
      let that = this
      if (res && res === 'true') {
        let ganttObject = GanttObject.getGanttObject(that.ganttName)
        if (that.formData && JSON.stringify(that.formData) !== '{}') {
          let task = ganttObject.getTask(that.taskId)
          that.formData.start_date = moment(that.formData.start_date).toDate()
          that.formData.end_date = moment(that.formData.end_date).toDate()
          for (let key in that.formData) {
            if (key !== '' && checkKeys.indexOf(key) !== -1 && task[key] !== that.formData[key]) {
              task[key] = that.formData[key]
            }
          }
          GanttObject.updateTaskNew(ganttObject, task.id, that.vueThis)
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
          that.oldFormData.start_date = moment(that.oldFormData.start_date).format('YYYY-MM-DD')
          that.oldFormData.end_date = moment(that.oldFormData.end_date).format('YYYY-MM-DD')
          saveParams.start_date = moment(saveParams.start_date).format('YYYY-MM-DD')
          saveParams.end_date = moment(saveParams.end_date).format('YYYY-MM-DD')
            console.log(that.vueThis, 'that.vueThis11ww')
          saveParams.duration = Math.round(saveParams.duration * that.vueThis.workTime)
          taskDescribesEditCheck(saveParams, that.oldFormData, that.vueThis, that.taskId, ganttObject)
        }
      }
    },
    startDateChangeHandle (val) {
      const _this = this
      this.formData.end_date = moment(val).add(_this.formData.duration, 'd').format('YYYY-MM-DD')
    },
    endDateChangeHandle (val) {
      const _this = this
      this.formData.duration = moment(val).diff(moment(_this.formData.start_date), 'd')
    },
    durationChangeHandle (val) {
      const _this = this
      this.formData.end_date = moment(_this.formData.start_date).add(val, 'd').format('YYYY-MM-DD')
    }
  }
}
</script>
