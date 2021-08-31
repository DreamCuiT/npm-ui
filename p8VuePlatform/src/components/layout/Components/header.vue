<template>
  <header class="header" :height="headerHeight">
    <span class="sysName">{{system_name}}</span>
    <div class="slide-bar" @click="slideSidebar" v-show="$route.path !== '/dash'">
      <div class="slider p8" :class="{'icon-fold-right': !this.sidebarState.isOpen,'icon-fold-left':this.sidebarState.isOpen }" ></div>
    </div>
    <div class="center">
      <header-shortcut />
    </div>

    <div class="settings">
      <ul>
        <li v-if="$route.path !== '/dash' && adminUserIdArr.indexOf($store.state.user.userId) === -1">
          <span>
            <!-- <i class="p8 icon-work-home" @click="$router.push({name:'Dashboard'})"> -->
            <el-tooltip content="工作首页">
              <i class="el-icon-s-home" @click="$router.push({name:'Dashboard'})"></i>
            </el-tooltip>
          </span>
        </li>
        <li v-show="$route.path !== '/dash' && adminUserIdArr.indexOf($store.state.user.userId) === -1">
          <span @click="visibleMsgDrawer=true">
            <el-badge v-if="messageNumTotal>0" :value="messageNumTotal" :max="99" class="itemNum">
              <el-tooltip content="我的消息">
                <i class="p8 icon-message" ></i>
              </el-tooltip>
            </el-badge>

            <el-tooltip content="我的消息" v-else>
              <i class="p8 icon-message"></i>
            </el-tooltip>
          </span>
        </li>
        <li v-show="$route.path !== '/dash' && adminUserIdArr.indexOf($store.state.user.userId) === -1">
          <span @click="visibleProcessDrawer=true">
            <el-badge v-if="approvalPendingTotal>0" :value="approvalPendingTotal" :max="99" class="itemNum">
              <el-tooltip content="我的审批">
                <i class="p8 icon-approval"></i>
              </el-tooltip>
            </el-badge>
            <el-tooltip content="我的审批" v-else>
              <i class="p8 icon-approval" ></i>
            </el-tooltip>
          </span>
        </li>
        <li v-show="$route.path !== '/dash' && adminUserIdArr.indexOf($store.state.user.userId) === -1">
          <span @click="visibleDownloadDrawer=true">
            <el-tooltip content="我的下载">
              <i class="p8 icon-download-document-manage"></i>
            </el-tooltip>
          </span>
        </li>
        <li>
          <el-dropdown size="small">
            <span>
              <span class="name">{{ dayTime }}好！{{ userName }}</span>
              <i class="el-icon-arrow-down" style="margin:0 5px"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="modifyPassword"><i class="p8 icon-modify-password"></i>修改密码</el-dropdown-item>
              <!-- 功能未完成, 暂时注释 -->
              <el-dropdown-item @click.native="settingPersonal"><i class="p8 icon-personal-setting"></i>个性化设置</el-dropdown-item>
              <el-dropdown-item @click.native="logout"><i class="p8 icon-logout"></i>注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </ul>
    </div>
    <div class="user">
      <el-dropdown size="small">
        <span class="avatar">{{ userName.slice(-1) }}</span>
        <el-dropdown-menu slot="dropdown">
          <div class="header_userInfo" v-if="userInfo.departmentName">
            <span class="title">部门：</span>
            <span class="content" v-if="userInfo.parentDept">{{userInfo.parentDept}}-</span><span class="content">{{userInfo.departmentName}}</span>
          </div>
          <div class="header_userInfo">
            <span class="title" style="float:left;width:36px;">角色：</span>
            <div style="float:left;width:114px;">
              <span class="content" v-for="item in userInfo.userRoles" :key="item.roleId">{{(item.roleName).trim()}}<span style="margin-left:1px;">; </span></span>
            </div>
          </div>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <common-drawer v-if="visibleProcessDrawer" :visible="visibleProcessDrawer" title="我的审批" @close="visibleProcessDrawer=false" direction="ttb" size="100%">
      <template #drawer>
        <process-approval @approved="approved"></process-approval>
      </template>
    </common-drawer>
    <common-drawer v-if="visibleMsgDrawer" :visible="visibleMsgDrawer" title="我的消息" @close="visibleMsgDrawer=false" direction="ttb" size="100%">
      <template #drawer>
        <message ref="message"></message>
      </template>
    </common-drawer>
      <common-drawer v-if="visibleDownloadDrawer" :visible="visibleDownloadDrawer" title="我的下载" @close="visibleDownloadDrawer=false" direction="ttb" size="100%">
          <template #drawer>
              <DocumentManagement viewType="card"></DocumentManagement>
          </template>
      </common-drawer>
  </header>
</template>

<script>
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Badge,
  Tooltip
}
  from '~/index'
import { mapGetters } from 'vuex'
import HeaderShortcut from './HeaderShortcut'
import { getGreetingTime } from '@/utils/common'
import { PLATFORM_PREFIX_NAME } from '@/config/settings'
import { P8Drawer as CommonDrawer } from '~/index'
import ProcessApprovalIndex from '@/views/Framework/BusinessActivity/ProcessApproval/index.vue'
import DocumentManagement from '@/views/Framework/System/DocumentManagement/index.vue'
import Message from '@/views/Framework/Message'

export default {
  name: 'Headers',
  data () {
    return {
      dayTime: '',
      commonDialog: null,
      system_name: PLATFORM_PREFIX_NAME,
      visibleProcessDrawer: false,
      visibleMsgDrawer: false,
      visibleDownloadDrawer: false,
      approvalPendingTotal: 0,
      messageNumTotal: 0,
      adminUserIdArr: ['SYS_USER001', 'SYS_USER009', 'SYS_USER012', 'SYS_USER010', 'SYS_USER000'] // 五元id
    }
  },
  computed: {
    ...mapGetters([
      'token',
      'userName',
      'avatar',
      'headerHeight',
      'sidebarState',
      'userInfo',
      'messageNum'
    ])
  },
  mounted () {
    this.dayTime = getGreetingTime()
    let this_ = this
    this_.approvalTotal()
    this.$store.dispatch('getMessageNum')
    setInterval(function () {
      this_.approvalTotal()
    }, 60000)
    setInterval(function () {
      this_.$store.dispatch('getMessageNum') // 获取消息信息已读未读条数
    }, 60000)
  },
  watch: {
    messageNum (val, oldVal) {
      let _this = this
      if (val.length) {
        val.map(item => {
          if (item.id === '18') {
            _this.messageNumTotal = item.noread
          }
        })
      }
    }
  },
  methods: {
    approvalTotal () {
      this.$api['PersonalProcessApproval.approvalPendingTotal']().then(res => {
        this.approvalPendingTotal = res
      })
    },
    approved () {
      this.approvalTotal()
      this.$emit('approved')
    },
    // messageTotal () {
    //   this.$api['userMessage.myMessageTotal']().then(res => {
    //     this.messageNumTotal = res
    //   })
    // },
    slideSidebar () {
      this.$store.dispatch('collapseSidebar', !this.sidebarState.isOpen)
    },
    settingPersonal () {
      this.$router.push({ name: 'PersonalSettings' })
    },
    modifyPassword () {
      this.$router.replace({ path: '/modify-password' })
    },
    logout () {
      this.$confirm('是否要退出系统?', '提醒', {
        lockScroll: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      })
        .then(() => {
          this.$store.dispatch('userLogout').then(() => {
            location.reload()
          })
        })
        .catch(() => {})
    }
  },
  components: {
    CommonDrawer,
    HeaderShortcut,
    DocumentManagement,
    'process-approval': ProcessApprovalIndex,
    'el-dropdown': Dropdown,
    'el-badge': Badge,
    'el-dropdown-menu': DropdownMenu,
    'el-dropdown-item': DropdownItem,
    'message': Message,
    'el-tooltip': Tooltip
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header {
  display: flex;
  flex: none;
  height: 50px;
  padding: 0;
  // color: lighten($base-light-color, 100%);
  background: #04224E;
  // border-bottom: 1px solid $base-line-color;

  .sysName{
    font-size:$font-size-medium;
    font-family:Source Han Sans CN;
    font-weight:500;
    color: $base-white-color;
    line-height:50px;
    letter-spacing:1px;
    margin:0 5px 0 10px;
  }

  .center {
    position: relative;
    // padding-left:5px;
    flex: 1;
  }

  .slide-bar {
    width:45px;
    height:100%;
    display: inherit;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size:1.3rem;

    .slider {
      transition: all .3s ease 0s;
      color: $base-white-color;
      font-size:$font-size-medium;

      &.collapsed {
        transform: rotateZ(90deg);
      }
    }

    // &:hover {
    //   background-color: lighten($base-white-color, 12%);
    // }
  }

  .user {
    display: inherit;
    @include flexCenter();

    span {
      display: inline-block;
      color: $base-white-color;

      &.avatar {
        width: 30px;
        height: 30px;
        margin-right: 34px;
        margin-left: 5px;
        border-radius: 30px;
        background: $base-white-color;
        overflow: hidden;
        cursor:pointer;
        color: $base-light-color;
        line-height: 30px;
        text-align: center;

        > img {
          width: 30px;
          height: 30px;
        }
      }
      // &.name { }
    }
  }

  .settings {
    ul {
      display: flex;
      flex-direction: row;
      height: 100%;

      li {
        font-size: 1rem;
        display: inherit;
        flex: 1 auto;
        padding: 0 6px;
        cursor: pointer;

        span {
          display: inherit;
          @include flexCenter;
          // color:$base-light-color;
          color: $base-white-color;

          &.name{
            font-size:$font-size-mini;
          }

          >i.el-icon-arrow-down{
            font-size:$font-size-small;
          }

          >i:not(.el-icon-arrow-down){
            font-size:$font-size-large;
          }
        }

        span:before {
          margin-right: 5px;
        }

        > div {
          display: inherit;
          @include flexCenter;
          font-size: 1rem;
          font-weight: 400;
          color: $base-light-color;
        }

        .itemNum {
          margin-right: 10px;
        }
      }

      .p8:before {
        margin-right: 5px;
      }
    }
  }
}

// fixes dropmenu icon
.el-dropdown-menu {
   i {
    margin-right:5px;
  }
}

// 用户部门、角色信息
div.header_userInfo{
  width: 150px;
  line-height:25px;
  padding:0 15px;
  color:#606266;
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
 .header {
  height: pxTorem(50px);
  // border-bottom: pxTorem(1px) solid $base-line-color;

  .sysName {
    line-height: pxTorem(50px)
  }

  .user {
    span {
      $avatarNum: pxTorem(30px);
      &.avatar {
        width: $avatarNum;
        height: $avatarNum;
        border-radius: $avatarNum;
        line-height: $avatarNum;
        font-size: $font-size-small;
        margin-right: pxTorem(34px);
        margin-left: pxTorem(5px);
      }
    }
  }

  .settings {
    /deep/ .el-badge__content {
      font-size: $font-size-mini;
      height: pxTorem(18px);
      line-height: pxTorem(18px);
      border-radius: pxTorem(10px);
      @include remCalc(padding, 0px, 6px);
    }
  }
}
</style>
