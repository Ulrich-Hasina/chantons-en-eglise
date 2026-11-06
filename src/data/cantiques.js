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

  return { id, titre: meta.titre, paroles }
}

export const cantiques = Object.entries(fichiers)
  .map(([chemin, brut]) => lire(chemin, brut))
  .filter(Boolean)
  .sort((a, b) => a.id - b.id)

// Vérifications utiles pendant la saisie (uniquement en développement)
if (import.meta.env.DEV) {
  const vus = new Set()
  cantiques.forEach((c) => {
    if (vus.has(c.id)) console.warn(`[cantiques] id en double : ${c.id}`)
    vus.add(c.id)
  })
}
