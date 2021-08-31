<template>
  <div class="user-list section-wrapper">
    <!-- user list -->
    <VuePerfectScrollbar class="scroll-area">
      <ul>
        <li v-for="user in listData" :key="user.id">
          <div class="avatar">
          </div>
          <div class="content">
            <div class="name">{{ user.name }}</div>
            <div class="info">
              <div class="mail"><span class="nocturne icon-mail"></span>{{ user.mail }}</div>
              <div class="phone"><span class="nocturne icon-phone"></span>{{ user.phone }}</div>
            </div>
          </div>
        </li>
      </ul>
    </VuePerfectScrollbar>
  </div>
</template>
<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

const listData = [
  { id: 1, name: 'Jack', mail: 'jack@nocturne.com', phone: '532-102-324' },
  { id: 2, name: 'Rose', mail: 'Rose@nocturne.com', phone: '532-102-126' },
  { id: 3, name: 'Bella', mail: 'Bella@nocturne.com', phone: '532-102-121' },
  { id: 4, name: 'Maria', mail: 'Maria@nocturne.com', phone: '532-122-146' },
  { id: 5, name: 'Steve', mail: 'Steve@nocturne.com', phone: '532-282-252' },
  { id: 6, name: 'Bill', mail: 'Bill@nocturne.com', phone: '532-192-198' }
]

export default {
  name: 'HomeUserList',
  data () {
    return {
      listData: []
    }
  },
  mounted () {
    this.initListData()
  },
  methods: {
    initListData () {
      this.listData = listData
    }
  },
  components: { VuePerfectScrollbar }
}
</script>
<style lang="scss" scoped>
.user-list {
  display: flex;
  height:100%;

  .scroll-area {
    width:100%;
    position: relative;
  }

  ul {
    display: flex;
    flex-direction: column;
    overflow: hidden;

    li {
      display: inherit;
      padding: 6px 15px;
      box-sizing: border-box;
      align-items: center;

      .avatar {
        width: 60px;
        height: 60px;
        background-color: #f2f2f2;
        border-radius: 100%;
      }

      .content {
        flex: 1;
        padding: 10px;

        .name {
          font-size:1.2rem;
          padding:2px 0;
          font-weight: 600;
        }

        .info {
          border-top: 1px solid #f2f2f2;

          > div {
              display: flex;
              align-items: center;
              padding: 2px 0;

              > span {
                margin-right:5px;
                color: rgb(155, 155, 155);
                transform: translateY(2px);
              }
          }

          .mail { }

          .phone { }

        }

      }

    }

  }

}
</style>
