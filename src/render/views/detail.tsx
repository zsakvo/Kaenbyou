import { getInfoById } from '@/api';
import { defineComponent, onMounted, reactive } from '@vue/runtime-dom';
import { Book } from 'src/typings/interface';
import { useRoute, useRouter } from 'vue-router';
import { Icon, Button } from 'vant';

import styles from '@/style/detail.module.scss';
export default defineComponent({
  name: 'Detail',
  components: {
    [Icon.name]: Icon,
    [Button.name]: Button
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
        console.log(book);
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
            <div class={styles.title}> 书籍详情 </div>
            <div class={styles.backIcon} onClick={this.goBack}>
              <Icon name="like-o" size="20" />
            </div>
          </div>
          <div class={styles.bookHeader}>
            <img src={this.state.book.cover} class={styles.bookCover} />
            <div class={styles.baseInfo}>
              <div class={styles.name}>{this.state.book.book_name}</div>
              <div class={styles.author}>{this.state.book.author_name} / 著</div>
              <div class={styles.desc}>{this.state.book.description}</div>
            </div>
          </div>
          <div class={styles.bookData}>
            <div class={styles.data}>
              <div class={styles.num}>{this.state.book.total_yp}</div>
              <div class={styles.desc}>月票</div>
            </div>
            <div class={styles.data}>
              <div class={styles.num}>{this.state.book.total_recommend}</div>
              <div class={styles.desc}>推荐票</div>
            </div>
            <div class={styles.data}>
              <div class={styles.num}>{this.state.book.total_blade}</div>
              <div class={styles.desc}>刀片</div>
            </div>
            {/* <div class={styles.data}>
              <div class={styles.num}>{this.state.book.total_favor}</div>
              <div class={styles.desc}>收藏</div>
            </div> */}
          </div>
          <div class={styles.lastCpt}>
            <div class={styles.head}> 目录 </div>
            <div class={styles.title}>{this.state.book.last_chapter_info?.chapter_title}</div>
            <div class={styles.icon}>
              <Icon name="arrow" size="15" />
            </div>
          </div>
          <div class={styles.tagWrapper}></div>
          <div class={styles.bottomButtons}>
            <van-button size="small" icon="plus" type="default" class={styles.button}>
              加入书架
            </van-button>
            <van-button size="small" type="primary" class={[styles.button, styles.buttonRead]}>
              立刻阅读
            </van-button>
          </div>
        </div>
      </>
    );
  }
});
