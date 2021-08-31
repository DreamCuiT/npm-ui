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
      <template v-if="activeIndex == 1&&currEntityId!=''">   <!--项目分析-->
        <project-point-risk :currEntityId="currEntityId"></project-point-risk>
      </template>
      <template v-if="activeIndex == 2"> <!--项目目标-->
        <project-object :currEntityId="currEntityId"></project-object>
      </template>
      <template v-if="activeIndex == 3">   <!--项目里程碑-->
        <project-milestone :currEntityId="currEntityId"></project-milestone>
      </template>
      <keep-alive>
        <template v-if="activeIndex == 4">   <!--项目团队-->
          <project-team :thirdMenuParam="thirdMenuParam"  :record ="record" :group_type="'5'"></project-team>
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
export default {
  name: 'createOrUpdate',
  props: {
    currEntityId: {
      type: String,
      default: ''
    },
    selectedApproval: {
      type: Object,
      default: () => { }
    }
  },
  watch: {
    selectedApproval: {
      handler (val) {
        if (val) {
          this.projectVisible = false
          this.thirdMenuParam.id = val.businessKey
          this.record.id = val.businessKey
          this.record.sqlid = val.businessKey
          this.projectVisible = false
        }
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    'el-container': Container,
    'el-header': Header,
    'el-main': Main,
    'el-menu': Menu,
    'el-menu-item': MenuItem,
    ProjectObject,
    ProjectPointRisk,
    ProjectMilestone,
    ProjectTeam
  },
  data () {
    const docHeight = document.documentElement.clientHeight - 50
    return {
      menuFunData: [],
      activeIndex: '1',
      mainHeight: docHeight + 'px',
      title: '',
      thirdMenuParam: {
      },
      record: {
      },
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
  created () {
    if (this.currEntityId) {
      this.thirdMenuParam.id = this.currEntityId
      this.record.id = this.currEntityId
      this.record.sqlid = this.currEntityId
    } else {
      this.thirdMenuParam.id = this.selectedApproval.businessKey
      this.record.id = this.selectedApproval.businessKey
      this.record.sqlid = this.selectedApproval.businessKey
    }
  },
  computed: {

  },
  mounted () {
    this.initListData()
  },
  methods: {
    initListData () {
      let _this = this
      _this.$api['ProjectApply.functionMenuList']({ type: 'MENU', productId: this.currEntityId }).then(function (res) {
        _this.menuFunData = res
      })
    },
    menuSelect (index, indexPath) {
      this.activeIndex = index
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
