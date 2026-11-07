import { useNavigate, useLocation } from '@tanstack/react-router'
import { ConfirmDialog } from '@/components/others/confirm-dialog'
import { useLogout } from '@/features/auth'

interface SignOutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const {mutate : logout, isPending} = useLogout()

  const handleSignOut = () => {
    logout()
    // Preserve current location for redirect after sign-in
    const currentPath = location.pathname + location.searchStr
    const search =
      currentPath &&
      currentPath !== '/' &&
      !currentPath.startsWith('/sign-in')
        ? { redirect: currentPath }
        : undefined
    navigate({
      to: '/sign-in',
      search,
      replace: true,
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Déconnexion'
      desc='Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre compte.'
      confirmText='Se déconnecter'
      destructive
      handleConfirm={handleSignOut}
      isLoading={isPending}
      className='sm:max-w-sm'
    />
  )
}
