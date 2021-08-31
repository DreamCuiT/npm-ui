<template>
  <div class="pane-wrap">
    <div class="pane-title">
      <span>
        <i class="el-icon-star-on"></i>
        {{paneTitle}}
      </span>
      <slot name="paneTitle"></slot>
    </div>
    <div class="pane-info">
      <slot name="paneInfo"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PaneView',
  props: {
    paneTitle: {
      type: String,
      default: 'Title名称'
    }
  },
  components: {

  }
}
</script>
<style lang="scss">
  .pane-wrap {
    height: 100%;
    .pane-title {
      position: relative;
      height: 40px;
      line-height: 40px;
      box-sizing: border-box;
      padding: 0 8px;
      background-color: #F5F7FA;
      color: #333333;
      font-weight: 600;
    }
    .pane-info {
      height: calc(100% - 40px);
      overflow-y: auto;
    }
  }
</style>
