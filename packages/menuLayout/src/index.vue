<template>
  <el-container class="menuLayout">
    <el-header>
      <el-menu :default-active="activeMenu" class="el-menu-demo" mode="horizontal" v-if="thirdMenuData && thirdMenuData.length>0" :router="true">
        <el-menu-item v-for="item in thirdMenuData" :key="item.name" :index="item.path">
          <i class="p8" :class="item.meta.icon"></i>
          <span slot="title">{{item.meta.title}}</span>
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <keep-alive>
        <router-view :third-menu-param = 'thirdMenuParam'></router-view>
      </keep-alive>
    </el-main>
  </el-container>
</template>
<script>
import { Container, Header, Main, Menu, MenuItem } from 'element-ui'
export default {
  name: 'P8MenuLayout',
  componentName: 'P8MenuLayout',
  components: {
    'el-container': Container,
    'el-header': Header,
    'el-main': Main,
    'el-menu': Menu,
    'el-menu-item': MenuItem
  },
  props: {
    thirdMenuParam: {
      // 给三级菜单所传的参数
      type: Object,
      default: () => {
        return {}
      }
    },
    defaultMenu: {
      type: Object,
      default: () => {
        return {}
      }
    },
    filterThirdMenu: { // 过滤三级菜单， 值为路由的name；  过滤多个时， 以逗号拼接。
      type: String,
      default: 'true'
    }
  },
  data () {
    return {
      thirdMenuData: [],
      activeMenu: ''
    }
  },
  mounted () {
    const currentPath = this.$route.path
    const rootRouter = this.$store.state.routers.addRouters
    let thirdMenu = []
    if (rootRouter && rootRouter.length > 0) {
      rootRouter.map(function (item, index) {
        if (item.children && item.children.length > 0) {
          item.children.map(function (subItem, idx) {
            if (subItem.path === currentPath) {
              thirdMenu = subItem
            }
          })
        }
      })
    }
    let children = thirdMenu.children
    let tempChildren = []
    if (this.filterThirdMenu) {
      children.map(item => {
        if (this.filterThirdMenu.indexOf(item.name) === -1) {
          tempChildren.push(item)
        }
      })
    }
    this.thirdMenuData = this.filterThirdMenu ? tempChildren : thirdMenu.children
    console.log(this.thirdMenuData, 'this.thirdMenuData')
    if (this.thirdMenuData && this.thirdMenuData.length > 0) {
      if (Object.keys(this.defaultMenu).length) {
        this.activeMenu = this.defaultMenu.path
        this.$router.replace({ path: this.defaultMenu.path })
      } else {
        this.activeMenu = this.thirdMenuData[0].path
        this.$router.replace({ path: this.thirdMenuData[0].path })
      }
    }
  }
}
</script>
