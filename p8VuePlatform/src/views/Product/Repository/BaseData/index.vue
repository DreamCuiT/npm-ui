<template>
  <normal-layout :headerVisible="false">
    <template #west>
      <common-tree ref="tree"
                   :tree-api="treeApi"
                   :treeConfig="treeConfig"
                   @select="onSelect"
                   @initTreeData="initTreeData"
                   :treeParam='treeParam'></common-tree>
    </template>
    <template #center>
      <div>
        <component :is="componentLoader"
                   :dicType="dicType"
                   :type="type"
                   :roteName="roteName"></component>
      </div>
    </template>
  </normal-layout>

</template>

<script>

import { P8NormalLayout as NormalLayout } from '~/index'
import { P8Tree as CommonTree } from '~/index'

export default {
  name: 'BaseDicIndex',

  data () {
    return {
      // treeApi: dicTypeTreeAPI,
      treeData: [], // 树数据
      selectedKeys: [],
      customUrl: '',
      compoentParam: {},
      treeApi: 'baseData.dicTypeTree',
      dicType: '',
      treeParam: { roteName: this.$route.name },
      type: '',
      roteName: '',
      componentLoader: null,
      treeConfig: {
        'highlight-current': true,
        'current-node-key': 'base03'
      }
    }
  },
  watch: {
    customUrl (val, oldVal) {
      console.log('computed', this.customUrl)
      let result = val
      const resultMap = this.convertJson(result[1], '&')
      this.dicType = resultMap.dicType
      this.type = resultMap.type
      this.componentLoader = () => import(`./Components${result[0]}`)
    }
  },
  mounted () {
  },
  methods: {
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
      if (!node.url) {
        return false
      }
      let cutOutUrl = node.url
      if (cutOutUrl.split('?').length !== 2) {
        return false
      }
      let result = cutOutUrl.split('?')
      this.customUrl = result
      if (node.roteName) { this.roteName = node.roteName }
    },
    initTreeData (initTreeData) {
      let that = this
      initTreeData.forEach(function (item) {
        if (item.id === 'base03') {
          let cutOutUrl = item.url
          if (cutOutUrl.split('?').length !== 2) {
            return false
          }
          let result = cutOutUrl.split('?')
          that.customUrl = result
          if (item.roteName) { that.roteName = item.roteName }
        }
      })
    }
  },
  components: {
    NormalLayout,
    CommonTree

  }
}
</script>
