<template>
  <anchor placement="left" :menu="anchorMenu" :menuKey="{label: 'label', value: 'value'}">
    <template #describeKey>
      <describe-edit v-if="isView" @saveSuccess="saveCallback" :task-id="taskId" :gantt-name="ganttName" :plan-info-id="planInfoId"></describe-edit>
      <describe-view v-if="!isView" :task-id="taskId" :gantt-name="ganttName" :plan-info-id="planInfoId"></describe-view>
    </template>
    <template #monitorKey>
      <monitor-edit v-if="isView" @saveSuccess="saveCallback" :task-id="taskId" :gantt-name="ganttName"></monitor-edit>
      <monitor-view v-if="!isView" :task-id="taskId" :gantt-name="ganttName"></monitor-view>
    </template>
    <template #dependenceKey>
      <dependence-edit v-if="isView" @saveSuccess="saveCallback" :task-id="taskId" :gantt-name="ganttName"></dependence-edit>
      <dependence-view v-if="!isView" :task-id="taskId" :gantt-name="ganttName"></dependence-view>
    </template>
    <template #inputKey>
      <input-edit v-if="isView" @saveSuccess="saveCallback" :task-id="taskId" :gantt-name="ganttName"></input-edit>
      <input-view v-if="!isView" :task-id="taskId" :gantt-name="ganttName"></input-view>
    </template>
    <template #outputKey>
      <output-edit v-if="isView" @saveSuccess="saveCallback" :task-id="taskId" :gantt-name="ganttName"></output-edit>
      <output-view v-if="!isView" :task-id="taskId" :gantt-name="ganttName"></output-view>
    </template>
    <template #specialKey>
      <special-edit v-if="isView" @saveSuccess="saveCallback" :task-id="taskId" :gantt-name="ganttName"></special-edit>
      <special-view v-if="!isView" :task-id="taskId" :gantt-name="ganttName"></special-view>
    </template>
  </anchor>
</template>

<script>
import DescribeEdit from '../describeEdit'
import DescribeView from '../describeEdit/describeView'
import MonitorEdit from '../monitorEdit'
import MonitorView from '../monitorEdit/monitorView'
import DependenceEdit from '../dependenceEdit'
import DependenceView from '../dependenceEdit/dependenceView'
import InputEdit from '../inputEdit'
import InputView from '../inputEdit/inputView'
import OutputView from '../outputEdit/outputView'
import OutputEdit from '../outputEdit'
import SpecialEdit from '../specialEdit'
import SpecialView from '../specialEdit/specialView'
import { P8Anchor as Anchor } from '~/index'
import { GanttObject } from '@/assets/commonJS/ganttJS/ganttObject'
export default {
  name: 'PlanAttribute',
  props: ['taskId', 'ganttName', 'status', 'planInfoId', 'attReadOnly', 'createPage'],
  components: {
    DescribeEdit,
    MonitorEdit,
    DependenceEdit,
    InputEdit,
    InputView,
    OutputEdit,
    SpecialEdit,
    Anchor,
    DescribeView,
    MonitorView,
    OutputView,
    DependenceView,
    SpecialView
  },
  watch: {
  },
  mounted: function () {
    // isView为true时是修改页面，为false时是查看页面
    if (this.taskId && this.ganttName) {
      let ganttObject = GanttObject.getGanttObject(this.ganttName)
      // debugger
      if (this.attReadOnly || ganttObject.config.readonly) {
        this.isView = false
      } else {
        // 获取gannt操作限制策略
        let taskStatusLockMap = this.$store.getters.taskStatusLockMap
        let vueThis = this.$store.getters.vueThis
        let task = ganttObject.getTask(this.taskId)
        let editManagerStatus = taskStatusLockMap[task.status]
        if (editManagerStatus && editManagerStatus.indexOf(task.managerStatus) === -1) {
          this.isView = false
        }
        // 发布后可控任务不可修改
        if (task.readonly) {
          this.isView = false
        }
        if (task.managerStatus === '6403' && this.createPage === 'decompose') {
          this.isView = false
        }
        if (task.createSource === '0' && this.createPage === 'decompose') {
          this.isView = false
        }
        // 责任人变更页面，责任人只能操作当前任务及其子
        if (this.ganttName === 'changeGantt' && vueThis.createPage === 'userChange' && !ganttObject.isChildOf(this.taskId, vueThis.taskId) && this.taskId !== vueThis.taskId) {
          this.isView = false
        }
      }
    }
  },
  data () {
    return {
      headerVisible: false,
      isView: true,
      anchorMenu: [
        { label: '任务描述', value: 'describeKey' },
        { label: '任务标识', value: 'monitorKey' },
        { label: '前置任务', value: 'dependenceKey' },
        { label: '输入', value: 'inputKey' },
        { label: '输出', value: 'outputKey' },
        { label: '特别说明', value: 'specialKey' }
      ]
    }
  },
  methods: {
    onSelect (tab, event) {
      this.activeKey = tab.name
    },
    saveCallback (res) {
    }
  }
}
</script>
<style lang="scss" scoped>
  .scroll-area {
    height: 100%;
    padding: 0 6px;
  }
  .formList.el-form > .el-row.formBtn {
    border-top: none;
  }
</style>
