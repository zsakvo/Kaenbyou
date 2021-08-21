import { createApp } from 'vue';
import App from './App';
import router from './router';
import store from './store';
import '@/style/index.scss';

import Varlet from '@varlet/ui';
import '@varlet/ui/es/style.js';

window.$store = store;

createApp(App).use(router).use(store).use(Varlet).mount('#app');
