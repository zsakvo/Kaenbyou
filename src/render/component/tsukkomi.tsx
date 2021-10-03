import { computed, defineComponent, onMounted, onUpdated, reactive, ref } from 'vue';
import { Icon } from 'vant';

import styles from '@/style/tsukkomi.module.scss';
import { useStore } from 'vuex';
import { Itsukkomi } from 'src/typings/interface';
import BScroll from 'better-scroll';

export default defineComponent({
  name: 'Tsukkomi',
  components: {
    [Icon.name]: Icon
  },
  props: {},
  setup() {
    const store = useStore();
    const scrollWrapper = ref(null);
    let scroller: BScroll;
    const state = reactive({
      tsukkomis: computed(() => store.state.reader.tsukkomis),
      pTxt: computed(() => store.state.reader.pTxt)
    });
    onMounted(() => {
      scroller = new BScroll(scrollWrapper.value as any, {});
    });
    onUpdated(() => {
      scroller.refresh();
    });
    return { state, scrollWrapper };
  },
  render() {
    return (
      <div class={styles.wrapper}>
        <div class={styles.title}>查看评论</div>
        <div class={styles.txtWrapper}>
          <div class={styles.txt}>{this.state.pTxt}</div>
        </div>
        <div class={styles.scrollWrapper} ref="scrollWrapper">
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
      </div>
    );
  }
});
