import { useEffect, useMemo, useState } from 'react'
import { Plus, Save, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  useDeleteNiveauSecteur,
  useGetNiveauxSecteur,
  useSaveNiveauSecteur,
  useUpdateNiveauSecteur,
} from '@/shared/api/hooks/admin/niveauSecteurHooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type NiveauRow = {
  id?: number
  libelle: string
  code: string
  isNew: boolean
}

function toRow(n: NiveauSecteur): NiveauRow {
  return {
    id: n.id_niveau_secteur,
    libelle: n.libelle_niveau_secteur,
    code: n.code_niveau_secteur || '',
    isNew: false,
  }
}

function createEmptyRow(existingRows: NiveauRow[]): NiveauRow {
  return {
    libelle: '',
    code: `NS0${existingRows.length + 1}`,
    isNew: true,
  }
}

type Props = {
  onSuccess?: () => void
}

export default function NiveauSecteurManager({ onSuccess }: Props) {
  const { data: niveaux = [], isLoading } = useGetNiveauxSecteur()
  const createMutation = useSaveNiveauSecteur()
  const updateMutation = useUpdateNiveauSecteur()
  const deleteMutation = useDeleteNiveauSecteur()

  const sorted = useMemo(
    () => [...niveaux].sort((a, b) => a.nombre_niveau_secteur - b.nombre_niveau_secteur),
    [niveaux]
  )

  const [rows, setRows] = useState<NiveauRow[]>([])
  const [initialized, setInitialized] = useState(false)
  const isSaving = createMutation.isPending || updateMutation.isPending

  useEffect(() => {
    if (initialized || isLoading) return
    if (sorted.length === 0) {
      setRows([createEmptyRow([])])
    } else {
      setRows(sorted.map(toRow))
    }
    setInitialized(true)
  }, [initialized, isLoading, sorted])

  const onAddRow = () => {
    setRows((prev) => [...prev, createEmptyRow(prev)])
  }

  const onSave = async () => {
    const rowsToSave = rows.filter((row) => row.libelle.trim())
    if (rowsToSave.length === 0) {
      toast.error('Renseignez au moins un libellé de niveau')
      return
    }

    try {
      let order = 0
      for (const row of rows) {
        if (!row.libelle.trim()) continue
        order += 1
        const payload = {
          libelle_niveau_secteur: row.libelle.trim(),
          nombre_niveau_secteur: order,
          code_niveau_secteur: row.code.trim() || `NS0${order}`,
        }

        if (row.isNew) {
          await createMutation.mutateAsync(payload)
        } else if (row.id != null) {
          await updateMutation.mutateAsync({ id: row.id, data: payload })
        }
      }

      toast.success('Niveaux de secteur sauvegardés')
      setInitialized(false)
      onSuccess?.()
    } catch {
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  const onRemoveRow = async (index: number) => {
    const row = rows[index]
    if (!row) return

    if (row.id != null) {
      if (!window.confirm('Supprimer ce niveau de secteur ?')) return
      try {
        await deleteMutation.mutateAsync(row.id)
        toast.success('Niveau supprimé')
        setInitialized(false)
        onSuccess?.()
      } catch {
        toast.error('Erreur lors de la suppression')
      }
      return
    }

    setRows((prev) => prev.filter((_, i) => i !== index))
  }

  if (isLoading && !initialized) {
    return <div className='py-3 text-sm text-muted-foreground'>Chargement…</div>
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h3 className='text-base font-semibold'>Configuration des niveaux de secteur</h3>
          <p className='text-sm text-muted-foreground'>
            Gérez la hiérarchie des secteurs. L&apos;ordre est attribué automatiquement.
          </p>
        </div>
        <div className='flex flex-col gap-1 sm:flex-row'>
          <Button type='button' variant='outline' onClick={onAddRow}>
            <Plus className='h-4 w-4' />
            Ajouter un niveau
          </Button>
          <Button type='button' onClick={onSave} disabled={isSaving}>
            <Save className='h-4 w-4' />
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </div>

      <div className='rounded-lg border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Libellé du niveau</TableHead>
              <TableHead className='w-40'>Code niveau</TableHead>
              <TableHead className='w-20 text-end'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.id ?? `new-${index}`}>
                <TableCell>
                  <Input
                    value={row.libelle}
                    placeholder='Ex: Secteur principal, Sous-secteur...'
                    onChange={(e) =>
                      setRows((p) =>
                        p.map((r, i) => (i === index ? { ...r, libelle: e.target.value } : r))
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={row.code}
                    placeholder='Ex: SEC_NIV1'
                    onChange={(e) =>
                      setRows((p) =>
                        p.map((r, i) => (i === index ? { ...r, code: e.target.value } : r))
                      )
                    }
                  />
                </TableCell>
                <TableCell className='text-end'>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    disabled={index !== rows.length - 1}
                    onClick={() => onRemoveRow(index)}
                    title={
                      index === rows.length - 1
                        ? 'Supprimer'
                        : 'Supprimez uniquement le dernier niveau'
                    }
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
