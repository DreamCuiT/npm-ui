<template>
  <el-dialog :title="title"
             width="20%"
             :visible="visible"
             append-to-body
             destroy-on-close
             @close="handleCancel">
    <list-layout>
      <template #north>
        <el-button type="primary"
                   @click="handleOk">确 定</el-button>
      </template>
      <template #center>
        <div style="height:392px;">
          <common-tree :treeApi="treeApi"
                       @select="onSelect"
                       @get_checked_nodes="getCheckedNodes"
                       :disabledRow="disabledRow"
                       :treeConfig="treeConfig"></common-tree>
        </div>
      </template>
    </list-layout>
  </el-dialog>
</template>
<script>
import { Dialog, Button } from '~/index'
import { P8ListLayout as ListLayout } from '~/index'
import { P8Tree as CommonTree } from '~/index'

export default {
  name: 'SelectDept',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    disabledRow: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    treeApi: {
      type: String,
      default: 'userManager.deptTree'
    },
    otherParam: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      flexHeight: '350px',
      queryParam: {},
      userParam: {},
      data: [], // 列表数据
      selectedRows: [],
      treeConfig: {
        'show-checkbox': true
      }
    }
  },
  components: {
    'el-dialog': Dialog,
    'el-button': Button,
    ListLayout,
    CommonTree
  },
  mounted () {
  },
  methods: {
    handleCancel () {
      this.$emit('close-dialog', this.selectedRows, this.otherParam)
    },
    handleOk (e) {
      this.$emit('close-dialog', this.selectedRows, this.otherParam)
    },
    onSelect (obj) {

    },
    getCheckedNodes (obj) {
      this.selectedRows = obj
    }
  }
}
</script>

<style lang="scss">
.common-table {
  &.flex-table {
    display: flex;
    flex-direction: column;
  }
  .small-table {
    width: 100%;
    flex: 1;
    display: inherit;
    // thead th, tbody td { padding: 7px 0 !important; }
  }
  .panination {
    margin: 9px 0;
    display: flex;
    flex: none;
    justify-content: flex-end;
  }
}
.normal-west {
  .custom-tree-node {
    > span {
      font-size: 13px;
    }
  }
}
</style>
