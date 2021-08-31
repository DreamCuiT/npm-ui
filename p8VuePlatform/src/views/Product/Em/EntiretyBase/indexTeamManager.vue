<template>
    <div>
      <project-team :thirdMenuParam="thirdMenuParam" :group_type='groupType'></project-team>
    </div>
</template>

<script>
import ProjectTeam from '@/views/Product/Pm/Resource/teamManager'
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
    ProjectTeam
  },
  data () {
    return {
      visibleProjectViewDrawer: false,
      visibleProjectEditDrawer: false,
      currEntityId: null,
      groupType: ''
    }
  },
  created () {
    this.currEntityId = this.thirdMenuParam.currEntityId
    let isView = this.thirdMenuParam.isView
    if (isView === '1') {
      this.groupType = '5'
    } else {
      this.groupType = '6'
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>
