import { createApp } from 'vue';
import App from './App';
import router from './router';
import store from './store';
import '@/style/index.scss';
import '@vant/touch-emulator';
import { ConfigProvider } from 'vant';

window.$store = store;

createApp(App).use(router).use(store).use(ConfigProvider).mount('#app');
