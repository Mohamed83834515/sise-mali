declare interface Projet {
  id_projet: number
  code_projet: string
  sigle_projet: string
  intitule_projet: string
  duree_projet: number
  date_signature_projet: string
  date_demarrage_projet: string
  date_cloture_projet: string
  partenaire_projet: PlanSite | null
  programme_projet?: Programme | number
  structure_projet: number
  signataires_projet: Acteur[]
  partenaires_execution_projet: Acteur[]
  zone_projet: Localite[]
  budget_projet?: number
  nombre_ptbas?: number
  taux_execution_ptba?: number
  montant_total_decaisse?: number
  responsable_projet?: number | Personnel
  type_projet?: number | TypeProjet
  is_cloture?: boolean
}

declare interface ProjetClotureForm {
  date_cloture_projet: string
  is_cloture: boolean
}

declare type ProjetFormData = Omit<Projet, 'id_projet'>

declare interface ProjetSelectOption {
  value: number
  label: string
  projet: Projet
}

declare interface TypeProjet extends Record<string, unknown> {
  id_type_projet: number
  code_type_projet: string
  nom_type_projet: string
}

declare type TypeFinancement =
  | 'pret'
  | 'don'
  | 'contribution_etat'
  | 'contrepartie_etat'
  | 'contrepartie_beneficiaires'

declare interface Convention extends Record<string, unknown> {
  id_convention?: number
  code_convention: string
  intutile_conv: string
  reference_conv: string
  montant_conv: number
  date_signature_conv: string
  etat_conv: string
  document_fichier?: string | null
  partenaire_conv?: number | Partial<Acteur> | null
  projet?: number | Partial<Projet> | null
}

declare type ConventionApiPayload = {
  code_convention: string
  intutile_conv: string
  reference_conv: string
  montant_conv: number
  date_signature_conv: string
  etat_conv?: string
  partenaire_conv?: number | null
  projet: number
  document_fichier?: File | string | null
}

declare interface FinancementProjet {
  id_part: number
  code_type: string
  intitule: string
  montant: number
  date_accord: string
  observation?: string
  date_enregistrement?: string
  etat?: string
  modifier_le?: string
  type_financement: TypeFinancement
  bailleur: number | Acteur
  projet: number | Projet
  id_personnel?: number
  modifier_par?: number
}

declare type FinancementProjetApiPayload = {
  code_type: string
  intitule: string
  montant: number
  date_accord: string
  observation?: string
  etat: string
  type_financement: TypeFinancement
  bailleur: number
  projet: number
  id_personnel: number
  modifier_par: number
}

declare interface PartBailleur {
  id_part: number
  annee: number
  montant: number
  observation?: string
  date_enregistrement?: string
  modifier_le?: string
  activite_ptba: number | PtbaProjet
  projet: number | Projet
  region: number | Localite
  type_part: number | FinancementProjet
  id_personnel?: number
  modifier_par?: number
}

declare type PartBailleurApiPayload = {
  annee: number
  montant: number
  observation?: string
  activite_ptba: number
  projet: number
  region: number
  type_part: number
  id_personnel: number
  modifier_par: number
}

declare interface DossierProjet {
  id_dossier: number
  nom_dossier: string
  description_dossier?: string
  projet: number | Projet
}

declare type DossierProjetWritePayload = {
  nom_dossier: string
  description_dossier?: string
  projet: number
}

declare interface DocumentProjet extends Record<string, unknown> {
  id_document: number
  document: string
  description_document?: string
  projet: number | Projet
  dossier?: number
}

declare type MissionSupervisionProjet = {
  id_mission: number
  code_ms: string
  type_mission?: string
  objet?: string
  resume?: string
  debut: string
  fin: string
  observation?: string
  projection?: string
  document?: string | File
  date_enregistrement?: string
  etat?: string
  modifier_le?: string | null
  modifier_par?: number
  projet?: number | Projet
  id_personnel?: number
}

declare type MissionSupervisionProjetApiPayload = {
  code_ms: string
  type_mission?: string
  objet?: string
  resume?: string
  debut: string
  fin: string
  observation?: string
  projection?: string
  etat?: string
  modifier_le?: string
  modifier_par?: number
  projet: number
  id_personnel?: number
}

declare type RecommandationMissionProjet = {
  id_recommandation: number
  volet_recommandation?: string
  rubrique?: string
  numero?: string
  ref_no?: string
  date_buttoir?: string
  recommandation?: string
  type_recommandation?: string
  observation?: string
  rapport?: string | File
  date_enregistrement?: string
  etat?: string
  modifier_le?: string | null
  modifier_par?: number
  mission?: number | MissionSupervisionProjet
  responsable?: string
  responsable_interne?: string
  projet?: number | Projet
  structure?: number | Acteur
  id_personnel?: number
}

declare type RecommandationMissionProjetApiPayload = {
  volet_recommandation: string
  rubrique: string
  numero: string
  ref_no: string
  date_buttoir: string
  recommandation: string
  type_recommandation: string
  observation: string
  rapport?: string
  etat: string
  modifier_le: string
  modifier_par: number
  mission: number
  responsable: string
  responsable_interne: string
  projet: number
  structure: number
  id_personnel: number
}

declare interface SourFinancementProjet extends Record<string, unknown> {
  id_source_financement: number
  code_activite_projet: number
  intitule_source_financement: string
  Numero_reference_sf: string
  montant_source_financement: string
  date_signature_convention: string
  code_partenaire: string
  etat_source_financement: number
}

declare interface ProjetActivePerso {
  id_projet: number
  code_projet: string
  sigle_projet: string
  intitule_projet: string
  duree_projet: number
  date_signature_projet: string
  date_demarrage_projet: string
  partenaire_projet: number
  programme_projet: number
  structure_projet: number
  signataires_projet: number[]
  partenaires_execution_projet: number[]
  zone_projet: number[]
}

declare interface TauxGlobalPrevuAn {
  projet: number
  annee: number
  taux_an: number
}

declare interface ViewTauxAnActivite {
  activite_pa: number
  projet: number
  annee: number
  taux_an_activite: number
}

declare interface ViewRealiseAnActivite {
  activite_pa: number
  projet: number
  annee: number
  taux_an_activite: number
}

declare interface ProjetAvancementAnnuelPoint {
  annee: number
  cible: number
  realise: number
}

declare interface ProjetDecaissementAnnuelPoint {
  annee: number
  cible: number
  realise: number
}

