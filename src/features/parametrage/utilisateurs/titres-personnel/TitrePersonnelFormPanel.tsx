import { useMemo } from 'react'
import { DynamicForm } from '@/shared/forms'
import { getTitrePersonnelFormConfig } from '@/shared/forms/configs/titrePersonnelForm'
import type { TitrePersonnel } from '@/shared/types'
import {
  useCreateTitrePersonnel,
  useUpdateTitrePersonnel,
} from '@/shared/api/hooks/admin/titrePersonnelHooks'
import {
  titrePersonnelSchema,
  type TitrePersonnelFormData,
} from '@/shared/schemas/titrePersonnelSchema'

export default function TitrePersonnelFormPanel({
  titre,
  onClose,
  onSuccess,
}: {
  titre?: TitrePersonnel | null
  onClose: () => void
  onSuccess: () => void
}) {
  const isEditing = !!titre?.id_titre

  const formConfig = useMemo(() => getTitrePersonnelFormConfig(), [])

  const defaultValues = useMemo(
    (): TitrePersonnelFormData => ({
      libelle_titre: titre?.libelle_titre ?? '',
      description_titre: titre?.description_titre ?? '',
    }),
    [titre]
  )

  const createMutation = useCreateTitrePersonnel()
  const updateMutation = useUpdateTitrePersonnel()
  const isPending = createMutation.isPending || updateMutation.isPending

  const onSubmit = (data: TitrePersonnelFormData) => {
    if (isEditing && titre) {
      updateMutation.mutate({ id: titre.id_titre, data }, { onSuccess })
      return
    }
    createMutation.mutate(data, { onSuccess })
  }

  return (
    <DynamicForm
      key={titre?.id_titre ?? 'new'}
      embedded
      config={formConfig}
      schema={titrePersonnelSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      submitText={isEditing ? 'Mettre à jour' : 'Créer'}
      loadingText='Enregistrement…'
      isLoading={isPending}
      onCancel={onClose}
      cancelText='Annuler'
    />
  )
}
