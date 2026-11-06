<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { cantiques } from '../data/cantiques'
import { livrets } from '../data/livrets'
import { getFavoris, basculerFavori } from '../utils/favoris'
import BoutonRecherche from '../components/BoutonRecherche.vue'
import fleche_de_retour from '../assets/fleche-gauche.png'

const router = useRouter()
const favoris = ref(getFavoris())

const listeFavoris = computed(() => {
  return favoris.value
    .map((id) => {
      const cantique = cantiques.find((item) => item.id === id)

      if (!cantique) return null

      const emplacements = []

      livrets.forEach((livret) => {
        livret.pages.forEach((page) => {
          if (page.cantiques.includes(id)) {
            emplacements.push({
              livretId: livret.id,
              nom: livret.nom,
              page: page.numero,
            })
          }
        })
      })

      return { ...cantique, emplacements }
    })
    .filter(Boolean)
})

function retirerFavori(id) {
  basculerFavori(id)
  favoris.value = getFavoris()
}

function ouvrirCantique(cantique, emplacement) {
  router.push(`/livret/${emplacement.livretId}/cantique/${cantique.id}`)
}
</script>

<template>
  <main class="page-favoris">
    <header class="topbar">
      <RouterLink to="/" class="icone-bouton" aria-label="Retour">
        <img :src="fleche_de_retour" alt="Retour" class="retour-icone" />
      </RouterLink>

      <BoutonRecherche />
    </header>

    <h1>❤️ Mes favoris</h1>

    <p class="description">{{ listeFavoris.length }} cantique(s) enregistré(s)</p>

    <section v-if="listeFavoris.length">
      <article v-for="cantique in listeFavoris" :key="cantique.id" class="favori-card">
        <div class="titre">
          <strong>{{ cantique.titre }}</strong>

          <button
            class="coeur"
            @click="retirerFavori(cantique.id)"
            aria-label="Retirer des favoris"
          >
            ♥
          </button>
        </div>

        <button
          v-for="emplacement in cantique.emplacements"
          :key="`${cantique.id}-${emplacement.livretId}-${emplacement.page}`"
          class="emplacement"
          @click="ouvrirCantique(cantique, emplacement)"
        >
          {{ emplacement.nom }} — p. {{ emplacement.page }} →
        </button>
      </article>
    </section>

    <div v-else class="vide">
      <div class="grand-coeur">♡</div>
      <h3>Aucun favori pour le moment</h3>
      <p>Ajoutez des cantiques à vos favoris pour les retrouver ici.</p>
    </div>
  </main>
</template>

<style scoped>
.page-favoris {
  max-width: 600px;
  min-height: 100vh;
  margin: auto;
  padding: 25px 20px;
  font-family: Arial, sans-serif;
  color: #263238;
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

h1 {
  font-size: 25px;
  margin-top: 30px;
}

.description {
  color: #718096;
  font-size: 14px;
  margin-bottom: 25px;
}

.favori-card {
  padding: 16px 12px;
  border-bottom: 1px solid #e8edf2;
}

.titre {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.titre strong {
  font-size: 16px;
}

.coeur {
  border: none;
  background: transparent;
  color: #e54862;
  font-size: 25px;
  cursor: pointer;
}

.emplacement {
  width: 100%;
  padding: 11px;
  margin-top: 5px;
  border: none;
  border-radius: 7px;
  background: #f0f4fa;
  color: #2563eb;
  text-align: left;
  cursor: pointer;
}

.vide {
  text-align: center;
  margin-top: 80px;
  color: #718096;
}

.grand-coeur {
  font-size: 65px;
  color: #e54862;
}
</style>
