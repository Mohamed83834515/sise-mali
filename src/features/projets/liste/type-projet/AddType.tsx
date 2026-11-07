import { DynamicForm } from "@/shared/forms"
import { getTypeProjetFormConfig } from "@/shared/forms/configs/typeProjetForm"
import { useSaveTypeProjet } from "@/shared/api/hooks/admin/typeProjetHooks"
import { TypeProjet } from "@/shared/types/entities/typeProjet"
import { typeProjetSchema } from "@/shared/schemas/typeProjetSchema"

type Props = {
  currentRow?: TypeProjet | null
  onBack: () => void
  onSuccess: () => void
  onCancel: () => void
}

export default function AddTypeProjet({
  currentRow,
  onBack,
  onSuccess,
}: Props) {
  const isEdit = !!currentRow

  const formConfig = getTypeProjetFormConfig()

  const defaultValues = {
    code_type_projet: currentRow?.code_type_projet || "",
    nom_type_projet: currentRow?.nom_type_projet || "",
    id_type_projet: currentRow?.id_type_projet || 0,
  }

  const mutation = useSaveTypeProjet(isEdit, currentRow, onSuccess)

  const handleSubmit = (data: TypeProjet) => {
    mutation.mutate(data)
  }
  return (
    <DynamicForm
      config={formConfig}
      schema={typeProjetSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      isLoading={mutation.isPending}
      submitText={isEdit ? "Modifier" : "Ajouter"}
      loadingText="Enregistrement..."
      onCancel={onBack}
      cancelText='Retour'
      embedded
    />
  )
}