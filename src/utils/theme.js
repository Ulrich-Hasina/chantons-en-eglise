import { ref, watch } from 'vue'

const CLE_THEME = 'livre-cantiques-theme'

const modeSombre = ref(localStorage.getItem(CLE_THEME) === 'sombre')

// Appliquer le thème à toute l'application
function appliquerTheme() {
  document.documentElement.classList.toggle('mode-sombre', modeSombre.value)
}

// Appliquer le thème au démarrage
appliquerTheme()

// Conserver le choix de l'utilisateur
watch(modeSombre, (valeur) => {
  localStorage.setItem(CLE_THEME, valeur ? 'sombre' : 'clair')

  appliquerTheme()
})

function basculerTheme() {
  modeSombre.value = !modeSombre.value
}

export { modeSombre, basculerTheme }
