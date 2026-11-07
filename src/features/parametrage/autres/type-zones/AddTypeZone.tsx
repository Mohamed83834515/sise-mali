// simadou/allfonctionalities/parametrage/type-zone/AddTypeZone.tsx
import { DynamicForm } from "@/shared/forms"
import { getTypeZoneFormConfig } from "@/shared/forms/configs/typeZoneForm"
import { useSaveTypeZone } from "@/shared/api/hooks/admin/typeZoneHooks"
import { typeZoneSchema } from "@/shared/schemas/typeZoneSchema"

type Props = {
  currentRow?: any | null
  onBack: () => void
  onSuccess: () => void
  onCancel: () => void
}

export default function AddTypeZone({
  currentRow,
  onBack,
  onSuccess,
}: Props) {
  const isEdit = !!currentRow

  const formConfig = getTypeZoneFormConfig()

  const defaultValues = {
    code_type_zone: currentRow?.code_type_zone || "",
    nom_type_zone: currentRow?.nom_type_zone || "",
  }

  const mutation = useSaveTypeZone(isEdit, currentRow, onSuccess)

  const handleSubmit = (data: any) => {
    mutation.mutate(data)
  }

  return (
    <DynamicForm
      config={formConfig}
      schema={typeZoneSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      isLoading={mutation.isPending}
      submitText={isEdit ? "Modifier" : "Ajouter"}
      loadingText="Enregistrement..."
      onCancel={onBack}
      cancelText='Retour'
    />
  )
}