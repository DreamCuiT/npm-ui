<template>
  <div class="home-component-section">
    <!-- user info -->
    <home-user-info />
    <!-- card charts -->
    <home-card-chart />

    <section class="middle">
      <div class="home-line-chart">
        <home-line-chart />
      </div>
      <div class="user-list">
        <home-user-list />
      </div>
    </section>
    <div class="schedule-plan">
        <schedule-plan />
    </div>
  </div>
</template>
<script>
import HomeUserInfo from './Components/UserInfo'
import HomeCardChart from './Components/CardChart'
import HomeLineChart from './Components/LineChart'
import HomeUserList from './Components/UserList'
import SchedulePlan from './Components/SchedulePlan'

export default {
  name: 'Homepage',
  data () {
    return {
    }
  },
  components: {
    HomeUserInfo,
    HomeCardChart,
    HomeLineChart,
    HomeUserList,
    SchedulePlan
  }
}
</script>
<style lang="scss">
.home-component-section {
  width:100%;
  padding: 15px;
  box-sizing: border-box;

  .section-wrapper {
    border-radius:6px;
    border:1px solid #ececec;
    box-shadow: 0 4px 15px rgba(0,0,0,.04);
  }

  .middle {
    display: flex;
    height: 360px;

    > div { height: 100%; }

    .home-line-chart {
      flex:1;
      margin-right:15px;
    }

    .user-list {
      width: 300px;
    }

  }

  .schedule-plan {
    width: 100%;
    margin-top: 15px;
  }

}
</style>
