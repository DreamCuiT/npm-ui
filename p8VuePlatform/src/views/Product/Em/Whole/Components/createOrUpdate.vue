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
<!--        <el-menu-item index="2">项目分析</el-menu-item>-->
<!--        <el-menu-item index="3">项目里程碑</el-menu-item>-->
<!--        <el-menu-item index="4">项目团队</el-menu-item>-->
      </el-menu>
    </el-header>
    <el-main :style="{height: mainHeight}">
      <template v-if="activeIndex == 1">   <!--项目分析-->
        <project-point-risk :currEntityId="currEntityId" :whoData="whoData"></project-point-risk>
      </template>
      <template v-if="activeIndex == 2"> <!--项目目标-->
        <project-object :currEntityId="currEntityId"></project-object>
      </template>
      <template v-if="activeIndex == 3">   <!--项目里程碑-->
        <project-milestone :currEntityId="currEntityId"></project-milestone>
      </template>
      <template  v-if="activeIndex == 5">   <!--CBB-->
        <form-render :dataViewId="thirdMenuParam.cbbId" :record="{desformCode:'CBB'} " :propParam = "thirdMenuParam" @save-success = "callBack"> </form-render>
      </template>
      <template  v-if="activeIndex == 6">   <!--专利-->
        <form-render :dataViewId="thirdMenuParam.patentId" :record="{desformCode:'PATENT'} " :propParam = "thirdMenuParam" @save-success = "PatentCallBack"> </form-render>
      </template>
      <keep-alive>
          <template v-if="activeIndex == 4">   <!--项目团队-->
          <project-team :thirdMenuParam="thirdMenuParam" :group_type='"6"'></project-team>
        </template>
      </keep-alive>
    </el-main>
  </el-container>
</template>
<script>
import { Container, Header, Main, Menu, MenuItem } from '~/index'
import ProjectObject from './objectives'
import ProjectPointRisk from './pointsAndRisk'
import ProjectMilestone from './milestone'
import ProjectTeam from '../../../Pm/Resource/teamManager'
import FormRender from '@/views/Framework/ComponentsMananger/Form/Components/Components/edit.vue'
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
    whoData: {
      type: Object,
      default: () => { }
    }
  },
  components: {
    'el-container': Container,
    'el-header': Header,
    'el-main': Main,
    'el-menu': Menu,
    'el-menu-item': MenuItem,
    ProjectObject,
    FormRender,
    ProjectPointRisk,
    ProjectMilestone,
    ProjectTeam
  },
  data () {
    const docHeight = document.documentElement.clientHeight - 120
    return {
      menuFunData: [],
      activeIndex: '1',
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
    this.initListData()
    window.addEventListener('resize', this._initMainHeight)
  },
  destroyed () {
    window.removeEventListener('resize', this._initMainHeight)
  },
  methods: {
    _initMainHeight () {
      const vm = this
      let timer = null
      if (timer) return
      timer = setTimeout(() => {
        vm.mainHeight = document.documentElement.clientHeight - 50 + 'px'
        timer = null
      }, 300)
    },
    initListData () {
      let _this = this
      _this.$api['ProjectApply.functionMenuList']({ type: 'MENU', productId: this.currEntityId }).then(function (res) {
        _this.menuFunData = res
      })
    },
    menuSelect (index, indexPath) {
      this.activeIndex = index.toString()
    },
    callBack (res) {
      let _this = this
      _this.$api['ProjectApply.updateCBB']({ cbbId: res, entityId: this.currEntityId }).then(function (res) {
      })
    },
    PatentCallBack (res) {
      let _this = this
      _this.$api['ProjectApply.updatePatent']({ patentId: res, entityId: this.currEntityId }).then(function (res) {
      })
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
