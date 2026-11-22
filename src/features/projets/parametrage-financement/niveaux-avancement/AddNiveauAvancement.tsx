import { DynamicForm } from '@/shared/forms'
import { getNiveauAvancementFormConfig } from '@/shared/forms/configs/parametrageFinancementForm'
import { useSaveNiveauAvancement } from '@/shared/api/hooks/admin/niveauAvancementHooks'
import { niveauAvancementSchema } from '@/shared/schemas/parametrageFinancementSchemas'

type Props = {
  currentRow?: any | null
  onBack: () => void
  onSuccess: () => void
  onCancel?: () => void
}

export default function AddNiveauAvancement({
  currentRow,
  onBack,
  onSuccess,
}: Props) {
  const isEdit = !!currentRow
  const formConfig = getNiveauAvancementFormConfig()

  const defaultValues = {
    code_niveau_avancement: currentRow?.code_niveau_avancement || '',
    nom_niveau_avancement: currentRow?.nom_niveau_avancement || '',
  }

  const mutation = useSaveNiveauAvancement(isEdit, currentRow, onSuccess)

  const handleSubmit = (data: any) => {
    mutation.mutate(data)
  }

  return (
    <DynamicForm
      config={formConfig}
      schema={niveauAvancementSchema}
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
