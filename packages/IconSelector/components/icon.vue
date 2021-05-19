<template>
  <i :class="[name, prefixName]" :style="{'color':color}"></i>
</template>
<script>
export default {
  name: 'Icon',
  props: {
    prefixName: { // 图标前缀: p8
      type: String
    },
    name: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    }
  },
  data () {
    return {

    }
  }
}
</script>
