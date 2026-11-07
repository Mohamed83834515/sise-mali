import { resolveRelationId } from '@/shared/utils/resolveApiRelation'

export function resolveConventionProjetId(
  value: Convention['projet']
): number | undefined {
  const id =
    resolveRelationId(value, 'id_projet') ?? resolveRelationId(value, 'id')
  return id ?? undefined
}

export function filterConventionsByProjet(
  items: Convention[],
  idProjet: number
): Convention[] {
  return items.filter(
    (item) => resolveConventionProjetId(item.projet) === idProjet
  )
}

export function resolvePartenaireConventionId(
  value: Convention['partenaire_conv']
): number | null {
  return resolveRelationId(value, 'id_acteur')
}

export function resolveConventionId(
  ref: number | Convention | undefined | null
): number | undefined {
  if (ref == null) return undefined
  if (typeof ref === 'object') return (ref as Convention).id_convention
  return ref
}

