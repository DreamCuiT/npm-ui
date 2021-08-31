<template>
  <normal-layout :headerVisible="false">
    <template #west>
      <common-tree
        :data="treeData"
        @select="onSelect"
        :treeParam='treeParam'>
      </common-tree>
    </template>
    <template #center>
      <div>
        <component :is="componentLoader" :roteName="roteName"></component>
      </div>
    </template>
  </normal-layout>

</template>

<script>

import { P8NormalLayout as NormalLayout } from '~/index'
import { P8Tree as CommonTree } from '~/index'

export default {
  name: 'FunctionSetIndex',

  data () {
    return {
      treeData: [],
      selectedKeys: [],
      customUrl: '',
      compoentParam: {},
      treeParam: { roteName: this.$route.name },
      roteName: '',
      componentLoader: null,
      thirdMenu: [],
      availableRouter: []
    }
  },
  watch: {
    customUrl (val, oldVal) {
      let result = val
      const resultMap = this.convertJson(result[1], '&')
      this.dicType = resultMap.dicType
      this.type = resultMap.type
    }
  },
  mounted () {
    const currentName = this.$route.name
    const menuId = '09'
    var rootRouter
    this.$store.state.routers.router.map(function (item) {
      if (item.meta && item.meta.id === menuId) {
        rootRouter = item
        return false
      }
    })
    if (!rootRouter) {
      console.error('路由中未找到id为' + menuId + '的三级菜单')
    }
    this.initThirMneu(rootRouter, currentName)
    this.treeData = this.toTree(this.thirdMenu)
  },
  componentLoader () {
    return this.componentLoader
  },
  methods: {
    initThirMneu (route, currentPath) {
      let that = this
      if (route.children && route.children.length > 0) {
        route.children.map(function (item, index) {
          if (item.name === currentPath) {
            that.thirdMenu = item
          } else {
            that.initThirMneu(item, currentPath)
          }
        })
      }
    },
    convertJson (paramStr, tag) {
      let paramStrArr = paramStr.split(tag)
      let resultMap = {}
      paramStrArr.map(function (v) {
        let me = v.split('=')
        let meKey = me[0]; let meValue = me[1]
        resultMap[meKey] = meValue
      })
      return resultMap
    },
    onSelect (node) { // 点击树节点，触发父页面事件
      if (!node.path && !node.isLeaf) {
        return false
      }
      this.componentLoader = node.component
      if (node.name) { this.roteName = node.name }
    },
    toTree (data) {
      data = {
        ...data,
        label: data.meta.title,
        pId: null,
        id: data.meta.id,
        title: data.meta.title,
        key: data.meta.id
      }
      if (data.children && data.children.length) {
        data = {
          ...data,
          isLeaf: false,
          scopedSlots: { icon: 'parent' }
        }
        this.cascadeTree(data.children, data.id)
      } else {
        data = {
          ...data,
          isLeaf: true,
          slots: { icon: 'isLeaf' },
          scopedSlots: { title: 'custom' }
        }
        this.availableRouter.push(data)
      }

      return [data]
    },
    cascadeTree (data, parentId) {
      if (data && data.length) {
        data.map((item) => {
          item.label = item.meta.title
          item.pId = parentId
          item.id = item.meta.id
          item.title = item.name
          item.key = item.meta.id

          if (item && item.children && item.children.length) {
            item.isLeaf = false
            item.scopedSlots = { icon: 'parent' }
            this.cascadeTree(item.children, item.meta.id)
          } else {
            item.isLeaf = true
            item.slots = { icon: 'isLeaf' }
            item.scopedSlots = { title: 'custom' }
            this.availableRouter.push(item)
          }
        })
      }
    }
  },
  components: {
    NormalLayout,
    CommonTree

  }
}
</script>
