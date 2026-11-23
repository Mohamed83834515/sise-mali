// hooks/useLoginMutation.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { handleApiError } from '@/shared/api'
import {
  authService,
  type LoginCredentials,
  type ResetLinkCredentials,
  type ResetPasswordCredentials,
} from '@/shared/api/services/authService'
import type { ChangePasswordFormData } from '@/shared/schemas/auth.schemas'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { personnelKeys } from '../personnel/personnelHooks'

export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey: personnelKeys.me(),
    queryFn: async () => {
      return authService.me()
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  })
}

// ✅ Version corrigée avec redirection selon le niveau
export function useLogin() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const search = useSearch({ from: '/(auth)/sign-in' })
  
  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),

    onSuccess: async (data: any, variables: LoginCredentials) => {
      // ✅ Si l'authentification à double facteur (OTP) est activée
      if (data?.otp_required) {
        toast.info(
          data.message ||
            'Un code OTP a été envoyé à votre adresse e-mail (valable 5 min).'
        )

        if (typeof window !== 'undefined') {
          sessionStorage.setItem(
            'pending_otp_username',
            variables.id_personnel_perso
          )
        }

        navigate({
          to: '/otp',
        })
        return
      }

      // ✅ Mettre à jour le store
      login()

      // data contient l'utilisateur avec niveau_perso
      const userLevel =
        data?.personnel?.niveau_perso ?? data?.user?.niveau_perso ?? 1

      // ✅ Déterminer la redirection selon le niveau
      let redirectPath = search.redirect ?? '/'

      // Si l'utilisateur est niveau 3 (Consultant), rediriger vers la liste des projets
      if (userLevel === 3) {
        redirectPath = '/projet-programme/projets'
      }

      toast.success('Connexion réussie')

      navigate({
        to: redirectPath,
        replace: true,
      })

      await queryClient.invalidateQueries({
        queryKey: personnelKeys.me(),
      })
    },

    onError: (error) => {
      toast.error(error.message)
      handleApiError(error)
    },
  })
}

// ✅ Hook pour la validation du code OTP (2FA)
export function useVerifyOtp() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { login } = useAuthStore()

  return useMutation({
    mutationFn: (payload: {
      otp?: string
      otp_code?: string
      id_personnel_perso?: string
    }) => authService.verifyOtp(payload),

    onSuccess: async (data: any) => {
      login()

      const userLevel =
        data?.personnel?.niveau_perso ?? data?.user?.niveau_perso ?? 1

      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('pending_otp_username')
      }

      let redirectPath = '/'
      if (userLevel === 3) {
        redirectPath = '/projet-programme/projets'
      }

      toast.success('Connexion réussie')

      navigate({
        to: redirectPath,
        replace: true,
      })

      await queryClient.invalidateQueries({
        queryKey: personnelKeys.me(),
      })
    },

    onError: (error: any) => {
      const data = error?.response?.data
      let msg = 'Code OTP invalide ou expiré'
      if (typeof data === 'string') {
        msg = data
      } else if (data?.otp_code) {
        msg = Array.isArray(data.otp_code)
          ? data.otp_code.join(', ')
          : String(data.otp_code)
      } else if (data?.detail) {
        msg = data.detail
      } else if (data?.message) {
        msg = data.message
      } else if (error?.message) {
        msg = error.message
      }
      toast.error(msg)
      handleApiError(error)
    },
  })
}

interface TokenPayload {
  exp: number
  user_id: number
}

export const getUserIdFromToken = (token: string): number | null => {
  try {
    const decoded = jwtDecode<TokenPayload>(token)
    return decoded.user_id
  } catch {
    return null
  }
}

export function useLogout() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authService.logout(),

    onSettled: () => {
      logout()
      queryClient.clear()
      navigate({ to: '/sign-in', replace: true })
    },
  })
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: async ({
      data,
      userId,
    }: {
      data: ChangePasswordFormData
      userId: number
    }) => {
      await authService.changePassword(userId, {
        currentPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmNewPassword,
      })
    },
    onSuccess: () => {
      toast.success('Mot de passe modifié avec succès')
    },
    onError: (error) => {
      handleApiError(error)
    },
  })
}

export function useResetLinkMutation() {
  return useMutation({
    mutationFn: async ({
      data,
      mode,
    }: {
      data: ResetLinkCredentials
      mode: 'reset' | 'setup'
    }) => {
      await authService.reset_link(data, mode)
    },
    onSuccess: () => {
      toast.success('Email de réinitialisation envoyé avec succès')
    },
    onError: (error) => {
      handleApiError(error)
    },
  })
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: async ({ data }: { data: ResetPasswordCredentials }) => {
      await authService.reset_password(data)
    },
    onSuccess: () => {
      toast.success('Mot de passe réinitialisé avec succès')
    },
    onError: (error) => {
      handleApiError(error)
    },
  })
}