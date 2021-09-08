import { getShelfBookList, getShelfList } from '@/api';

const ShelfModule = {
  namespaced: true,
  state: () => ({
    loading: true,
    shelfs: [],
    shelfPage: 0,
    currentShelf: {},
    currentBooks: []
  }),
  mutations: {
    shelfs: (state, arr) => {
      state.shelfs = arr;
    },
    books: (state, data) => {
      const { books, page } = data;
      state.shelfPage = page;
      // state.currentBooks = state.currentBooks.concat(books);
      state.currentBooks = books;
      state.loading = false;
      console.log(state);
    }
  },
  actions: {
    init: async ({ dispatch, state }, query) => {
      console.log('---begin init---');
      state.loading = true;
      await dispatch('getShelfs');
      dispatch('getBooks', query);
    },
    getShelfs: async ({ commit }) => {
      const res = await getShelfList();
      commit('shelfs', res.shelf_list);
    },
    getBooks: async ({ state, commit }, query) => {
      const { currentShelf, page } = query;
      const res = await getShelfBookList(state.shelfs[currentShelf].shelf_id, page);
      commit('books', {
        books: res.book_list,
        page
      });
    }
  },
  getters: {}
};

export default ShelfModule;
