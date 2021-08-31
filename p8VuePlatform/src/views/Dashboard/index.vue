<template>
  <div class="content">
    <el-container class="contain">
      <div class="item-main">
        <div class="item-title vue-draggable-handle item-move-handle">
          <i class="p8 icon-personal-work-progress" style="float:left;font-size:18px;margin:0 4px 0 10px;"></i>
          <span style="float:left;">个人工作进展</span>
        </div>
        <!-- 功能缺失，暂时屏蔽 -->
        <!-- <div class="item-remove-handle" @click="removeComponent(item)"><i class="el-icon-close"></i></div> -->
        <div class="item-content no-drag">
          <dynamic-component v-if="layout.length && layout[0].component" :com="layout[0].component" />
        </div>
      </div>
    </el-container>
  </div>
</template>

<script>
import { Container } from '~/index'
import DynamicComponent from './DynamicComponent'
// Dashboard store
// import DashboardStore from './Store'

import { layoutData } from '@/mock/layoutData'
// vue-grid-layout css
import '@/assets/commonStyle/Dashboard.scss'

export default {
  name: 'Dashboard',
  data () {
    return {
      // 布局数据
      layout: [],
      // 初始布局,用于判断布局是否有过变动
      initLayout: []
    }
  },
  beforeMount () {
    // Dashboard 动态注册 store
    // DashboardStore.install()
  },
  beforeDestroy () {
    //
    // DashboardStore.uninstall()
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
    }
  },
  components: { DynamicComponent, 'el-container': Container }
}
</script>
<style lang="scss" scoped>
.content{

  .item-main {
      width:100%; height:100%;

      .item-title {
        width:100%;
        height:40px;
        text-indent:10px;
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
