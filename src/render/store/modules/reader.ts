const ReaderModule = {
  namespaced: true,
  state: () => ({
    showPopup: false,
    showCatalog: false
  }),
  mutations: {
    showPopup: (state) => {
      console.log('尝试显示双兰');
      state.showPopup = true;
      console.log(state);
      console.log('尝试完毕');
    },
    hidePopup: (state) => {
      state.showPopup = false;
    },
    showCatalog: (state) => {
      state.showPopup = false;
      state.showCatalog = true;
    },
    hideCatalog: (state) => {
      state.showCatalog = false;
    }
  },
  actions: {},
  getters: {}
};

export default ReaderModule;
