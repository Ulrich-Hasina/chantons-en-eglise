import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Accueil',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/livret/:livretId',
    name: 'Livret',
    component: () => import('../views/LivretView.vue'),
  },
  {
    path: '/livret/:livretId/cantique/:cantiqueId',
    name: 'Cantique',
    component: () => import('../views/CantiqueView.vue'),
  },
  {
    path: '/favoris',
    name: 'Favoris',
    component: () => import('../views/FavorisView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router
