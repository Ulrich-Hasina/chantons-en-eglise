<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { livrets } from '../data/livrets'
import { cantiques } from '../data/cantiques'
import fleche_de_retour from '../assets/fleche-gauche.png'
import BoutonRecherche from '../components/BoutonRecherche.vue'
import { normaliser } from '../utils/texte'

const route = useRoute()
const router = useRouter()

const recherche = ref('')

const livret = computed(() => livrets.find((item) => item.id === route.params.livretId))

const listeCantiques = computed(() => {
  if (!livret.value) return []

  return livret.value.pages
    .flatMap((page) =>
      page.cantiques.map((id) => {
        const cantique = cantiques.find((item) => item.id === id)

        return cantique ? { ...cantique, page: page.numero } : null
      }),
    )
    .filter(Boolean)
})

const cantiquesFiltres = computed(() => {
  const terme = normaliser(recherche.value.trim())

  return listeCantiques.value.filter(
    (cantique) =>
      normaliser(cantique.titre).includes(terme) || String(cantique.page).includes(terme),
  )
})
</script>

<template>
  <main class="page-livret" v-if="livret">
    <header class="topbar">
      <button class="icone-bouton" aria-label="Retour" @click="router.push('/')">
        <img :src="fleche_de_retour" alt="" class="retour-icone" />
      </button>

      <h1 class="titre-livret">{{ livret.nom }}</h1>

      <BoutonRecherche />
    </header>

    <input
      v-model="recherche"
      type="search"
      placeholder="Rechercher un titre ou une page..."
      class="recherche"
    />

    <section class="liste">
      <button
        v-for="(cantique, index) in cantiquesFiltres"
        :key="`${cantique.id}-${cantique.page}-${index}`"
        class="cantique"
        @click="router.push(`/livret/${livret.id}/cantique/${cantique.id}`)"
      >
        <span>{{ cantique.titre }}</span>
        <small>p. {{ cantique.page }} →</small>
      </button>

      <p v-if="cantiquesFiltres.length === 0" class="vide">Aucun cantique trouvé.</p>
    </section>
  </main>

  <main v-else class="page-livret">
    <h2>Livret introuvable</h2>
    <button class="retour" @click="router.push('/')">Retour à l'accueil</button>
  </main>
</template>

<style scoped>
.page-livret {
  max-width: 600px;
  min-height: 100dvh;
  margin: auto;
  padding: 25px 20px;
  font-family: Arial, sans-serif;
  color: #263238;
}

h1 {
  font-size: 25px;
  margin-bottom: 5px;
}

.recherche {
  width: 100%;
  padding: 14px;
  border: 1px solid #dce3eb;
  border-radius: 10px;
  font-size: 16px;
  margin-bottom: 20px;
}

.cantique {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 17px 12px;
  border: none;
  border-bottom: 1px solid #e8edf2;
  background: transparent;
  text-align: left;
  font-size: 15px;
  cursor: pointer;
}

.cantique:hover {
  background: #eef4ff;
}

.cantique small {
  color: #718096;
  white-space: nowrap;
}

.vide {
  text-align: center;
  color: #718096;
  padding: 30px 0;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.titre-livret {
  flex: 1;
  text-align: center;
  font-size: 25px;
  margin: 0;
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

/* Pour le bouton "Retour à l'accueil" de la page d'erreur */
.retour {
  border: none;
  background: none;
  color: #2563eb;
  font-size: 15px;
  cursor: pointer;
  padding: 8px 0;
}
</style>
