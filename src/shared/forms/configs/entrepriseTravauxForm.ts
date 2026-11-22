import type { FormConfig } from '@/shared/types/formConfig'

export const getEntrepriseTravauxFormConfig = (): FormConfig => ({
  fields: [
    {
      name: 'code_entreprise',
      label: 'Code',
      type: 'text',
      placeholder: 'Ex: ENT001...',
      required: true,
      gridCols: 2,
    },
    {
      name: 'intitule_entreprise',
      label: "Intitulé de l'entreprise",
      type: 'text',
      placeholder: 'Ex: BTP Mali, Razel, Sogea Satom...',
      required: true,
      gridCols: 2,
    },
    {
      name: 'description_entreprise',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Description ou observations...',
      rows: 3,
      required: false,
      gridCols: 1,
    },
  ],
})
