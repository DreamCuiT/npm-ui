<template>
  <div class="card-chart">
    <home-card>
      <div class="number">$78,201</div>
      <div class="tip">Topic Seller</div>
    </home-card>
    <home-card>
      <div class="number">193,281</div>
      <div class="tip">INCREASE USERS</div>
    </home-card>
    <home-card>
      <div class="number">27M</div>
      <div class="tip">INCREASE FLOW</div>
    </home-card>
    <home-card>
      <div class="number">187.2</div>
      <div class="tip">INCREASE FLOW</div>
    </home-card>
  </div>
</template>
<script>
import HomeCard from './Card'

export default {
  name: 'HomeCardChart',
  components: {
    HomeCard
  }
}
</script>
<style lang="scss" scoped>
.card-chart {
  display: flex;
  margin:15px 0;

  > div {
    flex: 1;
    margin-right: 15px;

    &:last-child {
      margin-right: 0;
    }

    .number,
    .tip {
      padding:10px;
      flex:1;
      display: flex;
    }

    .number {
      font-size:2.5rem;
      align-items: center;
    }

    .tip {
      color: gray;
    }
  }
}
</style>
