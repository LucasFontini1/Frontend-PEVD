<template>
  <article class="legal-page card">
    <p class="section-eyebrow">Proteção de dados</p>
    <h1>Política de Privacidade</h1>
    <p class="muted">Versão preliminar — 22/11/2026. A loja deve confirmar a identificação do controlador, os prazos de conservação e a política operacional antes da publicação definitiva.</p>
    <h2>1. Quem é responsável</h2>
    <p>Pensei em Você Doces, em Joinville – SC. Para falar sobre privacidade, utilize o contato <a href="https://wa.me/554796675064" target="_blank" rel="noopener noreferrer">+55 47 9667-5064</a>. A identificação legal completa do responsável pelo tratamento de dados ainda precisa ser publicada.</p>
    <h2>2. Quais dados a plataforma utiliza</h2>
    <p>Dados de cadastro (nome, nome de usuário e e-mail), dados de pedidos (itens, preços, observações e histórico), endereços fornecidos para entrega e informações enviadas voluntariamente no atendimento. Senhas são armazenadas como hashes pelo Django, não como texto legível.</p>
    <h2>3. Finalidades do tratamento</h2>
    <p>Os dados são utilizados para criar e proteger a conta, processar encomendas, gerenciar entregas, prestar atendimento, manter registros de operações e cumprir obrigações legais aplicáveis. Cada finalidade precisa ser sustentada pela base legal adequada prevista na LGPD.</p>
    <h2>4. Infraestrutura e fornecedores</h2>
    <p>A aplicação utiliza Vercel para hospedagem, Supabase para banco PostgreSQL e Cloudinary para armazenamento de mídias. Esses serviços podem operar infraestrutura fora do Brasil; a loja deve verificar os termos contratuais e os mecanismos aplicáveis às transferências internacionais de dados.</p>
    <h2>5. Segurança e retenção</h2>
    <p>O projeto usa autenticação e controle de acesso no backend. Nenhuma plataforma pode garantir segurança absoluta. Informações devem ser mantidas pelo tempo necessário às finalidades e obrigações legais, com prazos e procedimentos definitivos a serem estabelecidos pela responsável.</p>
    <h2>6. Seus direitos</h2>
    <p>Você pode solicitar informações, confirmação e acesso aos seus dados, correção, revisão de tratamentos aplicáveis e eliminação quando prevista pela LGPD. Alguns registros poderão ser conservados por obrigação legal. Envie sua solicitação pelo canal de atendimento informado acima.</p>
    <h2>7. Atualizações</h2>
    <p>Esta política poderá ser atualizada. Alterações relevantes devem ser comunicadas de forma clara, com indicação da versão vigente.</p>
    <p class="legal-alert">Documento preliminar. É necessário revisar o inventário real dos dados, os cookies, as bases legais, a transferência internacional, a retenção e os contatos antes de declarar conformidade plena à LGPD.</p>
  </article>
</template>
<style scoped>
.legal-page { max-width: 880px; margin: 1rem auto 3rem; padding: clamp(1.25rem, 4vw, 3rem); }
.legal-page h1 { font-size: clamp(2rem, 5vw, 3rem); margin: .75rem 0; }
.legal-page h2 { font-size: 1.35rem; margin: 2rem 0 .65rem; }
.legal-page p { line-height: 1.75; }
.legal-alert { border-left: 4px solid var(--color-primary); padding: 1rem; background: var(--color-soft); border-radius: 8px; }
</style>
