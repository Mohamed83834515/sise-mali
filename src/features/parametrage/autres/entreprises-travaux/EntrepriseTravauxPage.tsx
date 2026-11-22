import { useState } from 'react'
import { HardHat } from 'lucide-react'
import ListeEntrepriseTravaux from './ListeEntrepriseTravaux'
import AddEntrepriseTravaux from './AddEntrepriseTravaux'

type Mode = 'list' | 'add' | 'edit'

export function EntrepriseTravauxPage() {
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
          <HardHat className='size-4 text-muted-foreground' />
        </div>
        <div>
          <h2 className='text-sm font-medium leading-none'>
            {mode === 'list'
              ? 'Entreprises de travaux'
              : mode === 'add'
              ? 'Ajouter une entreprise de travaux'
              : 'Modifier une entreprise de travaux'}
          </h2>
          <p className='text-muted-foreground mt-1 text-xs'>
            {mode === 'list'
              ? 'Gérez les entreprises de construction et prestataires de travaux'
              : mode === 'add'
              ? 'Renseignez les informations de la nouvelle entreprise de travaux'
              : `Modification de « ${currentRow?.code_entreprise} - ${currentRow?.intitule_entreprise} »`}
          </p>
        </div>
      </div>

      {mode === 'list' && (
        <ListeEntrepriseTravaux key='list' onAdd={goAdd} onEdit={goEdit} />
      )}

      {mode === 'add' && (
        <AddEntrepriseTravaux
          key='add'
          currentRow={null}
          onBack={goList}
          onSuccess={goList}
        />
      )}

      {mode === 'edit' && currentRow && (
        <AddEntrepriseTravaux
          key={`edit-${currentRow.id_entreprise}`}
          currentRow={currentRow}
          onBack={goList}
          onSuccess={goList}
        />
      )}
    </div>
  )
}
