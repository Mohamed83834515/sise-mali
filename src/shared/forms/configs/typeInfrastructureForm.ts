import type { FormConfig } from '@/shared/types/formConfig'

export const getTypeInfrastructureFormConfig = (): FormConfig => ({
  fields: [
    {
      name: 'code_type_infrastructure',
      label: 'Code',
      type: 'text',
      placeholder: 'Ex: INFRA01...',
      required: true,
      gridCols: 2,
    },
    {
      name: 'intitule_type_infrastructure',
      label: "Intitulé du type d'infrastructure",
      type: 'text',
      placeholder: 'Ex: Forage, Piste rurale, Barrage...',
      required: true,
      gridCols: 2,
    },
    {
      name: 'description_type_infrastructure',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Description ou observations...',
      rows: 3,
      required: false,
      gridCols: 1,
    },
  ],
})
