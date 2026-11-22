<template>
  <article class="legal-page card">
    <p class="section-eyebrow">Informações da loja</p>
    <h1>Termos de Uso</h1>
    <p class="muted">Versão preliminar — 22/11/2026. Revisão jurídica e confirmação das informações comerciais pendentes.</p>
    <h2>1. Sobre a plataforma</h2>
    <p>O site Pensei em Você Doces permite consultar um catálogo de produtos, solicitar encomendas, acompanhar pedidos e entrar em contato com a loja em Joinville, Santa Catarina.</p>
    <h2>2. Cadastro e conta</h2>
    <p>Para finalizar pedidos, você precisa fornecer dados verdadeiros e manter suas credenciais em segurança. Não compartilhe a senha. O uso indevido de contas e tentativas de acessar dados de terceiros são proibidos.</p>
    <h2>3. Produtos e encomendas</h2>
    <p>Preços, composições, ingredientes, alergênicos, opções de personalização, disponibilidade e prazos devem ser conferidos antes da confirmação. A loja pode solicitar esclarecimentos para encomendas personalizadas. O site permite revisar os valores antes de enviar o pedido.</p>
    <h2>4. Pagamento, retirada e entrega</h2>
    <p>As condições de pagamento, retirada ou entrega devem ser informadas ao cliente antes da confirmação. O site não realiza cobrança automática na versão atual. O valor do frete e o prazo de entrega exigem confirmação comercial quando aplicável.</p>
    <h2>5. Cancelamentos e direitos do consumidor</h2>
    <p>Pedidos de cancelamento, troca, reclamação ou exercício de direitos previstos na legislação brasileira devem ser encaminhados pelo canal de atendimento. As condições específicas de produtos perecíveis ou personalizados serão analisadas conforme a legislação aplicável; estes termos não restringem direitos legais do consumidor.</p>
    <h2>6. Atendimento</h2>
    <p>WhatsApp: <a href="https://wa.me/554796675064" target="_blank" rel="noopener noreferrer">+55 47 9667-5064</a>. Instagram: <a href="https://www.instagram.com/penseiemvocedoces/" target="_blank" rel="noopener noreferrer">@penseiemvocedoces</a>.</p>
    <h2>7. Dados pessoais</h2>
    <p>Veja nossa <RouterLink to="/politica-de-privacidade">Política de Privacidade</RouterLink> para entender como os dados são utilizados e como solicitar atendimento relacionado à privacidade.</p>
    <p class="legal-alert">Antes de aceitar pedidos comerciais reais, a loja precisa publicar sua identificação legal, endereço de atendimento e condições efetivas de pagamento, cancelamento, entrega e reembolso. Esta versão não substitui revisão jurídica.</p>
  </article>
</template>
<style scoped>
.legal-page { max-width: 880px; margin: 1rem auto 3rem; padding: clamp(1.25rem, 4vw, 3rem); }
.legal-page h1 { font-size: clamp(2rem, 5vw, 3rem); margin: .75rem 0; }
.legal-page h2 { font-size: 1.35rem; margin: 2rem 0 .65rem; }
.legal-page p { line-height: 1.75; }
.legal-alert { border-left: 4px solid var(--color-primary); padding: 1rem; background: var(--color-soft); border-radius: 8px; }
</style>
