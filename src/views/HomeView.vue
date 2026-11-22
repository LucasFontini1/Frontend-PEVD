<template>
  <section class="hero">
    <p class="eyebrow">Confeitaria artesanal</p>
    <h1>Doces que tornam cada momento especial.</h1>
    <p>Bem-vindo à Pensei em Você Doces. Estamos preparando nosso cardápio digital.</p>
    <p class="muted">O catálogo e os pedidos estarão disponíveis nas próximas fases.</p>
    <RouterLink class="button" to="/cadastro">Criar minha conta</RouterLink>
  </section>
</template>
<style scoped>
.hero { padding: 4rem 0 5rem; max-width: 650px; }
.eyebrow { color: var(--color-primary); font-weight: 700; text-transform: uppercase; letter-spacing: .12em; }
h1 { font-size: clamp(2.3rem, 7vw, 4.3rem); line-height: 1.1; margin-block: .5rem 1.5rem; }
.hero > p { font-size: 1.12rem; }
</style>
