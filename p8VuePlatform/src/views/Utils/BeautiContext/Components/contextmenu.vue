<template>
   <baidu-map class="map"
    v-loading="isLoading"
    :ak="mapParams.ak"
    :center="mapParams.center"
    :zoom="mapParams.zoom"
    :scroll-wheel-zoom="true"
    @ready="initMap"
    ></baidu-map>
</template>
<script>
import { BaiduMap } from 'vue-baidu-map'
export default {
  name: 'Contextmenu',
  data () {
    return {
      isLoading: true,
      mapParams: {
        center: { lng: 0, lat: 0 },
        zoom: 15,
        ak: '7vVOlMOKr03PaWX82WajF6m'
      }
    }
  },
  mounted () {
    console.log('mount map')
  },
  methods: {
    initMap ({ BMap, map }) {
      setTimeout(() => {
        this.mapParams.center = '西安'
        this.mapParams.zoom = 15
        this.isLoading = false
      }, 500)
    }
  },
  components: { BaiduMap }
}
</script>
<style lang="scss">
.map {
  width: 600px;
  height: 350px;
}
</style>
