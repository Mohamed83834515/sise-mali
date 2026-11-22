import { useMemo } from 'react'
import { DynamicForm } from '@/shared/forms'
import { getFinancementProjetFormConfig } from '@/shared/forms/configs/financementProjetForm'
import {
  useCreateFinancementProjet,
  useUpdateFinancementProjet,
} from '@/shared/api/hooks/admin/financementProjetHooks'
import { useGetModesFinancement } from '@/shared/api/hooks/admin/modeFinancementHooks'
import { useMe } from '@/features/auth'
import { buildBailleurOptionsFromSignataires } from '@/shared/utils/financementProjetUtils'
import { resolveRelationId } from '@/shared/utils/resolveApiRelation'
import {
  financementProjetSchema,
  type FinancementProjetFormData,
} from '@/shared/schemas/financementProjetSchemas'

type FinancementProjetFormDialogProps = {
  projet: Projet
  financement?: FinancementProjet | null
  onClose: () => void
  onSuccess: () => void
}

export default function FinancementProjetFormDialog({
  projet,
  financement,
  onClose,
  onSuccess,
}: FinancementProjetFormDialogProps) {
  const isEditing = !!financement?.id_part
  const idProjet = projet.id_projet
  const { data: user } = useMe()
  const { data: modesFinancement = [] } = useGetModesFinancement()

  const bailleurOptions = useMemo(
    () => buildBailleurOptionsFromSignataires(projet.signataires_projet),
    [projet.signataires_projet]
  )

  const modeFinancementOptions = useMemo(
    () =>
      modesFinancement.map((m) => ({
        value: m.id_mode_financement,
        label: `${m.code_mode_financement} - ${m.nom_mode_financement}`,
      })),
    [modesFinancement]
  )

  const formConfig = useMemo(
    () => getFinancementProjetFormConfig(bailleurOptions, modeFinancementOptions),
    [bailleurOptions, modeFinancementOptions]
  )

  const defaultValues = useMemo(
    (): FinancementProjetFormData => ({
      code_type: financement?.code_type ?? '',
      intitule: financement?.intitule ?? '',
      montant: financement?.montant != null ? Number(financement.montant) : 0,
      date_accord: financement?.date_accord ?? '',
      observation: financement?.observation ?? '',
      mode_financement:
        resolveRelationId(financement?.mode_financement, 'id_mode_financement') ??
        (typeof financement?.mode_financement === 'number'
          ? financement.mode_financement
          : modesFinancement[0]?.id_mode_financement ?? 0),
      bailleur: resolveRelationId(financement?.bailleur, 'id_acteur') ?? 0,
    }),
    [financement, modesFinancement]
  )

  const createMutation = useCreateFinancementProjet(idProjet)
  const updateMutation = useUpdateFinancementProjet(idProjet)

  const onSubmit = (data: FinancementProjetFormData) => {
    const personnelId = user?.n_personnel ?? 0

    const payload = {
      code_type: data.code_type.trim(),
      intitule: data.intitule.trim(),
      montant: Number(data.montant),
      date_accord: data.date_accord,
      observation: data.observation?.trim() || undefined,
      mode_financement: Number(data.mode_financement),
      bailleur: Number(data.bailleur),
      etat: isEditing ? 'modifier' : 'Ajouter',
      projet: idProjet,
      id_personnel: personnelId,
      modifier_par: personnelId,
    }

    if (isEditing && financement?.id_part) {
      updateMutation.mutate(
        { id: financement.id_part, data: payload },
        { onSuccess }
      )
      return
    }

    createMutation.mutate(payload, { onSuccess })
  }

  return (
    <DynamicForm
      key={`financement-projet-${financement?.id_part ?? 'new'}`}
      config={formConfig}
      schema={financementProjetSchema}
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
