<template>
    <div style='height: 100%; position: relative;'>
        <div ref='myGantt'
             style='width: 100%;height: calc(100% - 40px)!important;'></div>
        <div class='detail_div'>
            <div style="width: 50%">
            </div>
            <div style="width: 50%;">
                <span style="float:right;margin-right: 40px;">合计 {{taskCount}} 条</span>
            </div>
        </div>
    </div>
</template>
<style lang='scss'>
    @import '~p8-dhtmlx-gantt/codebase/dhtmlxgantt.css';
    @import '../../../../../../assets/commonJS/ganttJS/ganttObject.css';
</style>
<style type="text/css" media="screen">
    html, body {
        margin: 0px;
        padding: 0px;
        height: 100%;
        overflow: hidden;
    }
</style>
<style lang="scss">
    #actionMenu {
        .el-menu--collapse {
            width: 164px;
        }

        .el-menu--collapse > .el-menu-item .el-submenu__icon-arrow, .el-menu--collapse > .el-submenu > .el-submenu__title .el-submenu__icon-arrow {
            display: block;
            margin-top: -5px;
        }

        .el-menu--collapse > .el-menu-item span, .el-menu--collapse > .el-submenu > .el-submenu__title span {
            height: 100%;
            width: 100%;
            visibility: visible;
            line-height: 36px;
        }
    }

</style>
<script>
import { GanttObject } from '@/assets/commonJS/ganttJS/ganttObject'
import { planGanttView } from '@/assets/commonJS/ganttJS/planGanttViewObject'

let myGantt
export default {
  name: 'PlanGanttView',
  props: {
    planInfoId: {
      type: String,
      default: null
    },
    ganttData: {
      type: Object,
      default: null
    },
    snapshootView: {
      type: Object,
      default: null
    },
    ganttLayoutFirstWidth: {
      default: 600,
      type: Number
    }
  },
  components: {},
  data () {
    return {
      ganttName: 'planGanttView',
      realGanttData: undefined,
      selectTaskId: '',
      selectTaskName: '',
      selectedTasks: [],
      budgetList: [],
      createPage: 'compile', // 固定参数
      taskCount: '', // 任务总数
      queryParam: {
        planId: this.planInfoId
      }
    }
  },
  watch: {},
  mounted () {
    if (this.snapshootView && this.snapshootView.snapshoot && Object.keys(this.snapshootView.snapshoot).length > 0) {
      this.realGanttData = this.snapshootView.snapshoot
    }
    if (this.ganttData && Object.keys(this.ganttData).length > 0) {
      this.realGanttData = this.ganttData
    }
    if ((this.realGanttData && Object.keys(this.realGanttData).length > 0) || this.planInfoId) {
      this.initGantt(this.planInfoId, this.realGanttData)
    }
  },
  methods: {
    initGantt (planInfoId, ganttData) {
      let vueThis = this
      // 清空原有数据
      if (myGantt) {
        GanttObject.setGanttObject(vueThis.ganttName, {})
      }
      // 初始化对象
      myGantt = planGanttView(vueThis.ganttName, vueThis)
      myGantt.config.scale_height = 50
      myGantt.ext.zoom.init(GanttObject.zoomConfig(myGantt))

      if (this.ganttLayoutFirstWidth === 600) {
        myGantt.config.layout = GanttObject.layout1
      } else {
        myGantt.config.layout = GanttObject.layout1_fun(vueThis.ganttLayoutFirstWidth)
      }
      // 渲染对象
      myGantt.init(this.$refs.myGantt)
      // 加载数据
      this.loadGanttData(planInfoId, this.createPage, ganttData)
    },
    loadGanttData (planInfoId, createPage, ganttData) {
      let vueThis = this
      if (planInfoId) {
        vueThis.$api['planGanttManager.loadPlanGanttData']({ planInfoId: planInfoId, dicType: 'ACTIVITY_TYPE', createPage: createPage }).then(function (res) {
          if (res) {
            // 初始化数据
            let datas = {
              tasks: res.tasks,
              links: res.links
            }
            myGantt.$resourcesStore.parse(res.resources)
            myGantt.serverList(myGantt.config.monitor_point, res.allMonitors)
            myGantt.serverList(myGantt.config.plan_type, res.taskClassifys)
            vueThis.budgetList = res.budgetList
            vueThis.monitorPointDatas = res.monitorPointDatas
            myGantt.parse(datas)
            vueThis.taskCount = myGantt.getTaskCount()
          }
        }).catch(function (error) {
          console.log('error' + error)
        })
      } else {
        let datas = {
          tasks: ganttData.tasks,
          links: ganttData.links
        }
        myGantt.$resourcesStore.parse(ganttData.resources)
        myGantt.serverList(myGantt.config.monitor_point, ganttData.allMonitors)
        myGantt.serverList(myGantt.config.plan_type, ganttData.taskClassifys)
        vueThis.budgetList = ganttData.budgetList
        vueThis.monitorPointDatas = ganttData.monitorPointDatas
        myGantt.parse(datas)
        vueThis.taskCount = myGantt.getTaskCount()
      }
    },
    showDetail () {
      if (myGantt.getGlobalTaskIndex(this.selectTaskId) !== 0) {
        this.$emit('show-detail', myGantt.getTask(this.selectTaskId), this.ganttName)
      }
    }
  }
}
</script>
