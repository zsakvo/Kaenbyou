import { defineComponent, nextTick, onMounted, reactive, ref } from 'vue';
import { Icon } from 'vant';
import rankIcon from '@/assets/imgs/endless.png';
import freeIcon from '@/assets/imgs/loading.png';
import discountIcon from '@/assets/imgs/tag.png';
import listIcon from '@/assets/imgs/device.png';

import styles from '@/style/rank.module.scss';
import { useStore } from 'vuex';
import { Book } from 'src/typings/interface';
import BScroll, { ScrollBar } from 'better-scroll';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  components: {
    [Icon.name]: Icon
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const active = ref(0);
    const pullWrapper = ref(null);
    const route = useRoute();
    BScroll.use(ScrollBar);
    // let scroll;
    const state = reactive({
      title: '书籍列表',
      count: 0,
      loading: false,
      books: [] as Book[],
      icons: {
        rankIcon,
        freeIcon,
        discountIcon,
        listIcon
      }
    });
    onMounted(async () => {
      console.log('初始化排行');
      console.log(route.query.title);
      store.state.rank.ranks.forEach((r) => {
        if (r.title === route.query.title) {
          state.title = r.title;
          state.books = r.books;
        }
      });
      await nextTick();
      new BScroll(pullWrapper.value as any, {
        scrollY: true,
        scrollbar: true
      });
    });
    const onRefresh = async () => {
      state.loading = false;
    };
    const toModuleAll = (rank) => {
      console.log('跳转全部');
      console.log(rank);
    };
    const goBack = () => {
      router.go(-1);
    };
    return { state, onRefresh, active, pullWrapper, toModuleAll, goBack };
  },

  render() {
    return (
      <>
        <div class={styles.page}>
          <div class={styles.toolBar}>
            <div class={styles.title} onClick={() => this.goBack()}>
              {' '}
              {this.state.title}{' '}
            </div>
            <div class={styles.menus}></div>
          </div>
          <div
            class={styles.pullWrapper}
            ref="pullWrapper"
            style={{
              marginTop: '0',
              height: 'calc(100vh - 94px)'
            }}
          >
            <div class={styles.scrollable}>
              <div class={styles.ranks}>
                {' '}
                <div class={styles.booksWrapper}>
                  {this.state.books.map((book) => (
                    <div class={styles.bookCard}>
                      <div class={styles.cover}>
                        <img src={book.cover} alt="" />
                      </div>
                      <div class={styles.info}>
                        <div class={styles.name}>{book.bookName}</div>
                        <div class={styles.author}>{book.author}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
});
