declare interface SourceVerification {
  id_source_verif: number
  fichier_join: string
  suivi_decaissement?: number | null
}

declare interface SuiviDecaissementPtba extends Record<string, unknown> {
  id_suivi_dec: number
  sources: SourceVerification[]
  periode_suivi_dec: string
  montant_decaisse: number
  taux_dollars_jour: number
  date_suivi_dec: string
  observation: string
  date_enregistrement: string
  date_modification: string
  activite_ptba: number | null
  programme: string | null
}

declare interface SuiviDecaissementPtbaProjet extends Record<string, unknown> {
  id_suivi_dec: number
  periode_suivi_dec: string
  montant_decaisse: number
  taux_dollars_jour: number
  date_suivi_dec: string
  observation: string
  date_enregistrement?: string | null
  date_modification?: string | null
  region?: number | Localite | null
  type_part?: number | FinancementProjet | null
  activite_ptba_projet: number | null
}

declare interface SuiviDecaissementConvention extends Record<string, unknown> {
  id_suivi_dec: number
  montant_decaisse: number
  date_suivi_dec: string
  observation: string
  document_fichier: string | null
  date_enregistrement?: string | null
  date_modification?: string | null
  convention: number | Convention | null
}

declare interface SuiviIndicateurActivite extends Record<string, unknown> {
  id_suivi_indicateur: number
  date_suivi_indicateur: string
  valeur_suivi_indicateur: number
  indicateur_activite?: string | IndicateurActivitePtba | null
  localite?: string | Localite | null
}

declare interface SuiviAvancementContrat extends Record<string, unknown> {
  id_suivi: number
  date_suivi: string
  code_suivi?: string
  etat_avancement: string
  statut_activite: string
  retard_accuse: string
  difficultes_rencontrees: string
  pistes_solutions: string
  observation: string
  documents?: string
  date_enregistrement?: string
  etat: string
  modifier_le?: string
  modifier_par?: string
  activite_ptba: number | Ptba
  sous_activite?: number
  id_personnel: number | Personnel
}

declare interface SuiviAvancementConvention extends Record<string, unknown> {
  id_suivi: number
  date_suivi: string
  code_suivi?: string
  etat_avancement: string
  statut_activite: string
  retard_accuse: string
  difficultes_rencontrees: string
  pistes_solutions: string
  observation: string
  date_enregistrement?: string
  etat: string
  modifier_le?: string
  modifier_par?: string
  convention: number | Convention
  id_personnel: number | Personnel
}

declare interface SuiviContrat extends Record<string, unknown> {
  id_suivi_contrat: number
  trimestre: string
  valeur_realisee: number
  observation: string
  date_enregistrement?: string
  modifier_le?: string
  etat: boolean
  indicateur_contrat: number | IndicateurContrat
  id_personnel?: number
  modifier_par?: number
}

declare type SuiviContratPayload = {
  trimestre: string
  valeur_realisee: number
  observation: string
  etat: boolean
  indicateur_contrat: number
  id_personnel: number
}

declare interface SuiviIndicateurContrat extends Record<string, unknown> {
  id_suivi_contrat: number
  trimestre: TrimestreSuiviIndicateurContrat | string
  valeur_realisee: number
  observation: string
  date_enregistrement?: string
  modifier_le?: string
  etat: boolean
  indicateur_contrat: number
  id_personnel?: number | null
  modifier_par?: number | null
}

declare type TrimestreSuiviIndicateurContrat =
  | 'trimestre_1'
  | 'trimestre_2'
  | 'trimestre_3'
  | 'trimestre_4'

declare type SuiviIndicateurContratPayload = {
  trimestre: TrimestreSuiviIndicateurContrat | string
  valeur_realisee: number
  observation: string
  etat: boolean
  indicateur_contrat: number
  id_personnel: number
  modifier_par: number
}

declare interface SuiviIndicateurTache extends Record<string, unknown> {
  id_suivi_sit: number
  valeur_suivi_sit: number
  date_suivi_sit: string
  tache_suivi?: string | null
  personnel_sit?: number | null
  ugl_sit?: number | null
  commune_sit?: number | null
  indicateur_sit?: number | null
}

declare type SuiviIndicateurTacheProjet = SuiviIndicateurTache

declare interface SuiviTacheActivite {
  id_suivi_groupe_tache: number
  lot_realisee?: number
  proportion_realisee: number
  valide: boolean
  date_reele: string
  observation_suivi: string
  id_groupe_tache: number | TacheActivitePtba
  id_activite_ptba: number | { id_ptba?: number }
}

declare interface ObservationPtba extends Record<string, unknown> {
  id_observation: number
  observation: string
  date_observation: string
  ptba?: string | Ptba | null
}

declare interface PeriodeIndicateur {
  id_periode: number
  periode_collecte: string
  source_donnees: string
  date_validation: string
  valeur_periode: number
  observation: string
  date_enregistrement: string
  etat: string
  modifier_le: string
  ref_indicateur: number
  id_personnel: number
  modifier_par: number
  periode?: number
}

declare type PeriodeIndicateurFormData = Pick<
  PeriodeIndicateur,
  | 'periode_collecte'
  | 'source_donnees'
  | 'date_validation'
  | 'valeur_periode'
  | 'observation'
>

declare type PeriodeIndicateurWritePayload = PeriodeIndicateur

declare type PeriodeSousRessourceType =
  | 'documentations'
  | 'fonds-carte'
  | 'tableaux-synthese'

declare interface TableauSyntheseEnregistrement {
  id_tableau_synthese?: number
  id?: number
  source_donnees?: string
  date_validation?: string
  observation?: string
  etat?: string
  periode?: number
  id_personnel?: number
  modifier_par?: number
}

declare interface FondCarteEnregistrement {
  id_fond_carte?: number
  id_fonds_carte?: number
  id?: number
  source_donnees?: string
  date_validation?: string
  shape_file?: string | string[]
  observation?: string
  etat?: string
  periode?: number
  id_personnel?: number
  modifier_par?: number
}

declare interface DocumentationCmrEnregistrement {
  id_documentation?: number
  id?: number
  source_donnees?: string
  titre?: string
  date_validation?: string
  document?: string | string[]
  observation?: string
  etat?: string
  periode?: number
  id_personnel?: number
  modifier_par?: number
}

declare type PeriodeSousRessourceEnregistrement =
  | TableauSyntheseEnregistrement
  | FondCarteEnregistrement
  | DocumentationCmrEnregistrement

declare interface SimpleSousRessourceFormData {
  source_donnees: string
  date_validation: string
  observation: string
}

declare interface SousRessourceDocumentsFormData {
  documentFile: File | null
  existingDocument: string
  removeExistingDocument: boolean
}

declare interface DocumentationCmrFormData extends SousRessourceDocumentsFormData {
  source_donnees: string
  titre: string
  date_validation: string
  observation: string
}

declare interface FondCarteFormData extends SousRessourceDocumentsFormData {
  source_donnees: string
  date_validation: string
  observation: string
}

declare interface SimpleSousRessourceWritePayload {
  source_donnees: string
  date_validation: string
  observation: string
  etat: string
  periode: number
  id_personnel: number
  modifier_par: number
}

declare type TableauSyntheseWritePayload = SimpleSousRessourceWritePayload

declare interface FondCarteWritePayload {
  source_donnees: string
  date_validation: string
  observation: string
  etat: string
  periode: number
  id_personnel: number
  modifier_par: number
}

declare interface DocumentationCmrWritePayload {
  source_donnees: string
  titre: string
  date_validation: string
  observation: string
  etat: string
  periode: number
  id_personnel: number
  modifier_par: number
}

declare type PeriodeSousRessourceWritePayload =
  | TableauSyntheseWritePayload
  | FondCarteWritePayload
  | DocumentationCmrWritePayload

declare interface SourceVerificationSuiviAvancementConvention
  extends Record<string, unknown> {
  id_source_verif: number
  fichier_join: string
  suivi_avancement_convention: number
}

declare interface SourceVerificationSuiviAvancementContrat
  extends Record<string, unknown> {
  id_source_verif: number
  fichier_join: string
  suivi_avancement_contrat: number
}

