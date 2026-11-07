// router/guards.ts (TanStack Router beforeLoad)
import { redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { authService } from './authService'

export async function requireAuth({
  location,
}: {
  location?: { href?: string; pathname?: string; searchStr?: string }
} = {}) {
  try {
    await authService.me()
    useAuthStore.getState().setAuthenticated(true)
  } catch {
    useAuthStore.getState().logout()

    // Extraire uniquement le chemin relatif interne
    const pathname =
      location?.pathname ??
      (typeof window !== 'undefined' ? window.location.pathname : '/')
    const searchStr =
      location?.searchStr ??
      (typeof window !== 'undefined' ? window.location.search : '')
    const targetPath = `${pathname}${searchStr}`

    const shouldRedirect =
      targetPath &&
      targetPath !== '/' &&
      !targetPath.startsWith('/sign-in')

    throw redirect({
      to: '/sign-in',
      search: shouldRedirect ? { redirect: targetPath } : undefined,
      replace: true,
    })
  }
}
