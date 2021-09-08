import { defineComponent, onMounted, reactive, nextTick, ref } from 'vue';
import { PullRefresh } from 'vant';
import BScroll from '@better-scroll/core';
import ScrollBar from '@better-scroll/scroll-bar';

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
    const state = reactive({
      refreshing: false
    });
    const scrollWrapper = ref(null);
    BScroll.use(ScrollBar);
    let scroll;
    onMounted(() => {
      nextTick().then(() => {
        scroll = new BScroll(scrollWrapper.value as any, {
          scrollY: true,
          scrollbar: true,
          pullDownRefresh: {
            threshold: 90,
            stop: 45
          }
        });
        console.log(scroll);
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
            ) : null}
          </div>
        </div>
      </div>
    );
  }
});
