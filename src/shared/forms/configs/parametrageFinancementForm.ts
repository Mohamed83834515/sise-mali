import type { FormConfig } from '@/shared/types/formConfig'

export const getModeFinancementFormConfig = (): FormConfig => ({
  fields: [
    {
      name: 'code_mode_financement',
      label: 'Code',
      type: 'text',
      placeholder: 'Ex: DON, PRET...',
      required: true,
      gridCols: 2,
    },
    {
      name: 'nom_mode_financement',
      label: 'Nom du mode de financement',
      type: 'text',
      placeholder: 'Ex: Don non remboursable, Prêt concessionnel...',
      required: true,
      gridCols: 2,
    },
  ],
})

export const getEtatFinancementFormConfig = (): FormConfig => ({
  fields: [
    {
      name: 'code_etat_financement',
      label: 'Code',
      type: 'text',
      placeholder: 'Ex: ACC, DIS...',
      required: true,
      gridCols: 2,
    },
    {
      name: 'nom_etat_financement',
      label: "Nom de l'état de financement",
      type: 'text',
      placeholder: 'Ex: Accordé, Disponible, En négociation...',
      required: true,
      gridCols: 2,
    },
  ],
})

export const getEnvergureProjetFormConfig = (): FormConfig => ({
  fields: [
    {
      name: 'code_envergure',
      label: 'Code',
      type: 'text',
      placeholder: 'Ex: NAT, REG, LOC...',
      required: true,
      gridCols: 2,
    },
    {
      name: 'nom_envergure',
      label: "Nom de l'envergure",
      type: 'text',
      placeholder: 'Ex: Nationale, Régionale, Locale...',
      required: true,
      gridCols: 2,
    },
  ],
})
