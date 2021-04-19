import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Questions from '@/questions/Questions.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Questions',
    component: Questions,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
