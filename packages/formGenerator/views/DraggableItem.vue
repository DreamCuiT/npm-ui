<script>
import Vue from 'vue'
import ElementUI from 'element-ui'
import draggable from 'vuedraggable'
import render from '../components/render/render'
import CustomUpload from '../components/render/CustomUpload'
import EjectSelect from '../components/render/EjectSelect'
import TreeSelect from '../components/render/TreeSelect'
import CustomView from '../components/render/CustomView'

Vue.use(ElementUI, { size: 'small' })

const components = {
  itemBtns (h, currentItem, index, list) {
    const { copyItem, deleteItem } = this.$listeners
    return [
      <span class="drawing-item-copy" title="复制" onClick={event => {
        copyItem(currentItem, list); event.stopPropagation()
      }}>
        <i class="el-icon-copy-document" />
      </span>,
      <span class="drawing-item-delete" title="删除" onClick={event => {
        deleteItem(index, list); event.stopPropagation()
      }}>
        <i class="el-icon-delete" />
      </span>
    ]
  }
}
const layouts = {
  colFormItem (h, currentItem, index, list) {
    const { activeItem } = this.$listeners
    const config = currentItem.__config__
    const child = renderChildren.apply(this, arguments)
    let className = this.activeId === config.formId ? 'drawing-item active-from-item' : 'drawing-item'
    if (this.formConf.unFocusedComponentBorder) className += ' unfocus-bordered'
    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null
    if (config.showLabel === false) labelWidth = '0'
    return (
      <el-col span={config.span} class={className}
        nativeOnClick={event => { activeItem(currentItem); event.stopPropagation() }}>
        <el-form-item label-width={labelWidth}
          label={config.showLabel ? config.label : ''} required={config.required}>
          { renderColFormItem.call(this, h, currentItem, config, child) }
        </el-form-item>
        {components.itemBtns.apply(this, arguments)}
      </el-col>
    )
  },
  rowFormItem (h, currentItem, index, list) {
    const { activeItem } = this.$listeners
    const config = currentItem.__config__
    const className = this.activeId === config.formId
      ? 'drawing-row-item active-from-item'
      : 'drawing-row-item'
    let child = renderChildren.apply(this, arguments)
    if (currentItem.type === 'flex') {
      child = <el-row type={currentItem.type} justify={currentItem.justify} align={currentItem.align}>
        {child}
      </el-row>
    }
    return (
      <el-col span={config.span}>
        <el-row gutter={config.gutter} class={className}
          nativeOnClick={event => { activeItem(currentItem); event.stopPropagation() }}>
          <span class="component-name">{config.componentName}</span>
          <draggable list={config.children || []} animation={340}
            group="componentsGroup" class="drag-wrapper">
            {child}
          </draggable>
          {components.itemBtns.apply(this, arguments)}
        </el-row>
      </el-col>
    )
  },
  // 新增布局型组件--NormalLayout(开发ing)
  normalLayoutItem (h, currentItem, index, list) {
    const { activeItem } = this.$listeners
    const config = currentItem.__config__
    const className = this.activeId === config.formId
      ? 'drawing-row-item active-from-item'
      : 'drawing-row-item'
    let child = renderChildren.apply(this, arguments)
    if (currentItem.type === 'flex') {
      child = <el-row type={currentItem.type} justify={currentItem.justify} align={currentItem.align}>
        {child}
      </el-row>
    }
    return (
      <el-col span={config.span} class={className} nativeOnClick={event => { activeItem(currentItem); event.stopPropagation() }}>
        {components.itemBtns.apply(this, arguments)}
        <el-row>
          <el-col span={config.span}>
            <div id="normal-west">
              <span class="component-name">{config.componentName}</span>
              <draggable list={config.children || []} animation={340}
                group="componentsGroup" class="drag-wrapper">
                {child}
              </draggable>
            </div>
          </el-col>
          <el-col span={config.span}>
            <div id="normal-center">
              <span class="component-name">{config.componentName}</span>
              <draggable list={config.children || []} animation={340}
                group="componentsGroup" class="drag-wrapper">
                {child}
              </draggable>
            </div>
          </el-col>
        </el-row>
      </el-col>)
  },
  raw (h, currentItem, index, list) {
    const config = currentItem.__config__
    const child = renderChildren.apply(this, arguments)
    return <render key={config.renderKey} conf={currentItem} onInput={ event => {
      this.$set(config, 'defaultValue', event)
    }}>
      {child}
    </render>
  },
  // 主从表组件
  masterSlaveTable (h, currentItem, index, list) {
    const { activeItem } = this.$listeners
    const config = currentItem.__config__
    const className = this.activeId === config.formId
      ? 'drawing-row-item active-from-item'
      : 'drawing-row-item'
    let child = renderChildren.apply(this, arguments)
    if (currentItem.type === 'flex') {
      child = <el-row type={currentItem.type} justify={currentItem.justify} align={currentItem.align}>
        {child}
      </el-row>
    }
    return (
      <el-col span={config.span}>
        <el-row gutter={config.gutter} class={className}
          nativeOnClick={event => { activeItem(currentItem); event.stopPropagation() }}>
          <span class="component-name">{config.componentName}</span>
          <draggable list={config.children || []} animation={340}
            group="componentsGroup" class="drag-wrapper">
            {child}
          </draggable>
          {components.itemBtns.apply(this, arguments)}
        </el-row>
      </el-col>
    )
  },
    // 表单容器组件
  formGenerateContainer (h, currentItem, index, list) {
    const { activeItem } = this.$listeners
    const config = currentItem.__config__
    const className = this.activeId === config.formId
      ? 'drawing-row-item active-from-item'
      : 'drawing-row-item'
    let child = renderChildren.apply(this, arguments)
    if (currentItem.type === 'flex') {
      child = <el-row type={currentItem.type} justify={currentItem.justify} align={currentItem.align}>
        {child}
      </el-row>
    }
    return (
      <el-col span={config.span}>
        <el-row gutter={config.gutter} class={className}
          nativeOnClick={event => { activeItem(currentItem); event.stopPropagation() }}>
          <span class="component-name">{config.componentName}</span>
          <draggable list={config.children || []} animation={340}
            group="componentsGroup" class="drag-wrapper">
            {child}
          </draggable>
          {components.itemBtns.apply(this, arguments)}
        </el-row>
      </el-col>
    )
  }
}

function renderChildren (h, currentItem, index, list) {
  const config = currentItem.__config__
  if (!Array.isArray(config.children)) return null
  return config.children.map((el, i) => {
    if (currentItem.__config__.layout === 'masterSlaveTable') {
      el.__config__.selectChildTable = true
    }
    const layout = layouts[el.__config__.layout]
    if (layout) {
      return layout.call(this, h, el, i, config.children)
    }
    return layoutIsNotFound.call(this)
  })
}

function layoutIsNotFound () {
  throw new Error(`没有与${this.currentItem.__config__.layout}匹配的layout`)
}

function renderColFormItem (h, currentItem, config, child) {
  /**
   * renderColFormItem: 处理自定义组件和默认组件
   */
  const customComponents = {
    'p8-upload': <CustomUpload config={currentItem}></CustomUpload>,
    'eject-select': <EjectSelect config={currentItem}></EjectSelect>,
    'tree-select': <TreeSelect config={currentItem}></TreeSelect>,
    'custom-view': <CustomView config={currentItem}></CustomView>
  }
  let componentItem = customComponents[config.tag]
  if (!componentItem) {
    componentItem = (
      <render key={config.renderKey} conf={currentItem} onInput={ event => {
        this.$set(config, 'defaultValue', event)
      }}>
        {child}
      </render>
    )
  }
  return componentItem
}
export default {
  components: {
    render,
    draggable
  },
  props: [
    'currentItem',
    'index',
    'drawingList',
    'activeId',
    'formConf'
  ],
  render (h) {
    const layout = layouts[this.currentItem.__config__.layout]

    if (layout) {
      return layout.call(this, h, this.currentItem, this.index, this.drawingList)
    }
    return layoutIsNotFound.call(this)
  }
}
</script>
