<template>
  <el-tabs v-model="renderActiveTabs"
           :type="type"
           :tab-position="tabPosition"
           :class="height==='auto'?'':'fullHeight'"
           :style="{height:(height === 'auto'?height:height+'!important')}"
           @tab-click="tabClick">
    <el-tab-pane v-for="item in tabsData"
                 :key="item.name"
                 :name="item.name">
      <span slot="label">
        <i class="p8"
           :class="item.icon"></i>{{item.label}}
        <slot :name="item.name+'_label'"></slot>
      </span>
      <slot :name="item.name"></slot>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import { Tabs, TabPane } from 'element-ui'
  export default {
    name: 'P8Tabs',
    componentName: 'P8Tabs',
    props: {
      type: {
        type: String
      },
      tabPosition: {
        type: String,
        default: 'top'
      },
      tabsData: {
        type: Array,
        default: () => []
      },
      height: {
        type: String,
        default: 'fullHeight'
      },
      activeTabs: {
        type: String
      }

    },
    data () {
      return {

      }
    },
    computed: {
      renderActiveTabs: {
        get: function () {
          return this.activeTabs
        },
        set: function (newValue) {
          this.$emit('input', newValue) // 通过 input 事件更新 model
        }
      }
    },
    methods: {
      tabClick (target) {
        this.$emit('tab-click', target)
      }
    },
    components: {
      'el-tabs': Tabs,
      'el-tab-pane': TabPane
    }
  }
</script>
