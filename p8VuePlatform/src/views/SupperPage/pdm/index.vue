<template>
  <div :style="{ 'height': dialogMaxHeight }" >
  <iframe id="ocxFrame" name="ocxFrame" frameborder="0" :src="ocxUrl" style="width:100%;height:100%;"  ></iframe>
  </div>
</template>
<script>
const mh = document.documentElement.clientHeight
export default {
  name: 'PdmFile',
  data () {
    return {
        dialogMaxHeight: mh + 'px',
        ocxUrl: 'http://www.baidu.com'
    }
  },
  components: {

  }
}

</script>
<style lang="scss" scoped>
</style>
