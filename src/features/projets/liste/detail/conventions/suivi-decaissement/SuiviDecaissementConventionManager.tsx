import { useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'
import type { Convention } from '@/shared/types/entities/convention'
import type { SuiviDecaissementConvention } from '@/shared/types/entities/suiviDecaissementConvention'
import { sumSuiviDecaissementConventionMontant } from '@/shared/tables/columns/suivi-decaissement-convention-columns'
import { useGetSuiviDecaissementByConvention } from '@/shared/api/hooks/admin/suiviConventionHooks'
import {
  ActiviteTabbedSubViewHeader,
  useActiviteTabbedSubView,
} from '@/features/suivi-resultats/suivi-ptba/ActiviteTabbedDialogContext'
import ActiviteTabbedFormPanel from '@/features/suivi-resultats/suivi-ptba/ActiviteTabbedFormPanel'
import SuiviDecaissementConventionForm from './SuiviDecaissementConventionForm'
import SuiviDecaissementConventionList from './SuiviDecaissementConventionList'

type Props = {
  convention: Convention
}

function formatTotalMontant(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

export default function SuiviDecaissementConventionManager({ convention }: Props) {
  const idConvention = convention.id_convention!
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<SuiviDecaissementConvention | undefined>()

  useActiviteTabbedSubView(showForm)

  const { data: suivis = [], isLoading } =
    useGetSuiviDecaissementByConvention(idConvention)

  const totalMontant = useMemo(
    () => sumSuiviDecaissementConventionMontant(suivis),
    [suivis]
  )

  const handleAdd = () => {
    setEditing(undefined)
    setShowForm(true)
  }

  const handleEdit = (row: SuiviDecaissementConvention) => {
    setEditing(row)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditing(undefined)
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  return (
    <div className='flex min-h-0 flex-1 flex-col overflow-hidden'>
      {showForm ? (
        <ActiviteTabbedFormPanel
          header={
            <ActiviteTabbedSubViewHeader
              sectionLabel='Suivi décaissement'
              className='shrink-0 border-0 px-0 pb-0 text-base font-semibold text-foreground'
            />
          }
        >
          <SuiviDecaissementConventionForm
            idConvention={idConvention}
            suivi={editing}
            onClose={handleCloseForm}
            onSuccess={handleCloseForm}
          />
        </ActiviteTabbedFormPanel>
      ) : (
        <div className='min-h-0 flex-1 overflow-y-auto px-3 py-2 sm:px-4 sm:py-3'>
          <SuiviDecaissementConventionList
            suivis={suivis}
            idConvention={idConvention}
            onEdit={handleEdit}
            onAdd={handleAdd}
          />
        </div>
      )}

      {!showForm && (
        <div className='shrink-0 border-t bg-muted/40 px-3 py-2 text-sm sm:px-4'>
          <span className='font-medium text-foreground'>Total montant :</span>{' '}
          <span className='font-mono'>{formatTotalMontant(totalMontant)}</span>
        </div>
      )}
    </div>
  )
}
