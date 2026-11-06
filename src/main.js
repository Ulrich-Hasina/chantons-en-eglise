import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { App as CapApp } from '@capacitor/app'
import { fermerDerniere } from './utils/retourAndroid'

createApp(App).use(router).mount('#app')

CapApp.addListener('backButton', () => {
  // 1. Une fenêtre (menu, recherche) est ouverte : on la ferme seulement
  if (fermerDerniere()) return

  const route = router.currentRoute.value

  if (route.path === '/') {
    CapApp.exitApp()
  } else if (window.history.state?.back) {
    router.back()
  } else {
    router.push('/')
  }
})
