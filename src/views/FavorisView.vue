<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { cantiques } from '../data/cantiques'
import { getFavoris, basculerFavori } from '../utils/favoris'
import { lienCantique } from '../utils/emplacements'
import BoutonRecherche from '../components/BoutonRecherche.vue'
import fleche_de_retour from '../assets/fleche-gauche.png'

const router = useRouter()
const favoris = ref(getFavoris())

const listeFavoris = computed(() =>
  favoris.value.map((id) => cantiques.find((item) => item.id === id)).filter(Boolean),
)

function retirerFavori(id) {
  basculerFavori(id)
  favoris.value = getFavoris()
}

function ouvrirCantique(cantique) {
  router.push(lienCantique(cantique.id))
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

    <h1>Mes favoris</h1>

    <p class="description">{{ listeFavoris.length }} cantique(s) enregistré(s)</p>

    <section v-if="listeFavoris.length">
      <article v-for="cantique in listeFavoris" :key="cantique.id" class="favori-card">
        <button class="titre-bouton" @click="ouvrirCantique(cantique)">
          {{ cantique.titre }}
        </button>

        <button class="etoile" @click="retirerFavori(cantique.id)" aria-label="Retirer des favoris">
          ★
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

.etoile {
  border: none;
  background: transparent;
  color: #ffc107;
  font-size: 26px;
  line-height: 1;
  padding: 8px 12px;
  cursor: pointer;
}

.grande-etoile {
  font-size: 65px;
  color: #ffc107;
}

.favori-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-bottom: 1px solid #e8edf2;
}

.titre-bouton {
  flex: 1;
  padding: 16px 12px;
  border: none;
  background: transparent;
  color: inherit;
  font-size: 16px;
  text-align: left;
  cursor: pointer;
}

.titre-bouton:hover {
  background: #f8fafc;
}
.vide {
  text-align: center;
  margin-top: 80px;
  color: #718096;
}
</style>
