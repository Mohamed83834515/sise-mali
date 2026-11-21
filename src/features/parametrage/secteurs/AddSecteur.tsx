import { useMemo } from 'react'
import { DynamicForm } from '@/shared/forms'
import { secteurSchema } from '@/shared/schemas/secteurSchema'
import { useSaveSecteur } from '@/shared/api/hooks/admin/secteurHooks'
import { useGetNiveauxSecteur } from '@/shared/api/hooks/admin/niveauSecteurHooks'
import { getSecteurFormConfig } from '@/shared/forms/configs/secteurForm'

type Props = {
  currentRow?: any | null
  niveauId: number
  allSecteurs: Secteur[]
  onClose: () => void
  onSuccess: () => void
}

function getNiveauIdFromSecteur(sec: Secteur): number | null {
  if (!sec.niveau_secteur) return null
  if (typeof sec.niveau_secteur === 'object') {
    return (sec.niveau_secteur as any).id_niveau_secteur ?? null
  }
  return Number(sec.niveau_secteur)
}

function resolveParentId(parent: any): number | null {
  if (parent == null) return null
  if (typeof parent === 'number') return parent
  if (typeof parent === 'object' && 'id_secteur' in parent) {
    return parent.id_secteur ?? null
  }
  return null
}

export default function AddSecteur({
  currentRow,
  niveauId,
  allSecteurs,
  onClose,
  onSuccess,
}: Props) {
  const isEdit = !!currentRow
  const { data: niveaux = [] } = useGetNiveauxSecteur()

  const currentNiveau = niveaux.find((n) => n.id_niveau_secteur === niveauId)
  const currentRank = currentNiveau?.nombre_niveau_secteur ?? 1
  const parentNiveau = niveaux.find((n) => n.nombre_niveau_secteur === currentRank - 1)

  const parentSecteurs = useMemo(() => {
    if (!parentNiveau) return []
    return allSecteurs.filter(
      (sec) => getNiveauIdFromSecteur(sec) === parentNiveau.id_niveau_secteur
    )
  }, [allSecteurs, parentNiveau])

  const formConfig = useMemo(() => {
    const config = getSecteurFormConfig()

    if (parentNiveau) {
      const parentOptions = parentSecteurs.map((sec) => ({
        label: `${sec.code_secteur} - ${sec.intitule_secteur}`,
        value: sec.id_secteur,
      }))

      config.fields.push({
        name: 'parent_secteur',
        label: `Secteur parent (${parentNiveau.libelle_niveau_secteur})`,
        type: 'select',
        placeholder: `Sélectionner un secteur (${parentNiveau.libelle_niveau_secteur})`,
        required: true,
        options: parentOptions,
        colSpan: 'full',
      })
    }

    return config
  }, [parentNiveau, parentSecteurs])

  const defaultValues = useMemo(
    () => ({
      code_secteur: currentRow?.code_secteur || '',
      intitule_secteur: currentRow?.intitule_secteur || '',
      parent_secteur: resolveParentId(currentRow?.parent_secteur) || null,
      niveau_secteur: niveauId,
    }),
    [currentRow, niveauId]
  )

  const mutation = useSaveSecteur(isEdit, currentRow, () => {
    onSuccess()
    onClose()
  })

  const handleSubmit = (data: any) => {
    mutation.mutate({
      ...data,
      niveau_secteur: niveauId,
      parent_secteur: data.parent_secteur ? Number(data.parent_secteur) : null,
    })
  }

  return (
    <DynamicForm
      config={formConfig}
      schema={secteurSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      isLoading={mutation.isPending}
      submitText={isEdit ? 'Modifier' : 'Ajouter'}
      loadingText='Enregistrement...'
      onCancel={onClose}
    />
  )
}
