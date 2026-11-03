import { useSearch } from '@tanstack/react-router'
import { AuthLayout } from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'
import { AuthMaliHero } from '../components/auth-mali-hero'
import logoMali from '@/assets/images/logo-mali.png'

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })

  return (
    <AuthLayout>
      <div className='flex min-h-screen w-screen overflow-hidden'>
        {/* ── Panneau gauche – Branding Mali & SISE CPS/SEEUDE ── */}
        <AuthMaliHero />

        {/* ── Panneau droit – formulaire de connexion ── */}
        <div className='flex-1 flex flex-col items-center justify-center bg-white px-6 lg:px-16'>

          {/* Logo mobile uniquement */}
          <div className='mb-8 flex items-center gap-3 lg:hidden'>
            <img src={logoMali} alt="SISE CPS/SEEUDE" className='size-11 object-contain rounded-full shadow-xs' />
            <div>
              <span className='block text-lg font-extrabold tracking-tight text-zinc-900'>SISE CPS/SEEUDE</span>
              <span className='block text-[11px] text-zinc-500'>MEADD — PRTD-Mali</span>
            </div>
          </div>

          <div className='w-full max-w-sm space-y-7'>

            {/* En-tête */}
            <div className="space-y-1.5">
              <div className='hidden lg:flex items-center gap-2.5 mb-2'>
                <img src={logoMali} alt="Mali" className='size-8 object-contain rounded-full shadow-xs' />
                <div>
                  <div className='text-xs font-bold uppercase tracking-wider text-emerald-800 leading-tight'>
                    SISE CPS/SEEUDE
                  </div>
                  <div className='text-[10px] text-zinc-500'>
                    MEADD — PRTD-Mali
                  </div>
                </div>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                Connectez-vous à votre compte
              </h1>
              <p className="text-xs text-zinc-500">
                Système Informatisé de Suivi-Évaluation
              </p>
            </div>

            {/* Formulaire d'authentification */}
            <UserAuthForm redirectTo={redirect} />

            {/* CGU */}
            <p className='text-center text-xs text-zinc-400'>
              En vous connectant, vous acceptez nos{' '}
              <a href='/terms' className='underline underline-offset-2 hover:text-zinc-700'>
                Conditions d'utilisation
              </a>{' '}
              et notre{' '}
              <a href='/privacy' className='underline underline-offset-2 hover:text-zinc-700'>
                Politique de confidentialité
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
