import { useMemo } from 'react'
import { DynamicForm } from '@/shared/forms'
import { fonctionSchema, FonctionFormData } from '@/shared/schemas/fonctionSchema'
import { useSaveFonction } from '@/shared/api/hooks/admin/fonctionHooks'
import { getFonctionFormConfig } from '@/shared/forms/configs/fonctionForm'

type Props = {
    currentRow?: Fonction | null;
    onBack: () => void
    onSuccess: () => void
    onCancel: () => void
}

export default function AddFonction({
    currentRow,
    onBack,
    onSuccess,
}: Props) {
    const isEdit = !!currentRow

    const formConfig = useMemo(() => getFonctionFormConfig(), [])

    const defaultValues = useMemo(() => ({
        nom_fonction: currentRow?.nom_fonction || '',
        description_fonction: currentRow?.description_fonction || '',
    }), [currentRow])

    const mutation = useSaveFonction(isEdit, currentRow, onSuccess)

    const handleSubmit = (data: FonctionFormData) => {
        mutation.mutate(data)
    }

    return (
        <DynamicForm
            config={formConfig}
            schema={fonctionSchema}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            onCancel={onBack}
            isLoading={mutation.isPending}
            submitText={isEdit ? 'Mettre à jour' : 'Ajouter'}
            loadingText='Enregistrement...'
        />
    )
}