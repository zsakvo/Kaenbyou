import { defineComponent, onMounted, reactive } from 'vue';
import { Cell, CellGroup } from 'vant';
import configIcon from '@/assets/imgs/config.png';
import coinIcon from '@/assets/imgs/coin.png';
import mailIcon from '@/assets/imgs/mail.png';
import historyIcon from '@/assets/imgs/history.png';
import followIcon from '@/assets/imgs/follow.png';
import fansIcon from '@/assets/imgs/fans.png';
import bookListIcon from '@/assets/imgs/book_list.png';
import styles from '@/style/user.module.scss';
import { getMyInfo } from '@/api';

export default defineComponent({
  name: 'User',
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup
  },
  setup() {
    const state = reactive({
      icons: {
        configIcon,
        coinIcon,
        mailIcon,
        historyIcon,
        followIcon,
        fansIcon,
        bookListIcon
      }
    });
    onMounted(() => {
      getMyInfo().then((res) => {
        console.log(res);
      });
    });
    return { state };
  },
  render() {
    return (
      <div class={styles.page}>
        <div class={styles.header}>
          <div class={styles.avatar}>
            <img src="https://avatars.githubusercontent.com/u/25399519?v=4" alt="" />
          </div>
          <div class={styles.info}>
            <div class={styles.name}>沚水</div>
            <div class={styles.lv}>Lv15.盖世豪杰</div>
          </div>
        </div>
        <div class={styles.dataBar}>
          <div class={styles.data}>
            <span class={styles.num}>20</span>
            <span class={styles.desc}>推荐票</span>
          </div>
          <div class={styles.data}>
            <span class={styles.num}>18</span>
            <span class={styles.desc}>月票</span>
          </div>
          <div class={styles.data}>
            <span class={styles.num}>18</span>
            <span class={styles.desc}>刀片</span>
          </div>
        </div>
        <div class={styles.coinBar}>
          <img class={styles.icon} src={this.state.icons.coinIcon} alt="" />

          <div class={styles.coin}>1000 猫饼干，800 代币</div>
        </div>
        <CellGroup class={styles.cellGroup} border={false}>
          <Cell
            clickable
            title="私信"
            icon={this.state.icons.mailIcon}
            class={styles.settingCell}
          />
          <Cell
            clickable
            title="足迹"
            icon={this.state.icons.historyIcon}
            class={styles.settingCell}
          />
          <Cell
            clickable
            title="关注"
            icon={this.state.icons.followIcon}
            class={styles.settingCell}
          />
          <Cell
            clickable
            title="粉丝"
            icon={this.state.icons.fansIcon}
            class={styles.settingCell}
          />
          <Cell
            clickable
            title="书单"
            icon={this.state.icons.bookListIcon}
            class={styles.settingCell}
          />
          <Cell
            clickable
            title="设置"
            icon={this.state.icons.configIcon}
            class={styles.settingCell}
          />
        </CellGroup>
      </div>
    );
  }
});
