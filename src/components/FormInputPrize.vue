<template>
  <form
    class="config-form"
    @submit.prevent="savePrizeConfig"
  >
    <input
      v-model="companyName"
      class="input-game"
      placeholder="Tên công ty"
      required
    />
    <div
      v-for="(prize, index) in prizes"
      :key="index"
      class="prize-list"
    >
      <span class="prize-label">Giải {{ index + 1 }}: {{ prize.name }}</span>
      <input
        v-model="prize.name"
        class="input-game"
        placeholder="Tên giải"
        required
      />
      <input
        v-model="prize.numberOfPrize"
        class="input-game"
        type="number"
        placeholder="Số lượng giải"
        required
      />
      <input
        v-model="prize.prizeInfo.name"
        class="input-game"
        placeholder="Phần thưởng nhận được"
        required
      />
      <!-- <input class="input-game" v-model="prize.prizeInfo.image" placeholder="URL Image of prize (optional)" /> -->
      <button
        class="btn-game remove"
        @click.prevent="removePrize(index)"
      >
        <span class="game-text">
          <span class="game-text-main">Xóa</span>
          <span class="game-text-shadow">Xóa</span>
        </span>
      </button>
    </div>
    <button
      class="btn-game"
      @click.prevent="addMorePrizes"
    >
      <span class="game-text">
        <span class="game-text-main">Thêm giải</span>
        <span class="game-text-shadow">Thêm giải</span>
      </span>
    </button>
    <button
      class="btn-game"
      :disabled="prizes.length === 0"
    >
      <span class="game-text">
        <span class="game-text-main">Lưu lại</span>
        <span class="game-text-shadow">Lưu lại</span>
      </span>
    </button>
  </form>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { PRIZE_CONFIG } from '../constants';
  import { Prize, PrizeConfig } from '../models/prize-config';
  import { storeDataToLocalStorage } from '../utils';

  const companyName = ref('');
  const prizes = ref<Prize[]>([]);
  const router = useRouter();

  function addMorePrizes() {
    prizes.value.push({
      name: '',
      numberOfPrize: NaN,
      prizeInfo: {
        name: '',
        image: '',
      },
    });
  }

  function removePrize(index: number) {
    prizes.value.splice(index, 1);
  }

  function savePrizeConfig() {
    const prizeConfig: PrizeConfig = {
      companyName: companyName.value,
      prizes: prizes.value,
    };
    storeDataToLocalStorage(PRIZE_CONFIG, prizeConfig);
    router.push('/jackpot');
  }
</script>

<style scoped lang="scss">
  .config-form {
    display: flex;
    flex-direction: column;
    gap: 30px;
    width: 500px;
  }

  .btn-game {
    padding: 10px 30px;
    border-radius: 30px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.6), 0 8px 0 0 #a42b37, 0 10px 0 0 rgba(0, 0, 0, 0.2);
    border-width: 4px;

    &.remove {
      background: #ff3e3d;
      box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.6), 0 8px 0 0 #a72626, 0 10px 0 0 rgba(0, 0, 0, 0.2);

      &::before {
        background: #a72626;
      }
    }

    &:not(:disabled):active {
      box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.6);
      transform: translateY(8px);
    }
  }

  .prize-list {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .prize-label {
    font-family: 'One Day';
    font-size: 30px;
  }
</style>
