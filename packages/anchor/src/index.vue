<template>
  <div class="p8-anchor" :class="[renderPlacementStyle.anchorFlex]">
    <div
      class="p8-anchor-slider"
      :style="renderSliderStyle"
    >
      <ul class="p8-anchor-slider--wrap" v-if="placement === 'left' || placement === 'right'">
        <vue-perfect-scroll class="scroll-area">
          <li
            class="p8-anchor-slider--item__normal overHiding"
            :class="[renderPlacementStyle.sliderItemRow , {'active': sliderActive === index}]"
            v-for="(item,index) in menu"
            :key="item[menuKey.value]"
            @click.stop="sliderClickHandle(index)"
          >
            <el-tooltip
              :content="item[menuKey.label]"
              placement="right"
              :disabled="item[menuKey.label].length < 5"
            >
              <span>{{item[menuKey.label]}}</span>
            </el-tooltip>
          </li>
        </vue-perfect-scroll>
      </ul>
      <ul class="p8-anchor-slider--wrap__column" id="sliderScrollArea" v-else :style="{height: renderContentHeight.sliderHeight}">
        <!-- <vue-perfect-scroll class="scroll-area__column"> -->
          <li
            class="p8-anchor-slider--item__normal p8-anchor-slider--item__column overHiding"
            :class="[{'active': sliderActive === index}]"
            v-for="(item,index) in menu"
            :key="item[menuKey.value]"
            @click.stop="sliderClickHandle(index)"
          >
            <el-tooltip
              :content="item[menuKey.label]"
              placement="top"
              :disabled="item[menuKey.label].length < 5"
            >
              <span>{{item[menuKey.label]}}</span>
            </el-tooltip>
          </li>
        <!-- </vue-perfect-scroll> -->
      </ul>
    </div>
    <div class="p8-anchor-content" :style="{height: renderContentHeight.contentHeight}">
      <ul class="p8-anchor-content--wrap">
        <vue-perfect-scroll class="scroll-area" id="scrollArea">
          <li v-for="(item) in menu" :key="item[menuKey.value]" class="p8-anchor-content--item">
            <!-- <el-divider content-position="left">{{item[menuKey.label]}}</el-divider> -->
            <div class="title">
              <span>{{item[menuKey.label]}}</span>
            </div>
            <slot :name="item[menuKey.value]"></slot>
          </li>
        </vue-perfect-scroll>
      </ul>
    </div>
  </div>
</template>
<script>
import { Tooltip } from 'element-ui' // Divider
import VuePerfectScroll from 'vue-perfect-scrollbar'
export default {
  name: 'P8Anchor',
  componentName: 'P8Anchor',
  components: {
    'el-tooltip': Tooltip,
    // 'el-divider': Divider,
    VuePerfectScroll
  },
  props: {
    menu: { // menu: 锚点导航数组
      type: Array,
      default: () => {
        return []
      },
      require: true
    },
    /**
     * menuKey 绑定menu数组中的key: label字段绑定的是锚点导航文本, value字段绑定对应声明的key[组件会根据value字段绑定的key,找到menu数组中对应key的值, 作为slot绑定的name,在页面上使用]
     *  例如:
     *      menu = [
     *        { id: 1, name: '导航1'},
     *        { id: 'two', name: '导航2'},
     *      ]
     *      此时: menuKey = { label: 'id', value: 'name' }
     *
     *      index.vue 假设为你的页面,并引入了该组件
     *      <anchor :menu="menu" :menuKey="menuKey">
     *        <template #1>
     *           //导航1对应的内容区
     *        </template>
     *        <template #two>
     *           //导航2对应的内容区
     *        </template>
     *      </anchor>
     */
    menuKey: {
      type: Object,
      default: () => {
        return {
          label: 'label',
          value: 'value'
        }
      }
    },
    placement: { // menu出现的位置
      type: String,
      default: 'left' // top, right, left, bottom[bottom类型还未实现]
    }
  },
  computed: {
    renderPlacementStyle () {
      /**
       * 根据 placement(menu的位置, 设置相对应的style)
       */
      let renderStyle = null
      switch (this.placement) {
        case 'top':
          renderStyle = {
            anchorFlex: 'p8-anchor--column'
          }
          break
        case 'right':
          renderStyle = {
            anchorFlex: 'p8-anchor--row__reverse',
            sliderItemRow: 'p8-anchor-slider--item__row'
          }
          break
        case 'bottom':
          renderStyle = {
            anchorFlex: 'p8-anchor--column'
          }
          break
        default:
          renderStyle = {
            anchorFlex: '',
            sliderItemRow: 'p8-anchor-slider--item__row'
          }
      }
      return renderStyle
    },
    renderContentHeight () {
      /**
       * 设置 slider menu(锚点导航) 的高度 的 content(内容区) 的高度
       */
      let style = {}
      if (this.placement === 'left' || this.placement === 'right') {
        // left / right: menu和content是两列布局, 高度为100%
        style = {
          sliderHeight: '100%',
          contentHeight: '100%'
        }
      }
      if (this.placement === 'top' || this.placement === 'bottom') {
        // top / bottom: menu和content是上下布局
        if (this.menu.length * 120 > this.sliderScrollArea.clientWidth) {
          // menu总宽度超过父宽度, 宽度设大, 避免滚动条遮挡
          style = {
            sliderHeight: '58px',
            contentHeight: 'calc(100% - 60px)'
          }
        } else {
          // menu总宽度不超过父宽度, 宽度默认40px,
          style = {
            sliderHeight: '40px',
            contentHeight: 'calc(100% - 40px)'
          }
        }
      }
      return style
    },
    renderSliderStyle () {
      let style = {}
      if (this.placement === 'left' || this.placement === 'right') {
        style = {
          width: '150px',
          height: '100%'
        }
      } else {
        if (this.menu.length * 120 > this.sliderScrollArea.clientWidth) {
          // menu总宽度超过父宽度, 宽度设大, 避免滚动条遮挡
          style = {
            height: '58px',
            width: '100%'
          }
        } else {
          // menu总宽度不超过父宽度, 宽度默认40px,
          style = {
            height: '40px',
            width: '100%'
          }
        }
      }
      return style
    }
  },
  data () {
    return {
      scrollArea: '', // 内容滚动盒子
      scrollContentDoms: '', // 内容滚动dom
      sliderScrollArea: '', // menu滚动盒子
      sliderItemDoms: '', // menu item DOM
      sliderActive: 0
    }
  },
  mounted () {
    this.initDom()
    this.scrollAreaHandle()
  },
  destroyed () {

  },
  methods: {
    initDom () {
      this.scrollArea = document.getElementById('scrollArea')
      this.scrollContentDoms = document.getElementsByClassName('p8-anchor-content--item')

      if (this.placement === 'top' || this.placement === 'bottom') {
        this.sliderScrollArea = document.getElementById('sliderScrollArea')
        this.sliderItemDoms = document.getElementsByClassName('p8-anchor-slider--item__column')
        console.log(this.sliderScrollArea.offsetLeft, 'this.sliderScrollArea')
      }
    },
    sliderClickHandle (index) {
      /**
       * anchor-slider-menu点击事件
       */
      const scrollTop = this.scrollContentDoms[index].offsetTop
      this.scrollArea.scrollTo({
        top: scrollTop,
        behavior: 'smooth' // 平滑滚动
      })
      if (this.placement === 'top' || this.placement === 'bottom') {
        const sliderScrollLeft = this.sliderItemDoms[index].offsetLeft
        const sliderScrollAreaWidth = this.sliderScrollArea.clientWidth
        let scrollLeft = 0
        if (sliderScrollLeft > sliderScrollAreaWidth / 2) {
          scrollLeft = sliderScrollLeft + 60 - sliderScrollAreaWidth / 2
        }
        console.log(sliderScrollLeft, sliderScrollAreaWidth, 'top-slider-width')
        this.sliderScrollArea.scrollTo({
          left: scrollLeft,
          behavior: 'smooth' // 平滑滚动
        })
      }
      this.sliderActive = index
    },
    scrollAreaHandle () {
      /**
       * anchor-content-scroll滚动处理
       */
      const that = this
      const topArr = []
      for (let i = 0; i < this.scrollContentDoms.length; i++) {
        topArr.push(this.scrollContentDoms[i].offsetTop + (this.scrollContentDoms[i].clientHeight - this.scrollContentDoms[i].clientHeight / 3))
      }
      // console.log(topArr, 'topArr-topArr-topArr')
      // 监听dom元素的scroll事件
      let timer = null
      this.scrollArea.addEventListener('scroll', () => {
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          let currentOffsetTop = that.scrollArea.scrollTop
          // console.log(currentOffsetTop, 'currentOffsetTop----currentOffsetTop')
          let scrollEndIndex = -1
          for (let i = 0; i < topArr.length; i++) {
            if (currentOffsetTop < topArr[i]) { // 根据滚动距离判断应该滚动到第几个导航的位置
              scrollEndIndex = i
              break
            }
          }
          // console.log('currentOffsetTop', currentOffsetTop)
          that.sliderActive = scrollEndIndex > -1 ? scrollEndIndex : that.sliderActive
        }, 20)
      }, true)
    }
  }
}
</script>
