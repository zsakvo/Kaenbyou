import {
  computed,
  defineComponent,
  nextTick,
  onActivated,
  onMounted,
  reactive,
  ref,
  watch
} from 'vue';
import { Tabbar, TabbarItem, PullRefresh, ActionSheet } from 'vant';

import switchIcon from '@/assets/imgs/switch.png';

import BScroll from '@better-scroll/core';
import ScrollBar from '@better-scroll/scroll-bar';
import PullDown from '@better-scroll/pull-down';

import { useRouter } from 'vue-router';
import styles from '@/style/shelf.module.scss';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'Home',
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    [PullRefresh.name]: PullRefresh,
    [ActionSheet.name]: ActionSheet
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const scrollWrapper = ref(null);
    const refresh = ref(null);
    const tipText = ref('');
    BScroll.use(ScrollBar);
    BScroll.use(PullDown);
    let scroll;
    const icons = {
      switch: switchIcon
    };
    const query = reactive({
      page: 0,
      currentShelf: 0
    });
    const state = reactive({
      loading: computed(() => store.state.shelf.loading),
      shelfs: computed(() => store.state.shelf.shelfs),
      currentBooks: computed(() => store.state.shelf.currentBooks),
      actionShow: false
    });
    const onRefresh = async () => {
      store.dispatch('shelf/init', query);
    };
    const PHASE = {
      moving: {
        enter: 'enter',
        leave: 'leave'
      },
      fetching: 'fetching',
      succeed: 'succeed'
    };
    const pullingDownHandler = async () => {
      setTipText(PHASE.fetching);
      await onRefresh();
      await nextTick();
    };
    const setTipText = (phase) => {
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
      // scroll.on('scrollEnd', () => {});
      // v2.4.0 supported
      scroll.on('enterThreshold', () => {
        setTipText(PHASE.moving.enter);
      });
      scroll.on('leaveThreshold', () => {
        setTipText(PHASE.moving.leave);
      });
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
    const onMenuItemSelect = (val) => {
      console.log('select menu item');
      state.actionShow = false;
      const index = state.shelfs.indexOf(val);
      query.currentShelf = index;
      store.dispatch('shelf/getBooks', query);
    };
    onMounted(() => {
      if (state.currentBooks.length > 0) initScroll();
      store.dispatch('shelf/init', query);
    });
    //监听刷新状态
    watch(
      () => state.loading,
      (val) => {
        console.log('---watch loading---');
        if (!val && scroll) {
          setTipText(PHASE.succeed);
          scroll.finishPullDown();
        }
      }
    );
    //监听书籍列表
    watch(
      () => state.currentBooks,
      async () => {
        await nextTick();
        // if (!scroll) {
        //   initScroll();
        // }
        scroll ? scroll.refresh() : initScroll();
      }
    );
    onActivated(() => {
      console.log('---onActivited---');
      if (state.currentBooks.length > 0) initScroll();
    });
    return {
      icons,
      state,
      onRefresh,
      toReader,
      scrollWrapper,
      refresh,
      scroll,
      tipText,
      onMenuItemSelect
    };
  },
  render() {
    return (
      <>
        <div class={styles.page}>
          <div class={styles.toolBar}>
            <div class={styles.title}> 我的书架 </div>
            <div class={styles.menus}>
              <img
                class={styles.menuIcon}
                src={this.icons.switch}
                onClick={() => {
                  this.state.actionShow = true;
                }}
              />
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
                {this.state.currentBooks.map((book: any, index: number) => (
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
        </div>
        <ActionSheet
          show={this.state.actionShow}
          actions={this.state.shelfs}
          round={false}
          onSelect={this.onMenuItemSelect}
          // @ts-ignore
          onClickOverlay={() => {
            this.state.actionShow = false;
          }}
        ></ActionSheet>
      </>
    );
  }
});
