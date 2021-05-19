<template>
  <div class="common-wrapper" v-bind:class="{'full': full}">
      <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'P8Wrapper',
  componentName: 'P8Wrapper',
  props: {
    full: Boolean
  }
}
</script>