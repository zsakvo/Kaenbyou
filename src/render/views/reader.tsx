import { computed, defineComponent, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import { Popup, Icon, Loading } from 'vant';
import Content from '@/components/Content';
import themeConfig from '@/plugins/themes';

import { useRoute, useRouter } from 'vue-router';
import styles from '@/style/reader.module.scss';
import { getChapterByDivisionId, getContent, getDivisionList } from '@/api';

import arrowLeftIcon from '@/assets/imgs/arrow_left.png';
import arrowRightIcon from '@/assets/imgs/arrow_right.png';
import vipIcon from '@/assets/imgs/lock.png';
import menuIcon from '@/assets/imgs/menu.png';
import moonIcon from '@/assets/imgs/moon.png';
import bookmarkIcon from '@/assets/imgs/bookmark.png';
import readerSettingsIcon from '@/assets/imgs/read_settings.png';
import dayjs from 'dayjs';
import { useStore } from 'vuex';

import BScroll from '@better-scroll/core';
import ScrollBar from '@better-scroll/scroll-bar';

export default defineComponent({
  components: {
    Content,
    [Popup.name]: Popup,
    [Icon.name]: Icon,
    [Loading.name]: Loading
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const catalogWrapper = ref(null);
    const contentEle = ref(null as any);
    BScroll.use(ScrollBar);
    const state = reactive({
      bid: '',
      cid: '',
      divisionList: [],
      cmd: '',
      title: '',
      content: '',
      authorSay: '',
      bookName: '',
      chapters: [] as any,
      chapterIndex: 0,
      showTopPopup: false,
      showBottomPopup: false,
      canPopup: true,
      now: dayjs(),
      showPopup: computed(() => store.state.reader.showPopup),
      showCatalog: computed(() => store.state.reader.showCatalog)
    });
    const icons = {
      arrowLeftIcon,
      arrowRightIcon,
      vipIcon,
      menuIcon,
      moonIcon,
      bookmarkIcon,
      readerSettingsIcon
    };
    const pageStyle = reactive({
      width: '100vw',
      height: '100vh',
      background: themeConfig.themes[1].content
    });

    const topBarStyle = reactive({
      height: '42px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: themeConfig.themes[1].content
    });

    const bottomBarStyle = reactive({
      height: 'auto',
      background: themeConfig.themes[1].content
    });

    const leftBarStyle = reactive({
      width: '75%',
      height: '100%',
      padding: '20px 0',
      boxSizing: 'border-box',
      background: themeConfig.themes[1].content
    });
    const goBack = () => {
      store.commit('reader/hidePopup');
      setTimeout(() => router.back(), 300);
    };
    onMounted(async () => {
      state.bid = route.query.bid as string;
      state.cid = route.query.cid as string;
      state.bookName = route.params.bookName as string;
      setInterval(() => {
        state.now = dayjs();
      }, 1000 * 60);
      await getChapters(state.bid);
      fetchContent(state.cid);
    });
    onUnmounted(() => {
      clearInterval();
    });
    const initScroll = () => {
      new BScroll(catalogWrapper.value as any, {
        scrollY: true,
        scrollbar: true
      });
    };
    const getChapters = async (book_id: any) => {
      const res: any = await getDivisionList(book_id);
      const divisions = res.division_list;
      for (let i = 0; i < divisions.length; i++) {
        const did = divisions[i].division_id;
        const res = (await getChapterByDivisionId(did, state.bid)) as any;
        state.chapters = state.chapters.concat(res.chapter_list);
      }
      await nextTick();
      initScroll();
    };
    const fetchContent = async (cid) => {
      const res = await getContent(cid, state.bid);
      state.title = res.chapter_info.chapter_title;
      state.content = res.chapter_info.txt_content;
      state.authorSay = res.chapter_info.author_say;
      state.chapterIndex = state.chapters.findIndex((item) => item.chapter_id === cid);
    };
    const popupHandler = () => {
      const lastCanPopup = state.canPopup;
      const selection = window.getSelection()!.toString();
      state.canPopup = selection.length === 0;
      if (!lastCanPopup) {
        return;
      }
      if (!state.showBottomPopup && !state.canPopup) {
        return;
      }
      if (!state.showBottomPopup) {
        state.showBottomPopup = true;
        state.showTopPopup = true;
      } else {
        state.showBottomPopup = false;
        state.showTopPopup = false;
      }
    };
    const jumpChapter = async (cid) => {
      store.commit('reader/hideCatalog');
      state.showCatalog = false;
      state.showTopPopup = false;
      state.showBottomPopup = false;
      state.title = '';
      state.cid = cid;
      await fetchContent(cid);
      router.replace({
        name: 'Reader',
        query: {
          bid: state.bid,
          cid
        },
        params: {
          bookName: state.bookName
        }
      });
    };
    const showCatalog = () => {
      store.commit('reader/showCatalog');
    };
    const loadPrevCpt = () => {
      console.log('读取上一章...');
      if (state.chapterIndex == 0) {
        contentEle.value!.finishPullDown();
      } else {
        state.chapterIndex--;
        console.log(state.chapterIndex);
        jumpChapter(state.chapters[state.chapterIndex].chapter_id);
      }
    };
    const loadNextCpt = () => {
      console.log('读取下一章...');
      if (state.chapterIndex == state.chapters.length - 1) {
        contentEle.value!.finishPullOn();
      } else {
        state.chapterIndex++;
        console.log(state.chapterIndex);
        jumpChapter(state.chapters[state.chapterIndex].chapter_id);
      }
    };
    return {
      state,
      icons,
      pageStyle,
      topBarStyle,
      bottomBarStyle,
      leftBarStyle,
      popupHandler,
      goBack,
      jumpChapter,
      showCatalog,
      catalogWrapper,
      contentEle,
      loadPrevCpt,
      loadNextCpt
    };
  },
  render() {
    return (
      <div class={styles.page} style={this.pageStyle} onClick={this.popupHandler}>
        <div
          class={styles.topInfo}
          style={{
            background: themeConfig.themes[1].content,
            color: '#978042'
          }}
        >
          {this.state.title}
        </div>
        <div
          class={styles.bottomInfo}
          style={{
            background: themeConfig.themes[1].content,
            color: '#978042'
          }}
        >
          {dayjs(this.state.now).format('HH:mm')}
          <div>{this.state.chapterIndex + '/' + this.state.chapters.length}</div>
        </div>
        {this.state.title.length === 0 ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Loading color="#997b5f" size="48" />
          </div>
        ) : (
          <Content
            title={this.state.title}
            content={this.state.content}
            authorSay={this.state.authorSay}
            onPullDown={this.loadPrevCpt}
            onPullOn={this.loadNextCpt}
            ref="contentEle"
            // showPopup={() => {
            //   console.log('切换 popup');
            //   this.state.showPopup = !this.state.showPopup;
            // }}
          />
        )}
        <div
          class={styles.topBar}
          style={{
            background: themeConfig.themes[1].body,
            color: '#94742c',
            top: this.state.showPopup ? '0' : '-42px',
            boxShadow: this.state.showPopup ? 'rgb(0 0 0 / 20%) 0px 0px 8px 1px' : 'none'
          }}
        >
          <div class={styles.backIcon} onClick={this.goBack}>
            <Icon name="arrow-left" size="22" />
          </div>
        </div>
        <div
          class={styles.bottomBar}
          style={{
            background: themeConfig.themes[1].body,
            color: '#94742c',
            bottom: this.state.showPopup ? '0' : '-100px',
            boxShadow: this.state.showPopup ? 'rgb(0 0 0 / 20%) 0px 0px 8px 1px' : 'none'
          }}
        >
          <div class={styles.firstLine}>
            <img src={this.icons.arrowLeftIcon} alt="" class={[styles.arrow, styles.arrowLeft]} />
            <div class={styles.vipDesc}>
              <img src={this.icons.vipIcon} alt="" class={styles.descIcon} />
              <div class={styles.descText}>5523 人订阅</div>
            </div>
            <img src={this.icons.arrowRightIcon} alt="" class={[styles.arrow, styles.right]} />
          </div>
          <div class={styles.secLine}>
            <img src={this.icons.menuIcon} class={styles.icon} alt="" onClick={this.showCatalog} />
            <div class={styles.readDesc}> 已读 56% </div>
            <img src={this.icons.moonIcon} class={[styles.icon, styles.iconMLeft]} alt="" />
            <img src={this.icons.bookmarkIcon} class={[styles.icon, styles.iconMLeft]} alt="" />
            <img
              src={this.icons.readerSettingsIcon}
              class={[styles.icon, styles.iconMLeft]}
              alt=""
            />
          </div>
        </div>
        <div
          class={styles.catalog}
          style={{
            background: themeConfig.themes[1].body,
            color: '#94742c',
            left: this.state.showCatalog ? '0' : '-75vw',
            boxShadow: this.state.showCatalog ? 'rgb(0 0 0 / 20%) 0px 0px 8px 1px' : 'none'
          }}
        >
          <div class={styles.bookName}>{this.state.bookName}</div>
          <div
            ref="catalogWrapper"
            style={{ height: 'calc(100vh - 124px)', overflow: 'hidden', position: 'relative' }}
          >
            <div class={styles.cataWrapper}>
              {this.state.chapters.map((cata: any) => (
                <div
                  onClick={() => this.jumpChapter(cata.chapter_id)}
                  class={[
                    styles.cata,
                    cata.chapter_id === this.state.cid ? styles.cataSelected : null
                  ]}
                >
                  {cata.chapter_title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
});
