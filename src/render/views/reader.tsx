import { defineComponent, onMounted, reactive } from 'vue';
import { Popup, Icon } from 'vant';
import Content from '@/components/Content';
import themeConfig from '@/plugins/themes';

import { useRoute, useRouter } from 'vue-router';
import styles from '@/style/reader.module.scss';
import { getChapterByDivisionId, getContent, getDivisionList } from '@/api';

export default defineComponent({
  components: {
    Content,
    [Popup.name]: Popup,
    [Icon.name]: Icon
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      bid: '',
      cid: '',
      divisionList: [],
      cmd: '',
      title: '',
      content: '',
      bookName: '',
      chapters: [],
      showPopup: false,
      showCatalog: false
    });
    const pageStyle = reactive({
      width: '100vw',
      height: '100vh',
      background: themeConfig.themes[1].body
    });

    const topBarStyle = reactive({
      height: '42px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: themeConfig.themes[1].content
    });
    const goBack = () => {
      router.back();
    };
    onMounted(async () => {
      state.bid = route.query.bid as string;
      state.cid = route.query.cid as string;
      state.bookName = route.params.bookName as string;
      // getDivisionList(state.bid).then((res) => {
      //   state.divisionList = res.division_list
      // })
      await getChapters(state.bid);
      fetchContent(state.cid);
    });
    const getChapters = async (book_id) => {
      const res: any = await getDivisionList(book_id);
      const divisions = res.division_list;
      for (let i = 0; i < divisions.length; i++) {
        const did = divisions[i].division_id;
        const res = (await getChapterByDivisionId(did)) as any;
        state.chapters.concat(res.chapter_list);
      }
    };
    const fetchContent = async (cid) => {
      const res = await getContent(cid);
      state.title = res.chapter_info.chapter_title;
      state.content = res.chapter_info.txt_content;
    };
    const popupHandler = () => {
      console.log('背景点击事件-->', state.showCatalog);
      if (!state.showCatalog) {
        state.showPopup = !state.showPopup;
      }
    };
    return { state, pageStyle, topBarStyle, popupHandler, goBack };
  },
  render() {
    return (
      <div class={styles.page} style={this.pageStyle} onClick={this.popupHandler}>
        <Content title={this.state.title} content={this.state.content} />
        <Popup
          show={this.state.showPopup}
          overlay={false}
          position="top"
          duration="0.15"
          class={styles.topPopup}
          style={this.topBarStyle}
        >
          <div class={styles.backIcon} onClick={this.goBack}>
            <Icon name="arrow-left" size="22" />
          </div>
          <div class={styles.title}>{this.state.bookName}</div>
          <div class={styles.actionIcon}></div>
        </Popup>
      </div>
    );
  }
});
