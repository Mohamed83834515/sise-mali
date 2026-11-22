import { useCallback, useMemo, useState } from 'react'
import { Loader2, Plus, Building2 } from 'lucide-react'
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
import { buildInfrastructureColumns } from '@/shared/tables/columns/infrastructure-columns'
import {
  useGetInfrastructures,
  useDeleteInfrastructure,
} from '@/shared/api/hooks/admin/infrastructureHooks'
import { useGetBureauxControle } from '@/shared/api/hooks/admin/bureauControleHooks'
import { useGetEntreprisesTravaux } from '@/shared/api/hooks/admin/entrepriseTravauxHooks'
import { useGetTypesInfrastructures } from '@/shared/api/hooks/admin/typeInfrastructureHooks'
import { useGetAllLocalites } from '@/shared/api/hooks/admin/localiteHooks'
import InfrastructureFormDialog from './InfrastructureFormDialog'

type ProjetInfrastructurePanelProps = {
  projet: Projet
}

export default function ProjetInfrastructurePanel({
  projet,
}: ProjetInfrastructurePanelProps) {
  const idProjet = projet.id_projet
  const { search, navigate } = useEmbeddedTableState()
  const { data: infrastructures = [], isLoading } = useGetInfrastructures(idProjet)
  const deleteMutation = useDeleteInfrastructure(idProjet)

  const { data: bureaux = [] } = useGetBureauxControle()
  const { data: entreprises = [] } = useGetEntreprisesTravaux()
  const { data: typesInfra = [] } = useGetTypesInfrastructures()
  const { data: localites = [] } = useGetAllLocalites()

  const [formOpen, setFormOpen] = useState(false)
  const [selectedInfra, setSelectedInfra] = useState<Infrastructure | null>(null)
  const [deleteOpen, setDeleteOpen] = useDialogState<'delete'>(null)
  const [infraToDelete, setInfraToDelete] = useState<Infrastructure | null>(null)

  const safeInfrastructures = useMemo(
    () => (Array.isArray(infrastructures) ? infrastructures : []),
    [infrastructures]
  )
  const safeBureaux = useMemo(
    () => (Array.isArray(bureaux) ? bureaux : []),
    [bureaux]
  )
  const safeEntreprises = useMemo(
    () => (Array.isArray(entreprises) ? entreprises : []),
    [entreprises]
  )
  const safeTypesInfra = useMemo(
    () => (Array.isArray(typesInfra) ? (typesInfra as TypeInfrastructure[]) : []),
    [typesInfra]
  )
  const safeLocalites = useMemo(() => {
    if (Array.isArray(localites)) return localites
    if (localites && Array.isArray((localites as any).results)) return (localites as any).results
    if (localites && Array.isArray((localites as any).localites)) return (localites as any).localites
    return []
  }, [localites])

  const bureauxById = useMemo(
    () => new Map(safeBureaux.map((b) => [b.id_bureau, b])),
    [safeBureaux]
  )
  const entreprisesById = useMemo(
    () => new Map(safeEntreprises.map((e) => [e.id_entreprise, e])),
    [safeEntreprises]
  )
  const typesById = useMemo(
    () =>
      new Map(
        safeTypesInfra.map((t) => [
          t.id_type_infrastructure,
          t,
        ])
      ),
    [safeTypesInfra]
  )
  const localitesById = useMemo(
    () => new Map((safeLocalites as Localite[]).map((l) => [l.id_loca, l])),
    [safeLocalites]
  )

  const handleAdd = () => {
    setSelectedInfra(null)
    setFormOpen(true)
  }

  const handleEdit = useCallback((row: Infrastructure) => {
    setSelectedInfra(row)
    setFormOpen(true)
  }, [])

  const handleDeleteRequest = useCallback(
    (row: Infrastructure) => {
      setInfraToDelete(row)
      setDeleteOpen('delete')
    },
    [setDeleteOpen]
  )

  const handleCloseForm = () => {
    setFormOpen(false)
    setSelectedInfra(null)
  }

  const columns = useMemo(
    () =>
      buildInfrastructureColumns({
        typesById,
        bureauxById,
        entreprisesById,
        localitesById,
        onEdit: handleEdit,
        onDeleteRequest: handleDeleteRequest,
      }),
    [
      typesById,
      bureauxById,
      entreprisesById,
      localitesById,
      handleEdit,
      handleDeleteRequest,
    ]
  )

  const handleConfirmDelete = (row: Infrastructure) => {
    deleteMutation.mutate(row.id_infrastructure, {
      onSuccess: () => {
        setInfraToDelete(null)
        setDeleteOpen(null)
      },
    })
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-3'>
        <div>
          <h2 className='text-base font-semibold flex items-center gap-2'>
            <Building2 className='h-5 w-5 text-primary' />
            Infrastructures du projet
          </h2>
          <p className='text-xs text-muted-foreground'>
            Gestion des infrastructures, équipements et travaux associés au projet.
          </p>
        </div>
        <Button
          type='button'
          onClick={handleAdd}
          className='bg-primary text-primary-foreground shadow-sm hover:bg-primary/90'
        >
          <Plus className='h-4 w-4 mr-1.5' />
          Ajouter une infrastructure
        </Button>
      </div>

      {isLoading ? (
        <div className='flex justify-center py-16'>
          <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
        </div>
      ) : safeInfrastructures.length === 0 ? (
        <div className='flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center'>
          <Building2 className='h-12 w-12 text-muted-foreground/50 mb-3' />
          <h3 className='text-sm font-semibold'>Aucune infrastructure enregistrée</h3>
          <p className='text-xs text-muted-foreground mt-1 max-w-sm mb-4'>
            Commencez par ajouter la première infrastructure (forage, bâtiment, piste, etc.) rattachée à ce projet.
          </p>
          <Button type='button' onClick={handleAdd}>
            <Plus className='h-4 w-4 mr-1.5' />
            Ajouter une infrastructure
          </Button>
        </div>
      ) : (
        <GenericTable<Infrastructure>
          data={safeInfrastructures}
          columns={columns}
          search={search}
          navigate={navigate}
          searchKey='nom_infrastructure'
          searchPlaceholder='Rechercher une infrastructure...'
          urlFilterConfig={[
            {
              columnId: 'nom_infrastructure',
              searchKey: 'nom_infrastructure',
              type: 'string',
            },
            {
              columnId: 'code_infrastructure',
              searchKey: 'code_infrastructure',
              type: 'string',
            },
          ]}
          showViewOptions={false}
          defaultPageSize={10}
          compactPagination
          emptyMessage='Aucune infrastructure trouvée.'
        />
      )}

      {/* Modal Ajout / Modification */}
      <Dialog open={formOpen} onOpenChange={(open) => !open && handleCloseForm()}>
        <DialogContent className='sm:max-w-4xl md:max-w-5xl lg:max-w-6xl w-[95vw] max-h-[92vh] overflow-y-auto p-4 sm:p-5'>
          <DialogHeader className='pb-2 border-b'>
            <DialogTitle className='text-base font-bold text-slate-900'>
              {selectedInfra
                ? "Modifier l'infrastructure"
                : 'Ajouter une infrastructure'}
            </DialogTitle>
            <DialogDescription className='text-xs text-muted-foreground'>
              {selectedInfra
                ? "Modifiez les informations de l'infrastructure ci-dessous."
                : 'Renseignez les champs pour enregistrer une nouvelle infrastructure.'}
            </DialogDescription>
          </DialogHeader>
          <InfrastructureFormDialog
            projet={projet}
            infrastructure={selectedInfra}
            onClose={handleCloseForm}
            onSuccess={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {/* Confirmation de suppression */}
      {infraToDelete && (
        <GenericDeleteDialog<Infrastructure>
          open={deleteOpen === 'delete'}
          onOpenChange={(isOpen) => setDeleteOpen(isOpen ? 'delete' : null)}
          currentRow={infraToDelete}
          entityName="l'infrastructure"
          getEntityLabel={(row) =>
            row.nom_infrastructure?.trim() ||
            row.code_infrastructure?.trim() ||
            'Infrastructure'
          }
          onDelete={handleConfirmDelete}
        />
      )}
    </div>
  )
}
