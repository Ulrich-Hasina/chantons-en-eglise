<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { cantiques } from '../data/cantiques'
import { livrets } from '../data/livrets'
// import { modeSombre, basculerTheme } from '../utils/theme'
import chantons_en_eglise from '../assets/chantons_en_eglise.jpeg'
import recherche_icon from '../assets/recherche.png'
import { lienCantique } from '../utils/emplacements'

const router = useRouter()

const recherche = ref('')
const rechercheOuverte = ref(false)
const menuOuvert = ref(false)

const livretsAccueil = [
  {
    id: 'bleu',
    nom: 'Livret bleu',
    description: 'Consulter les cantiques du livret bleu',
    emoji: '📘',
  },
  {
    id: 'marron',
    nom: 'Livret marron',
    description: 'Consulter les cantiques du livret marron',
    emoji: '📙',
  },
]

const resultats = computed(() => {
  const terme = recherche.value.trim().toLowerCase()

  if (!terme) return []

  return cantiques.filter((cantique) => cantique.titre.toLowerCase().includes(terme))
})

function ouvrirLivret(id) {
  menuOuvert.value = false
  router.push(`/livret/${id}`)
}

function ouvrirCantique(cantique) {
  rechercheOuverte.value = false
  router.push(lienCantique(cantique.id))
}

function ouvrirRecherche() {
  recherche.value = ''
  rechercheOuverte.value = true
}

function fermerRecherche() {
  rechercheOuverte.value = false
  recherche.value = ''
}

function ouvrirFavoris() {
  menuOuvert.value = false
  router.push('/favoris')
}

function ouvrirGroupes() {
  menuOuvert.value = false
  router.push('/groupes')
}
</script>

<template>
  <main class="accueil">
    <!-- Barre supérieure -->
    <nav class="topbar">
      <button class="icone-bouton" aria-label="Ouvrir le menu" @click="menuOuvert = true">
        <span class="material-icon">☰</span>
      </button>

      <strong>Chantons en Eglise</strong>

      <button class="icone-bouton" aria-label="Rechercher" @click="ouvrirRecherche">
        <img :src="recherche_icon" alt="Rechercher" class="recherche-icone" />
      </button>
    </nav>

    <!-- Présentation -->
    <header class="header">
      <img :src="chantons_en_eglise" alt="Logo Chantons en Eglise" class="logo" />
    </header>

    <!-- Choix des livrets -->
    <section class="livrets">
      <h2>Choisissez votre livret</h2>

      <button
        v-for="livret in livretsAccueil"
        :key="livret.id"
        class="livret-card"
        @click="ouvrirLivret(livret.id)"
      >
        <span class="livret-emoji">{{ livret.emoji }}</span>

        <span class="livret-infos">
          <strong>{{ livret.nom }}</strong>
          <small>{{ livret.description }}</small>
        </span>

        <span class="fleche">›</span>
      </button>
    </section>

    <!-- Menu latéral -->
    <div v-if="menuOuvert" class="overlay" @click.self="menuOuvert = false">
      <aside class="menu-panel">
        <div class="menu-header">
          <strong>Chantons en Eglise</strong>
          <button @click="menuOuvert = false">✕</button>
        </div>
        <button class="menu-item" @click="ouvrirFavoris">
          <span>❤️</span>
          Mes favoris
        </button>

        <button
          v-for="livret in livretsAccueil"
          :key="livret.id"
          class="menu-item"
          @click="ouvrirLivret(livret.id)"
        >
          <span>{{ livret.emoji }}</span>
          {{ livret.nom }}
        </button>
        <button class="menu-item" @click="ouvrirGroupes">
          <span>♪</span>
          Groupes
        </button>
        <!-- <button class="bouton-theme" @click="basculerTheme">
          {{ modeSombre ? '☀️ Mode clair' : '🌙 Mode sombre' }}
        </button> -->
      </aside>
    </div>

    <!-- Modal de recherche -->
    <div v-if="rechercheOuverte" class="overlay" @click.self="fermerRecherche">
      <section class="recherche-modal">
        <div class="modal-header">
          <h2>Rechercher</h2>
          <button @click="fermerRecherche">✕</button>
        </div>

        <input
          v-model="recherche"
          type="search"
          placeholder="Saisir le titre"
          class="recherche-input"
          autofocus
        />

        <div v-if="recherche.trim()" class="resultats">
          <p class="nombre">{{ resultats.length }} résultat(s)</p>

          <button
            v-for="cantique in resultats"
            :key="cantique.id"
            class="resultat"
            @click="ouvrirCantique(cantique)"
          >
            <span>{{ cantique.titre }}</span>
          </button>

          <p v-if="resultats.length === 0" class="vide">Aucun cantique trouvé.</p>
        </div>

        <p v-else class="message">Entrez le titre d'un cantique pour commencer la recherche.</p>
      </section>
    </div>
  </main>
</template>

<style scoped>
.accueil {
  max-width: 600px;
  min-height: 100vh;
  margin: auto;
  font-family: Arial, sans-serif;
  color: #263238;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 55px;
  border-bottom: 1px solid #e8edf2;
}

.topbar strong {
  font-size: 17px;
}

.icone-bouton {
  border: none;
  background: transparent;
  font-size: 27px;
  cursor: pointer;
  color: #263238;
  padding: 8px;
}

.header {
  text-align: center;
  margin: 55px 0;
}

.logo {
  width: 50%;
}

.header h1 {
  font-size: 27px;
  margin: 12px 0;
}

.header p {
  color: #718096;
  font-size: 14px;
}

.livrets h2 {
  font-size: 18px;
  margin-bottom: 20px;
}

.livret-card {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px;
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: white;
  text-align: left;
  cursor: pointer;
}

.livret-card:hover {
  background: #f8fafc;
}

.livret-emoji {
  font-size: 36px;
}

.livret-infos {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.livret-infos strong {
  font-size: 17px;
}

.livret-infos small {
  color: #718096;
  font-size: 12px;
}

.fleche {
  font-size: 28px;
  color: #718096;
}

footer {
  text-align: center;
  color: #718096;
  font-size: 12px;
  margin-top: 55px;
}

/* Overlay commun */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: #00000070;
  display: flex;
}

/* Menu latéral */
.menu-panel {
  width: min(300px, 85%);
  height: 100%;
  background: white;
  padding: 25px 18px;
  animation: entrer 0.2s ease;
  overflow-y: auto;
}

.menu-header,
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.menu-header strong {
  font-size: 21px;
}

.menu-header button,
.modal-header button {
  border: none;
  background: transparent;
  font-size: 21px;
  cursor: pointer;
}

.menu-item {
  width: 100%;
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 16px 10px;
  border: none;
  border-bottom: 1px solid #edf0f4;
  background: white;
  text-align: left;
  font-size: 15px;
  cursor: pointer;
}

.menu-titre {
  margin: 22px 10px 6px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #718096;
}

/* Modal recherche */
.recherche-modal {
  width: min(500px, calc(100% - 30px));
  max-height: 80vh;
  overflow-y: auto;
  margin: auto;
  padding: 24px;
  background: white;
  border-radius: 18px;
  animation: apparaitre 0.2s ease;
}

.modal-header h2 {
  font-size: 19px;
  margin: 0;
}

.recherche-input {
  width: 100%;
  padding: 15px;
  border: 1px solid #dce3eb;
  border-radius: 10px;
  font-size: 16px;
  outline-color: #2563eb;
}

.resultats {
  margin-top: 15px;
}

.nombre {
  color: #718096;
  font-size: 13px;
}
.resultat {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 4px;
  border: none;
  border-bottom: 1px solid #e8edf2;
  background: transparent;
  font-size: 15px;
  text-align: left;
  cursor: pointer;
}

.fleche-resultat {
  font-size: 22px;
  color: #718096;
}

.message,
.vide {
  color: #718096;
  text-align: center;
  font-size: 14px;
  padding: 25px 5px;
}
.bouton-theme {
  display: block;
  width: 100%;
  padding: 14px 18px;
  margin-top: 15px;
  border: none;
  border-top: 1px solid #e5e7eb;
  background: transparent;
  color: inherit;
  text-align: left;
  font-size: 15px;
  cursor: pointer;
}

.recherche-icone {
  width: 22px;
  height: 22px;
}

/* Tablettes */
@media (min-width: 768px) {
  .accueil {
    max-width: 850px;
    padding: 30px 35px;
  }

  .livrets {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  .livrets h2 {
    grid-column: 1 / -1;
    margin-bottom: 0;
  }

  .livret-card {
    margin-bottom: 0;
  }
}

/* Grands écrans */
@media (min-width: 1024px) {
  .accueil {
    max-width: 1100px;
    padding: 35px 45px;
  }

  .header {
    margin: 65px 0;
  }

  .livrets {
    gap: 24px;
  }

  .livret-card {
    padding: 28px;
  }
}

@keyframes entrer {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes apparaitre {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
