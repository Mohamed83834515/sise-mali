import { MaliFlag } from '@/components/others/mali-flag'
import { BarChart3, CheckCircle2, MapPin, Target } from 'lucide-react'

export function AuthMaliHero() {
  return (
    <div
      className='relative hidden w-1/2 flex-col justify-between overflow-hidden lg:flex select-none'
      style={{
        background: 'linear-gradient(160deg, #062217 0%, #0a3625 45%, #04170f 100%)',
      }}
    >
      {/* Grille décorative en arrière-plan */}
      <div
        className='pointer-events-none absolute inset-0'
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Orbes lumineux aux couleurs du Mali (Vert & Or) */}
      <div
        className='pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full'
        style={{ background: 'radial-gradient(circle, rgba(0,148,96,.35) 0%, transparent 70%)' }}
      />
      <div
        className='pointer-events-none absolute top-1/2 -right-20 h-80 w-80 rounded-full'
        style={{ background: 'radial-gradient(circle, rgba(252,209,22,.18) 0%, transparent 70%)' }}
      />
      <div
        className='pointer-events-none absolute -bottom-28 left-1/3 h-80 w-80 rounded-full'
        style={{ background: 'radial-gradient(circle, rgba(206,17,38,.12) 0%, transparent 70%)' }}
      />

      {/* En-tête : Drapeau du Mali & Références institutionnelles */}
      <div className='relative z-10 flex items-center justify-between p-10 pb-0'>
        <div className='flex items-center gap-3'>
          <MaliFlag width={36} height={24} className='rounded-xs shadow-md border border-white/20' />
          <div>
            <div className='text-xs font-bold tracking-widest text-emerald-400 uppercase'>
              RÉPUBLIQUE DU MALI
            </div>
            <div className='text-[10px] tracking-wider text-white/60'>
              Un Peuple — Un But — Une Foi
            </div>
          </div>
        </div>

        <div className='rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300 backdrop-blur-xs'>
          Plateforme Officielle
        </div>
      </div>

      {/* Centre : Titre SISE-MALI et présentation */}
      <div className='relative z-10 flex flex-1 flex-col justify-center px-10 py-6 max-w-xl'>
        {/* Bande tricolore Mali */}
        <div className='flex h-1.5 w-24 overflow-hidden rounded-full mb-6 shadow-sm'>
          <div className='w-1/3 bg-[#009460]' />
          <div className='w-1/3 bg-[#FCD116]' />
          <div className='w-1/3 bg-[#CE1126]' />
        </div>

        <h1 className='text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2'>
          SISE-MALI
        </h1>
        <p className='text-base lg:text-lg font-medium text-emerald-200/90 mb-4'>
          Système Intégré de Suivi et d'Évaluation
        </p>
        <p className='text-sm leading-relaxed text-white/70 mb-8'>
          Plateforme nationale de pilotage, de planification opérationnelle, de suivi des projets &amp; programmes et de mesure des performances du secteur agricole au Mali.
        </p>

        {/* Piliers / fonctionnalités */}
        <div className='grid grid-cols-2 gap-3'>
          <div className='flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs'>
            <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300'>
              <BarChart3 className='size-4' />
            </div>
            <div className='text-xs'>
              <div className='font-semibold text-white'>PTBA &amp; CDMT</div>
              <div className='text-white/50 text-[11px]'>Plans opérationnels</div>
            </div>
          </div>

          <div className='flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs'>
            <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300'>
              <Target className='size-4' />
            </div>
            <div className='text-xs'>
              <div className='font-semibold text-white'>Indicateurs CMR</div>
              <div className='text-white/50 text-[11px]'>Mesure des résultats</div>
            </div>
          </div>

          <div className='flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs'>
            <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300'>
              <MapPin className='size-4' />
            </div>
            <div className='text-xs'>
              <div className='font-semibold text-white'>Cartographie SIG</div>
              <div className='text-white/50 text-[11px]'>Suivi territorial</div>
            </div>
          </div>

          <div className='flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs'>
            <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/20 text-rose-300'>
              <CheckCircle2 className='size-4' />
            </div>
            <div className='text-xs'>
              <div className='font-semibold text-white'>Marchés &amp; PPM</div>
              <div className='text-white/50 text-[11px]'>Passation &amp; budget</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pied de page */}
      <div className='relative z-10 flex items-center justify-between border-t border-white/10 p-10 pt-5 text-xs text-white/50'>
        <span>© {new Date().getFullYear()} SISE-MALI. Tous droits réservés.</span>
        <span className='flex items-center gap-1.5'>
          <span className='size-2 rounded-full bg-emerald-400 animate-pulse' />
          Portail sécurisé
        </span>
      </div>
    </div>
  )
}

