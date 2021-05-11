<template>
  <VuePerfectScrollbar ref="listPanel" class="infinite-list-wrapper" style="overflow:auto">
    <ul class="infinite-list" v-infinite-scroll="load" infinite-scroll-disabled="disabled" :infinite-scroll-distance="0" :infinite-scroll-delay="500">
      <li :key="index" v-for="(item, index) in infiniteList" class="infinite-list-item" @click="currentIndex = index"  :class="activeClass(index)">
        <slot name="list" :item="item" :index="index"></slot>
      </li>
    </ul>
    <div style="height: 50px">
      <el-button type="text" v-if="!noMore && !loading" @click="load(false)">滚动或点击显示更多</el-button>
      <p v-if="loading">加载中...</p>
      <p v-if="noMore && !loading">没有更多了</p>
    </div>
  </VuePerfectScrollbar>
</template>

<script>
  import VuePerfectScrollbar from 'vue-perfect-scrollbar'
  import { Button } from 'element-ui'
  export default {
    name: 'P8InfiniteScroll',
    componentName: 'P8InfiniteScroll',
    props: {
      keyName: { // 列表行记录的唯一标志
        type: String,
        default: 'id'
      },
      listApi: { // 滚动列表的api
        type: String
      },
      activeItem: { // 当前选中的列表的下标
        type: Number
      },
      searchParams: {
        type: Object,
        default: () => {
          return {}
        }
      },
      removedItem: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        loading: false,
        currentIndex: this.activeItem,
        infiniteList: [],
        pageInfo: {
          current: 0,
          size: 20,
          total: 0,
          orders: [],
          pages: 0
        }
      }
    },
    mounted () {
      // console.log('this.currentIndex', this.currentIndex)
    },
    computed: {
      noMore () {
        let { current, pages } = this.pageInfo
        return current === 0 ? false : current >= pages
      },
      disabled () {
        return this.loading || this.noMore
      },
      activeClass () {
        return function (index) {
          // console.log('index', this.index)
          if (this.computedIndex === index) {
            // console.log('this.currentIndex === index', this.computedIndex, index)
            this.selectItem(this.infiniteList[index], index)
          }
          return this.computedIndex === index ? 'activeRow' : ''
        }
      },
      computedIndex () {
        return this.currentIndex < this.infiniteList.length ? this.currentIndex : this.infiniteList.length - 1
      }
    },
    watch: {
      searchParams: {
        deep: true,
        handler: function () { this.load(true) }
      },
      listApi: function () { this.load(true) },
      activeItem (newVal) {
        this.currentIndex = newVal
        //   let index = newVal
        //   let maxIndex = this.infiniteList.length - 1
        //   console.log('newVal', newVal, 'maxIndex', maxIndex)
        //   if (index >= 0 && maxIndex >= 0) {
        //     if (index > maxIndex) {
        //       index = maxIndex
        //     }
        //     this.selectItem(this.infiniteList[index], index)
        //   }
      },
      removedItem: function (newVal) {
        this.infiniteList = this.infiniteList.filter((n) => n[this.keyName] !== newVal)
      },
      infiniteList: {
        deep: true,
        handler: function (newVal) {
          if (newVal && newVal.length === 0) {
            this.selectItem(null, -1)
          }
        }
      }
    },
    methods: {
      load (isRefresh) {
        this.loading = true
        let that = this
        let queryParam = that.searchParams

        let page = { ...this.pageInfo }
        if (isRefresh) {
          page.current = 1
        } else {
          page.current = page.current + 1
        }
        if (queryParam && Object.keys(queryParam).length) {
          queryParam = { ...queryParam, page }
        } else {
          queryParam = { page }
        }

        this.$api[this.listApi](queryParam).then(res => {
          let { records, pages } = res
          if (isRefresh) {
            that.infiniteList = records
            // console.log('that.$refs.listPanel', that.$refs.listPanel)
            that.$refs.listPanel.$el.scrollTop = 0
          } else {
            that.infiniteList.push(...records)
          }

          console.log('page', isRefresh, page)
          that.pageInfo.pages = pages
          that.pageInfo.current = page.current

          that.loading = false

          // console.log(records, that.pageInfo.current, 'res:')
          that.$emit('load', records, that.pageInfo.current)
        })
      },

      selectItem (data, index) {
        this.$emit('onSelect', data, index)
      }
    },
    components: {
      VuePerfectScrollbar,
      'el-button': Button
    }
  }
</script>


