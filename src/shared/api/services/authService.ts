import { apiClient } from '@/shared/api'
import { toast } from 'sonner'

export interface LoginCredentials {
  id_personnel_perso: string
  password: string
  otp?: string
}

export interface ResetLinkCredentials {
  email: string
}

export interface ResetPasswordCredentials {
  new_password: string
  confirm_new_password: string
  token: string
  uid: string
}

interface User {
  id?: string
  name?: string
  id_personnel_perso?: string
  personnel?: unknown
  niveau_perso: number
}

interface LoginResponse {
  access?: string
  refresh?: string
  user?: User
  personnel?: any
  otp_required?: boolean
  message?: string
}

interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export const authService = {
  // Login function
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return await apiClient.request<LoginResponse>('/auth/login/', {
      method: 'POST',
      data: credentials,
    })
  },

  // Verify OTP for 2FA
  async verifyOtp(payload: {
    otp?: string
    otp_code?: string
    id_personnel_perso?: string
  }): Promise<LoginResponse> {
    const code = payload.otp_code || payload.otp || ''
    const dataToSend = {
      otp_code: code,
      otp: code,
      ...(payload.id_personnel_perso
        ? { id_personnel_perso: payload.id_personnel_perso }
        : {}),
    }

    try {
      return await apiClient.request<LoginResponse>('/auth/verify-otp/', {
        method: 'POST',
        data: dataToSend,
      })
    } catch (err: any) {
      if (err?.response?.status === 404) {
        try {
          return await apiClient.request<LoginResponse>('/auth/otp/', {
            method: 'POST',
            data: dataToSend,
          })
        } catch (subErr: any) {
          if (subErr?.response?.status === 404) {
            return await apiClient.request<LoginResponse>('/auth/login/', {
              method: 'POST',
              data: dataToSend,
            })
          }
          throw subErr
        }
      }
      throw err
    }
  },

  async me(): Promise<Personnel> {
    return apiClient.request('/auth/me/', {
      method: 'GET',
    })
  },

  async reset_link(
    credentials: ResetLinkCredentials,
    mode: 'reset' | 'setup'
  ): Promise<LoginResponse> {
    return await apiClient.request<LoginResponse>(
      mode === 'setup' ? '/password/set/resend/' : '/password/reset/',
      {
        method: 'POST',
        data: credentials,
      }
    )
  },

  async reset_password(
    credentials: ResetPasswordCredentials
  ): Promise<LoginResponse> {
    return await apiClient.request<LoginResponse>('/password/set/', {
      method: 'POST',
      data: credentials,
    })
  },

  async loginWithGoogle(code: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.request<LoginResponse>('/auth/google/', {
        method: 'POST',
        data: { code },
      })

      toast.success('Connexion Google réussie')
      return response
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail || 'Erreur de connexion Google'
      toast.error(errorMessage)
      throw error
    }
  },

  // Logout function
  async logout(): Promise<void> {
    try {
      await apiClient.request('/auth/logout/', {
        method: 'POST',
      })
      toast.success('Déconnexion réussie')
    } catch {
      // Continue with logout even if server call fails
      toast.success('Déconnexion locale effectuée')
    }
  },

  // Change password function
  async changePassword(id: number, data: ChangePasswordData): Promise<void> {
    await apiClient.request(`/personnel/${id}/password/`, {
      method: 'PUT',
      data: {
        old_password: data.currentPassword,
        new_password: data.newPassword,
        confirm_new_password: data.confirmPassword,
      },
    })
  },
}
