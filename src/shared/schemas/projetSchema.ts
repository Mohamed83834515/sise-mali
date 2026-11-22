// schemas/projectSchema.ts
import { z } from 'zod'

export const projectCreateSchema = z.object({
  // ── Étape 1 : Informations générales ──
  code_projet: z.string().min(1, 'RNP du projet requis'),
  sigle_projet: z.string().min(1, 'Sigle requis'),
  intitule_projet: z.string().min(1, 'Nom du projet requis'),
  is_active: z.union([z.boolean(), z.string()]).default(true),
  date_demarrage_projet: z.string().min(1, 'Date début requise'),
  duree_projet: z.coerce.number().min(1, 'Durée requise'),
  date_signature_projet: z.string().optional().nullable().default(''),
  description_projet: z.string().optional().nullable(),

  // ── Étape 2 : Localisation & Financement ──
  filter_niveau_localite: z.coerce.number().optional().nullable(),
  zone_projet: z.array(z.coerce.number()).min(1, 'Localités concernées requises'),
  programme_projet: z.coerce.number().min(1, 'Politique requise'),
  filter_departement_tutelle: z.coerce.number().optional().nullable(),
  structure_projet: z.coerce.number().min(1, 'Structure requise'),
  niveau_avancement: z.coerce.number().optional().nullable(),
  avance_demarrage: z.coerce.number().optional().nullable(),
  date_estimation: z.string().optional().nullable(),
  budget_projet: z.coerce.number().min(0, 'Coût global requis'),
  etat_financement: z.coerce.number().optional().nullable(),

  // ── Étape 3 : Classification, Géolocalisation & Acteurs ──
  type_projet: z.coerce.number().min(1, 'Nature du projet requise'),
  envergure_projet: z.coerce.number().optional().nullable(),
  filter_secteur: z.coerce.number().optional().nullable(),
  secteur_projet: z.coerce.number().optional().nullable(),
  recuperation_geolocation: z.union([z.boolean(), z.string()]).optional().nullable(),
  latitude: z.union([z.coerce.number(), z.string()]).optional().nullable(),
  longitude: z.union([z.coerce.number(), z.string()]).optional().nullable(),
  responsable_projet: z.coerce.number().optional().nullable(),
  signataires_projet: z.array(z.coerce.number()).optional().default([]),
  partenaires_execution_projet: z.array(z.coerce.number()).optional().default([]),
  partenaire_projet: z.coerce.number().optional().nullable(),
})

export const projetClotureSchema = z.object({
  date_cloture_projet: z.string().min(1, 'La date de clôture est requise'),
  is_cloture: z.boolean().default(false),
})

export type ProjetClotureFormData = z.infer<typeof projetClotureSchema>
export type ProjectCreateData = z.infer<typeof projectCreateSchema>
