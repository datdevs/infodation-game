<template>
  <div
    class="number-reel"
    :data-number="title"
  >
    <span class="game-text">
      <span class="game-text-main">{{ title }}</span>
      <span class="game-text-main-flash">{{ title }}</span>
      <span class="game-text-shadow">{{ title }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    title: String,
  });
</script>

<style scoped lang="scss">
  .number-reel {
    width: 100%;
    height: 400px - 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #b80000;
  }
  .game-text {
    -webkit-text-stroke: unset;

    &-main {
      -webkit-text-stroke: 2px #ffd640;

      &-flash {
        position: absolute;
        background: linear-gradient(
          0,
          rgba(255, 255, 255, 0.05) 2%,
          rgba(255, 255, 255, 0.3) 50%,
          rgba(255, 255, 255, 0.05) 98%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        color: rgba(255, 255, 255, 0.2);
        clip-path: polygon(0 0, 100% 0, 100% 40%, 0 57%);
        // clip-path: polygon(100% 19%, 100% 55%, 0 78%, 0 44%);
        top: 0;
        left: 0;
        z-index: 3;
      }
    }

    &-shadow {
      left: 3px;
    }
  }
</style>
