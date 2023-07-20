<template>
  <div>
    <div class="prize-title">
      <span>{{ prizeName }}</span>
    </div>
    <div class="prize-info">
      <span>Phần thưởng: {{ prizeInfoName }}</span>
    </div>
    <div class="number-list">
      <div
        v-for="i of numberOfPrize"
        :id="'number-of-' + i"
        :key="i"
        class="number-lists"
      >
        <div class="numbers-spinner">
          <div class="numbers-reel">
            <NumberReel
              v-for="ti of poolNumbers[`pool_${i - 1}`]"
              :key="ti"
              :title="ti.toString()"
            />
          </div>
        </div>
        <div>
          <button
            class="btn-game"
            :disabled="isSpinning"
            @click="startSpin(i - 1)"
          >
            <span class="icon-spin"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import NumberReel from '../components/NumberReel.vue';
  import { PRIZE_CONFIG, PRIZE_NUMBER } from '../constants';
  import { PrizeConfig } from '../models/prize-config';
  import { getDataFromLocalStorage, storeDataToLocalStorage } from '../utils';

  const audioBackground = new Audio('/assets/sounds/number-background.mp3');

  const prizeName = ref();
  const numberOfPrize = ref();
  const prizeInfoName = ref();
  const router = useRouter();

  const numbers = ref(Array.from({ length: 140 }, (_, index) => index + 1));
  const poolNumbers = ref();
  let existPrizeNumber: any = null;

  const isSpinning = ref(false);

  let numberSpinners: NodeListOf<HTMLElement>;

  let isFirstSpin = true;

  // Fisher-Yates shuffle algorithm
  for (let i = numbers.value.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers.value[i], numbers.value[j]] = [numbers.value[j], numbers.value[i]];
  }

  onMounted(() => {
    numberSpinners = document.querySelectorAll<HTMLElement>('.numbers-spinner');

    init();
  });

  try {
    const prizeConfig: PrizeConfig = JSON.parse(getDataFromLocalStorage(PRIZE_CONFIG) || '{}');
    const checkPrizeNumber = JSON.parse(getDataFromLocalStorage(PRIZE_NUMBER) || '{}');

    if (
      prizeConfig.hasOwnProperty('companyName') &&
      prizeConfig.hasOwnProperty('prizes') &&
      prizeConfig?.prizes?.length > 0
    ) {
      const getPrize = prizeConfig.prizes[Number(router.currentRoute.value.params.id)];
      prizeName.value = getPrize.name;
      numberOfPrize.value = getPrize.numberOfPrize;
      prizeInfoName.value = getPrize.prizeInfo.name;
      for (let i = 0; i < numberOfPrize.value; i++) {
        poolNumbers.value = {
          [`pool_${i}`]: [],
        };
      }
    }

    if (Object.entries(checkPrizeNumber).length > 0) {
      existPrizeNumber = checkPrizeNumber;
    }
  } catch (error) {
    console.error(error);
  }

  function init(duration = 1, spinnerIndex?: number, isFirst?: boolean) {
    let pool = ['???'];

    if (spinnerIndex !== undefined) {
      const numberSpinner = numberSpinners[spinnerIndex];
      const numbersReel = numberSpinner.querySelector<HTMLElement>('.numbers-reel');
      const allExistNumber = getAllExistNumber();

      pool = [...shuffleArray(numbers.value)].filter((n) => !allExistNumber?.includes(n));
      pool.push('???');

      if (isFirst) {
        isFirstSpin = false;
        numbersReel?.addEventListener('transitionend', () => transitionSpinning(numbersReel, spinnerIndex));
      }

      poolNumbers.value[`pool_${spinnerIndex}`] = pool;

      if (numbersReel) {
        numbersReel.style.transform = `translateY(-${numberSpinner.clientHeight * (pool.length - 1)}px)`;

        setTimeout(() => {
          numbersReel.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
        });
      }
    } else {
      numberSpinners.forEach((_numberSpinner, index) => {
        if (existPrizeNumber && getExistPrizeNumber(index)) {
          poolNumbers.value[`pool_${index}`] = [getExistPrizeNumber(index)];
        } else {
          poolNumbers.value[`pool_${index}`] = pool;
        }
      });
    }
  }

  function transitionSpinning(numbersReel: HTMLElement, spinnerIndex: number) {
    const firstNumberReel = numbersReel.querySelector<HTMLElement>('.number-reel:nth-child(1)');
    const getPrizeIndex = Number(router.currentRoute.value.params.id);
    let prizeNumber = null;

    prizeNumber = {
      ...existPrizeNumber,
    };

    if (!existPrizeNumber?.hasOwnProperty(`prize_${getPrizeIndex}`)) {
      prizeNumber = Object.assign(prizeNumber, {
        [`prize_${getPrizeIndex}`]: [],
      });
    }

    prizeNumber[`prize_${getPrizeIndex}`][spinnerIndex] = firstNumberReel?.dataset.number;

    storeDataToLocalStorage(PRIZE_NUMBER, prizeNumber);

    audioBackground.pause(); // Reset background audio
    isSpinning.value = false; // Enable button
    numbersReel.style.transitionDuration = '0s'; // Reset duration time
  }

  function startSpin(index: number) {
    executeCheckPrizeNumber();

    if (getExistPrizeNumber(index)) {
      if (confirm('Bạn có muốn quay số khác?') === false) {
        return;
      }
    }

    audioBackground.currentTime = 0;
    audioBackground.play();
    isSpinning.value = true;

    if (isFirstSpin) {
      init(15, index, true);
    } else {
      init(15, index, false);
    }

    const numberSpinner = numberSpinners[index];
    const numbersReel = numberSpinner.querySelector<HTMLElement>('.numbers-reel');

    if (numbersReel) {
      setTimeout(() => {
        numbersReel.style.transform = 'translateY(0)';
      }, 500);
    }
  }

  function getExistPrizeNumber(indexNumberOfPrize: number) {
    const getPrizeIndex = Number(router.currentRoute.value.params.id);

    if (existPrizeNumber?.hasOwnProperty(`prize_${getPrizeIndex}`)) {
      if (existPrizeNumber[`prize_${getPrizeIndex}`].length > indexNumberOfPrize) {
        return existPrizeNumber[`prize_${getPrizeIndex}`][indexNumberOfPrize];
      }
    }
    return null;
  }

  function executeCheckPrizeNumber() {
    const checkPrizeNumber = JSON.parse(getDataFromLocalStorage(PRIZE_NUMBER) || '{}');

    if (Object.keys(checkPrizeNumber).length > 0) {
      existPrizeNumber = checkPrizeNumber;
    }
  }

  function getAllExistNumber() {
    executeCheckPrizeNumber();

    if (!existPrizeNumber) {
      return;
    }

    return Object.values(existPrizeNumber).flat();
  }

  function shuffleArray([...arr]) {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  }
</script>

<style scoped lang="scss">
  .prize-title,
  .prize-info {
    font-family: 'One Day';
    font-size: 38px;
    font-weight: bold;
    text-shadow: 0 5px 1px rgba(0, 0, 0, 0.2);
    letter-spacing: 5px;
    background: linear-gradient(0, hsla(33, 100%, 53%, 1) 0%, hsla(58, 100%, 68%, 1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: #f15a24;
    position: relative;
  }
  .number-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 50px;
    gap: 60px;
  }
  .btn-game {
    margin-top: 30px;
    padding: 0;
    width: 60px;
    height: 60px;
    border-radius: 15px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.6), 0 5px 0 0 #b25f11, 0 8px 0 0 rgba(0, 0, 0, 0.2);
    border-width: 2px;

    &:not(:disabled):active {
      box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.6);
      transform: translateY(5px);
    }

    &:not(:disabled):hover {
      .icon-spin {
        transform: rotate(180deg);
      }
    }

    .icon {
      &-spin {
        background: url('/assets/images/spin.png') center center no-repeat;
        background-size: 60%;
        width: 100%;
        height: 100%;
        display: block;
        position: relative;
        z-index: 2;
        transition: transform 0.5s ease;
      }
    }
  }
  .audio-background-wrap {
    display: none;
  }
</style>

<style lang="scss">
  .numbers-spinner {
    width: 200px;
    height: 200px;
    font-family: 'Arco';
    font-size: 82px;
    letter-spacing: 5px;
    line-height: 1;
    overflow: hidden;
    position: relative;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 35px;
    border: 8px solid #ffc12f;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2), 0 0 0 2px #fff, 0 5px 5px rgba(0, 0, 0, 0.2);
  }
  .numbers-reel {
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    top: 0;
    left: 0;
    right: 0;
    transition: transform 0s ease-in-out;
  }
</style>
