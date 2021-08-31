<template>
  <div class="content">
    <div class="moduleTitle">个人工作看板</div>
    <el-container class="contain">
      <VuePerfectScrollbar class="scroll-area">
        <grid-layout
            :layout="layout"
            :column="columnSize"
            :row-height="itemRowHeight"
            :margin="itemMargin"
            @layout-updated="updateLayout"
          >
            <grid-item
              v-for="item in layout"
              :x="item.x"
              :y="item.y"
              :w="item.w"
              :h="item.h"
              :i="item.i"
              :key="item.i"
              @resized="itemResize(item)"
              @moved="itemMoved(item)"
              drag-allow-from=".vue-draggable-handle"
              drag-ignore-from=".no-drag"
            >
            <div class="item-main">
              <div class="item-title vue-draggable-handle item-move-handle">
                <i class="p8 icon-personal-work-progress" style="float:left;font-size:18px;margin:0 4px 0 10px;"></i>
                <span style="float:left;">个人工作进展</span>
              </div>
              <!-- 功能缺失，暂时屏蔽 -->
              <!-- <div class="item-remove-handle" @click="removeComponent(item)"><i class="el-icon-close"></i></div> -->
              <div class="item-content no-drag">
                <dynamic-component :com="item.component" />
              </div>
            </div>
          </grid-item>
        </grid-layout>
      </VuePerfectScrollbar>
    </el-container>
  </div>
</template>
<script>
import { Container } from '~/index'
import { GridLayout, GridItem } from 'vue-grid-layout'
import DynamicComponent from './DynamicComponent'
// Dashboard store
import DashboardStore from '@/views/Dashboard/Store'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { layoutData } from './Components/layoutData'
import '@/assets/commonStyle/Dashboard.scss'
export default {
  name: 'WorkProjectProgress',
  data () {
    return {
      // 布局数据
      layout: [],
      // 初始布局,用于判断布局是否有过变动
      initLayout: [],
      // 默认可配置的列数
      columnSize: 12,
      // 行高度(px),表示默认单行的高度,在数据队形中对应字段'h',
      // 如果配置了'h': 10, 则表示组件默认高度为300px
      itemRowHeight: 30,
      // 默认元素间距
      itemMargin: [10, 10]
    }
  },
  beforeMount () {
    // Dashboard 动态注册 store
    DashboardStore.install()
  },
  beforeDestroy () {
    //
    DashboardStore.uninstall()
  },
  mounted () {
    this.initLayoutData()
  },
  methods: {
    initLayoutData () {
      this.$nextTick(() => {
        this.layout = layoutData.filter(layout => layout.component)
        this.initLayout = Object.assign({}, this.layout)
        this.isShowLoading = false
      })
    },
    // 当布局更新时,自动保存最新的布局
    updateLayout (newLayout) {
      // TODO: update remote dat

    },
    itemResize (item) {
      this.$store.dispatch('Dashboard/setOperateItem', item)
    },
    itemMoved (item) {
      this.$store.dispatch('Dashboard/setOperateItem', item)
    },
    removeComponent (item) {
      this.$confirm(`是否要移除组件:${item.component}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.layout = this.layout.filter(ly => ly.component !== item.component)
        // 移除操作需要自触发
        this.updateLayout(this.layout)
      }).catch(() => { })
    }
  },
  components: { GridLayout, GridItem, DynamicComponent, VuePerfectScrollbar, 'el-container': Container }
}
</script>
<style lang="scss" scoped>
  .content{
    width:calc(100% - 20px);
    height:calc(100% - #{pxTorem(200px)});
    margin:pxTorem(10px);
    border-radius:pxTorem(6px);
    overflow:hidden;

    .moduleTitle {
      height:pxTorem(44px);
      line-height:pxTorem(44px);
      text-indent:pxTorem(10px);
      font-size:$font-size-small;
      border-bottom:pxTorem(1px) solid $base-line-color;
      color:#5d5d5d;
      font-weight:bold;
      background:$base-white-color;
    }

    .contain{
      height:calc(100% - 45px);
      width:100%;
      overflow-y:auto;
      overflow-x:hidden;
      background:$base-white-color;

      .scroll-area{
        width:100%;
        height:100%;
        box-sizing: border-box;
      }
    }

    .item-main {
      width:100%; height:100%;

      .item-title {
        width:100%;
        height:40px;
        line-height:40px;
        box-sizing:border-box;
        color:#5D5D5D;
        background:#EEEEEE;
        font-size:$font-size-small;
        font-weight:bold;
      }

      .item-content {
        height:calc(100% - 40px);
        overflow: hidden;
      }
    }

    .vue-grid-layout {
      width:100%;
    }
  }
</style>
