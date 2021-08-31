<template>
  <el-tabs v-model="tabActive" @tab-click="handleClick">
    <el-tab-pane v-for="item in iconJson" :key="item.key" :label="item.title" :name="item.key">
      <ul class="icon-list">
        <li v-for="(name,cindex) in item.icons" :key="cindex" :class="selected.indexOf(name) != -1 ? 'active' : ''" @click="handleSelectIcon(name)">
          <span>
            <p-icon :name="name"></p-icon>
            <span class="icon-name">{{name}}</span>
          </span>
        </li>
      </ul>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { Tabs, TabPane } from '~/index'
import Icon from './Icon.vue'
import iconJson from './iconJson'
export default {
  name: 'IconSelector',
  data () {
    return {
      iconJson,
      tabActive: iconJson[0].key,
      selected: []
    }
  },
  methods: {
    handleClick (tab, event) {

    },
    handleSelectIcon (name) {
      console.log(name)
      let index = this.selected.indexOf(name)
      index < 0 ? this.selected.push(name) : this.selected.splice(index, 1)
    }
  },
  components: {
    'el-tabs': Tabs,
    'el-tab-pane': TabPane,
    'p-icon': Icon
  }
}
</script>
<style lang="scss">
  .icon-list {
    position: relative;
    border: 1px solid #eeeeee;
    &:after {
      content: '';
      clear: both;
      display: block;
    }
    li {
      float: left;
      width: 10%;
      height: 120px;
      border-right: 1px solid #cccccc;
      border-bottom: 1px solid #cccccc;
      margin-right: -1px;
      margin-bottom: -1px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #606060;
      &:hover, &.active {
        color: #2196F3;
        cursor: pointer;
      }
      span {
        text-align: center;
      }
      i {
        display: block;
        font-size: 32px;
      }
      .icon-name {
        display: inline-block;
      }
    }
  }
</style>
