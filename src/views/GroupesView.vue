<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { cantiques } from '../data/cantiques'
import { groupes } from '../data/groupes'
import fleche_de_retour from '../assets/fleche-gauche.png'
import BoutonRecherche from '../components/BoutonRecherche.vue'

const router = useRouter()

const liste = computed(() =>
  groupes.map((g) => ({
    ...g,
    total: cantiques.filter((c) => c.groupes.includes(g.id)).length,
  })),
)
</script>

<template>
  <main class="groupes">
    <div class="topbar">
      <RouterLink to="/" class="icone-bouton" aria-label="Retour à l'accueil">
        <img :src="fleche_de_retour" alt="" class="retour-icone" />
      </RouterLink>

      <BoutonRecherche />
    </div>

    <h1>Groupes</h1>

    <button
      v-for="groupe in liste"
      :key="groupe.id"
      class="groupe-card"
      @click="router.push(`/groupe/${groupe.id}`)"
    >
      <span class="infos">
        <strong>{{ groupe.nom }}</strong>
        <small>{{ groupe.total }} chant(s)</small>
      </span>
      <span class="fleche">›</span>
    </button>
  </main>
</template>

<style scoped>
.groupes {
  max-width: 600px;
  min-height: 100vh;
  margin: auto;
  padding: 25px 22px 40px;
  font-family: Arial, sans-serif;
  color: #263238;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icone-bouton {
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
  margin: 25px 0 20px;
}

.groupe-card {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  margin-bottom: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: white;
  text-align: left;
  cursor: pointer;
}

.groupe-card:hover {
  background: #f8fafc;
}

.infos {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.infos strong {
  font-size: 16px;
}

.infos small {
  color: #718096;
  font-size: 12px;
}

.fleche {
  font-size: 28px;
  color: #718096;
}
</style>
