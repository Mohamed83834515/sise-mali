import { useState, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MapPin, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSaveInfrastructure } from '@/shared/api/hooks/admin/infrastructureHooks'
import { useGetBureauxControle } from '@/shared/api/hooks/admin/bureauControleHooks'
import { useGetEntreprisesTravaux } from '@/shared/api/hooks/admin/entrepriseTravauxHooks'
import { useGetTypesInfrastructures } from '@/shared/api/hooks/admin/typeInfrastructureHooks'
import { useGetAllSecteurs } from '@/shared/api/hooks/admin/secteurHooks'
import { useGetAllLocalites } from '@/shared/api/hooks/admin/localiteHooks'
import {
  infrastructureSchema,
  type InfrastructureFormData,
} from '@/shared/schemas/infrastructureSchema'
import { resolveRelationId } from '@/shared/utils/resolveApiRelation'

type InfrastructureFormDialogProps = {
  projet: Projet
  infrastructure?: Infrastructure | null
  onClose: () => void
  onSuccess: () => void
}

function formatDateForInput(value?: string | null): string {
  if (!value) return ''
  return value.includes('T') ? value.split('T')[0] : value
}

export default function InfrastructureFormDialog({
  projet,
  infrastructure,
  onClose,
  onSuccess,
}: InfrastructureFormDialogProps) {
  const isEditing = !!infrastructure?.id_infrastructure
  const idProjet = projet.id_projet

  const { data: rawBureaux = [] } = useGetBureauxControle()
  const { data: rawEntreprises = [] } = useGetEntreprisesTravaux()
  const { data: rawTypesInfra = [] } = useGetTypesInfrastructures()
  const { data: rawSecteurs = [] } = useGetAllSecteurs()
  const { data: rawLocalites = [] } = useGetAllLocalites()

  const bureaux = useMemo(
    () => (Array.isArray(rawBureaux) ? rawBureaux : []),
    [rawBureaux]
  )
  const entreprises = useMemo(
    () => (Array.isArray(rawEntreprises) ? rawEntreprises : []),
    [rawEntreprises]
  )
  const typesInfra = useMemo(
    () =>
      Array.isArray(rawTypesInfra)
        ? (rawTypesInfra as TypeInfrastructure[])
        : [],
    [rawTypesInfra]
  )
  const secteurs = useMemo(
    () => (Array.isArray(rawSecteurs) ? rawSecteurs : []),
    [rawSecteurs]
  )
  const localites = useMemo(() => {
    if (Array.isArray(rawLocalites)) return rawLocalites
    if (rawLocalites && Array.isArray((rawLocalites as any).results))
      return (rawLocalites as any).results
    if (rawLocalites && Array.isArray((rawLocalites as any).localites))
      return (rawLocalites as any).localites
    return []
  }, [rawLocalites])

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [geoLocating, setGeoLocating] = useState(false)

  // Secteurs principaux (sans parent ou niveau 1)
  const mainSecteurs = useMemo(() => {
    return secteurs.filter((s) => {
      const parentId = resolveRelationId(s.parent_secteur, 'id_secteur')
      return !parentId
    })
  }, [secteurs])

  const initialSecteurId = useMemo(() => {
    return (
      resolveRelationId(infrastructure?.secteur, 'id_secteur') ??
      (typeof infrastructure?.secteur === 'number' ? infrastructure.secteur : 0)
    )
  }, [infrastructure])

  const initialSousSecteurId = useMemo(() => {
    return (
      resolveRelationId(infrastructure?.sous_secteur, 'id_secteur') ??
      (typeof infrastructure?.sous_secteur === 'number'
        ? infrastructure.sous_secteur
        : 0)
    )
  }, [infrastructure])

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InfrastructureFormData>({
    resolver: zodResolver(infrastructureSchema) as any,
    defaultValues: {
      code_infrastructure: infrastructure?.code_infrastructure ?? '',
      nom_infrastructure: infrastructure?.nom_infrastructure ?? '',
      maitre_ouvrage: infrastructure?.maitre_ouvrage ?? '',
      cout_infrastructure:
        infrastructure?.cout_infrastructure != null
          ? Number(infrastructure.cout_infrastructure)
          : ('' as any),
      date_debut_prevue: formatDateForInput(infrastructure?.date_debut_prevue),
      date_fin_prevue: formatDateForInput(infrastructure?.date_fin_prevue),
      delai_consomme:
        infrastructure?.delai_consomme != null
          ? Number(infrastructure.delai_consomme)
          : ('' as any),
      logo: infrastructure?.logo ?? null,
      latitude:
        infrastructure?.latitude != null
          ? Number(infrastructure.latitude)
          : ('' as any),
      longitude:
        infrastructure?.longitude != null
          ? Number(infrastructure.longitude)
          : ('' as any),
      type_infrastructure:
        resolveRelationId(
          infrastructure?.type_infrastructure,
          'id_type_infrastructure'
        ) ??
        (typeof infrastructure?.type_infrastructure === 'number'
          ? infrastructure.type_infrastructure
          : 0),
      bureau_controle:
        resolveRelationId(infrastructure?.bureau_controle, 'id_bureau') ??
        (typeof infrastructure?.bureau_controle === 'number'
          ? infrastructure.bureau_controle
          : 0),
      entreprise_travaux:
        resolveRelationId(
          infrastructure?.entreprise_travaux,
          'id_entreprise'
        ) ??
        (typeof infrastructure?.entreprise_travaux === 'number'
          ? infrastructure.entreprise_travaux
          : 0),
      secteur: initialSecteurId,
      sous_secteur: initialSousSecteurId,
      localite:
        resolveRelationId(infrastructure?.localite, 'id_loca') ??
        resolveRelationId(infrastructure?.localite, 'id') ??
        (typeof infrastructure?.localite === 'number'
          ? infrastructure.localite
          : 0),
    },
  })

  const selectedSecteur = watch('secteur')

  // Sous-secteurs dépendants du secteur sélectionné
  const filteredSousSecteurs = useMemo(() => {
    if (!selectedSecteur || Number(selectedSecteur) === 0) return []
    return secteurs.filter((s) => {
      const parentId = resolveRelationId(s.parent_secteur, 'id_secteur')
      return parentId === Number(selectedSecteur)
    })
  }, [secteurs, selectedSecteur])

  // Géolocalisation automatique
  const handleAutoGeolocate = () => {
    if (!navigator.geolocation) return
    setGeoLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setValue('latitude', Number(pos.coords.latitude.toFixed(6)))
        setValue('longitude', Number(pos.coords.longitude.toFixed(6)))
        setGeoLocating(false)
      },
      () => {
        setGeoLocating(false)
      },
      { timeout: 10000 }
    )
  }

  const saveMutation = useSaveInfrastructure(
    isEditing,
    infrastructure,
    idProjet,
    onSuccess
  )

  const onSubmit = (data: InfrastructureFormData) => {
    if (logoFile) {
      const formData = new FormData()
      formData.append('code_infrastructure', data.code_infrastructure.trim())
      formData.append('nom_infrastructure', data.nom_infrastructure.trim())
      if (data.maitre_ouvrage)
        formData.append('maitre_ouvrage', data.maitre_ouvrage.trim())
      formData.append(
        'cout_infrastructure',
        String(Number(data.cout_infrastructure) || 0)
      )
      if (data.date_debut_prevue)
        formData.append('date_debut_prevue', data.date_debut_prevue)
      if (data.date_fin_prevue)
        formData.append('date_fin_prevue', data.date_fin_prevue)
      formData.append(
        'delai_consomme',
        String(Number(data.delai_consomme) || 0)
      )
      formData.append('projet', String(idProjet))
      if (data.latitude != null && data.latitude !== ('' as any))
        formData.append('latitude', String(data.latitude))
      if (data.longitude != null && data.longitude !== ('' as any))
        formData.append('longitude', String(data.longitude))
      if (data.type_infrastructure)
        formData.append('type_infrastructure', String(data.type_infrastructure))
      if (data.bureau_controle)
        formData.append('bureau_controle', String(data.bureau_controle))
      if (data.entreprise_travaux)
        formData.append('entreprise_travaux', String(data.entreprise_travaux))
      if (data.secteur) formData.append('secteur', String(data.secteur))
      if (data.sous_secteur)
        formData.append('sous_secteur', String(data.sous_secteur))
      if (data.localite) formData.append('localite', String(data.localite))
      formData.append('logo', logoFile)

      saveMutation.mutate(formData)
      return
    }

    const payload = {
      code_infrastructure: data.code_infrastructure.trim(),
      nom_infrastructure: data.nom_infrastructure.trim(),
      maitre_ouvrage: data.maitre_ouvrage?.trim() || undefined,
      cout_infrastructure: Number(data.cout_infrastructure) || 0,
      date_debut_prevue: data.date_debut_prevue || undefined,
      date_fin_prevue: data.date_fin_prevue || undefined,
      delai_consomme: Number(data.delai_consomme) || 0,
      projet: idProjet,
      latitude:
        data.latitude != null && data.latitude !== ('' as any)
          ? Number(data.latitude)
          : 0,
      longitude:
        data.longitude != null && data.longitude !== ('' as any)
          ? Number(data.longitude)
          : 0,
      type_infrastructure: data.type_infrastructure
        ? Number(data.type_infrastructure)
        : undefined,
      bureau_controle: data.bureau_controle
        ? Number(data.bureau_controle)
        : undefined,
      entreprise_travaux: data.entreprise_travaux
        ? Number(data.entreprise_travaux)
        : undefined,
      secteur: data.secteur ? Number(data.secteur) : undefined,
      sous_secteur: data.sous_secteur ? Number(data.sous_secteur) : undefined,
      localite: data.localite ? Number(data.localite) : undefined,
      logo: typeof data.logo === 'string' ? data.logo : undefined,
    }

    saveMutation.mutate(payload)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-2.5 pt-1'>
      {/* ── Ligne 1 : Maître d'ouvrage | Bureau de contrôle | Entreprise de travaux ── */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2'>
        <div className='space-y-1'>
          <Label htmlFor='maitre_ouvrage' className='text-[11px] font-semibold text-slate-700'>
            Maître d&apos;ouvrage
          </Label>
          <Input
            id='maitre_ouvrage'
            placeholder="Ex. Ministère de l'Énergie"
            className='h-8.5 text-xs'
            {...register('maitre_ouvrage')}
          />
        </div>

        <div className='space-y-1'>
          <Label className='text-[11px] font-semibold text-slate-700'>Bureau de contrôle</Label>
          <Controller
            control={control}
            name='bureau_controle'
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : ''}
                onValueChange={(val) =>
                  field.onChange(val ? Number(val) : null)
                }
              >
                <SelectTrigger className='h-8.5 w-full text-xs'>
                  <SelectValue placeholder='Sélectionner un bureau' />
                </SelectTrigger>
                <SelectContent>
                  {bureaux.map((b) => (
                    <SelectItem key={b.id_bureau} value={String(b.id_bureau)}>
                      {b.code_bureau} - {b.intitule_bureau}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className='space-y-1'>
          <Label className='text-[11px] font-semibold text-slate-700'>Entreprise de travaux</Label>
          <Controller
            control={control}
            name='entreprise_travaux'
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : ''}
                onValueChange={(val) =>
                  field.onChange(val ? Number(val) : null)
                }
              >
                <SelectTrigger className='h-8.5 w-full text-xs'>
                  <SelectValue placeholder='Sélectionner une entreprise' />
                </SelectTrigger>
                <SelectContent>
                  {entreprises.map((e) => (
                    <SelectItem
                      key={e.id_entreprise}
                      value={String(e.id_entreprise)}
                    >
                      {e.code_entreprise} - {e.intitule_entreprise}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* ── Ligne 2 : Code* | Nom* | Coût infrastructure ── */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2'>
        <div className='space-y-1'>
          <Label htmlFor='code_infrastructure' className='text-[11px] font-semibold text-slate-700'>
            Code <span className='text-red-500'>*</span>
          </Label>
          <Input
            id='code_infrastructure'
            placeholder='Ex. INF-001'
            className='h-8.5 text-xs'
            {...register('code_infrastructure')}
          />
          {errors.code_infrastructure && (
            <p className='text-[11px] text-red-500 mt-0.5'>
              {errors.code_infrastructure.message}
            </p>
          )}
        </div>

        <div className='space-y-1'>
          <Label htmlFor='nom_infrastructure' className='text-[11px] font-semibold text-slate-700'>
            Nom <span className='text-red-500'>*</span>
          </Label>
          <Input
            id='nom_infrastructure'
            placeholder="Ex. Forage d'eau potable"
            className='h-8.5 text-xs'
            {...register('nom_infrastructure')}
          />
          {errors.nom_infrastructure && (
            <p className='text-[11px] text-red-500 mt-0.5'>
              {errors.nom_infrastructure.message}
            </p>
          )}
        </div>

        <div className='space-y-1'>
          <Label htmlFor='cout_infrastructure' className='text-[11px] font-semibold text-slate-700'>
            Coût infrastructure (FCFA)
          </Label>
          <Input
            id='cout_infrastructure'
            type='number'
            min='0'
            placeholder='Ex. 15000000'
            className='h-8.5 text-xs'
            {...register('cout_infrastructure')}
          />
        </div>
      </div>

      {/* ── Ligne 3 : Date début prévue | Date fin prévue | Délai consommé ── */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2'>
        <div className='space-y-1'>
          <Label htmlFor='date_debut_prevue' className='text-[11px] font-semibold text-slate-700'>
            Date de début prévue
          </Label>
          <Input
            id='date_debut_prevue'
            type='date'
            className='h-8.5 text-xs'
            {...register('date_debut_prevue')}
          />
        </div>

        <div className='space-y-1'>
          <Label htmlFor='date_fin_prevue' className='text-[11px] font-semibold text-slate-700'>
            Date fin prévue
          </Label>
          <Input
            id='date_fin_prevue'
            type='date'
            className='h-8.5 text-xs'
            {...register('date_fin_prevue')}
          />
        </div>

        <div className='space-y-1'>
          <Label htmlFor='delai_consomme' className='text-[11px] font-semibold text-slate-700'>
            Délai consommé (jours)
          </Label>
          <Input
            id='delai_consomme'
            type='number'
            min='0'
            placeholder='Ex. 45'
            className='h-8.5 text-xs'
            {...register('delai_consomme')}
          />
        </div>
      </div>

      {/* ── Ligne 4 : Logo | Secteur | Sous-secteur ── */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2'>
        <div className='space-y-1'>
          <Label htmlFor='logo' className='text-[11px] font-semibold text-slate-700'>
            Logo / Photo
          </Label>
          <Input
            id='logo'
            type='file'
            accept='image/png,image/jpeg,image/jpg'
            className='h-8.5 text-xs file:py-0 file:px-2 file:h-full file:border-0 file:bg-slate-100 file:text-slate-700 file:text-xs'
            onChange={(e) => {
              const file = e.target.files?.[0] || null
              setLogoFile(file)
            }}
          />
        </div>

        <div className='space-y-1'>
          <Label className='text-[11px] font-semibold text-slate-700'>
            Sélectionner un secteur
          </Label>
          <Controller
            control={control}
            name='secteur'
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : ''}
                onValueChange={(val) => {
                  const numVal = val ? Number(val) : null
                  field.onChange(numVal)
                  setValue('sous_secteur', null)
                }}
              >
                <SelectTrigger className='h-8.5 w-full text-xs'>
                  <SelectValue placeholder='Sélectionner un secteur' />
                </SelectTrigger>
                <SelectContent>
                  {mainSecteurs.map((s) => (
                    <SelectItem
                      key={s.id_secteur}
                      value={String(s.id_secteur)}
                    >
                      {s.code_secteur} - {s.intitule_secteur}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className='space-y-1'>
          <Label className='text-[11px] font-semibold text-slate-700'>Sous-secteur</Label>
          <Controller
            control={control}
            name='sous_secteur'
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : ''}
                onValueChange={(val) =>
                  field.onChange(val ? Number(val) : null)
                }
                disabled={filteredSousSecteurs.length === 0}
              >
                <SelectTrigger className='h-8.5 w-full text-xs'>
                  <SelectValue
                    placeholder={
                      selectedSecteur
                        ? filteredSousSecteurs.length > 0
                          ? 'Sélectionner un sous-secteur'
                          : 'Aucun sous-secteur disponible'
                        : 'Choisir d’abord un secteur'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {filteredSousSecteurs.map((s) => (
                    <SelectItem
                      key={s.id_secteur}
                      value={String(s.id_secteur)}
                    >
                      {s.code_secteur} - {s.intitule_secteur}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* ── Ligne 5 : Localité | Coordonnées GPS | Type d'infrastructure ── */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2'>
        <div className='space-y-1'>
          <Label className='text-[11px] font-semibold text-slate-700'>Localité</Label>
          <Controller
            control={control}
            name='localite'
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : ''}
                onValueChange={(val) =>
                  field.onChange(val ? Number(val) : null)
                }
              >
                <SelectTrigger className='h-8.5 w-full text-xs'>
                  <SelectValue placeholder='Sélectionner une localité' />
                </SelectTrigger>
                <SelectContent className='max-h-56'>
                  {(localites as Localite[]).map((loc) => (
                    <SelectItem
                      key={loc.id_loca}
                      value={String(loc.id_loca)}
                    >
                      {String(loc.nom_loca ?? loc.code_loca ?? '')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className='space-y-1'>
          <div className='flex items-center justify-between'>
            <Label className='text-[11px] font-semibold text-slate-700'>
              Géo Infrastructure
            </Label>
            <button
              type='button'
              className='text-[10px] text-primary hover:underline flex items-center gap-1 font-medium'
              onClick={handleAutoGeolocate}
              disabled={geoLocating}
            >
              {geoLocating ? (
                <Loader2 className='h-3 w-3 animate-spin' />
              ) : (
                <MapPin className='h-3 w-3' />
              )}
              Position GPS
            </button>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <Input
              type='number'
              step='any'
              placeholder='Latitude'
              className='h-8.5 text-xs'
              {...register('latitude')}
            />
            <Input
              type='number'
              step='any'
              placeholder='Longitude'
              className='h-8.5 text-xs'
              {...register('longitude')}
            />
          </div>
        </div>

        <div className='space-y-1'>
          <Label className='text-[11px] font-semibold text-slate-700'>Type d&apos;infrastructure</Label>
          <Controller
            control={control}
            name='type_infrastructure'
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : ''}
                onValueChange={(val) =>
                  field.onChange(val ? Number(val) : null)
                }
              >
                <SelectTrigger className='h-8.5 w-full text-xs'>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  {(typesInfra as TypeInfrastructure[]).map((t) => (
                    <SelectItem
                      key={t.id_type_infrastructure}
                      value={String(t.id_type_infrastructure)}
                    >
                      {t.code_type_infrastructure} - {t.intitule_type_infrastructure}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* ── Actions ── */}
      <div className='flex items-center justify-end gap-2.5 pt-2 border-t mt-1'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={onClose}
          className='h-8 px-4 text-xs'
        >
          Annuler
        </Button>
        <Button
          type='submit'
          size='sm'
          disabled={saveMutation.isPending}
          className='h-8 px-5 text-xs bg-primary text-primary-foreground font-medium'
        >
          {saveMutation.isPending && (
            <Loader2 className='mr-1.5 h-3.5 w-3.5 animate-spin' />
          )}
          {isEditing ? 'Mettre à jour' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  )
}
