<template>
  <div class="line-chart section-wrapper">
    <ve-line ref="chart1"
    width="100%" height="100%"
    :data="lineData"
    :legend-visible="false">
    </ve-line>
  </div>
</template>
<script>
import VeLine from 'v-charts/lib/line.common'

const chartData = {
  columns: ['date', 'users', 'pay', 'percent'],
  rows: [
    { 'date': '1/1', 'users': 1393, 'pay': 1093, 'percent': 0.32 },
    { 'date': '1/2', 'users': 3530, 'pay': 3230, 'percent': 0.26 },
    { 'date': '1/3', 'users': 2923, 'pay': 2623, 'percent': 0.76 },
    { 'date': '1/4', 'users': 1723, 'pay': 1423, 'percent': 0.49 },
    { 'date': '1/5', 'users': 3792, 'pay': 3492, 'percent': 0.323 },
    { 'date': '1/6', 'users': 4593, 'pay': 4293, 'percent': 0.78 }
  ]
}

export default {
  name: 'HomeLineChart',
  data () {
    return {
      lineData: null
    }
  },
  watch: {
    '$store.getters.sidebarState': {
      handler (state) {
        this.$nextTick(() => {
          this.$refs.chart1.resize()
        })
      },
      deep: true
    }
  },
  mounted () {
    setTimeout(() => {
      this.lineData = chartData
    }, 200)
  },
  components: { VeLine }
}
</script>
<style lang="scss" scoped>
.line-chart{
  height:100%;
}
</style>
