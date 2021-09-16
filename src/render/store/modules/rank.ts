import { getIndexInfo } from '@/api';
import { Book } from 'src/typings/interface';

const RankModule = {
  namespaced: true,
  state: () => ({
    ranks: []
  }),
  mutations: {
    ranks: (state, data) => {
      state.ranks = data;
    }
  },
  actions: {
    init: async ({ commit }) => {
      const res = await getIndexInfo();
      const ranks = parse(res);
      commit('ranks', ranks);
    }
  },
  getters: {}
};

const parse = (data: any) => {
  console.log('开始格式化模块...');
  const lists: any = [];
  // const newBooks: Book[] = [];
  // const upBooks: Book[] = [];
  const pushBooks = (books: Book[], book: any) => {
    books.push({
      book_id: book['book_id'],
      book_name: book['book_name'],
      cover: book['cover'],
      category: book['category_index'],
      description: book['description'],
      author: book['author_name']
    });
  };
  //格式化最新书籍列表
  // data['new_book_list'].forEach((book) => {
  //   pushBooks(newBooks, book);
  // });
  // lists.push({
  //   title: '最近上架',
  //   introduce: '最近上架的书籍',
  //   books: newBooks
  // });
  //格式化最近更新书籍
  // data['up_book_list'].forEach((book) => {
  //   pushBooks(upBooks, book);
  // });
  // lists.push({
  //   title: '最近更新',
  //   introduce: '最近更新的书籍',
  //   books: upBooks
  // });
  //格式化书籍模块
  for (const module of data['module_list']) {
    //调出不具有书籍的模块
    if (
      module['module_type'] === '14' ||
      module['module_type'] === '10' ||
      module['module_type'] === '11'
    )
      continue;
    const booksModule = {};
    //模块标题
    const title = module['module_title'];
    const introduce = module['module_introduce'];
    const books: Book[] = [];
    Object.values(module).forEach((m: any) => {
      if (typeof m === 'object') {
        if (m instanceof Array) {
          m.forEach((book) => {
            pushBooks(books, book);
          });
        } else {
          Object.values(m).forEach((n: any) => {
            if (n instanceof Array) {
              n.forEach((book) => {
                pushBooks(books, book);
              });
            }
          });
        }
      }
    });
    booksModule['title'] = title;
    booksModule['introduce'] = introduce;
    booksModule['books'] = books;
    lists.push(booksModule);
  }
  return lists;
};

export default RankModule;
