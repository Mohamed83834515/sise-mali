import { z } from 'zod'

export const entrepriseTravauxSchema = z.object({
  code_entreprise: z.string().min(1, 'Le code est requis'),
  intitule_entreprise: z.string().min(1, "L'intitulé est requis"),
  description_entreprise: z.string().optional().default(''),
})

export type EntrepriseTravauxFormData = z.infer<typeof entrepriseTravauxSchema>
