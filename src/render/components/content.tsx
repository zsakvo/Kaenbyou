import { defineComponent, onMounted, reactive, nextTick, ref } from 'vue';
import { PullRefresh } from 'vant';
import BScroll from '@better-scroll/core';
import ScrollBar from '@better-scroll/scroll-bar';
import PullDown from '@better-scroll/pull-down';
import Pullup from '@better-scroll/pull-up';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'Content',
  components: {
    [PullRefresh.name]: PullRefresh
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    tsukkomi: {
      type: Array,
      default: () => []
    },
    authorSay: {
      type: String,
      default: null
    },
    onPullDown: {
      type: Function,
      default: () => {}
    },
    onPullOn: {
      type: Function,
      default: () => {}
    }
  },
  setup(/*props*/) {
    const store = useStore();
    const state = reactive({
      refreshing: false,
      loading: false,
      isPullUpLoad: false
    });
    const scrollWrapper = ref(null);
    const tipText = ref('');
    BScroll.use(ScrollBar);
    BScroll.use(PullDown);
    BScroll.use(Pullup);
    let scroll;
    const onScrollClick = (e: IMouseEvent) => {
      if (!e._constructed) {
        return;
      }
      const { innerWidth, innerHeight } = window;
      const { x, y } = e;
      console.log(x, y);
      console.log(innerWidth, innerHeight);
      if (store.state.reader.showPopup) {
        store.commit('reader/hidePopup');
      } else if (store.state.reader.showCatalog) {
        store.commit('reader/hideCatalog');
      } else {
        if (
          x > innerWidth / 3 &&
          x <= (innerWidth * 2) / 3 &&
          y > innerHeight / 3 &&
          y <= (innerHeight * 2) / 3
        ) {
          console.log('可以呼出菜单');
          store.commit('reader/showPopup');
        }
      }
    };
    const PHASE = {
      moving: {
        enter: 'enter',
        leave: 'leave'
      },
      fetching: 'fetching',
      succeed: 'succeed'
    };
    // const pullingDownHandler = async () => {
    //   setTipText(PHASE.fetching);
    //   // await nextTick();
    //   props.onPullDown();
    // };
    const finishPullDown = () => {
      scroll.finishPullDown();
    };
    const setTipText = (phase) => {
      const TEXTS_MAP = {
        enter: '下拉上一章',
        leave: '松手上一章',
        fetching: '正在读取数据',
        succeed: '读取成功'
      };
      tipText.value = TEXTS_MAP[phase];
    };
    // const pullingUpHandler = async () => {
    //   state.loading = true;
    //   await props.onPullOn();
    // };
    const finishPullUp = () => {
      scroll.finishPullUp();
      scroll.refresh();
      state.loading = false;
    };
    onMounted(() => {
      nextTick().then(() => {
        scroll = new BScroll(scrollWrapper.value as any, {
          scrollY: true,
          click: true,
          scrollbar: true,
          // pullUpLoad: {
          //   threshold: -96
          // },
          pullDownRefresh: {
            threshold: 72,
            stop: 45
          }
        });
        // scroll.on('pullingDown', pullingDownHandler);
        // scroll.on('pullingUp', pullingUpHandler);
        // scroll.on('scrollEnd', () => {});
        // v2.4.0 supported
        scroll.on('enterThreshold', () => {
          setTipText(PHASE.moving.enter);
        });
        scroll.on('leaveThreshold', () => {
          setTipText(PHASE.moving.leave);
        });
        const hooks = scroll.scroller.actionsHandler.hooks;
        hooks.on('click', onScrollClick);
      });
    });
    return { state, scrollWrapper, tipText, finishPullDown, finishPullUp, store };
  },
  render() {
    return (
      <div
        ref="scrollWrapper"
        style={{
          height: 'calc(100vh - 84px)',
          width: '100vw',
          overflow: 'hidden',
          position: 'absolute',
          marginTop: '42px',
          boxSizing: 'border-box',
          padding: '0 24px',
          userSelect: 'none'
        }}
      >
        <div>
          <div
            style={{
              position: 'absolute',
              width: '100%',
              padding: '32px',
              paddingBottom: '4px',
              boxSizing: 'border-box',
              transform: 'translateY(-100%) translateZ(0)',
              textAlign: 'center',
              color: '#999',
              fontSize: '13px'
            }}
          >
            <div>{this.tipText}</div>
          </div>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 400,
              marginBottom: '32px',
              paddingTop: '24px'
            }}
          >
            {this.title}
          </div>
          <div
            style={{
              textAlign: 'justify',
              fontSize: '15px',
              color: '#333',
              lineHeight: '1.6'
            }}
          >
            {this.content.split('\n').map((c) => (
              <div
                style={{
                  margin: '8px 0',
                  wordBreak: 'break-all',
                  wordWrap: 'break-word'
                }}
              >
                {c}
                <span
                  class="review-count"
                  data-segid="4"
                  style={{
                    fontSize: '12px',
                    lineHeight: '12px',
                    position: 'relative',
                    zIndex: 1,
                    display: 'inline-block',
                    minWidth: '24px',
                    height: '12px',
                    marginLeft: '12px',
                    textAlign: 'center',
                    verticalAlign: '1px',
                    color: '#999',
                    border: '1px solid #999',
                    borderRadius: '2px'
                  }}
                >
                  3
                  <i
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '-5px',
                      width: 0,
                      height: 0,
                      marginTop: '-3px',
                      borderTop: '3px solid transparent',
                      borderRight: '4px solid #999',
                      borderBottom: '3px solid transparent',
                      borderLeft: '0 none'
                    }}
                  >
                    <cite
                      style={{
                        position: 'absolute',
                        top: '-3px',
                        left: '1px',
                        width: 0,
                        height: 0,
                        borderTop: '3px solid transparent',
                        borderRight: '4px solid #f6f1e7',
                        borderBottom: '3px solid transparent',
                        borderLeft: '0 none'
                      }}
                    ></cite>
                  </i>
                </span>
              </div>
            ))}
            {this.authorSay ? (
              <div
                style={{
                  paddingBottom: '24px'
                }}
              >
                <div
                  class="author-say"
                  style={{
                    background: '#d4c184',
                    boxSizing: 'border-box',
                    padding: '8px 12px',
                    marginTop: '24px',
                    borderRadius: '4px'
                  }}
                >
                  <div
                    class="say-title"
                    style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginBottom: '4px',
                      color: '#655112'
                    }}
                  >
                    作者的话
                  </div>
                  <div
                    class="say-content"
                    style={{
                      fontSize: '12px',
                      color: '#695516',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {this.authorSay}
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  height: '24px'
                }}
              ></div>
            )}
            <div
              class="pullup-tips"
              style={{
                textAlign: 'center',
                color: 'var(--van-gray-7)',
                fontSize: '13px',
                display: 'flex',
                padding: '8px 0',
                border: '1px solid #cfae4a2e',
                marginBottom: '16px'
              }}
            >
              <div
                style={{
                  flex: 1,
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  this.onPullDown();
                }}
              >
                上一章
              </div>
              <div
                style={{
                  flex: 1,
                  textAlign: 'center',
                  cursor: 'pointer',
                  borderLeft: '1px solid rgba(207, 174, 74, 0.18)',
                  borderRight: '1px solid rgba(207, 174, 74, 0.18)'
                }}
                onClick={(e) => {
                  console.log(e);
                  this.store.commit('reader/showCatalog');
                }}
              >
                目录
              </div>
              <div
                style={{
                  flex: 1,
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  this.onPullOn();
                }}
              >
                下一章
              </div>
            </div>
          </div>
          <div
            style={{
              width: '100%',
              height: '24px'
            }}
          ></div>
        </div>
      </div>
    );
  }
});

interface IMouseEvent extends MouseEvent {
  _constructed: boolean;
}
