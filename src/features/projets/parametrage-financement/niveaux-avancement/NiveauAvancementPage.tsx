import { useState } from 'react'
import { Activity } from 'lucide-react'
import ListeNiveauAvancement from './ListeNiveauAvancement'
import AddNiveauAvancement from './AddNiveauAvancement'

type Mode = 'list' | 'add' | 'edit'

export function NiveauAvancementPage() {
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
          <Activity className='size-4 text-muted-foreground' />
        </div>
        <div>
          <h2 className='text-sm font-medium leading-none'>
            {mode === 'list'
              ? "Niveaux d'avancement des projets"
              : mode === 'add'
              ? "Ajouter un niveau d'avancement"
              : "Modifier un niveau d'avancement"}
          </h2>
          <p className='text-muted-foreground mt-1 text-xs'>
            {mode === 'list'
              ? "Gérez les statuts et étapes d'avancement des projets"
              : mode === 'add'
              ? "Renseignez les informations du nouveau niveau d'avancement"
              : `Modification de « ${currentRow?.code_niveau_avancement} - ${currentRow?.nom_niveau_avancement} »`}
          </p>
        </div>
      </div>

      {mode === 'list' && (
        <ListeNiveauAvancement key='list' onAdd={goAdd} onEdit={goEdit} />
      )}

      {mode === 'add' && (
        <AddNiveauAvancement
          key='add'
          currentRow={null}
          onBack={goList}
          onSuccess={goList}
        />
      )}

      {mode === 'edit' && currentRow && (
        <AddNiveauAvancement
          key={`edit-${currentRow.id_niveau_avancement}`}
          currentRow={currentRow}
          onBack={goList}
          onSuccess={goList}
        />
      )}
    </div>
  )
}
