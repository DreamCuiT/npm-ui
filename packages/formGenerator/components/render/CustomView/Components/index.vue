<template>
  <span>
    {{displayData}}
  </span>
</template>
<script>
export default {
  name: 'CustomView',
  props: {
    config: {
      type: Object,
      require: true
    },
    pageData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      displayData: ''
    }
  },
  mounted () {
    this.$bus.$off('getPageData', (data) => {
      this.getPageData(data)
    })
    this.$bus.$on('getPageData', (data) => {
      this.getPageData(data)
    })
  },
  beforeDestroy () {
    this.$bus.$off('getPageData', (data) => {
      this.getPageData(data)
    })
  },
  methods: {
    getPageData (data) {
      if (Object.keys(this.config).length && this.config.viewField) {
        const paramArr = this.config.viewField.split('.')
        if (data[paramArr[0]]) {
          this.displayData = data[paramArr[0]][paramArr[1]]
        }
      }
    }
  }
}
</script>
