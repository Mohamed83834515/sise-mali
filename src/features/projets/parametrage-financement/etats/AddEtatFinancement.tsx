import { DynamicForm } from '@/shared/forms'
import { getEtatFinancementFormConfig } from '@/shared/forms/configs/parametrageFinancementForm'
import { useSaveEtatFinancement } from '@/shared/api/hooks/admin/etatFinancementHooks'
import { etatFinancementSchema } from '@/shared/schemas/parametrageFinancementSchemas'

type Props = {
  currentRow?: any | null
  onBack: () => void
  onSuccess: () => void
  onCancel?: () => void
}

export default function AddEtatFinancement({ currentRow, onBack, onSuccess }: Props) {
  const isEdit = !!currentRow
  const formConfig = getEtatFinancementFormConfig()

  const defaultValues = {
    code_etat_financement: currentRow?.code_etat_financement || '',
    nom_etat_financement: currentRow?.nom_etat_financement || '',
  }

  const mutation = useSaveEtatFinancement(isEdit, currentRow, onSuccess)

  const handleSubmit = (data: any) => {
    mutation.mutate(data)
  }

  return (
    <DynamicForm
      config={formConfig}
      schema={etatFinancementSchema}
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
