import { useState } from 'react'
import { Coins, CheckCircle2, Maximize2, WalletCards, Activity } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Main } from '@/components/layout/others/main'
import { useColor, HEADER_COLORS } from '@/stores/others/color-store'
import { ModeFinancementPage } from './modes/ModeFinancementPage'
import { EtatFinancementPage } from './etats/EtatFinancementPage'
import { EnvergurePage } from './envergures/EnvergurePage'
import { NiveauAvancementPage } from './niveaux-avancement/NiveauAvancementPage'

type TabId = 'modes' | 'etats' | 'envergures' | 'avancements'

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'modes', label: 'Modes de financement', icon: Coins },
  { id: 'etats', label: 'États de financement', icon: CheckCircle2 },
  { id: 'envergures', label: 'Envergures des projets', icon: Maximize2 },
  { id: 'avancements', label: "Niveaux d'avancement", icon: Activity },
]

export default function ParametrageFinancementLayout() {
  const [currentTab, setCurrentTab] = useState<TabId>('modes')

  const { headerColor } = useColor()
  const { bg } = HEADER_COLORS[headerColor]

  return (
    <Main>
      <div className='container mx-auto flex w-full flex-1 flex-col gap-6 py-4'>
        {/* En-tête */}
        <div className='flex items-center gap-3'>
          <WalletCards className='text-muted-foreground h-8 w-8' />
          <div>
            <h1 className='text-3xl font-bold'>Paramétrage financement</h1>
            <p className='text-muted-foreground mt-1'>
              Configurez les référentiels de financement et les envergures des projets.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={currentTab}
          onValueChange={(v) => setCurrentTab(v as TabId)}
          style={
            {
              '--tab-active-bg': bg,
              '--tab-active-color': '#ffffff',
              '--tab-active-font-weight': '700',
            } as React.CSSProperties
          }
        >
          <TabsList className='mb-4'>
            {TABS.map(({ id, label, icon: Icon }) => (
              <TabsTrigger key={id} value={id} className='gap-2'>
                <Icon className='h-4 w-4' />
                <span>{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value='modes'>
            <ModeFinancementPage />
          </TabsContent>

          <TabsContent value='etats'>
            <EtatFinancementPage />
          </TabsContent>

          <TabsContent value='envergures'>
            <EnvergurePage />
          </TabsContent>

          <TabsContent value='avancements'>
            <NiveauAvancementPage />
          </TabsContent>
        </Tabs>
      </div>
    </Main>
  )
}
