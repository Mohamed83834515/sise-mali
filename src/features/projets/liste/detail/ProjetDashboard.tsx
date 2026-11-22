import { useMemo, useState } from 'react'
import {
  Wallet,
  Building2,
  Calendar,
  TrendingUp,
  FileText,
  Layers,
  ArrowUpRight,
  Landmark,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts'
import { useGetFinancementsProjet } from '@/shared/api/hooks/admin/financementProjetHooks'
import { useGetModesFinancement } from '@/shared/api/hooks/admin/modeFinancementHooks'
import { useGetInfrastructures } from '@/shared/api/hooks/admin/infrastructureHooks'
import { useGetTypesInfrastructures } from '@/shared/api/hooks/admin/typeInfrastructureHooks'
import { useGetDossiersProjet } from '@/shared/api/hooks/admin/dossierProjetHooks'
import { useIndicateursPerformanceByProjet } from '@/shared/api/hooks/admin/indicateurPerformanceProjetHooks'
import { formatNumber } from '@/shared/utils/montantFormater'
import { resolveRelationId } from '@/shared/utils/resolveApiRelation'
import { computeDureeConsommee, formatDateFr } from './projetDetailUtils'
import { KpiIndicateurs } from './KpiIndicateurs'
import ProjetRapportOrDialog from './rapport/ProjetRapportOrDialog'

interface ProjetDashboardProps {
  projet: Projet
}

export default function ProjetDashboard({ projet }: ProjetDashboardProps) {
  const idProjet = projet.id_projet
  const [rapportOpen, setRapportOpen] = useState(false)

  // ── Données des onglets actifs ─────────────────────────────────────────────
  const { data: financements = [] } = useGetFinancementsProjet(idProjet)
  const { data: modesFinancement = [] } = useGetModesFinancement()
  const { data: infrastructures = [] } = useGetInfrastructures(idProjet)
  const { data: typesInfra = [] } = useGetTypesInfrastructures()
  const { data: dossiers = [] } = useGetDossiersProjet(idProjet)
  const { indicateurs = [] } = useIndicateursPerformanceByProjet(projet)

  const safeFinancements = useMemo(
    () => (Array.isArray(financements) ? financements : []),
    [financements]
  )
  const safeInfrastructures = useMemo(
    () => (Array.isArray(infrastructures) ? infrastructures : []),
    [infrastructures]
  )
  const safeModes = useMemo(
    () => (Array.isArray(modesFinancement) ? modesFinancement : []),
    [modesFinancement]
  )
  const safeTypes = useMemo(
    () => (Array.isArray(typesInfra) ? (typesInfra as TypeInfrastructure[]) : []),
    [typesInfra]
  )

  // ── 1. Statistiques Financement ───────────────────────────────────────────
  const budgetPrevu = Number(projet.budget_projet) || 0
  const totalFinancementMobilise = useMemo(
    () => safeFinancements.reduce((acc, f) => acc + (Number(f.montant) || 0), 0),
    [safeFinancements]
  )

  const tauxCouvertureBudget = useMemo(() => {
    if (budgetPrevu === 0) return 0
    return Math.min(Math.round((totalFinancementMobilise / budgetPrevu) * 100), 100)
  }, [budgetPrevu, totalFinancementMobilise])

  // Répartition par mode de financement
  const financementsParMode = useMemo(() => {
    const modesMap = new Map<number, { nom: string; montant: number; count: number }>()

    safeModes.forEach((m) => {
      modesMap.set(m.id_mode_financement, {
        nom: m.nom_mode_financement || m.code_mode_financement,
        montant: 0,
        count: 0,
      })
    })

    safeFinancements.forEach((f) => {
      const modeId =
        resolveRelationId(f.mode_financement, 'id_mode_financement') ??
        (typeof f.mode_financement === 'number' ? f.mode_financement : null)

      if (modeId && modesMap.has(modeId)) {
        const item = modesMap.get(modeId)!
        item.montant += Number(f.montant) || 0
        item.count += 1
      } else {
        const key = modeId ?? 0
        const existing = modesMap.get(key)
        if (existing) {
          existing.montant += Number(f.montant) || 0
          existing.count += 1
        } else {
          modesMap.set(key, {
            nom: f.type_financement ? String(f.type_financement) : 'Autre',
            montant: Number(f.montant) || 0,
            count: 1,
          })
        }
      }
    })

    return Array.from(modesMap.values()).filter((item) => item.montant > 0 || item.count > 0)
  }, [safeModes, safeFinancements])

  // ── 2. Statistiques Infrastructures ───────────────────────────────────────
  const totalInfrastructures = safeInfrastructures.length
  const totalCoutInfrastructures = useMemo(
    () =>
      safeInfrastructures.reduce(
        (acc, infra) => acc + (Number(infra.cout_infrastructure) || 0),
        0
      ),
    [safeInfrastructures]
  )

  // Répartition par type d'infrastructure
  const infrastructuresParType = useMemo(() => {
    const typesMap = new Map<number, { nom: string; count: number; cout: number }>()

    safeTypes.forEach((t) => {
      typesMap.set(t.id_type_infrastructure, {
        nom: t.intitule_type_infrastructure || t.code_type_infrastructure,
        count: 0,
        cout: 0,
      })
    })

    safeInfrastructures.forEach((infra) => {
      const typeId =
        resolveRelationId(infra.type_infrastructure, 'id_type_infrastructure') ??
        (typeof infra.type_infrastructure === 'number'
          ? infra.type_infrastructure
          : null)

      if (typeId && typesMap.has(typeId)) {
        const item = typesMap.get(typeId)!
        item.count += 1
        item.cout += Number(infra.cout_infrastructure) || 0
      } else {
        const key = typeId ?? 0
        const existing = typesMap.get(key)
        if (existing) {
          existing.count += 1
          existing.cout += Number(infra.cout_infrastructure) || 0
        } else {
          typesMap.set(key, {
            nom: 'Non spécifié',
            count: 1,
            cout: Number(infra.cout_infrastructure) || 0,
          })
        }
      }
    })

    return Array.from(typesMap.values()).filter((item) => item.count > 0)
  }, [safeTypes, safeInfrastructures])

  // ── 3. Calendrier & Durée ──────────────────────────────────────────────────
  const duree = computeDureeConsommee(projet)

  // ── 4. Indicateurs CMR ─────────────────────────────────────────────────────
  const totalIndicateurs = indicateurs.length
  const indicateursAtteints = useMemo(() => {
    return indicateurs.filter((ind: any) => {
      const target = Number(ind.valeurCible) || 1
      const current = Number(ind.valeurActuelle) || 0
      return current >= target
    }).length
  }, [indicateurs])

  const fmt = (v: number) => {
    if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)} Md`
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)} M`
    if (v >= 1_000) return `${(v / 1_000).toFixed(0)} k`
    return String(v)
  }

  const chartConfig = {
    montant: { label: 'Montant (FCFA)', color: 'hsl(var(--primary))' },
    cout: { label: 'Coût estimé (FCFA)', color: '#10b981' },
    count: { label: 'Nombre', color: '#06b6d4' },
  } satisfies ChartConfig

  return (
    <div className='space-y-6 p-1'>
      {/* ── En-tête ── */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 className='text-xl font-bold tracking-tight text-foreground'>
            Tableau de bord
          </h2>
          <p className='mt-0.5 text-sm text-muted-foreground'>
            Vue d&apos;ensemble — finances, infrastructures et indicateurs de résultats
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button type='button' variant='outline' onClick={() => setRapportOpen(true)}>
            <FileText className='h-4 w-4 mr-1.5' />
            Rapport du projet
          </Button>
        </div>
      </div>

      <ProjetRapportOrDialog
        projet={projet}
        open={rapportOpen}
        onOpenChange={setRapportOpen}
      />

      {/* ── 4 Cartes KPI Principales ── */}
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'>
        {/* KPI 1 : Financements & Budget */}
        <Card className='relative overflow-hidden border-0 shadow-sm bg-gradient-to-br from-cyan-50/60 to-transparent dark:from-cyan-950/20'>
          <div className='absolute inset-x-0 top-0 h-1 bg-cyan-500' />
          <Wallet
            className='absolute right-3 top-4 h-16 w-16 opacity-[0.07] text-cyan-500'
            strokeWidth={1.5}
          />
          <CardContent className='pt-5 pb-4 px-5'>
            <div className='flex items-center gap-2 mb-3'>
              <div className='rounded-full bg-cyan-100 p-1 dark:bg-cyan-900/30'>
                <Wallet className='h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400' />
              </div>
              <p className='text-[11px] font-semibold tracking-widest text-muted-foreground uppercase'>
                Financements mobilisés
              </p>
            </div>
            <div className='space-y-2'>
              <div className='flex items-baseline justify-between'>
                <span className='text-2xl font-bold text-cyan-700 dark:text-cyan-300'>
                  {formatNumber(totalFinancementMobilise)}
                </span>
                <span className='text-[10px] font-semibold text-muted-foreground'>
                  FCFA
                </span>
              </div>
              <div className='space-y-1 pt-1'>
                <div className='flex justify-between items-center text-xs'>
                  <span className='text-muted-foreground'>Couverture budget</span>
                  <span className='font-bold text-cyan-600'>{tauxCouvertureBudget}%</span>
                </div>
                <div className='h-1.5 w-full overflow-hidden rounded-full bg-muted'>
                  <div
                    className='h-full bg-cyan-500 rounded-full transition-all duration-700'
                    style={{ width: `${tauxCouvertureBudget}%` }}
                  />
                </div>
              </div>
              <p className='text-[11px] text-muted-foreground pt-0.5'>
                <span className='font-semibold text-foreground'>
                  {safeFinancements.length}
                </span>{' '}
                accord(s) de financement
              </p>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2 : Infrastructures */}
        <Card className='relative overflow-hidden border-0 shadow-sm bg-gradient-to-br from-emerald-50/60 to-transparent dark:from-emerald-950/20'>
          <div className='absolute inset-x-0 top-0 h-1 bg-emerald-500' />
          <Building2
            className='absolute right-3 top-4 h-16 w-16 opacity-[0.07] text-emerald-500'
            strokeWidth={1.5}
          />
          <CardContent className='pt-5 pb-4 px-5'>
            <div className='flex items-center gap-2 mb-3'>
              <div className='rounded-full bg-emerald-100 p-1 dark:bg-emerald-900/30'>
                <Building2 className='h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400' />
              </div>
              <p className='text-[11px] font-semibold tracking-widest text-muted-foreground uppercase'>
                Infrastructures
              </p>
            </div>
            <div className='space-y-2'>
              <div className='flex items-baseline justify-between'>
                <span className='text-2xl font-bold text-emerald-700 dark:text-emerald-300'>
                  {totalInfrastructures}
                </span>
                <span className='inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700'>
                  Travaux
                </span>
              </div>
              <div className='pt-1'>
                <span className='text-xs text-muted-foreground block'>
                  Coût total engagé
                </span>
                <span className='text-sm font-bold text-foreground'>
                  {formatNumber(totalCoutInfrastructures)}{' '}
                  <span className='text-[10px] font-normal text-muted-foreground'>
                    FCFA
                  </span>
                </span>
              </div>
              <p className='text-[11px] text-muted-foreground'>
                <span className='font-semibold text-foreground'>
                  {infrastructuresParType.length}
                </span>{' '}
                type(s) d&apos;infrastructures
              </p>
            </div>
          </CardContent>
        </Card>

        {/* KPI 3 : Calendrier & Durée */}
        <Card className='relative overflow-hidden border-0 shadow-sm bg-gradient-to-br from-amber-50/60 to-transparent dark:from-amber-950/20'>
          <div className='absolute inset-x-0 top-0 h-1 bg-amber-500' />
          <Calendar
            className='absolute right-3 top-4 h-16 w-16 opacity-[0.07] text-amber-500'
            strokeWidth={1.5}
          />
          <CardContent className='pt-5 pb-4 px-5'>
            <div className='flex items-center gap-2 mb-3'>
              <div className='rounded-full bg-amber-100 p-1 dark:bg-amber-900/30'>
                <Calendar className='h-3.5 w-3.5 text-amber-600 dark:text-amber-400' />
              </div>
              <p className='text-[11px] font-semibold tracking-widest text-muted-foreground uppercase'>
                Durée du projet
              </p>
            </div>
            <div className='space-y-2'>
              <div className='flex items-baseline justify-between'>
                <span className='text-2xl font-bold text-amber-700 dark:text-amber-300'>
                  {duree.percent}%
                </span>
                <span className='text-[10px] font-semibold text-muted-foreground'>
                  consommée
                </span>
              </div>
              <div className='h-1.5 w-full overflow-hidden rounded-full bg-muted'>
                <div
                  className='h-full bg-amber-500 rounded-full transition-all duration-700'
                  style={{ width: `${duree.percent}%` }}
                />
              </div>
              <div className='flex items-center justify-between text-[11px] text-muted-foreground pt-0.5'>
                <span>{duree.elapsedMonths} mois écoulés</span>
                <span>{duree.totalMonths} mois total</span>
              </div>
              <p className='text-[10px] text-muted-foreground truncate'>
                Début : {formatDateFr(projet.date_demarrage_projet)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* KPI 4 : Indicateurs CMR & Résultats */}
        <Card className='relative overflow-hidden border-0 shadow-sm bg-gradient-to-br from-purple-50/60 to-transparent dark:from-purple-950/20'>
          <div className='absolute inset-x-0 top-0 h-1 bg-purple-500' />
          <TrendingUp
            className='absolute right-3 top-4 h-16 w-16 opacity-[0.07] text-purple-500'
            strokeWidth={1.5}
          />
          <CardContent className='pt-5 pb-4 px-5'>
            <div className='flex items-center gap-2 mb-3'>
              <div className='rounded-full bg-purple-100 p-1 dark:bg-purple-900/30'>
                <TrendingUp className='h-3.5 w-3.5 text-purple-600 dark:text-purple-400' />
              </div>
              <p className='text-[11px] font-semibold tracking-widest text-muted-foreground uppercase'>
                Indicateurs CMR
              </p>
            </div>
            <div className='space-y-2'>
              <div className='flex items-baseline justify-between'>
                <span className='text-2xl font-bold text-purple-700 dark:text-purple-300'>
                  {totalIndicateurs}
                </span>
                <span className='inline-flex rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-[9px] font-semibold text-purple-700'>
                  Suivi
                </span>
              </div>
              <div className='flex items-center justify-between text-xs pt-1'>
                <span className='text-muted-foreground'>Cibles atteintes</span>
                <span className='font-bold text-emerald-600'>
                  {indicateursAtteints} / {totalIndicateurs}
                </span>
              </div>
              <div className='h-1.5 w-full overflow-hidden rounded-full bg-muted'>
                <div
                  className='h-full bg-purple-500 rounded-full transition-all duration-700'
                  style={{
                    width: `${
                      totalIndicateurs > 0
                        ? Math.round((indicateursAtteints / totalIndicateurs) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
              <p className='text-[11px] text-muted-foreground'>
                <span className='font-semibold text-foreground'>{dossiers.length}</span>{' '}
                dossier(s) documentaire(s)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Graphiques comparatifs des modules actifs ── */}
      <div className='grid gap-4 lg:grid-cols-2'>
        {/* Graphique 1 : Financements par mode */}
        <Card className='border-0 shadow-sm'>
          <CardHeader className='border-b pb-3'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div className='rounded-lg bg-cyan-500/10 p-1.5'>
                  <Landmark className='h-4 w-4 text-cyan-600' />
                </div>
                <div>
                  <CardTitle className='text-sm font-semibold'>
                    Financements par mode
                  </CardTitle>
                  <CardDescription className='text-xs'>
                    Répartition des montants mobilisés (FCFA)
                  </CardDescription>
                </div>
              </div>
              <span className='text-xs font-semibold text-muted-foreground'>
                Total : {formatNumber(totalFinancementMobilise)} FCFA
              </span>
            </div>
          </CardHeader>
          <CardContent className='pt-5'>
            {financementsParMode.length === 0 ? (
              <div className='flex h-[240px] items-center justify-center text-sm text-muted-foreground'>
                Aucun financement enregistré
              </div>
            ) : (
              <div className='w-full overflow-x-auto'>
                <div style={{ minWidth: '280px' }}>
                  <ChartContainer config={chartConfig} className='h-[240px] w-full'>
                    <BarChart
                      data={financementsParMode}
                      margin={{ top: 25, right: 10, left: -10, bottom: 0 }}
                    >
                      <CartesianGrid
                        vertical={false}
                        strokeDasharray='3 3'
                        className='stroke-muted/40'
                      />
                      <XAxis
                        dataKey='nom'
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        className='fill-muted-foreground text-xs'
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={fmt}
                        className='fill-muted-foreground text-[10px]'
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(v) => `${formatNumber(Number(v))} FCFA`}
                          />
                        }
                      />
                      <Bar dataKey='montant' fill='#06b6d4' radius={[4, 4, 0, 0]}>
                        <LabelList
                          dataKey='montant'
                          position='top'
                          className='fill-muted-foreground text-[9px] font-bold'
                          formatter={(v: any) => fmt(Number(v))}
                        />
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Graphique 2 : Infrastructures par type */}
        <Card className='border-0 shadow-sm'>
          <CardHeader className='border-b pb-3'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div className='rounded-lg bg-emerald-500/10 p-1.5'>
                  <Building2 className='h-4 w-4 text-emerald-600' />
                </div>
                <div>
                  <CardTitle className='text-sm font-semibold'>
                    Infrastructures par type
                  </CardTitle>
                  <CardDescription className='text-xs'>
                    Nombre et investissements par catégorie
                  </CardDescription>
                </div>
              </div>
              <span className='text-xs font-semibold text-muted-foreground'>
                {totalInfrastructures} infrastructure(s)
              </span>
            </div>
          </CardHeader>
          <CardContent className='pt-5'>
            {infrastructuresParType.length === 0 ? (
              <div className='flex h-[240px] items-center justify-center text-sm text-muted-foreground'>
                Aucune infrastructure enregistrée
              </div>
            ) : (
              <div className='w-full overflow-x-auto'>
                <div style={{ minWidth: '280px' }}>
                  <ChartContainer config={chartConfig} className='h-[240px] w-full'>
                    <BarChart
                      data={infrastructuresParType}
                      margin={{ top: 25, right: 10, left: -10, bottom: 0 }}
                    >
                      <CartesianGrid
                        vertical={false}
                        strokeDasharray='3 3'
                        className='stroke-muted/40'
                      />
                      <XAxis
                        dataKey='nom'
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        className='fill-muted-foreground text-xs'
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        className='fill-muted-foreground text-[10px]'
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(v, name) =>
                              name === 'cout'
                                ? `${formatNumber(Number(v))} FCFA`
                                : `${v} unité(s)`
                            }
                          />
                        }
                      />
                      <Bar dataKey='count' fill='#10b981' radius={[4, 4, 0, 0]}>
                        <LabelList
                          dataKey='count'
                          position='top'
                          className='fill-muted-foreground text-[10px] font-bold'
                        />
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Synthèse des finances et investissements ── */}
      <Card className='border-0 bg-gradient-to-br from-background to-muted/20 shadow-sm'>
        <CardHeader className='border-b pb-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='rounded-lg bg-primary/10 p-1.5'>
                <Layers className='h-4 w-4 text-primary' />
              </div>
              <div>
                <CardTitle className='text-sm font-semibold'>
                  Synthèse globale du projet
                </CardTitle>
                <CardDescription className='text-xs'>
                  Budget prévisionnel, financements accordés et investissements en infrastructures
                </CardDescription>
              </div>
            </div>
            <span className='inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border-emerald-200'>
              <ArrowUpRight className='h-3 w-3' />
              {tauxCouvertureBudget}% mobilisé
            </span>
          </div>
        </CardHeader>
        <CardContent className='space-y-4 pt-5'>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            <div className='rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50'>
              <p className='text-[10px] tracking-widest text-muted-foreground uppercase font-bold'>
                Budget prévisionnel du projet
              </p>
              <p className='text-lg font-bold mt-1 text-foreground'>
                {formatNumber(budgetPrevu)}
              </p>
              <p className='text-[10px] text-muted-foreground'>FCFA</p>
            </div>

            <div className='rounded-xl border border-cyan-200/80 bg-cyan-50/50 p-4 dark:border-cyan-900/40 dark:bg-cyan-950/20'>
              <p className='text-[10px] tracking-widest text-cyan-700 uppercase font-bold'>
                Total accords de financement
              </p>
              <p className='text-lg font-bold mt-1 text-cyan-800 dark:text-cyan-300'>
                {formatNumber(totalFinancementMobilise)}
              </p>
              <p className='text-[10px] text-cyan-600/70'>
                {safeFinancements.length} convention(s) / accord(s)
              </p>
            </div>

            <div className='rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20'>
              <p className='text-[10px] tracking-widest text-emerald-700 uppercase font-bold'>
                Coût total des infrastructures
              </p>
              <p className='text-lg font-bold mt-1 text-emerald-800 dark:text-emerald-300'>
                {formatNumber(totalCoutInfrastructures)}
              </p>
              <p className='text-[10px] text-emerald-600/70'>
                {totalInfrastructures} infrastructure(s) planifiée(s)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── KPI Indicateurs clés de performance CMR ── */}
      <KpiIndicateurs projet={projet} />
    </div>
  )
}
