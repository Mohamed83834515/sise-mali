import { useState } from 'react'
import { Construction } from 'lucide-react'
import ListeTypeInfrastructure from './ListeTypeInfrastructure'
import AddTypeInfrastructure from './AddTypeInfrastructure'

type Mode = 'list' | 'add' | 'edit'

export function TypeInfrastructurePage() {
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
          <Construction className='size-4 text-muted-foreground' />
        </div>
        <div>
          <h2 className='text-sm font-medium leading-none'>
            {mode === 'list'
              ? "Types d'infrastructures"
              : mode === 'add'
              ? "Ajouter un type d'infrastructure"
              : "Modifier un type d'infrastructure"}
          </h2>
          <p className='text-muted-foreground mt-1 text-xs'>
            {mode === 'list'
              ? "Gérez les catégories d'infrastructures (Forages, Pistes, Bâtiments, etc.)"
              : mode === 'add'
              ? "Renseignez les informations du nouveau type d'infrastructure"
              : `Modification de « ${currentRow?.code_type_infrastructure} - ${currentRow?.intitule_type_infrastructure} »`}
          </p>
        </div>
      </div>

      {mode === 'list' && (
        <ListeTypeInfrastructure key='list' onAdd={goAdd} onEdit={goEdit} />
      )}

      {mode === 'add' && (
        <AddTypeInfrastructure
          key='add'
          currentRow={null}
          onBack={goList}
          onSuccess={goList}
        />
      )}

      {mode === 'edit' && currentRow && (
        <AddTypeInfrastructure
          key={`edit-${currentRow.id_type_infrastructure}`}
          currentRow={currentRow}
          onBack={goList}
          onSuccess={goList}
        />
      )}
    </div>
  )
}
