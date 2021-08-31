<template>
  <div class="nextpage">
    <div class="page">
      <h2>Nextpage</h2>
      <h3>Nextpage is a component that can pass values to next page without vue router.</h3>
      <hr>
      <div class="input-section">
        <input type="text" v-model="input" placeholder="Type some words here, they will be passed to next page when you click the botton."/>
        <button type="button" @click="showNext">Click to jump to next page</button>
      </div>
    </div>
  </div>
</template>
<script>
import NextOne from './components/NextOne'

export default {
  name: 'NextPage',
  data () {
    return {
      input: '',
      contextTarget: document.body,
      contextShow: false,
      menuData: []
    }
  },
  methods: {
    showNext () {
      this.$nextPage({
        title: '第二页',
        props: {
          text: this.input
        },
        component: NextOne,
        show: () => {
          console.log('before show')
        },
        beforeClose: (childComp) => {
        },
        cache: true
      })
    }
  },
  components: {
    NextOne,  /* eslint-disable-line */
  }
}
</script>
<style lang="scss" scoped>
.nextpage {
  display: flex;
  justify-content: center;
  position: relative;
  height:100%;

  .page {
    position: absolute;
    top: 10%;
    width: 80%;
    height: 400px;
    padding: 15px;
    background-color: #fff;
    border-radius: 10px;
    z-index: 3;
    box-shadow: 0 0 5px rgba(0,0,0,.1), 0 5px 15px rgba(0,0,0,.06);
    box-sizing: border-box;

    h2,h3,h4 {
      font-weight: 400;
    }

    hr {
      background: #cbcbcb;
      border: none;
      height: 1px;
    }

    .input-section {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-top: 55px;

      input {
        width: 80%;
        padding: 12px 10px;
        border: 1px solid #cbcbcb;
        border-radius: 8px;
        font-weight: 600;
        outline: none;
      }

      button {
        width: 200px;
        padding: 10px;
        margin: 15px 0;
        background-color: #333;
        border: none;
        color: #f2f2f2;
        border-radius: 8px;
        cursor: pointer;

        &:hover {
          background-color: lighten(#333, 10%);
        }

        &:active {
          background-color: darken(#333, 5%);
        }

      }
    }

  }

}
</style>
