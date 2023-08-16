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
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 60px;
  }

  .btn-game {
    width: 500px;
    height: 200px;
    font-size: 3em;
  }
</style>
