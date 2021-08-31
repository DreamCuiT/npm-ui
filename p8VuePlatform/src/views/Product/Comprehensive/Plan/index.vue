<template>
  <div style="height: 100%;">
    <div class='couerDivClass'
         id='couerDiv'>
      <div class='top' :style="{height:commandButtonBarHeight}">
        <command-button-bar :panel-data='barData'
                            :selected-tasks='selectedTasks'
                            :gantt-name='ganttName'
                            :plan-info-id='planInfoId'
                            @change-command-button="changeCommandButton"></command-button-bar>
      </div>
      <div class='bottom' :class="{'expandBottom':commandButtonBarHeight === '40px'}">
        <plan-gantt :plan-info-id='planInfoId'
                    :plan-info-status='planInfoStatus'
                    :task-id='taskId'
                    :create-page='createPage'
                    @select-task='selectTask' @show-detail="showDetail" @save-success="detailDrawerClosed" :task-status="taskStatus"></plan-gantt>
      </div>
    </div>
    <el-drawer
        :title="detailTitle"
        :append-to-body="true"
        size="50%"
        :destroy-on-close="true"
        :wrapperClosable="false"
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
#couerDiv{
  background:$base-bg-color;
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
import PlanGantt from './Components/planGantt'
import { Drawer } from '~/index'
import { CommandButtonBarData } from '@/assets/commonJS/ganttJS/commandButtonBarData'
import CommandButtonBar from '@/p8Components/gantt/Components/CommandButtonBar'
import PlanAttribute from './Components/planAttribute'
export default {
  name: 'Plan',
  data () {
    return {
      defaultKey: '1',
      advanced: false,
      selectedTasks: [],
      selectTaskId: '',
      detailVisible: false,
      readOnly: false,
      detailTitle: '',
      drawerConfig: {
        modal: false
      },
      planInfoId: '',
      planInfoStatus: '',
      taskId: null,
      createPage: '',
      ganttName: '',
      barData: CommandButtonBarData,
      taskStatus: {},
      status: '',
      commandButtonBarHeight: '180px'
    }
  },
  props: {
    thirdMenuParam: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  components: {
    'el-drawer': Drawer,
    PlanGantt,
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
      that.$api['SystemSettings.getBaseConfigSettings']({ keys: statusKey }).then(function (ress) {
        ress.settings.forEach(function (item) {
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
  mounted () {
    this.planInfoId = this.thirdMenuParam.planInfoId
    this.planInfoStatus = this.thirdMenuParam.planInfoStatus
    this.taskId = this.thirdMenuParam.taskId
    this.createPage = this.thirdMenuParam.createPage
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
    }
  }
}
</script>
