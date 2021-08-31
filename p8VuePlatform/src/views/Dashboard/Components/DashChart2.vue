<template>
  <ve-bar ref="chart2" width="100%" height="100%" :data="chartData"></ve-bar>
</template>

<script>
import veBar from 'v-charts/lib/bar.common'

const COM_NAME = 'DashChart2'

const chartData = {
  columns: ['日期', '访问用户'],
  rows: [
    { '日期': '1/1', '访问用户': 1393 },
    { '日期': '1/2', '访问用户': 3530 },
    { '日期': '1/5', '访问用户': 3792 },
    { '日期': '1/6', '访问用户': 4593 }
  ]
}

export default {
  name: 'DashChart2',
  data () {
    return {
      chartData: null,
      initOptions: { }
    }
  },
  activated () {
    this.resizeChart()
  },
  watch: {
    '$store.state.Dashboard.operateItem': {
      handler (item) {
        if (item.component === COM_NAME) this.resizeChart()
      },
      deep: true
    }
  },
  mounted () {
    this.chartData = chartData
    window.addEventListener('resized', this.resizeChart)
  },
  beforeDestroy () {
    window.removeEventListener('resized', this.resizeChart)
  },
  methods: {
    resizeChart () {
      setTimeout(() => {
        this.$refs.chart2.resize()
      }, 400)
    }
  },
  components: { veBar }
}
</script>
