<template>
  <div class="wrap">
    <div style="margin: auto">
      <div class="game-title">
        <span>Lô Tô Night in Hội An</span>
      </div>
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px">
      <div>
        <div
          v-if="historyLotoNumberList"
          class="history-spinner"
        >
          <div
            v-for="(number, index) in historyLotoNumberList"
            :key="index"
          >
            <span class="__number">{{ number }}</span>
          </div>
        </div>
      </div>
      <div
        class="number-list"
        style="margin: 60px 0"
      >
        <div class="numbers-spinner">
          <div class="numbers-reel">
            <NumberReel
              v-for="ti of poolNumbers"
              :key="ti"
              :title="ti.toString()"
            />
          </div>
        </div>
        <div style="display: flex; gap: 30px">
          <button
            class="btn-game"
            :disabled="isSpinning"
            @click="startSpin()"
          >
            <span class="game-text">
              <span class="game-text-main">Spin</span>
              <span class="game-text-shadow">Spin</span>
            </span>
          </button>
          <button
            class="btn-game"
            :disabled="isSpinning"
            @click="resetGame()"
          >
            <span class="game-text">
              <span class="game-text-main">Reset</span>
              <span class="game-text-shadow">Reset</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeMount, onMounted, ref, watch } from 'vue';
  import NumberReel from '../components/NumberReel.vue';
  import { LOTO_NUMBER } from '../constants';
  import recordNumber from '../services/RecordNumber';
  import { getDataFromLocalStorage, storeDataToLocalStorage } from '../utils';

  const audioBackground = new Audio('/assets/sounds/spin-the-wheel.mp3');

  const historyLotoNumberList = ref<number[]>();

  const numbers = ref(Array.from({ length: 99 }, (_, index) => index + 1));
  const poolNumbers = ref(['???']);
  let existPrizeNumber: number[] = [];

  const isSpinning = ref(false);

  let numberSpinners: NodeListOf<HTMLElement>;

  // Fisher-Yates shuffle algorithm
  for (let i = numbers.value.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers.value[i], numbers.value[j]] = [numbers.value[j], numbers.value[i]];
  }

  const watchDataChanges = () => {
    return watch(
      () => recordNumber.state.data,
      () => {
        historyPrize();
      }
    );
  };

  onBeforeMount(() => {
    historyPrize();
  });

  onMounted(() => {
    watchDataChanges();
    numberSpinners = document.querySelectorAll<HTMLElement>('.numbers-spinner');

    init();
  });

  try {
    const checkLotoNumber: number[] = JSON.parse(getDataFromLocalStorage(LOTO_NUMBER) || '[]');

    if (checkLotoNumber.length > 0) {
      existPrizeNumber = checkLotoNumber;
    }
  } catch (error) {
    console.error(error);
  }

  function historyPrize() {
    const checkPrizeNumber: number[] = JSON.parse(getDataFromLocalStorage(LOTO_NUMBER) || '[]');
    historyLotoNumberList.value = checkPrizeNumber;
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
        numbersReel?.addEventListener('transitionend', () => transitionSpinning(numbersReel));
      }

      poolNumbers.value = pool;

      if (numbersReel) {
        numbersReel.style.transform = `translateY(-${numberSpinner.clientHeight * (pool.length - 1)}px)`;

        setTimeout(() => {
          numbersReel.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
        });
      }
    } else {
      poolNumbers.value = pool;
    }
  }

  function transitionSpinning(numbersReel: HTMLElement) {
    const firstNumberReel = numbersReel.querySelector<HTMLElement>('.number-reel:nth-child(1)');
    let prizeNumber: number[] = [];

    prizeNumber = [...existPrizeNumber];

    prizeNumber.push(Number(firstNumberReel?.dataset.number));

    storeDataToLocalStorage(LOTO_NUMBER, prizeNumber);

    audioBackground.pause(); // Reset background audio
    isSpinning.value = false; // Enable button
    numbersReel.style.transitionDuration = '0s'; // Reset duration time

    recordNumber.updateData(new Date());
  }

  function startSpin(index = 0) {
    executeCheckPrizeNumber();

    audioBackground.currentTime = 0;
    audioBackground.play();
    isSpinning.value = true;

    const numberSpinner = numberSpinners[index];
    const numbersReel = numberSpinner.querySelector<HTMLElement>('.numbers-reel');

    if (!numberSpinner.dataset.spinned) {
      numberSpinner.dataset.spinned = 'true';
      init(5, index, true);
    } else {
      init(5, index, false);
    }

    if (numbersReel) {
      setTimeout(() => {
        numbersReel.style.transform = 'translateY(0)';
      }, 500);
    }
  }

  function executeCheckPrizeNumber() {
    const checkLotoNumber: number[] = JSON.parse(getDataFromLocalStorage(LOTO_NUMBER) || '[]');

    if (checkLotoNumber.length > 0) {
      existPrizeNumber = checkLotoNumber;
    }
  }

  function getAllExistNumber() {
    executeCheckPrizeNumber();

    if (!existPrizeNumber) {
      return;
    }

    const a: number[] = existPrizeNumber.flat() as number[];
    // const b: number[] = a.map((ai) => Number(ai));

    return a;
  }

  function shuffleArray([...arr]) {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  }

  function resetGame() {
    if (confirm('Bạn có muốn reset game?') === false) return;

    localStorage.removeItem(LOTO_NUMBER);
    recordNumber.updateData(new Date());
  }
</script>

<style scoped lang="scss">
  .wrap {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    text-align: center;
    padding: 60px 0;
  }

  .history-spinner {
    font-family: 'Bungee', cursive;
    text-shadow: 0 5px 1px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-wrap: wrap;
    margin: 60px 0;
    gap: 20px;
    width: 480px;

    > div {
      width: 80px;
      height: 80px;
      border-radius: 80px;
      box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.6), 0 5px 0 0 #a42b37, 0 8px 0 0 rgba(0, 0, 0, 0.2);
      background: #f74455;
      border: 6px solid #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .__number {
      font-size: 36px;
      line-height: 40px;
      color: #fffa5c;
    }
  }
  .game-title {
    font-family: 'Phat Tai';
    font-size: 6rem;
    color: #f74455;
    position: relative;
    -webkit-text-stroke-width: 4px;
    -webkit-text-stroke-color: #fdffda;
    letter-spacing: 10px;
    margin-top: 80px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 25px;
    border: 2px solid #fdffda;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
    padding: 20px 40px 32px 55px;
    text-shadow: 1px 1px 1px #3d3d3d, 1px 2px 1px #3d3d3d, 1px 3px 1px #3d3d3d, 1px 4px 1px #3d3d3d, 1px 5px 1px #3d3d3d,
      1px 6px 1px #3d3d3d, 1px 7px 1px #3d3d3d, 1px 8px 1px #3d3d3d, 1px 9px 1px #3d3d3d, 1px 10px 1px #3d3d3d;
  }
  .btn-game {
    margin-top: 30px;
    padding: 10px 20px 10px 25px;
    border-radius: 20px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.6), 0 5px 0 0 #a42b37, 0 8px 0 0 rgba(0, 0, 0, 0.2);
    border-width: 2px;

    &:not(:disabled):active {
      box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.6);
      transform: translateY(5px);
    }
  }
</style>

<style lang="scss">
  .numbers-spinner {
    width: 400px;
    height: 400px;
    font-family: 'Arco';
    font-size: 180px;
    letter-spacing: 5px;
    line-height: 1;
    overflow: hidden;
    position: relative;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 60px;
    border: 10px solid #ffc12f;
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
