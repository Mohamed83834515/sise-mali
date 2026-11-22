import { DynamicForm } from '@/shared/forms'
import { getEntrepriseTravauxFormConfig } from '@/shared/forms/configs/entrepriseTravauxForm'
import { useSaveEntrepriseTravaux } from '@/shared/api/hooks/admin/entrepriseTravauxHooks'
import { entrepriseTravauxSchema } from '@/shared/schemas/entrepriseTravauxSchema'

type Props = {
  currentRow?: any | null
  onBack: () => void
  onSuccess: () => void
  onCancel?: () => void
}

export default function AddEntrepriseTravaux({
  currentRow,
  onBack,
  onSuccess,
}: Props) {
  const isEdit = !!currentRow
  const formConfig = getEntrepriseTravauxFormConfig()

  const defaultValues = {
    code_entreprise: currentRow?.code_entreprise || '',
    intitule_entreprise: currentRow?.intitule_entreprise || '',
    description_entreprise: currentRow?.description_entreprise || '',
  }

  const mutation = useSaveEntrepriseTravaux(isEdit, currentRow, onSuccess)

  const handleSubmit = (data: any) => {
    mutation.mutate(data)
  }

  return (
    <DynamicForm
      config={formConfig}
      schema={entrepriseTravauxSchema}
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
