import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import ListeEtatFinancement from './ListeEtatFinancement'
import AddEtatFinancement from './AddEtatFinancement'

type Mode = 'list' | 'add' | 'edit'

export function EtatFinancementPage() {
  const [mode, setMode] = useState<Mode>('list')
  const [currentRow, setCurrentRow] = useState<any | null>(null)

  const goList = () => {
    setMode('list')
    setCurrentRow(null)
  }
  const goAdd = () => {
    setMode('add')
    setCurrentRow(null)
  }
  const goEdit = (row: any) => {
    setMode('edit')
    setCurrentRow(row)
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center gap-3'>
        <div className='flex size-9 items-center justify-center rounded-lg border border-border bg-muted'>
          <CheckCircle2 className='size-4 text-muted-foreground' />
        </div>
        <div>
          <h2 className='text-sm font-medium leading-none'>
            {mode === 'list'
              ? 'États de financement'
              : mode === 'add'
              ? 'Ajouter un état de financement'
              : 'Modifier un état de financement'}
          </h2>
          <p className='text-muted-foreground mt-1 text-xs'>
            {mode === 'list'
              ? 'Gérez les états de financement des projets (Engagé, Décaissé, En attente, etc.)'
              : mode === 'add'
              ? 'Renseignez les informations du nouvel état de financement'
              : `Modification de « ${currentRow?.code_etat_financement} - ${currentRow?.nom_etat_financement} »`}
          </p>
        </div>
      </div>

      {mode === 'list' && <ListeEtatFinancement key='list' onAdd={goAdd} onEdit={goEdit} />}

      {mode === 'add' && (
        <AddEtatFinancement
          key='add'
          currentRow={null}
          onBack={goList}
          onSuccess={goList}
        />
      )}

      {mode === 'edit' && currentRow && (
        <AddEtatFinancement
          key={`edit-${currentRow.id_etat_financement}`}
          currentRow={currentRow}
          onBack={goList}
          onSuccess={goList}
        />
      )}
    </div>
  )
}
