<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/authStore'

const auth = useAuthStore()
const audience = ref('customer')
const search = ref('')
const customerSteps = [
  { title: 'Explore o cardápio', description: 'Veja as categorias, pesquise pelo nome do doce e abra os detalhes de um produto.', path: '/cardapio', action: 'Ver cardápio' },
  { title: 'Escolha seus produtos', description: 'Na página do produto, confira preço, quantidade mínima e personalizações disponíveis. Adicione ao carrinho.', path: '/cardapio', action: 'Escolher doces' },
  { title: 'Entre na sua conta', description: 'Para finalizar uma encomenda é necessário entrar ou se cadastrar. O carrinho é preservado durante esse processo.', path: '/entrar', action: 'Entrar' },
  { title: 'Revise a encomenda', description: 'No checkout, selecione retirada ou entrega, informe data e horário, confira o orçamento calculado pela loja e confirme.', path: '/carrinho', action: 'Abrir carrinho' },
  { title: 'Acompanhe seu pedido', description: 'Confira o status, os itens e o histórico em Meus pedidos. O site não realiza cobrança automática.', path: '/meus-pedidos', action: 'Meus pedidos' },
  { title: 'Peça ajuda ou orçamento', description: 'Abra uma dúvida no atendimento ou solicite uma proposta personalizada; a loja responderá pelo site.', path: '/atendimento', action: 'Atendimento' },
]
const adminSteps = [
  { title: 'Visão geral', description: 'Acompanhe pedidos, atendimentos e valores registrados no sistema. Valores pagos são registros administrativos, não conciliação bancária.', tab: 'dashboard' },
  { title: 'Produtos e categorias', description: 'Cadastre e edite itens do catálogo; use a busca por nome para localizar um registro e o menu Fotos e opções para imagens e personalizações.', tab: 'products' },
  { title: 'Atendimento', description: 'Abra a conversa dentro de um ticket, leia o histórico e envie uma resposta. Atendimentos encerrados ficam disponíveis para leitura.', tab: 'tickets' },
  { title: 'Pedidos recebidos pelo WhatsApp', description: 'Em Pedidos → Novo pedido WhatsApp, informe os dados fornecidos pelo cliente, selecione produtos, data e retirada/entrega. O servidor valida preços e disponibilidade.', tab: 'orders' },
  { title: 'Pagamentos e conclusão', description: 'Altere os status seguindo a ordem permitida. Só confirme pagamento manual depois de verificar o recebimento.', tab: 'orders' },
  { title: 'Relatórios', description: 'Em Pedidos → Relatório de concluídos, filtre pela data de conclusão, confira pagos e pendentes e exporte em CSV.', tab: 'orders' },
  { title: 'Conteúdo e agenda', description: 'Publique FAQ e banners com informações verdadeiras; configure marca, horários e regiões de entrega antes de receber pedidos.', tab: 'schedule' },
]
const steps = computed(() => {
  const values = audience.value === 'admin' ? adminSteps : customerSteps
  const text = search.value.trim().toLocaleLowerCase('pt-BR')
  return values.filter(step => !text ||
    `${step.title} ${step.description}`.toLocaleLowerCase('pt-BR').includes(text))
})
</script>
<template>
  <div class="tutorial">
    <header class="welcome">
      <p class="section-eyebrow">Central de ajuda ♡</p>
      <h1>Como podemos ajudar?</h1>
      <p>Um guia simples para aproveitar a Pensei em Você Doces.</p>
      <label class="field search">Pesquisar no tutorial
        <input v-model.trim="search" type="search" placeholder="Ex.: acompanhar pedido, editar produto" />
      </label>
    </header>
    <div class="switcher" aria-label="Escolher tutorial">
      <button type="button" :aria-pressed="audience === 'customer'" @click="audience = 'customer'">Quero fazer um pedido</button>
      <button v-if="auth.user?.is_superuser" type="button" :aria-pressed="audience === 'admin'"
        @click="audience = 'admin'">Sou administrador</button>
    </div>
    <section class="steps" aria-live="polite">
      <article v-for="(step, i) in steps" :key="step.title" class="card step">
        <span class="number">{{ String(i + 1).padStart(2, '0') }}</span>
        <div>
          <h2>{{ step.title }}</h2>
          <p>{{ step.description }}</p>
          <RouterLink v-if="step.path" class="button-outline" :to="step.path">{{ step.action }} →</RouterLink>
          <RouterLink v-else class="button-outline" :to="{ path: '/admin', query: { secao: step.tab } }">
            Abrir no painel →
          </RouterLink>
        </div>
      </article>
      <p v-if="!steps.length" class="empty-state">Nenhuma etapa corresponde à pesquisa.</p>
    </section>
    <section class="help card">
      <h2>Ainda tem dúvidas?</h2>
      <p>Entre em contato com a loja ou acompanhe suas solicitações pelo atendimento.</p>
      <RouterLink to="/atendimento" class="button">Ir para atendimento</RouterLink>
    </section>
  </div>
</template>
<style scoped>
.tutorial { padding-bottom: 3rem; }
.welcome { margin: 2rem 0; border-radius: 26px; text-align: center; padding: 2.5rem 1rem;
  background: linear-gradient(120deg, #fff0f5, #fff0e8); }
.welcome h1 { font-size: clamp(2rem, 5vw, 3.4rem); margin: .5rem 0; }
.search { width: min(100%, 480px); text-align: left; margin: 1.5rem auto 0; }
.switcher { display: flex; gap: .7rem; flex-wrap: wrap; justify-content: center; margin-bottom: 2rem; }
.switcher button { border-radius: 50px; }
.switcher button[aria-pressed=true] { color: #fff; background: var(--color-primary); border-color: var(--color-primary); }
.steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr)); gap: 1rem; }
.step { display: flex; align-items: flex-start; gap: 1.2rem; }
.number { flex-shrink: 0; display: grid; place-items: center; width: 42px; height: 42px; border-radius: 14px;
  background: var(--color-soft); color: var(--color-primary-hover); font-weight: 800; }
.step h2 { font-size: 1.25rem; margin: 0; }
.step p { color: #776874; margin: .7rem 0 1.1rem; }
.help { text-align: center; margin: 2.5rem 0; background: #fff1f5; }
.help h2 { margin: .3rem 0; }
</style>
