<template>
  <el-container>
    <el-container>
      <el-main>
        <slot name="left"></slot>
      </el-main>
      <el-footer>
          <slot name="bottom"></slot>
        </el-footer>
    </el-container>
    <el-aside :width="asideWidth">
      <slot name="right"></slot>
    </el-aside>
  </el-container>
</template>
<script>
import { Container, Main, Aside, Footer } from '~/index'
export default {
  name: 'LeftRightLayout',
  props: {
    asideWidth: {
      type: String,
      default: '350px'
    }
  },
  components: {
    'el-container': Container,
    'el-main': Main,
    'el-aside': Aside,
    'el-footer': Footer
  }
}
</script>
<style lang="scss">
  .el-container {
    height: 100%;
  }
  .el-main {
    padding: 0 5px 0;
    overflow: hidden;
  }
  .el-footer{
    padding: 0 35px 0px 8px
  }
</style>
