const pile = []

export function empiler(fermer) {
  pile.push(fermer)
}

export function depiler(fermer) {
  const i = pile.lastIndexOf(fermer)
  if (i >= 0) pile.splice(i, 1)
}

// Ferme la dernière fenêtre ouverte. Renvoie true si quelque chose a été fermé.
export function fermerDerniere() {
  const fermer = pile.pop()
  if (!fermer) return false
  fermer()
  return true
}
