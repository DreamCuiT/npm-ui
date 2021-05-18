<template>
  <div id="list-layout">
    <div id="list-header" v-show="headerVisible">
      <slot name="north"></slot>
    </div>
    <div id="list-main" :class="headerVisible?'':'fullHeight'">
      <slot name="center"></slot>
      <slot name="drawer-panel"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'P8ListLayout',
  componentName: 'P8ListLayout',
  props: {
    headerVisible: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  mounted () {},
  methods: {},
  components: {}
}
</script>