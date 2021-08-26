import { defineComponent, onMounted, reactive, toRaw } from 'vue';
import { Tabbar, TabbarItem, PullRefresh } from 'vant';
import { getShelfBookList, getShelfList } from '@/api';

import { useRouter } from 'vue-router';
import styles from '@/style/shelf.module.scss';
// import { ipcRenderer } from 'electron';
const electron = window.require('electron');

export default defineComponent({
  name: 'Home',
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    [PullRefresh.name]: PullRefresh
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      page: 0,
      shelfId: 0,
      loading: false,
      noMore: false,
      shelfList: [],
      shelfBooks: []
    });
    onMounted(() => {
      initShelf().then(() => {
        electron.ipcRenderer.send('setShelfList', toRaw(state.shelfList));
      });
    });
    const initShelf = async () => {
      const res = await getShelfList();
      state.shelfList = res.shelf_list;
      const initShelf = state.shelfList[0] as any;
      state.shelfId = initShelf.shelf_id;
      await fetchBooks();
    };
    const onRefresh = async () => {
      state.page = 0;
      await getShelfList();
      state.loading = false;
    };
    const fetchBooks = async () => {
      const res = await getShelfBookList(state.shelfId, state.page);
      console.log(res);
      if (state.page === 0) {
        state.shelfBooks = res.book_list;
      } else {
        state.shelfBooks.concat(res.book_list);
      }
      electron.ipcRenderer.send('setShelfBooks', toRaw(state.shelfId), toRaw(state.shelfBooks));
    };

    const toReader = (book: any) => {
      const bid = book.book_info.book_id;
      const cid = book.last_read_chapter_id;
      router.push({
        name: 'Reader',
        query: {
          bid,
          cid
        },
        params: {
          bookName: book.book_info.book_name
        }
      });
    };
    return { state, onRefresh, toReader };
  },
  render() {
    return (
      <>
        <div class={styles.page}>
          <div class={styles.toolBar}>
            <div class={styles.title}> 我的书架 </div>
            <div class={styles.menus}></div>
          </div>
          <PullRefresh
            onRefresh={this.onRefresh}
            modelValue={this.state.loading}
            class={styles.pullWrapper}
          >
            {this.state.shelfBooks.map((book: any, index: number) => (
              <div class={styles.bookCard} key={index} onClick={() => this.toReader(book)}>
                <div class={styles.cover}>
                  <img src={book.book_info.cover} alt="" />
                </div>
                <div class={styles.info}>
                  <div class={styles.name}>{book.book_info.book_name}</div>
                  <div class={styles.author}>{book.book_info.author_name}</div>
                  <div class={styles.new}>{book.book_info.last_chapter_info.chapter_title}</div>
                </div>
              </div>
            ))}
          </PullRefresh>
        </div>
      </>
    );
  }
});
