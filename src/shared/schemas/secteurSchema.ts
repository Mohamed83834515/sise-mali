import { z } from 'zod'

export const niveauSecteurSchema = z.object({
  libelle_niveau_secteur: z.string().min(1, 'Le libellé est requis'),
  nombre_niveau_secteur: z.number().optional(),
  code_niveau_secteur: z.string().min(1, 'Le code est requis'),
})

export const secteurSchema = z.object({
  code_secteur: z.string().min(1, 'Le code est requis'),
  intitule_secteur: z.string().min(1, "L'intitulé est requis"),
  parent_secteur: z.number().nullable().optional(),
  niveau_secteur: z.number(),
})

export type NiveauSecteurFormData = z.infer<typeof niveauSecteurSchema>
export type SecteurFormData = z.infer<typeof secteurSchema>
