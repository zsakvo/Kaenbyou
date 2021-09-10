const ReaderModule = {
  namespaced: true,
  state: () => ({
    showPopup: false
  }),
  mutations: {
    showPopup: (state) => {
      state.showPopup = true;
    },
    hidePopup: (state) => {
      state.showPopup = false;
    }
  },
  actions: {},
  getters: {}
};

export default ReaderModule;
