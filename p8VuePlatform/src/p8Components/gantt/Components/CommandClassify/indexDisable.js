/* eslint-disable no-unused-vars */
/* eslint-disable no-const-assign */
import { GanttObject } from '@/assets/commonJS/ganttJS/ganttObject'
import { GanttResolveObject } from '@/assets/commonJS/ganttJS/resolve/resolveGanttObject'
import { checkContentRoot, checkTaskReadonly } from '@/assets/commonJS/ganttJS/commandButtonData.js'

var Gantt = null
var taskId = null
// 如果所选任务的所有父级没有责任人与当前登录人相同则全禁用
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
/**
 *计划编制自定义禁用(添加计划编制独有禁用的方法)
 *
 * @param {object} btn
 * @param {string} ganttName
 * @param {array} tasks
 * @param {object} ganttObject
 * @param {object} vueThis
 * @return {boolean}
 */
function isPlanGantt (btn, ganttName, tasks, ganttObject, vueThis) {
    return publicDisable(btn, ganttName, tasks, ganttObject, vueThis)
}
/**
 *计划分解自定义禁用(添加计划分解独有禁用的方法)
 *
 * @param {object} btn
 * @param {string} ganttName
 * @param {array} tasks
 * @param {object} ganttObject
 * @param {object} vueThis
 * @return {boolean}
 */
function isPlanResolveGantt (btn, ganttName, tasks, ganttObject, vueThis) {
  if (tasks.some(item => { return !checkResolve(ganttObject, item) })) {
    console.log('%c如果所选任务的所有父级没有责任人与当前登录人相同则全禁用', 'color:red', btn.title, ganttName, tasks)
    return true
  } else {
    return publicDisable(btn, ganttName, tasks, ganttObject, vueThis)
  }
}
/**
 *变更中自定义禁用(添加变更中独有禁用的方法)
 *
 * @param {object} btn
 * @param {string} ganttName
 * @param {array} tasks
 * @param {object} ganttObject
 * @param {object} vueThis
 * @return {boolean}
 */
function isChangeGantt (btn, ganttName, tasks, ganttObject, vueThis) {
  if (tasks.some(function (task) { return task.infoType && task.infoType === 'delete' })) {
    console.log('变更中已删除任务不可操作', btn.title, ganttName, tasks)
    return true
  } else {
    return publicDisable(btn, ganttName, tasks, ganttObject, vueThis)
  }
}
/**
 *如果当前选中是生产类型并且子任务存在生产/试制类型数据返回true
 *
 * @param {object} btn
 * @param {string} ganttName
 * @param {array} tasks
 * @param {object} ganttObject
 * @return {boolean}
 */
function isCancelSelClCassify (btn, ganttName, tasks, ganttObject) {
  let mId = btn.id
  if (mId === 'cancelSelClassify') {
    return tasks.some((t, i) => {
              // 如果子任务存在生产/试制类型数据不能删除父
              let childCheak = false
              t.planType === '3103' && ganttObject.eachTask(function (t) {
                if (t.planType && t.planType.indexOf('3103') !== -1) {
                  childCheak = true
                  return true
                }
              }, t.id)
              return childCheak
          })
  } else {
    return false
  }
}
/**
 *选中数据是生产试制类型的子节点，不能有生产试制
 *
 * @param {object} btn
 * @param {string} ganttName
 * @param {array} tasks
 * @param {object} ganttObject
 * @return {boolean}
 */
function isProduceChildNoProduce (btn, ganttName, tasks, ganttObject) {
  return tasks.every(taskItem => {
            if (taskItem.planType && taskItem.planType === '3103') {
              let child = ganttObject.getChildren(taskItem.id)
              return child.some(taskId => {
                return ganttObject.getTask(taskId).planType && ganttObject.getTask(taskId).planType.includes('3103')
              })
            } else {
              return false
            }
        })
}
function multipleDisable (Gantt, btn, tasks, ganttName) {
  let taskCheck = false
  let mId = btn.id
  let mParentId = btn.parentId
  // 生产试制: 选中所有数据planType为空为false，否则true
  const hasChildLoopPT = (data) => {
      let bool = false
      data.forEach(item => {
        Gantt.getChildren(item.id).forEach(i => {
          if (Gantt.getTask(i).children) {
            hasChildLoopPT(Gantt.getTask(i).children)
          }
          bool = !!Gantt.getTask(i).planType
          if (bool) {
              throw new Error()
          }
        })
      })
      return bool
  }
  // 七大类: 选中所有数据为父是否是生产试制,选中所有数据planType为空为false，否则true
  const hasNextLoop = (data) => {
      // step 1 不能有子
      let noKids = data.some(item => { return Gantt.hasChild(item.id) })
      if (noKids) {
        return true
      }
      // step 2 父是生产试制
      // eslint-disable-next-line no-unused-expressions
      // bool ? (data.every(item => { return Gantt.getTask(Gantt.getParent(item.id)).planType === '3103' }) ? bool = true : bool = false) : ''
      let parentIsTrial = data.every(item => { return Gantt.getTask(Gantt.getParent(item.id)).planType === '3103' })
      if (!parentIsTrial) {
        return true
      }
      // step 3 选中所有数据planType为空
      // eslint-disable-next-line no-unused-expressions
      // bool ? bool = !data.every(item => { return !item.planType }) : bool = true
      let planTypeIsNull = data.some(item => { return item.planType })
       if (planTypeIsNull) {
        return true
      }
      return false
  }
  if (mId === '3103') {
    // 计划类型是否都为空
    taskCheck = hasChildLoopPT(tasks)
  }
  if (mParentId === '3103') {
    taskCheck = hasNextLoop(tasks)
  }
  tasks.forEach((task) => {
    // 计算任务的嵌套级别
    let level = Gantt.calculateTaskLevel(task)
    let parentTask = Gantt.getTask(task.parent)
    let ruleBool = null
    taskId ? ruleBool = (level >= 1) : ruleBool = (level > 1) // 显示情况判断级别应该根据不同界面判断根节点 我的任务页面   /* 为任务叶子节点并且有父任务 */
    if (ruleBool && !Gantt.hasChild(task.id)) {
      parentTask.planType === '3103' ? taskCheck = false : taskCheck = true
    } else {
      taskCheck = true
    }
    if (mId === '3103' && level >= 1) {
      taskCheck = false
    }
  })
  // true 禁用
  return taskCheck
}
function checkTaskOtherDisable (btn, ganttName, ganttObject, tasks) {
  let taskCheck = false
  let mId = btn.id
  let mParentId = btn.parentId
  if (mId === '3103' || mParentId === '3103') {
    if (tasks && tasks.length) {
      taskCheck = multipleDisable(ganttObject, btn, tasks, ganttName)
    }
  }
  return taskCheck
}

/**
 *通用禁用,(添加公共禁用的方法)
 *
 * @param {object} btn
 * @param {string} ganttName
 * @param {array} tasks
 * @param {object} ganttObject
 * @param {object} vueThis
 * @return {boolean}
 */
function publicDisable (btn, ganttName, tasks, ganttObject, vueThis) {
    // 标识按钮id
    let mId = btn.id
    // gantt为readonly=true时，不可选
    if (ganttObject && ganttObject.config.readonly) {
      console.log('%cgantt为readonly=true时，不可选', 'color:red', btn.title, ganttName, tasks)
      return true
    }
    if (vueThis.readOnly) {
      return true
    }
    // 包含根节点时，不可选
    if (checkContentRoot(ganttName, tasks)) {
      console.log('%c包含根节点时，不可选', 'color:red', btn.title, ganttName, tasks)
      return true
    }
    // 任务的readonly属性为true时，不可操作
    if (checkTaskReadonly(ganttName, tasks)) {
      // console.log('%c任务的readonly属性为true时，不可操作', 'color:red', btn.title, ganttName, tasks)
      return true
    }
    // 选中有计划标识的除“取消按钮”都禁用
    if (tasks.some(item => { return item.planType }) && btn.id !== 'cancelSelClassify') {
      console.log('%c选中有计划标识的除“取消按钮”都禁用', 'color:red', btn.title, ganttName, tasks)
      return true
    }
    // 有子任务不能添加“设计”标识
    if (btn && btn.id === '3101' && tasks.some(taskItem => { return ganttObject.hasChild(taskItem.id) })) {
      console.log('%c有子任务不能添加“设计”标识', 'color:red', btn.title, ganttName, tasks)
      return true
    }
    // 生产试制，七大类禁用校验
    if (checkTaskOtherDisable(btn, ganttName, ganttObject, tasks)) {
      console.log('%c生产试制，七大类禁用校验', 'color:red', btn.title, ganttName, tasks)
      return true
    }
    // 取消任务类型按钮 如果子任务存在生产/试制类型数据不能删除父
    if (isCancelSelClCassify(btn, ganttName, tasks, ganttObject)) {
      console.log('%c如果子任务存在生产/试制类型数据不能取消父', 'color:red', btn.title, ganttName, tasks)
      return true
    }
    // 选中任务中存在任务类型为当前类型的任务时，按钮置灰
    if (tasks.some(t => { return t.planType && t.planType.includes(mId) })) {
      console.log('%c选中任务中存在任务类型为当前类型的任务时，按钮置灰', 'color:red', btn.title, ganttName, tasks)
      return true
    }
    // 选中数据是生产试制类型的子节点，不能有生产试制
    if (isProduceChildNoProduce(btn, ganttName, tasks, ganttObject)) {
      console.log('%c选中数据是生产试制类型的子节点，不能有生产试制', 'color:red', btn.title, ganttName, tasks)
      return true
    }
    return false
 }
export default {
  created: function () {
    // planResolveGantt计划分解页面
    if (this.ganttName === 'planResolveGantt') {
      Gantt = GanttResolveObject
    } else {
      Gantt = GanttObject
    }
    taskId = this.taskId
  },
  methods: {
    isDisable (btn, ganttName, tasks) {
      if ((!btn && !ganttName) || !tasks.length) return true
      const ganttObject = Gantt.getGanttObject(ganttName)
      if (ganttName === 'planGantt') {
        return isPlanGantt(btn, ganttName, tasks, ganttObject, this.vueThis)
      }
      if (ganttName === 'planResolveGantt') {
        return isPlanResolveGantt(btn, ganttName, tasks, ganttObject, this.vueThis)
      }
      if (ganttName === 'changeGantt') {
        return isChangeGantt(btn, ganttName, tasks, ganttObject, this.vueThis)
      }
    }
  }
}
