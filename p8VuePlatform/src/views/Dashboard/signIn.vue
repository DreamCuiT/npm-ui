<template>
  <div>
    <component v-if="currentTabComponent" :is="componentLoader" :formCompProp="formCompProp" ></component>
  </div>
</template>
<script>
export default {
  name: 'SignIn',
  data () {
    return {
      currentTabComponent: null,
      formCompProp: {}
    }
  },
  computed: {
    componentLoader () {
      return () => import(`@/views/${this.currentTabComponent}.vue`)
    }
  },
  mounted () {
    let that = this
      this.$api['commonInterface.signInConfig']({ dataId: this.$route.query.redirect }).then(res => {
      console.log('sd', res)
      that.currentTabComponent = res.dataUrl
      that.formCompProp = { ...that.$route.query }
    })
  },
  methods: {

  }
}
</script>
