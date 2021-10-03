import { computed, defineComponent, reactive } from 'vue';
import { Icon } from 'vant';

import styles from '@/style/tsukkomi.module.scss';
import { useStore } from 'vuex';
import { Itsukkomi } from 'src/typings/interface';

export default defineComponent({
  name: 'Tsukkomi',
  components: {
    [Icon.name]: Icon
  },
  props: {},
  setup() {
    const store = useStore();
    const state = reactive({
      tsukkomis: computed(() => store.state.reader.tsukkomis),
      pTxt: computed(() => store.state.reader.pTxt)
    });
    return { state };
  },
  render() {
    return (
      <div class={styles.wrapper}>
        <div class={styles.title}>共{this.state.tsukkomis.length}条评论</div>
        <div class={styles.txtWrapper}>
          <div class={styles.txt}>{this.state.pTxt}</div>
        </div>
        <div class={styles.listWrapper}>
          {this.state.tsukkomis.map((tsukkomi: Itsukkomi) => {
            return (
              <div class={styles.tsukkomi}>
                <div class={styles.avatar}>
                  <img
                    src={
                      tsukkomi.reader_info.avatar_thumb_url ||
                      'https://pic1.zhimg.com/da8e974dc_xll.jpg'
                    }
                  />
                </div>
                <div class={styles.textWrapper}>
                  <div class={styles.userName}>{tsukkomi.reader_info.reader_name}</div>
                  <div class={styles.content}>{tsukkomi.tsukkomi_content}</div>
                  <div class={styles.extra}>
                    <div>
                      {tsukkomi.member_lou + 'L'} · {tsukkomi.ctime}
                    </div>
                    <div class={styles.praise}>
                      <Icon name="good-job-o" class={styles.icon} />
                      <div class={styles.num}>{tsukkomi.like_amount}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
});
