<template>
    <el-tabs class="progressTaskTabs" v-model="tabsActiveName" @tab-click="tabsClick">
      <el-tab-pane v-for="item in taskTabs" :key="item.name"
         :label="item.label" :name="item.name">
          <template v-if="item.name === 'progess'">
            <progess ref="progess"></progess>
          </template>
          <template v-if="item.name === 'deviate'">
            <!-- <i class="el-icon-warning"></i> -->
              <span slot="label">{{item.label}}</span>
            <deviate ref="deviate"></deviate>
          </template>
          <template v-if="item.name === 'change'">
            <change ref="change"></change>
          </template>
          <template>
            <overall ref="overall" :isShow="taskTabs.length <= 1"></overall>
          </template>
      </el-tab-pane>
    </el-tabs>
</template>
<script>
import { Tabs, TabPane } from '~/index'
import Progess from './Progess'
import Deviate from './Deviate'
import Change from './Change'
import overall from './overall'
export default {
  name: 'TaskTabsView',
  inject: ['getPlanInfo'],
  components: {
    Progess,
    Deviate,
    Change,
    overall,
    'el-tabs': Tabs,
    'el-tab-pane': TabPane
  },
  data () {
    return {
      taskTabs1: [
        { label: '进度反馈', name: 'progess' },
        { label: '偏离原因', name: 'deviate' }
        // { label: '变更申请', name: 'change' }
      ],
      taskTabs2: [
        { label: '工期统筹', name: 'overall' }
      ],
      taskTabs: [],
      tabsActiveName: 'progess'
    }
  },
  mounted () {
    if (this.getPlanInfo().managerStatus !== '6402') {
      this.taskTabs = this.taskTabs1
      this.tabsActiveName = 'progess'
    } else {
      this.taskTabs = this.taskTabs2
      this.tabsActiveName = 'overall'
    }
  },
  methods: {
    tabsClick () {}
  }
}
</script>
<style lang="scss" scoped>
  .progressTaskTabs.el-tabs {
    background-color: #FFFFFF;
    height: 100%;
  }
  .progressTaskTabs /deep/ .el-tabs__header {
    margin: 0;
  }
  .progressTaskTabs /deep/ .el-tabs__nav-wrap {
    background-color: #f5f7fa;
    padding: 0 14px;
    &::after {
      height: 0px;
    }
  }
  .progressTaskTabs /deep/ .el-tabs__content {
    padding: 0 10px;
    height: calc(100% - 40px);
  }
  .progressTaskTabs /deep/ .el-tab-pane {
    height: 100%;
  }
</style>
