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
      <PullRefresh
        style={{
          width: '100vw',
          height: '100vh',
          overflow: 'auto',
          boxSizing: 'border-box',
          padding: '60px 24px'
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
        </div>
      </PullRefresh>
    );
  }
});
