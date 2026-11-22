<script setup>
import { onMounted, ref } from 'vue'
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

const tab = ref('dashboard')
const categories = ref([])
const products = ref([])
const selected = ref(null)
const editing = ref(false)
const mediaProduct = ref(null)
const error = ref('')
const loading = ref(false)

async function load() {
  loading.value = true
  error.value = ''
  try {
    const [a, b] = await Promise.all([
      adminCatalogApi.list('categories', { page_size: 100 }),
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
    <h1>Painel comercial</h1>
    <p>Apenas superusuários autorizados podem alterar o cardápio.</p>
    <div class="tabs">
      <button v-for="[key, title] in [
        ['dashboard', 'Visão geral'], ['faq', 'FAQ'], ['tickets', 'Atendimento'],
        ['quotes', 'Orçamentos'], ['contacts', 'Contatos'], ['banners', 'Banners'],
      ]" :key="key" :aria-pressed="tab === key" @click="tab = key; editing = false; mediaProduct = null">{{ title }}</button>
      <button :aria-pressed="tab === 'products'" @click="tab = 'products'; editing = false; mediaProduct = null">Produtos</button>
      <button :aria-pressed="tab === 'categories'" @click="tab = 'categories'; editing = false; mediaProduct = null">Categorias</button>
      <button :aria-pressed="tab === 'brand'" @click="tab = 'brand'; editing = false; mediaProduct = null">Marca</button>
      <button :aria-pressed="tab === 'orders'" @click="tab = 'orders'; editing = false; mediaProduct = null">Pedidos</button>
      <button :aria-pressed="tab === 'schedule'" @click="tab = 'schedule'; editing = false; mediaProduct = null">Agenda e entrega</button>
    </div>
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
      <p><button class="button" @click="edit()">Adicionar {{ tab === 'products' ? 'produto' : 'categoria' }}</button></p>
      <p v-if="!(tab === 'products' ? products : categories).length" class="muted">Nenhum registro cadastrado.</p>
      <div v-for="item in tab === 'products' ? products : categories" :key="item.id" class="item card">
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
  </section>
</template>
<style scoped>
.admin { padding-block: 2rem 4rem; }
.tabs, .actions { display: flex; flex-wrap: wrap; gap: .7rem; }
.tabs button[aria-pressed=true] { background: var(--color-primary); color: white; }
.tabs button, .actions button { padding: .6rem .9rem; border: 1px solid var(--color-border); border-radius: 10px; cursor: pointer; }
.item { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin: .7rem 0; padding: 1rem; }
.item p { margin: .2rem 0; }
.tools { display: grid; gap: 1.2rem; }
</style>
