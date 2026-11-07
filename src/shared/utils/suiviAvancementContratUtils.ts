export function resolveActivitePtbaId(
  ref: number | Ptba | undefined | null,
): number | undefined {
  if (ref == null) return undefined
  if (typeof ref === 'object') return (ref as Ptba).id_ptba
  return ref
}

export function normalizeSuiviAvancementContrat(
  raw: SuiviAvancementContrat,
): SuiviAvancementContrat {
  const activiteId = resolveActivitePtbaId(raw.activite_ptba as number | Ptba)

  return {
    ...raw,
    id_suivi: Number(raw.id_suivi),
    activite_ptba: activiteId ?? raw.activite_ptba,
  }
}

export function filterSuivisAvancementByActivite(
  items: SuiviAvancementContrat[],
  idActivite: number,
): SuiviAvancementContrat[] {
  return items
    .map(normalizeSuiviAvancementContrat)
    .filter(
      (item) => resolveActivitePtbaId(item.activite_ptba as number | Ptba) === idActivite,
    )
}

export function resolvePersonnelId(
  ref: number | Personnel | undefined | null,
): number | undefined {
  if (ref == null) return undefined
  if (typeof ref === 'object') return (ref as Personnel).n_personnel
  return ref
}

export function labelPersonnel(ref: number | Personnel | undefined): string {
  if (ref == null) return '—'
  if (typeof ref === 'object') {
    const p = ref as Personnel
    const name = [p.prenom_perso, p.nom_perso].filter(Boolean).join(' ')
    return name || p.id_personnel_perso || String(p.n_personnel ?? '—')
  }
  return String(ref)
}

