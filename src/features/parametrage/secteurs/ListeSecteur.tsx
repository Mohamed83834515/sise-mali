import { useEffect, useMemo, useState } from 'react'
import { Plus, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { NiveauTabTrigger, NiveauTabsList, useNiveauTabsTheme } from '@/components/ui/NiveauTabs'
import { useGetAllSecteurs, useDeleteSecteur } from '@/shared/api/hooks/admin/secteurHooks'
import { useGetNiveauxSecteur } from '@/shared/api/hooks/admin/niveauSecteurHooks'
import { GenericDeleteDialog } from '@/shared/tables'
import useDialogState from '@/hooks/use-dialog-state'
import { SecteurNiveauTable } from './SecteurNiveauTable'
import AddSecteur from './AddSecteur'
import NiveauSecteurManager from './niveau/NiveauSecteurManager'

type ModalState = 'form' | 'niveaux'

function getNiveauId(sec: Secteur): number | null {
  if (!sec.niveau_secteur) return null
  if (typeof sec.niveau_secteur === 'object') {
    return (sec.niveau_secteur as any).id_niveau_secteur ?? null
  }
  return Number(sec.niveau_secteur)
}

export default function ListeSecteur() {
  const { data: niveaux = [], isLoading: isLoadingNiveaux } = useGetNiveauxSecteur()
  const { data: allSecteurs = [] } = useGetAllSecteurs()
  const deleteMutation = useDeleteSecteur()

  const sortedNiveaux = useMemo(
    () => [...niveaux].sort((a, b) => a.nombre_niveau_secteur - b.nombre_niveau_secteur),
    [niveaux]
  )

  const { tabsStyle } = useNiveauTabsTheme()
  const hasNiveaux = sortedNiveaux.length > 0

  const [activeNiveauId, setActiveNiveauId] = useState<string>('')
  const [showModal, setShowModal] = useState<ModalState | null>(null)
  const [selectedSecteur, setSelectedSecteur] = useState<Secteur | null>(null)
  const [deleteOpen, setDeleteOpen] = useDialogState<'delete'>(null)
  const [secteurToDelete, setSecteurToDelete] = useState<Secteur | null>(null)

  useEffect(() => {
    if (sortedNiveaux.length > 0 && activeNiveauId === '') {
      setActiveNiveauId(String(sortedNiveaux[0].id_niveau_secteur))
    }
  }, [sortedNiveaux, activeNiveauId])

  const activeNiveauNum = Number(activeNiveauId)

  const handleOpenAdd = () => {
    setSelectedSecteur(null)
    setShowModal('form')
  }

  const handleEdit = (sec: Secteur) => {
    setSelectedSecteur(sec)
    setShowModal('form')
  }

  const handleDeleteRequest = (sec: Secteur) => {
    setSecteurToDelete(sec)
    setDeleteOpen('delete')
  }

  return (
    <div className='flex flex-1 flex-col gap-4 p-4'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Secteurs</h1>
          <p className='text-muted-foreground text-sm'>
            Gérez la nomenclature sectorielle des projets et programmes par niveau hiérarchique.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            onClick={() => setShowModal('niveaux')}
            className='flex items-center gap-1.5'
          >
            <Settings className='h-4 w-4' />
            Niveaux de secteur
          </Button>

          <Button
            onClick={handleOpenAdd}
            disabled={!hasNiveaux}
            className='flex items-center gap-1.5'
          >
            <Plus className='h-4 w-4' />
            Ajouter un secteur
          </Button>
        </div>
      </div>

      {!hasNiveaux && !isLoadingNiveaux && (
        <Card className='p-8 text-center'>
          <div className='mx-auto max-w-sm space-y-3'>
            <p className='text-muted-foreground text-sm'>
              Aucun niveau de secteur configuré. Veuillez d&apos;abord définir au moins un niveau.
            </p>
            <Button onClick={() => setShowModal('niveaux')} variant='outline'>
              <Settings className='mr-2 h-4 w-4' />
              Configurer les niveaux
            </Button>
          </div>
        </Card>
      )}

      {hasNiveaux && (
        <Tabs
          value={activeNiveauId}
          onValueChange={setActiveNiveauId}
          className='w-full'
          style={tabsStyle}
        >
          <div className='border-b pb-2'>
            <NiveauTabsList>
              {sortedNiveaux.map((niveau) => {
                const count = allSecteurs.filter(
                  (sec) => getNiveauId(sec) === niveau.id_niveau_secteur
                ).length

                return (
                  <NiveauTabTrigger
                    key={niveau.id_niveau_secteur}
                    value={String(niveau.id_niveau_secteur)}
                    count={count}
                  >
                    {niveau.libelle_niveau_secteur}
                  </NiveauTabTrigger>
                )
              })}
            </NiveauTabsList>
          </div>

          {sortedNiveaux.map((niveau) => (
            <TabsContent
              key={niveau.id_niveau_secteur}
              value={String(niveau.id_niveau_secteur)}
              className='mt-4'
            >
              <SecteurNiveauTable
                niveauId={niveau.id_niveau_secteur!}
                secteurs={allSecteurs}
                onEdit={handleEdit}
                onDeleteRequest={handleDeleteRequest}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Modal Ajout / Modification */}
      <Dialog open={showModal === 'form'} onOpenChange={(open) => !open && setShowModal(null)}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>
              {selectedSecteur ? 'Modifier le secteur' : 'Ajouter un secteur'}
            </DialogTitle>
            <DialogDescription>
              {selectedSecteur
                ? 'Modifiez les informations du secteur ci-dessous.'
                : 'Renseignez les champs pour ajouter un nouveau secteur.'}
            </DialogDescription>
          </DialogHeader>
          <AddSecteur
            currentRow={selectedSecteur}
            niveauId={activeNiveauNum}
            allSecteurs={allSecteurs}
            onClose={() => setShowModal(null)}
            onSuccess={() => setShowModal(null)}
          />
        </DialogContent>
      </Dialog>

      {/* Modal Niveaux de secteur */}
      <Dialog open={showModal === 'niveaux'} onOpenChange={(open) => !open && setShowModal(null)}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Niveaux de secteur</DialogTitle>
            <DialogDescription>
              Définissez la structure hiérarchique de vos secteurs.
            </DialogDescription>
          </DialogHeader>
          <NiveauSecteurManager onSuccess={() => setShowModal(null)} />
        </DialogContent>
      </Dialog>

      {/* Dialogue de suppression */}
      <GenericDeleteDialog
        open={deleteOpen === 'delete'}
        onOpenChange={(open) => !open && setDeleteOpen(null)}
        currentRow={secteurToDelete}
        entityName='secteur'
        getEntityLabel={(row: Secteur) => `${row.code_secteur} - ${row.intitule_secteur}`}
        onDelete={(row: Secteur) => deleteMutation.mutate(row.id_secteur)}
      />
    </div>
  )
}
