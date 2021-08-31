<template>
  <el-col :span="fields.colSpan">
    <!-- <el-form-item :label="fields.labelText"> -->
      <template v-if="fields.fieldName && fields.type === 'selectIcon'">
        <el-form-item :label="fields.elementOpacity ? fields.labelText : ''" :label-width="fields.labelWidth">
          <div style="text-align: center">
            <i :class="bindSelectIconClassHandle()"></i>
          </div>
        </el-form-item>
      </template>
      <template v-else>
        <template v-if="fields.scopedSlots && fields.scopedSlots.customRender === 'custom'">
          <el-form-item :label="fields.elementOpacity ? fields.labelText : ''" :label-width="fields.labelWidth">
            <template>
              <slot :name="fields.fieldName" :formData="formData"></slot>
            </template>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item :label="fields.elementOpacity ? fields.labelText : ''" :label-width="fields.labelWidth">
            <span class="font-size: 12px">{{formData[fields.fieldName]}}</span>
          </el-form-item>
        </template>
      </template>
    <!-- </el-form-item> -->
  </el-col>
</template>
<script>
import { FormItem, Col } from '~/index'
import { generateTree } from '@/utils/generateTree'
export default {
  name: 'FieldRenderView',
  components: {
    'el-form-item': FormItem,
    'el-col': Col
  },
  props: {
    formData: {
      type: Object,
      default: () => { }
    },
    fields: {
      type: Object,
      default: () => { }
    }
  },
  watch: {
    fields: {
      handler (val) {
        const that = this
        if (that.fields.optionUrl) {
          if (that.fields.optionUrl.api) {
            // console.log('111-api')
            that.$api[that.fields.optionUrl.api](that.fields.optionUrl.params ? that.fields.optionUrl.params : {}).then(res => {
              that.options = that.optionsDataHandle(res)
            }).catch(err => {
              console.log(err)
            })
          } else {
            if (that.fields.optionUrl.noApiOptionsToRender && that.fields.optionUrl.noApiOptionsToRender) {
              // console.log('222-noApi')
              if (that.fields.type === 'treeSelect') {
                // console.log('333-noApi-tree')
                that.options = that.optionsDataHandle(that.fields.treeData)
                // console.log('end-noApi-tree-view', that.options)
              } else {
                // console.log('333-noApi-other')
                that.options = that.optionsDataHandle(that.fields.options)
                // console.log('end-noApi-options', that.options)
              }
            }
          }
        } else {
          that.$emit('field-mounted')
        }
      },
      immediate: true,
      deep: true
    }
  },
  data () {
    return {
      options: []
    }
  },
  mounted () {
    this.$emit('field-mounted')
  },
  methods: {
    bindSelectIconClassHandle () {
      let options = this.fields.options && this.fields.options.length ? this.fields.options : this.options
      /**
       * 默认处理 下拉数据对应的字段为 label / value
       * 若存在 fields.optionUrl.value / fields.optionUrl.label
       *    则根据对应的字段进行数据过滤
       */
      let keyValue = 'value'
      let keyLabel = 'label'
      if (this.fields.optionUrl && this.fields.optionUrl.value) {
        keyValue = this.fields.optionUrl.value
      }
      if (this.fields.optionUrl && this.fields.optionUrl.label) {
        keyLabel = this.fields.optionUrl.label
      }
      let label = options.filter(item => item[keyValue] === this.formData[this.fields.fieldName])[0][keyLabel]
      return label
    },
    renderSlotName () {
      return this.fields.fieldName ? (this.fields.fieldName + 'View') : this.fields.slotName ? (this.fields.slotName + 'View') : ''
    },
    optionsDataHandle (normalData) {
      /**
       * 下拉框数据 公共逻辑处理部分
       */
      const that = this
      if (normalData.length <= 0) {
        that.$emit('field-mounted')
        return []
      }
      let normalDataTemp = JSON.parse(JSON.stringify(normalData)) // normalData进行处理生成新对象, 这样下面的操作就不会影响到默认传递进来的数据[options/treeDate]
      let options = []
      if (that.fields.optionUrl.label || that.fields.optionUrl.value) {
        // console.log('444-label-value')
        if (normalDataTemp[0].children) {
          let props = {
            label: that.fields.optionUrl.label || null,
            value: that.fields.optionUrl.value || null
          }
          // console.log('555-默认树形-view1', normalDataTemp)
          options = that.treeDataHandle(normalDataTemp, props)
          // console.log('555-默认树形-view2', options)
        } else {
          options = normalDataTemp.map(item => {
            if (that.fields.optionUrl.label) {
              item.label = item[that.fields.optionUrl.label]
            }
            if (that.fields.optionUrl.value) {
              item.value = item[that.fields.optionUrl.value]
            }
            return item
          })
          // console.log('666-', options)
          if (that.fields.type === 'treeSelect') {
            options = generateTree(normalDataTemp, that.fields.optionUrl.pId)
            // console.log('777-', options)
          }
        }
      } else {
        if (that.fields.type === 'treeSelect') {
          if (normalDataTemp[0].children) {
            options = normalDataTemp
          } else {
            options = generateTree(normalDataTemp, that.fields.optionUrl.pId)
          }
          // console.log('888-', options)
        } else {
          options = normalDataTemp
          // console.log('999-', options)
        }
      }
      that.$emit('field-mounted')
      return options
    },
    treeDataHandle (treeData, props = { label: '', value: '' }) {
      treeData.forEach(node => {
        if (props.label) {
          node.label = node[props.label]
        }
        if (props.label) {
          node.value = node[props.value]
        }
        if (node.children && node.children.length) {
          this.treeDataHandle(node.children, props)
        }
      })
      return treeData
    }
  }
}
</script>
<style lang="scss">
</style>
