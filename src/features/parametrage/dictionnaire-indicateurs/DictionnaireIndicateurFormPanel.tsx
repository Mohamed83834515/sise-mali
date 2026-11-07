import { useMemo } from 'react'
import { DynamicForm } from '@/shared/forms'
import { getDictionnaireIndicateurFormConfigForDialog } from '@/shared/forms/configs/dictionnaireIndicateurForm'
import { useGetActeurs } from '@/shared/api/hooks/admin/sharedHooks'
import { useGetTypeZones } from '@/shared/api/hooks/admin/typeZoneHooks'
import { useGetUnitesIndicateur } from '@/shared/api/hooks/admin/uniteIndicateurHooks'
import {
  dictionnaireIndicateurWriteSchema,
  type DictionnaireIndicateurWriteData,
} from '@/shared/schemas/dictionnaireIndicateurSchemas'
import {
  useCreateDictionnaireIndicateur,
  useUpdateDictionnaireIndicateur,
} from '@/shared/api/hooks/admin/dictionnaireIndicateurHooks'
import { dictionnaireToFormValues } from './dictionnaireIndicateurFormUtils'

export default function DictionnaireIndicateurFormPanel({
  dictionnaire,
  onClose,
  onSuccess,
}: {
  dictionnaire?: DictionnaireIndicateur | null
  onClose: () => void
  onSuccess: () => void
}) {
  const isEditing = !!dictionnaire

  const { data: unites = [], isLoading: isLoadingUnites } = useGetUnitesIndicateur()
  const { data: typeZones = [], isLoading: isLoadingTypeZones } = useGetTypeZones()
  const { data: acteurs = [], isLoading: isLoadingActeurs } = useGetActeurs()

  const formConfig = useMemo(
    () =>
      getDictionnaireIndicateurFormConfigForDialog({
        unites,
        typeZones,
        acteurs,
        isLoadingUnites,
        isLoadingTypeZones,
        isLoadingActeurs,
      }),
    [unites, typeZones, acteurs, isLoadingUnites, isLoadingTypeZones, isLoadingActeurs]
  )

  const defaultValues = useMemo(
    () => dictionnaireToFormValues(dictionnaire),
    [dictionnaire]
  )

  const createMutation = useCreateDictionnaireIndicateur()
  const updateMutation = useUpdateDictionnaireIndicateur()
  const isPending = createMutation.isPending || updateMutation.isPending

  const onSubmit = (data: DictionnaireIndicateurWriteData) => {
    if (isEditing && dictionnaire) {
      updateMutation.mutate(
        { id: dictionnaire.id_ref_ind_ref, data },
        { onSuccess }
      )
      return
    }

    createMutation.mutate(data, { onSuccess })
  }

  return (
    <DynamicForm
      key={dictionnaire?.id_ref_ind_ref ?? 'new'}
      embedded
      config={formConfig}
      schema={dictionnaireIndicateurWriteSchema}
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
