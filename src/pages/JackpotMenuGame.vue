<template>
  <div class="prize-nav">
    <div
      v-for="(p, index) in prizeList"
      :key="index"
    >
      <router-link
        class="btn-game"
        :to="'/jackpot/start/' + index"
      >
        <span class="game-text">
          <span class="game-text-main">{{ p.name }}</span>
          <span class="game-text-shadow">{{ p.name }}</span>
        </span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeMount, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { PRIZE_CONFIG } from '../constants';
  import { Prize, PrizeConfig } from '../models/prize-config';
  import { getDataFromLocalStorage } from '../utils';

  const router = useRouter();
  const prizeList = ref<Prize[]>();

  onBeforeMount(() => {
    checkExistConfig();
  });

  function checkExistConfig() {
    try {
      const prizeConfig: PrizeConfig = JSON.parse(getDataFromLocalStorage(PRIZE_CONFIG) || '{}');
      if (
        prizeConfig.hasOwnProperty('companyName') &&
        prizeConfig.hasOwnProperty('prizes') &&
        prizeConfig?.prizes?.length > 0
      ) {
        prizeList.value = prizeConfig.prizes;
        if (router.currentRoute.value.name === 'Jackpot Start') {
        }
        router.push('/jackpot');
      } else {
        router.push('/jackpot/config');
      }
    } catch (error) {
      router.push('/jackpot/config');
      console.error(error);
    }
  }
</script>

<style scoped lang="scss">
  .prize-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 60px;
    margin: auto;
  }

  .btn-game {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4em;
    width: 400px;
    height: 400px;
    padding: 10px;
    border-width: 10px;
    border-radius: 60px;

    &:not(:disabled):hover {
      transform: translateY(-10px);
    }

    &:not(:disabled):active {
      box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.6);
      transform: translateY(0);
    }
  }
</style>
