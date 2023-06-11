import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./pages/SelectGamePage.vue'),
  },
  {
    path: '/jackpot',
    name: 'Jackpot Home',
    component: () => import('./pages/JackpotPage.vue'),
    children: [
      {
        path: 'config',
        name: 'Jackpot Config',
        component: () => import('./pages/ConfigPage.vue'),
      },
      {
        path: 'start/:id',
        name: 'Jackpot Start',
        component: () => import('./pages/JackpotGame.vue'),
      },
    ],
  },
  {
    path: '/lotto',
    name: 'Lotto Game',
    component: () => import('./pages/LottoGamePage.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
