import { useMemo } from 'react'
import { toast } from 'sonner'
import { DynamicForm } from '@/shared/forms'
import { getApiErrorMessage } from '@/lib/api-error-message'
import { getIndicateurCadreResultatFormConfigForDialog } from '@/shared/forms/configs/indicateurCadreResultatForm'
import {
  indicateurCadreResultatCreateSchema,
  type IndicateurCadreResultatCreateData,
} from '@/shared/schemas/indicateursSchemas'
import { useGetActeurs } from '@/shared/api/hooks/admin/acteurHooks'
import {
  useGetCadresResultat,
  useGetNiveauxCadreResultat,
} from '@/shared/api/hooks/admin/cadreResultatHooks'
import { useGetPersonnels } from '@/shared/api/hooks/admin/personnelHooks'
import {
  useCreateIndicateurCadreResultat,
  useUpdateIndicateurCadreResultat,
} from '@/shared/api/hooks/admin/indicateurCadreResultatHooks'
import { sortNiveauxCadreResultat } from '@/shared/utils/cadreResultatUtils'
import {
  buildIndicateurCadreResultatPayload,
  indicateurCadreResultatToFormValues,
} from './indicateurCadreResultatFormUtils'
import { useMe } from '@/features/auth'

export default function IndicateurCadreResultatFormDialog({
  codeProjet,
  idProjet,
  fixedCadreCrCode,
  fixedNiveauIop,
  indicateur,
  onClose,
  onSuccess,
}: {
  codeProjet: string
  idProjet: number
  fixedCadreCrCode?: string | null
  fixedNiveauIop?: number | null
  indicateur?: IndicateurCadreResultat | null
  onClose: () => void
  onSuccess: () => void
}) {
  const isEditing = !!indicateur
  const hideCadreField = fixedCadreCrCode != null
  const hideNiveauField = fixedNiveauIop != null
  const createMutation = useCreateIndicateurCadreResultat(codeProjet)
  const updateMutation = useUpdateIndicateurCadreResultat()
  const { data: cadres = [], isLoading: isLoadingCadres } = useGetCadresResultat(codeProjet)
  const { data: niveaux = [], isLoading: isLoadingNiveaux } =
    useGetNiveauxCadreResultat(idProjet)
  const { data: acteurs = [], isLoading: isLoadingActeurs } = useGetActeurs()
  const { data: personnels = [], isLoading: isLoadingPersonnels } = useGetPersonnels()
  const { data: user } = useMe()
 const id_personnel =  user?.id_personnel_perso || 'admin'
  const cadreOptions = useMemo(
    () =>
      cadres.map((c) => ({
        value: c.code_cr,
        label: `${c.code_cr} - ${c.intutile_cr}`,
      })),
    [cadres]
  )

  const niveauOptions = useMemo(
    () =>
      sortNiveauxCadreResultat(niveaux).map((n) => ({
        value: n.id_ncr,
        label: `${n.nombre_ncr} - ${n.libelle_ncr}`,
      })),
    [niveaux]
  )

  const personnelOptions = useMemo(
    () =>
      personnels
        .filter((p) => p.id_personnel_perso != null)
        .map((p) => ({
          value: String(p.id_personnel_perso),
          label:
            [p.prenom_perso, p.nom_perso].filter(Boolean).join(' ') || '—',
        })),
    [personnels]
  )

  const acteurOptions = useMemo(
    () =>
      acteurs.map((a) => ({
        value: String(a.id_acteur),
        label: `${a.code_acteur} - ${a.nom_acteur}`,
      })),
    [acteurs]
  )

  const config = useMemo(
    () =>
      getIndicateurCadreResultatFormConfigForDialog({
        cadreOptions,
        acteurOptions,
        personnelOptions,
        niveauOptions,
        isLoadingCadres,
        isLoadingNiveaux,
        isLoadingActeurs,
        isLoadingPersonnels,
        hideCadreField,
        hideNiveauField,
      }),
    [
      cadreOptions,
      acteurOptions,
      personnelOptions,
      niveauOptions,
      isLoadingCadres,
      isLoadingNiveaux,
      isLoadingActeurs,
      isLoadingPersonnels,
      hideCadreField,
      hideNiveauField,
    ]
  )

  const defaultValues = useMemo(
    () =>
      indicateurCadreResultatToFormValues({
        indicateur,
        idProjet,
        fixedCadreCrCode,
        fixedNiveauIop,
        id_personnel,
      }),
    [idProjet, indicateur, fixedCadreCrCode, fixedNiveauIop, id_personnel]
  )
  const onSubmit = (data: IndicateurCadreResultatCreateData) => {
    const payload = buildIndicateurCadreResultatPayload({
      data,
      idProjet,
      fixedCadreCrCode,
      fixedNiveauIop,
    })

    const callbacks = {
      onSuccess: () => {
        toast.success(isEditing ? 'Indicateur mis à jour' : 'Indicateur créé')
        onSuccess()
      },
      onError: (error: unknown) =>
        toast.error(
          getApiErrorMessage(
            error,
            isEditing
              ? 'Erreur lors de la mise à jour'
              : 'Erreur lors de la création'
          )
        ),
    }

    if (isEditing && indicateur) {
      updateMutation.mutate(
        { id: indicateur.id_indicateur_cr_iop, data: payload },
        callbacks
      )
      return
    }

    createMutation.mutate(payload, callbacks)
  }

  return (
    <DynamicForm
      key={
        indicateur?.id_indicateur_cr_iop ??
        `new-${fixedCadreCrCode ?? 'cadre'}-${fixedNiveauIop ?? 'niveau'}`
      }
      config={config}
      schema={indicateurCadreResultatCreateSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      submitText={isEditing ? 'Modifier' : 'Créer'}
      loadingText='Enregistrement…'
      isLoading={createMutation.isPending || updateMutation.isPending}
      onCancel={onClose}
      cancelText='Annuler'
      embedded
    />
  )
}
