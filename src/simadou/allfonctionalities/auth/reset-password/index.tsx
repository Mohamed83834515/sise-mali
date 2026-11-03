import { Link, useSearch } from '@tanstack/react-router'
import { AuthLayout } from '../auth-layout'
import { ResetPasswordForm } from './components/reset-password-form'
import { AuthMaliHero } from '../components/auth-mali-hero'
import { MaliFlag } from '@/components/others/mali-flag'

const CONTENT = {
  setup: {
    title: 'Définir mon mot de passe',
    description: 'Entrez votre adresse email. Vous recevrez un lien pour définir votre mot de passe et activer votre compte.',
    resend: "Vous n'avez pas reçu l'email ? Vérifiez vos spams ou",
  },
  reset: {
    title: 'Mot de passe oublié',
    description: 'Entrez votre adresse email. Vous recevrez un lien pour réinitialiser votre mot de passe.',
    resend: "Vous n'avez pas reçu l'email ? Vérifiez vos spams ou",
  },
}

export function ResetPassword() {
  const { mode } = useSearch({ strict: false })
  const ctx = mode === 'reset' ? CONTENT.reset : CONTENT.setup
  return (
    <AuthLayout>
      <div className='flex min-h-screen w-screen overflow-hidden'>

        {/* ── Panneau gauche – Branding Mali & SISE-MALI ── */}
        <AuthMaliHero />

        {/* ── Panneau droit – formulaire ── */}
        <div className='flex-1 flex flex-col items-center justify-center bg-white px-6 lg:px-16'>

          {/* Logo mobile */}
          <div className='mb-8 flex items-center gap-3 lg:hidden'>
            <MaliFlag width={32} height={20} className='rounded-xs shadow-xs' />
            <span className='text-lg font-bold tracking-tight text-zinc-900'>SISE-MALI</span>
          </div>

          <div className='w-full max-w-sm space-y-8'>

            {/* En-tête */}
            <div className='space-y-1'>
              <div className='hidden lg:flex items-center gap-2 mb-1'>
                <MaliFlag width={24} height={16} className='rounded-xs shadow-xs' />
                <span className='text-xs font-semibold uppercase tracking-wider text-emerald-700'>
                  République du Mali
                </span>
              </div>
              <h1 className='text-2xl font-bold tracking-tight text-zinc-900'>
                {ctx.title}
              </h1>
            </div>

            {/* Formulaire */}
            <ResetPasswordForm />

            {/* Séparateur + liens */}
            <div className='space-y-4'>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <span className='w-full border-t border-zinc-200' />
                </div>
                <div className='relative flex justify-center text-xs'>
                  <span className='bg-white px-3 text-zinc-400'>ou</span>
                </div>
              </div>

              <div className='grid grid-cols-1 gap-3'>
                <Link
                  to='/sign-in'
                  className='flex items-center justify-center rounded-lg border border-zinc-200 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50'
                >
                  Se connecter
                </Link>
              </div>
            </div>

            {/* Note sécurité */}
            <p className='text-center text-xs text-zinc-400'>
              Vous n'avez pas reçu l'email ? Vérifiez vos spams ou{' '}
              <button className='underline underline-offset-2 hover:text-zinc-700'>
                renvoyez le lien
              </button>
              .
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
