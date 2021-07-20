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
      default: function () {
        return {}
      }
    }
  },
  data: function () {
    return {
      displayData: ''
    }
  },
  mounted: function () {
    var _this = this
    this.$bus.$off('getPageData', function (data) {
      _this.getPageData(data)
    })
    this.$bus.$on('getPageData', function (data) {
      _this.getPageData(data)
    })
  },
  beforeDestroy: function () {
    var _this = this
    this.$bus.$off('getPageData', function (data) {
      _this.getPageData(data)
    })
  },
  methods: {
    getPageData: function (data) {
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
