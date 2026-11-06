<script setup>
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { empiler, depiler } from '../utils/retourAndroid'
import { useRouter } from 'vue-router'
import { cantiques } from '../data/cantiques'
import recherche_icon from '../assets/recherche.png'
import { normaliser } from '../utils/texte'
import { lienCantique } from '../utils/emplacements'

const router = useRouter()

const recherche = ref('')
const ouvert = ref(false)

const resultats = computed(() => {
  const terme = normaliser(recherche.value.trim())
  if (!terme) return []

  return cantiques.filter((cantique) => normaliser(cantique.titre).includes(terme))
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

watch(ouvert, (valeur) => {
  if (valeur) empiler(fermer)
  else depiler(fermer)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  depiler(fermer)
})

function ouvrirCantique(cantique) {
  fermer()
  router.push(lienCantique(cantique.id))
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

          <button
            v-for="cantique in resultats"
            :key="cantique.id"
            class="resultat"
            @click="ouvrirCantique(cantique)"
          >
            <span>{{ cantique.titre }}</span>
            <span class="fleche-resultat">›</span>
          </button>

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
