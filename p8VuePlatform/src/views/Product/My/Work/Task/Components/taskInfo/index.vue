<template>
  <pane-view paneTitle="任务详细信息">
    <template #paneTitle>
      <div class="pane-title-right"
           @click="arrowClickHandle">
        <i class="el-icon-arrow-left"></i>
      </div>
    </template>
    <template #paneInfo>
      <task-pane-view :dataSource="dataSource"
                      :api="taskApi"
                      :apiParams="taskApiParams"></task-pane-view>
    </template>
  </pane-view>
</template>
<script>

import PaneView from '../layout/Pane'
import TaskPaneView from './TaskPane'
export default {
  name: 'TaskInfoView',
  inject: ['getPlanInfo'],
  props: {},
  components: {
    TaskPaneView,
    PaneView
  },
  computed: {

  },
  data () {
    const dataSource = [
      {
        type: 'view',
        labelText: '项目:',
        fieldName: 'planName', // taskName
        colLayout: 'singleCol'
      },
      {
        type: 'view',
        labelText: '任务名称:',
        fieldName: 'name', // taskName
        colLayout: 'singleCol'
      },
      // {
      //   type: 'blank',
      //   labelText: '任务标识:',
      //   slotName: 'monitorpoint',
      //   colLayout: ''
      // },
      // {
      //   type: 'view',
      //   labelText: '排序号:',
      //   fieldName: 'indexNo', // taskLevel
      //   colLayout: 'singleCol'
      // },
      {
        type: 'blank',
        labelText: '进度:',
        slotName: 'status',
        colLayout: 'singleCol'
      },
      {
        type: 'blank',
        labelText: '状态:',

        slotName: 'managerStatusDisplay',
        colLayout: 'singleCol'
      },
      {
        type: 'view',
        labelText: '工期:',
        fieldName: 'duration',
        colLayout: 'singleCol'
      },
      {
        type: 'blank',
        labelText: '超期/剩余天数:',
        slotName: 'durationDay',
        colLayout: 'singleCol'
      },
      {
        type: 'blank',
        labelText: '完成百分比:',
        slotName: 'progress',
        colLayout: 'singleCol'
      },
      {
        type: 'view',
        labelText: '预测起始日期:',
        fieldName: 'forecastDate',
        colLayout: 'singleCol'
      },
      {
        type: 'view',
        labelText: '计划起始日期:',
        fieldName: 'planDate',
        colLayout: 'singleCol'
      },
      {
        type: 'view',
        labelText: '实际起始日期:',
        fieldName: 'realDate',
        colLayout: 'singleCol'
      },
      {
        type: 'blank',
        labelText: '',
        slotName: 'dateline',
        colLayout: 'singleCol',
        formItemConfig: {
          'label-width': '0px'
        }
      }
    ]
    return {
      dataSource,
      taskApi: 'taskManager.taskInfo',
      taskApiParams: {}
    }
  },
  mounted () {
    this.taskApiParams.taskId = this.getPlanInfo().taskId
  },
  methods: {
    arrowClickHandle () {
      this.$bus.$emit('split-pane-left')
    }
  }
}
</script>
<style lang="scss" scoped>
.pane-title-right {
  float: right;
  font-size: 16px;
}
</style>
