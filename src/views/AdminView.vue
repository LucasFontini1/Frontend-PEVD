<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { adminCatalogApi } from '../api/adminCatalogApi'
import { apiMessage } from '../utils/catalog'
import CategoryEditor from '../components/admin/CategoryEditor.vue'
import ProductEditor from '../components/admin/ProductEditor.vue'
import ProductMediaEditor from '../components/admin/ProductMediaEditor.vue'
import OptionsEditor from '../components/admin/OptionsEditor.vue'
import BrandEditor from '../components/admin/BrandEditor.vue'
import OrderManager from '../components/admin/OrderManager.vue'
import ScheduleManager from '../components/admin/ScheduleManager.vue'
import DashboardPanel from '../components/admin/DashboardPanel.vue'
import FAQManager from '../components/admin/FAQManager.vue'
import TicketManager from '../components/admin/TicketManager.vue'
import QuoteManager from '../components/admin/QuoteManager.vue'
import BannerManager from '../components/admin/BannerManager.vue'
import ContactManager from '../components/admin/ContactManager.vue'

const route = useRoute()
const adminTabs = ['dashboard', 'faq', 'tickets', 'quotes', 'contacts', 'banners',
  'products', 'categories', 'brand', 'orders', 'schedule']
const tab = ref(adminTabs.includes(route.query.secao) ? route.query.secao : 'dashboard')
watch(() => route.query.secao, value => {
  if (adminTabs.includes(value)) { tab.value = value; editing.value = false; mediaProduct.value = null }
})
const categories = ref([])
const products = ref([])
const selected = ref(null)
const editing = ref(false)
const mediaProduct = ref(null)
const error = ref('')
const loading = ref(false)
const search = ref('')
const pageLimit = 100
const serverMatches = ref(null)
const searching = ref(false)
let searchSequence = 0
let debounce = null
async function searchCatalog() {
  const sequence = ++searchSequence
  const query = search.value.trim()
  const type = tab.value
  if (!query || !['products', 'categories'].includes(type)) {
    serverMatches.value = null
    searching.value = false
    return
  }
  searching.value = true
  try {
    const { data } = await adminCatalogApi.list(type, { page_size: pageLimit, search: query })
    if (sequence === searchSequence) serverMatches.value = data.results || data
  } catch (err) {
    if (sequence === searchSequence) error.value = apiMessage(err)
  } finally {
    if (sequence === searchSequence) searching.value = false
  }
}
watch([search, tab], () => {
  clearTimeout(debounce)
  ++searchSequence
  serverMatches.value = null
  if (!search.value.trim()) { searching.value = false; return }
  debounce = setTimeout(searchCatalog, 250)
})
const visibleItems = computed(() => {
  const source = serverMatches.value || (tab.value === 'products' ? products.value : categories.value)
  const q = search.value.toLocaleLowerCase('pt-BR')
  return source.filter(item => item.name.toLocaleLowerCase('pt-BR').includes(q))
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    const [a, b] = await Promise.all([
      adminCatalogApi.list('categories', { page_size: pageLimit }),
      adminCatalogApi.list('products', { page_size: 100 }),
    ])
    categories.value = a.data.results || a.data
    products.value = b.data.results || b.data
  } catch (err) { error.value = apiMessage(err) }
  finally { loading.value = false }
}
function edit(item = null) { selected.value = item; editing.value = true; mediaProduct.value = null }
async function saved() { editing.value = false; selected.value = null; await load() }
async function disable(type, id) {
  if (!confirm('Desativar este item na loja?')) return
  try { await adminCatalogApi.disable(type, id); await load() }
  catch (err) { error.value = apiMessage(err) }
}
onMounted(load)
</script>
<template>
  <section class="admin">
    <div class="admin-heading">
      <div>
        <span class="section-eyebrow">Área administrativa</span>
        <h1>Painel comercial</h1>
        <p class="muted">Gerencie produtos, pedidos, atendimento e configurações da loja.</p>
      </div>
      <RouterLink class="store-link" to="/">Ver minha loja →</RouterLink>
    </div>
    <div class="admin-layout">
    <aside class="tabs" aria-label="Seções administrativas">
      <strong>MENU DA LOJA</strong>
      <button v-for="[key, title] in [
        ['dashboard', 'Visão geral'], ['faq', 'FAQ'], ['tickets', 'Atendimento'],
        ['quotes', 'Orçamentos'], ['contacts', 'Contatos'], ['banners', 'Banners'],
      ]" :key="key" :aria-pressed="tab === key" @click="tab = key; editing = false; mediaProduct = null">{{ title }}</button>
      <button :aria-pressed="tab === 'products'" @click="tab = 'products'; editing = false; mediaProduct = null">Produtos</button>
      <button :aria-pressed="tab === 'categories'" @click="tab = 'categories'; editing = false; mediaProduct = null">Categorias</button>
      <button :aria-pressed="tab === 'brand'" @click="tab = 'brand'; editing = false; mediaProduct = null">Marca</button>
      <button :aria-pressed="tab === 'orders'" @click="tab = 'orders'; editing = false; mediaProduct = null">Pedidos</button>
      <button :aria-pressed="tab === 'schedule'" @click="tab = 'schedule'; editing = false; mediaProduct = null">Agenda e entrega</button>
      <RouterLink class="tutorial-link" to="/tutorial">Como usar o painel ↗</RouterLink>
    </aside>
    <div class="admin-content">
    <p v-if="loading" role="status">Carregando dados...</p>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <DashboardPanel v-if="tab === 'dashboard'" />
    <FAQManager v-if="tab === 'faq'" />
    <TicketManager v-if="tab === 'tickets'" />
    <QuoteManager v-if="tab === 'quotes'" />
    <ContactManager v-if="tab === 'contacts'" />
    <BannerManager v-if="tab === 'banners'" />
    <BrandEditor v-if="tab === 'brand'" />
    <OrderManager v-if="tab === 'orders'" />
    <ScheduleManager v-if="tab === 'schedule'" />
    <div v-if="['products', 'categories'].includes(tab) && !editing && !mediaProduct">
      <div class="catalog-tools">
        <label class="field">Pesquisar {{ tab === 'products' ? 'produto' : 'categoria' }} pelo nome
          <input v-model.trim="search" type="search" placeholder="Digite o nome do item" />
        </label>
        <button class="button" @click="edit()">Adicionar {{ tab === 'products' ? 'produto' : 'categoria' }}</button>
      </div>
      <p v-if="searching" role="status">Pesquisando no catálogo...</p>
      <p v-if="!visibleItems.length && !searching" class="muted">Nenhum item encontrado.</p>
      <div v-for="item in visibleItems" :key="item.id" class="item card">
        <div>
          <strong>{{ item.name }}</strong>
          <p class="muted">{{ item.slug }} · {{ item.is_active ? 'Ativo' : 'Inativo' }}</p>
        </div>
        <div class="actions">
          <button @click="edit(item)">Editar</button>
          <button v-if="tab === 'products'" @click="mediaProduct = item">Fotos e opções</button>
          <button v-if="item.is_active" @click="disable(tab, item.id)">Desativar</button>
        </div>
      </div>
    </div>
    <div v-if="editing">
      <CategoryEditor v-if="tab === 'categories'" :selected="selected" @saved="saved" @cancel="editing = false" />
      <ProductEditor v-else :selected="selected" :categories="categories" @saved="saved" @cancel="editing = false" />
    </div>
    <div v-if="mediaProduct" class="tools">
      <h2>Gerenciar {{ mediaProduct.name }}</h2>
      <button @click="mediaProduct = null">Voltar à lista</button>
      <ProductMediaEditor :product-id="mediaProduct.id" />
      <OptionsEditor :product-id="mediaProduct.id" />
    </div>
    </div>
    </div>
  </section>
</template>
<style scoped>
.admin { padding: 2rem 0 4rem; }
.admin-heading { display: flex; align-items: end; justify-content: space-between; gap: 1rem; margin-bottom: 2rem; }
.admin-heading h1 { font-size: clamp(2rem,4vw,3rem); margin: .4rem 0; }
.store-link { font-weight: 800; white-space: nowrap; }
.admin-layout { display: grid; grid-template-columns: 220px minmax(0,1fr); gap: 1.5rem; align-items: start; }
.tabs { background: white; border: 1px solid var(--color-border); border-radius: 20px; padding: .9rem;
  display: grid; gap: .35rem; position: sticky; top: 110px; }
.tabs strong { color: #a08495; font-size: .69rem; letter-spacing: .12em; padding: .7rem; }
.tabs button { border: 0; background: transparent; color: var(--color-text);
  font-weight: 700; text-align: left; border-radius: 10px; padding: .8rem .9rem; }
.tabs button:hover { background: var(--color-soft); }
.tutorial-link { display: block; padding: .8rem .9rem; margin-top: .5rem; border-top: 1px solid var(--color-border);
  text-decoration: none; font-weight: 800; font-size: .85rem; }
.tabs button[aria-pressed=true] { background: var(--color-primary); color: white; }
.admin-content { min-width: 0; display: grid; gap: 1rem; }
.catalog-tools { display: flex; align-items: end; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.catalog-tools .field { flex: 1; min-width: 220px; }
.actions { display: flex; flex-wrap: wrap; gap: .5rem; }
.actions button { padding: .65rem .9rem; background: var(--color-soft);
  border: 1px solid var(--color-border); border-radius: 10px; }
.item { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
.item p { margin: .2rem 0; }
.tools { display: grid; gap: 1.2rem; }
@media(max-width: 850px) {
  .admin-layout { grid-template-columns: 1fr; }
  .tabs { position: static; display: flex; overflow-x: auto; }
  .tabs strong { display: none; }
  .tabs button { flex-shrink: 0; }
}
</style>
