<template>
  <div class="beauti-context">
    <!-- 数据TIPS -->
    <beauti-context ref="beautiCtx" >
      <beauti-contextmenu>
        <beauti-contextmenu-item>New</beauti-contextmenu-item>
        <beauti-contextmenu-item>Edit</beauti-contextmenu-item>
        <beauti-contextmenu-item divider></beauti-contextmenu-item>
        <beauti-context-submenu label="Process">
          <beauti-contextmenu-item>Lock</beauti-contextmenu-item>
          <beauti-contextmenu-item>Reset</beauti-contextmenu-item>
        </beauti-context-submenu>
      </beauti-contextmenu>
    </beauti-context>

    <!-- 通过指令和数据动态生成右键菜单 -->
    <beauti-context ref="beautiCtx2" type="contextmenu">
      <beauti-contextmenu>
        <beauti-contextmenu-item>Static Menu</beauti-contextmenu-item>
        <beauti-contextmenu-item divider></beauti-contextmenu-item>
        <beauti-context-submenu v-for="(menu, index) in contextmenuData" :key="index" :label="menu.name">
          <beauti-contextmenu-item @click="addNew(menu)">New</beauti-contextmenu-item>
          <beauti-contextmenu-item>Edit</beauti-contextmenu-item>
          <beauti-contextmenu-item>Delete</beauti-contextmenu-item>
          <beauti-context-submenu label="Process">
            <beauti-contextmenu-item>Lock</beauti-contextmenu-item>
            <beauti-contextmenu-item>Rest</beauti-contextmenu-item>
          </beauti-context-submenu>
        </beauti-context-submenu>
      </beauti-contextmenu>
    </beauti-context>

    <el-row>
      <!-- async component demo -->
      <el-col :span="24">
          <el-button @click="openTip($event)">左键点击加载地图弹出框</el-button>
      </el-col>
      <!-- static text demo -->
       <!-- <el-col :span="24">
          <div class="box" @contextmenu.prevent="openTip2($event)">右键弹出Text</div>
      </el-col> -->
      <!-- data loop and binding data demo -->
      <el-col :span="24">
          <ul class="list">
            <li v-for="(list, index) in listData" :key="index" @click="openTip3($event, list)">
              <span>循环绑定：{{ list.name }}</span>
            </li>
          </ul>
      </el-col>
      <el-col>
        <el-button v-for="(list,index) in listData" :key="index" v-beautiContext:beautiCtx="list">右键菜单</el-button>
      </el-col>
      <el-col>
        <el-button v-for="(list,index) in listData2" :key="index" v-beautiContext:beautiCtx2="list">点击指令模式</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import moment from 'moment'
import { Button, Row, Col } from '~/index'

export default {
  name: 'BeautiContextComp',
  data () {
    return {
      listData: [
        { name: 'Jack', time: moment().format('HH:ss:mm') },
        { name: 'Rose', time: moment().format('HH:ss:mm') }
      ],
      listData2: [
        { value: 'Hello' },
        { value: 'World' }
      ],
      contextmenuData: [
        { name: 'contextmenu 01', value: 100 },
        { name: 'contextmenu 02', value: 200 },
        { name: 'contextmenu 03', value: 300 },
        { name: 'contextmenu 04', value: 400 }
      ]
    }
  },
  methods: {
    openTip (ev) {
      this.$beautiContext({
        event: ev,
        component: () => import('./Components/contextmenu')
      })
    },
    openTip2 (ev) {
      this.$beautiContext({
        event: ev,
        props: {
          testData: 'abc'
        },
        customStyle: {
          padding: '10px'
        },
        text: 'Hello world'
      })
    },
    openTip3 (ev, list) {
      this.$beautiContext({
        event: ev,
        customStyle: {
          padding: '10px',
          backgroundColor: 'lightgreen'
        },
        text: list.name + ', This is a test dialog...'
      })
    },
    changeList () {
      this.listData = [
        { name: 'Vicco', time: moment().format('HH:ss:mm') },
        { name: 'Wang', time: moment().format('HH:ss:mm') }
      ]
    },
    addNew (item) {
      alert('you click context item is ' + item.name)
    }
  },
  components: {
    'el-row': Row,
    'el-col': Col,
    'el-button': Button
  }
}
</script>
<style lang="scss" scoped>
.beauti-context {

  .el-row {
    padding: 10px;

    .el-col {
      padding: 10px;

      .box {
        width:200px;
        padding:10px;
        background-color:rgb(207, 207, 207);
        cursor: pointer;
      }

      .list {
        width: 150px;

        li {
          padding: 10px 0;
          border-bottom: 1px solid #cbcbcb;
          cursor: pointer;
        }
      }

    }
  }
}
</style>
