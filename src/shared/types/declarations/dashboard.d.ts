declare type ProjetDashboardStatut =
  | 'actif'
  | 'critique'
  | 'retard'
  | 'clôturé'
  | 'suspendu'

declare type ProjetDashboardSource = Projet & {
  logo_projet?: string
  taux_avancement_technique?: number
  montant_decaisse?: number
  taux_decaissement?: number
  statut_projet?: string
}

declare interface ProjetDashboardRow {
  id: string | number
  sigle: string
  nom_projet: string
  logo?: string
  date_demarrage: string
  date_cloture: string
  date_fin?: string
  delai_consomme: number
  budget_prevu: number
  montant_decaisse: number
  taux_decaissement: number
  taux_avancement_technique: number
  statut: ProjetDashboardStatut
  bailleur?: string
}

declare interface ProjetProgrammeDashboardStats {
  total: number
  enRetard: number
  pourcentageRetard: number
  critiques: number
  pourcentageCritique: number
}

declare interface PaoMinagriDashboardStats {
  annee: number
  montantTotalPrevu: number
  montantTotalDecaisse: number
  tauxDecaissement: number
  totalActivites: number
  activitesRealisees: number
  tauxRealisationActivites: number
}

declare interface AvancementDirection {
  version_info: VersionPtba
  code_ugl: string
  abrege_ugl: string
  nom_ugl: string
  nb_ptbas: number
  taux_execution_moyen: number
}

declare interface TacheActiviteByPlanSiteSummary {
  id_groupe_tache: number
  proportion_gt: string
  date_debut_gt: string
  date_fin_gt: string
  valide: boolean
  nb_lots_realises: number
}

declare interface TacheActiviteByPlanSiteGroup {
  service: Pick<PlanSite, 'id_ds' | 'code_ds' | 'intutile_ds'>
  nb_taches: number
  nb_taches_validees: number
  taches: TacheActiviteByPlanSiteSummary[]
}

declare interface TacheActiviteByUglGroup {
  ugl: {
    id_ugl: number
    code_ugl: string
    nom_ugl: string
    abrege_ugl: string
  }
  nb_taches: number
  nb_taches_validees: number
  taches: TacheActiviteByPlanSiteSummary[]
}

declare interface AvancementTachesPlanSiteChartRow {
  service: string
  nbTaches: number
  nbTachesValidees: number
  pourcentageValide: number
}

