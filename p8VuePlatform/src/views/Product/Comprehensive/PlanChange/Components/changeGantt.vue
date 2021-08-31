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
            <template slot="title">
              <span @click='btnClick(buttonData(menu))'>
                <i class="el-icon-setting"></i>
                <span>{{menu.title}}</span>
              </span>
            </template>
            <template v-for='(btn,index) in buttonData(menu).children'>
              <el-menu-item v-if="btn.id !== 'createByNum'" :key='index'
                            @click='btnClick(btn)'
                            :index="btn.id">
                <i class="el-icon-setting"></i>
                <span>{{btn.title}}</span>
              </el-menu-item>
              <el-submenu v-if="btn.id === 'createByNum'" :key="index+'c'" :index="index+'b'">
                <template slot="title">
                  <i class="el-icon-setting"></i>
                  <span>{{btn.title}}</span>
                </template>
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
    <div ref='myGantt' style='width: 100%;height: calc(100% - 40px)!important;' @mousemove="mouseMove"></div>
    <div class='detail_div'>
      <div style="width: 50%">
        <span style="margin-left: 16px;">选中任务：</span>
        <span @click='showDetail' class="detail_span">{{selectTaskName}}</span>
      </div>
      <div style="width: 50%;">
        <el-button style="float:right;margin-right: 20px;margin-top: 6px;" type="primary" size="mini" @click="saveChange" v-if="!readOnly && hasSave">保存并分析</el-button>
        <el-button style="float:right;margin-right: 20px;margin-top: 6px;" type="primary" size="mini" @click="submitChange" v-if="!readOnly && !hasSave">提交审批</el-button>
        <span style="float:right;margin-right: 20px;line-height:40px;"><i class="el-icon-circle-plus" style="color: #0d6bec;" task_status_disp = "调增"></i>{{addCount}}</span>
        <span style="float:right;margin-right: 20px;line-height:40px;"><i class="el-icon-remove" style="color: #0d6bec;" task_status_disp = "调减"></i>{{deleteCount}}</span>
        <span style="float:right;margin-right: 20px;line-height:40px;"><i class="el-icon-info" style="color: #0d6bec;" task_status_disp = "修改"></i>{{modifyCount}}</span>
        <span style="float:right;margin-right: 20px;line-height:40px;">已选中 {{selectTaskCount}} 条</span>
        <span style="float:right;margin-right: 20px;line-height:40px;">合计 {{taskCount}} 条</span>
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
      <activity-import @save-success="activityImportClosed" :task-id="selectTaskId" :activity-import-type="activityImportType" :auto-scheduling="autoParentDate"></activity-import>
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
    <submit-change
        v-if="submitChangeValidate"
        :visible="submitChangeValidate"
        :change-id="changeRecordId"
        @save-success="submitChangeSave">
    </submit-change>
    <selectApproveUser v-if="isSelectApproveUserView"
                       :isSelectApproveUserView="isSelectApproveUserView"
                       :selectUserDataSource="selectUserDataSource"
                       :selectUserFormData="selectUserFormData"
                       @close-modal="closeSelectApproveUser"
                       @commit="commitSelectApproveUser"
    ></selectApproveUser>
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
import { Menu, Submenu, MenuItem, Drawer, InputNumber, Button } from '~/index'
import { CommandButtonData } from '@/assets/commonJS/ganttJS/commandButtonData'
import { PlanRightMenuData } from '@/assets/commonJS/ganttJS/planRightMenuData'
import { GanttObject } from '@/assets/commonJS/ganttJS/ganttObject'
import { getChangeGantt } from '@/assets/commonJS/ganttJS/changeGanttObject'
import ActivityImport from '../../Plan/Components/activityImport'
import { getMonitorLimitColumns } from '@/assets/commonJS/ganttJS/ganttLockUnLock'
import { mapGetters } from 'vuex'
import MonitorTimeManger from '../../Plan/Components/monitorTimeManager'
import { checkKeys } from '@/assets/commonJS/ganttJS/changeGantt'
import moment from 'moment'
import submitChange from './submitChange'
// import { nextApproveUser } from '@/assets/commonJS/BusinessActivity/nextApproveUser'
import SelectApproveUser from '@/views/Framework/BusinessActivity/ProcessApproval/selectApproveUser'

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
    taskStatus: {
      type: Object,
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
    planStatusMap: {
      type: Object,
      default: null
    },
    planInfoStatus: {
      type: String,
      default: null
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
    'el-menu': Menu,
    'el-submenu': Submenu,
    'el-drawer': Drawer,
    'el-menu-item': MenuItem,
    'el-input-number': InputNumber,
    'el-button': Button,
    ActivityImport,
    MonitorTimeManger,
    submitChange,
    SelectApproveUser
  },
  data () {
    return {
      ganttName: 'changeGantt',
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
      hasSave: true,
      selectTaskName: '',
      activityImportTitle: '活动导入',
      activityImportVisible: false,
      activityImportType: '',
      taskCount: '', // 任务总数
      selectTaskCount: '', // 选中任务数量
      deep: 0,
      mouseX: '',
      mouseY: '',
      copyTasks: [], // 复制任务载体
      taskClassifyDatas: [],
      monitorPointDatas: [],
      searchForm: {},
      monitorLockMap: {}, // 标识锁定状态
      limitColumns: [], // 标识加锁后不可编辑列定义
      lockLevel: 3, // 编辑锁定任务层级，指定后，gantt页面对应任务不可做任何操作
      autoParentDate: '1', // 是否自动计算父任务时间,1：自动，2：手动
      controlTimeVisible: false, // 标识时间编辑
      monitorId: '',
      monitorName: '',
      newTaskMap: {}, // 任务变更后新数据Map对象
      oldTaskMap: {}, // 任务变更原始数据Map对象
      addCount: 0,
      deleteCount: 0,
      modifyCount: 0,
      dependentDatas: [],
      createTaskStatus: '', // 新建任务状态
      managerStatus: '', // 新建任务管理状态
      weatherControl: '', // 新建任务是否受控状态
      createSource: '', // 新建任务任务创建页面
      taskMonitorMap: {}, // 变更前任务标识信息
      changeTaskInfo: {},
      changeRecordId: '',
      submitChangeValidate: false,
      isSelectApproveUserView: false,
      selectUserDataSource: [],
      selectUserFormData: {},
      ganttEditCheck: {}, // gantt任务编辑权限
      workTime: 8 // 单日工作时长，单位：小时
    }
  },
  watch: {
    selectedTasks: function (newVal, oldVal) {
      if (newVal && newVal.length === 1 && myGantt.getGlobalTaskIndex(newVal[0].id) !== 0) {
        this.selectTaskId = newVal[0].id
       // let task = myGantt.getTask(newVal[0].id)
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
    },
    newTaskMap: {
      handler (newVal, oldVal) {
        let that = this
        if (newVal && Object.keys(newVal).length > 0) {
          let ac = 0
          let dc = 0
          let mc = 0
          newVal.forEach(function (t, v) {
            if (t.infoType === 'update') {
              mc += 1
            } else if (t.infoType === 'create') {
              ac += 1
            } else if (t.infoType === 'delete') {
              if (myGantt.hasChild(t.id)) {
                myGantt.eachTask(function (task) {
                  dc += 1
                }, t.id)
              }
              dc += 1
            }
          })
          that.addCount = ac
          that.deleteCount = dc
          that.modifyCount = mc
        } else {
          that.addCount = 0
          that.deleteCount = 0
          that.modifyCount = 0
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted () {
    this.changeRecordId = this.changeId
    this.initGantt(this.planInfoId, this.changeRecordId)
    this.callParentSelectTasks()
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
    initGantt (planInfoId, changeRecordId) {
      let vueThis = this
      // 清空原有数据
      if (myGantt) {
        GanttObject.setGanttObject(vueThis.ganttName, {})
      }
      // vuex存放
      vueThis.$store.dispatch('setVueThis', vueThis)
      // 初始化对象
      myGantt = getChangeGantt(vueThis.ganttName, vueThis)
      myGantt.config.scale_height = 50
      // 标识锁定后不可操作的列获取
      getMonitorLimitColumns(myGantt.config.columns, vueThis)
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
          vueThis.createTaskStatus = res.createTaskStatus
          vueThis.managerStatus = res.managerStatus
          vueThis.weatherControl = res.weatherControl
          vueThis.createSource = res.createSource
          vueThis.taskClassifyDatas = res.taskClassifys
          vueThis.monitorPointDatas = res.monitorPointDatas
          vueThis.monitorLockMap = res.monitorLock
          vueThis.taskMonitorMap = res.taskMonitorMap
          vueThis.changeTaskInfo = res.changeTaskInfo
          vueThis.ganttEditCheck = res.ganttEditCheck
          myGantt.parse(datas)
          vueThis.taskCount = myGantt.getTaskCount()
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
      this.initGantt(this.planInfoId, null)
      this.callParentSelectTasks()
    },
    monitorManagerSave (obj) {
      this.controlTimeVisible = false
    },
    saveChange () {
      let that = this
      let obj = that.newTaskMap
      let oldObj = that.oldTaskMap
      let sendDatas = []
      for (let key in obj) {
        // 获取newTaskMap对象
        let task = obj[key]
        let oldTask = oldObj[key]
        let updateInfo = obj[key].updateInfo
        // 获取gantt中task对象
        let nowGanttTask = myGantt.getTask(task.id)
        let indexNo = myGantt.getGlobalTaskIndex(task.id)
        // newTaskMap中数据过滤
        // 当只修改任务且最终于原始数据一致时，删除newTaskMap中对应数据
        if (!nowGanttTask.infoType && updateInfo && updateInfo.length === 1 && updateInfo.indexOf('task') !== -1) {
          delete that.newTaskMap[key]
          break
        }
        if (oldTask && Object.keys(oldTask).length > 0) {
          let oldIndexNo = oldObj[key].indexNo
          // 任务属性未修改时，取消updateInfo中task
          if (updateInfo && updateInfo.indexOf('task') !== -1 && nowGanttTask.infoType === 'update' && oldIndexNo === indexNo && nowGanttTask.parent === oldTask.parent) {
            let check = true
            for (let okey in oldTask) {
              if (checkKeys.indexOf(okey) !== -1 && nowGanttTask[okey] !== oldTask[okey]) {
                check = false
                break
              }
            }
            if (check) {
              updateInfo.splice(updateInfo.indexOf('task'), 1)
            }
            that.newTaskMap[key].updateInfo = updateInfo
          }
        }
        that.newTaskMap[key].indexNo = indexNo
        // 日期转换
        nowGanttTask.start_date = moment(nowGanttTask.start_date).format('YYYY-MM-DD HH:mm:ss')
        nowGanttTask.end_date = moment(nowGanttTask.end_date).format('YYYY-MM-DD HH:mm:ss')
        nowGanttTask.indexNo = indexNo
        that.newTaskMap[key] = nowGanttTask
        sendDatas.push(that.newTaskMap[key])
      }
      // 请求后台接口
      that.$api['planChange.calculateChangeInfoAndSave']({ changeTasks: sendDatas, planInfoId: that.planInfoId, id: that.changeRecordId }).then(function (res) {
        if (res) {
          // 刷新页面
          myGantt.eachSelectedTask(function (id) {
            if (myGantt.isTaskExists(id)) {
              myGantt.unselectTask(id)
            }
          })
          myGantt.destructor()
          that.changeRecordId = res
          that.initGantt(that.planInfoId, that.changeRecordId)
          that.callParentSelectTasks()
          that.hasSave = false
        }
      }).catch(function (error) {
        console.log('error' + error)
      })
    },
    submitChange () {
      this.submitChangeValidate = true
    },
    submitChangeSave (obj) {
      /* let this_ = this
      if (obj && obj.processInstanceIds && obj.processInstanceIds.length > 0) {
        nextApproveUser.initDataSource(obj.approveTime, obj.processInstanceIds, this_).then(res1 => {
          if (res1 === true) {
            this_.$confirm(`检测到后一个审批任务，是否手动指定（变更）节点的审批人？`, '操作成功！', {
              confirmButtonText: '手动指定',
              cancelButtonText: '不指定',
              type: 'warning'
            }).then(() => {
              this_.isSelectApproveUserView = true
            }).catch(() => {
            })
          }
        })
      } */
      this.submitChangeValidate = false
    },
    closeSelectApproveUser () {
      this.isSelectApproveUserView = false
      this.$emit('approved', this.formData.taskId)
    },
    commitSelectApproveUser (fullParams) {
      this.$refs.form.submitForm(fullParams, this.saveApi)
      this.closeModal()
      this.$emit('closed', null)
    }
  }
}
</script>
