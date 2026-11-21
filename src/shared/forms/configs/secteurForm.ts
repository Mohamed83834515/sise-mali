import type { FormConfig } from '@/shared/types/formConfig'

export const getSecteurFormConfig = (): FormConfig => ({
  fields: [
    {
      name: 'code_secteur',
      label: 'Code secteur',
      type: 'text',
      placeholder: 'Ex: SEC01, AGR01...',
      required: true,
      gridCols: 2,
    },
    {
      name: 'intitule_secteur',
      label: 'Intitulé secteur',
      type: 'text',
      placeholder: 'Ex: Agriculture, Énergie, Santé...',
      required: true,
      gridCols: 2,
    },
  ],
})
