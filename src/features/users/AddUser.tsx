import { DynamicForm } from '@/shared/forms'
// import { useAddUser } from "@/hooks/admin/userHooks";
import { getUserFormConfig } from '@/shared/forms/configs/exempleFormConfig'
import type { OpenProps } from '@/shared/types'
import { userSchema } from '@/shared/schemas/allSchema'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DIALOG_SIZES } from '@/shared/forms'
import { STAFF } from '@/shared/forms/resetFields'

const AddUser = ({ open, onOpenChange }: OpenProps) => {
  // const { mutate, isPending } = useAddUser();
  const formConfig = getUserFormConfig()

  const onSubmit = () => {
    // mutate(data, {
    //   onSuccess: () => {
    //     onOpenChange(false);
    //   },
    // });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={DIALOG_SIZES.md}>
        <DialogHeader>
          <DialogTitle>Ajouter un utilisateur</DialogTitle>
          <DialogDescription>Créer un nouvel utilisateur</DialogDescription>
        </DialogHeader>
        <DynamicForm
          config={formConfig}
          schema={userSchema}
          defaultValues={STAFF}
          onSubmit={onSubmit}
          submitText="Ajouter l'utilisateur"
          loadingText='Ajout en cours...'
        />
      </DialogContent>
    </Dialog>
  )
}

export default AddUser