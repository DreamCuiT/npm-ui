<template>
    <tree :data="treeData" :nodeSlot="true" @select="selectNode" :treeConfig="treeCfg">
        <template #tree="{node}">
            <span class="node-span">
                <i  class="p8" :class="node.data.icon"></i>
                <span class="node-label" >{{ node.data.cmeaning }} </span>
                <span class="node-number">({{ catalogCount(node.data.id).noread }})</span>
            </span>
        </template>
    </tree>
</template>

<script>
import { P8Tree as commonTree } from '~/index'
import { generateTree } from '@/utils/generateTree'
import { deepClone } from '@/utils/common'
// let rootCatalog = {
//   id: '',
//   cmeaning: '所有消息',
//   icon: 'icon-plan-type-completion'
// }
export default {
  name: 'MessageCatalog',
  props: {
    searchParams: {
      type: Object,
      default: () => {}
    },
    msgCount: {
      type: Array,
      default: () => []
    },
    unReadTotal: {
      type: Number,
      default: 0
    },
    selectNodeId: {
      type: String,
      default: ''
    }

  },
  components: {
    'tree': commonTree
  },
  data () {
    return {
      messageCatalogApi: 'userMessage.catalog',
      catalogData: [],
      treeCfg: {
        'icon-class': 'noIcon',
        'indent': 48,
        'highlight-current': true,
        'current-node-key': this.selectNodeId
      }
    }
  },
  watch: {
    changedMsg: {
      deep: true,
      handler: function (newVal) {
        if (newVal && newVal.length > 0) {
          newVal.forEach((item, index, arr) => {
            let catalog = this.catalogData.find(value => value.id === item.id)
            console.log('catalog', catalog)
            // catalog.
          })
        }
      }
    },
    selectNodeId (val, oldVal) {
      let _this = this
      setTimeout(() => {
        _this.selectNode({ id: val })
      }, 300)
    }
  },
  computed: {
    treeData () {
      if (this.selectNodeId !== '18') {
        let messageData = []
        let catalogData = deepClone(this.catalogData)
        catalogData.map(item => {
          if (item.id === this.selectNodeId) {
            item.cparentid = null
            messageData.push(item)
          } else if (item.cparentid === this.selectNodeId) {
            messageData.push(item)
          }
        })
        return generateTree(messageData, 'cparentid')
      } else {
        let resultData = generateTree(this.catalogData, 'cparentid')
        if (resultData && resultData.length > 0) {
          resultData[0].cmeaning = '所有消息'
        }
        return resultData
      }
    },
    catalogCount () {
      return function (catalogId) {
        let countObj
        if (catalogId === '') {
          countObj = { noread: this.unReadTotal }
        } else {
          countObj = this.msgCount.find(value => value.id === catalogId)
        }
        let o = { ...{ read: 0, noread: 0 }, ...countObj }
        return o
      }
    }
  },
  mounted () {
    this.loadCatalog()
  },
  methods: {

    loadCatalog (queryParam) {
      let _this = this
      this.$api[this.messageCatalogApi](queryParam).then(res => {
        _this.catalogData = res
      })
    },

    selectNode (nodeData) {
      this.treeCfg['current-node-key'] = nodeData.id
      console.log('this.treeCfg[\'current-node-key\']', this.treeCfg['current-node-key'])
      this.$emit('selectNode', nodeData)
    }
  }
}
</script>

<style scoped>
    .node-span {
        padding-left: 10px;
    }
    .node-label {
        display: inline-block;
        width: 70px;
    }
</style>
