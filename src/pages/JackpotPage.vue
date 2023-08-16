<template>
  <div class="wrap">
    <div
      v-if="historyPrizeList"
      class="history-pinner"
    >
      <h4>Danh sách trúng giải</h4>
      <div
        v-for="(h, index) in historyPrizeList"
        :key="index"
      >
        <span>{{ getPrizeName(h) }}</span>
        <div
          v-for="(n, indexN) in reverseHistoryNumber(h)"
          :key="indexN"
        >
          <span class="__number">{{ n }}</span>
        </div>
      </div>
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

<script setup lang="ts">
  import { onBeforeMount, onMounted, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { PRIZE_CONFIG, PRIZE_NUMBER } from '../constants';
  import { Prize, PrizeConfig } from '../models/prize-config';
  import recordNumber from '../services/RecordNumber';
  import { getDataFromLocalStorage } from '../utils';

  // const audioBackground = new Audio('/assets/sounds/nhac-xo-so.mp3');

  const router = useRouter();
  const prizeList = ref<Prize[]>();
  const historyPrizeList = ref<string[]>();
  const historyPrizeNumberList = ref<any>();

  const watchDataChanges = () => {
    return watch(
      () => recordNumber.state.data,
      () => {
        historyPrize();
      }
    );
  };

  onBeforeMount(() => {
    checkExistConfig();
    historyPrize();
  });

  onMounted(() => {
    watchDataChanges();

    // const promise = audioBackground.play();

    // if (promise !== undefined) {
    //   promise
    //     .then((_) => {
    //       console.log(_);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // }
  });

  // function playBackgroundMusic() {
  //   audioBackground.play();
  //   audioBackground.loop = true;
  // }

  function historyPrize() {
    const checkPrizeNumber = JSON.parse(getDataFromLocalStorage(PRIZE_NUMBER) || '{}');
    const historyPrizeListCheck = Object.keys(checkPrizeNumber);

    if (historyPrizeListCheck.length > 0) {
      historyPrizeListCheck.sort();

      historyPrizeList.value = historyPrizeListCheck;
      historyPrizeNumberList.value = checkPrizeNumber;
    }
  }

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

  function getPrizeName(key: string) {
    if (!prizeList.value || key === undefined) return '';

    const checkUndefined: string | undefined = key.split('_').pop();

    if (checkUndefined === undefined) return '';

    return prizeList.value[Number(checkUndefined)].name;
  }

  function reverseHistoryNumber(key: string) {
    return historyPrizeNumberList.value[key].slice().reverse();
  }
</script>

<style scoped lang="scss">
  .wrap {
    display: flex;
    align-items: center;
    // justify-content: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    text-align: center;
  }

  .history-pinner {
    position: fixed;
    z-index: 100;
    top: 30px;
    right: 30px;
    text-align: right;
    text-transform: uppercase;
    font-family: 'Bungee', cursive;
    text-shadow: 0 5px 1px rgba(0, 0, 0, 0.2);

    h4 {
      font-size: 20px;
    }

    span {
      font-size: 22px;
    }

    .__number {
      font-size: 36px;
      line-height: 40px;
      color: #fffa5c;
    }
  }
</style>
