<template>
  <el-container>
    <el-header>
      <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="menuSelect"
      >
        <el-menu-item index="1">项目会议管理</el-menu-item>
        <el-menu-item index="2">调度会议管理</el-menu-item>
      </el-menu>
    </el-header>
    <el-main >
      <template v-if="activeIndex == 1">
        <project-list></project-list>
      </template>
      <template v-if="activeIndex == 2">
        <meeting-list></meeting-list>
      </template>
    </el-main>
  </el-container>
</template>

<script>
import { Container, Header, Main, Menu, MenuItem } from '~/index'
import ProjectList from './projectList'
import MeetingList from './meetingList'
export default {
      name: 'mainList',
      components: {
        ProjectList,
        MeetingList,
        'el-container': Container,
        'el-header': Header,
        'el-main': Main,
        'el-menu': Menu,
        'el-menu-item': MenuItem
      },
      data () {
          const docHeight = document.documentElement.clientHeight - 110
        return {
          activeIndex: '1',
          mainHeight: docHeight + 'px'
        }
      },
      methods: {
        menuSelect (index, indexPath) {
          this.activeIndex = index
          // if (index === '1') {
            this.tableOtherParams = {}
          // } else {
          //   this.tableOtherParams = { mark: 'mark_02' }
          // }
        }
      }
}

</script>

<style lang="scss" scoped>
/deep/ .custom-drawer {
  background-color: #fafbff;
  .el-drawer__close-btn {
    //z-index: 10;
  }
}
.el-header {
  padding: 0;
  height: 0px !important;
}
</style>
<style lang="scss">
.ant-drawer-wrapper-body {
  height: calc(100%);
}
.ant-drawer-body {
  height: 100%;
}
i.el-icon-menu {
  color: #1890ff;
  font-size: 16px;
}
.three-menu {
  .menu-item {
    display: flex;
    align-items: center;
    padding: 5px;
    &:hover {
      background-color: #e6f7ff;
      cursor: pointer;
    }
    span {
      padding-left: 6px;
      font-size: 14px;
    }
  }
}
.base-custom-style {
  color: $base-white-color;
  padding: 0 2px;
  font-size: 12px;
  border-radius: 10px;
  cursor: pointer;
  &.approve {
    background-color: $base-red-color;
  }
  &.leaf {
    background-color: $base-green-color;
  }
}
</style>
