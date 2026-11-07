import type { DossierProjet } from '@/shared/types/entities/dossierProjet'
import { resolveRelationId } from '@/shared/utils/resolveApiRelation'

export function resolveDossierProjetId(
  value: DossierProjet['projet']
): number | undefined {
  const id =
    resolveRelationId(value, 'id_projet') ?? resolveRelationId(value, 'id')
  return id ?? undefined
}

export function filterDossiersByProjet(
  items: DossierProjet[],
  idProjet: number
): DossierProjet[] {
  return items.filter(
    (item) => resolveDossierProjetId(item.projet) === idProjet
  )
}
