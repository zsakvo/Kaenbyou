import { getInfoById } from '@/api';
import { defineComponent, onMounted, reactive } from '@vue/runtime-dom';
import { Book } from 'src/typings/interface';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from 'vant';

import styles from '@/style/detail.module.scss';
export default defineComponent({
  name: 'Detail',
  components: {
    [Icon.name]: Icon
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { bid } = route.query;
    const state = reactive({
      book: {} as Book
    });
    const goBack = () => {
      router.go(-1);
    };
    onMounted(() => {
      getInfoById(bid as string).then((res: any) => {
        const book: Book = res.book_info;
        state.book = book;
      });
    });
    return { state, goBack };
  },
  render() {
    return (
      <>
        <div class={styles.page}>
          <div class={styles.toolBar}>
            <div class={styles.backIcon} onClick={this.goBack}>
              <Icon name="arrow-left" size="20" />
            </div>
            <div class={styles.title}> {this.state.book.book_name} </div>
            <div class={styles.menus}></div>
          </div>
        </div>
      </>
    );
  }
});
