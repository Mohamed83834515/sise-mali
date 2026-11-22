import type { FormConfig } from '@/shared/types/formConfig'

export const getBureauControleFormConfig = (): FormConfig => ({
  fields: [
    {
      name: 'code_bureau',
      label: 'Code',
      type: 'text',
      placeholder: 'Ex: BC001...',
      required: true,
      gridCols: 2,
    },
    {
      name: 'intitule_bureau',
      label: 'Intitulé du bureau',
      type: 'text',
      placeholder: 'Ex: Bureau Veritas, Cira Ingénierie...',
      required: true,
      gridCols: 2,
    },
    {
      name: 'description_bureau',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Description ou observations...',
      rows: 3,
      required: false,
      gridCols: 1,
    },
  ],
})
