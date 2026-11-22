import { z } from 'zod'

export const modeFinancementSchema = z.object({
  code_mode_financement: z.string().min(1, 'Le code est requis'),
  nom_mode_financement: z.string().min(1, 'Le nom est requis'),
})

export const etatFinancementSchema = z.object({
  code_etat_financement: z.string().min(1, 'Le code est requis'),
  nom_etat_financement: z.string().min(1, 'Le nom est requis'),
})

export const envergureProjetSchema = z.object({
  code_envergure: z.string().min(1, 'Le code est requis'),
  nom_envergure: z.string().min(1, 'Le nom est requis'),
})

export const niveauAvancementSchema = z.object({
  code_niveau_avancement: z.string().min(1, 'Le code est requis'),
  nom_niveau_avancement: z.string().min(1, 'Le nom est requis'),
})

export type ModeFinancementFormData = z.infer<typeof modeFinancementSchema>
export type EtatFinancementFormData = z.infer<typeof etatFinancementSchema>
export type EnvergureProjetFormData = z.infer<typeof envergureProjetSchema>
export type NiveauAvancementFormData = z.infer<typeof niveauAvancementSchema>
