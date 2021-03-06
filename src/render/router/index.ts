import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/home'),
    children: [
      { path: 'shelf', name: 'Shelf', component: () => import('../views/home/pages/shelf') },
      { path: 'rank', name: 'Rank', component: () => import('../views/home/pages/rank') },
      { path: 'user', name: 'User', component: () => import('../views/home/pages/user') }
    ]
  },
  {
    path: '/reader',
    name: 'Reader',
    component: () => import('../views/reader')
  },
  {
    path: '/books',
    name: 'Books',
    component: () => import('../views/books')
  },
  {
    path: '/detail',
    name: 'Detail',
    component: () => import('../views/detail')
  }
];

const router = createRouter({
  history: createWebHashHistory(), // 只能用hash模式
  routes
});

export default router;
