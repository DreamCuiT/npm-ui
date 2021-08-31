<template>
  <div class="layout">
    <headers></headers>
    <section class="section">
      <sidebar v-bind:style="{width: sidebarState.width}"></sidebar>
      <div class="main-content" v-bind:style="{width:`calc(100% - ${sidebarState.width})`}">
        <tag-tabs></tag-tabs>
        <app-main class="main-wrapper" id="mainWrapper"></app-main>
      </div>
    </section>
  </div>
</template>

<script>
import headers from './Components/header'
import sidebar from './Components/Sidebar'
import tagTabs from './Components/tagTabs'
import appMain from './Components/main'

import { mapGetters } from 'vuex'

export default {
  name: 'Layout',
  components: {
    headers,
    sidebar,
    tagTabs,
    appMain
  },
  computed: {
    ...mapGetters(['sidebarState'])
  }
}
</script>

<style lang="scss">
.main{
  background:#fff;
}
.layout{
  width:100%;
  height:100%;

  .section{
    width:100%;
    height:calc(100% - 50px);
    display:flex;
  }

  .main-content{
    flex:1 auto;
    display: inherit;
    flex-direction: column;
    transition:all .3s ease-in-out 0s;

    .main-wrapper{
      flex:1;
    }
  }
}
</style>
