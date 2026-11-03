import { useSearch } from '@tanstack/react-router'
import { AuthLayout } from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'
import { AuthMaliHero } from '../components/auth-mali-hero'
import { MaliFlag } from '@/components/others/mali-flag'

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })

  return (
    <AuthLayout>
      <div className='flex min-h-screen w-screen overflow-hidden'>
        {/* ── Panneau gauche – Branding Mali & SISE-MALI ── */}
        <AuthMaliHero />

        {/* ── Panneau droit – formulaire de connexion ── */}
        <div className='flex-1 flex flex-col items-center justify-center bg-white px-6 lg:px-16'>

          {/* Logo mobile uniquement */}
          <div className='mb-8 flex items-center gap-3 lg:hidden'>
            <MaliFlag width={32} height={20} className='rounded-xs shadow-xs' />
            <span className='text-lg font-bold tracking-tight text-zinc-900'>SISE-MALI</span>
          </div>

          <div className='w-full max-w-sm space-y-8'>

            {/* En-tête */}
            <div className="space-y-2">
              <div className='hidden lg:flex items-center gap-2 mb-1'>
                <MaliFlag width={24} height={16} className='rounded-xs shadow-xs' />
                <span className='text-xs font-semibold uppercase tracking-wider text-emerald-700'>
                  République du Mali
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                Connectez-vous à votre compte
              </h1>
              <p className="text-xs text-zinc-500">
                Accédez à votre espace de travail SISE-MALI
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
