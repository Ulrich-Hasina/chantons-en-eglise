import { groupeParId, sousGroupeParId, parentDe } from './groupes'

const fichiers = import.meta.glob('./cantiques/*.txt', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function lire(chemin, brut) {
  const m = brut.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)

  if (!m) {
    console.warn(`[cantiques] En-tête "---" manquant ou mal formé : ${chemin}`)
    return null
  }

  const meta = {}
  m[1].split(/\r?\n/).forEach((ligne) => {
    const i = ligne.indexOf(':')
    if (i > 0) meta[ligne.slice(0, i).trim()] = ligne.slice(i + 1).trim()
  })

  const id = Number(meta.id)
  const paroles = m[2].replace(/\r\n/g, '\n').trim()

  if (!Number.isInteger(id) || id <= 0) {
    console.warn(`[cantiques] id invalide : ${chemin}`)
    return null
  }
  if (!meta.titre) {
    console.warn(`[cantiques] titre manquant : ${chemin}`)
    return null
  }
  if (!paroles) {
    console.warn(`[cantiques] paroles vides : ${chemin}`)
    return null
  }

  // Anciens champs au pluriel : à corriger dans le fichier
  if (meta.groupes || meta.sousgroupes) {
    console.warn(
      `[cantiques] "groupes"/"sousgroupes" remplacés par "groupe"/"sousgroupe" : ${chemin}`,
    )
  }

  const groupe = meta.groupe
  const sousGroupe = meta.sousgroupe || null

  if (!groupe || !groupeParId[groupe]) {
    console.warn(`[cantiques] groupe manquant ou inconnu ("${groupe}") : ${chemin}`)
    return null
  }

  if (sousGroupe) {
    if (!sousGroupeParId[sousGroupe]) {
      console.warn(`[cantiques] sous-groupe inconnu ("${sousGroupe}") : ${chemin}`)
      return null
    }
    if (parentDe[sousGroupe] !== groupe) {
      console.warn(
        `[cantiques] le sous-groupe "${sousGroupe}" appartient à "${parentDe[sousGroupe]}" et non à "${groupe}" : ${chemin}`,
      )
      return null
    }
  } else if (groupeParId[groupe].sousGroupes.length) {
    // Accepté, mais le chant apparaîtra dans « Autres chants de ce groupe »
    console.warn(`[cantiques] sous-groupe conseillé pour le groupe "${groupe}" : ${chemin}`)
  }

  return {
    id,
    titre: meta.titre,
    groupe,
    sousGroupe,
    // Forme en liste conservée pour que le reste de l'app n'ait rien à changer
    groupes: [groupe],
    sousGroupes: sousGroupe ? [sousGroupe] : [],
    paroles,
  }
}

export const cantiques = Object.entries(fichiers)
  .map(([chemin, brut]) => lire(chemin, brut))
  .filter(Boolean)
  .sort((a, b) => a.id - b.id)

if (import.meta.env.DEV) {
  const vus = new Set()
  cantiques.forEach((c) => {
    if (vus.has(c.id)) console.warn(`[cantiques] id en double : ${c.id}`)
    vus.add(c.id)
  })
}
