declare interface LoginCredentials {
  id_personnel_perso: string
  password: string
}

declare interface ResetLinkCredentials {
  email: string
}

declare interface ResetPasswordCredentials {
  new_password: string
  confirm_new_password: string
  token: string
  uid: string
}

declare interface AuthUser {
  id?: string
  name?: string
  id_personnel_perso?: string
  personnel?: unknown
  niveau_perso: number
}

declare interface LoginResponse {
  access: string
  refresh: string
  user?: AuthUser
}

declare interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

