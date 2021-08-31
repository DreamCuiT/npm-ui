<template>
  <div class="card section-wrapper">
    <div class="shape">
      <progressbar ref="progress" :options="progressOpts" />
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>
<script>
import Progressbar from '@/components/progressbar'

const randomColor = [
  '#E91E63',
  '#2196F3',
  '#00BCD4',
  '#F9A825',
  '#26A69A',
  '#5E35B1',
  '#F44336',
  '#9C27B0'
]
const getRandomNumber = (m, n) => {
  return Math.floor(Math.random() * (m - n + 1) + n)
}
const getRandomColor = () => {
  return randomColor[ getRandomNumber(0, randomColor.length) ]
}
const getRandomProgressValue = () => {
  const progress = Math.random()
  return [ progress, getRandomColor() ]
}

export default {
  name: 'HomeCard',
  data () {
    return {
      progressValue: [],
      progressOpts: {
        width: '100%',
        height: '90px',
        color: '',
        strokeWidth: 8,
        trailWidth: 4,
        duration: 2000,
        easing: 'easeOut',
        step: function (state, circle) {
          const value = Math.round(circle.value() * 100)
          // console.log(value)
          if (value === 0) {
            circle.setText('')
          } else {
            circle.setText(value + '%')
          }
        }
      }
    }
  },
  beforeMount () {
    this.progressValue = getRandomProgressValue()
    this.progressOpts.color = this.progressValue[1]
  },
  mounted () {
    setTimeout(() => {
      this.progressAnimate()
    }, 150)
  },
  activated () {
    this.progressAnimate()
  },
  methods: {
    progressAnimate (shape) {
      this.$refs.progress.shape.animate(this.progressValue[0])
    }
  },
  components: {
    Progressbar
  }
}
</script>
<style lang="scss" scoped>
.card {
  height:140px;
  display: flex;
  padding: 15px 0;
  box-sizing: border-box;

  .shape {
    width: 35%;
    display: inherit;
    justify-content: center;
    align-items: center;
    padding: 0 15px;
    border-right: 1px solid #f2f2f2;
  }

  .content {
    flex: 1;
    display: inherit;
    flex-direction: column;
  }

}
</style>
