import { z } from 'zod'

export const phaseProjetSchema = z.object({
  nom_phase: z
    .string()
    .min(1, 'Le nom de la phase est requis')
    .max(255, 'Le nom de la phase ne doit pas dépasser 255 caractères'),
  projet: z.number().int().positive('Le projet est requis'),
})

export type PhaseProjetFormData = z.infer<typeof phaseProjetSchema>
