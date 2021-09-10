const ReaderModule = {
  namespaced: true,
  state: () => ({
    showPopup: false,
    showCatalog: false
  }),
  mutations: {
    showPopup: (state) => {
      state.showPopup = true;
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
