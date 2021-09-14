import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
import { Icon, PullRefresh } from 'vant';
import rankIcon from '@/assets/imgs/endless.png';
import freeIcon from '@/assets/imgs/loading.png';
import discountIcon from '@/assets/imgs/tag.png';
import listIcon from '@/assets/imgs/device.png';

import styles from '@/style/rank.module.scss';
import { useStore } from 'vuex';
import { Rank } from 'src/typings/interface';

export default defineComponent({
  components: {
    [PullRefresh.name]: PullRefresh,
    [Icon.name]: Icon
  },
  setup() {
    const store = useStore();
    const active = ref(0);
    const state = reactive({
      count: 0,
      loading: false,
      ranks: computed(() => store.state.rank.ranks),
      icons: {
        rankIcon,
        freeIcon,
        discountIcon,
        listIcon
      }
    });
    onMounted(() => {
      console.log('初始化排行');
      store.dispatch('rank/init', {});
      setTimeout(() => {
        console.log(store);
      }, 5000);
    });
    const onRefresh = async () => {
      // setTimeout(() => {
      //   Toast('刷新成功')
      //   state.loading = false
      //   state.count++
      // }, 1000)
      state.loading = false;
    };
    return { state, onRefresh, active };
  },

  render() {
    return (
      <>
        <div class={styles.page}>
          <div class={styles.toolBar}>
            <div class={styles.title}> 在线书城 </div>
            <div class={styles.menus}></div>
          </div>
          <PullRefresh
            modelValue={this.state.loading}
            onRefresh={this.onRefresh}
            class={styles.pullWrapper}
          >
            <div class={styles.menus}>
              <div
                class={styles.menu}
                style={{
                  background: 'rgb(87 169 154 / 20%)'
                }}
              >
                <img
                  style={{
                    filter:
                      'invert(54%) sepia(3%) saturate(5640%) hue-rotate(120deg) brightness(115%) contrast(71%)'
                  }}
                  class={styles.icon}
                  src={this.state.icons.rankIcon}
                  alt=""
                />
                <div
                  class={styles.menuText}
                  style={{
                    color: '#57A99A'
                  }}
                >
                  排行
                </div>
              </div>
              <div
                class={styles.menu}
                style={{
                  background: 'rgb(255 77 77 / 20%)'
                }}
              >
                <img
                  style={{
                    filter:
                      'invert(63%) sepia(60%) saturate(5372%) hue-rotate(330deg) brightness(100%) contrast(103%)'
                  }}
                  class={styles.icon}
                  src={this.state.icons.freeIcon}
                  alt=""
                />
                <div
                  class={styles.menuText}
                  style={{
                    color: '#FF4D4D'
                  }}
                >
                  免费
                </div>
              </div>
              <div
                class={styles.menu}
                style={{
                  background: 'rgb(30 175 237 / 20%)'
                }}
              >
                <img
                  style={{
                    filter:
                      'invert(54%) sepia(93%) saturate(1301%) hue-rotate(165deg) brightness(96%) contrast(92%)'
                  }}
                  class={styles.icon}
                  src={this.state.icons.discountIcon}
                  alt=""
                />
                <div
                  class={styles.menuText}
                  style={{
                    color: '#1EAFED'
                  }}
                >
                  折扣
                </div>
              </div>
              <div
                class={styles.menu}
                style={{
                  background: 'rgb(255 180 0 / 20%)'
                }}
              >
                <img
                  style={{
                    filter:
                      'invert(58%) sepia(99%) saturate(750%) hue-rotate(0deg) brightness(107%) contrast(104%)'
                  }}
                  class={styles.icon}
                  src={this.state.icons.listIcon}
                  alt=""
                />
                <div
                  class={styles.menuText}
                  style={{
                    color: '#FFB400'
                  }}
                >
                  书单
                </div>
              </div>
            </div>
            {this.state.ranks.map((rank: Rank) => (
              <div class={styles.ranks}>
                <div class={styles.rankHeader}>
                  <div class={styles.title}> {rank.title} </div>
                  <div class={styles.all}> 全部 </div>
                  <Icon name="arrow" class={styles.icon} />
                </div>
                <div class={styles.booksWrapper}>
                  {rank.books.slice(0, 3).map((book) => (
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
            ))}
          </PullRefresh>
        </div>
      </>
    );
  }
});
