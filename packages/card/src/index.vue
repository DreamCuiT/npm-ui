<template>
  <el-card>
    <div slot="header" v-show="headerVisible">
      <slot name="header"></slot>
    </div>
    <slot name="content"></slot>
  </el-card>
</template>

<script>
  import { Card } from 'element-ui'

  export default {
    name: 'P8Card',
    componentName: 'P8Card',
    props: {
      headerVisible: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {

      }
    },
    components: {
      'el-card': Card
    }
  }
</script>

<style lang="scss">
  .el-card__header,.el-card__body{
    padding:10px;
  }
</style>
