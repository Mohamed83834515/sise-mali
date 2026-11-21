import { useState } from 'react'
import { Coins } from 'lucide-react'
import ListeModeFinancement from './ListeModeFinancement'
import AddModeFinancement from './AddModeFinancement'

type Mode = 'list' | 'add' | 'edit'

export function ModeFinancementPage() {
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
          <Coins className='size-4 text-muted-foreground' />
        </div>
        <div>
          <h2 className='text-sm font-medium leading-none'>
            {mode === 'list'
              ? 'Modes de financement'
              : mode === 'add'
              ? 'Ajouter un mode de financement'
              : 'Modifier un mode de financement'}
          </h2>
          <p className='text-muted-foreground mt-1 text-xs'>
            {mode === 'list'
              ? 'Gérez les modes de financement des projets (Don, Prêt, Budget national, etc.)'
              : mode === 'add'
              ? 'Renseignez les informations du nouveau mode de financement'
              : `Modification de « ${currentRow?.code_mode_financement} - ${currentRow?.nom_mode_financement} »`}
          </p>
        </div>
      </div>

      {mode === 'list' && <ListeModeFinancement key='list' onAdd={goAdd} onEdit={goEdit} />}

      {mode === 'add' && (
        <AddModeFinancement
          key='add'
          currentRow={null}
          onBack={goList}
          onSuccess={goList}
        />
      )}

      {mode === 'edit' && currentRow && (
        <AddModeFinancement
          key={`edit-${currentRow.id_mode_financement}`}
          currentRow={currentRow}
          onBack={goList}
          onSuccess={goList}
        />
      )}
    </div>
  )
}
