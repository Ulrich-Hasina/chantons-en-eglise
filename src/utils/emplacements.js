import { livrets } from '../data/livrets'

// Livret utilisé quand un chant est dans plusieurs livrets
export const LIVRET_PAR_DEFAUT = 'bleu'

export function emplacementsDuCantique(cantiqueId) {
  const emplacements = []

  livrets.forEach((livret) => {
    livret.pages.forEach((page) => {
      if (page.cantiques.includes(cantiqueId)) {
        emplacements.push({ livretId: livret.id, nom: livret.nom, page: page.numero })
      }
    })
  })

  return emplacements
}

export function lienCantique(cantiqueId) {
  const emplacements = emplacementsDuCantique(cantiqueId)

  if (!emplacements.length) return `/cantique/${cantiqueId}`

  const dansDefaut = emplacements.find((e) => e.livretId === LIVRET_PAR_DEFAUT)
  if (dansDefaut) return `/livret/${dansDefaut.livretId}/cantique/${cantiqueId}`

  return `/livret/${emplacements[0].livretId}/cantique/${cantiqueId}`
}
