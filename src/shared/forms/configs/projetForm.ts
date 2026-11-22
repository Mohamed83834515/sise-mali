import type { FormConfig, SelectOption } from '@/shared/types/formConfig'

// ── Helpers ────────────────────────────────────────────────────────────────────

function acteurHasCategoryCode(
  acteur: { categorie_acteur?: CategorieActeur | CategorieActeur[] | null },
  code: string
): boolean {
  const raw = acteur.categorie_acteur
  if (!raw) return false
  return Array.isArray(raw)
    ? raw.some((c) => c.code_cat === code)
    : raw.code_cat === code
}

export interface ProjetFormOptions {
  acteurs?: Acteur[]
  localites?: Localite[]
  niveauxLocalite?: NiveauLocalite[]
  programmes?: Programme[]
  niveauxPlanSite?: NiveauStructureConfig[]
  planSites?: PlanSite[]
  niveauxAvancement?: NiveauAvancementProjet[]
  etatsFinancement?: EtatFinancement[]
  typeProjets?: TypeProjet[]
  enverguresProjet?: EnvergureProjet[]
  secteurs?: Secteur[]
  personnels?: Personnel[]
  // Filtres actifs
  filterNiveauLocalite?: number | null
  filterDepartementTutelle?: number | null
  filterSecteur?: number | null
}

export const getProjetFormConfig = ({
  acteurs = [],
  localites = [],
  niveauxLocalite = [],
  programmes = [],
  niveauxPlanSite = [],
  planSites = [],
  niveauxAvancement = [],
  etatsFinancement = [],
  typeProjets = [],
  enverguresProjet = [],
  secteurs = [],
  personnels = [],
  filterNiveauLocalite,
  filterDepartementTutelle,
  filterSecteur,
}: ProjetFormOptions = {}): FormConfig => {
  // ── Filtrage dynamique des localités ──
  const filteredLocalites = filterNiveauLocalite
    ? localites.filter((loc) => {
        if (typeof loc.niveau_loca === 'object' && loc.niveau_loca !== null) {
          return (
            loc.niveau_loca.id_nlc === filterNiveauLocalite ||
            loc.niveau_loca.nombre_nlc === filterNiveauLocalite
          )
        }
        return loc.niveau_loca === filterNiveauLocalite
      })
    : localites

  const localiteOpts: SelectOption[] = filteredLocalites.map((loc) => ({
    value: loc.id_loca,
    label: loc.code_national_loca
      ? `${loc.code_national_loca} - ${loc.intitule_loca}`
      : loc.intitule_loca,
  }))

  const niveauLocaliteOpts: SelectOption[] = niveauxLocalite.map((nl) => ({
    value: nl.id_nlc || nl.nombre_nlc,
    label: nl.libelle_nlc,
  }))

  // ── Filtrage dynamique des structures (Plans de site) ──
  const filteredPlanSites = filterDepartementTutelle
    ? planSites.filter((ps) => ps.niveau_ds === filterDepartementTutelle)
    : planSites

  const planSiteOpts: SelectOption[] = filteredPlanSites.map((ps) => ({
    value: ps.id_ds || 0,
    label: ps.intutile_ds || ps.code_ds || `Structure #${ps.id_ds}`,
  }))

  const niveauPlanSiteOpts: SelectOption[] = niveauxPlanSite.map((nsc) => ({
    value: nsc.id_nsc || nsc.nombre_nsc,
    label: nsc.libelle_nsc,
  }))

  // ── Filtrage dynamique des secteurs / sous-secteurs ──
  // Secteurs racine (sans parent ou niveau 1)
  const rootSecteurs = secteurs.filter((s) => !s.parent_secteur)
  const rootSecteurOpts: SelectOption[] = (
    rootSecteurs.length > 0 ? rootSecteurs : secteurs
  ).map((s) => ({
    value: s.id_secteur,
    label: s.code_secteur ? `${s.code_secteur} - ${s.intitule_secteur}` : s.intitule_secteur,
  }))

  // Sous-secteurs (filtrés par le secteur parent si sélectionné)
  const filteredSousSecteurs = filterSecteur
    ? secteurs.filter((s) => {
        const parentId =
          typeof s.parent_secteur === 'object' && s.parent_secteur !== null
            ? (s.parent_secteur as any).id_secteur
            : s.parent_secteur
        return parentId === filterSecteur
      })
    : secteurs.filter((s) => !!s.parent_secteur)

  const sousSecteurOpts: SelectOption[] = (
    filteredSousSecteurs.length > 0 ? filteredSousSecteurs : secteurs
  ).map((s) => ({
    value: s.id_secteur,
    label: s.code_secteur ? `${s.code_secteur} - ${s.intitule_secteur}` : s.intitule_secteur,
  }))

  // ── Autres options ──
  const programmeOpts: SelectOption[] = programmes.map((p) => ({
    value: p.id_programme,
    label: p.sigle_programme ? `${p.sigle_programme} - ${p.nom_programme}` : p.nom_programme,
  }))

  const niveauAvancementOpts: SelectOption[] = niveauxAvancement.map((na) => ({
    value: na.id_niveau_avancement,
    label: na.nom_niveau_avancement,
  }))

  const etatFinancementOpts: SelectOption[] = etatsFinancement.map((ef) => ({
    value: ef.id_etat_financement,
    label: ef.nom_etat_financement,
  }))

  const typeProjetOpts: SelectOption[] = typeProjets.map((tp) => ({
    value: tp.id_type_projet,
    label: tp.nom_type_projet,
  }))

  const envergureOpts: SelectOption[] = enverguresProjet.map((ep) => ({
    value: ep.id_envergure,
    label: ep.nom_envergure,
  }))

  const personnelOpts: SelectOption[] = personnels.map((p) => ({
    value: p.n_personnel || 0,
    label: `${p.nom_perso} ${p.prenom_perso} (${p.fonction_perso || 'Agent'})`,
  }))

  const ptfOpts: SelectOption[] = acteurs
    .filter((a) => acteurHasCategoryCode(a, '04'))
    .map((a) => ({ value: a.id_acteur, label: a.nom_acteur }))

  const executionOpts: SelectOption[] = acteurs
    .filter((a) => acteurHasCategoryCode(a, '01'))
    .map((a) => ({ value: a.id_acteur, label: a.nom_acteur }))

  return {
    steps: [
      { step: 1, title: 'Informations générales' },
      { step: 2, title: 'Localisation & Financement' },
      { step: 3, title: 'Secteur, Géolocalisation & Acteurs' },
    ],

    fields: [
      // ════════════ ÉTAPE 1 — Informations générales ════════════
      {
        name: 'code_projet',
        label: 'RNP du programme/projet',
        type: 'text',
        placeholder: 'Ex : 2348, PRJ001…',
        required: true,
        gridCols: 2,
        formStep: 1,
      },
      {
        name: 'sigle_projet',
        label: 'Sigle du programme/projet',
        type: 'text',
        placeholder: 'Ex : APPCPS_SEEUDE…',
        required: true,
        gridCols: 2,
        formStep: 1,
      },
      {
        name: 'intitule_projet',
        label: 'Nom du programme/projet',
        type: 'text',
        placeholder: 'Nom complet du programme ou projet',
        required: true,
        gridCols: 2,
        formStep: 1,
      },
      {
        name: 'is_active',
        label: "Afficher à l'écran ?",
        type: 'select',
        options: [
          { value: 'true', label: 'Oui' },
          { value: 'false', label: 'Non' },
        ],
        required: true,
        gridCols: 2,
        formStep: 1,
      },
      {
        name: 'date_demarrage_projet',
        label: 'Date début du programme/projet',
        type: 'date',
        required: true,
        gridCols: 2,
        formStep: 1,
      },
      {
        name: 'duree_projet',
        label: 'Durée (en mois)',
        type: 'number',
        placeholder: 'Ex : 36, 80…',
        required: true,
        min: 1,
        gridCols: 2,
        formStep: 1,
      },
      {
        name: 'date_signature_projet',
        label: 'Date de signature',
        type: 'date',
        required: false,
        gridCols: 2,
        formStep: 1,
      },
      {
        name: 'description_projet',
        label: 'Description du programme/projet',
        type: 'textarea',
        placeholder: 'Description synthétique du programme ou projet…',
        required: false,
        gridCols: 1,
        formStep: 1,
      },

      // ════════════ ÉTAPE 2 — Localisation & Financement ════════════
      {
        name: 'filter_niveau_localite',
        label: 'Sélectionner les niveaux de localité',
        type: 'select',
        placeholder: 'Filtrer par niveau (Région, Cercle…)',
        required: false,
        options: niveauLocaliteOpts,
        gridCols: 2,
        formStep: 2,
      },
      {
        name: 'zone_projet',
        label: 'Localités concernées du programme/projet',
        type: 'multiselect',
        placeholder: 'Sélectionner une ou plusieurs localités',
        required: true,
        options: localiteOpts,
        gridCols: 2,
        formStep: 2,
      },
      {
        name: 'programme_projet',
        label: 'Sélectionner une politique',
        type: 'select',
        placeholder: 'Sélectionner une politique / programme',
        required: true,
        options: programmeOpts,
        gridCols: 2,
        formStep: 2,
      },
      {
        name: 'filter_departement_tutelle',
        label: 'Département tutelle',
        type: 'select',
        placeholder: 'Filtrer par niveau de tutelle',
        required: false,
        options: niveauPlanSiteOpts,
        gridCols: 2,
        formStep: 2,
      },
      {
        name: 'structure_projet',
        label: 'Structure',
        type: 'select',
        placeholder: 'Sélectionner une structure',
        required: true,
        options: planSiteOpts,
        gridCols: 2,
        formStep: 2,
      },
      {
        name: 'niveau_avancement',
        label: "Niveau d'avancement global",
        type: 'select',
        placeholder: "Sélectionner le niveau d'avancement",
        required: false,
        options: niveauAvancementOpts,
        gridCols: 2,
        formStep: 2,
      },
      {
        name: 'avance_demarrage',
        label: 'Avance de démarrage',
        type: 'number',
        placeholder: 'Ex : 10000000…',
        required: false,
        gridCols: 2,
        formStep: 2,
      },
      {
        name: 'date_estimation',
        label: "Date d'estimation",
        type: 'date',
        required: false,
        gridCols: 2,
        formStep: 2,
      },
      {
        name: 'budget_projet',
        label: 'Coût global',
        type: 'number',
        placeholder: 'Ex : 1100000000…',
        required: true,
        gridCols: 2,
        formStep: 2,
      },
      {
        name: 'etat_financement',
        label: 'État de financement',
        type: 'select',
        placeholder: "Sélectionner l'état de financement",
        required: false,
        options: etatFinancementOpts,
        gridCols: 2,
        formStep: 2,
      },

      // ════════════ ÉTAPE 3 — Secteur, Géolocalisation & Acteurs ════════════
      {
        name: 'type_projet',
        label: 'Nature du programme/projet',
        type: 'select',
        placeholder: 'Sélectionner une nature',
        required: true,
        options: typeProjetOpts,
        gridCols: 2,
        formStep: 3,
      },
      {
        name: 'envergure_projet',
        label: 'Envergure du programme/projet',
        type: 'select',
        placeholder: "Sélectionner l'envergure",
        required: false,
        options: envergureOpts,
        gridCols: 2,
        formStep: 3,
      },
      {
        name: 'filter_secteur',
        label: 'Sélectionner un secteur du programme/projet',
        type: 'select',
        placeholder: 'Sélectionner un secteur',
        required: false,
        options: rootSecteurOpts,
        gridCols: 2,
        formStep: 3,
      },
      {
        name: 'secteur_projet',
        label: 'Sous secteur du programme/projet',
        type: 'select',
        placeholder: 'Sélectionner un sous-secteur',
        required: false,
        options: sousSecteurOpts,
        gridCols: 2,
        formStep: 3,
      },
      {
        name: 'recuperation_geolocation',
        label: 'Récupérer la géolocalisation automatiquement ?',
        type: 'select',
        options: [
          { value: 'non', label: 'Non' },
          { value: 'oui', label: 'Oui' },
        ],
        required: false,
        gridCols: 2,
        formStep: 3,
      },
      {
        name: 'latitude',
        label: 'Latitude',
        type: 'number',
        placeholder: 'Ex : 12.6392',
        required: false,
        gridCols: 2,
        formStep: 3,
      },
      {
        name: 'longitude',
        label: 'Longitude',
        type: 'number',
        placeholder: 'Ex : -8.0029',
        required: false,
        gridCols: 2,
        formStep: 3,
      },
      {
        name: 'responsable_projet',
        label: 'Responsable du projet',
        type: 'select',
        placeholder: 'Sélectionner un responsable',
        required: false,
        options: personnelOpts,
        gridCols: 2,
        formStep: 3,
      },
      {
        name: 'signataires_projet',
        label: 'Partenaires financiers (PTF)',
        type: 'multiselect',
        placeholder: 'Sélectionner un ou plusieurs PTF',
        required: false,
        options: ptfOpts,
        gridCols: 2,
        formStep: 3,
      },
      {
        name: 'partenaires_execution_projet',
        label: "Partenaires d'exécution",
        type: 'multiselect',
        placeholder: 'Sélectionner les partenaires d\'exécution',
        required: false,
        options: executionOpts,
        gridCols: 2,
        formStep: 3,
      },
    ],
  }
}
