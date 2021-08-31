<template>
  <el-container>
    <el-header>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="menuSelect"
      >
        <el-menu-item index="1">科研计划</el-menu-item>
        <!--<el-menu-item index="2">任务完成情况</el-menu-item>
        <el-menu-item index="3">综合计划</el-menu-item>
        <el-menu-item index="4">共性资源任务</el-menu-item>
        <el-menu-item index="5">管理评审任务</el-menu-item>-->
      </el-menu>
    </el-header>
    <el-main :style="{height: mainHeight}">
      <template v-if="activeIndex == 1">
        <research-plan></research-plan>
      </template>
      <template v-if="activeIndex == 2">
        <down-task-finish-case></down-task-finish-case>
      </template>
      <template v-if="activeIndex == 3">
        综合计划
      </template>
      <template v-if="activeIndex == 4">
        <commResources-List></commResources-List>
      </template>
      <template v-if="activeIndex == 5">
        <quality-appraise></quality-appraise>
      </template>
    </el-main>
  </el-container>
</template>
<script>
import ResearchPlan from './ResearchPlan'
import DownTaskFinishCase from '../../DownTaskFinishCase/list'
import CommResourcesList from './commResourcesList'
import QualityAppraise from './QualityAppraise/index'
import { Container, Header, Main, Menu, MenuItem } from '~/index'
export default {
  name: 'myTask',
  components: {
    ResearchPlan,
    DownTaskFinishCase,
    CommResourcesList,
    QualityAppraise,
    'el-container': Container,
    'el-header': Header,
    'el-main': Main,
    'el-menu': Menu,
    'el-menu-item': MenuItem
  },
  data () {
    const docHeight = document.documentElement.clientHeight - 140
    return {
      activeIndex: '1',
      mainHeight: docHeight + 'px'
    }
  },
  mounted () {

  },
  methods: {
    menuSelect (index, indexPath) {
      this.activeIndex = index
      if (index === '1') {
        this.tableOtherParams = {}
      } else {
        this.tableOtherParams = { mark: 'mark_02' }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .custom-drawer {
  background-color: #fafbff;
  .el-drawer__close-btn {
    z-index: 10;
  }
}
.el-header {
  padding: 0;
  height: 50px !important;
}
</style>
