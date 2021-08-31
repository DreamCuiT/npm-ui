<!--计划分解的页面的gantt页面 copy by ./index.vue-->
<template>
  <div style='height: 100%; position: relative;'>
    <div id='actionMenu'
         v-if='menuVisible'
         ref='actionMenu'
         :style='{top:dropTop,left:dropLeft,maxHeight:maxHeight}'>
      <VuePerfectScrollbar class="scroll-area" :style="{maxHeight:maxHeight,height:scrollBarHeight}">
        <el-menu mode="vertical"
               :collapse="true">
          <template v-for='(menu, index) in menuData'>
            <el-submenu v-if='buttonData(menu).children'
                        :disabled='isDisable(menu)'
                        :key="menu.id"
                        :index="index+'m'">
              <span slot="title">
                <span @click='btnClick(buttonData(menu), isDisable(menu))'>
                  <i :class="buttonData(menu).icon"></i>
                  <span>{{menu.title}}</span>
                </span>
              </span>
              <template v-for='(btn,index) in buttonData(menu).children'>
                <el-menu-item v-if="btn.id !== 'createByNum'"
                              :key='index'
                              @click='btnClick(btn, btn.isDisableFun(null, ganttName, selectedTasks))'
                              :index="btn.id">
                  <i :class="btn.icon"></i>
                  <span> {{btn.title}}</span>
                </el-menu-item>
                <el-submenu v-if="btn.id === 'createByNum'"
                            :key="index+'c'"
                            :index="index+'b'">
                  <span slot="title">
                    <i :class="btn.icon"></i>
                    <span> {{btn.title}}</span>
                  </span>
                  <el-input-number size="mini"
                                  v-model="createNum"
                                  :max="50"
                                  :min="1"
                                  :step-strictly="true"
                                  :step="1"></el-input-number>
                  <el-button size="mini"
                            @click="btn.clickFun(btn,ganttName,null)">确定</el-button>
                </el-submenu>
              </template>
            </el-submenu>
            <el-menu-item v-else
                          @click='btnClick(buttonData(menu), isDisable(menu))'
                          :disabled='isDisable(menu)'
                          :key="menu.id"
                          :index="menu.id+'m'">
              <i :class="buttonData(menu).icon"></i>
              <span> {{menu.title}}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </VuePerfectScrollbar>

    </div>
    <div ref='myGantt'
         style='width: 100%;height: calc(100% - 40px)!important;'
         @mousemove="mouseMove"></div>
    <div class='detail_div'>
      <div style="width: 50%">
        <span style="margin-left: 16px;">选中任务：</span>
        <span>{{selectTaskName}}</span>
      </div>
      <div style="width: 50%;">
        <span style="float:right;margin-right: 40px;">合计 {{taskCount}} 条</span>
        <span style="float:right;margin-right: 40px;">已选中 {{selectTaskCount}} 条</span>
      </div>
    </div>

    <common-dialog title="查询"
                   width="90%"
                   :visible="ganttSearchVisible"
                   :showHandleBtn="false"
                   @isfullscreen="isfullscreen"
                   @close="closeSearch"
                   :isViewCsFooter="false"
                   :dialogHeight="360">
      <template #dialog>
        <command-search :ganttName="ganttName" :planInfoId="planInfoId"></command-search>
      </template>
    </common-dialog>
  </div>
</template>
<style lang='scss'>
@import '~p8-dhtmlx-gantt/codebase/dhtmlxgantt.css';
@import '../../../../../../assets/commonJS/ganttJS/ganttObject.css';
</style>
<style lang="scss" scoped>
#actionMenu {
  user-select:none;
  width:165px;
  background-color:$base-white-color;
  .el-menu--collapse {
    width: 164px;
  }
  .el-menu--collapse > .el-menu-item .el-submenu__icon-arrow,
  .el-menu--collapse
    > .el-submenu
    > .el-submenu__title
    .el-submenu__icon-arrow {
    display: block;
    margin-top: -5px;
  }
  .el-menu--collapse > .el-menu-item span,
  .el-menu--collapse > .el-submenu > .el-submenu__title span {
    height: 100%;
    width: 100%;
    visibility: visible;
    line-height: 36px;
  }

  .el-menu-item.is-active{
    color:#303133;
  }

  .scroll-area{
    width:100%;
    position: relative;
    box-sizing: border-box;
  }
}
/deep/ .list-layout {
  overflow: hidden;
}
.el-drawer__wrapper.resource-group-drawer {
  & /deep/ .el-drawer__body {
    padding: 10px;
    background: #f7f8fc;
  }
}
</style>
<script>
import { Menu, Submenu, MenuItem, InputNumber, Button } from '~/index'
// 引入计划分解的commandButtonData
import { PlanRightMenuData } from '@/assets/commonJS/ganttJS/courtyardTaskGantt/planRightMenuData'
import { GanttCourtyardObject } from '@/assets/commonJS/ganttJS/courtyardTaskGantt/courtyardGanttObject'
// 引入计划分解的planGantt
import { courtyardTaskGanttObject } from '@/assets/commonJS/ganttJS/courtyardTaskGantt/courtyardTaskGanttObject'
import { mapGetters } from 'vuex'
import { CommandButtonData } from '@/assets/commonJS/ganttJS/courtyardTaskGantt/commandCourtyardButtonData'
import { P8Dialog as CommonDialog } from '~/index'
import CommandSearch from '@/p8Components/gantt/Components/CommandSearch'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
let Mycolumns = [
  {
    title: '',
    dataIndex: 'checkbox',
    type: 'selection'
  },
  {
    title: '任务名称',
    dataIndex: 'taskName'
  },
  {
    title: '责任人',
    dataIndex: 'dutyUserName',
    width: 150
  },
  {
    title: '工期',
    dataIndex: 'durations',
    width: 100
  }

]

let myGantt
export default {
  name: 'PlanResolveGantt',
  props: {
    planInfoId: {
      type: String,
      default: null
    },
    wholeDescribeId: {
      type: String,
      default: null
    },
    taskId: {
      type: String,
      default: null
    },
    taskStatus: {
      type: Object,
      default: null
    },
    createPage: {
      type: String,
      default: null
    },
    planStatusMap: {
      type: Object,
      default: null
    },
    planInfoStatus: {
      type: String,
      default: null
    },
    roteName: { // 三级菜单路由
      type: String,
      default: ''
    },
    dialogHeight: {
      type: Number,
      default: 200
    },
    panelData: {
      type: Array,
      default: () => []
    }
  },
  components: {
    'el-menu': Menu,
    'el-submenu': Submenu,
    'el-menu-item': MenuItem,
    'el-input-number': InputNumber,
    'el-button': Button,
    CommonDialog,
    CommandSearch,
    VuePerfectScrollbar
  },
  data () {
    const mh = document.documentElement.clientHeight - 300
    return {
      customHeight: 330,
      ganttName: 'courtyardTaskGantt',
      createNum: 1,
      menuVisible: false,
      menuData: PlanRightMenuData,
      dropTop: '0px',
      dropLeft: '0px',
      maxHeight: (mh + 300) / 2 + 'px',
      scrollBarHeight: '0px', // 右键菜单的高度
      selectedTasks: [],
      buttonDatas: CommandButtonData,
      resourceConfig: {},
      resourceTemplates: {},
      selectTaskId: '',
      startDate: '',
      endDate: '',
      comp: this,
      Mycolumns: Mycolumns,
      selectTaskName: '',
      taskCount: '', // 任务总数
      selectTaskCount: '', // 选中任务数量
      deep: 0,
      mouseX: '',
      mouseY: '',
      copyTasks: {}, // 复制任务id载体
      taskClassifyDatas: [],
      monitorPointDatas: [],
      dependentDatas: [],
      searchForm: {},
      monitorLockMap: {}, // 标识锁定状态
      limitColumns: [], // 标识加锁后不可编辑列定义
      lockLevel: 3, // 编辑锁定任务层级，指定后，gantt页面对应任务不可做任何操作
      autoParentDate: '1', // 是否自动计算父任务时间,1：自动，2：手动
      controlTimeVisible: false, // 标识时间编辑
      managerStatusMap: {}, // 管理状态全部数据
      ganttEditCheck: {}, // gantt任务编辑权限
      issueStatus: '', // 任务待下发状态
      selectedTaskIds: [],
      thirdMenuParam: {},
      dialogMaxHeight: mh + 'px',
      defaultExpandAll: false,
      selectedRowKeys: [],
      selectedRows: [],
      planTypeDatas: [],
      selectTaskDate: {},
      rows: null,
      selectGridVisible: false,
      renderColumns: [],
      dynamicDisplayCritical: false, // 控制是否动态显示关键路径
      viewType: 'grid', // 视图类型，默认只显示列表
      ganttSearchVisible: false, // gantt查询弹出框
      rightMenuConfigVisible: false // 右键菜单配置弹出框

    }
  },
  watch: {
    selectedTasks: function (newVal, oldVal) {
      if (newVal && newVal.length === 1 && newVal[0].status) {
        this.selectTaskId = newVal[0].id
        if (myGantt.getGlobalTaskIndex(newVal[0].id) !== 0) {
          this.selectTaskName = newVal[0].name
        }
      } else {
        this.selectTaskId = ''
        this.selectTaskName = ''
      }console.log()
      this.selectTaskCount = newVal.length
      if (newVal !== oldVal) {
        this.callParentSelectTasks()
      }
    },
    planInfoId: function (newVal, oldVal) {
      if (newVal) {
        this.initGantt(this.planInfoId, this.viewType)
        this.callParentSelectTasks()
        // cell编辑器打开前逻辑设置
        GanttCourtyardObject.setOnBeforeEditStart(myGantt, this)
        // 设置保存时机
        GanttCourtyardObject.setCellSaveConfig(myGantt)
        // 编辑器保存前校验
        GanttCourtyardObject.checkoutBeforeCellSave(myGantt, this)
        // 编辑器保存后逻辑
        GanttCourtyardObject.onSaveCellEven(myGantt, this)
      }
    },
    rows: function (newRow) {
      let checkRowLeng = newRow.length
      this.selectedRowKeys = []
      this.selectedRows = []
      console.log(newRow, '----------我的行')
      if (checkRowLeng > 0) {
        newRow.forEach(col => {
          this.selectedRowKeys.push(col.id)
          // console.log(this.selectedRowKeys,'-------我选中的标识')
          // that.selectedRowKeys.push()
          this.selectedRows.push(col)
        })
        this.selectedRowKeys = Array.from(new Set(this.selectedRowKeys))
      } else {
        this.selectedRowKeys = []
      }
      //  console.log(this.selectedRowKeys,'-----------我选中key的选中的值')
    },
    ganttRightButtons: {
      handler (val) {
        this.menuData = val.length ? val : PlanRightMenuData
        this.scrollBarHeight = 40 * this.menuData.length + 1 + 'px'
      },
      immediate: true,
      deep: true
    }
  },
  mounted () {
    console.log('载入resolveIndex courtyardTaskGanttObject 页面')
    this.scrollBarHeight = 40 * this.menuData.length + 1 + 'px'
  },
  computed: {
    isDisable () {
      console.log('计划分解按钮禁用规则读取1')
      let that = this
      return function (btnConfig) {
        let btnData = that.buttonDatas.filter(btn => btn.id === btnConfig.buttonId)
        return btnData[0].isDisableFun(null, this.ganttName, this.selectedTasks)
      }
    },
    buttonData () {
      console.log('计划分解按钮禁用规则读取2')
      let that = this
      return function (btnConfig) {
        let btnData = that.buttonDatas.filter(btn => btn.id === btnConfig.buttonId)
        return btnData[0]
      }
    },
    ...mapGetters(['taskStyles', 'ganttRightButtons'])
  },
  methods: {

    isfullscreen (isfullscreen) {
      if (isfullscreen) {
        this.customHeight = document.documentElement.clientHeight - 120
      } else {
        this.customHeight = 330
      }
    },
    initGantt (planInfoId, viewType) {
      let vueThis = this
      console.log(planInfoId, '初始化计划分解gantt页面')
      // 清空原有数据
      myGantt = GanttCourtyardObject.getGanttObject(vueThis.ganttName)
      if (myGantt) {
        GanttCourtyardObject.setGanttObject(vueThis.ganttName, {})
        myGantt.destructor()
      }
      // vuex存放
      vueThis.$store.dispatch('setVueThis', vueThis)
      // 初始化对象
      myGantt = courtyardTaskGanttObject(vueThis.ganttName, vueThis)
      myGantt.config.scale_height = 50
      // 标识锁定后不可操作的列获取
      // getMonitorLimitColumns(myGantt.config.columns, vueThis)
      // gantt视图切换
      if (viewType === 'resource') {
        myGantt.config.readonly = true
        myGantt.ext.zoom.init(GanttCourtyardObject.zoomConfig(myGantt))
        // 资源负载图列头定义
        let resourceConfig = GanttCourtyardObject.resourceConfig(myGantt, vueThis)
        // 定义资源模板
        let resourceTemplates = GanttCourtyardObject.resourceTemplates(myGantt)
        // 重新布局
        myGantt.config.layout = GanttCourtyardObject.layout3(resourceConfig, resourceTemplates)
        // 样式绑定
        myGantt.templates.grid_row_class = GanttCourtyardObject.grid_row_class(myGantt)
        myGantt.templates.task_row_class = GanttCourtyardObject.task_row_class(myGantt)
        myGantt.templates.timeline_cell_class = GanttCourtyardObject.timeline_cell_class(myGantt)
        myGantt.templates.resource_cell_class = GanttCourtyardObject.resource_cell_class()
        myGantt.templates.resource_cell_value = GanttCourtyardObject.resource_cell_value()
      } else if (viewType === 'gantt') {
        myGantt.ext.zoom.init(GanttCourtyardObject.zoomConfig(myGantt))
        myGantt.config.layout = GanttCourtyardObject.layout1
      } else {
        myGantt.config.layout = GanttCourtyardObject.layout2
      }
      // 清空表头查询缓存
      vueThis.searchForm = {}
      // cell编辑器打开前逻辑设置
      GanttCourtyardObject.setOnBeforeEditStart(myGantt, vueThis)
      // 设置保存时机
      GanttCourtyardObject.setCellSaveConfig(myGantt)
      // 编辑器保存前校验
      GanttCourtyardObject.checkoutBeforeCellSave(myGantt, vueThis)
      // 编辑器保存后逻辑
      GanttCourtyardObject.onSaveCellEven(myGantt, vueThis)
      // 渲染对象
      myGantt.init(this.$refs.myGantt)
      // 加载数据
      this.loadGanttData(this.planInfoId, this.taskId, this.createPage)
      // 配置团队成员编辑配置文件
      this.thirdMenuParam.planInfoId = this.planInfoId
      this.thirdMenuParam.id = this.wholeDescribeId
    },
    loadGanttData (planInfoId, taskId, createPage) {
      let vueThis = this
      vueThis.$api['courtyardTask.loadPlanGanttData']({ planInfoId: planInfoId, dicType: 'ACTIVITY_TYPE', taskId: taskId, createPage: createPage, currentPage: 'overallPlanning' }).then(function (res) {
        if (res) {
          // 初始化数据
          let datas = {
            tasks: res.tasks
          }

          myGantt.serverList(myGantt.config.monitor_point, res.allMonitors)
          myGantt.serverList(myGantt.config.plan_type, res.taskClassifys)
          vueThis.taskClassifyDatas = res.taskClassifys
          vueThis.issueStatus = res.issueStatus
          vueThis.monitorPointDatas = res.monitorPointDatas
          vueThis.managerStatusMap = res.managerStatusMap
          vueThis.$store.dispatch('setTaskStyles', res.taskStyle)
          myGantt.parse(datas)
          vueThis.taskCount = myGantt.getTaskCount()
          // 检查gantt操作权限
          // myGantt.config.readonly = editLockUnLockCheck(vueThis.planInfoStatus, vueThis.monitorLockMap)
        }
      }).catch(function (error) {
        console.log('error' + error)
      })
    },
    btnClick (btn, isDisable) {
      if (!isDisable) {
        this.menuVisible = false
        btn.clickFun(null, this.ganttName, this.selectedTasks)
      }
    },
    callParentSelectTasks () {
      this.$emit('select-task', this.selectedTasks, this.ganttName)
    },
    mouseMove (e) {
      if (this.menuVisible) {
        if ((this.mouseY - 30) > e.clientY || (this.mouseY + 30) < e.clientY || (this.mouseX - 30) > e.clientX || (this.mouseX + 30) < e.clientX) {
          this.menuVisible = false
        }
      }
    },
    showDetail () {
      if (myGantt.getGlobalTaskIndex(this.selectTaskId) !== 0) {
        this.$emit('show-detail', myGantt.getTask(this.selectTaskId), this.ganttName)
      }
    },
    closeSearch () {
      this.ganttSearchVisible = false
    }
  }
}
</script>
