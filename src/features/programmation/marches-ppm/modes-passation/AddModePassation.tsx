import { DynamicForm } from '@/shared/forms'
import { getModePassationFormConfig } from '@/shared/forms/configs/modePassationForm'
import { useSaveModePassation } from '@/shared/api/hooks/admin/modePassationHooks'
import type { ModePassation } from '@/shared/types/entities/modePassation'
import {
  modePassationSchema,
  type ModePassationFormData,
} from '@/shared/schemas/modePassationSchema'

type Props = {
  currentRow?: ModePassation | null
  onBack: () => void
  onSuccess: () => void
  onCancel: () => void
}

export default function AddModePassation({
  currentRow,
  onBack,
  onSuccess,
}: Props) {
  const isEdit = !!currentRow
  const mutation = useSaveModePassation(isEdit, currentRow, onSuccess)

  const defaultValues: ModePassationFormData = {
    code_mode_passation: currentRow?.code_mode_passation ?? '',
    intitule_mode_passation: currentRow?.intitule_mode_passation ?? '',
  }

  return (
    <DynamicForm
      key={currentRow?.id_mode_passation ?? 'new-mode-passation'}
      config={getModePassationFormConfig()}
      schema={modePassationSchema}
      defaultValues={defaultValues}
      onSubmit={(data) => mutation.mutate(data)}
      isLoading={mutation.isPending}
      submitText={isEdit ? 'Mettre à jour' : 'Ajouter'}
      loadingText='Enregistrement…'
      onCancel={onBack}
      cancelText='Retour'
    />
  )
}
