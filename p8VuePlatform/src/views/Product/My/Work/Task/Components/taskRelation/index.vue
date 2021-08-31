<template>
  <pane-view paneTitle="关联任务">
    <template #paneTitle>
      <div class="pane-title-right" @click="arrowClickHandle">
        <i class="el-icon-arrow-right"></i>
      </div>
    </template>
    <template #paneInfo>
      <div class="process">
        <process></process>
      </div>
      <div class="tabs-taskinfo">
        <tabs-task></tabs-task>
      </div>
      <!-- <div class="knowledge"> -->
        <!-- <knowledge></knowledge> -->
      <!-- </div> -->
    </template>
  </pane-view>
</template>
<script>
import PaneView from '../layout/Pane'
import Process from './TopProcess'
// import Knowledge from './BottomKnowledge'
import TabsTask from './CenterTabsTask'
export default {
  name: 'TaskRelation',
  props: {},
  components: {
    PaneView,
    Process,
    // Knowledge,
    TabsTask
  },
  methods: {
    arrowClickHandle () {
      this.$bus.$emit('split-pane-right')
    }
  }
}
</script>
<style lang="scss" scoped>
  .pane-title-right {
    float: right;
    font-size: 16px;
  }
  .process {
    height: 30%;
    box-sizing: border-box;
  }
  .tabs-taskinfo {
    height: 70%;
    box-sizing: border-box;
  }
  .knowledge {
    height: 30%;
    box-sizing: border-box;
  }
</style>
