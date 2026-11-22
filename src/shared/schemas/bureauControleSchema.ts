import { z } from 'zod'

export const bureauControleSchema = z.object({
  code_bureau: z.string().min(1, 'Le code est requis'),
  intitule_bureau: z.string().min(1, "L'intitulé est requis"),
  description_bureau: z.string().optional().default(''),
})

export type BureauControleFormData = z.infer<typeof bureauControleSchema>
