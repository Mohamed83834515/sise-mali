import { DynamicForm } from '@/shared/forms'
import { getBureauControleFormConfig } from '@/shared/forms/configs/bureauControleForm'
import { useSaveBureauControle } from '@/shared/api/hooks/admin/bureauControleHooks'
import { bureauControleSchema } from '@/shared/schemas/bureauControleSchema'

type Props = {
  currentRow?: any | null
  onBack: () => void
  onSuccess: () => void
  onCancel?: () => void
}

export default function AddBureauControle({
  currentRow,
  onBack,
  onSuccess,
}: Props) {
  const isEdit = !!currentRow
  const formConfig = getBureauControleFormConfig()

  const defaultValues = {
    code_bureau: currentRow?.code_bureau || '',
    intitule_bureau: currentRow?.intitule_bureau || '',
    description_bureau: currentRow?.description_bureau || '',
  }

  const mutation = useSaveBureauControle(isEdit, currentRow, onSuccess)

  const handleSubmit = (data: any) => {
    mutation.mutate(data)
  }

  return (
    <DynamicForm
      config={formConfig}
      schema={bureauControleSchema}
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
