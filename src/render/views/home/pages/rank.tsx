import { defineComponent, reactive, ref } from 'vue';
import { Icon, PullRefresh } from 'vant';
import { getIndexList } from '@/api';
import rankIcon from '@/assets/imgs/rank.png';
import freeIcon from '@/assets/imgs/free.png';
import discountIcon from '@/assets/imgs/discount.png';
import listIcon from '@/assets/imgs/list.png';

import styles from '@/style/rank.module.scss';

export default defineComponent({
  components: {
    [PullRefresh.name]: PullRefresh,
    [Icon.name]: Icon
  },
  setup() {
    const active = ref(0);
    const state = reactive({
      count: 0,
      loading: false,
      icons: {
        rankIcon,
        freeIcon,
        discountIcon,
        listIcon
      }
    });
    const onRefresh = async () => {
      // setTimeout(() => {
      //   Toast('刷新成功')
      //   state.loading = false
      //   state.count++
      // }, 1000)
      await getIndexList();
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
              <div class={styles.menu}>
                <div class={[styles.menuIcon, styles.menuIconRank]}>
                  <img src={this.state.icons.rankIcon} alt="" />
                </div>
                <div class={styles.menuText}>排行</div>
              </div>
              <div class={styles.menu}>
                <div class={[styles.menuIcon, styles.menuIconFree]}>
                  <img src={this.state.icons.freeIcon} alt="" />
                </div>
                <div class={styles.menuText}>免费</div>
              </div>
              <div class={styles.menu}>
                <div class={[styles.menuIcon, styles.menuIconDiscount]}>
                  <img src={this.state.icons.discountIcon} alt="" />
                </div>
                <div class={styles.menuText}>折扣</div>
              </div>
              <div class={styles.menu}>
                <div class={[styles.menuIcon, styles.menuIconList]}>
                  <img src={this.state.icons.listIcon} alt="" />
                </div>
                <div class={styles.menuText}>书单</div>
              </div>
            </div>
            <div class={styles.ranks}>
              <div class={styles.rankHeader}>
                <div class={styles.title}> 热度榜 </div>
                <div class={styles.all}> 全部 </div>
                <Icon name="arrow" class={styles.icon} />
              </div>
              <div class={styles.booksWrapper}>
                <div class={styles.bookCard}>
                  <div class={styles.cover}>
                    <img
                      src="https://c1.kuangxiangit.com/uploads/allimg/c200420/20-04-20105231-97332-100162990.jpg"
                      alt=""
                    />
                  </div>
                  <div class={styles.info}>
                    <div class={styles.name}>勇者爱丽丝的社会性死亡传说</div>
                    <div class={styles.author}>才不是 H 萝莉</div>
                  </div>
                </div>
              </div>
            </div>
          </PullRefresh>
        </div>
      </>
    );
  }
});
