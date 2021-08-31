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
      <input-edit @saveSuccess="saveCallback" :task-id="taskId" :gantt-name="ganttName"></input-edit>
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
import OutputView from '../outputEdit/outputView'
import OutputEdit from '../outputEdit'
import SpecialEdit from '../specialEdit'
import SpecialView from '../specialEdit/specialView'
import { P8Anchor as Anchor } from '~/index'
import { GanttObject } from '@/assets/commonJS/ganttJS/ganttObject'
export default {
  name: 'PlanAttribute',
  props: ['taskId', 'ganttName', 'status', 'planInfoId', 'attReadOnly'],
  components: {
    DescribeEdit,
    MonitorEdit,
    DependenceEdit,
    InputEdit,
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
    if (this.taskId && this.ganttName) {
      if (this.attReadOnly) {
        this.isView = false
      } else {
        let ganttObject = GanttObject.getGanttObject(this.ganttName)
        let task = ganttObject.getTask(this.taskId)
        if (task && task.readonly) {
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
        { label: '依赖关系', value: 'dependenceKey' },
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
