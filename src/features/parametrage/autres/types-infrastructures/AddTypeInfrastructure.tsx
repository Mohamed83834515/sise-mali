import { DynamicForm } from '@/shared/forms'
import { getTypeInfrastructureFormConfig } from '@/shared/forms/configs/typeInfrastructureForm'
import { useSaveTypeInfrastructure } from '@/shared/api/hooks/admin/typeInfrastructureHooks'
import { typeInfrastructureSchema } from '@/shared/schemas/typeInfrastructureSchema'

type Props = {
  currentRow?: any | null
  onBack: () => void
  onSuccess: () => void
  onCancel?: () => void
}

export default function AddTypeInfrastructure({
  currentRow,
  onBack,
  onSuccess,
}: Props) {
  const isEdit = !!currentRow
  const formConfig = getTypeInfrastructureFormConfig()

  const defaultValues = {
    code_type_infrastructure: currentRow?.code_type_infrastructure || '',
    intitule_type_infrastructure: currentRow?.intitule_type_infrastructure || '',
    description_type_infrastructure: currentRow?.description_type_infrastructure || '',
  }

  const mutation = useSaveTypeInfrastructure(isEdit, currentRow, onSuccess)

  const handleSubmit = (data: any) => {
    mutation.mutate(data)
  }

  return (
    <DynamicForm
      config={formConfig}
      schema={typeInfrastructureSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      isLoading={mutation.isPending}
      submitText={isEdit ? 'Modifier' : 'Ajouter'}
      loadingText='Enregistrement...'
      onCancel={onBack}
      cancelText='Retour'
    />
  )
}
