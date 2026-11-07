declare interface CategorieActeur {
  id_categorie: number
  nom_categorie: string
  code_cat: string
}

declare interface Acteur {
  id_acteur: number
  code_acteur: string
  nom_acteur: string
  description_acteur?: string
  personne_responsable: string
  contact: string
  adresse_email: string
  categorie_acteur: CategorieActeur | null
}

declare type ActeurFormData = Omit<Acteur, 'id_acteur'>

declare interface NiveauLocalite {
  id_nlc?: number
  nombre_nlc: number
  libelle_nlc: string
  Code_number_nlc: number
}

declare interface Localite extends Record<string, unknown> {
  id_loca: number
  code_loca: string
  intitule_loca: string
  code_national_loca: string
  shape_file?: File | string
  longitude_loca?: number
  latitude_loca?: number
  parent_loca: number | null
  niveau_loca: NiveauLocalite | number
}

declare interface PlanSite extends Record<string, unknown> {
  id_ds?: number
  code_ds: string
  intutile_ds: string
  niveau_ds: number
  parent_ds: number
  code_relai_ds: string
}

declare interface UGL {
  id_ugl: number
  code_ugl: string
  nom_ugl: string
  abrege_ugl?: string
  couleur_ugl: string
  chef_lieu_ugl?: number | null
  region_concerne_ugl: number[]
}

declare interface Fonction extends Record<string, unknown> {
  id_fonction?: number
  nom_fonction: string
  description_fonction: string
}

declare interface TypeZone extends Record<string, unknown> {
  id_type_zone: number
  code_type_zone: string
  nom_type_zone: string
}

declare interface ZoneCollecte {
  id_zone_collecte: number
  code_zone: string
  nom_zone: string
  shape_file?: File
  type_zone: string
  latitude_zone?: number
  longitude_zone?: number
}

declare interface ZoneCollecteTable {
  id_zone_collecte: number
  code_zone: string
  nom_zone: string
  shape_file?: string
  type_zone: string
  latitude_zone?: number
  longitude_zone?: number
}

declare interface UniteIndicateur extends Record<string, unknown> {
  id_unite: number
  unite_ui: string
  definition_ui: string
}

declare interface TitrePersonnel extends Record<string, unknown> {
  id_titre: number
  libelle_titre: string
  description_titre?: string
}

declare interface Personnel extends Record<string, unknown> {
  n_personnel?: number
  is_admin: boolean
  is_password_set: boolean
  id_personnel_perso?: string
  titre_personnel?: TitrePersonnel | null
  nom_perso?: string
  prenom_perso?: string
  email?: string
  contact_perso?: string
  fonction_perso?: Fonction | null
  service_perso?: PlanSite | null
  niveau_perso?: number
  rapport_mensuel_perso?: boolean
  rapport_trimestriel_perso?: boolean
  rapport_semestriel_perso?: boolean
  rapport_annuel_perso?: boolean
  statut?: number
  region_perso?: Localite | null
  structure_perso?: Acteur | null
  ugl_perso?: string | null
  projet_active_perso?: ProjetActivePerso[]
  pass?: string
  password_last_modified: string
  personnel_profile_picture: string | null
}

declare interface DictionnaireIndicateur extends Record<string, unknown> {
  id_ref_ind_ref: number
  code_ref_ind: string
  intitule_ref_ind: string
  unite_cmr?: UniteIndicateur | null
  fonction_agregat_cmr?: string
  echelle?: TypeZone | null
  typologie?: string
  seuil_minimum?: number
  seuil_maximum?: number
  responsable_collecte_cmr?: Acteur
  created_at?: string
  updated_at?: string
}

declare type DictionnaireIndicateurWritePayload = {
  code_ref_ind: string
  intitule_ref_ind: string
  unite_cmr: number
  fonction_agregat_cmr: string
  echelle: number
  typologie: string
  seuil_minimum: number
  seuil_maximum: number
  responsable_collecte_cmr: number
}

declare interface GeneralParamsAPI {
  id: number
  is_default: boolean
  system_sigle: string
  system_name: string
  structure_sigle: string
  structure_name: string
  structure_logo: string | null
  structure_address: string
  structure_email: string | null
  structure_whatsapp_number: string | null
  structure_phone_number: string | null
  local_currency_sigle: string
  main_currency_sigle: string
  main_currency_rate: string
  is_maintenance: boolean
  inactivity_minute: number
  max_sessions: number
  max_login_attempts: number
  otp_validity_minute: number
  password_expiry_month: number
  delay_update_second: number
  whatsapp_instance: string | null
  whatsapp_number_id: string | null
  notif_email: string | null
  notif_email_smtp_host: string | null
  notif_email_smtp_port: number
  notif_email_smtp_encryption: string | null
  notif_email_from_name: string | null
  parent_api_url: string | null
  parent_api_key: string | null
  parent_api_timeout_seconds: number
  created_at: string
  updated_at: string
}

declare interface GeneralParamsPatch {
  system_sigle?: string
  system_name?: string
  structure_sigle?: string
  structure_name?: string
  structure_logo?: string | null
  structure_address?: string
  structure_email?: string | null
  structure_whatsapp_number?: string | null
  structure_phone_number?: string | null
  local_currency_sigle?: string
  main_currency_sigle?: string
  main_currency_rate?: string
  is_maintenance?: boolean
  inactivity_minute?: number
  ecart_projet_critique?: number
  ecart_projet_retard?: number
  max_sessions?: number
  max_login_attempts?: number
  otp_validity_minute?: number
  password_expiry_month?: number
  delay_update_second?: number
  whatsapp_instance?: string | null
  whatsapp_number_id?: string | null
  notif_email?: string | null
  notif_email_password?: string | null
  notif_email_smtp_host?: string | null
  notif_email_smtp_port?: number
  notif_email_smtp_encryption?: string | null
  notif_email_from_name?: string | null
  parent_api_url?: string | null
  parent_api_key?: string | null
  parent_api_timeout_seconds?: number
  whatsapp_api_key?: string | null
  parent_api_secret?: string | null
}

declare interface GeneralParams {
  id: number
  systemSigle: string
  systemTitle: string
  structureSigle: string
  structureName: string
  structureLogo: string | null
  structureAddress: string
  structureEmail: string | null
  structurePhone: string | null
  structureWhatsapp: string | null
  currencyCode: string
  baseCurrency: string
  exchangeRate: number | null
  maintenanceMode: boolean
  inactivityDelayMinutes: number
  maxSessions: number
  loginAttemptsLimit: number
  tpCodeDelayMinutes: number
  passwordChangeDelayMonths: number
  deleteOrUpdateDelaySeconds: number
  whatsappInstanceCode: string | null
  whatsappNumberId: string | null
  notificationEmail: string | null
  notificationEmailPassword: string | null
  smtpHost: string | null
  smtpPort: number
  smtpEncryption: string | null
  smtpFromName: string | null
  parentApiUrl: string | null
  parentApiKey: string | null
  parentApiSecret: string | null
  parentApiTimeoutSeconds: number
  whatsappApiKey: string | null
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

declare type PersonnelFormData = Omit<Personnel, 'n_personnel'>
declare type PlanSiteFormData = Omit<PlanSite, 'id_ds'>
declare type TypeZoneFormData = Omit<TypeZone, 'id_type_zone'>
declare type UniteIndicateurFormData = Omit<UniteIndicateur, 'id_unite'>
declare type UGLFormData = Omit<UGL, 'id_ugl'>
declare type FonctionFormData = Omit<Fonction, 'id_fonction'>
declare type LocaliteFormData = Omit<Localite, 'id_loca'>
declare type StructureFormData = Omit<Acteur, 'id_acteur'>

declare interface NiveauStructure {
  id_nsc?: number
  nombre_nsc: number
  libelle_nsc: string
  code_number_nsc: number
  id_programme?: number
}

declare interface NiveauStructureConfig extends Record<string, unknown> {
  id_nsc?: number
  nombre_nsc: number
  libelle_nsc: string
  code_number_nsc: string
  id_programme: number
}

declare type NiveauStructureConfigFormData = Omit<NiveauStructureConfig, 'id_nsc'>

declare interface PartenaireFinancier {
  id_partenaire?: number
  definition_part: string
  sigle_part: string
  code_part: string
  statut?: string
}

