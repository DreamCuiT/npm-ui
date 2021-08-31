<template>
  <div style="height: 100%">
    <template>
      <div>
        <span style="font-size: larger">在产项目个数： 18 个</span>
      </div>
      <div>
        <span  style="font-size: larger">本月计划完成任务数： 6 个</span>
      </div>
      <div>
        <span  style="font-size: larger">本月实际完成任务数： 7 个</span>
      </div>
      <div id="lastWeek"
           :style="{height: tableCustomHeight}">
      </div>
      <div id="thisMonth"
           :style="{height: tableCustomHeight}">
      </div>
      <div id="all"
           :style="{height: tableCustomHeight}">
      </div>
      <div id="deliver"
           :style="{height: tableCustomHeight}">
      </div>
    </template>
  </div>
</template>
<script>
import ECharts from 'echarts'
export default {
  name: 'userTaskPieChart',
  props: {
    queryParam: {
      type: Object,
      default: () => { }
    }
  },
  watch: {
    queryParam: {
      handler (val) {
        this.initData()
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      tableCustomHeight: '',
      chartApi: 'WorkStatistics.overViewList',
      lastWeekOptionData: {},
      thisMonthOptionData: {},
      allOptionData: {},
      deliverOptionData: {}
    }
  },
  created () {
    const dh = document.documentElement.clientHeight
    this.tableCustomHeight = (dh * 0.4 - 90) + 'px'
  },
  mounted () {
    let that = this
    window.addEventListener('resize', () => {
      const lastWeek = ECharts.init(document.getElementById('lastWeek'))
      const thisMonth = ECharts.init(document.getElementById('thisMonth'))
      const all = ECharts.init(document.getElementById('all'))
      const deliver = ECharts.init(document.getElementById('deliver'))
      lastWeek.resize()
      thisMonth.resize()
      all.resize()
      deliver.resize()
    })
    that.$nextTick(function () {
      that.initData()
    })
  },
  methods: {
    drawLine () {
      let that = this
      // 基于准备好的dom，初始化echarts实例
      let lastWeek = ECharts.init(document.getElementById('lastWeek'))
      let thisMonth = ECharts.init(document.getElementById('thisMonth'))
      let all = ECharts.init(document.getElementById('all'))
      let deliver = ECharts.init(document.getElementById('deliver'))
      // 解决重复点击问题
      lastWeek.off('click')
      thisMonth.off('click')
      all.off('click')
      deliver.off('click')
      // 绘制图表
      lastWeek.setOption(this.lastWeekOptionData)
      thisMonth.setOption(this.thisMonthOptionData)
      all.setOption(this.allOptionData)
      deliver.setOption(this.deliverOptionData)
      // 饼图点击事件
      lastWeek.on('click', (data) => {
        that.$emit('pie-search', data.data.status)
      })
    },
    initData () {
      let that = this
      that.$api[that.chartApi](that.queryParam).then((res) => {
        if (res && res[0]) {
          let taskFinishCount = res[0].taskFinishCount
          let taskUnStartCount = res[0].taskUnStartCount
          let taskStartCount = res[0].taskStartCount
          let series = [
            { value: taskUnStartCount, name: '未开始', status: '6020' },
            { value: taskStartCount, name: '进行中', status: '6050' },
            { value: taskFinishCount, name: '已完成', status: '6070' }
          ]

          let option = {
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            color: ['#C1C1C1', '#0AD1BD', '#0070C5'],
            legend: {
              orient: 'horizontal',
              bottom: 10,
              data: ['未开始', '进行中', '已完成']
            },
            series: [
              {
                name: '完成情况',
                type: 'pie',
                legendHoverLink: true, // hover 时的联动高亮。
                radius: ['35%', '55%'],
                label: {
                  formatter: '{b|{b}:}{c} ({d}%)',
                  padding: [0, 7],
                  rich: {
                    a: {
                      color: '#999',
                      lineHeight: 22,
                      align: 'center'
                    },
                    b: {
                      fontSize: 16,
                      lineHeight: 33
                    }
                  }
                },
                data: series
              }
            ]
          }
          that.lastWeekOptionData = option
        }
        if (res && res[0]) {
          let taskFinishCount = res[0].taskFinishCount
          let taskUnStartCount = res[0].taskUnStartCount
          let taskStartCount = res[0].taskStartCount
          let series = [
            { value: taskUnStartCount, name: '未开始', status: '6020' },
            { value: taskStartCount, name: '进行中', status: '6050' },
            { value: taskFinishCount, name: '已完成', status: '6070' }
          ]

          let option = {
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            color: ['#C1C1C1', '#0AD1BD', '#0070C5'],
            legend: {
              orient: 'horizontal',
              bottom: 10,
              data: ['未开始', '进行中', '已完成']
            },
            series: [
              {
                name: '完成情况',
                type: 'pie',
                legendHoverLink: true, // hover 时的联动高亮。
                radius: ['35%', '55%'],
                label: {
                  formatter: '{b|{b}:}{c} ({d}%)',
                  padding: [0, 7],
                  rich: {
                    a: {
                      color: '#999',
                      lineHeight: 22,
                      align: 'center'
                    },
                    b: {
                      fontSize: 16,
                      lineHeight: 33
                    }
                  }
                },
                data: series
              }
            ]
          }
          that.thisMonthOptionData = option
        }
        if (res && res[0]) {
          let taskFinishCount = res[0].taskFinishCount
          let taskUnStartCount = res[0].taskUnStartCount
          let taskStartCount = res[0].taskStartCount
          let series = [
            { value: taskUnStartCount, name: '未开始', status: '6020' },
            { value: taskStartCount, name: '进行中', status: '6050' },
            { value: taskFinishCount, name: '已完成', status: '6070' }
          ]

          let option = {
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            color: ['#C1C1C1', '#0AD1BD', '#0070C5'],
            legend: {
              orient: 'horizontal',
              bottom: 10,
              data: ['未开始', '进行中', '已完成']
            },
            series: [
              {
                name: '完成情况',
                type: 'pie',
                legendHoverLink: true, // hover 时的联动高亮。
                radius: ['35%', '55%'],
                label: {
                  formatter: '{b|{b}:}{c} ({d}%)',
                  padding: [0, 7],
                  rich: {
                    a: {
                      color: '#999',
                      lineHeight: 22,
                      align: 'center'
                    },
                    b: {
                      fontSize: 16,
                      lineHeight: 33
                    }
                  }
                },
                data: series
              }
            ]
          }
          that.allOptionData = option
        }
        if (res && res[0]) {
          let taskFinishCount = res[0].taskFinishCount
          let taskUnStartCount = res[0].taskUnStartCount
          let taskStartCount = res[0].taskStartCount
          let series = [
            { value: taskUnStartCount, name: '未开始', status: '6020' },
            { value: taskStartCount, name: '进行中', status: '6050' },
            { value: taskFinishCount, name: '已完成', status: '6070' }
          ]

          let option = {
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            color: ['#C1C1C1', '#0AD1BD', '#0070C5'],
            legend: {
              orient: 'horizontal',
              bottom: 10,
              data: ['未开始', '进行中', '已完成']
            },
            series: [
              {
                name: '完成情况',
                type: 'pie',
                legendHoverLink: true, // hover 时的联动高亮。
                radius: ['35%', '55%'],
                label: {
                  formatter: '{b|{b}:}{c} ({d}%)',
                  padding: [0, 7],
                  rich: {
                    a: {
                      color: '#999',
                      lineHeight: 22,
                      align: 'center'
                    },
                    b: {
                      fontSize: 16,
                      lineHeight: 33
                    }
                  }
                },
                data: series
              }
            ]
          }
          that.deliverOptionData = option
        }
        that.drawLine()
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>
