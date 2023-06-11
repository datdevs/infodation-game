<template>
  <div>
    <div
      v-if="checkExistConfig()"
      class="prize-nav"
    >
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
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeMount, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { Prize, PrizeConfig } from '../models/prize-config';
  import { getDataFromLocalStorage } from '../utils';
  import { PRIZE_CONFIG } from '../constants';

  const router = useRouter();
  const prizeList = ref<Prize[]>();

  onBeforeMount(() => {
    checkExistConfig();
  });

  function checkExistConfig(): boolean {
    try {
      const prizeConfig: PrizeConfig = JSON.parse(getDataFromLocalStorage(PRIZE_CONFIG) || '{}');
      if (
        prizeConfig.hasOwnProperty('companyName') &&
        prizeConfig.hasOwnProperty('prizes') &&
        prizeConfig?.prizes?.length > 0
      ) {
        prizeList.value = prizeConfig.prizes;
        if (router.currentRoute.value.name === 'Jackpot Start') {
          return false;
        }
        router.push('/jackpot');
        return true;
      } else {
        router.push('/jackpot/config');
        return false;
      }
    } catch (error) {
      router.push('/jackpot/config');
      console.error(error);
      return false;
    }
  }
</script>

<style scoped lang="scss">
  .prize-nav {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 40px;
    align-items: center;
  }

  .btn-game {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    width: 200px;
    height: 200px;
    padding: 10px;

    &:not(:disabled):hover {
      transform: translateY(-10px);
    }

    &:not(:disabled):active {
      box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.6);
      transform: translateY(0);
    }
  }
</style>
