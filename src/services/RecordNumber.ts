import { reactive, readonly } from 'vue';

const state = reactive({
  data: new Date(),
});

const updateData = (newValue: Date) => {
  state.data = newValue;
};

// Để giữ cho service không bị thay đổi từ bên ngoài, sử dụng readonly.
const service = {
  state: readonly(state),
  updateData,
};

export default service;
