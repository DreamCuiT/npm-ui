<template>
  <pane-view paneTitle="管理要素">
    <template #paneTitle>
      <div></div>
    </template>
    <template #paneInfo>
      <div class="task-manage-con">
        <list-view></list-view>
      </div>
    </template>
  </pane-view>
</template>
<script>
import PaneView from '../layout/Pane'
import ListView from './list'
export default {
  name: 'TaksManager',
  inject: ['getPlanInfo'],
  components: {
    PaneView,
    ListView
  },
  data () {
    return {}
  },
  mounted () {

  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.task-manage-con {
  height: 100%;
  position: relative;

}
/deep/ .pane-info {
  overflow: hidden;
}
</style>
