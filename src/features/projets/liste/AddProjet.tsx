import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DIALOG_SIZES } from '@/shared/forms'
import { useActiveProgrammeId } from '@/hooks/use-active-programme'
import { useGetActeurs, useGetLocalites } from '@/shared/api/hooks/admin/sharedHooks'
import { useGetNiveauxLocalite } from '@/shared/api/hooks/admin/niveauLocaliteHooks'
import { useGetProgrammes } from '@/shared/api/hooks/admin/programmeHooks'
import { useGetNiveauxPlanSite } from '@/shared/api/hooks/admin/niveauPlanSiteHooks'
import { useGetPlanSites } from '@/shared/api/hooks/admin/planSiteHooks'
import { useGetNiveauxAvancement } from '@/shared/api/hooks/admin/niveauAvancementHooks'
import { useGetEtatsFinancement } from '@/shared/api/hooks/admin/etatFinancementHooks'
import { useGetTypeProjet } from '@/shared/api/hooks/admin/typeProjetHooks'
import { useGetEnverguresProjet } from '@/shared/api/hooks/admin/envergureProjetHooks'
import { useGetAllSecteurs } from '@/shared/api/hooks/admin/secteurHooks'
import { useGetPersonnels } from '@/shared/api/hooks/admin/personnelHooks'
import { useCreateProjet, useUpdateProjet } from '@/shared/api/hooks/admin/projetHooks'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getProjetFormConfig } from '@/shared/forms/configs/projetForm'
import { ProjectCreateData, projectCreateSchema } from '@/shared/schemas/projetSchema'
import { toast } from 'sonner'
import { StepDynamicForm, type StepDynamicFormHandle } from '@/shared/forms'

interface OpenPropsProjet {
  currentRow?: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddProjet({ open, onOpenChange, currentRow }: OpenPropsProjet) {
  const idProgramme = useActiveProgrammeId()
  const isEdit = !!currentRow?.id_projet
  const formRef = useRef<StepDynamicFormHandle>(null)

  // ── Données pour les options ──
  const { data: acteurs = [] } = useGetActeurs()
  const { data: localites = [] } = useGetLocalites()
  const { data: niveauxLocalite = [] } = useGetNiveauxLocalite()
  const { data: programmes = [] } = useGetProgrammes()
  const { data: niveauxPlanSite = [] } = useGetNiveauxPlanSite()
  const { data: planSites = [] } = useGetPlanSites()
  const { data: niveauxAvancement = [] } = useGetNiveauxAvancement()
  const { data: etatsFinancement = [] } = useGetEtatsFinancement()
  const { data: typeProjets = [] } = useGetTypeProjet()
  const { data: enverguresProjet = [] } = useGetEnverguresProjet()
  const { data: secteurs = [] } = useGetAllSecteurs()
  const { data: personnels = [] } = useGetPersonnels()

  // ── Helpers d'extraction d'ID ──
  const extractId = (item: any): number => {
    if (typeof item === 'number') return item
    if (item && typeof item === 'object') {
      return (
        item.id_acteur ||
        item.id_loca ||
        item.id_projet ||
        item.id_programme ||
        item.id_ds ||
        item.id_ugl ||
        item.id_type_projet ||
        item.id_niveau_avancement ||
        item.id_etat_financement ||
        item.id_envergure ||
        item.id_secteur ||
        item.n_personnel ||
        item.id ||
        0
      )
    }
    return 0
  }

  const extractIds = (items: any[] | undefined | null): number[] => {
    if (!Array.isArray(items)) return []
    return items.map(extractId).filter((id) => id !== 0)
  }

  // ── Département tutelle initial en mode édition ──
  const initialDepartementTutelle = useMemo(() => {
    if (!currentRow?.structure_projet || !planSites.length) return null
    const structId = extractId(currentRow.structure_projet)
    const struct = planSites.find((ps) => ps.id_ds === structId)
    if (!struct) return null
    const parentId =
      typeof struct.parent_ds === 'object' && struct.parent_ds !== null
        ? (struct.parent_ds as any).id_ds
        : struct.parent_ds
    return parentId ? Number(parentId) : null
  }, [currentRow, planSites])

  // ── Niveaux de localité initiaux en mode édition ──
  const initialNiveauxLocalite = useMemo(() => {
    if (!currentRow?.zone_projet || !localites.length) return []
    const zoneIds = extractIds(currentRow.zone_projet)
    const niveauIds = new Set<number>()
    for (const loc of localites) {
      if (zoneIds.includes(loc.id_loca)) {
        const nivId =
          typeof loc.niveau_loca === 'object' && loc.niveau_loca !== null
            ? loc.niveau_loca.id_nlc || loc.niveau_loca.nombre_nlc
            : loc.niveau_loca
        if (nivId) niveauIds.add(Number(nivId))
      }
    }
    return Array.from(niveauIds)
  }, [currentRow, localites])

  // ── États pour les filtres dynamiques ──
  const [filterNiveauLocalite, setFilterNiveauLocalite] = useState<number[]>(initialNiveauxLocalite)
  const [filterDepartementTutelle, setFilterDepartementTutelle] = useState<number | null>(
    initialDepartementTutelle
  )
  const [filterSecteur, setFilterSecteur] = useState<number | null>(null)
  const [selectedZoneProjet, setSelectedZoneProjet] = useState<number[]>(() =>
    extractIds(currentRow?.zone_projet)
  )

  useEffect(() => {
    if (open) {
      setFilterNiveauLocalite(initialNiveauxLocalite)
      setFilterDepartementTutelle(initialDepartementTutelle)
      setSelectedZoneProjet(extractIds(currentRow?.zone_projet))
    }
  }, [open, initialNiveauxLocalite, initialDepartementTutelle, currentRow])

  // ── Configuration du formulaire ──
  const formConfig = useMemo(
    () =>
      getProjetFormConfig({
        acteurs,
        localites,
        niveauxLocalite,
        programmes,
        niveauxPlanSite,
        planSites,
        niveauxAvancement,
        etatsFinancement,
        typeProjets,
        enverguresProjet,
        secteurs,
        personnels,
        filterNiveauLocalite,
        filterDepartementTutelle,
        filterSecteur,
        selectedZoneProjet,
      }),
    [
      acteurs,
      localites,
      niveauxLocalite,
      programmes,
      niveauxPlanSite,
      planSites,
      niveauxAvancement,
      etatsFinancement,
      typeProjets,
      enverguresProjet,
      secteurs,
      personnels,
      filterNiveauLocalite,
      filterDepartementTutelle,
      filterSecteur,
      selectedZoneProjet,
    ]
  )

  // ── Mutations ──
  const createMutation = useCreateProjet()
  const updateMutation = useUpdateProjet(currentRow?.id_projet || 0)
  const mutation = isEdit ? updateMutation : createMutation

  // ── Valeurs par défaut ──
  const defaultValues: ProjectCreateData = {
    // Étape 1
    code_projet: currentRow?.code_projet ?? '',
    sigle_projet: currentRow?.sigle_projet ?? '',
    intitule_projet: currentRow?.intitule_projet ?? '',
    is_active:
      currentRow?.is_active !== undefined
        ? currentRow.is_active
          ? 'true'
          : 'false'
        : 'true',
    date_demarrage_projet: currentRow?.date_demarrage_projet ?? '',
    duree_projet: currentRow?.duree_projet ?? 0,
    date_signature_projet: currentRow?.date_signature_projet ?? '',
    description_projet: currentRow?.description_projet ?? '',

    // Étape 2
    filter_niveau_localite: initialNiveauxLocalite,
    zone_projet: extractIds(currentRow?.zone_projet),
    programme_projet:
      extractId(currentRow?.programme_projet) || (idProgramme ? Number(idProgramme) : 0),
    filter_departement_tutelle: initialDepartementTutelle,
    structure_projet: extractId(currentRow?.structure_projet),
    niveau_avancement: extractId(currentRow?.niveau_avancement) || null,
    avance_demarrage: currentRow?.avance_demarrage ?? null,
    date_estimation: currentRow?.date_estimation ?? '',
    budget_projet: currentRow?.budget_projet ?? 0,
    etat_financement: extractId(currentRow?.etat_financement) || null,

    // Étape 3
    type_projet: extractId(currentRow?.type_projet),
    envergure_projet: extractId(currentRow?.envergure_projet) || null,
    filter_secteur: null,
    secteur_projet: extractId(currentRow?.secteur_projet) || null,
    recuperation_geolocation: currentRow?.recuperation_geolocation ? 'oui' : 'non',
    latitude: currentRow?.latitude ?? '',
    longitude: currentRow?.longitude ?? '',
    responsable_projet: extractId(currentRow?.responsable_projet) || null,
    signataires_projet: extractIds(currentRow?.signataires_projet),
    partenaires_execution_projet: extractIds(currentRow?.partenaires_execution_projet),
    partenaire_projet: null,
  }

  // ── Événements de changement sur les champs ──
  const handleFieldChange = (fieldName: string, value: unknown) => {
    if (fieldName === 'filter_niveau_localite') {
      const vals = Array.isArray(value)
        ? value.map(Number).filter((v) => !isNaN(v) && v > 0)
        : value
          ? [Number(value)]
          : []
      setFilterNiveauLocalite(vals)
    } else if (fieldName === 'zone_projet') {
      const vals = Array.isArray(value) ? value.map(Number) : []
      setSelectedZoneProjet(vals)
    } else if (fieldName === 'filter_departement_tutelle') {
      const depId = value ? Number(value) : null
      setFilterDepartementTutelle(depId)
      formRef.current?.setValue('structure_projet', null)
    } else if (fieldName === 'filter_secteur') {
      setFilterSecteur(value ? Number(value) : null)
    } else if (
      fieldName === 'recuperation_geolocation' &&
      (value === 'oui' || value === true || value === 'true')
    ) {
      if (typeof window !== 'undefined' && 'geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            formRef.current?.setValue('latitude', position.coords.latitude)
            formRef.current?.setValue('longitude', position.coords.longitude)
            toast.success('Coordonnées géographiques récupérées avec succès')
          },
          (error) => {
            console.warn('Geolocation error:', error)
            toast.error('Impossible de récupérer la géolocalisation actuelle')
          }
        )
      } else {
        toast.error("La géolocalisation n'est pas disponible sur cet appareil")
      }
    }
  }

  // ── Soumission ──
  const handleSubmit = (data: ProjectCreateData) => {
    if (!isEdit && idProgramme == null && !data.programme_projet) {
      toast.error('Sélectionnez un programme avant de créer un projet.')
      return
    }

    const payload: any = {
      ...data,
      is_active:
        data.is_active === true || data.is_active === 'true' || data.is_active === 'Oui',
      structure_projet: data.structure_projet ? Number(data.structure_projet) : null,
      signataires_projet: Array.isArray(data.signataires_projet)
        ? data.signataires_projet.map(Number).filter((n) => !isNaN(n) && n > 0)
        : [],
      partenaires_execution_projet: Array.isArray(data.partenaires_execution_projet)
        ? data.partenaires_execution_projet.map(Number).filter((n) => !isNaN(n) && n > 0)
        : [],
      zone_projet: (data.zone_projet || []).map(Number).filter((n) => !isNaN(n) && n > 0),
      niveau_avancement:
        data.niveau_avancement && Number(data.niveau_avancement) > 0
          ? Number(data.niveau_avancement)
          : null,
      avance_demarrage: data.avance_demarrage ? Number(data.avance_demarrage) : null,
      etat_financement:
        data.etat_financement && Number(data.etat_financement) > 0
          ? Number(data.etat_financement)
          : null,
      envergure_projet:
        data.envergure_projet && Number(data.envergure_projet) > 0
          ? Number(data.envergure_projet)
          : null,
      secteur_projet:
        data.secteur_projet && Number(data.secteur_projet) > 0
          ? Number(data.secteur_projet)
          : null,
      responsable_projet:
        data.responsable_projet && Number(data.responsable_projet) > 0
          ? Number(data.responsable_projet)
          : null,
      budget_projet:
        currentRow?.budget_projet != null
          ? Number(currentRow.budget_projet)
          : Number(data.budget_projet || 0),
      duree_projet: Number(data.duree_projet || 0),
      recuperation_geolocation:
        data.recuperation_geolocation === 'oui' || data.recuperation_geolocation === true,
      latitude:
        data.latitude !== '' && data.latitude != null ? Number(data.latitude) : null,
      longitude:
        data.longitude !== '' && data.longitude != null ? Number(data.longitude) : null,
    }

    delete payload.filter_niveau_localite
    delete payload.filter_departement_tutelle
    delete payload.filter_secteur
    delete payload.partenaire_projet

    mutation.mutate(payload, {
      onSuccess: () => {
        onOpenChange(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={DIALOG_SIZES.xl}>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Modifier le projet' : 'Ajouter un projet'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Modification des informations du projet'
              : 'Création d’un nouveau projet — renseignez les informations en 3 étapes'}
          </DialogDescription>
        </DialogHeader>

        <StepDynamicForm
          ref={formRef}
          config={formConfig}
          schema={projectCreateSchema}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isLoading={mutation.isPending}
          onFieldChange={handleFieldChange}
          submitText={isEdit ? 'Modifier le projet' : 'Créer le projet'}
          loadingText={isEdit ? 'Modification…' : 'Enregistrement…'}
        />
      </DialogContent>
    </Dialog>
  )
}
