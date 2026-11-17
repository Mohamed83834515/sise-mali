import type { Projet } from '@/simadou/allTypes/projet'
import {
  computeDateCloture,
  computeDateClotureIso,
  computeDateFin,
  computeDureeConsommee,
  formatDateFr,
} from '@/simadou/lib/projetUtils'

export {
  computeDateCloture,
  computeDateClotureIso,
  computeDateFin,
  computeDureeConsommee,
  formatDateFr,
}

export function resolveProjetRouteId(projet: Projet): string {
  return projet.code_projet || String(projet.id_projet)
}

export function buildDossierProjetPath(projet: Projet, dossierId: number): string {
  return `/projet-programme/projets/${resolveProjetRouteId(projet)}/dossiers/${dossierId}`
}

export function openDossierProjetInNewTab(projet: Projet, dossierId: number) {
  const path = buildDossierProjetPath(projet, dossierId)
  const url = `${window.location.origin}${path}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

export function formatCompactCurrency(value: number | string | undefined | null): string {
  const num = Number(value) || 0
  try {
    return new Intl.NumberFormat('fr-FR', {
      notation: 'compact',
      compactDisplay: 'short',
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 1,
    }).format(num)
  } catch {
    return `${new Intl.NumberFormat('fr-FR', { notation: 'compact', compactDisplay: 'short', maximumFractionDigits: 1 }).format(num)} FCFA`
  }
}

