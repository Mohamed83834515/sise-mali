import { useCallback, useMemo, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { GenericDialogs } from '@/shared/tables'
import { GenericTable } from '@/shared/tables'
import { GenericDeleteDialog } from '@/shared/tables'
import useDialogState from '@/hooks/use-dialog-state'
import { useActiveProgrammeCode } from '@/hooks/use-active-programme'
import { buildPtbasColumns } from '@/shared/tables/columns/ptbas-columns'
import { useDeletePtba, useGetPtbas } from '@/shared/api/hooks/admin/ptbaHooks'
import { useGetPersonnels } from '@/shared/api/hooks/admin/personnelHooks'
import { usePtbaVersionSelection } from '@/shared/api/hooks/admin/versionHooks'
import { resolvePersonnelLabel } from '@/shared/utils/resolveApiRelation'
import { PtbaVersionSelect } from './PtbaVersionSelect'
import AddPtba from './AddPtba'
import ActiviteTabbedDialog from './ActiviteTabbedDialog'
import TacheActiviteManager from './tache-activite/TacheActiviteManager'
import IndicateurTacheManager from './indicateur-tache/IndicateurTacheManager'
import CoutUnitairePtbaManager from './cout-unitaire/CoutUnitairePtbaManager'
import { useGeneralParamsQuery } from '@/shared/api/hooks/generalParams/queries'

const route = getRouteApi('/_authenticated/programmation/ptba/')

function ListePtbas() {
  const codeProgramme = useActiveProgrammeCode()
  const { selectedVersionId, handleChangeVersion, versionOptions } =
    usePtbaVersionSelection(codeProgramme)

  const [planifierActivite, setPlanifierActivite] = useState<Ptba | null>(null)
  const [showPlanificationModal, setShowPlanificationModal] = useState(false)

  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { data: ptbas = [] } = useGetPtbas(Number(selectedVersionId))
  const { data: personnels = [] } = useGetPersonnels()
  const deleteMutation = useDeletePtba()

  const personnelsById = useMemo(
    () =>
      new Map(
        personnels
          .filter((p) => p.n_personnel != null)
          .map((p) => [p.n_personnel!, p])
      ),
    [personnels]
  )

  const getResponsableLabel = useCallback(
    (ptba: Ptba) =>
      resolvePersonnelLabel(ptba.responsable_ptba, personnelsById),
    [personnelsById]
  )

  const onOpenPlanification = useCallback((activite: Ptba) => {
    setPlanifierActivite(activite)
    setShowPlanificationModal(true)
  }, [])

  const [open, setOpen] = useDialogState<'add' | 'edit' | 'delete'>(null)
  const [currentRow, setCurrentRow] = useState<Ptba | null>(null)

  const { data: config } = useGeneralParamsQuery()
  const currencyCode = config?.currencyCode

  const columns = useMemo(
    () =>
      buildPtbasColumns(
        setOpen,
        setCurrentRow,
        onOpenPlanification,
        currencyCode,
        getResponsableLabel
      ),
    [setOpen, setCurrentRow, onOpenPlanification, getResponsableLabel,
      currencyCode
    ]
  )

  return (
    <>
      <GenericTable<Ptba>
        data={ptbas}
        columns={columns}
        search={search}
        navigate={navigate}
        searchKey='intitule_activite_ptba'
        searchPlaceholder='Filter activities...'
        urlFilterConfig={[
          {
            columnId: 'intitule_activite_ptba',
            searchKey: 'intitule_activite_ptba',
            type: 'string',
          },
        ]}
        toolbarEndSlot={
          <PtbaVersionSelect
            options={versionOptions}
            value={selectedVersionId}
            onChange={handleChangeVersion}
          />
        }
        showViewOptions={false}
        initialState={{
          columnVisibility: {
            version_ptba: false,
          },
        }}
      />

      <ActiviteTabbedDialog
        activite={planifierActivite}
        open={showPlanificationModal}
        onOpenChange={(open) => {
          setShowPlanificationModal(open)
          if (!open) setPlanifierActivite(null)
        }}
        defaultTab='taches'
        tabs={
          planifierActivite
            ? [
              {
                value: 'taches',
                label: 'Planification des tâches',
                content: (
                  <TacheActiviteManager activite={planifierActivite} />
                ),
              },
              {
                value: 'indicateurs',
                label: 'Planification des indicateurs',
                content: (
                  <IndicateurTacheManager activite={planifierActivite} />
                ),
              },
              {
                value: 'couts-unitaires',
                label: 'Coût Unitaire',
                content: (
                  <CoutUnitairePtbaManager activite={planifierActivite} />
                ),
              },
            ]
            : []
        }
      />
      <GenericDialogs<Ptba, 'add' | 'edit' | 'delete'>
        open={open}
        setOpen={setOpen}
        currentRow={currentRow}
        setCurrentRow={setCurrentRow}
        rowRequiredDialogs={['edit', 'delete']}
        dialogMap={{
          edit: (props) => (
            <AddPtba
              key={`ptba-edit-${currentRow?.id_ptba}`}
              open={props.open}
              onOpenChange={props.onOpenChange}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              currentRow={props.currentRow as any}
            />
          ),
          delete: (props) => (
            <GenericDeleteDialog<Ptba>
              key={`ptba-delete-${currentRow?.id_ptba}`}
              {...props}
              currentRow={props.currentRow as Ptba}
              entityName='ptba'
              getEntityLabel={(row) => row.intitule_activite_ptba}
              onDelete={(row) => deleteMutation.mutate(row.id_ptba)}
            />
          ),
        }}
      />
    </>
  )
}

export default ListePtbas
