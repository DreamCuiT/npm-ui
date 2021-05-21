<template>
  <span class="commonButton">
    <template v-for="(button, index) in renderButtonData">
      <!-- <i :class="button.image" :key="button.id" style="color:#0070c5;margin:0 4px;font-size:18px;"></i> -->
      <el-tooltip
        v-if="buttonMoreLen > index"
        :key="button.id"
        placement="top"
        :disabled="button.isDisabled ? false : true"
        :content="tooltipContent(button)"
      >
        <span>
          <el-button
            type="primary"
            plain
            :icon="button.image"
            :disabled="buttonDisabled(button)"
            @click="renderComp[button.eventHandle](button)"
            :key="index"
            >{{ button.title }}</el-button
          >
        </span>
      </el-tooltip>
    </template>
    <el-dropdown size="small" split-button type="primary" v-if="renderButtonData.length > buttonMoreLen">
        更多
      <el-dropdown-menu slot="dropdown"
                        class="operation-dropdown">
        <template v-for="(button, btnIdx) in renderButtonData">
          <el-dropdown-item :key="button.id"
                            v-if="btnIdx >= buttonMoreLen"
                            style="padding: 0">
            <el-tooltip :key="button.id"
                        placement="left"
                        :disabled="button.isDisabled? tooltipContent(button)? false: true: true"
                        :content="tooltipContent(button)">
              <span style="display: block">
                <el-button type="text"
                            :disabled="buttonDisabled(button)"
                            @click="renderComp[button.eventHandle](button)"
                            style="width: 100%;height: 100%;text-align: left;padding: 0 15px;">
                            <i class="p8" :class="button.image"></i>{{ button.title }}</el-button>
              </span>
            </el-tooltip>
          </el-dropdown-item>
        </template>
      </el-dropdown-menu>
    </el-dropdown>
  </span>
</template>

<script>
import { Button, Tooltip, Dropdown, DropdownMenu, DropdownItem } from 'element-ui'

export default {
  name: 'P8Button',
  componentName: 'P8Button',
  props: {
    comp: {
      type: Object,
      default: () => {
        return {}
      }
    },
    specialRoteName: {
      type: String,
      default: ''
    },
    parentButtonId: {// 权限按钮如果有子的话传入该按钮的id
      type: String,
      default: ''
    },
    selectRecords: {
      type: Array,
      default: () => []
    },
    customButtonData: { // 智能报表中新增按钮
      type: Array,
      default: () => []
    },
    // buttonDisabledLimit: {
    //   type: Array,
    //   default: () => []
    // }
  },
  data () {
    return {
      docWidth: document.documentElement.clientWidth,
      buttonData: [],
      buttonDisabledLimit: this.$store.state.project.buttonLimit,
      buttonLimitFlag: false, // 判断行按钮是否需要禁用，默认不绑定禁用逻辑
      buttonMoreLen: 7
    }
  },
  computed: {
    renderComp () {
      return this.comp
    },
    renderCustomButtonData () {
      return [this.buttonData, ...this.customButtonData].filter(item => item.location === 'head')
    },
    renderButtonData () {
      let that = this
      if ((this.renderCustomButtonData && this.renderCustomButtonData.length) || this.buttonData.length) {
        let btnData = this.renderCustomButtonData.length ? this.renderCustomButtonData.map(o => ({ ...o })) : this.buttonData.map(o => ({ ...o }))
        let returnBtnData = []; let hiddenArr = []; let disabledArr = []; let titleArr = []; let noDataDisabledArr = []; let noDataTitleArr = []
        if (that.buttonLimitFlag) {
          btnData.map((item, index) => {
            if (item.disabledRules && item.disabledRules.mustSelect) {
              if (that.selectRecords.length) {
                that.selectRecords.map(record => {
                  that.checkButton(item, record, hiddenArr, disabledArr, titleArr)
                })
              } else {
                noDataDisabledArr.push(item.id)
                noDataTitleArr.push('没有选择行记录时不可进行' + item.title + '操作')
              }
            } else {
              if (that.selectRecords.length) {
                that.selectRecords.map(record => {
                  that.checkButton(item, record, hiddenArr, disabledArr, titleArr)
                })
              }
            }
          })

          btnData.map((item, index) => {
            if (that.selectRecords.length) {
              let disabledIndex = disabledArr.indexOf(item.id)
              if (disabledIndex !== -1) {
                item.isDisabled = true
                item.rdesc = titleArr[disabledIndex]
              }
            } else {
              let disabledIndex = noDataDisabledArr.indexOf(item.id)
              if (disabledIndex !== -1) {
                item.isDisabled = true
                item.rdesc = noDataTitleArr[disabledIndex]
              }
            }

            if (hiddenArr.indexOf(item.id) === -1) {
              returnBtnData.push(item)
            }
          })

          return returnBtnData
        } else {
          return btnData
        }
      } else {
        return []
      }
    }
  },
  mounted () {
    this._initButtonSize()
    window.addEventListener('resize', this._initButtonSize)
    let resourceName = this.$route.name
    if (this.specialRoteName && this.specialRoteName !== '') {
      resourceName = this.specialRoteName
    }
    const that = this
    const params = {
      'resourceName': resourceName,
      'parentUuid': this.parentButtonId
    }
    this.$api['button.info'](params).then(res => {
      that.buttonData = res.filter(item => item.location === 'head')

      // 给每个行按钮绑定相应的禁用规则
      that.buttonData.map(item => {
        that.buttonDisabledLimit.map(i => {
          if (item.id === i.id) {
            that.buttonLimitFlag = true
            item.disabledRules = i
          }
        })
      })
    }).catch(err => {
      console.log(err)
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this._initButtonSize)
  },
  methods: {
    _initButtonSize () {
      this.docWidth = document.documentElement.clientWidth
      switch (true) {
        case (this.docWidth > 1920):
          this.buttonMoreLen = 16
          break
        case (this.docWidth <= 1920 && this.docWidth > 1440):
          this.buttonMoreLen = 15
          break
        case (this.docWidth <= 1440 && this.docWidth > 1366):
          this.buttonMoreLen = 14
          break
        case (this.docWidth <= 1366 && this.docWidth > 1280):
          this.buttonMoreLen = 13
          break
        case (this.docWidth <= 1280 && this.docWidth > 1024):
          this.buttonMoreLen = 12
          break
        case (this.docWidth <= 1024):
          this.buttonMoreLen = 10
          break
      }
    },
    // 禁用按钮悬浮信息内容
    tooltipContent (button) {
      if (button.isDisabled) {
        if (typeof (button.isDisabled) === 'boolean') {
          return button.rdesc
        } else {
          if (typeof this.renderComp[button.isDisabled] === 'function') {
            return this.renderComp[button.isDisabled](this.selectRecords, button, ['disabled', 'disabledMsg']).disabledMsg
          } else {
            console.warn('[button.isDisabled]是一个函数，请在methods中增加[button.isDisabled]字段对应方法')
          }
        }
      } else {
        return ''
      }
      // button.isDisabled?(typeof(button.isDisabled)==='boolean'?button.rdesc:renderComp[button.isDisabled](scope.row,button,['disabled','disabledMsg']).disabledMsg):''
    },
    // 禁用按钮逻辑
    buttonDisabled (button) {
      if (button.isDisabled) {
        if (typeof (button.isDisabled) === 'boolean') {
          return button.isDisabled
        } else {
          if (typeof this.renderComp[button.isDisabled] === 'function') {
            return this.renderComp[button.isDisabled](this.selectRecords, button, ['disabled', 'disabledMsg']).disabled
          } else {
            console.warn('[button.isDisabled]是一个函数，请在methods中增加[button.isDisabled]字段对应方法')
          }
        }
      } else {
        return false
      }
      // button.isDisabled ? (typeof (button.isDisabled) === 'boolean' ? button.isDisabled : renderComp[button.isDisabled](scope.row, button, ['disabled', 'disabledMsg']).disabled) : false
    },
    checkButton (item, record, hiddenArr, disabledArr, titleArr) {
      // 按钮禁用逻辑
      if (item.disabledRules && item.disabledRules.disabled && item.disabledRules.disabled.length) {
        let disabledBoolean = false
        let btnDisabledTooltip = ''
        item.disabledRules.disabled.map((disItem, disIndex) => {
          let btnDisabled = disItem.status.indexOf(record[disItem.field])

          if (disItem.link) {
            if ((disItem.link).toUpperCase() === 'AND') {
              btnDisabledTooltip += ('与' + disItem.title[btnDisabled])
              disabledBoolean = disabledBoolean && (btnDisabled !== -1)
            } else if ((disItem.link).toUpperCase() === 'OR') {
              btnDisabledTooltip += (disabledBoolean ? ((btnDisabled !== -1) ? ('或' + disItem.title[btnDisabled]) : '') : disItem.title[btnDisabled])
              disabledBoolean = disabledBoolean || (btnDisabled !== -1)
            }
          } else {
            if (btnDisabled !== -1) {
              disabledBoolean = true
              btnDisabledTooltip += disItem.title[btnDisabled]
            } else {
              disabledBoolean = false
            }
          }
        })
        if (disabledBoolean) {
          disabledArr.push(item.id)
          titleArr.push(btnDisabledTooltip + '时不可进行' + item.title + '操作')
        }
      }
      // 按钮隐藏逻辑
      if (item.disabledRules && item.disabledRules.hidden && item.disabledRules.hidden.length) {
        let hiddenBoolean = false
        item.disabledRules.hidden.map((hiddenItem, hiddenIndex) => {
          let btnHidden = hiddenItem.status.indexOf(record[hiddenItem.field])

          if (hiddenItem.link) {
            if ((hiddenItem.link).toUpperCase() === 'AND') {
              hiddenBoolean = hiddenBoolean && (btnHidden !== -1)
            } else if ((hiddenItem.link).toUpperCase() === 'OR') {
              hiddenBoolean = hiddenBoolean || (btnHidden !== -1)
            }
          } else {
            hiddenBoolean = (btnHidden !== -1)
          }
        })
        if (hiddenBoolean) {
          hiddenArr.push(item.id)
        }
      }
      // 自定义函数控制按钮禁用/提示及隐藏
      if (item.disabledRules && item.disabledRules.function) {
        item.isDisabled = item.disabledRules.function
      }
    },
    triggerEvent (event) { // 点击按钮触发父页面事件
      this.$emit(event)
    }
  },
  components: {
    'el-button': Button,
    'el-tooltip': Tooltip,
    'el-dropdown': Dropdown,
    'el-dropdown-menu': DropdownMenu,
    'el-dropdown-item': DropdownItem
  }
}
</script>
