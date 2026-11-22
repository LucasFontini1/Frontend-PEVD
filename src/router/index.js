import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/entrar', name: 'login', component: LoginView },
    { path: '/cadastro', name: 'register', component: RegisterView },
    { path: '/admin', name: 'admin', component: () => import('../views/AdminView.vue'), meta: { admin: true } },
    { path: '/checkout', name: 'checkout', component: () => import('../views/UnavailableView.vue'), meta: { auth: true } },
    { path: '/:pathMatch(.*)*', name: 'notFound', component: () => import('../views/NotFoundView.vue') },
  ],
})
router.beforeEach(async to => {
  if (!to.meta.auth && !to.meta.admin) return true
  const auth = useAuthStore()
  await auth.hydrate()
  if (!auth.isAuthenticated) return { name: 'login', query: { redirect: to.fullPath } }
  if (to.meta.admin) {
    try { await (await import('../api/authApi')).authApi.adminAccess() }
    catch { return { name: 'home' } }
  }
  return true
})
export default router
