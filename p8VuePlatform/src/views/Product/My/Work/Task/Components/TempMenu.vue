<template>
  <el-container>
    <el-header>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
        background-color="#ffffff" text-color="#333333" active-text-color="#1890ff"
        @select="menuSelect">
        <el-menu-item index="1">计划执行</el-menu-item>
        <el-menu-item index="2">计划分解</el-menu-item>
      </el-menu>
      <!-- <div class="chat-icon" @click="openChatDrawer">
        <el-badge :value="3">
          <i class="el-icon-chat-dot-square"></i>
        </el-badge>
      </div> -->
    </el-header>
    <el-main>
      <template v-if="activeIndex==1">
        <plan-carriedout-view></plan-carriedout-view>
      </template>
      <template v-if="activeIndex==2">
        <plan :third-menu-param = 'thirdMenuParam'></plan>
      </template>
      <!-- <common-drawer style="height: calc(100% - 42px); top: 42px" size="40%" title="沟通信息" :visible="chatDrawer" :drawerConfig="drawerConfig"
        @close="closeDrawer">
        <template #drawer>
          <chat-pane></chat-pane>
        </template>
      </common-drawer> -->
    </el-main>
  </el-container>
</template>
<script>
import { Container, Header, Main, Menu, MenuItem } from '~/index' // Badge
import PlanCarriedoutView from '../planCarriedout'
import Plan from '../../../../Pm/Plan/index'
// import { P8Drawer as CommonDrawer } from '~/index'
// import ChatPane from './chatPane'
export default {
  name: 'TempMenu',
  components: {
    PlanCarriedoutView,
    Plan,
    // CommonDrawer,
    // ChatPane,
    'el-container': Container,
    'el-header': Header,
    'el-main': Main,
    'el-menu': Menu,
    'el-menu-item': MenuItem
    // 'el-badge': Badge
  },
  props: ['taskId', 'planInfoId', 'planInfoStatus'],
  data () {
    return {
      activeIndex: '1',
      chatDrawer: false,
      thirdMenuParam: {},
      drawerConfig: {
        modal: false,
        'modal-append-to-body': false,
        'custom-class': 'custom-chat-drawer-class'
      }
    }
  },
  methods: {
    menuSelect (index, indexPath) {
      this.activeIndex = index
      this.thirdMenuParam.planInfoId = this.planInfoId
      this.thirdMenuParam.planInfoStatus = this.planInfoStatus
      this.thirdMenuParam.taskId = this.taskId
      this.thirdMenuParam.createPage = 'decompose'
    },
    openChatDrawer () {
      this.chatDrawer = true
    },
    closeDrawer () {
      this.chatDrawer = false
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-container {
    height: 100%;
  }
  .el-header {
    padding: 0;
    position: relative;
    height: 50px !important;
  }
  .el-main {
    height: 100%;
    padding: 0
  }
  .el-menu-demo {
    padding: 0 20px;
  }
  .chat-icon {
    position: absolute;
    right: 60px;
    top: 14px;
    i {
      font-size: 24px;
      color: #999999;
    }
  }
  /deep/ .el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
    background-color: #E7F4FF !important;
  }
  /deep/ .el-menu--horizontal > .el-menu-item.is-active {
    border-bottom: 2px solid #1890ff
  }
</style>
