import { state } from './state';
import { createStore } from 'vuex';
import { SHELF } from './const';
import { getShelfList } from '@/api';

export default createStore({
  state,
  getters: {
    shelfList: (state) => {
      state.shelf.list;
    }
  },
  mutations: {
    [SHELF]: (state, data) => {
      state.shelf = data;
    }
  },
  actions: {
    getShelfs: async ({ commit, state }) => {
      const res = await getShelfList();
      state[SHELF].list = res.shelf_list;
      commit('shelf/list', res.shelf_list);
    }
  },
  modules: {}
});
