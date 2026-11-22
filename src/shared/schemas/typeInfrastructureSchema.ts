import { z } from 'zod'

export const typeInfrastructureSchema = z.object({
  code_type_infrastructure: z.string().min(1, 'Le code est requis'),
  intitule_type_infrastructure: z.string().min(1, "L'intitulé est requis"),
  description_type_infrastructure: z.string().optional().default(''),
})

export type TypeInfrastructureFormData = z.infer<typeof typeInfrastructureSchema>
