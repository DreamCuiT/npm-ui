<template>
  <el-container>
    <el-header>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="menuSelect"
      >
        <el-menu-item v-for="item in menuFunData" :key="item.indexNo" :index="item.indexNo.toString()">
          <span>{{item.name}}</span>
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-main :style="{height: mainHeight}">
      <template v-if="activeIndex == 1"> <!--项目概况-->
        <project-object :currEntityId="businessKey"></project-object>
      </template>
      <template v-if="activeIndex == 2">   <!--决策文件查看-->
        <select-publish :currEntityId="businessKey"></select-publish>
      </template>
    </el-main>
  </el-container>
</template>
<script>
import { Container, Header, Main, Menu, MenuItem } from '~/index'
import ProjectObject from './wholeDescribeView'
import SelectPublish from './selectPublish'
export default {
  name: 'createOrUpdate',
  props: {
    currEntityId: {
      type: String,
      default: ''
    },
    thirdMenuParam: {
      type: Object
    },
    businessKey: {
      type: String,
      default: ''
    }
  },
  components: {
    'el-container': Container,
    'el-header': Header,
    'el-main': Main,
    'el-menu': Menu,
    'el-menu-item': MenuItem,
    ProjectObject,
    SelectPublish
  },
  data () {
    const docHeight = document.documentElement.clientHeight - 50
    return {
      menuFunData: [
        {
          indexNo: 1,
          name: '项目概况'
        }, {
          indexNo: 2,
          name: '决策文件查看'
        }],
      activeIndex: '2',
      mainHeight: docHeight + 'px',
      title: '',
      wholeId: '',
      visible0: false,
      visible1: false,
      visible2: false,
      visible3: false,
      visible4: false,
      visible5: false,
      visible6: false,
      projectObj: false
    }
  },
  computed: {

  },
  mounted () {
  },
  methods: {
    menuSelect (index, indexPath) {
      this.activeIndex = index.toString()
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .custom-drawer {
  background-color: #fafbff;
  .el-drawer__close-btn {
    z-index: 10;
  }
}
.el-header {
  padding: 0;
  height: 50px !important;
}
.el-main{
  padding:0;
}
</style>
