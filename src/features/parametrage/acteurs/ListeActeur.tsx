// simadou/allfonctionalities/parametrage/acteur/ListeActeur.tsx
import { useMemo, useState } from 'react'
import { GenericTable } from '@/shared/tables'
import { useEmbeddedTableState } from '@/hooks/use-embedded-table-state'
import useDialogState from '@/hooks/use-dialog-state'
import { GenericDeleteDialog } from '@/shared/tables'
import { useDeleteActeur, useGetActeurs } from '@/shared/api/hooks/admin/acteurHooks'
import { useGetCategoriesActeur } from '@/shared/api/hooks/admin/categorieActeurHooks'
import { buildActeurColumns } from '@/shared/tables/columns/acteur-columns'
import { GenericDialogs } from '@/shared/tables'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Loader2, Filter } from 'lucide-react'
import AddActeur from './AddActeur'
import { useActeurStore } from '@/stores/acteur-store'

export function ListeActeur() {
  const { search, navigate } = useEmbeddedTableState()
  const [open, setOpen] = useDialogState<'add' | 'edit' | 'delete'>(null)
  const [currentRow, setCurrentRow] = useState<Acteur | null>(null)
  const { selectedCategorieId, setSelectedCategorieId } = useActeurStore()

  const { data: acteurs = [], isLoading: isLoadingActeurs } = useGetActeurs()
  const { data: categories = [], isLoading: isLoadingCategories } = useGetCategoriesActeur()

  // Compter le nombre d'acteurs par catégorie
  const countByCategorie = useMemo(() => {
    const counts = new Map<number, number>()
    categories.forEach((cat) => {
      const count = acteurs.filter((acteur) => {
        const catId =
          acteur.categorie_acteur?.id_categorie ??
          (typeof acteur.categorie_acteur === 'number'
            ? acteur.categorie_acteur
            : undefined)
        return catId === cat.id_categorie
      }).length
      counts.set(cat.id_categorie, count)
    })
    return counts
  }, [acteurs, categories])

  // Trier les catégories par nombre d'acteurs (du plus grand au plus petit)
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      const countA = countByCategorie.get(a.id_categorie) || 0
      const countB = countByCategorie.get(b.id_categorie) || 0
      return countB - countA
    })
  }, [categories, countByCategorie])

  // Filtrer les acteurs par catégorie
  const filteredActeurs = useMemo(() => {
    if (!selectedCategorieId) return acteurs
    return acteurs.filter((acteur) => {
      const catId =
        acteur.categorie_acteur?.id_categorie ??
        (typeof acteur.categorie_acteur === 'number'
          ? acteur.categorie_acteur
          : undefined)
      return catId === selectedCategorieId
    })
  }, [acteurs, selectedCategorieId])

  const columns = useMemo(
    () => buildActeurColumns(setOpen, setCurrentRow),
    [setOpen, setCurrentRow]
  )

  const deleteMutation = useDeleteActeur()

  if (isLoadingActeurs || isLoadingCategories) {
    return (
      <div className='flex items-center justify-center py-6'>
        <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
      </div>
    )
  }

  const selectedCatObj = selectedCategorieId
    ? sortedCategories.find((c) => c.id_categorie === selectedCategorieId)
    : null

  return (
    <div className='space-y-3 px-2'>
      {/* Filtre par catégorie sous forme de Select */}
      <div className='flex items-center justify-between gap-4 rounded-lg border bg-card p-2.5 shadow-sm'>
        <div className='flex items-center gap-2.5'>
          <Filter className='h-4 w-4 text-primary shrink-0' />
          <Label htmlFor='categorie-filter' className='text-xs font-semibold text-slate-700 whitespace-nowrap'>
            Catégorie d&apos;acteur :
          </Label>
          <Select
            value={selectedCategorieId ? String(selectedCategorieId) : 'all'}
            onValueChange={(val) =>
              setSelectedCategorieId(val === 'all' ? null : Number(val))
            }
          >
            <SelectTrigger id='categorie-filter' className='h-8.5 min-w-[240px] max-w-sm text-xs font-medium'>
              <SelectValue placeholder='Toutes les catégories' />
            </SelectTrigger>
            <SelectContent className='max-h-64'>
              <SelectItem value='all'>
                Toutes les catégories ({acteurs.length})
              </SelectItem>
              {sortedCategories.map((categorie) => {
                if (!categorie || !categorie.id_categorie) return null
                const count = countByCategorie.get(categorie.id_categorie) || 0
                return (
                  <SelectItem
                    key={categorie.id_categorie}
                    value={String(categorie.id_categorie)}
                  >
                    {categorie.nom_categorie} ({count})
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        {selectedCategorieId && (
          <button
            type='button'
            onClick={() => setSelectedCategorieId(null)}
            className='text-xs text-primary hover:underline font-medium'
          >
            Réinitialiser le filtre
          </button>
        )}
      </div>

      {/* Tableau des acteurs */}
      <div className='space-y-2'>
        <GenericTable
          data={filteredActeurs}
          columns={columns}
          search={search}
          navigate={navigate}
          searchKey='nom_acteur'
          searchPlaceholder='Filtrer les acteurs...'
          urlFilterConfig={[
            {
              columnId: 'nom_acteur',
              searchKey: 'nom_acteur',
              type: 'string',
            },
            {
              columnId: 'code_acteur',
              searchKey: 'code_acteur',
              type: 'string',
            },
          ]}
          defaultPageSize={10}
          showViewOptions={true}
          emptyMessage={
            selectedCatObj
              ? `Aucun acteur dans la catégorie ${selectedCatObj.nom_categorie || ''}.`
              : 'Aucun acteur trouvé.'
          }
        />
      </div>

      {/* Dialogues */}
      <GenericDialogs<Acteur, 'add' | 'edit' | 'delete'>
        open={open}
        setOpen={setOpen}
        currentRow={currentRow}
        setCurrentRow={setCurrentRow}
        rowRequiredDialogs={['edit', 'delete']}
        dialogMap={{
          add: (props) => (
            <AddActeur
              key='acteur-add'
              open={props.open}
              onOpenChange={props.onOpenChange}
              currentRow={null}
            />
          ),
          edit: (props) => (
            <AddActeur
              key={`acteur-edit-${currentRow?.id_acteur}`}
              open={props.open}
              onOpenChange={props.onOpenChange}
              currentRow={props.currentRow as Acteur}
            />
          ),
          delete: (props) => (
            <GenericDeleteDialog<Acteur>
              key={`acteur-delete-${currentRow?.id_acteur}`}
              {...props}
              currentRow={props.currentRow as Acteur}
              entityName="l'acteur"
              getEntityLabel={(row) => `${row.code_acteur} - ${row.nom_acteur}`}
              onDelete={(row) => deleteMutation.mutate(row.id_acteur)}
            />
          ),
        }}
      />
    </div>
  )
}
