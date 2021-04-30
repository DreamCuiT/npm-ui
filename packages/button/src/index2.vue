<template>
  <el-button-group class="commonButton">
    <template v-for="(button,index) in renderButtonData">
      <el-tooltip :key="button.id" placement="top"
                      :disabled="button.isDisabled?false:true"
                      :content="tooltipContent(button)">
        <span>
          <el-button
            type="primary"
            round
            :icon="button.image"
            :disabled="buttonDisabled(button)"
            @click="btnEventHandle(button)"
            :key="index"
          >{{button.title}}</el-button>
        </span>
      </el-tooltip>
    </template>
  </el-button-group>
</template>

<script>
import { Button, ButtonGroup, Tooltip } from 'element-ui'

export default {
  name: 'CommonButton',
  props: {
    comp: {
      type: Object,
      default: () => {}
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
    showButtonAll: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      buttonData: [],
      // buttonDisabledLimit: this.$store.state.project.buttonLimit,
      // 测试数据-含min/max
      // buttonDisabledLimit: [
      //   {
      //     'id': '030103',
      //     'max': 1,
      //     'disabled': [
      //       {
      //         'field': 'status',
      //         'status': [
      //           '2100', '2300', '2400'
      //         ],
      //         'title': [
      //           '发布审批中', '已发布', '已完成'
      //         ]
      //       }
      //     ]
      //   },
      //   {
      //     'id': '030104',
      //     'mustSelect': true,
      //     'disabled': [
      //       {
      //         'field': 'status',
      //         'status': [
      //           '2100', '2300', '2400'
      //         ],
      //         'title': [
      //           '发布审批中', '已发布', '已完成'
      //         ]
      //       }
      //     ]
      //   },
      //   {
      //     'id': '030105',
      //     'min': 1,
      //     'max': 3,
      //     'disabled': [
      //       {
      //         'field': 'status',
      //         'status': [
      //           '2100', '2300', '2400'
      //         ],
      //         'title': [
      //           '发布审批中', '已发布', '已完成'
      //         ]
      //       }
      //     ]
      //   },
      //   {
      //     'id': '030107',
      //     'min': 1,
      //     'disabled': [
      //       {
      //         'field': 'status',
      //         'status': [
      //           '2000', '2200', '2300', '2400'
      //         ],
      //         'title': [
      //           '已保存', '发布驳回', '已发布', '已完成'
      //         ]
      //       }
      //     ]
      //   }
      // ],
      // 测试数据
      // buttonDisabledLimit: [
      //   {
      //     'id': '0401',
      //     'hidden': [
      //       {
      //         'field': 'lockStatus',
      //         'status': [
      //           true
      //         ],
      //         'title': [
      //           '已锁定'
      //         ]
      //       }
      //     ]
      //   },
      //   {
      //     'id': '030101',
      //     'mustSelect': true,
      //     'disabled': [
      //       {
      //         'field': 'status',
      //         'status': [
      //           '1', '2'
      //         ],
      //         'title': [
      //           '已启用', '已启用2'
      //         ],
      //         'link': null
      //       },
      //       {
      //         'field': 'isUse',
      //         'status': [
      //           true
      //         ],
      //         'title': [
      //           '已使用'
      //         ],
      //         'link': 'AND'
      //       }
      //     ]
      //   },
      //   {
      //     'id': '030103',
      //     'mustSelect': true,
      //     'disabled': [
      //       {
      //         'field': 'status',
      //         'status': [
      //           '1'
      //         ],
      //         'title': [
      //           '已启用'
      //         ]
      //       }
      //     ]
      //   },
      //   {
      //     'id': '030104',
      //     'mustSelect': true,
      //     'function': 'testFunction'
      //   },
      //   {
      //     'id': '030105',
      //     'mustSelect': true,
      //     'hidden': [
      //       {
      //         'field': 'lockStatus',
      //         'status': [
      //           true
      //         ],
      //         'title': [
      //           '已锁定'
      //         ]
      //       }
      //     ]
      //   },
      //   {
      //     'id': '030106',
      //     'disabled': [
      //       {
      //         'field': 'lockStatus',
      //         'status': [
      //           false
      //         ],
      //         'title': [
      //           '已解锁'
      //         ]
      //       }
      //     ]
      //   }
      // ],
      buttonLimitFlag: false // 判断行按钮是否需要禁用，默认不绑定禁用逻辑
    }
  },
  computed: {
    renderComp () {
      return this.comp
    },
    renderButtonData () {
      let that = this
      if (this.buttonData && this.buttonData.length) {
        let btnData = this.buttonData.map(o => ({ ...o }))
        let returnBtnData = []; let hiddenArr = []; let disabledArr = []; let titleArr = []; let noDataDisabledArr = []; let noDataTitleArr = []
        if (that.buttonLimitFlag) {
          btnData.map((item, index) => {
            if (item.disabledRules) {
              if (item.disabledRules.min && item.disabledRules.max) {
                if (that.selectRecords.length <= item.disabledRules.max && that.selectRecords.length >= item.disabledRules.min) {
                  that.selectRecords.map(record => {
                    that.checkButton(item, record, hiddenArr, disabledArr, titleArr)
                  })
                } else {
                  noDataDisabledArr.push(item.id)
                  if (that.selectRecords.length > item.disabledRules.max) {
                    noDataTitleArr.push(`最多选择${item.disabledRules.max}条行记录可进行${item.title}操作`)
                  } else if (that.selectRecords.length < item.disabledRules.min) {
                    noDataTitleArr.push(`最少选择${item.disabledRules.min}条行记录可进行${item.title}操作`)
                  }
                }
              } else if (item.disabledRules.max) {
                if (that.selectRecords.length <= item.disabledRules.max && that.selectRecords.length) {
                  that.selectRecords.map(record => {
                    that.checkButton(item, record, hiddenArr, disabledArr, titleArr)
                  })
                } else {
                  noDataDisabledArr.push(item.id)
                  if (that.selectRecords.length > item.disabledRules.max && that.selectRecords.length) {
                    noDataTitleArr.push(`最多选择${item.disabledRules.max}条行记录可进行${item.title}操作`)
                  } else {
                    noDataTitleArr.push('没有选择行记录时不可进行' + item.title + '操作')
                  }
                }
              } else if (item.disabledRules.min) {
                if (that.selectRecords.length >= item.disabledRules.min && that.selectRecords.length) {
                  that.selectRecords.map(record => {
                    that.checkButton(item, record, hiddenArr, disabledArr, titleArr)
                  })
                } else {
                  noDataDisabledArr.push(item.id)
                  if (that.selectRecords.length < item.disabledRules.min && that.selectRecords.length) {
                    noDataTitleArr.push(`最少选择${item.disabledRules.min}条行记录可进行${item.title}操作`)
                  } else {
                    noDataTitleArr.push('没有选择行记录时不可进行' + item.title + '操作')
                  }
                }
              } else if (item.disabledRules.mustSelect) {
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
            } else {
              if (that.selectRecords.length) {
                that.selectRecords.map(record => {
                  that.checkButton(item, record, hiddenArr, disabledArr, titleArr)
                })
              }
            }
          })

          btnData.map((item, index) => {
            if (item.disabledRules) {
              if (item.disabledRules.min && item.disabledRules.max) {
                if (that.selectRecords.length <= item.disabledRules.max && that.selectRecords.length >= item.disabledRules.min) {
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
              } else if (item.disabledRules.max) {
                if (that.selectRecords.length <= item.disabledRules.max) {
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
              } else if (item.disabledRules.min) {
                if (that.selectRecords.length >= item.disabledRules.min) {
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
              } else if (that.selectRecords.length) {
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
          console.log('returnBtnData', returnBtnData)
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
      that.buttonData = res.filter(item => item.location.indexOf('head') !== -1)

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

  },
  methods: {
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
    },
    btnEventHandle (button) { // 按钮触发事件接收参数的处理
      let emitRecord = null
      if (button.location.indexOf('row') !== -1) {
        emitRecord = this.selectRecords[0]
        if (button.disabledRules) {
          if (button.disabledRules.mustSelect || button.disabledRules.max > 1 || button.disabledRules.min > 1) {
            emitRecord = this.selectRecords
          }
        }
      } else if (button.location === 'head') {
        emitRecord = button
      }
      console.log('emitRecord', emitRecord)
      this.renderComp[button.eventHandle](emitRecord)
    }
  },
  components: {
    'el-button': Button,
    'el-button-group': ButtonGroup,
    'el-tooltip': Tooltip
  }
}
</script>

<style lang="scss">
.commonButton{
  .el-button--primary{
    background-color:$base-light-color;
    border-color:$base-light-color;
  }
  .el-button--primary.is-disabled {
    background-color: #80b8e2;
    border-color: #80b8e2;
  }
  .el-button--small.is-round{
    padding:8px 20px;
  }
}
</style>
