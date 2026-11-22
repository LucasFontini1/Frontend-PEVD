import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/tokens.css'
import './styles/global.css'
import './styles/buttons.css'
createApp(App).use(createPinia()).use(router).mount('#app')

// PWA: registrar somente no build publicado via HTTPS (ou localhost em preview).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .catch(error => console.warn('Service worker não registrado:', error))
  })
}
