<template>
  <div class="btn-wrap">
    <button
      class="btn-game"
      @click="$router.push('/lotto')"
    >
      <span class="game-text">
        <span class="game-text-main">Lotto Game</span>
        <span class="game-text-shadow">Lotto Game</span>
      </span>
    </button>
    <button
      class="btn-game"
      @click="$router.push('/jackpot')"
    >
      <span class="game-text">
        <span class="game-text-main">Jackpot</span>
        <span class="game-text-shadow">Jackpot</span>
      </span>
    </button>
  </div>
</template>

<style scoped lang="scss">
  .btn-wrap {
    display: flex;
    flex-direction: column;
    gap: 40px;
    margin-top: 60px;
  }
</style>
