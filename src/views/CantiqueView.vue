<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { cantiques } from '../data/cantiques'
import { livrets } from '../data/livrets'
import { estFavori, basculerFavori } from '../utils/favoris'
import fleche_de_retour from '../assets/fleche-gauche.png'
import BoutonRecherche from '../components/BoutonRecherche.vue'

const route = useRoute()
const router = useRouter()

const cantique = computed(() =>
  cantiques.find((item) => item.id === Number(route.params.cantiqueId)),
)

const strophes = computed(() => {
  if (!cantique.value) return []

  return cantique.value.paroles.split(/\n\s*\n/).map((bloc) => ({
    refrain: bloc.trimStart().startsWith('[R]'),
    texte: bloc.replace(/^\s*\[R\]\s*/, '').trim(),
  }))
})

watch(
  cantique,
  (valeur) => {
    document.title = valeur ? `${valeur.titre} – Chantons en Église` : 'Chantons en Église'
  },
  { immediate: true },
)

const livret = computed(() => livrets.find((item) => item.id === route.params.livretId))

const page = computed(() => {
  if (!livret.value) return null

  const pageTrouvee = livret.value.pages.find((item) =>
    item.cantiques.includes(Number(route.params.cantiqueId)),
  )

  return pageTrouvee?.numero
})

function retourner() {
  router.push(`/livret/${route.params.livretId}`)
}

// Gestion des favoris
const favori = ref(estFavori(Number(route.params.cantiqueId)))

watch(
  () => route.params.cantiqueId,
  (nouvelId) => {
    favori.value = estFavori(Number(nouvelId))
  },
)

function changerFavori() {
  favori.value = basculerFavori(Number(route.params.cantiqueId))
}

// Taille du texte
const tailleTexte = ref(Number(localStorage.getItem('tailleTexte')) || 18)
watch(tailleTexte, (v) => localStorage.setItem('tailleTexte', v))

function diminuerTexte() {
  if (tailleTexte.value > 14) {
    tailleTexte.value -= 2
  }
}

function augmenterTexte() {
  if (tailleTexte.value < 28) {
    tailleTexte.value += 2
  }
}

// Liste des cantiques dans l'ordre du livret
const cantiquesDuLivret = computed(() => {
  if (!livret.value) return []

  return livret.value.pages.flatMap((page) =>
    page.cantiques.map((id) => ({
      id: Number(id),
      numeroPage: page.numero,
    })),
  )
})

// Position du cantique actuel
const indexCantique = computed(() =>
  cantiquesDuLivret.value.findIndex((item) => item.id === Number(route.params.cantiqueId)),
)

const peutPrecedent = computed(() => indexCantique.value > 0)

const peutSuivant = computed(
  () => indexCantique.value >= 0 && indexCantique.value < cantiquesDuLivret.value.length - 1,
)

// Navigation
function naviguerPrecedent() {
  if (!peutPrecedent.value) return

  const precedent = cantiquesDuLivret.value[indexCantique.value - 1]

  router.replace(`/livret/${route.params.livretId}/cantique/${precedent.id}`)
}

function naviguerSuivant() {
  if (!peutSuivant.value) return

  const suivant = cantiquesDuLivret.value[indexCantique.value + 1]

  router.replace(`/livret/${route.params.livretId}/cantique/${suivant.id}`)
}

let verrou = null

async function demanderVerrou() {
  try {
    verrou = await navigator.wakeLock?.request('screen')
  } catch {
    // Wake Lock non disponible ou refusé : on ignore
  }
}

function auRetour() {
  if (document.visibilityState === 'visible') demanderVerrou()
}

onMounted(() => {
  demanderVerrou()
  document.addEventListener('visibilitychange', auRetour)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', auRetour)
  verrou?.release()
  document.title = 'Chantons en Église'
})
</script>

<template>
  <main class="lecture" v-if="cantique && indexCantique >= 0">
    <header>
      <div class="topbar">
        <RouterLink
          :to="`/livret/${route.params.livretId}`"
          class="icone-bouton"
          aria-label="Retour au livret"
        >
          <img :src="fleche_de_retour" alt="" class="retour-icone" />
        </RouterLink>

        <BoutonRecherche />
      </div>

      <div class="informations">
        <span>{{ livret?.nom }}</span>
        <span v-if="page">Page {{ page }}</span>
      </div>

      <div class="titre-container">
        <h1>{{ cantique.titre }}</h1>
        <button class="bouton-favori" :class="{ actif: favori }" @click="changerFavori">
          {{ favori ? '★' : '☆' }}
        </button>
      </div>
    </header>

    <article class="paroles" :style="{ fontSize: `${tailleTexte}px` }">
      <p
        v-for="(strophe, index) in strophes"
        :key="index"
        class="strophe"
        :class="{ refrain: strophe.refrain }"
      >
        {{ strophe.texte }}
      </p>
    </article>

    <div class="outils-lecture">
      <div>
        <button @click="diminuerTexte" :disabled="tailleTexte <= 14">-</button>

        <button @click="augmenterTexte" :disabled="tailleTexte >= 28">+</button>
      </div>
    </div>
    <div class="navigation-cantiques">
      <button @click="naviguerPrecedent" :disabled="!peutPrecedent">&lt;</button>
      <span>{{ cantique.titre }}</span>
      <button @click="naviguerSuivant" :disabled="!peutSuivant">&gt;</button>
    </div>
  </main>

  <main v-else class="lecture">
    <h2>Cantique introuvable</h2>
    <button class="retour" @click="retourner">Retour à la liste</button>
  </main>
</template>

<style scoped>
.lecture {
  max-width: 600px;
  min-height: 100vh;
  margin: auto;
  padding: 25px 22px 40px;
  font-family: Arial, sans-serif;
  color: #263238;
}

.informations {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  margin-bottom: 25px;
  color: #718096;
  font-size: 13px;
}

h1 {
  font-size: 25px;
  margin: 18px 0 30px;
}

.titre-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.titre-container h1 {
  margin: 0;
  flex: 1;
}

.bouton-favori {
  border: none;
  background: transparent;
  color: #999;
  font-size: 26px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.bouton-favori.actif {
  color: #ffc107;
}

.outils-lecture {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-radius: 10px;
}

.outils-lecture div {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 20px;
}

.outils-lecture button {
  border: none;
  background: #f0f2f5;
  padding: 0px 14px;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
}

.outils-lecture button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.navigation-cantiques {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);

  width: 100%;
  max-width: 600px;
  min-height: 65px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 10px 22px;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
  z-index: 100;
}

.navigation-cantiques button {
  width: 45px;
  height: 45px;
  flex-shrink: 0;

  border: none;
  border-radius: 50%;
  background: #f0f2f5;
  color: #263238;
  font-size: 30px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
}

.navigation-cantiques span {
  flex: 1;
  text-align: center;
  padding: 0 12px;
  font-size: 14px;
  font-weight: 600;
}

.navigation-cantiques button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icone-bouton {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 8px;
  width: 44px;
  display: flex;
  justify-content: center;
}

.retour-icone {
  width: 22px;
  height: 22px;
}

/* Pour le bouton "Retour à la liste" de la page d'erreur */
.retour {
  border: none;
  background: none;
  color: #2563eb;
  font-size: 15px;
  padding: 8px 0;
  cursor: pointer;
}

.paroles {
  line-height: 1.9;
  color: #374151;
  padding: 10px 4px;
}

.strophe {
  white-space: pre-line;
  margin: 0 0 1.5em;
}

.refrain {
  font-style: italic;
  font-weight: 600;
  padding-left: 14px;
}
</style>
