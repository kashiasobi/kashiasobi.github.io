import { createRouter, createWebHistory } from 'vue-router'
import KrView from '../views/KrView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/kr/30'
    },
    {
      path: '/kr/:id',
      name: 'kr',
      component: KrView
    }
  ]
})

export default router
