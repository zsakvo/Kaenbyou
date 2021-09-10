import { defineComponent, onMounted, reactive, nextTick, ref } from 'vue';
import { PullRefresh } from 'vant';
import BScroll from '@better-scroll/core';
import ScrollBar from '@better-scroll/scroll-bar';
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
    authorSay: {
      type: String,
      default: null
    }
  },
  setup() {
    const store = useStore();
    const state = reactive({
      refreshing: false
    });
    const scrollWrapper = ref(null);
    BScroll.use(ScrollBar);
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
    onMounted(() => {
      nextTick().then(() => {
        scroll = new BScroll(scrollWrapper.value as any, {
          scrollY: true,
          click: true,
          scrollbar: true,
          pullDownRefresh: {
            threshold: 90,
            stop: 45
          }
        });
        const hooks = scroll.scroller.actionsHandler.hooks;
        hooks.on('click', onScrollClick);
      });
    });
    return { state, scrollWrapper };
  },
  render() {
    return (
      <div
        ref="scrollWrapper"
        style={{
          height: 'calc(100vh - 84px)',
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
          </div>
        </div>
      </div>
    );
  }
});

interface IMouseEvent extends MouseEvent {
  _constructed: boolean;
}
