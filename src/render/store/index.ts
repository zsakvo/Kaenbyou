import { state } from './state';
import { createStore } from 'vuex';
import ShelfModule from './modules/Shelf';

export default createStore({
  state,
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    shelf: ShelfModule
  }
});
