import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import CatalogView from '../views/CatalogView.vue'
import ProductView from '../views/ProductView.vue'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/entrar', name: 'login', component: LoginView },
    { path: '/cadastro', name: 'register', component: RegisterView },
    { path: '/cardapio', name: 'catalog', component: CatalogView },
    { path: '/atendimento', name: 'support', component: () => import('../views/SupportView.vue') },
    { path: '/contato', name: 'contact', component: () => import('../views/ContactView.vue') },
    { path: '/atendimento/duvidas', name: 'tickets', component: () => import('../views/TicketsView.vue'), meta: { auth: true } },
    { path: '/atendimento/duvidas/:id', name: 'ticket', component: () => import('../views/TicketThreadView.vue'), meta: { auth: true } },
    { path: '/encomendas-personalizadas', name: 'customQuotes', component: () => import('../views/CustomQuotesView.vue'), meta: { auth: true } },
    { path: '/categoria/:slug', name: 'category', component: CatalogView },
    { path: '/produto/:slug', name: 'product', component: ProductView },
    { path: '/admin', name: 'admin', component: () => import('../views/AdminView.vue'), meta: { admin: true } },
    { path: '/carrinho', name: 'cart', component: () => import('../views/CartView.vue') },
    { path: '/checkout', name: 'checkout', component: () => import('../views/CheckoutView.vue'), meta: { auth: true } },
    { path: '/meus-pedidos', name: 'orders', component: () => import('../views/OrdersView.vue'), meta: { auth: true } },
    { path: '/meus-pedidos/:codigo', name: 'orderDetail', component: () => import('../views/OrderDetailView.vue'), meta: { auth: true } },
    { path: '/pedido-confirmado/:codigo', name: 'orderSuccess', component: () => import('../views/OrderDetailView.vue'), meta: { auth: true } },
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
