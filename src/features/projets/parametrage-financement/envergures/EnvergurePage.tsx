import { useState } from 'react'
import { Maximize2 } from 'lucide-react'
import ListeEnvergure from './ListeEnvergure'
import AddEnvergure from './AddEnvergure'

type Mode = 'list' | 'add' | 'edit'

export function EnvergurePage() {
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
          <Maximize2 className='size-4 text-muted-foreground' />
        </div>
        <div>
          <h2 className='text-sm font-medium leading-none'>
            {mode === 'list'
              ? 'Envergures des projets'
              : mode === 'add'
              ? 'Ajouter une envergure'
              : 'Modifier une envergure'}
          </h2>
          <p className='text-muted-foreground mt-1 text-xs'>
            {mode === 'list'
              ? 'Gérez la portée géographique ou administrative des projets (Nationale, Régionale, etc.)'
              : mode === 'add'
              ? 'Renseignez les informations de la nouvelle envergure'
              : `Modification de « ${currentRow?.code_envergure} - ${currentRow?.nom_envergure} »`}
          </p>
        </div>
      </div>

      {mode === 'list' && <ListeEnvergure key='list' onAdd={goAdd} onEdit={goEdit} />}

      {mode === 'add' && (
        <AddEnvergure
          key='add'
          currentRow={null}
          onBack={goList}
          onSuccess={goList}
        />
      )}

      {mode === 'edit' && currentRow && (
        <AddEnvergure
          key={`edit-${currentRow.id_envergure}`}
          currentRow={currentRow}
          onBack={goList}
          onSuccess={goList}
        />
      )}
    </div>
  )
}
