<template>
  <div style="height: 100%">
  <div style='height: 100%; position: relative;'>
    <div ref='myGantt' style='width: 100%;height: calc(100% - 40px)!important;'></div>
    <div class='detail_div'>
      <div style="width: 50%">
        <span style="margin-left: 16px;">选中任务：</span>
        <span @click='showDetail' class="detail_span">{{selectTaskName}}</span>
      </div>
      <div style="width: 50%;">
        <span style="float:right;margin-right: 20px;line-height:40px;"><i class="el-icon-circle-plus" style="color: #0d6bec;" task_status_disp = "调增"></i>{{addCount}}</span>
        <span style="float:right;margin-right: 20px;line-height:40px;"><i class="el-icon-remove" style="color: #0d6bec;" task_status_disp = "调减"></i>{{deleteCount}}</span>
        <span style="float:right;margin-right: 20px;line-height:40px;"><i class="el-icon-info" style="color: #0d6bec;" task_status_disp = "修改"></i>{{modifyCount}}</span>
        <span style="float:right;margin-right: 20px;line-height:40px;">已选中 {{selectTaskCount}} 条</span>
        <span style="float:right;margin-right: 20px;line-height:40px;">合计 {{taskCount}} 条</span>
      </div>
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
    <plan-attribute @save-success='detailDrawerClosed' :task-id='selectTaskId' :att-read-only="readOnly" :gantt-name="ganttName" :plan-info-id="planInfoId"></plan-attribute>
  </el-drawer>
  </div>
</template>
<style>
  @import '~p8-dhtmlx-gantt/codebase/dhtmlxgantt.css';
  @import '../../../../../assets/commonJS/ganttJS/ganttObject.css';
</style>
<style type="text/css" media="screen">
  html, body{
    margin:0px;
    padding:0px;
    height:100%;
    overflow:hidden;
  }
</style>
<script>
import PlanAttribute from '../../Plan/Components/planAttribute'
import { GanttObject } from '@/assets/commonJS/ganttJS/ganttObject'
import { Drawer } from '~/index'
import { getAnalysisGantt } from '@/assets/commonJS/ganttJS/analysisGanttObject'
let myGantt
export default {
  name: 'ChangeGantt',
  props: {
    planInfoId: {
      type: String,
      default: null
    },
    taskId: {
      type: String,
      default: null
    },
    createPage: {
      type: String,
      default: null
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    planAttributeDrawer: { // 接收--父级[changeIndex.vue]中抽屉隐藏显示的字段-detailVisible. 列表选择时-该值为true,更新抽屉中的内容
      type: Boolean,
      default: false
    },
    changeId: {
      type: String,
      default: null
    }
  },
  components: {
    'el-drawer': Drawer,
    PlanAttribute
  },
  data () {
    return {
      ganttName: 'analysisGantt',
      selectedTasks: [],
      resourceConfig: {},
      resourceTemplates: {},
      selectTaskId: '',
      selectTaskName: '',
      detailVisible: false,
      detailTitle: '任务属性',
      taskCount: '', // 任务总数
      selectTaskCount: '', // 选中任务数量
      taskClassifyDatas: [],
      monitorPointDatas: [],
      searchForm: {},
      monitorLockMap: {}, // 标识锁定状态
      newTaskMap: {}, // 任务变更后新数据Map对象
      oldTaskMap: {}, // 任务变更原始数据Map对象
      addCount: 0,
      deleteCount: 0,
      modifyCount: 0,
      dependentDatas: [],
      createTaskStatus: '', // 新建任务状态
      changeTaskInfo: {},
      changeRecordId: ''
    }
  },
  watch: {
    selectedTasks: function (newVal, oldVal) {
      if (newVal && newVal.length === 1 && myGantt.getGlobalTaskIndex(newVal[0].id) !== 0) {
        this.selectTaskId = newVal[0].id
        this.selectTaskName = newVal[0].name
        if (this.planAttributeDrawer) {
          this.showDetail()
        }
      } else {
        this.selectTaskId = ''
        this.selectTaskName = ''
        if (this.planAttributeDrawer) {
          this.$emit('hide-drawer')
        }
      }
      this.selectTaskCount = newVal.length
      if (newVal !== oldVal) {
        this.callParentSelectTasks()
      }
    },
    planInfoId: function (newVal, oldVal) {
      if (newVal) {
        this.changeRecordId = this.changeId
        this.initGantt(this.planInfoId, this.changeRecordId)
        this.callParentSelectTasks()
      }
    },
    changeId: function (newVal, oldVal) {
      if (newVal) {
        this.changeRecordId = newVal
      }
    }
  },
  mounted () {
    this.changeRecordId = this.changeId
    this.initGantt(this.planInfoId, this.changeRecordId)
  },
  computed: {
    isDisable () {
      let that = this
      return function (btnConfig) {
        let btnData = that.buttonDatas.filter(btn => btn.id === btnConfig.buttonId)
        return btnData[0].isDisableFun(null, this.ganttName, this.selectedTasks)
      }
    },
    buttonData () {
      let that = this
      return function (btnConfig) {
        let btnData = that.buttonDatas.filter(btn => btn.id === btnConfig.buttonId)
        return btnData[0]
      }
    }
  },
  methods: {
    initGantt (planInfoId, changeRecordId) {
      let vueThis = this
      // 清空原有数据
      if (myGantt) {
        GanttObject.setGanttObject(vueThis.ganttName, {})
      }
      // vuex存放
      vueThis.$store.dispatch('setVueThis', vueThis)
      // 初始化对象
      myGantt = getAnalysisGantt(vueThis.ganttName, vueThis)
      myGantt.config.scale_height = 50
      // 渲染对象
      myGantt.init(this.$refs.myGantt)
      // 加载数据
      this.loadGanttData(this.planInfoId, this.taskId, this.createPage, changeRecordId)
    },
    loadGanttData (planInfoId, taskId, createPage, changeRecordId) {
      let vueThis = this
      vueThis.$api['planGanttManager.loadPlanGanttData']({ planInfoId: planInfoId, dicType: 'ACTIVITY_TYPE', taskId: taskId, createPage: createPage, changeRecordId: changeRecordId }).then(function (res) {
        if (res) {
          // 初始化数据
          let datas = {
            tasks: res.tasks,
            links: res.links
          }
          myGantt.$resourcesStore.parse(res.resources)
          myGantt.serverList(myGantt.config.monitor_point, res.monitorPointDatas)
          myGantt.serverList(myGantt.config.plan_type, res.taskClassifys)
          vueThis.changeTaskInfo = res.changeTaskInfo
          myGantt.parse(datas)
          vueThis.taskCount = myGantt.getTaskCount()
        }
      }).catch(function (error) {
        console.log('error' + error)
      })
    },
    showDetail () {
      if (myGantt.getGlobalTaskIndex(this.selectTaskId) !== 0) {
        this.detailVisible = true
      }
    },
    detailDrawerClosed (res) {
      this.detailVisible = false
      this.selectTaskId = ''
    }
  }
}
</script>
