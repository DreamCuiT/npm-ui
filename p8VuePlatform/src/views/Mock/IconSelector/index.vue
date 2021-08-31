<template>
  <div class="iconSelectorView">
    <icon-selector ref='iconselector'></icon-selector>
    <el-button type="primary" plain class="btn-save" @click="saveName">获取</el-button>
  </div>
</template>
<script>
import IconSelector from './Components/IconSelector'
import { Button } from '~/index'
export default {
  name: 'IconSelectorView',
  data () {
    return {

    }
  },
  methods: {
    saveName () {
      let selected = this.$refs.iconselector.selected
      alert(selected.join(','))
      this.$emit('save-success', { icon: 'el-icon-loading', color: '#936733' })
    }
  },
  components: {
    IconSelector,
    'el-button': Button
  }
}
</script>
<style lang="scss">
  .iconSelectorView {
    box-sizing: border-box;
    padding: 10px;
    .btn-save {
      position: fixed;
      top: 10px;
      right: 60px;
      z-index: 10;
    }
  }
</style>
