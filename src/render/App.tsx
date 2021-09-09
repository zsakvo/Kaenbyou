import { ConfigProvider } from 'vant';
import { defineComponent } from 'vue';
import { RouterView } from 'vue-router';

export default defineComponent({
  name: 'App',
  setup() {
    const themeVars = {
      actionSheetItemFontSize: '14px'
    };
    return () => (
      <ConfigProvider themeVars={themeVars}>
        <RouterView />
      </ConfigProvider>
    );
  }
});
