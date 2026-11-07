declare interface Ptba extends Record<string, unknown> {
  id_ptba: number
  localites_ptba: number[] | Localite[]
  partenaire_conserne_ptba: number[] | Acteur[]
  code_activite_ptba: string
  intitule_activite_ptba: string
  chronogramme: string
  observation?: string
  statut_activite: string
  code_crp?: string
  cadre_analytique?: string | CadreAnalytique
  responsable_ptba?: Personnel | number
  direction_ptba?: string
  code_programme?: string
  version_ptba: number
  type_activite: string
  created_at?: string
  updated_at?: string
  cout_total_ptba?: number
  montant_decaisse_ptba?: number
  taux_execution_ptba?: number
  responsable?: PlanSite
  direction?: PlanSite
}

declare interface PtbaProjet extends Record<string, unknown> {
  id_ptba: number
  localites_ptba: number[] | Localite[]
  partenaire_conserne_ptba: number[] | Acteur[]
  code_activite_ptba: string
  intitule_activite_ptba: string
  chronogramme: string
  observation?: string
  statut_activite: string
  code_crp?: string
  cadre_analytique?: string | CadreAnalytique
  responsable_ptba?: Personnel | number
  direction_ptba?: string
  code_programme?: string
  version_ptba: number
  type_activite: string
  created_at?: string
  updated_at?: string
  code_actvite_projet?: number | ActiviteProjet | null
  code_projet?: string | Projet | null
  cout_ptba?: number
  cout_total_ptba?: number
  taux_execution_ptba?: number
  responsable?: PlanSite
  direction?: PlanSite
  version_info?: VersionPtba
  delais?: number | string
  montant_decaisse_ptba?: number
  taux_decaissement_ptba?: number
  ugl_ptba?: string
  communes_ptba?: number[]
  source_financement_ptba?: number | null
}

declare interface VersionPtba extends Record<string, unknown> {
  id_version_ptba: number
  annee_ptba: number
  version_ptba?: string
  date_validation?: string
  observation?: string
  documentUrl?: File | string
  statut_version?: number
  date_enregistrement?: string
  etat?: string
  modifier_le?: string
  modifier_par?: string
  programme?: string | Programme
  id_personnel?: number | Personnel
}

declare interface VersionPtbaRequest {
  annee_ptba: number
  version_ptba?: string
  date_validation: string
  observation?: string
  documentUrl?: string
  statut_version?: number
  etat?: string
  modifier_par?: string
  programme?: string
  id_personnel?: number
}

declare interface TacheActivitePtba extends Record<string, unknown> {
  id_groupe_tache: number
  intutile_tache_gt: string
  proportion_gt: string
  code_tache_gt: string
  date_debut_gt: string
  date_fin_gt: string
  date_reelle_gt: string
  n_lot_gt: number
  valide: boolean
  observation_gt?: string
  livrable_gt: string
  id_personnel_gt: number | Personnel
  responsable_gt?: number | Personnel | string
  id_activite: number | Ptba
  created_at?: string
  updated_at?: string
}

declare interface IndicateurActivitePtba extends Record<string, unknown> {
  id_indicateur_activite: number
  code_indicateur_activite: string
  intitule_indicateur_tache: string
  activite_ptba?: string | Ptba | null
  code_indicateur_performance?: string | IndicateurPerformanceProjet | null
  abrege_unite?: number | UniteIndicateur | null
}

declare interface IndicateurTache extends Record<string, unknown> {
  id_indicateur_tache: number
  intitule_indicateur_tache: string
  Responsable_ind_tache?: string
  unite_ind_tache?: number | UniteIndicateur | null
  code_indicateur_ptba: string
  indicateur_cmr?: number | IndicateurCmr | null
  id_activite: number | Ptba
  tache?: number | TacheActivitePtba | null
  trimestre_1: number
  trimestre_2: number
  trimestre_3: number
  trimestre_4: number
  valeur_cible?: number | null
  valeur_realisee?: number | null
  created_at?: string
  updated_at?: string
}

declare interface CoutUnitairePtba extends Record<string, unknown> {
  id_cout_unitaire: number
  prix_unitaire: number
  quantite_cu: number
  unite_cu: string
  intitule_tache: string
  ordre: number
  annee: number
  id_personnel: number | Personnel
  date_enregistrement?: string
  etat: boolean
  modifier_le?: string
  modifier_par?: number
  ptba_activite: number | Ptba
}

declare interface ContratPerformance {
  id_contrat?: number
  code_contrat: string
  intitule_contrat: string
  signataire_ministere: string
  date_signature: string
  date_debut: string
  date_fin: string
  statut: string
  note_globale: number | null
  appreciation: string
  observation_globale: string
  etat: string
  version_ptba?: number | null | VersionPtba
  structure?: number | null | PlanSite
  id_personnel?: number | null
  programme?: number | Programme | null
}

declare type ContratPerformancePayload = Omit<ContratPerformance, 'id_contrat'>

declare interface IndicateurContrat extends Record<string, unknown> {
  id_indicateur_contrat: number
  intitule_indicateur: string
  valeur_reference: number
  cible_t1?: string
  cible_t2?: string
  cible_t3?: string
  cible_t4?: string
  moyen_verification?: string
  date_enregistrement?: string
  etat: boolean
  clcp: number | CadreLogiqueClcp
  unite: number
  id_personnel?: number
}

declare type IndicateurContratPayload = {
  intitule_indicateur: string
  valeur_reference: number
  cible_t1?: string
  cible_t2?: string
  cible_t3?: string
  cible_t4?: string
  moyen_verification?: File | string | null
  etat: boolean
  clcp: number
  unite: number
  id_personnel: number
}

declare interface Ppm extends Record<string, unknown> {
  id_ppm: number
  intitule_ppm: string
  code_budget: number
  montant_budget: number
  numero_appel_offre: number
  date_enregistrement?: string
  date_modification?: string
  methode_passation?: number | ModePassation | null
  type_financement?: number | TypeFinancementPPM | null
  version_ppm?: number | VersionPPM | null
  nature_marche?: number | NatureMarche | null
}

declare interface VersionPPM extends Record<string, unknown> {
  id_version_ppm?: number
  numero_version_ppm: string
  date_version: string
  date_enregistrement?: string
  date_modification?: string
  modifier_par?: string
}

declare type EtapePassation = {
  id_etape: number
  etape: string
  date_prevu: string | null
  date_realise: string | null
  groupe_etape:
    | number
    | { id_groupe_etape: number; [key: string]: unknown }
    | null
  ppm: number | { id_ppm: number; [key: string]: unknown }
  sources_verification?: SourceVerificationEtapePassation[]
}

declare type GroupeEtapePassation = {
  id_groupe_etape: number
  intitule_groupe_etape?: string
  code_groupe_etape?: string
}

declare type SourceVerificationEtapePassation = {
  id_source_verif_etape: number
  fichier_join: string
  etape_passation: number
}

declare interface ModePassation extends Record<string, unknown> {
  id_mode_passation: number
  intitule_mode_passation: string
  code_mode_passation: string
}

declare interface NatureMarche extends Record<string, unknown> {
  id_nature_marche: number
  intitule_nature_marche: string
  code_nature_marche: string
}

declare interface TypeFinancementPPM extends Record<string, unknown> {
  id_type_financement_ppm: number
  intitule_type_financement_ppm: string
  code_type_financement_ppm: string
}

declare interface TypeActivite extends Record<string, unknown> {
  id_type: number
  code_type: string
  intutile_type: string
  description: string
  created_at?: string
  updated_at?: string
}

declare interface VersionPtbasProjetsResponse {
  version: VersionPtba
  nb_ptbas_projets: number
  ptbas_projets: PtbaProjet[]
}

declare interface IndicateurTacheRequest {
  intitule_indicateur_tache: string
  unite_ind_tache: number
  code_indicateur_ptba: string
  indicateur_cmr: number
  id_activite: number
  trimestre_1: number
  trimestre_2: number
  trimestre_3: number
  trimestre_4: number
}

declare interface TacheActivitePtbaRequest {
  intutile_tache_gt: string
  proportion_gt: string
  code_tache_gt: string
  date_debut_gt: string
  date_fin_gt: string
  date_reelle_gt: string
  n_lot_gt: number
  valider_gt: string
  observation_gt?: string
  livrable_gt: string
  id_personnel_gt: number
  responsable_gt: number
  id_activite: number
}

