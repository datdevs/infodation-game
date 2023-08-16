import { reactive, readonly } from 'vue';

const state = reactive({
  data: null,
});

const updateData = (newValue) => {
  state.data = newValue;
};

// Để giữ cho service không bị thay đổi từ bên ngoài, sử dụng readonly.
const service = {
  state: readonly(state),
  updateData,
};

export default service;
