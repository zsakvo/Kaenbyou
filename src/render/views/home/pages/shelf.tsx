import { defineComponent, nextTick, onMounted, reactive, ref } from 'vue';
import { Tabbar, TabbarItem, PullRefresh } from 'vant';
import { getShelfBookList, getShelfList } from '@/api';

import switchIcon from '@/assets/imgs/switch.png';

import BScroll from '@better-scroll/core';
import ScrollBar from '@better-scroll/scroll-bar';
import PullDown from '@better-scroll/pull-down';

import { useRouter } from 'vue-router';
import styles from '@/style/shelf.module.scss';

export default defineComponent({
  name: 'Home',
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    [PullRefresh.name]: PullRefresh
  },
  setup() {
    const router = useRouter();
    BScroll.use(ScrollBar);
    BScroll.use(PullDown);
    const icons = {
      switch: switchIcon
    };
    const state = reactive({
      page: 0,
      shelfId: 0,
      loading: true,
      noMore: false,
      shelfList: [],
      shelfBooks: []
    });
    const scrollWrapper = ref(null);
    const refresh = ref(null);
    let scroll;
    onMounted(() => {
      initShelf();
    });
    const initShelf = async () => {
      const res = await getShelfList();
      state.shelfList = res.shelf_list;
      const initShelf = state.shelfList[0] as any;
      state.shelfId = initShelf.shelf_id;
      await fetchBooks();
    };
    const onRefresh = async () => {
      state.loading = true;
      state.page = 0;
      await getShelfList();
      state.loading = false;
    };
    const PHASE = {
      moving: {
        enter: 'enter',
        leave: 'leave'
      },
      fetching: 'fetching',
      succeed: 'succeed'
    };
    const tipText = ref('');
    const pullingDownHandler = async () => {
      setTipText(PHASE.fetching);
      await onRefresh();
      await nextTick();
      setTipText(PHASE.succeed);
      scroll.finishPullDown();
    };
    const setTipText = (phase) => {
      console.log('phase', phase);
      const TEXTS_MAP = {
        enter: '下拉刷新',
        leave: '松手刷新',
        fetching: '正在读取数据',
        succeed: '刷新成功'
      };
      tipText.value = TEXTS_MAP[phase];
    };
    const initScroll = () => {
      scroll = new BScroll(scrollWrapper.value as any, {
        scrollY: true,
        scrollbar: true,
        pullDownRefresh: {
          threshold: 90,
          stop: 45
        }
      });
      scroll.on('pullingDown', pullingDownHandler);
      scroll.on('scrollEnd', (e) => {
        console.log('scrollEnd', e);
      });
      // v2.4.0 supported
      scroll.on('enterThreshold', () => {
        setTipText(PHASE.moving.enter);
      });
      scroll.on('leaveThreshold', () => {
        setTipText(PHASE.moving.leave);
      });
    };
    const fetchBooks = async () => {
      const res = await getShelfBookList(state.shelfId, state.page);
      console.log(res);
      if (state.page === 0) {
        state.shelfBooks = res.book_list;
      } else {
        state.shelfBooks.concat(res.book_list);
      }
      await nextTick();
      console.log('books--->', scrollWrapper.value);
      // const wrapper = document.querySelector('._pull-wrapper_1nvvv_29');
      initScroll();
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
    return { icons, state, onRefresh, toReader, scrollWrapper, refresh, scroll, tipText };
  },
  render() {
    return (
      <>
        <div class={styles.page}>
          <div class={styles.toolBar}>
            <div class={styles.title}> 我的书架 </div>
            <div class={styles.menus}>
              <img class={styles.menuIcon} src={this.icons.switch} alt="" />
            </div>
          </div>
          {/* <PullRefresh
            onRefresh={this.onRefresh}
            modelValue={this.state.loading}
            class={styles.pullWrapper}
            successText="刷新成功"
            ref="refresh"
          > */}
          <div class={styles.pullWrapper} ref="scrollWrapper">
            <div class="pulldown-scroller">
              <div class={styles.pulldownWrapper}>
                <div>{this.tipText}</div>
              </div>
              <div class={styles.books}>
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
              </div>
            </div>
          </div>

          {/* </PullRefresh> */}
        </div>
      </>
    );
  }
});
