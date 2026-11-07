import { useMemo } from 'react'
import { toast } from 'sonner'
import { DynamicForm } from '@/shared/forms'
import { getApiErrorMessage } from '@/lib/api-error-message'
import { getSuiviDecaissementPtbaFormConfig } from '@/shared/forms/configs/suiviDecaissementPtbaForm'
import {
  suiviDecaissementPtbaSchema,
  type SuiviDecaissementPtbaFormData,
} from '@/shared/schemas/suiviDecaissementPtbaSchemas'
import type { SuiviDecaissementPtba } from '@/shared/types/entities/decaissementPtba'
import {
  useCreateSuiviDecaissement,
  useUpdateSuiviDecaissement,
} from '@/shared/api/hooks/admin/suiviPtbaHooks'

type Props = {
  idActivite: number
  codeProgramme: string
  suivi?: SuiviDecaissementPtba
  onClose: () => void
  onSuccess: () => void
}

export default function SuiviDecaissementPtbaForm({
  idActivite,
  codeProgramme,
  suivi,
  onClose,
  onSuccess,
}: Props) {
  const isEditing = !!suivi
  const config = useMemo(() => getSuiviDecaissementPtbaFormConfig(), [])
  const createMutation = useCreateSuiviDecaissement(idActivite, codeProgramme)
  const updateMutation = useUpdateSuiviDecaissement(idActivite, codeProgramme)

  const defaultValues = useMemo(
    (): SuiviDecaissementPtbaFormData => ({
      date_suivi_dec:
        suivi?.date_suivi_dec?.slice(0, 10) ||
        new Date().toISOString().split('T')[0],
      observation: suivi?.observation ?? '',
      montant_decaisse: suivi?.montant_decaisse ?? 0,
    }),
    [suivi]
  )

  const onSubmit = (data: SuiviDecaissementPtbaFormData) => {
    const callbacks = {
      onSuccess: () => {
        toast.success(isEditing ? 'Décaissement mis à jour' : 'Décaissement ajouté')
        onSuccess()
      },
      onError: (error: unknown) =>
        toast.error(
          getApiErrorMessage(
            error,
            isEditing ? 'Erreur lors de la mise à jour' : "Erreur lors de l'ajout"
          )
        ),
    }

    if (isEditing && suivi) {
      updateMutation.mutate(
        {
          id: suivi.id_suivi_dec,
          data,
          existing: {
            periode_suivi_dec: suivi.periode_suivi_dec,
            taux_dollars_jour: suivi.taux_dollars_jour,
            programme: suivi.programme,
          },
        },
        callbacks
      )
      return
    }

    createMutation.mutate(data, callbacks)
  }

  return (
    <DynamicForm
      key={suivi?.id_suivi_dec ?? 'new'}
      className='w-full'
      embedded
      config={config}
      schema={suiviDecaissementPtbaSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      submitText={isEditing ? 'Modifier' : 'Ajouter'}
      loadingText='Enregistrement…'
      isLoading={createMutation.isPending || updateMutation.isPending}
      onCancel={onClose}
      cancelText='Retour'
    />
  )
}
