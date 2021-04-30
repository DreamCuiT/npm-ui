<template>
  <el-tree :data="data.length?data:treeData"
           node-key="id"
           ref="tree"
           :indent='0'
           :props="defaultProps"
           :default-expand-all="defaultExpandAll"
           :expand-on-click-node="false"
           @check-change="checkChange"
           @node-click="handleNodeClick"
           v-bind="treeConfig"
           highlight-current
           class="commonTree">

    <span v-if="
           !nodeSlot"
          class="custom-tree-node"
          slot-scope="{ node }">
      <i v-if="node.isLeaf"
         class="el-icon-document"></i>
      <i v-else-if="!node.isLeaf && node.expanded"
         class="el-icon-folder-opened"></i>
      <i v-else
         class="el-icon-folder"></i>
      <span>{{ node.label }}</span>
    </span>
    <template v-else
              slot-scope="{ node, data }">
      <slot :node="node"
            :data="data"
            name="tree"></slot>
    </template>
  </el-tree>
</template>

<script>
import { Tree } from 'element-ui'

export default {
  name: 'P8Tree',
  componentName: 'P8Tree',
  props: {
    treeApi: {
      type: String,
      default: ''
    },
    defaultExpandAll: { // 默认展开全部节点
      type: Boolean,
      default: true
    },
    treeParam: {
      type: Object,
      default: () => {
        return {}
      }
    },
    disabledRow: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    treeConfig: {
      type: Object,
      default: () => {
        return {}
      }
    },
    nodeSlot: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeData: [],
      initCheckedkeys: []
    }
  },

  mounted () {
    this.initTreeData()
  },
  watch: {
    treeConfig: {
      handler (val) {
        if (this.$refs.tree) {
          this.$refs.tree.setCurrentKey(val['current-node-key'])
        }
      },
      deep: true
    }
  },
  beforeDestroy () {

  },
  methods: {
    initTreeData () {
      if (this.treeApi) {
        const that = this
        this.$api[this.treeApi](this.treeParam).then(res => {
          const transformConfig = { nodeName: 'label', parentId: 'pId', nodeId: 'id', data: res }
          if (res && res.length > 0) {
            if (res[0].children) {
              that.treeData = res
            } else {
              that.treeData = that.toTree(transformConfig)
            }
          } else {
            that.treeData = Object.assign([], res)
          }
          that.$emit('initTreeData', res)
        }).catch(err => {
          console.log(err)
        })
      }
    },
    toTree (config) {
      let that = this
      // 删除 所有 children,以防止多次调用
      config.data.forEach(function (item) {
        delete item.children
      })
      // 将数据存储为 以 id 为 KEY 的 map 索引数据列
      const map = {}
      config.data.forEach(function (item) {
        // 树 的label
        item.label = item[config.nodeName]
        that.disabledRow.forEach(function (key) {
          if (item.id === key) {
            item.disabled = true
          }
        })
        map[item[config.nodeId]] = item
      })
      const val = []
      config.data.forEach(function (item) {
        // 以当前遍历项，的pid,去map对象中找到索引的id
        const parent = map[item[config.parentId]]
        if (item.isLeaf) {
          item.slots = { icon: 'isLeaf' }
        } else {
          item.scopedSlots = { icon: 'parent' }
        }
        // 如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
        if (parent) {
          (parent.children || (parent.children = [])).push(item)
        } else {
          // 如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
          val.push(item)
        }
      })
      // console.log(val);
      return val
    },
    handleNodeClick (node) {
      if (!node.disabled) {
        this.$refs.tree.setCheckedNodes([node])
      }
      this.$emit('select', node)
    },
    checkChange (node, check, childrenCheck) {
      this.$emit('get_checked_nodes', this.$refs.tree.getCheckedNodes())
    }
  },
  components: {
    'el-tree': Tree
  }
}
</script>