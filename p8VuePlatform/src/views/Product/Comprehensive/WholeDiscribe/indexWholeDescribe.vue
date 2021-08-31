<template>
    <div>
        <project-edit v-if="visibleProjectEditDrawer" :visible="visibleProjectEditDrawer"
                      :curr-entity-id="currEntityId"></project-edit>
        <project-view v-if="visibleProjectViewDrawer" :visible="visibleProjectViewDrawer"
                      :curr-entity-id="currEntityId"></project-view>
    </div>
</template>

<script>
import ProjectEdit from '@/views/Product/Em/EntiretyBase/Components/wholeDescribe'
import ProjectView from '@/views/Product/Em/EntiretyBase/Components/wholeDescribeView'
export default {
  name: 'indexWholeDescribe',
  props: {
    thirdMenuParam: {
      // 给三级菜单所传的参数
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  components: {
    ProjectEdit,
    ProjectView
  },
  data () {
    return {
      visibleProjectViewDrawer: false,
      visibleProjectEditDrawer: false,
      currEntityId: null
    }
  },
  mounted () {
    this.currEntityId = this.thirdMenuParam.currEntityId
    let isView = this.thirdMenuParam.isView
    if (isView === '1') {
      this.visibleProjectViewDrawer = true
    } else {
      this.visibleProjectEditDrawer = true
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>
