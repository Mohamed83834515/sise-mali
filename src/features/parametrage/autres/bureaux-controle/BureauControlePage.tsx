import { useState } from 'react'
import { Building } from 'lucide-react'
import ListeBureauControle from './ListeBureauControle'
import AddBureauControle from './AddBureauControle'

type Mode = 'list' | 'add' | 'edit'

export function BureauControlePage() {
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
          <Building className='size-4 text-muted-foreground' />
        </div>
        <div>
          <h2 className='text-sm font-medium leading-none'>
            {mode === 'list'
              ? 'Bureaux de contrôle'
              : mode === 'add'
              ? 'Ajouter un bureau de contrôle'
              : 'Modifier un bureau de contrôle'}
          </h2>
          <p className='text-muted-foreground mt-1 text-xs'>
            {mode === 'list'
              ? 'Gérez les bureaux de contrôle technique et de suivi des projets'
              : mode === 'add'
              ? 'Renseignez les informations du nouveau bureau de contrôle'
              : `Modification de « ${currentRow?.code_bureau} - ${currentRow?.intitule_bureau} »`}
          </p>
        </div>
      </div>

      {mode === 'list' && (
        <ListeBureauControle key='list' onAdd={goAdd} onEdit={goEdit} />
      )}

      {mode === 'add' && (
        <AddBureauControle
          key='add'
          currentRow={null}
          onBack={goList}
          onSuccess={goList}
        />
      )}

      {mode === 'edit' && currentRow && (
        <AddBureauControle
          key={`edit-${currentRow.id_bureau}`}
          currentRow={currentRow}
          onBack={goList}
          onSuccess={goList}
        />
      )}
    </div>
  )
}
