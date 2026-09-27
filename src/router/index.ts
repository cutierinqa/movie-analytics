import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/movies/:id',
      name: 'movie-details',
      component: () => import('../views/MovieDetailsView.vue'),
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: () => import('../views/AnalyticsView.vue'),
    },
    {
      path: '/popular',
      name: 'popular',
      component: () => import('../views/PopularMoviesView.vue'),
    },
  ],
})

export default router
