<template>
  <div style="height: 100%;">
    <div class='couerDivClass' id='couerDiv'>
      <div class='top' :style="{height:commandButtonBarHeight}">
        <command-button-bar :panel-data='barData'
                            :selected-tasks='selectedTasks'
                            :gantt-name='ganttName'
                            :plan-info-id='planInfoId'
                            @change-command-button="changeCommandButton"></command-button-bar>
      </div>
      <div class='bottom' :class="{'expandBottom':commandButtonBarHeight === '40px'}">
        <change-gantt :plan-info-id='planInfoId'
                    :plan-info-status='planInfoStatus'
                    :task-id='taskId'
                    :plan-attribute-drawer="detailVisible"
                    :create-page="createPage"
                    :change-id="changeId"
                    :read-only="readOnly"
                    @hide-drawer="detailDrawerClosed"
                    @closed="closed"
                    @select-task='selectTask' @show-detail="showDetail" @save-success="detailDrawerClosed" :task-status="taskStatus"></change-gantt>
      </div>
    </div>
    <el-drawer
        style="width: 60%; left: auto"
        :title="detailTitle"
        :append-to-body="true"
        size="100%"
        :destroy-on-close="true"
        :wrapperClosable="false"
        :modal=false
        @closed="detailDrawerClosed"
        :visible.sync="detailVisible">
      <plan-attribute @save-success='detailDrawerClosed' :task-id='selectTaskId' :att-read-only="readOnly" :gantt-name="ganttName" :status="status" :plan-info-id="planInfoId"></plan-attribute>
    </el-drawer>
  </div>
</template>

<style lang="scss">
  .couerDivClass{
    height: calc(100% - 2px)!important;
    padding-top:1px;
    box-sizing: border-box;
    overflow:scroll;
    overflow-x:hidden;
    overflow-y:hidden;
    z-index:2!important;
  }
  .top {
    position: relative;
    margin-bottom:8px;
    background:$base-white-color;
    border:1px solid $base-line-color;
    border-radius: 6px;
    overflow:hidden;
  }
  .bottom {
    height:calc(100% - 192px);
    position: relative;
    border:1px solid $base-line-color;
    border-radius:6px;
    box-shadow:5px 5px 13px $base-bg-shadow;
    background:$base-white-color;
    overflow:hidden;
  }
  .bottom.expandBottom{
    height:calc(100% - 52px);
  }
</style>

<script>
import ChangeGantt from './changeGantt'
import { Drawer } from '~/index'
import { ChangeGanttButtonBarData } from '@/assets/commonJS/ganttJS/changeGanttButtonBarData'
import CommandButtonBar from '@/p8Components/gantt/Components/CommandButtonBar'
import PlanAttribute from '../../Plan/Components/planAttribute'
export default {
  name: 'ChangeIndex',
  data () {
    return {
      defaultKey: '1',
      advanced: false,
      selectedTasks: [],
      selectTaskId: '',
      detailVisible: false,
      detailTitle: '任务属性',
      drawerConfig: {
        modal: false
      },
      ganttName: '',
      barData: ChangeGanttButtonBarData,
      taskStatus: {},
      status: '',
      commandButtonBarHeight: '180px'
    }
  },
  props: {
    planInfoId: {
      type: String,
      default: null
    },
    planInfoStatus: {
      type: String,
      default: null
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    createPage: {
      type: String,
      default: null
    },
    taskId: {
      type: String,
      default: null
    },
    changeId: {
      type: String,
      default: null
    }
  },
  components: {
    'el-drawer': Drawer,
    ChangeGantt,
    PlanAttribute,
    CommandButtonBar
  },
  beforeMount () {
    let that = this
    // 获取任务状态
    let statusKey = []
    that.$api['userManager.dicData']({ dicType: 'TASK_STATUS' }).then(function (res) {
      let dataTemp = []
      res.forEach(function (item) {
        let temp = {}
        temp.id = item.value
        temp.name = item.label
        temp.iconKey = 'taskStatus-icon-' + item.value
        temp.colorKey = 'taskStatus-color-' + item.value
        dataTemp.push(temp)
        statusKey.push('taskStatus-icon-' + item.value)
        statusKey.push('taskStatus-color-' + item.value)
      })
      that.$api['SystemSettings.getBaseConfigSettings']({ keys: statusKey }).then(function (res) {
        res.settings.forEach(function (item) {
          dataTemp.forEach(function (itemData) {
            if (item.key === itemData.iconKey) {
              itemData.icon = item.value
            }
            if (item.key === itemData.colorKey) {
              itemData.color = item.value
            }
            that.taskStatus[itemData.id] = itemData
          })
        })
      })
    })
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    selectTask (selectDatas, ganttName) {
      this.selectedTasks = selectDatas
      this.ganttName = ganttName
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    tabBarExtraContent () {

    },
    showDetail (selectTask, ganttName) {
      this.detailVisible = true
      this.ganttName = ganttName
      this.selectTaskId = selectTask.id
      this.status = selectTask.status
      this.detailTitle = selectTask.name
    },
    detailDrawerClosed (res) {
      this.detailVisible = false
      this.selectTaskId = ''
      this.detailTitle = ''
    },
    changeCommandButton (advance) {
      if (advance) {
        this.commandButtonBarHeight = '180px'
      } else {
        this.commandButtonBarHeight = '40px'
      }
    },
    closed (obj) {
      this.$emit('closed', obj)
    }
  }
}
</script>
