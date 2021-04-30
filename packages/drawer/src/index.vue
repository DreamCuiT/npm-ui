<template>
  <el-drawer :title="title" v-if="visible" :visible="visible" :direction="direction" :destroy-on-close="true"
  :size="size" @close="close" :wrapperClosable="false" v-bind="drawerConfig" :custom-class="title?'':'custom-drawer'"
  >
    <slot name="drawer"></slot>
  </el-drawer>
</template>

<script>
import { Drawer } from 'element-ui'

export default {
  name: 'P8Drawer',
  componentName: 'P8Drawer',
  props: {
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean
    },
    direction: {
      type: String,
      default: 'rtl'
    },
    size: {
      type: String,
      default: '50%'
    },
    drawerConfig: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      data: []
    }
  },

  mounted () {

  },
  beforeDestroy () {

  },
  methods: {
    close () {
      this.$emit('close')
    }
  },
  components: {
    'el-drawer': Drawer
  }
}
</script>