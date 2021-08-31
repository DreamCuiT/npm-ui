/**
 *
 */

export const courtyardApi = {
  courtyardTask: [
    {
      name: 'threeLayersTree',
      method: 'POST',
      path: '/product/courtPlanTasks/threeLayersTree',
      mockPath: '/product/courtPlanTasks/threeLayersTree',
      desc: '我的院任务->导航树'
    },
    {
      name: 'getWholeMyCourtTask',
      method: 'POST',
      path: '/product/courtPlanTasks/getWholeMyCourtTask',
      mockPath: '/product/courtPlanTasks/getWholeMyCourtTask',
      desc: '我的院任务->列表项目计划数据'
    },
    {
      name: 'loadPlanGanttData',
      method: 'POST',
      path: '/product/courtPlanTasks/loadPlanGanttData',
      mockPath: '/product/courtPlanTasks/loadPlanGanttData',
      desc: '我的院任务->计划编辑 -> gantt数据加载'
    },
    {
      name: 'updatePlanGanttData',
      method: 'POST',
      path: '/product/courtPlanTasks/updatePlanGanttData',
      mockPath: '/product/courtPlanTasks/updatePlanGanttData',
      desc: '我的院任务->计划编辑 -> 任务更新'
    },
    {
      name: 'submitCourtyardTask',
      method: 'POST',
      path: '/product/courtPlanTasks/submitCourtyardTask',
      mockPath: '/product/courtPlanTasks/submitCourtyardTask',
      desc: '我的院任务->计划编辑 -> 提交至院系统'
    },
    {
      name: 'getTaskOutputFile',
      method: 'POST',
      path: '/product/courtPlanTasks/getTaskOutputFile',
      mockPath: '/product/courtPlanTasks/getTaskOutputFile',
      desc: '获取任务下的输出文件'
    },
    {
      name: 'getTaskData',
      method: 'POST',
      path: '/product/courtPlanTasks/getTaskData',
      mockPath: '/product/courtPlanTasks/getTaskData',
      desc: '获取任务信息'
    }
  ]
}
