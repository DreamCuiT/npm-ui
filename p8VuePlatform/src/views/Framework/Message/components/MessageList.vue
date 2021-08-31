<template>
  <div class="container">
    <div style="padding: 10px">
      <el-radio-group v-model="mergeParams.msgStatus" class="messageRadioGroup" style="width:100%;">
        <el-radio-button label="1501">未读</el-radio-button>
        <el-radio-button label="1505">已读</el-radio-button>
        <el-radio-button label>全部</el-radio-button>
      </el-radio-group>
    </div>
    <div class="listContainer">
      <infinite-list
        v-if="mergeParams.msgCatalog != null"
        :listApi="messageListApi"
        :activeItem="currentIndex"
        :searchParams="mergeParams"
        :removedItem="removedMsg"
        @load="messageLoad"
        @onSelect="triggerSelect"
      >
        <template #list="{item}">
          <span>
            <el-row type="flex" style="text-align: left;" class="overHiding">
              <el-col :span="16">
                <span class="left-span">
                  <i class="p8" :class="statusIcon(item.msgStatus)"></i>
                </span>
                <span >{{item.msgTitle}}</span>
              </el-col>
              <el-col :span="8" style="text-align: right">
                <i
                  v-if="item.uploadFiles != null && item.uploadFiles.length > 0"
                  class="p8 icon-attachment"
                ></i>
                <i v-if="item.msgLink != null && item.msgLink != ''" class="p8 icon-quote"></i>
              </el-col>
            </el-row>
            <el-row type="flex" style="text-align: left;">
              <el-col :span="24">
                <span class="msg-content overHiding">{{item.msgContent}}</span>
              </el-col>
            </el-row>
            <el-row type="flex" style="text-align: left;">
              <el-col :span="2"></el-col>
              <el-col :xs="22" :sm="22" :md="22" :lg="22" :xl="22" style="text-align: right;">
                <span class="msg-user">{{item.senderName}}</span>
                <span class="msg-time">{{item.sendDate}}</span>
              </el-col>
            </el-row>
          </span>
        </template>
      </infinite-list>
    </div>
  </div>
</template>

<script>
import { Row, Col, RadioGroup, RadioButton } from '~/index'
import { P8InfiniteScroll as InfiniteList } from '~/index'
export default {
  name: 'MessageList',
  props: {
    searchParams: {
      type: Object,
      default: () => { }
    },
    removedMsg: {
      type: String,
      default: null
    }
  },
  components: {
    'el-row': Row,
    'el-col': Col,
    'el-radio-group': RadioGroup,
    'el-radio-button': RadioButton,
    'infinite-list': InfiniteList
  },
  data () {
    return {
      messageListApi: 'userMessage.list',
      currentIndex: null,
      mergeParams: {
        msgCatalog: null,
        msgStatus: '1501'
      }
    }
  },
  computed: {
    statusIcon () {
      return function (status) {
        let icon = ''
        if (status === '1501') {
          icon = 'icon-message'
        } else {
          icon = 'icon-plan-examine'
        }

        return icon
      }
    }
  },
  watch: {
    searchParams: {
      deep: true,
      handler: function (newVal, oldVal) {
        // console.log('watch searchParams')
        this.mergeParams = { ...newVal, msgStatus: '1501' }
      },
      immediate: true
    }
  },
  methods: {
    triggerSelect (item, index) {
      this.currentIndex = index
      this.$emit('select', item, index)
    },
    messageLoad (data, current) {
      if (data && current && current === 1) {
        this.currentIndex = 0
      }
    }
  }
}
</script>

<style lang="scss">
$icon-span-width: 20px;

.container {
  height: 100%;

  .messageRadioGroup .el-radio-button {
    width: calc(100% / 3);

    .el-radio-button__inner {
      width: 100%;
    }
  }

  .listContainer {
    height: calc(100% - 54px);

    .el-row {
      margin-bottom: 5px;
      .el-col {
        color: #606266;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
    .msg-content {
      padding-left: $icon-span-width;
    }
    .msg-user {
      padding-right: 10px;
    }

    .left-span {
      display: inline-block;
      width: $icon-span-width;
    }
  }
}
</style>
