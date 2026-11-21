import { DynamicForm } from '@/shared/forms'
import { getEnvergureProjetFormConfig } from '@/shared/forms/configs/parametrageFinancementForm'
import { useSaveEnvergureProjet } from '@/shared/api/hooks/admin/envergureProjetHooks'
import { envergureProjetSchema } from '@/shared/schemas/parametrageFinancementSchemas'

type Props = {
  currentRow?: any | null
  onBack: () => void
  onSuccess: () => void
  onCancel?: () => void
}

export default function AddEnvergure({ currentRow, onBack, onSuccess }: Props) {
  const isEdit = !!currentRow
  const formConfig = getEnvergureProjetFormConfig()

  const defaultValues = {
    code_envergure: currentRow?.code_envergure || '',
    nom_envergure: currentRow?.nom_envergure || '',
  }

  const mutation = useSaveEnvergureProjet(isEdit, currentRow, onSuccess)

  const handleSubmit = (data: any) => {
    mutation.mutate(data)
  }

  return (
    <DynamicForm
      config={formConfig}
      schema={envergureProjetSchema}
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
