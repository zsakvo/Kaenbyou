import { defineComponent, reactive } from 'vue';
import { PullRefresh } from 'vant';

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
    return { state };
  },
  render() {
    return (
      /* global PerfectScrollbar  */

      <PerfectScrollbar
        style={{
          width: '100vw',
          height: '100vh',
          overflow: 'auto',
          boxSizing: 'border-box',
          padding: '60px 24px',
          userSelect: 'none'
        }}
        headHeight="64"
        modelValue={this.state.refreshing}
        onRefresh={() => {
          console.log('refresh-->', this.state.refreshing);
          setTimeout(() => {
            this.state.refreshing = false;
          }, 3000);
        }}
      >
        <div
          style={{
            fontSize: '18px',
            fontWeight: 400,
            marginBottom: '32px'
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
          ) : null}
        </div>
      </PerfectScrollbar>
    );
  }
});
