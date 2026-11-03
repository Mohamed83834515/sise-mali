import logoMali from '@/assets/images/logo-mali.png'
import { MaliFlag } from '@/components/others/mali-flag'
import { BarChart3, CheckCircle2, Globe, Layers } from 'lucide-react'

export function AuthMaliHero() {
  return (
    <div
      className='relative hidden w-1/2 flex-col justify-between overflow-hidden lg:flex select-none'
      style={{
        background: 'linear-gradient(160deg, #052418 0%, #0a3a27 45%, #03160e 100%)',
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

      {/* Orbes lumineux aux couleurs nationales du Mali */}
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

      {/* En-tête : Armoiries officielles & Références institutionnelles */}
      <div className='relative z-10 flex items-start justify-between p-10 pb-0'>
        <div className='flex items-center gap-3.5'>
          <div className='flex size-14 shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-lg ring-2 ring-emerald-500/30'>
            <img
              src={logoMali}
              alt="Armoiries de la République du Mali"
              className='size-full object-contain'
            />
          </div>
          <div>
            <div className='text-xs font-bold tracking-widest text-emerald-400 uppercase'>
              RÉPUBLIQUE DU MALI
            </div>
            <div className='text-[10px] tracking-wider text-white/70 font-medium'>
              Un Peuple — Un But — Une Foi
            </div>
            <div className='text-[10px] text-emerald-200/80 line-clamp-1 max-w-xs mt-0.5'>
              Ministère de l'Environnement, de l'Assainissement et du Développement Durable
            </div>
          </div>
        </div>

        <div className='flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300 backdrop-blur-xs'>
          <MaliFlag width={18} height={12} className='rounded-xs' />
          <span>CPS/SEEUDE</span>
        </div>
      </div>

      {/* Centre : Titre SISE CPS/SEEUDE et présentation */}
      <div className='relative z-10 flex flex-1 flex-col justify-center px-10 py-6 max-w-xl'>
        {/* Bande tricolore Mali */}
        <div className='flex h-1.5 w-24 overflow-hidden rounded-full mb-5 shadow-sm'>
          <div className='w-1/3 bg-[#009460]' />
          <div className='w-1/3 bg-[#FCD116]' />
          <div className='w-1/3 bg-[#CE1126]' />
        </div>

        <div className='inline-flex items-center gap-2 self-start rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 backdrop-blur-xs mb-3 border border-white/10'>
          PRTD-Mali • Projet de Restauration des Terres Dégradées
        </div>

        <h1 className='text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-1.5'>
          SISE CPS/SEEUDE
        </h1>
        <p className='text-base lg:text-lg font-semibold text-emerald-200/90 mb-3'>
          Système Informatisé de Suivi-Évaluation
        </p>
        <p className='text-xs leading-relaxed text-white/75 mb-7'>
          Plateforme centralisée du secteur <strong>Eau, Environnement, Urbanisme et Domaines de l’État</strong> mise en place par la <strong>CPS/SEEUDE</strong> avec l’appui du <strong>PRTD-Mali</strong> pour la planification, le suivi physique &amp; financier et l’évaluation d’impact des projets.
        </p>

        {/* 4 Piliers fonctionnels du manuel */}
        <div className='grid grid-cols-2 gap-3'>
          <div className='flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs'>
            <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300'>
              <Layers className='size-4' />
            </div>
            <div className='text-xs'>
              <div className='font-semibold text-white'>Planification &amp; Suivi</div>
              <div className='text-white/50 text-[11px]'>Activités, PTBA &amp; budgets</div>
            </div>
          </div>

          <div className='flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs'>
            <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300'>
              <BarChart3 className='size-4' />
            </div>
            <div className='text-xs'>
              <div className='font-semibold text-white'>Gestion des indicateurs</div>
              <div className='text-white/50 text-[11px]'>Indicateurs sectoriels &amp; ODD</div>
            </div>
          </div>

          <div className='flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs'>
            <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300'>
              <Globe className='size-4' />
            </div>
            <div className='text-xs'>
              <div className='font-semibold text-white'>Cartographie SIG</div>
              <div className='text-white/50 text-[11px]'>Suivi dynamique territorial</div>
            </div>
          </div>

          <div className='flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs'>
            <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/20 text-rose-300'>
              <CheckCircle2 className='size-4' />
            </div>
            <div className='text-xs'>
              <div className='font-semibold text-white'>Tableaux de bord &amp; TDB</div>
              <div className='text-white/50 text-[11px]'>Rapports &amp; Décaissements</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pied de page */}
      <div className='relative z-10 flex items-center justify-between border-t border-white/10 p-10 pt-5 text-xs text-white/50'>
        <span>© {new Date().getFullYear()} SISE CPS/SEEUDE • MEADD / PRTD-Mali</span>
        <span className='flex items-center gap-1.5'>
          <span className='size-2 rounded-full bg-emerald-400 animate-pulse' />
          Portail officiel sécurisé
        </span>
      </div>
    </div>
  )
}
