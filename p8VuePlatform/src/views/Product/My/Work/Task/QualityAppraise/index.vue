<template>
  <common-tabs :tabsData="tabsData"
               height="auto"
               :activeTabs="activeTabs">
    <template #leaderTask>
      <leader-task></leader-task>
    </template>
    <template #improveAdvise>
      <improve-advise></improve-advise>
    </template>
  </common-tabs>
</template>

<script>
import { P8Tabs as CommonTabs } from '~/index'
import LeaderTask from './Components/leaderTask'
import ImproveAdvise from './Components/improveAdvise'
export default {
  name: 'index',
  components: {
    ImproveAdvise,
    LeaderTask,
    CommonTabs
  },
  data () {
    return {
      activeTabs: 'leaderTask',
      tabsData: [
        {
          label: '管理评审计划领导任务',
          name: 'leaderTask',
          value: 0
        },
        {
          label: '管理评审计划责任人任务',
          name: 'dutyTask'
        },
        {
          label: '管理评审改进意见',
          name: 'improveAdvise'
        }
      ],
      formData: Object.assign({}, {
        confidentialiteList: []
      })
    }
  }
}
</script>

<style scoped>
</style>
