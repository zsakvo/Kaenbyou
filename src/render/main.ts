import { createApp } from 'vue';
import App from './App';
import router from './router';
import store from './store';
import '@/style/index.scss';
import '@vant/touch-emulator';
import PerfectScrollbar from 'vue3-perfect-scrollbar';
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css';
import { ConfigProvider } from 'vant';

window.$store = store;

createApp(App).use(router).use(store).use(ConfigProvider).use(PerfectScrollbar).mount('#app');
