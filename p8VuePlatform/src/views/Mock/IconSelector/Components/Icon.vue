<template>
  <i :class="name"></i>
</template>
<script>
export default {
  name: 'Icon',
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      test: 'yk'
    }
  }
}
</script>
