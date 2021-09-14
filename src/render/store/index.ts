import { state } from './state';
import { createStore } from 'vuex';
import ShelfModule from './modules/shelf';
import ReaderModule from './modules/reader';
import RankModule from './modules/rank';

export default createStore({
  state,
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    shelf: ShelfModule,
    reader: ReaderModule,
    rank: RankModule
  }
});
