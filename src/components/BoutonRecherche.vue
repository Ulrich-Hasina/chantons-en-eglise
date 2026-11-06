<script setup>
import { computed, nextTick, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { cantiques } from '../data/cantiques'
import { livrets } from '../data/livrets'
import recherche_icon from '../assets/recherche.png'
import { normaliser } from '../utils/texte'

const router = useRouter()

const recherche = ref('')
const ouvert = ref(false)

const resultats = computed(() => {
  const terme = recherche.value.trim().toLowerCase()
  if (!terme) return []

  return cantiques
    .filter((cantique) => normaliser(cantique.titre).includes(terme))
    .map((cantique) => {
      const emplacements = []

      livrets.forEach((livret) => {
        livret.pages.forEach((page) => {
          if (page.cantiques.includes(cantique.id)) {
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
    .filter((cantique) => cantique.emplacements.length > 0)
})

const input = ref(null)

async function ouvrir() {
  recherche.value = ''
  ouvert.value = true
  document.body.style.overflow = 'hidden'
  await nextTick()
  input.value?.focus()
}

function fermer() {
  ouvert.value = false
  recherche.value = ''
  document.body.style.overflow = ''
}

onUnmounted(() => {
  document.body.style.overflow = ''
})

function ouvrirCantique(cantique, emplacement) {
  fermer()
  router.push(`/livret/${emplacement.livretId}/cantique/${cantique.id}`)
}
</script>

<template>
  <button class="icone-bouton" aria-label="Rechercher" @click="ouvrir">
    <img :src="recherche_icon" alt="Rechercher" class="recherche-icone" />
  </button>

  <!-- Teleport : le modal s'affiche toujours au-dessus de la page -->
  <Teleport to="body">
    <div v-if="ouvert" class="overlay" @click.self="fermer">
      <section class="recherche-modal">
        <div class="modal-header">
          <h2>Rechercher</h2>
          <button @click="fermer">✕</button>
        </div>

        <input
          ref="input"
          v-model="recherche"
          type="search"
          placeholder="Saisir le titre"
          class="recherche-input"
          autofocus
        />

        <div v-if="recherche.trim()" class="resultats">
          <p class="nombre">{{ resultats.length }} résultat(s)</p>

          <div v-for="cantique in resultats" :key="cantique.id" class="resultat">
            <strong>{{ cantique.titre }}</strong>

            <button
              v-for="emplacement in cantique.emplacements"
              :key="`${cantique.id}-${emplacement.livretId}-${emplacement.page}`"
              class="emplacement"
              @click="ouvrirCantique(cantique, emplacement)"
            >
              {{ emplacement.nom }} — p. {{ emplacement.page }}
              <span>›</span>
            </button>
          </div>

          <p v-if="resultats.length === 0" class="vide">Aucun cantique trouvé.</p>
        </div>

        <p v-else class="message">Entrez le titre d'un cantique pour commencer la recherche.</p>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.icone-bouton {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 8px;
  width: 44px;
  display: flex;
  justify-content: center;
}

.recherche-icone {
  width: 22px;
  height: 22px;
}

.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: #00000070;
  display: flex;
}

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

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.modal-header h2 {
  font-size: 19px;
  margin: 0;
}

.modal-header button {
  border: none;
  background: transparent;
  font-size: 21px;
  cursor: pointer;
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
  padding: 15px 0;
  border-bottom: 1px solid #e8edf2;
}

.resultat strong {
  display: block;
  margin-bottom: 10px;
}

.emplacement {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 11px;
  margin-top: 5px;
  border: none;
  border-radius: 7px;
  background: #f0f4fa;
  color: #2563eb;
  text-align: left;
  cursor: pointer;
}

.message,
.vide {
  color: #718096;
  text-align: center;
  font-size: 14px;
  padding: 25px 5px;
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
