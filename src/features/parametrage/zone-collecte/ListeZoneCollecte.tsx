// simadou/allfonctionalities/parametrage/zone-collecte/ListeZoneCollecte.tsx
import { useMemo, useState } from 'react'
import { GenericTable } from '@/shared/tables'
import { useEmbeddedTableState } from '@/hooks/use-embedded-table-state'
import { ZoneCollecte } from '@/shared/types/entities/zoneCollecte'
import useDialogState from '@/hooks/use-dialog-state'
import { GenericDeleteDialog } from '@/shared/tables'
import { useDeleteZoneCollecte, useGetZonesCollecte } from '@/shared/api/hooks/admin/zoneCollecteHooks'
import { GenericDialogs } from '@/shared/tables'
import { buildZoneCollecteColumns } from '@/shared/tables/columns/zone-collecte-columns'
import AddZoneCollecte from './AddZoneCollecte'
import { useGetTypeZones } from '@/shared/api/hooks/admin/typeZoneHooks'

export function ListeZoneCollecte() {
    const { search, navigate } = useEmbeddedTableState()
    const [open, setOpen] = useDialogState<'add' | 'edit' | 'delete'>(null)
    const [currentRow, setCurrentRow] = useState<ZoneCollecte | null>(null)

    const { data: typeZones } = useGetTypeZones();
    const columns = useMemo(
        () => buildZoneCollecteColumns(setOpen, setCurrentRow, typeZones),
        [setOpen, setCurrentRow, typeZones]
    )

    const deleteMutation = useDeleteZoneCollecte()
    const { data: zones = [] } = useGetZonesCollecte()

    return (
        <>
            <div className='space-y-4'>
                <GenericTable
                    data={zones}
                    columns={columns}
                    search={search}
                    navigate={navigate}
                    searchKey='nom_zone'
                    searchPlaceholder='Filtrer les zones...'
                    urlFilterConfig={[
                        {
                            columnId: 'nom_zone',
                            searchKey: 'nom_zone',
                            type: 'string',
                        },
                    ]}
                    defaultPageSize={10}
                    showViewOptions={true}
                    emptyMessage='Aucune zone de collecte trouvée.'
                />
            </div>

            <GenericDialogs<ZoneCollecte, 'add' | 'edit' | 'delete'>
                open={open}
                setOpen={setOpen}
                currentRow={currentRow}
                setCurrentRow={setCurrentRow}
                rowRequiredDialogs={['edit', 'delete']}
                dialogMap={{

                    edit: (props) => (
                        <AddZoneCollecte
                            key={`zone-collecte-edit-${currentRow?.id_zone_collecte}`}
                            open={props.open}
                            onOpenChange={props.onOpenChange}
                            currentRow={props.currentRow as ZoneCollecte}
                        />
                    ),
                    delete: (props) => (
                        <GenericDeleteDialog<ZoneCollecte>
                            key={`zone-collecte-delete-${currentRow?.id_zone_collecte}`}
                            {...props}
                            currentRow={props.currentRow as ZoneCollecte}
                            entityName='la zone de collecte'
                            getEntityLabel={(row) => `${row.code_zone} - ${row.nom_zone}`}
                            onDelete={(row) => deleteMutation.mutate(row.id_zone_collecte)}
                        />
                    ),
                }}
            />
        </>
    )
}