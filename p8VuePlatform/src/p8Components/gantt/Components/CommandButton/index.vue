<template>
<div class='c-button' :class='buttonDynamicClass'>
  <template v-if="cbutton.id === 'hierarchy-filter'">
    <el-tooltip :content="cbutton.title" placement="top" :offset="-15" :enterable="false" effect="dark">
      <el-select v-model="level"
                :placeholder="cbutton.title"
                class='c-select' size="mini"
                style="width:70px;"
                @change="cbutton.clickFun(level, ganttName)"
                :clearable="true">
        <el-option
          v-for="(item, index) in vueThis.deep"
          :key="index + 1"
          :label="index + 1"
          :value="index + 1">
        </el-option>
      </el-select>
    </el-tooltip>
  </template>
  <template v-else-if="cbutton.type && cbutton.type === 'select' && cbutton.userDefault && cbutton.userDefault === 'true'">
    <el-tooltip :content="cbutton.title" placement="top" :offset="-15" :enterable="false" effect="dark">
      <el-select v-model="scheduling"
                :placeholder="cbutton.title"
                class='c-select' size="mini"
                style="width:125px;"
                @change="cbutton.clickFun(scheduling, ganttName, currentRecords)">
        <el-option
          v-for="(item, index) in cbutton.options"
          :key="index + 1"
          :label="item.label"
          :value="item.value"
          :disabled="selectDisable(cbutton)">
        </el-option>
      </el-select>
    </el-tooltip>
  </template>
  <template v-else>
    <el-tooltip :content="cbutton.title" placement="top" :offset="-15" :enterable="false" effect="dark">
      <span>
        <el-button type="text"
                    :disabled='isDisable(cbutton)'
                    @click='btnClick(cbutton)'
                    >
          <div v-if="size === 'mini' && !cbutton.icon.startsWith('p8')" class="style-div-color" :style="colorDynamicStyle(cbutton)">
          </div>
          <div v-else>
            <i :class="cbutton.icon" :style="iconDynamicClass"></i>
            <span class='button-title' v-if="size !== 'mini'" v-show="false">{{cbutton.title}}</span>
          </div>
        </el-button>
      </span>
    </el-tooltip>
    <el-dropdown v-if="cbutton.children && cbutton.children.length && size != 'mini'">
      <i class="el-icon-caret-bottom" :class="{'disabled':dropVisible}"></i>
      <el-dropdown-menu slot='dropdown'>
        <div v-for='(btnChild, index) in cbutton.children' :key='index' :class='{isdisable:isDisable(btnChild)}'>
            <el-dropdown-item @click.native="btnClick(btnChild)" :disabled="isDisable(btnChild)">
                        <el-button v-if="btnChild.id !== 'createByNum'" type="text" :disabled="isDisable(btnChild)" >
                          <i :class="btnChild.icon"></i>
                          {{btnChild.title}}
                        </el-button>
            </el-dropdown-item>
        </div>
      </el-dropdown-menu>
    </el-dropdown>
  </template>
</div>
</template>

<script>
import { DropdownMenu, DropdownItem, Button, Dropdown, Select, Option, Tooltip } from '~/index'
import { mapGetters } from 'vuex'
export default {
  name: 'CommandButton',
  components: {
    'el-dropdown-menu': DropdownMenu,
    'el-dropdown-item': DropdownItem,
    'el-button': Button,
    'el-dropdown': Dropdown,
    'el-select': Select,
    'el-option': Option,
    'el-tooltip': Tooltip
  },
  props: {
    cbutton: Object,
    btn: Object,
    size: String, // large,small,mini
    currentRecords: Array,
    ganttName: String
  },
  data () {
    return {
      showHelp: false,
      isBtnOver: false,
      isExpandOver: false,
      dropVisible: true,
      level: '',
      scheduling: ''
    }
  },
  watch: {
    currentRecords: function (newVal, oldVal) {
      this.scheduling = ''
    }
  },
  computed: {
    isDisable () {
      let that = this
      return function (btn) {
        let result
        if (!btn.isDisableFun(btn, this.ganttName, this.currentRecords)) {
          result = this.isDisableFun(btn, this.ganttName, this.currentRecords)// 添加额外逻辑处理
        } else {
          result = btn.isDisableFun(btn, this.ganttName, this.currentRecords)
        }
        if (!result) {
          that.dropVisible = false
        }
        return result
      }
    },
    selectDisable () {
      return function (btn) {
        return btn.isDisableFun(this.ganttName, this.currentRecords)
      }
    },
    expandEvents () {
      let eventsObj = {}
      if (!this.isDisable) {
        eventsObj = { mouseover: this.expandOver, mouseout: this.expandOut }
      }

      return eventsObj
    },
    buttonDynamicClass () {
      let sizeClass = 'c-button-' + this.size
      let classObj = [{ 'c-button-disabled': this.isDisable }, sizeClass]
      return classObj
    },
    iconDynamicClass () {
      let iconSize
      switch (this.size) {
        case 'large':
          iconSize = 'font-size: 24px;'
          break
        case 'mini':
          iconSize = 'font-size: 16px;'
          break
      }
      return iconSize
    },
    colorDynamicStyle () {
      return function (btn) {
        let styleObj = 'background:' + btn.icon
        if (this.isDisable(btn)) {
          styleObj = 'background: #6D6D6D'
        }
        return styleObj
      }
    },
    ...mapGetters(['vueThis'])
  },
  mounted () {

  },
  methods: {
    btnClick (btn) {
      btn.clickFun(btn, this.ganttName, this.currentRecords)
      // 变更页面修改保存按钮文字
      if (this.vueThis.ganttName === 'changeGantt') {
        this.vueThis.hasSave = true
      }
    },
    btnOver () {
      this.isBtnOver = true
    },
    btnOut () {
      this.isBtnOver = false
    },
    expandOver () {
      this.isExpandOver = true
    },
    expandOut () {
      this.isExpandOver = false
    },
    isDisableFun (btn, ganttName, tasks) {
      let result = false
      // 额外的处理逻辑
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
.c-button {
  display: block;

  .el-dropdown{
    margin-top:-5px;
    color:$base-light-color;
  }
}

.c-button-large .button-title {
  display: block;
  font-size: 13px;
  margin-top: 3px;
}

.c-button-large .el-dropdown {
  display: block;
  text-align: center;
  width: 30px;
}

.c-button-small {
  width: auto;
  height: auto;
  text-align: left;
}

.c-button-small .button-title {
  text-align: left;
  font-size: 13px;
  margin-left: 5px;
}

.c-button-large .children-expand-icon {
  width: 100%;
}

.c-button-over {
  display: inline-block;
  background-color: #e6f7ff;
}

.c-button-disabled {
  color: #e0e0e0;
}

.c-button-mini {
  width: 30px;
  height: auto;
  text-align: left;
}

.style-div-color{
  width: 12px;
  height: 12px;
  // border: 1px solid #ccc;
}
.disabled{
  color:$base-disabled-color;
}
.isdisable{
  cursor: no-drop;
}
</style>
