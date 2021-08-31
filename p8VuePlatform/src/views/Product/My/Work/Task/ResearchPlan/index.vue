<template>
  <common-tabs :tabsData="tabsData"
               height="auto"
               :activeTabs="activeTabs" @tab-click="onSelect">
    <template #normal_label v-if="normalSize>0" >
       <el-badge class="mark"
                  :value="normalSize" />
    </template>
    <template #normal>
      <normal v-if="'normal' == activeTabs"></normal>
    </template>
    <template #overallPlanning_label  v-if="overallPlanningSize>0" >
        <el-badge class="mark"
                  :value="overallPlanningSize" />
    </template>
    <template #overallPlanning>
      <overall-planning v-if="'overallPlanning' == activeTabs" ></overall-planning>
    </template>
  </common-tabs>
</template>

<script>
import { P8Tabs as CommonTabs } from '~/index'
import normal from './Components/normal'
import OverallPlanning from './Components/overallPlanning'
import { Badge } from '~/index'
export default {
  name: 'index',
  components: {
    OverallPlanning,
    normal,
    CommonTabs,
    'el-badge': Badge

  },
  data () {
    return {
      activeTabs: 'normal',
      normalSize: 0,
      overallPlanningSize: 0,
      tabsData: [
        {
          label: '已发布',
          name: 'normal',
          value: 0
        },
        {
          label: '统筹中',
          name: 'overallPlanning'
        }
      ]
    }
  },
  mounted () {
      this.getTabSize()
  },
  methods: {
        getTabSize () {
          let that = this
          that.$api['taskManager.taskTabSize']({}).then(res => {
            if (res) {
                that.normalSize = res.normalSize
                that.overallPlanningSize = res.overallPlanningSize
            }
          })
        },
        onSelect (tab, event) {
        this.activeTabs = tab.name
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
