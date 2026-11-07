import { useMemo } from 'react'
import { toast } from 'sonner'
import { DynamicForm } from '@/shared/forms'
import { getIndicateurTacheFormConfigForDialog } from '@/shared/forms/configs/indicateurTacheForm'
import {
  indicateurTacheSchema,
  type IndicateurTacheFormData,
} from '@/shared/schemas/indicateurTacheSchemas'
import {
  useCreateIndicateurTache,
  useUpdateIndicateurTache,
} from '@/shared/api/hooks/admin/indicateurTacheHooks'
import { useGetUnitesIndicateur } from '@/shared/api/hooks/admin/uniteIndicateurHooks'
import {
  buildIndicateurCmrSelectOptions,
  buildIndicateurTachePayload,
  buildUniteIndicateurSelectOptions,
  resolveIndicateurCmrFormValue,
  resolveUniteIndicateurFormValue,
} from '@/shared/utils/indicateurTacheUtils'
import {  useGetAllIndicateursPerformanceProgramme } from '@/shared/api/hooks/admin/indicateurPerformanceProgrammeHooks'

interface IndicateurTacheFormProps {
  indicateur?: IndicateurTache
  activite: Ptba
  onClose: () => void
  onSuccess: () => void
}

export default function IndicateurTacheForm({
  indicateur,
  activite,
  onClose,
  onSuccess,
}: IndicateurTacheFormProps) {
  const isEditing = !!indicateur
  const { data: indicateurs_performance = [], isLoading: isLoadingIndicateurCmrs } =
    useGetAllIndicateursPerformanceProgramme()

  const { data: unites = [], isLoading: isLoadingUnites } = useGetUnitesIndicateur()

  const formConfig = useMemo(
    () =>
      getIndicateurTacheFormConfigForDialog({
        indicateurCmrOptions: buildIndicateurCmrSelectOptions(indicateurs_performance),
        uniteIndicateurOptions: buildUniteIndicateurSelectOptions(unites),
        isLoadingIndicateurCmrs,
        isLoadingUnites,
      }),
    [indicateurs_performance, unites, isLoadingIndicateurCmrs, isLoadingUnites]
  )
  const idActivite = activite.id_ptba

  const defaultValues = useMemo(
    (): IndicateurTacheFormData => ({
      intitule_indicateur_tache: indicateur?.intitule_indicateur_tache || '',
      code_indicateur_ptba: indicateur?.code_indicateur_ptba || '',
      unite_ind_tache:
        resolveUniteIndicateurFormValue(indicateur?.unite_ind_tache) ??
        (undefined as unknown as number),
      indicateur_cmr:
        resolveIndicateurCmrFormValue(indicateur?.indicateur_cmr) ??
        (undefined as unknown as number),
      trimestre_1: indicateur?.trimestre_1 || 0,
      trimestre_2: indicateur?.trimestre_2 || 0,
      trimestre_3: indicateur?.trimestre_3 || 0,
      trimestre_4: indicateur?.trimestre_4 || 0,
      id_activite:
        typeof indicateur?.id_activite === 'object' && indicateur.id_activite
          ? indicateur.id_activite.id_ptba
          : (Number(indicateur?.id_activite) || Number(idActivite)),
    }),
    [indicateur, idActivite]
  )

  const createMutation = useCreateIndicateurTache(idActivite)
  const updateMutation = useUpdateIndicateurTache(idActivite)

  const onSubmit = (data: IndicateurTacheFormData) => {
    const payload = buildIndicateurTachePayload(data, Number(idActivite))

    if (isEditing && indicateur?.id_indicateur_tache) {
      updateMutation.mutate(
        { id: indicateur.id_indicateur_tache, data: payload },
        {
          onSuccess: () => {
            toast.success('Indicateur mis à jour avec succès')
            onSuccess()
          },
          onError: () => toast.error('Erreur lors de la mise à jour'),
        }
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success('Indicateur créé avec succès')
          onSuccess()
        },
        onError: () => toast.error('Erreur lors de la création'),
      })
    }
  }

  return (
    <DynamicForm
      key={`${indicateur?.id_indicateur_tache ?? 'new'}`}
      config={formConfig}
      schema={indicateurTacheSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      submitText={isEditing ? 'Mettre à jour' : 'Enregistrer'}
      loadingText='Enregistrement…'
      isLoading={createMutation.isPending || updateMutation.isPending}
      onCancel={onClose}
      cancelText='Retour'
    />
  )
}
