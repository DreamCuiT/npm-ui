<template>
  <el-tabs class="taskTabs"
           style="height: 100%;">
    <el-tab-pane label="任务信息">
      <task-info-view :dataSource="dataSource"
                      ref="taskinfo"></task-info-view>
    </el-tab-pane>
    <el-tab-pane label="输出物">
      输出物...
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { Tabs, TabPane } from '~/index'
import TaskInfoView from '../taskInfo/TaskPane'
export default {
  name: 'TabsTask',
  components: {
    TaskInfoView,
    'el-tabs': Tabs,
    'el-tab-pane': TabPane
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
        colLayout: ''
      },
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
        colLayout: ''
      },
      {
        type: 'blank',
        labelText: '超期/剩余天数:',
        slotName: 'durationDay',
        colLayout: ''
      },
      {
        type: 'blank',
        labelText: '完成百分比:',
        slotName: 'progress',
        colLayout: ''
      },
      {
        type: 'view',
        labelText: '预测起始日期:',
        fieldName: 'forecastDate',
        colLayout: ''
      },
      {
        type: 'view',
        labelText: '计划起始日期:',
        fieldName: 'planDate',
        colLayout: ''
      },
      {
        type: 'view',
        labelText: '实际起始日期:',
        fieldName: 'realDate',
        colLayout: ''
      }
    ]
    return {
      dataSource,
      taskApi: 'taskManager.taskInfo',
      taskId: '',
      taskApiParams: {}
    }
  },
  mounted () {
    // eslint-disable-next-line no-unused-vars
    let _this = this
    this.$bus.$on('selectProcess', function (data) {
      // console.log(data)
      // _this.$refs.taskinfo.rendFormData(data)
    })
  }
}
</script>
<style lang="scss" scoped>
.taskTabs /deep/ .el-tabs__header {
  margin: 0;
}
.taskTabs /deep/ .el-tabs__nav-wrap {
  background-color: #ffffff;
  padding: 0 6px;
  &::after {
    height: 0px;
  }
}
.taskTabs /deep/ .el-tabs__content {
  padding: 0 10px;
  height: calc(100% - 40px);
}
.taskTabs /deep/ .el-tab-pane {
  height: 100%;
}
</style>
