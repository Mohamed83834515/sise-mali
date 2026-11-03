import { Link, useSearch } from '@tanstack/react-router'
import { AuthLayout } from '../auth-layout'
import { ForgotPasswordForm } from './components/forgot-password-form'
import { AuthMaliHero } from '../components/auth-mali-hero'
import logoMali from '@/assets/images/logo-mali.png'

const CONTENT = {
  setup: {
    title: 'Définir mon mot de passe',
    description: "Entrez votre adresse email. Vous recevrez un lien pour la définition d'un mot de passe.",
    resend: "Vous n'avez pas reçu l'email ? Vérifiez vos spams ou",
  },
  forgot: {
    title: 'Mot de passe oublié',
    description: 'Entrez votre adresse email. Vous recevrez un lien pour la réinitialisation de votre mot de passe.',
    resend: "Vous n'avez pas reçu l'email ? Vérifiez vos spams ou",
  },
}

export function ForgotPassword() {
  const { mode } = useSearch({ strict: false })
  const ctx = mode === 'setup' ? CONTENT.setup : CONTENT.forgot
  return (
    <AuthLayout>
      <div className='flex min-h-screen w-screen overflow-hidden'>
        {/* ── Panneau gauche – Branding Mali & SISE CPS/SEEUDE ── */}
        <AuthMaliHero />

        {/* ── Panneau droit – formulaire ── */}
        <div className='flex-1 flex flex-col items-center justify-center bg-white px-6 lg:px-16'>

          {/* Logo mobile */}
          <div className='mb-8 flex items-center gap-3 lg:hidden'>
            <img src={logoMali} alt="SISE CPS/SEEUDE" className='size-11 object-contain rounded-full shadow-xs' />
            <div>
              <span className='block text-lg font-extrabold tracking-tight text-zinc-900'>SISE CPS/SEEUDE</span>
              <span className='block text-[11px] text-zinc-500'>MEADD — PRTD-Mali</span>
            </div>
          </div>

          <div className='w-full max-w-sm space-y-8'>

            {/* En-tête */}
            <div className="space-y-2">
              <div className='hidden lg:flex items-center gap-2 mb-1'>
                <img src={logoMali} alt="Mali" className='size-7 object-contain rounded-full shadow-xs' />
                <span className='text-xs font-bold uppercase tracking-wider text-emerald-800'>
                  SISE CPS/SEEUDE
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                {ctx.title}
              </h1>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {ctx.description}
              </p>
            </div>

            {/* Formulaire */}
            <ForgotPasswordForm mode={mode === 'forgot' ? 'reset' : 'setup'} />

            {/* Séparateur + liens */}
            {mode === 'forgot' && (
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
            )}

          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
