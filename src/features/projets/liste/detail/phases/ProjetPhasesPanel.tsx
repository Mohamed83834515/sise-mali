import { useCallback, useMemo, useState } from 'react'
import { Loader2, Plus, Milestone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { GenericTable, GenericDeleteDialog } from '@/shared/tables'
import useDialogState from '@/hooks/use-dialog-state'
import { useEmbeddedTableState } from '@/hooks/use-embedded-table-state'
import { buildPhaseProjetColumns } from '@/shared/tables/columns/phase-projet-columns'
import {
  useGetPhasesProjet,
  useDeletePhaseProjet,
} from '@/shared/api/hooks/admin/phaseProjetHooks'
import PhaseProjetFormDialog from './PhaseProjetFormDialog'

type ProjetPhasesPanelProps = {
  projet: Projet
}

export default function ProjetPhasesPanel({ projet }: ProjetPhasesPanelProps) {
  const idProjet = projet.id_projet
  const { search, navigate } = useEmbeddedTableState()
  const { data: phases = [], isLoading } = useGetPhasesProjet(idProjet)
  const deleteMutation = useDeletePhaseProjet(idProjet)

  const [formOpen, setFormOpen] = useState(false)
  const [selectedPhase, setSelectedPhase] = useState<PhaseProjet | null>(null)
  const [deleteOpen, setDeleteOpen] = useDialogState<'delete'>(null)
  const [phaseToDelete, setPhaseToDelete] = useState<PhaseProjet | null>(null)

  const safePhases = useMemo(
    () => (Array.isArray(phases) ? phases : []),
    [phases]
  )

  const handleAdd = () => {
    setSelectedPhase(null)
    setFormOpen(true)
  }

  const handleEdit = useCallback((row: PhaseProjet) => {
    setSelectedPhase(row)
    setFormOpen(true)
  }, [])

  const handleDeleteRequest = useCallback(
    (row: PhaseProjet) => {
      setPhaseToDelete(row)
      setDeleteOpen('delete')
    },
    [setDeleteOpen]
  )

  const handleCloseForm = () => {
    setFormOpen(false)
    setSelectedPhase(null)
  }

  const columns = useMemo(
    () =>
      buildPhaseProjetColumns({
        onEdit: handleEdit,
        onDeleteRequest: handleDeleteRequest,
      }),
    [handleEdit, handleDeleteRequest]
  )

  const handleConfirmDelete = (row: PhaseProjet) => {
    deleteMutation.mutate(row.id, {
      onSuccess: () => {
        setPhaseToDelete(null)
        setDeleteOpen(null)
      },
    })
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-3'>
        <div>
          <h2 className='text-base font-semibold flex items-center gap-2'>
            <Milestone className='h-5 w-5 text-primary' />
            Phases du projet
          </h2>
          <p className='text-xs text-muted-foreground'>
            Gestion des différentes phases de mise en œuvre et d’exécution du projet.
          </p>
        </div>
        <Button
          type='button'
          onClick={handleAdd}
          className='bg-primary text-primary-foreground shadow-sm hover:bg-primary/90'
        >
          <Plus className='h-4 w-4 mr-1.5' />
          Ajouter une phase
        </Button>
      </div>

      {isLoading ? (
        <div className='flex justify-center py-16'>
          <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
        </div>
      ) : safePhases.length === 0 ? (
        <div className='flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center'>
          <Milestone className='h-12 w-12 text-muted-foreground/50 mb-3' />
          <h3 className='text-sm font-semibold'>Aucune phase enregistrée</h3>
          <p className='text-xs text-muted-foreground mt-1 max-w-sm mb-4'>
            Définissez les différentes phases pour structurer l’évolution et les étapes clés de ce projet.
          </p>
          <Button type='button' onClick={handleAdd}>
            <Plus className='h-4 w-4 mr-1.5' />
            Ajouter une phase
          </Button>
        </div>
      ) : (
        <GenericTable<PhaseProjet>
          data={safePhases}
          columns={columns}
          search={search}
          navigate={navigate}
          searchKey='nom_phase'
          searchPlaceholder='Rechercher une phase...'
          urlFilterConfig={[
            {
              columnId: 'nom_phase',
              searchKey: 'nom_phase',
              type: 'string',
            },
          ]}
          showViewOptions={false}
          defaultPageSize={10}
          compactPagination
          emptyMessage='Aucune phase trouvée.'
        />
      )}

      {/* Modal Ajout / Modification */}
      <Dialog open={formOpen} onOpenChange={(open) => !open && handleCloseForm()}>
        <DialogContent className='sm:max-w-md w-full p-5'>
          <DialogHeader className='pb-2 border-b'>
            <DialogTitle className='text-base font-bold text-slate-900'>
              {selectedPhase ? 'Modifier la phase' : 'Ajouter une phase'}
            </DialogTitle>
            <DialogDescription className='text-xs text-muted-foreground'>
              {selectedPhase
                ? 'Modifiez les informations de la phase ci-dessous.'
                : 'Renseignez le nom de la phase pour l’enregistrer.'}
            </DialogDescription>
          </DialogHeader>
          <PhaseProjetFormDialog
            projet={projet}
            phase={selectedPhase}
            onClose={handleCloseForm}
            onSuccess={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {/* Confirmation de suppression */}
      {phaseToDelete && (
        <GenericDeleteDialog<PhaseProjet>
          open={deleteOpen === 'delete'}
          onOpenChange={(isOpen) => setDeleteOpen(isOpen ? 'delete' : null)}
          currentRow={phaseToDelete}
          entityName='la phase'
          getEntityLabel={(row) => row.nom_phase?.trim() || 'Phase'}
          onDelete={handleConfirmDelete}
        />
      )}
    </div>
  )
}
