import { DynamicForm } from "@/shared/forms"
import { getTypeActiviteFormConfig } from "@/shared/forms/configs/typeActiviteForm"
import { useSaveTypeActivite } from "@/shared/api/hooks/admin/typeActivitesHooks"
import { typeActiviteSchema } from "@/shared/schemas/ptbaSchemas"
import { useMemo } from "react"

type Props = {
  currentRow?: TypeActivite | null
  onBack: () => void
  onSuccess: () => void
  onCancel: () => void
}

export default function AddTypeActivite({
  currentRow,
  onBack,
  onSuccess,
}: Props) {
  const isEdit = !!currentRow

  const defaultValues = {
    code_type: currentRow?.code_type || "",
    intutile_type: currentRow?.intutile_type || "",
    description: currentRow?.description || "",
  }
  const formConfig = useMemo(() => {
    const config = getTypeActiviteFormConfig()

    // Mettre à jour les options des champs select
    return {
      fields: config.fields.map((field: any) => {
        if (field.name === 'code_type' && currentRow !== null) {

          console.log('ok')
          return { ...field, disabled: true }
        }
        return field
      }),
    }
  }, [currentRow])
  const mutation = useSaveTypeActivite(isEdit, currentRow, onSuccess)

  const handleSubmit = (data: any) => {
    mutation.mutate(data)
  }

  return (
    <DynamicForm
      config={formConfig}
      schema={typeActiviteSchema}
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