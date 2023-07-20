<template>
  <div class="game-wrapper">
    <div class="logo-wrapper">
      <button
        class="btn-game"
        @click="$router.push('/')"
      >
        <span class="icon-home"></span>
      </button>
      <button
        v-if="$router.currentRoute.value.fullPath !== '/'"
        class="btn-game"
        @click="$router.back()"
      >
        <span class="icon-back"></span>
      </button>
      <img src="/assets/images/logo.svg" />
    </div>
    <div class="panel-title">
      <div class="title-3d-list">
        <span class="title-3d-wrap">
          <span class="title-3d">G</span>
          <span class="title-3d-shadow">G</span>
        </span>
        <span class="title-3d-wrap">
          <span class="title-3d">A</span>
          <span class="title-3d-shadow">A</span>
        </span>
        <span class="title-3d-wrap">
          <span class="title-3d">M</span>
          <span class="title-3d-shadow">M</span>
        </span>
        <span class="title-3d-wrap">
          <span class="title-3d">E</span>
          <span class="title-3d-shadow">E</span>
        </span>
      </div>
      <div class="panel-title-shadow"></div>
    </div>
    <router-view v-slot="{ Component }">
      <transition
        name="page"
        mode="out-in"
      >
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style scoped lang="scss">
  .game-wrapper {
    height: 100vh;
    padding: 60px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    overflow: auto;
  }
  .logo-wrapper {
    position: absolute;
    display: flex;
    gap: 20px;
    top: 60px;
    left: 60px;
    z-index: 100;

    img {
      width: 200px;
    }
  }
  .panel-title {
    background: url('/assets/images/panel.webp') no-repeat center transparent;
    background-size: contain;
    padding: 80px 120px 72px;
    position: relative;
    margin-bottom: 30px;

    &-shadow {
      position: absolute;
      width: 70%;
      height: 20%;
      background: #000;
      opacity: 0.2;
      border-radius: 50%;
      bottom: 25px;
      left: 50%;
      transform: translate(-50%);
      filter: blur(5px);
    }
  }
  .title-3d-list {
    display: flex;
    gap: 10px;
  }
  .title-3d-wrap {
    position: relative;
    display: inline-block;
    line-height: 1;
    height: 0.83333333em;
    font-family: 'Utendo';
    font-size: 120px;
    text-transform: uppercase;
    font-weight: 500;
  }
  .title-3d {
    background: linear-gradient(0, #f15a24 40%, #6c0a12);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: #f15a24;
    position: relative;
    z-index: 2;
    -webkit-text-stroke: 1px #fbb03b;

    &-shadow {
      position: absolute;
      top: 3px;
      left: 0;
      color: rgba(39, 16, 7, 0.5);
      z-index: 1;
    }
  }
  .btn-game {
    padding: 0;
    width: 50px;
    height: 50px;
    border-radius: 15px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.6), 0 5px 0 0 #b25f11, 0 8px 0 0 rgba(0, 0, 0, 0.2);
    border-width: 2px;

    &:not(:disabled):active {
      box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.6);
      transform: translateY(5px);
    }

    .icon {
      &-home {
        background: url('/assets/images/home.png') center center no-repeat;
        background-size: 60%;
        width: 100%;
        height: 100%;
        display: block;
        position: relative;
        z-index: 2;
      }

      &-back {
        background: url('/assets/images/back.png') center center no-repeat;
        background-size: 60%;
        width: 100%;
        height: 100%;
        display: block;
        position: relative;
        z-index: 2;
      }
    }
  }
</style>
