<template>
  <div>
    <template v-for='(mon, index) in childGroups(monitorData)'>
      <div class='child-group' :key='index'>
        <command-button v-for='(config, index) in mon.configs'
                        :key='index'
                        :cbutton='config'
                        :size='config.size'
                        :current-records='currentRecords'
                        :gantt-name='ganttName'></command-button>
      </div>
    </template>
  </div>
</template>

<script>
import iconAnnualOverallPlan from '@/assets/image/gantt/icon-annual-overall-plan.png'
import iconMilepost from '@/assets/image/gantt/icon-milepost.png'
import iconExclusiveProgram from '@/assets/image/gantt/icon-exclusive-program.png'
import iconMonthlyComprehensivePlan from '@/assets/image/gantt/icon-monthly-comprehensive-plan.png'
import iconCourtOrder from '@/assets/image/gantt/icon-court-order.png'
import CommandButton from '../CommandButton'
import { GanttObject } from '@/assets/commonJS/ganttJS/ganttObject'
import { GanttResolveObject } from '@/assets/commonJS/ganttJS/resolve/resolveGanttObject'
import { checkContentRoot, checkTaskReadonly } from '@/assets/commonJS/ganttJS/commandButtonData'
import { lockMonitor } from '@/assets/commonJS/ganttJS/ganttLockUnLock'
import { mapGetters } from 'vuex'
import { updateMonitor } from '@/assets/commonJS/ganttJS/changeGantt'

let button = {}
export default {
  name: 'CommandMonitor',
  components: {
    CommandButton
  },
  props: {
    planInfoId: String,
    currentRecords: Array,
    ganttName: String,
    rowNum: {
      type: Number,
      default: 2
    }
  },
  data () {
    return {
      ganttObjectData: {},
      formatDatas: {
        'p8 icon-annual-overall-plan': iconAnnualOverallPlan,
        'p8 icon-court-order': iconCourtOrder,
        'p8 icon-exclusive-program': iconExclusiveProgram,
        'p8 icon-monthly-comprehensive-plan': iconMonthlyComprehensivePlan,
        'p8 icon-milepost': iconMilepost
      },
      monitorData: []
    }
  },
  watch: {
    currentRecords: function (newVal, oldVal) {
      let _this = this
      if (JSON.stringify(button) !== '{}' && button.id.startsWith('format-') && newVal) {
        if (!button.isDisableFun(button, this.ganttName, newVal)) {
          button.clickFun(button, this.ganttName, newVal)
        } else {
          let thisGantt = _this.ganttObjectData.getGanttObject(this.ganttName)
          thisGantt.message({
            text: '当前任务无法标识！',
            expire: 3000
          })
        }
      }
    },
    planInfoId: function (newVal, oldVal) {
      if (newVal) {
        this.planInfoId = newVal
        this.loadMonitorData(newVal)
      }
    }
  },
  computed: {
    childGroups () {
      let that = this
      return function (data) {
        let configArray = []
        let childGroup = { configs: [] }
        data.map((item, index) => {
          // 绑定disable和click
          const isDisableFun = that.isDisableFun()
          const clickFun = that.clickFun()
          item.isDisableFun = isDisableFun
          item.clickFun = clickFun
          if (!item.size) {
            item.size = 'small'
          }
          if (item.id !== 'cancelSel') {
            let chlBtn = [
              {
                id: 'format-' + item.id,
                title: item.title + '格式刷',
                icon: 'p8 icon-mark-format-brush',
                parentIcon: item.icon,
                help: item.title + '格式刷',
                clickFun: that.clickFun(),
                isDisableFun: that.isDisableFun()
              },
              {
                id: 'delete-' + item.id,
                title: '取消' + item.title,
                icon: 'p8 icon-remove',
                help: '取消' + item.title,
                clickFun: that.clickFun(),
                isDisableFun: that.isDisableFun()
              }
            ]
            item.children = chlBtn
          }

          if (item.size === 'large') {
            if (childGroup.configs.length > 0) {
              configArray.push(childGroup)
              childGroup = { configs: [] }
            }
            childGroup.configs.push(item)
            configArray.push(childGroup)
            childGroup = { configs: [] }
          } else if (item.size === 'small') {
            if (childGroup.configs.length < this.rowNum) {
              childGroup.configs.push(item)
            }
            if (childGroup.configs.length === this.rowNum || (data.length === (index + 1))) {
              configArray.push(childGroup)
              childGroup = { configs: [] }
            }
          } else if (item.size === 'mini') { // 只显示图标
            if (childGroup.configs.length < this.rowNum) {
              childGroup.configs.push(item)
            }
            if (childGroup.configs.length === this.rowNum || (data.length === (index + 1))) {
              configArray.push(childGroup)
              childGroup = { configs: [] }
            }
          }
        })
        return configArray
      }
    },
    ...mapGetters(['vueThis', 'taskStatusLockMap'])
  },
  mounted () {
    this.loadMonitorData(this.planInfoId)
    this.initGanttObject()
  },
  methods: {
    initGanttObject () {
      if (this.ganttName === 'planResolveGantt') {
         this.ganttObjectData = GanttResolveObject
      } else {
        this.ganttObjectData = GanttObject
      }
    },
    loadMonitorData (planInfoId) {
      // 加载标识数据
      let that = this
      this.$api['planGanttManager.loadMonitorPointData']({ planInfoId: planInfoId }).then(function (res) {
        if (res) {
          that.monitorData = res
          // 添加取消按钮
          let cancelSel = {
            id: 'cancelSel',
            title: '取消标识格式刷',
            picUrl: '',
            icon: 'p8 icon-mouse-pointer',
            size: 'small',
            help: '取消标识格式刷'
          }
          that.monitorData.push(cancelSel)
          that.monitorData = that.monitorData.filter(r => r.id !== '1022')
          that.monitorData = that.monitorData.filter(r => r.id !== '1030')
          that.$store.dispatch('setButtons', { btns: that.monitorData, type: 'monitor' })
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    isDisableFun () { // 标识逻辑
      let that = this
      return function (btn, ganttName, tasks) {
        let switchType = tasks[0] ? tasks[0].switchType : ''
        if (switchType) {
          if (switchType === '9010' || switchType === '9020') {
            return true
          }
        }
        if (btn.id === '1030' || btn.id === 'format-1030') {
          return true
        }
        if (ganttName === 'planResolveGantt' && (btn.id === '1012' || btn.id === 'format-1012' || btn.id === 'delete-1012')) {
          return true
        }
        if (ganttName === 'planResolveGantt' && tasks.length > 0) {
          let thisGantt = that.ganttObjectData.getGanttObject(ganttName)
          if (!checkResolve(thisGantt, tasks[0])) {
            return true
          }
        }
        if (btn != null && ganttName) {
          let thisGantt = that.ganttObjectData.getGanttObject(ganttName)
          // 标识id
          let mId = btn.id
          // gantt为readonly=true时，不可选
          if (thisGantt && thisGantt.config.readonly) {
            return true
          }
          if (that.vueThis.readOnly) {
            return true
          }
          // 取消选中按钮
          if (mId === 'cancelSel' && JSON.stringify(button) === '{}') {
            return true
          }
          // 计划标识加锁后，不可操作
          if (mId !== 'cancelSel') {
            if (mId.indexOf('format') !== -1 || mId.indexOf('delete') !== -1) {
              let monId = mId.split('-')[1]
              if (lockMonitor(that.vueThis.monitorLockMap, monId)) {
                return true
              }
            } else {
              if (lockMonitor(that.vueThis.monitorLockMap, mId)) {
                return true
              }
            }
          }
          if (tasks && tasks.length > 0) {
            // 包含根节点时，不可选
            if (checkContentRoot(ganttName, tasks)) {
              return true
            }
            // 任务的readonly属性为true时，不可操作
            if (checkTaskReadonly(ganttName, tasks)) {
              return true
            }
            // 变更中已删除任务不可操作
            if (ganttName === 'changeGantt') {
              let result = false
              tasks.some(function (task) {
                if (task.infoType && task.infoType === 'delete') {
                  result = true
                  return true
                }
              })
              if (result) {
                return result
              }
            }
            if (mId.startsWith('delete-')) { // 取消标识按钮
              let taskCheck = tasks.some((t, i) => {
                if (t.monitorPoints && t.monitorPoints.indexOf(mId.substring(7)) !== -1) {
                  // 院所标识同时存在不可取消所标识
                  if (mId.substring(7) === '1030' && t.monitorPoints.indexOf('1022') !== -1) {
                  } else {
                    return true
                  }
                }
              })
              return !taskCheck
            } else {
            // 依赖标识
              let relyIds = btn.relyIds != null ? btn.relyIds.split(',') : null
              // 互斥标识
              let mutexIds = btn.mutexIds != null ? btn.mutexIds.split(',') : null
              // 判断
              let taskCheck = tasks.some((t, i) => {
              // 如果选中行已包含当前标识，不可选
                if (t.monitorPoints && t.monitorPoints.indexOf(mId) !== -1) {
                  return true
                }
                // 没有依赖标识，不可选
                if (relyIds != null && relyIds.length > 0) {
                  if (t.monitorPoints) {
                    return relyIds.some((rId, index) => {
                      if (t.monitorPoints.indexOf(rId) === -1) { return true }
                    })
                  } else {
                    return true
                  }
                }
                // 存在互斥标识，不可选
                if (mutexIds != null && mutexIds.length > 0) {
                  if (t.monitorPoints) {
                    return mutexIds.some((rId, index) => {
                      if (t.monitorPoints.indexOf(rId) !== -1) { return true }
                    })
                  } else {
                    return false
                  }
                }
              })
              return taskCheck
            }
          } else {
            // 格式刷
            if (mId.startsWith('format-') && JSON.stringify(button) !== '{}') {
              return true
            }
            if (!mId.startsWith('format-') && JSON.stringify(button) === '{}') {
              return true
            }
          }
        }
        return false
      }
    },
    clickFun () {
      let that = this
      return function (btn, ganttName, tasks) {
        console.log(btn, '点击任务标识btn')
        console.log(ganttName, '点击任务标识ganttName')
        console.log(tasks, '点击任务标识tasks')
        if (btn != null && ganttName) {
          let thisGantt = that.ganttObjectData.getGanttObject(ganttName)
          // 标识id
          let mId = btn.id
          // 取消标识选中
          if (mId === 'cancelSel') {
            button = {}
            document.getElementById('couerDiv').style.cursor = null
            thisGantt.eachSelectedTask(function (id) {
              if (thisGantt.isTaskExists(id)) {
                thisGantt.unselectTask(id)
              }
            })
          }

          // 点击格式刷时清空选中任务
          if (JSON.stringify(button) === '{}' && mId.startsWith('format-')) {
            thisGantt.eachSelectedTask(function (id) {
              if (thisGantt.isTaskExists(id)) {
                thisGantt.unselectTask(id)
              }
            })
          }
          if (tasks && tasks.length > 0) {
            let monitorPointsMap = {}
            that.vueThis.monitorPointDatas.forEach(function (item) {
              monitorPointsMap[item.monitorId] = item
            })
            if (mId.startsWith('delete-')) { // 取消标识按钮
              thisGantt.batchUpdate(function () {
                tasks.forEach(function (task) {
                  let point = mId.substring(7)
                  if (task.monitorPoints && task.monitorPoints.indexOf(point) !== -1) {
                    if (task.monitorPoints.indexOf(point + ',') !== -1) {
                      point = point + ','
                    } else if (task.monitorPoints.indexOf(',' + point) !== -1) {
                      point = ',' + point
                    }
                    task.monitorPoints = task.monitorPoints.replace(point, '')
                    thisGantt.updateTask(task.id)
                    if (that.ganttName === 'changeGantt') {
                      updateMonitor(that.vueThis.taskMonitorMap, task, that.vueThis, monitorPointsMap, point, 'remove', thisGantt)
                    }
                  }
                })
              })
            } else if (mId !== 'cancelSel') {
              let monitorPointsId = btn.id
              if (btn.id.startsWith('format-')) {
                monitorPointsId = monitorPointsId.replace('format-', '')
              }
              thisGantt.batchUpdate(function () {
                tasks.forEach(function (task) {
                  console.log(task, '查看选中计划')
                  console.log(thisGantt.getTask(task.id), '查看选中计划')
                  // 任务属性readonly为ture的不可添加标识
                  if (!task.readonly) {
                    if (task.monitorPoints) {
                      if (task.monitorPoints.indexOf(monitorPointsId) === -1) {
                        task.monitorPoints = task.monitorPoints + ',' + monitorPointsId
                        thisGantt.updateTask(task.id)
                      }
                    } else {
                      task.monitorPoints = monitorPointsId
                      thisGantt.updateTask(task.id)
                    }
                    if (that.ganttName === 'changeGantt') {
                      updateMonitor(that.vueThis.taskMonitorMap, task, that.vueThis, monitorPointsMap, monitorPointsId, 'add', thisGantt)
                    }
                  }
                })
              })
            }
          } else if (mId.startsWith('format-')) { // 标识点击格式刷
            button = btn
            document.getElementById('couerDiv').style.cursor = 'url(' + that.formatDatas[btn.parentIcon] + '),auto'
            // 刷新标识按钮显示
            that.monitorData.forEach(function (item) {
              item.isDisableFun(item, ganttName, tasks)
              if (item.children && item.children.length > 0) {
                item.children.forEach(function (child) {
                  child.isDisableFun(child, ganttName, tasks)
                })
              }
            })
          }
        }
      }
    }
  }
}

function checkResolve (ganttObject, task) {
  if (task.parent) {
    let parentTask = ganttObject.getTask(task.parent)
    if (parentTask.dutyUserId === parentTask.nowUserId) {
      return true
    } else {
      return checkResolve(ganttObject, parentTask)
    }
  } else {
    return false
  }
}
</script>

<style scoped>
.group .child-group {
  float: left;
}
</style>
