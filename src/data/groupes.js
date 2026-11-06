export const groupes = [
  { id: 'preface', nom: 'Préface - Remerciements', sousGroupes: [] },
  {
    id: 'prieres',
    nom: 'Prières de tous les temps',
    sousGroupes: [
      { id: 'priere-seul', nom: 'Pour prier seul ou en assemblée' },
      { id: 'benedictions', nom: 'Bénédictions diverses' },
      { id: 'chemin-de-croix', nom: 'Chemin de croix' },
    ],
  },
  {
    id: 'sacrements',
    nom: 'Les sacrements',
    sousGroupes: [
      { id: 'bapteme', nom: 'Le sacrement du baptême' },
      { id: 'reconciliation', nom: 'Le sacrement de la réconciliation' },
      { id: 'confirmation', nom: 'Le sacrement de la confirmation' },
      { id: 'mariage', nom: 'Le sacrement du mariage' },
      { id: 'malades', nom: 'Le sacrement des malades' },
      { id: 'funerailles', nom: 'Célébration des funérailles' },
    ],
  },
  { id: 'eucharistie', nom: 'Célébration eucharistique', sousGroupes: [] },
  {
    id: 'messes',
    nom: 'Messes chantées',
    sousGroupes: [
      { id: 'rassemblement', nom: 'Rassemblement' },
      { id: 'kyrie', nom: 'Kyrie' },
      { id: 'gloria', nom: 'Gloria' },
      { id: 'antiennes-psaumes', nom: 'Antiennes des psaumes' },
      { id: 'acclamation', nom: 'Acclamation' },
      { id: 'credo', nom: 'Credo' },
      { id: 'priere-universelle', nom: 'Prière universelle' },
      { id: 'offrande', nom: 'Offrande' },
      { id: 'sanctus', nom: 'Sanctus' },
      { id: 'anamnese', nom: 'Anamnèse' },
      { id: 'paix', nom: 'Paix' },
      { id: 'notre-pere', nom: 'Notre Père' },
      { id: 'agneau-de-dieu', nom: 'Agneau de Dieu' },
      { id: 'communion', nom: 'Communion' },
      { id: 'action-de-grace', nom: 'Action de grâce' },
    ],
  },
  {
    id: 'liturgiques',
    nom: 'Temps liturgiques',
    sousGroupes: [
      { id: 'christ-roi', nom: 'Christ-Roi' },
      { id: 'avent', nom: 'Avent' },
      { id: 'noel', nom: 'Noël' },
      { id: 'careme', nom: 'Carême' },
      { id: 'passion', nom: 'Passion' },
      { id: 'paques', nom: 'Pâques' },
      { id: 'ascension', nom: 'Ascension' },
      { id: 'pentecote', nom: 'Pentecôte' },
    ],
  },
  {
    id: 'autres',
    nom: 'Autres chants',
    sousGroupes: [
      { id: 'merveilles', nom: 'Merveilles de Dieu et louanges' },
      { id: 'defunts', nom: 'Défunts' },
      { id: 'temoignages', nom: 'Témoignages' },
      { id: 'marie', nom: 'Marie Mère de Dieu' },
      { id: 'saints-litanies', nom: 'Saints et litanies' },
      { id: 'psaumes', nom: 'Psaumes' },
      { id: 'veillees', nom: 'Veillées et divers' },
    ],
  },
]

export const groupeParId = {}
export const sousGroupeParId = {}
export const parentDe = {} // id (groupe ou sous-groupe) -> id du groupe parent

groupes.forEach((g) => {
  groupeParId[g.id] = g
  parentDe[g.id] = g.id

  g.sousGroupes.forEach((s) => {
    if (sousGroupeParId[s.id] || groupeParId[s.id]) {
      console.warn(`[groupes] id en double : ${s.id}`)
    }
    sousGroupeParId[s.id] = s
    parentDe[s.id] = g.id
  })
})
