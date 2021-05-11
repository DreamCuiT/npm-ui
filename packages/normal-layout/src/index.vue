<template>
  <div id="normal-layout">
    <div id="normal-header" v-show="headerVisible">
      <slot name="north"></slot>
    </div>
    <div id="normal-main" :class="{ fullHeight: !headerVisible }">
      <el-row>
        <el-col
          :xs="layout.west.xs"
          :sm="layout.west.sm"
          :md="layout.west.md"
          :lg="layout.west.lg"
          :xl="layout.west.xl"
          style="overflow:hidden;"
        >
          <div id="normal-west" :class="{ fullHeight: westFullHeight }">
            <VuePerfectScrollbar class="scroll-area">
              <slot name="west"></slot>
            </VuePerfectScrollbar>
          </div>
        </el-col>
        <el-col
          :xs="layout.center.xs"
          :sm="layout.center.sm"
          :md="layout.center.md"
          :lg="layout.center.lg"
          :xl="layout.center.xl"
        >
          <div id="splitBtn" @click="splitClick">
            <i class="p8" :class="{ 'icon-left': expandWest, 'icon-right': !expandWest}"></i>
          </div>
          <div id="normal-center">
            <slot name="center"></slot>
          </div>
        </el-col>
      </el-row>
      <slot name="drawer-panel"></slot>
    </div>
  </div>
</template>
<script>
import { Row, Col } from 'element-ui'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { deepClone } from '~/utils/common.js'

export default {
  name: 'P8NormalLayout',
  componentName: 'P8NormalLayout',
  props: {
    headerVisible: {
      type: Boolean,
      default: true
    },
    normalLayout: {
      type: Object,
      default: function () {
        return {
          west: {
            xs: 8, sm: 7, md: 6, lg: 5, xl: 4
          },
          center: {
            xs: 16, sm: 17, md: 18, lg: 19, xl: 20
          }
        }
      }
    },
    westFullHeight: {
      type: Boolean,
      default: false
    },
    splitLayout: {
      type: Boolean,
      default: false
    },
    splitDefaultLeftWidth: {
      type: Number,
      default: 15
    }
  },
  data () {
    return {
      expandWest: true, // 默认展开west
      oldNormalLayout: deepClone(this.normalLayout),
      layout: deepClone(this.normalLayout)
    }
  },
  computed: {},
  watch: {},
  mounted () {

  },
  methods: {
    splitClick () {
      if (this.expandWest) {
        this.layout.west = {
          xs: 0, sm: 0, md: 0, lg: 0, xl: 0
        }
        this.layout.center = {
          xs: 24, sm: 24, md: 24, lg: 24, xl: 24
        }
      } else {
        this.$set(this.layout, 'west', this.oldNormalLayout.west)
        this.$set(this.layout, 'center', this.oldNormalLayout.center)
      }
      this.expandWest = !this.expandWest
    },
    outResize (e) {
      // if (this.$children[0].percent > 30) { this.$children[0].percent = 30 }
      // this.leftVisible = e < 1 ? 0 : 1
    }
  },
  components: {
    'el-row': Row,
    'el-col': Col,
    VuePerfectScrollbar
  }
}
</script>
