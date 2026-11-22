import { z } from 'zod'

export const infrastructureSchema = z.object({
  code_infrastructure: z.string().min(1, 'Le code est requis'),
  nom_infrastructure: z.string().min(1, 'Le nom est requis'),
  maitre_ouvrage: z.string().optional().default(''),
  cout_infrastructure: z.coerce
    .number()
    .min(0, 'Le coût doit être positif ou nul')
    .optional()
    .default(0),
  date_debut_prevue: z.string().optional().default(''),
  date_fin_prevue: z.string().optional().default(''),
  delai_consomme: z.coerce.number().optional().default(0),
  logo: z.any().optional().nullable(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  projet: z.coerce.number().optional(),
  type_infrastructure: z.coerce.number().optional().nullable(),
  bureau_controle: z.coerce.number().optional().nullable(),
  entreprise_travaux: z.coerce.number().optional().nullable(),
  secteur: z.coerce.number().optional().nullable(),
  sous_secteur: z.coerce.number().optional().nullable(),
  localite: z.coerce.number().optional().nullable(),
})

export type InfrastructureFormData = z.infer<typeof infrastructureSchema>
