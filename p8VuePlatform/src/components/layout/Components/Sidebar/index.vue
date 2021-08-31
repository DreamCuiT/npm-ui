<template>
  <!-- <transition name="bounce"> -->
      <div class="sidebar"
      :class="{ width: sidebarState.width }"
      v-show="!sidebarState.isHidden"
      >
      <VuePerfectScrollbar :settings="scrollOptions">
        <el-menu mode="vertical" class="vertical-menu"
          :default-active="$route.path"
          :router="true"
          unique-opened
          text-color="#fff"
          :collapse="!sidebarState.isOpen"
          :collapse-transition="false">
            <template v-for="item in asyncRouter" >
              <template v-if="!item.hidden && item.children">
                <!-- no children -->
                <template v-if="item.children[0].path === 'dash' || item.children[0].path === 'Dashboard'" >
                  <el-menu-item :index="item.path + '/' + item.children[0].path" :key="item.name">
                      <i v-if="!sidebarState.isOpen" class="p8" :class="item.children[0].meta.icon"></i>
                      <i v-else class="p8" :class="item.children[0].meta.icon"></i>
                      <span slot="title">{{ item.children[0].meta.title }}</span>
                  </el-menu-item>
                </template>
                <!-- have children -->
                <el-submenu v-else :index="item.meta.title || item.path" :key="item.name" class="custom-submenu">
                    <template slot="title" >
                      <i v-if="item.meta && item.meta.icon" class="p8" :class="item.meta.icon"></i>
                      <span v-if="item.meta && item.meta.title">{{ item.meta.title }}</span>
                    </template>
                    <div class="cumtom-submenu-menu">
                      <template v-for="child in item.children" >
                      <template v-if="!child.hidden">
                        <!-- <sidebar-menu-item  v-if="child.children && child.children.length > 0"
                            :is-nest="true" class="nest-menu" :routes="[child]" :key="child.name">
                        </sidebar-menu-item>
                        <template v-else> -->
                            <el-menu-item :index="child.path" :key="child.name">
                              <el-tooltip placement="right" :disabled="child.meta.title.length < 8" :content="child.meta.title">
                                <div>
                                  <i v-if="child.meta && child.meta.icon" class="p8" :class="child.meta.icon"></i>
                                  <span v-if="child.meta && child.meta.title">{{ child.meta.title }}</span>
                                </div>
                              </el-tooltip>
                            </el-menu-item>
                        <!-- </template> -->
                        </template>
                      </template>
                    </div>
                </el-submenu>
              </template>
            </template>
        </el-menu>
        </VuePerfectScrollbar>
      </div>
  <!-- </transition> -->
</template>

<script>
import { Menu, Submenu, MenuItem, Tooltip } from '~/index'
import { mapGetters } from 'vuex'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
// import SidebarMenuItem from './SidebarMenuItem'

export default {
  name: 'Sidebar',
  data () {
    return {
      scrollOptions: {
        suppressScrollX: true
      }
    }
  },
  computed: {
    ...mapGetters(['asyncRouter', 'sidebarState', 'systemTheme']),
    // 这里必须根据条件结合ElementUI的sidebar来调整颜色,保证自定义主题和sidebar的内置颜色一致.
    systemThemeColor: function () {
      switch (this.systemTheme) {
        case 'batman':
        case 'belles':
          return '#37474F'
        default:
          return '#ffffff'
      }
    }
  },
  components: {
    VuePerfectScrollbar,
    // SidebarMenuItem,
    'el-menu': Menu,
    'el-submenu': Submenu,
    'el-menu-item': MenuItem,
    'el-tooltip': Tooltip
  }
}
</script>

<style lang="scss">
$menu-hover-color:#032353;
$menu-active-color:#04224E;
$menu-collapse-text-color:#ffffff;

.sidebar{
  display: flex;
  flex-direction: column;
  flex: none;
  overflow: hidden;
  background:#133B78;

  .vertical-menu {
    border-right:none;
    background:transparent;

    .el-submenu__title:hover{
      background:$menu-hover-color!important;
    }

    li  {
      i {
        font-size:$font-size-medium;
        color:$base-white-color;

        &.el-icon-arrow-down, &.el-icon-arrow-up{
          font-size:$font-size-small
        }
      }
      span {
        width:calc(100% - 15px);
        display: inline-block;
        margin-left:5px;
        line-height:30px;
        overflow:hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

  }

  // sidebar menu css override
  .vertical-menu:not(.el-menu--collapse) {
    width:$base-sidebar-width;
  }

  .el-menu--collapse{

    li{
      i{
        font-size:$font-size-large;
      }
    }

  }

  .el-menu-item{
    height:36px;

    &.is-active{
      background:$menu-active-color;
      color:$base-white-color;
    }

    &:hover{
      background:$menu-hover-color!important;
    }

    .el-submenu__title {
      height:36px !important;
      font-size:14px !important;
      line-height:36px !important;

      span {
        line-height:36px !important;
      }
    }
  }

  .el-submenu {

    .el-menu-item {
      line-height:36px !important;
      min-width:$base-sidebar-width;
      padding-right:10px;

    }
    .el-menu{
      background:transparent;
    }
  }

}

.el-menu--vertical{
  .el-menu--popup{
    .cumtom-submenu-menu{
      li{
        i{
          margin-right:5px;
        }
        span{
          color:$menu-collapse-text-color;
        }

        &.is-active{
          span{
            color:$base-light-color;
          }
        }
      }
    }
  }
}

</style>
