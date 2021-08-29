import { defineComponent, onMounted, onUnmounted, reactive } from 'vue';
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
    const state = reactive({
      bid: '',
      cid: '',
      divisionList: [],
      cmd: '',
      title: '',
      content: '',
      bookName: '',
      chapters: [],
      showTopPopup: false,
      showBottomPopup: false,
      showCatalog: false,
      canPopup: true,
      now: dayjs()
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
      background: themeConfig.themes[1].body
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
      router.back();
    };
    onMounted(async () => {
      // const now = dayjs();
      // console.log(now.hour());
      // console.log(now.minute());
      state.bid = route.query.bid as string;
      state.cid = route.query.cid as string;
      state.bookName = route.params.bookName as string;
      setInterval(() => {
        state.now = dayjs();
      }, 1000 * 60);
      // getDivisionList(state.bid).then((res) => {
      //   state.divisionList = res.division_list
      // })
      await getChapters(state.bid);
      fetchContent(state.cid);
    });
    onUnmounted(() => {
      clearInterval();
    });
    const getChapters = async (book_id: any) => {
      const res: any = await getDivisionList(book_id);
      const divisions = res.division_list;
      for (let i = 0; i < divisions.length; i++) {
        const did = divisions[i].division_id;
        const res = (await getChapterByDivisionId(did, state.bid)) as any;
        state.chapters = state.chapters.concat(res.chapter_list);
      }
    };
    const fetchContent = async (cid) => {
      const res = await getContent(cid, state.bid);
      state.title = res.chapter_info.chapter_title;
      state.content = res.chapter_info.txt_content;
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
      state.showCatalog = true;
      // popBars = false
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
      showCatalog
    };
  },
  render() {
    return (
      /* global PerfectScrollbar  */
      <div class={styles.page} style={this.pageStyle} onClick={this.popupHandler}>
        <div
          class={styles.topInfo}
          style={{
            background: themeConfig.themes[1].body,
            color: '#978042'
          }}
        >
          {this.state.title}
        </div>
        <div
          class={styles.bottomInfo}
          style={{
            background: themeConfig.themes[1].body,
            color: '#978042'
          }}
        >
          {this.state.now.hour() + ':' + this.state.now.minute()}
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
          <Content title={this.state.title} content={this.state.content} />
        )}
        <Popup
          show={this.state.showTopPopup}
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
        <Popup
          onClick={(event) => {
            event.stopPropagation();
          }}
          show={this.state.showBottomPopup}
          overlay={false}
          position="bottom"
          duration="0.15"
          style={this.bottomBarStyle}
          class={styles.bottomPopup}
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
        </Popup>
        <Popup
          onClick={(event) => {
            event.stopPropagation();
          }}
          onClick-overlay={(event) => {
            event.stopPropagation();
            this.state.showCatalog = false;
          }}
          onClosed={() => {
            console.log('closed!');
            this.state.showTopPopup = false;
            this.state.showBottomPopup = false;
          }}
          show={this.state.showCatalog}
          overlay={true}
          position="left"
          duration="0.15"
          style={this.leftBarStyle}
          class={styles.catalogPopup}
        >
          <div class={styles.bookName}>{this.state.bookName}</div>
          <PerfectScrollbar class={styles.cataWrapper}>
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
          </PerfectScrollbar>
        </Popup>
      </div>
    );
  }
});
