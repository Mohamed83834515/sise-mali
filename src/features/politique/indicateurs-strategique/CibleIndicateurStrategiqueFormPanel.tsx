import { useMemo } from 'react'
import { toast } from 'sonner'
import { DynamicForm } from '@/shared/forms'
import { getApiErrorMessage } from '@/lib/api-error-message'
import { buildAnneeCibleOptions } from '@/shared/forms/configs/cibleCmrProjetForm'
import { getCibleIndicateurStrategiqueFormConfigForDialog } from '@/shared/forms/configs/indicateurStrategiqueForm'
import type { CibleIndicateurStrategique } from '@/shared/types/entities/cibleIndicateurStrategique'
import {
  cibleIndicateurStrategiqueWriteSchema,
  type CibleIndicateurStrategiquePayload,
  type CibleIndicateurStrategiqueWriteData,
} from '@/shared/schemas/indicateurStrategiqueSchemas'
import {
  formatAnneeCibleForApi,
  normalizeAnneeCibleForForm,
} from '@/shared/schemas/cibleCmrProjetSchema'
import {
  useCreateCibleIndicateurStrategique,
  useUpdateCibleIndicateurStrategique,
} from '@/shared/api/hooks/admin/cibleIndicateurStrategiqueHooks'
import { useGetUgls } from '@/shared/api/hooks/admin/uglHooks'
import { useActiveProgrammeCode } from '@/hooks/use-active-programme'
import { resolveRelationCode } from '@/shared/utils/resolveApiRelation'

export default function CibleIndicateurStrategiqueFormPanel({
  indicateurCode,
  cible,
  onClose,
  onSuccess,
}: {
  indicateurCode: string
  cible?: CibleIndicateurStrategique | null
  onClose: () => void
  onSuccess: () => void
}) {
  const isEditing = !!cible
  const codeProgramme = useActiveProgrammeCode()
  const createMutation = useCreateCibleIndicateurStrategique()
  const updateMutation = useUpdateCibleIndicateurStrategique()
  const { data: ugls = [], isLoading: isLoadingUgls } = useGetUgls()

  const anneeOptions = useMemo(() => buildAnneeCibleOptions(), [])

  const uglOptions = useMemo(
    () =>
      ugls
        .filter((u) => u.code_ugl != null)
        .map((u) => ({
          value: u.code_ugl!,
          label: `${u.code_ugl} — ${u.nom_ugl}`,
        })),
    [ugls]
  )

  const formConfig = useMemo(
    () =>
      getCibleIndicateurStrategiqueFormConfigForDialog({
        anneeOptions,
        uglOptions,
        isLoadingUgls,
      }),
    [anneeOptions, uglOptions, isLoadingUgls]
  )

  const defaultValues = useMemo((): CibleIndicateurStrategiqueWriteData => {
    const codeUg =
      resolveRelationCode(cible?.code_ug as unknown, 'code_ugl') ??
      (typeof cible?.code_ug === 'string' ? cible.code_ug : '')

    return {
      annee: normalizeAnneeCibleForForm(cible?.annee, anneeOptions),
      code_ug: codeUg,
      valeur_cible_indcateur_istr: cible?.valeur_cible_indcateur_istr ?? 0,
    }
  }, [cible, anneeOptions])

  const onSubmit = (data: CibleIndicateurStrategiqueWriteData) => {
    const payload: CibleIndicateurStrategiquePayload = {
      annee: formatAnneeCibleForApi(data.annee),
      code_indicateur_istr: indicateurCode,
      code_ug: data.code_ug,
      valeur_cible_indcateur_istr: data.valeur_cible_indcateur_istr,
      ...(codeProgramme ? { code_programme: codeProgramme } : {}),
    }

    const callbacks = {
      onSuccess: () => {
        toast.success(isEditing ? 'Cible mise à jour' : 'Cible ajoutée')
        onSuccess()
      },
      onError: (error: unknown) =>
        toast.error(
          getApiErrorMessage(error, "Erreur lors de l'enregistrement")
        ),
    }

    if (isEditing && cible) {
      updateMutation.mutate(
        { id: cible.id_cible_indicateur_istr, data: payload },
        callbacks
      )
      return
    }

    createMutation.mutate(payload, callbacks)
  }

  return (
    <DynamicForm
      key={cible?.id_cible_indicateur_istr ?? 'new'}
      config={formConfig}
      schema={cibleIndicateurStrategiqueWriteSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      submitText={isEditing ? 'Mettre à jour' : 'Ajouter'}
      loadingText='Enregistrement…'
      isLoading={createMutation.isPending || updateMutation.isPending}
      onCancel={onClose}
      cancelText='Annuler'
      embedded
      className='min-w-0'
    />
  )
}
