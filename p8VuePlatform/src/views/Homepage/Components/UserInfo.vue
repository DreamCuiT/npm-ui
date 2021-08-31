<template>
  <div class="user-info section-wrapper">
    <!-- user-info -->
    <div class="avatar">
      <!-- user avatar -->
    </div>
    <div class="info">
      <span class="welcome">Welcome to Nocturne platform</span>
      <span class="user">Vicco W.</span>
    </div>
    <div class="ctrl">
      <span class="notice nocturne icon-notice"></span>
      <span class="mail nocturne icon-mail"></span>
      <span class="github nocturne icon-github"></span>
      <span class="twitter nocturne icon-twitter"></span>
    </div>
  </div>
</template>
<script>

export default {
  name: 'HomeUserInfo'
}
</script>
<style lang="scss" scoped>
.user-info {
  height:90px;
  display: flex;

  .avatar {
    width:100px;
    display: inherit;
    justify-content: center;
    align-items: center;
    margin-right: 10px;

    &:after {
      content: '';
      width: 70px;
      height: 70px;
      background-color: #f2f2f2;
      border-radius:100%;
    }

    img {
      height: 80px;
    }

  }

  .info {
    display: flex;
    flex: 1 auto;
    align-items: center;

    span {
      display: inherit;
      align-items: flex-end;
      margin-right: 8px;
    }

    .welcome { font-size:1.8rem; }

    .user {
      position: relative;
      font-size: 1.2rem;
      top: 2px;
    }

  }

  .ctrl {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 150px;
    padding: 0 15px;

    span {
      display: inline-flex;
      width: 35px;
      height: 35px;
      margin: 0 5px;
      background-color: #f2f2f2;
      justify-content: center;
      align-items: center;
      font-size:2.1rem;
      color: rgb(129, 129, 129);
      border-radius: 5px;
      cursor: pointer;
      transition: all .1s linear;

      &:hover { color: #fff; }

      &.notice:hover { background-color: #44da8f; }
      &.mail:hover { background-color: #e6464e; }
      &.github:hover { background-color: rgb(73, 73, 73); }
      &.twitter:hover { background-color: rgb(62, 186, 218); }
    }
  }
}
</style>
