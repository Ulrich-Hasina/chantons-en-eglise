<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { cantiques } from '../data/cantiques'
import { groupeParId, sousGroupeParId } from '../data/groupes'
import { lienCantique } from '../utils/emplacements'
import fleche_de_retour from '../assets/fleche-gauche.png'
import BoutonRecherche from '../components/BoutonRecherche.vue'

const route = useRoute()
const router = useRouter()

const groupe = computed(() => groupeParId[route.params.groupeId])

const sousGroupe = computed(() => {
  const s = sousGroupeParId[route.params.sousGroupeId]
  return s && groupe.value?.sousGroupes.some((x) => x.id === s.id) ? s : null
})

const aDesSousGroupes = computed(() => (groupe.value?.sousGroupes.length ?? 0) > 0)

// Page « liste des sous-groupes »
const afficheSousGroupes = computed(() => aDesSousGroupes.value && !route.params.sousGroupeId)

const sousGroupesAvecTotal = computed(() =>
  (groupe.value?.sousGroupes ?? []).map((s) => ({
    ...s,
    total: cantiques.filter((c) => c.sousGroupes.includes(s.id)).length,
  })),
)

const chantsDuGroupe = computed(() =>
  cantiques.filter((c) => c.groupes.includes(route.params.groupeId)),
)

// Chants du groupe qui n'ont aucun sous-groupe de ce groupe
const chantsDirects = computed(() => {
  const idsSous = (groupe.value?.sousGroupes ?? []).map((s) => s.id)
  return chantsDuGroupe.value.filter((c) => !c.sousGroupes.some((id) => idsSous.includes(id)))
})

const chants = computed(() => {
  if (sousGroupe.value) return cantiques.filter((c) => c.sousGroupes.includes(sousGroupe.value.id))
  if (aDesSousGroupes.value) return chantsDirects.value
  return chantsDuGroupe.value
})

const titre = computed(() => sousGroupe.value?.nom ?? groupe.value?.nom)

const lienRetour = computed(() =>
  sousGroupe.value ? `/groupe/${route.params.groupeId}` : '/groupes',
)

function retourner() {
  // Si on vient d'une autre page de l'app, on y retourne (chant, groupe...) ;
  // sinon (lien direct, rechargement) on remonte d'un niveau
  if (window.history.state?.back) {
    router.back()
  } else {
    router.push(lienRetour.value)
  }
}

const introuvable = computed(
  () => !groupe.value || (route.params.sousGroupeId && !sousGroupe.value),
)

watch(
  titre,
  (valeur) => {
    document.title = valeur ? `${valeur} – Chantons en Église` : 'Chantons en Église'
  },
  { immediate: true },
)
</script>

<template>
  <main class="groupe" v-if="!introuvable">
    <div class="topbar">
      <button class="icone-bouton" aria-label="Retour" @click="retourner">
        <img :src="fleche_de_retour" alt="" class="retour-icone" />
      </button>

      <BoutonRecherche />
    </div>

    <p v-if="sousGroupe" class="fil">{{ groupe.nom }}</p>
    <h1>{{ titre }}</h1>

    <!-- Liste des sous-groupes -->
    <template v-if="afficheSousGroupes">
      <button
        v-for="s in sousGroupesAvecTotal"
        :key="s.id"
        class="chant"
        @click="router.push(`/groupe/${groupe.id}/${s.id}`)"
      >
        <span class="infos">
          <span>{{ s.nom }}</span>
          <small>{{ s.total }} chant(s)</small>
        </span>
        <span class="fleche">›</span>
      </button>

      <template v-if="chantsDirects.length">
        <p class="sous-titre">Autres chants de ce groupe</p>
        <button
          v-for="chant in chantsDirects"
          :key="chant.id"
          class="chant"
          @click="router.push(lienCantique(chant.id))"
        >
          <span>{{ chant.titre }}</span>
        </button>
      </template>
    </template>

    <!-- Liste des chants -->
    <template v-else>
      <p class="nombre">{{ chants.length }} chant(s)</p>

      <button
        v-for="chant in chants"
        :key="chant.id"
        class="chant"
        @click="router.push(lienCantique(chant.id))"
      >
        <span>{{ chant.titre }}</span>
      </button>

      <p v-if="!chants.length" class="vide">Aucun chant pour le moment.</p>
    </template>
  </main>

  <main v-else class="groupe">
    <h2>Groupe introuvable</h2>
    <RouterLink to="/groupes">Retour aux groupes</RouterLink>
  </main>
</template>

<style scoped>
.groupe {
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

.fil {
  margin: 25px 0 0;
  color: #718096;
  font-size: 13px;
}

h1 {
  font-size: 25px;
  margin: 8px 0 12px;
}

.nombre {
  color: #718096;
  font-size: 13px;
  margin: 0 0 15px;
}

.sous-titre {
  margin: 28px 4px 6px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #718096;
}

.chant {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 4px;
  border: none;
  border-bottom: 1px solid #e8edf2;
  background: transparent;
  font-size: 15px;
  text-align: left;
  cursor: pointer;
}

.chant:hover {
  background: #f8fafc;
}

.infos {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.infos small {
  color: #718096;
  font-size: 12px;
}

.fleche {
  font-size: 24px;
  color: #718096;
}

.vide {
  color: #718096;
  text-align: center;
  font-size: 14px;
  padding: 25px 5px;
}
</style>
