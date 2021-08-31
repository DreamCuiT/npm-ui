<template>
  <div style="height: 90%;">
    <div class='couerDivClass'
         id='couerDiv'>
      <div class='top'
           :style="{height:ganttButtonMode === 'double' ? '72px' : '58px'}">
        <command-button-bar :panel-data='barData'
                            :selected-tasks='selectedTasks'
                            :gantt-name='ganttName'
                            :plan-info-id='planInfoId'
                            :task-id='taskId'
                            @change-command-button="changeCommandButton"></command-button-bar>
      </div>
      <div class='bottom'
           :class="{'expandBottom':commandButtonBarHeight === '58px'}">
        <plan-gantt :plan-info-id='planInfoId'
                    :wholeDescribeId='wholeDescribeId'
                    :plan-info-status='planInfoStatus'
                    :task-id='taskId'
                    :create-page='createPage'
                    :panel-data='barData'
                    @select-task='selectTask'
                    @show-detail="showDetail"
                    @save-success="detailDrawerClosed"
                    :task-status="taskStatus"></plan-gantt>
      </div>
    </div>
    <el-drawer :title="detailTitle"
               :append-to-body="true"
               size="50%"
               :destroy-on-close="true"
               :wrapperClosable="false"
               @closed="detailDrawerClosed"
               :visible.sync="detailVisible">
      <plan-attribute @save-success='detailDrawerClosed'
                      :create-page='createPage'
                      :task-id='selectTaskId'
                      :att-read-only="readOnly"
                      :gantt-name="ganttName"
                      :status="status"
                      :plan-info-id="planInfoId"></plan-attribute>
    </el-drawer>
  </div>
</template>

<style lang="scss">
.couerDivClass {
  height: 100%!important;
  box-sizing: border-box;
  overflow: scroll;
  overflow-x: hidden;
  overflow-y: hidden;
  z-index: 2000 !important;
}
#couerDiv {
  background: $base-bg-color;
}
.top {
  position: relative;
  // margin-bottom: 8px;
  background: $base-white-color;
  border-left: 1px solid $base-line-color;
  border-right: 1px solid $base-line-color;
  // border-radius: 6px;
  overflow: hidden;
}
.bottom {
  height: calc(100% - 74px);
  position: relative;
  border: 1px solid $base-line-color;
  // border-bottom-left-radius: 6px;
  // border-bottom-right-radius: 6px;
  box-shadow: 5px 5px 13px $base-bg-shadow;
  background: $base-white-color;
  overflow: hidden;
}
.bottom.expandBottom {
  height: calc(100% - 60px);
}
</style>

<script>
import { mapGetters } from 'vuex'
import PlanGantt from './Components/planGantt'
import { Drawer } from '~/index'
// import { CommandButtonBarData } from '@/assets/commonJS/ganttJS/commandButtonBarData'
import { CommandButtonBarDataDoubleRow } from '@/assets/commonJS/ganttJS/commandButtonBarDataDoubleRow'
import { CommandButtonBarDataSingleRow } from '@/assets/commonJS/ganttJS/commandButtonBarDataSingleRow'
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
      wholeDescribeId: '',
      planInfoStatus: '',
      taskId: null,
      createPage: '',
      ganttName: '',
      barData: this.ganttButtonMode === 'double' ? CommandButtonBarDataDoubleRow : CommandButtonBarDataSingleRow,
      taskStatus: {},
      status: '',
      commandButtonBarHeight: this.ganttButtonMode === 'double' ? '72px' : '58px'
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
  watch: {
    ganttButtonMode: {
      handler (val) {
        this.barData = val === 'double' ? CommandButtonBarDataDoubleRow : CommandButtonBarDataSingleRow
        this.commandButtonBarHeight = val === 'double' ? '72px' : '58px'
      },
      immediate: true
    }
  },
  components: {
    'el-drawer': Drawer,
    PlanGantt,
    PlanAttribute,
    CommandButtonBar
  },
  beforeMount () { },
  mounted () {
    console.log(this.thirdMenuParam, '页面传递参数')
    this.planInfoId = this.thirdMenuParam.planInfoId
    this.planInfoStatus = this.thirdMenuParam.planInfoStatus
    this.taskId = this.thirdMenuParam.taskId
    this.createPage = this.thirdMenuParam.createPage
    this.wholeDescribeId = this.thirdMenuParam.wholeDescribeId
  },
  computed: {
    ...mapGetters([
      'ganttButtonMode',
      'ganttRightButtons'
    ])
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
        this.commandButtonBarHeight = '152px'
      } else {
        this.commandButtonBarHeight = '58px'
      }
    }
  }
}
</script>
