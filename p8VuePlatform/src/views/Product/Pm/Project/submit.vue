<template>
  <div style="position: relative width: 100%; height: 100%">
    <div class="tips">
      <p class="tip-item" v-for="(key,index) in Object.keys(levelStyle)" :key="index">
        <span class="tip" :style="{borderColor: levelStyle[key].borderColor}"></span>
        <span>{{levelText[key]}}</span>
      </p>
    </div>
    <div class="echatrsWrap" :id="'packageNodeMap' + echartsId"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  props: {
    dataInfos: {
      requied: true,
      type: Object,
      default: () => {}
    },
    echartsId: {
      default: '1',
      type: String
    }
  },
  data () {
    return {
      myCharts: null,
      levelStyle: {
        0: {
          borderColor: 'green'
        },
        1: {
          borderColor: 'red'
        },
        2: {
          borderColor: 'orange'
        },
        3: {
          borderColor: 'blue'
        }
      },
      levelText: {
        0: '流程名称',
        1: '流程审批节点',
        2: '审批人',
        3: '计划名称'
      }
    }
  },
  watch: {
    dataInfos: {
      handler (val) {
        if (val && Object.keys(val).length) {
          val.itemStyle = this.levelStyle[0]
          if (val.children && val.children.length) {
            this.updateStyle(val.children, 1)
          }
          this.init()
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
  },
  methods: {
    init () {
      let _this = this
      this.myCharts = null
      this.myCharts = echarts.init(document.getElementById('packageNodeMap' + _this.echartsId))
      var option = {
          tooltip: {
              trigger: 'item',
              triggerOn: 'mousemove'
          },
          grid: {
            top: 35,
            left: 55,
            right: 45,
            width: 'auto',
            height: 'auto'
          },
          series: [
            {
              type: 'tree',
              id: 0,
              name: 'tree1',
              data: [_this.dataInfos],

              top: '10%',
              left: '20%',
              bottom: '10%',
              right: '20%',

              symbolSize: 7,

              edgeShape: 'polyline',
              edgeForkPosition: '63%',
              initialTreeDepth: 2,

              lineStyle: {
                width: 1
              },

              label: {
                backgroundColor: '#fff',
                position: 'top',
                verticalAlign: 'middle',
                align: 'right'
              },

              leaves: {
                label: {
                  position: 'right',
                  verticalAlign: 'middle',
                  align: 'left'
                }
              },

              emphasis: {
                focus: 'descendant'
              },

              expandAndCollapse: true,
              animationDuration: 550,
              animationDurationUpdate: 750,
              roam: true,
              scaleLimit: {
                  min: 0.5, // 最小的缩放值
                  max: 9 // 最大的缩放值
              }
            }
          ]
      }
      console.log(_this.dataInfos, 'yk-_this.dataInfos')
      _this.dataInfos && this.myCharts.setOption(option)
    },
    resize () {
      this.myCharts.resize()
    },
    updateStyle (datas, level) {
      datas.forEach(data => {
        data.itemStyle = this.levelStyle[level]
        if (data.children && data.children.length) {
          this.updateStyle(data.children, level + 1)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .echatrsWrap {
    width: 100%;
    height: 100%;
  }
  .tips {
    position: absolute;
    left: 20px;
    top: 8px;
    .tip-item {
      display: flex;
      align-items: center;
      font-size: 12px;
      .tip {
        border: 2px solid;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 4px;
      }
    }
  }
</style>
