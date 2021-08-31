<template>
  <div style='height: 100%; position: relative;'>
    <div id='actionMenu'
         v-if='menuVisible'
         ref='actionMenu'
         :style='{top:dropTop,left:dropLeft}'>
      <el-menu class="el-menu-demo" mode="horizontal">
        <template v-for='(menu, index) in menuData'>
          <el-submenu v-if='buttonData(menu).children'
                      :disabled='isDisable(menu)'
                      :key="menu.id"
                      :index="index+'m'">
            <span slot="title">
              <span @click='btnClick(buttonData(menu))'>
                <i class="el-icon-setting"></i>
                <span>{{menu.title}}</span>
              </span>
            </span>
            <template v-for='(btn,index) in buttonData(menu).children'>
              <el-menu-item v-if="btn.id !== 'createByNum'" :key='index'
                            @click='btnClick(btn)'
                            :index="btn.id">
                <i class="el-icon-setting"></i>
                <span>{{btn.title}}</span>
              </el-menu-item>
              <el-submenu v-if="btn.id === 'createByNum'" :key="index+'c'" :index="index+'b'">
                <span slot="title">
                  <i class="el-icon-setting"></i>
                  <span>{{btn.title}}</span>
                </span>
                <el-input-number size="mini" v-model="createNum" :max="50" :min="1" :step-strictly="true" :step="1"></el-input-number>
                <el-button size="mini" @click="btn.clickFun(btn,ganttName,null)">确定</el-button>
              </el-submenu>
            </template>
          </el-submenu>
          <el-menu-item v-else
                        @click='btnClick(buttonData(menu))'
                        :disabled='isDisable(menu)'
                        :key="menu.id"
                        :index="menu.id+'m'">
            <i class="el-icon-setting"></i>
            <span>{{menu.title}}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    <add-revenue v-if="addRevenueVisible"
                 :visible="addRevenueVisible"
                 :otherParam="otherParam"
                 @close-dialog="addRevenueClose">
    </add-revenue>
    <add-revenue-view v-if="addRevenueViewVisible"
                      :visible="addRevenueViewVisible"
                      :otherParam="revenueParam"
                      @close-dialog="fundMouseout">
    </add-revenue-view>
    <div ref='myGantt'
         style='width: 100%;height: calc(100% - 40px)!important;'
         @mousemove="mouseMove"></div>
    <div class='detail_div'>
      <div style="width: 50%">
        <span style="margin-left: 16px;">选中任务：</span>
        <span @click='showDetail' class="detail_span">{{selectTaskName}}</span>
      </div>
      <div style="width: 50%;">
        <span style="float:right;margin-right: 40px;">合计 {{taskCount}} 条</span>
        <span style="float:right;margin-right: 40px;">已选中 {{selectTaskCount}} 条</span>
      </div>
    </div>
    <el-drawer
        :title="activityImportTitle"
        :append-to-body="true"
        size="50%"
        :destroy-on-close="true"
        :wrapperClosable="false"
        @closed="activityImportClosed"
        :visible.sync="activityImportVisible">
      <activity-import @save-success="activityImportClosed" :task-id="selectTaskId" :create-page="createPage" :activity-import-type="activityImportType" :auto-scheduling="autoParentDate"></activity-import>
    </el-drawer>
    <monitor-time-manger
        v-if="controlTimeVisible"
        :visible="controlTimeVisible"
        :monitor-id="monitorId"
        :task-id="selectTaskId"
        :monitor-name="monitorName"
        :task-name="selectTaskName"
        @save-success="monitorManagerSave">
    </monitor-time-manger>
    <el-dialog title="共性资源"
               @close="closeDialog"
               :visible.sync="comResTaskSaveVisible"
               :comResForm="comResForm"
               :modal-append-to-body="true"
               :append-to-body="true">
      <el-form :model="comResForm">
        <el-form-item label="资源类型"
                      label-width="120px"
                      prop="planBeginTime"
                      :rules="[{ required: true, message: '必填', trigger: 'blur' }]">
          <el-select v-model="comResForm.commonResourceTypesId"
                     placeholder="请选择">
            <el-option v-for="item in comResTypesOption"
                       :label="item.label"
                       :key="item.value"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计划开始时间"
                      label-width="120px"
                      prop="planBeginTime"
                      :rules="[{ required: true, message: '必填', trigger: 'blur' }]">
          <el-date-picker v-model="comResForm.planBeginTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="计划完成时间"
                      label-width="120px"
                      prop="planEndTime"
                      :rules="[{ required: true, message: '必填', trigger: 'blur' }]">
          <el-date-picker v-model="comResForm.planEndTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="联系人"
                      label-width="120px"
                      :rules="[{ required: true, message: '必填', trigger: 'blur' }]">
          <el-input v-model="comResForm.contact"></el-input>
        </el-form-item>
        <el-form-item label="联系电话"
                      label-width="120px"
                      :rules="[{ required: true, message: '必填', trigger: 'blur' }]">
          <el-input v-model="comResForm.tel"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary"
                   @click="comResSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-drawer :title="importExcelTitle"
               :append-to-body="true"
               size="50%"
               :destroy-on-close="true"
               @closed="importExcelClosed"
               :visible.sync="importExcel">
      <import-excel @save-success="importExcelClosed"
                    :task-id="selectTaskId"
                    :output-request="excelImportData"></import-excel>
    </el-drawer>
    <el-drawer :title="importProjectTitle"
               :append-to-body="true"
               size="50%"
               :destroy-on-close="true"
               @closed="importProjectClosed"
               :visible.sync="importProject">
      <import-project @save-success="importProjectClosed"
                      :task-id="selectTaskId"
                      :output-request="projectImportData"></import-project>
    </el-drawer>

  </div>
</template>
<style>
  @import '../../../../../../assets/commonJS/ganttJS/ganttObject.css';
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
import { Menu, Submenu, MenuItem, Drawer, InputNumber, Button, Dialog, Form, Input, Select, Option, FormItem, DatePicker } from '~/index'
import { CommandButtonData } from '@/assets/commonJS/ganttJS/commandButtonData'
import { PlanRightMenuData } from '@/assets/commonJS/ganttJS/planRightMenuData'
import { GanttObject } from '@/assets/commonJS/ganttJS/ganttObject'
import { planGantt } from '@/assets/commonJS/ganttJS/planGanttObject'
import ActivityImport from '../activityImport'
import ImportExcel from '../importExcel'
import ImportProject from '../importProject'
// import { getMonitorLimitColumns } from '@/assets/commonJS/ganttJS/ganttLockUnLock'
import { mapGetters } from 'vuex'
import MonitorTimeManger from '../monitorTimeManager'
import AddRevenue from '../addRevenue'
import AddRevenueView from '../addRevenueView'

let myGantt
export default {
  name: 'PlanGantt',
  props: {
    planInfoId: {
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
    }
  },
  components: {
    'el-menu': Menu,
    'el-submenu': Submenu,
    'el-drawer': Drawer,
    'el-menu-item': MenuItem,
    'el-input-number': InputNumber,
    'el-button': Button,
    'el-dialog': Dialog,
    'el-form': Form,
    'el-input': Input,
    'el-select': Select,
    'el-option': Option,
    'el-form-item': FormItem,
    'el-date-picker': DatePicker,
    ActivityImport,
    MonitorTimeManger,
    AddRevenue,
    AddRevenueView,
    ImportExcel,
    ImportProject
  },
  data () {
    const mh = document.documentElement.clientHeight - 300
    return {
      ganttName: 'planGantt',
      createNum: 1,
      menuVisible: false,
      menuData: PlanRightMenuData,
      dropTop: '0px',
      dropLeft: '0px',
      selectedTasks: [],
      buttonDatas: CommandButtonData,
      resourceConfig: {},
      resourceTemplates: {},
      selectTaskId: '',
      selectTaskName: '',
      activityImportTitle: '活动导入',
      activityImportVisible: false,
      importExcelTitle: 'Excel文件导入',
      myExperienceVisible: false,
      myExperienceClassifyVisible: false,
      importExcel: false,
      resourceRelation: false,
      resourceTitle: '资源关联',
      importProjectTitle: 'Project文件导入',
      importProject: false,
      activityImportType: '',
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
      monitorId: '',
      monitorName: '',
      managerStatusMap: {}, // 管理状态全部数据
      ganttEditCheck: {}, // gantt任务编辑权限
      issueStatus: '', // 任务待下发状态
      workTime: 8, // 单日工作时长，单位：小时
      selectedTaskIds: [],
      dialogMaxHeight: mh + 'px',
      defaultExpandAll: false,
      excelImportData: [
        {
          attId: '1',
          attFilePath: 'Excel导入模板.xlsx',
          attFileName: 'Excel导入模板',
          descriptionStr: '按照大纲级别，将文档中的任务导入为选中任务的下级任务。'
        }
      ],
      projectImportData: [
        {
          attId: '3',
          attFilePath: 'Project导入模板.mpp',
          attFileName: 'Project导入模板',
          descriptionStr: '按照大纲级别，将文档中的任务导入为选中任务的下级任务。'
        }
      ],
      queryParam: {
        planId: this.planInfoId
      },
      tableConfig: {
        defaultExpandAll: true

      },
      //   drawerConfig: {
      //      'appendToBody':true

      // },
      tableApi: 'myExperience.myExperienceList',
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px',
      useTreeFormat: true,
      useTreePId: 'parentId',
      multipleSelection: [],
      selectedRowKeys: [],
      comResTaskSaveVisible: false, // 共性资源编辑
      comResTypesOption: [],
      budgetList: [], // 任务挂接经费数据
      addRevenueVisible: false, // 选择经费挂接
      otherParam: {}, // 经费挂接参数
      addRevenueViewVisible: false, // 经费挂接信息查看
      revenueParam: {}, // 查看经费挂接信息参数
      comResForm: {
        tel: '',
        contact: '',
        planBeginTime: null,
        planEndTime: null,
        comResName: '',
        projectTaskId: '',
        commonResourceTaskId: '',
        commonResourceTypesId: ''
      }
    }
  },
  watch: {
    selectedTasks: function (newVal, oldVal) {
      if (newVal && newVal.length === 1) {
        this.selectTaskId = newVal[0].id
        if (myGantt.getGlobalTaskIndex(newVal[0].id) !== 0) {
          this.selectTaskName = newVal[0].name
        }
      } else {
        this.selectTaskId = ''
        this.selectTaskName = ''
      }
      this.selectTaskCount = newVal.length
      if (newVal !== oldVal) {
        this.callParentSelectTasks()
      }
    },
    planInfoId: function (newVal, oldVal) {
      if (newVal) {
        this.initGantt(this.planInfoId)
        this.callParentSelectTasks()
        // cell编辑器打开前逻辑设置
        GanttObject.setOnBeforeEditStart(myGantt, this)
        // 设置保存时机
        GanttObject.setCellSaveConfig(myGantt)
        // 编辑器保存前校验
        GanttObject.checkoutBeforeCellSave(myGantt, this)
        // 编辑器保存后逻辑
        GanttObject.onSaveCellEven(myGantt, this)
      }
    }
  },
  mounted () {
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
    },
    ...mapGetters(['taskStyles'])
  },
  methods: {
    initGantt (planInfoId) {
      let vueThis = this
      // 清空原有数据
      if (myGantt) {
        GanttObject.setGanttObject(vueThis.ganttName, {})
      }
      // vuex存放
      vueThis.$store.dispatch('setVueThis', vueThis)
      // 初始化对象
      myGantt = planGantt(vueThis.ganttName, vueThis)
      myGantt.config.scale_height = 50
      // myGantt.ext.zoom.init(GanttObject.zoomConfig(myGantt))
      // 标识锁定后不可操作的列获取
      // getMonitorLimitColumns(myGantt.config.columns, vueThis)
      // 渲染对象
      myGantt.init(this.$refs.myGantt)
      // 加载数据
      this.loadGanttData(this.planInfoId, this.taskId, this.createPage)
    },
    loadGanttData (planInfoId, taskId, createPage) {
      let vueThis = this
      vueThis.$api['planGanttManager.loadPlanGanttData']({ planInfoId: planInfoId, dicType: 'ACTIVITY_TYPE', taskId: taskId, createPage: createPage }).then(function (res) {
        if (res) {
          // 初始化数据
          let datas = {
            tasks: res.tasks,
            links: res.links
          }
          myGantt.$resourcesStore.parse(res.resources)
          myGantt.serverList(myGantt.config.monitor_point, res.monitorPointDatas)
          myGantt.serverList(myGantt.config.plan_type, res.taskClassifys)
          // myGantt.serverList(myGantt.config.task_status, vueThis.taskStatus)
          vueThis.budgetList = res.budgetList
          vueThis.taskClassifyDatas = res.taskClassifys
          vueThis.issueStatus = res.issueStatus
          vueThis.monitorPointDatas = res.monitorPointDatas
          vueThis.monitorLockMap = res.monitorLock
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
    btnClick (btn) {
      this.menuVisible = false
      btn.clickFun(null, this.ganttName, this.selectedTasks)
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
    activityImportClosed () {
      this.activityImportVisible = false
      myGantt.eachSelectedTask(function (id) {
        if (myGantt.isTaskExists(id)) {
          myGantt.unselectTask(id)
        }
      })
      myGantt.destructor()
      this.initGantt(this.planInfoId)
      this.callParentSelectTasks()
    },
    monitorManagerSave (obj) {
      this.controlTimeVisible = false
    },
    importExcelClosed () {
      this.importExcel = false
      myGantt.eachSelectedTask(function (id) {
        if (myGantt.isTaskExists(id)) {
          myGantt.unselectTask(id)
        }
      })
      this.callParentSelectTasks()
      this.loadGanttData(this.planInfoId, this.taskId, this.createPage)
    },
    resourceRelationClosed () {
      this.resourceRelation = false
      this.callParentSelectTasks()
      this.loadGanttData(this.planInfoId, this.taskId)
    },
    importProjectClosed () {
      this.importProject = false
      myGantt.eachSelectedTask(function (id) {
        if (myGantt.isTaskExists(id)) {
          myGantt.unselectTask(id)
        }
      })
      this.callParentSelectTasks()
      this.loadGanttData(this.planInfoId, this.taskId, this.createPage)
    },
    comResTypesListData () {
      let _this = this
      _this.$api['baseData.getPublicResourceTypes']().then(function (res) {
        _this.comResTypesOption = res
      })
    },
    comResSubmit () {
      const _this = this
      if (this.comResForm.commonResourceTypesId && this.comResForm.planBeginTime && this.comResForm.planEndTime && this.comResForm.contact && this.comResForm.tel) {
        this.$api['planGanttManager.comResourceTaskSave']({
          ..._this.comResForm
        }).then(res => {
          // 成功之后的回调
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          let ganttObject = GanttObject.getGanttObject(this.ganttName)
          let task = ganttObject.getTask(this.comResForm.projectTaskId)
          task.comResName = this.comResForm.comResName
          task.commonResourceTypesId = this.comResForm.commonResourceTypesId
          task.comResPlanBeginTime = this.comResForm.planBeginTime
          task.comResPlanEndTime = this.comResForm.planEndTime
          task.comResContact = this.comResForm.contact
          task.comResTel = this.comResForm.tel
          this.loadGanttData(this.planInfoId, this.taskId, this.createPage)
          this.closeDialog()
        })
      }
    },
    unComResSubmit (taskId) {
      let ganttObject = GanttObject.getGanttObject(this.ganttName)
      let task = ganttObject.getTask(this.comResForm.projectTaskId)
      this.$api['planGanttManager.unComResourceTaskSave']({ taskId: taskId }).then(res => {
        // 成功之后的回调
        this.$message({
          message: '取消成功',
          type: 'success'
        })
        task.commonResourceTypesId = ''
        this.loadGanttData(this.planInfoId, this.taskId, this.createPage)
      })
    },
    closeDialog () {
      this.comResForm.projectTaskId = ''
      this.comResForm.comResName = ''
      this.comResForm.commonResourceTypesId = ''
      this.comResForm.planBeginTime = null
      this.comResForm.planEndTime = null
      this.comResForm.contact = ''
      this.comResForm.tel = ''
      this.comResTaskSaveVisible = false
    },
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
    addRevenueClose (selectedRows, param) {
      this.addRevenueVisible = false
      this.loadGanttData(this.planInfoId, '', this.createPage)
    },
    fundMouseout () {
      this.addRevenueViewVisible = false
    }
  }
}
</script>
