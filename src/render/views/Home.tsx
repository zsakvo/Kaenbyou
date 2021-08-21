import { defineComponent } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'App',
  setup() {
    const store = useStore();

    return () => (
      <>
        <h1>Home</h1>
        <h1>{store.state.title}</h1>
        <var-button type="primary">主要按钮</var-button>
      </>
    );
  }
});
