import { DynamicForm } from '@/shared/forms'
import { getModeFinancementFormConfig } from '@/shared/forms/configs/parametrageFinancementForm'
import { useSaveModeFinancement } from '@/shared/api/hooks/admin/modeFinancementHooks'
import { modeFinancementSchema } from '@/shared/schemas/parametrageFinancementSchemas'

type Props = {
  currentRow?: any | null
  onBack: () => void
  onSuccess: () => void
  onCancel?: () => void
}

export default function AddModeFinancement({ currentRow, onBack, onSuccess }: Props) {
  const isEdit = !!currentRow
  const formConfig = getModeFinancementFormConfig()

  const defaultValues = {
    code_mode_financement: currentRow?.code_mode_financement || '',
    nom_mode_financement: currentRow?.nom_mode_financement || '',
  }

  const mutation = useSaveModeFinancement(isEdit, currentRow, onSuccess)

  const handleSubmit = (data: any) => {
    mutation.mutate(data)
  }

  return (
    <DynamicForm
      config={formConfig}
      schema={modeFinancementSchema}
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
