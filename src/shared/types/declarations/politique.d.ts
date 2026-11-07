declare interface Nbc {
  id_nbc?: number
  code_number_nbc: string
  nombre_nbc: number
  libelle_nbc: string
}

declare interface Programme {
  id_programme: number
  code_programme: string
  sigle_programme: string
  nom_programme: string
  vision_programme: string
  objectif_programme: string
  annee_debut_programme: string
  annee_fin_programme: string
  actif_programme: boolean
  id_nbc_programme: number | Nbc | null
}

declare type ProgrammeFormData = Omit<
  Programme,
  'id_programme' | 'id_nbc_programme'
>

declare interface ProgrammeSelectOption {
  value: number
  label: string
  programme: Programme
}

declare interface ActiviteProgramme {
  id_ap: number
  code_ap: string
  intutile: string
  niveau_ap: number
  code_relai_ap: string
  parent_ap?: number | ActiviteProgramme | null
  id_programme?: number | null
}

declare interface ActiviteProjet extends Record<string, unknown> {
  id_activite_projet: number
  code_activite_projet: string
  intitule_activite_projet: string
  niveau_activite_projet: number
  parent_activite_projet?: number | ActiviteProjet | null
  code_activite_programme?: string | ActiviteProgramme | null
  code_projet?: string | Projet | null
  budget?: number
  parent?: ActiviteProjet | null
}

declare interface NiveauActiviteProgramme {
  id_niveau_ap: number
  nombre_niveau_ap: number
  taille_code_niveau_ap: number
  code_programme?: string | null
  libelle_niveau_ap: string
}

declare interface NiveauActiviteProjet extends Record<string, unknown> {
  id_niveau_activite_projet: number
  nombre_niveau_activite_projet: number
  libelle_niveau_activite_projet: string
  taille_code_niveau_activite_projet: number
  code_projet?: string | null
}

declare interface CadreAnalytique {
  id_ca: number
  code_ca: string
  intutile_ca: string
  abgrege_ca: string
  niveau_ca: number | string
  cout_axe: number
  partenaire_ca: number[] | Acteur[] | number | Acteur | null
  parent_ca: number | CadreAnalytique | null
  programme_ca: number | Programme | null
}

declare interface NiveauCadreAnalytique extends Record<string, unknown> {
  id_nca: number
  nombre_nca: number
  libelle_nca: string
  code_number_nca: number
  programme?: string | Programme
}

declare interface CadreStrategique extends Record<string, unknown> {
  id_cs: number
  code_cs: string
  intutile_cs: string
  abgrege_cs: string
  niveau_cs: number | string
  date_enregistrement: string
  date_modification: string
  etat?: number
  partenaire_cs?: number[] | Acteur[] | number | Acteur | null
  parent_cs?: CadreStrategique | number | null
  programme_cs?: Programme | null
  created_at?: string
  updated_at?: string
}

declare type CadreStrategiqueFormData = Omit<CadreStrategique, 'id_cs'>

declare interface NiveauCadreStrategique extends Record<string, unknown> {
  id_nsc: number
  nombre_nsc: number
  libelle_nsc: string
  code_number_nsc: number
  type_niveau: 1 | 2 | 3 | string
  programme?: string | Programme
}

declare interface CadreStrategiqueConfig extends Record<string, unknown> {
  id_nsc: number
  nombre: number
  libelle_nsc: string
  type_nsc: 1 | 2 | 3
  date_enregistrement: string
  date_modification: string
  etat?: number
  programme?: Programme | null
  created_at?: string
  updated_at?: string
}

declare type CadreStrategiqueConfigFormData = Omit<CadreStrategiqueConfig, 'id_nsc'>

declare interface CadreResultat extends Record<string, unknown> {
  id_cr: number
  code_cr: string
  intutile_cr: string
  abgrege_cr: string
  date_enregistrement: string
  date_modification: string
  etat?: string | null
  niveau_cr?: NiveauCadreResultat | number | null
  parent_cr?: string | number | null
  projet_cr?: string | number | null
  niveau?: NiveauCadreResultat | null
  parent?: CadreResultat | null
}

declare type CadreResultatFormData = Omit<
  CadreResultat,
  'id_cr' | 'date_enregistrement' | 'date_modification'
>

declare interface NiveauCadreResultat extends Record<string, unknown> {
  id_ncr: number
  nombre_ncr: number
  libelle_ncr: string
  code_projet: string
  code_number_ncr: number
  type_niveau: 1 | 2 | 3
}

declare type NiveauCadreResultatFormData = Omit<NiveauCadreResultat, 'id_ncr'>

declare interface CadreLogiqueClcp extends Record<string, unknown> {
  id_clc: number
  code_clc: string
  niveau_clc: number | NiveauConfigClcp
  intitule_clc: string
  date_enregistrement?: string
  etat: boolean
  contrat: number
  parent_clc?: number | CadreLogiqueClcp | null
  id_personnel?: number
}

declare type CadreLogiqueClcpPayload = {
  code_clc: string
  niveau_clc: number
  intitule_clc: string
  etat: boolean
  contrat: number
  parent_clc?: number | null
  id_personnel: number
}

declare interface NiveauConfigClcp extends Record<string, unknown> {
  id_niveau_ncl: number
  code_number_ncl: string
  nombre_ncl: number
  date_enregistrement?: string
  etat: boolean
  contrat: number
  id_personnel?: number
}

declare type NiveauConfigClcpPayload = {
  code_number_ncl: string
  nombre_ncl: number
  etat: boolean
  contrat: number
  id_personnel: number
}

declare interface IndicateurCmr extends Record<string, unknown> {
  id_ref_ind_cmr: number
  code_ref_ind: string
  resultat_cmr?: number | IndicateurStrategique | null
  intitule_ref_ind: string
  reference_cmr: string
  annee_reference: number
  responsable_collecte_cmr: string
  cible_cmr: string
  fonction_agregat_cmr: string
  referentiel_cmr?: number | DictionnaireIndicateur | null
  created_at?: string
  updated_at?: string
}

declare type IndicateurCmrFormData = Omit<IndicateurCmr, 'id_ref_ind_cmr'>

declare interface IndicateurCmrProjet extends Record<string, unknown> {
  id_ref_ind_cmr: number
  code_ref_ind: string
  resultat_cmr?: number | CadreResultat | null
  indicateur_iop?: number | IndicateurCadreResultat | null
  intitule_ref_ind: string
  reference_cmr: string
  annee_reference: number
  responsable_collecte_cmr: string
  cible_cmr: string
  fonction_agregat_cmr: string
  referentiel_cmr?: number | DictionnaireIndicateur | null
  code_projet?: string | Projet | null
  created_at?: string
  updated_at?: string
}

declare type IndicateurCmrProjetFormData = Omit<
  IndicateurCmrProjet,
  'id_ref_ind_cmr'
>

declare interface CibleCmr extends Record<string, unknown> {
  id_cible_indicateur_crp: number
  annee: number
  valeur_cible_indcateur_cmr: number
  code_indicateur_cmr?: number | IndicateurCmr | null
  localite?: number | Localite | null
  programme?: string | null
}

declare interface CibleCmrProjet extends Record<string, unknown> {
  id_cible_indicateur_crp: number
  annee: string
  valeur_cible_indcateur_crp: number
  code_indicateur_crp?: number | null
  code_ug?: string | null
  code_projet?: string | null
  indicateur_crp?: IndicateurCadreResultat | null
  ugl?: UGL | null
}

declare interface IndicateurStrategique {
  id_indicateur_str: number
  niveau_istr: number
  code_indicateur_istr: string
  code_istr: string | number
  intitule_indicateur_istr: string
  periodicite_iop: string
  source_istr: string
  responsable_istr: string
  description_istr: string
  structure_istr: string | null
  programme_istr: string | number | Record<string, unknown> | null
}

declare interface CibleIndicateurStrategique {
  id_cible_indicateur_istr: number
  annee: string
  code_indicateur_istr: string | Record<string, unknown>
  code_ug: string | Record<string, unknown>
  valeur_cible_indcateur_istr: number
  code_programme?: string | Record<string, unknown> | null
}

declare interface IndicateurPerformanceProgramme extends Record<string, unknown> {
  id_indicateur_performance: number
  type_ind: number
  code_indicateur_performance: string
  intitule_indicateur_tache: string
  cadre_analytique?: number | CadreAnalytique | string | null
  unite_indicateur_performance?: number | UniteIndicateur | null
  programme?: number | Programme | null
  cibles?: CibleIndicateurPerformanceProgramme[] | null
}

declare interface CibleIndicateurPerformanceProgramme extends Record<string, unknown> {
  id_cible_indicateur_performance: number
  annee: number
  budget_an: number
  valeur_cible_indcateur_performance: string | number
  code_indicateur_performance: number | IndicateurPerformanceProgramme
  programme: number | Programme
}

declare type CibleIndicateurPerformanceProgrammePayload = {
  annee: number
  budget_an: number
  valeur_cible_indcateur_performance: string | number
  code_indicateur_performance: number
  programme: number
}

declare interface IndicateurPerformanceProjet extends Record<string, unknown> {
  id_indicateur_performance: number
  type_ind: number
  code_indicateur_performance: string
  intitule_indicateur_tache: string
  activite_projet: string | ActiviteProjet
  unite_indicateur_performance: number | UniteIndicateur | null
  code_projet?: string | Projet | null
  cibles?: CibleIndicateurPerformanceProjet[] | CibleIndicateurPerformanceProjet | null
}

declare interface CibleIndicateurPerformanceProjet extends Record<string, unknown> {
  annee: number
  valeur_cible_indcateur_performance?: number | string
  budget_an?: number | string
  valeur_cible?: string
  intitule_indicateur_tache?: string
  indicateur_ppa?: string
}

declare interface IndicateurCadreResultat extends Record<string, unknown> {
  id_indicateur_cr_iop: number
  niveau_iop: number
  code_indicateur_cr_iop: string
  code_cr_iop: string
  intitule_indicateur_cr_iop: string
  periodicite_iop: string
  source_iop: string
  responsable_iop: string
  description_iop: string
  structure_iop?: string
  projet_iop?: string
  created_at?: string
  updated_at?: string
}

declare type IndicateurCadreResultatFormData = Omit<
  IndicateurCadreResultat,
  'id_indicateur_cr_iop'
>

declare interface CadreAnalytiqueComposante {
  id_ca: number
  code_ca: string
  intutile_ca: string
  niveau_ca: number | string
  parent_ca: CadreAnalytique
  nombre_niveau_inferieur: number
  nb_ptbas: number
  cout_total_ptba: number
  montant_decaisse_ptba: number
  taux_execution_ptba_moyen: number
  taux_decaissement_ptba_moyen: number
  taux_realisation_indicateurs_taches_moyen: number
  delais: string
}

declare interface NiveauCadreAnalytiqueComposante extends Record<string, unknown> {
  nombre_nca: number
  code_programme: number
  nb_cadres_analytiques: number
  nb_ptbas: number
  cadres_analytiques: CadreAnalytiqueComposante[]
}

declare interface CadreSecteur extends Record<string, unknown> {
  id_cl: number
  code_cl: string
  intitule_cl: string
  abrege_cl: string
  niveau_cl: number
  parent_cl?: number | null
  id_programme?: number | null
  created_at?: string
  updated_at?: string
}

declare type CadreSecteurFormData = Omit<CadreSecteur, 'id_cl'>

declare interface Action {
  id_ap: number
  code_ap: string
  intutile: string
  niveau_ap: number
  code_relai_ap: string
  parent_ap: number | null
  id_programme: number
}

declare interface Activite {
  id_activite_projet: number
  code_activite_projet: string
  intitule_activite_projet: string
  niveau_activite_projet: number
  parent_activite_projet: number | null
  code_activite_programme: string
  code_projet: string
}

declare interface NiveauAction {
  id_niveau_ap: number
  libelle_niveau_ap: string
  taille_code_niveau_ap: number
  code_programme: number
}

