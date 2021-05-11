<template>
  <el-tooltip effect="dark"
              :content="iconData.title"
              placement="right">
    <i :class="iconData.icon"
       @click="iconEdit"
       :style="{color: iconData.color, fontSize: '16px'}"></i>
  </el-tooltip>
</template>
<script>
  import { Tooltip } from 'element-ui'
  export default {
    name: 'P8StatusIcon',
    componentName: 'P8StatusIcon',
    components: {
      'el-tooltip': Tooltip
    },
    props: {
      statusName: { // 状态名称：例如："taskStatus"
        type: String,
        default: ''
      },
      statusKey: { // 项目状态/计划状态/任务状态key
        type: String,
        default: ''
      }
    },
    data () {
      return {
        statusData: this.$store.state.project.dicConfig,
        iconData: {}
      }
    },
    watch: {
      statusKey: {
        handler: function (val, oldVal) {
          this.initIconData()
        },
        deep: true
      }
    },
    mounted () {
      this.initIconData()
    },
    methods: {
      initIconData () {
        if (Object.keys(this.statusData).length) {
          let { [this.statusName]: { [this.statusKey]: iconData } } = this.statusData
          this.iconData = iconData
        }
      },
      iconEdit () {
        this.$emit('iconClick')
      }
    }
  }
</script>
