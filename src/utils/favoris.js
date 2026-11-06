const CLE_FAVORIS = 'livre-cantiques-favoris'

export function getFavoris() {
  try {
    return JSON.parse(localStorage.getItem(CLE_FAVORIS)) || []
  } catch {
    return []
  }
}

export function estFavori(id) {
  return getFavoris().includes(Number(id))
}

export function basculerFavori(id) {
  const favoris = getFavoris()
  const identifiant = Number(id)

  const index = favoris.indexOf(identifiant)

  if (index === -1) {
    favoris.push(identifiant)
  } else {
    favoris.splice(index, 1)
  }

  localStorage.setItem(CLE_FAVORIS, JSON.stringify(favoris))

  return favoris.includes(identifiant)
}
