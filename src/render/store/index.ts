import { state } from './state';
import { createStore } from 'vuex';
import ShelfModule from './modules/shelf';
import ReaderModule from './modules/reader';

export default createStore({
  state,
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    shelf: ShelfModule,
    reader: ReaderModule
  }
});
