import { useMemo } from 'react'
import { toast } from 'sonner'
import { DynamicForm } from '@/shared/forms'
import type { Projet } from '@/shared/types'
import type { DossierProjet } from '@/shared/types/entities/dossierProjet'
import type { DocumentProjet } from '@/shared/types/entities/documentProjet'
import { getDocumentProjetFormConfig } from '@/shared/forms/configs/documentProjetForm'
import {
  useCreateDocumentProjet,
  useUpdateDocumentProjet,
} from '@/shared/api/hooks/admin/documentProjetHooks'
import {
  documentProjetSchema,
  type DocumentProjetFormData,
} from '@/shared/schemas/documentProjetSchemas'

type DocumentFormDialogProps = {
  projet: Projet
  dossier: DossierProjet
  document?: DocumentProjet | null
  onClose: () => void
  onSuccess: () => void
}

function extractFile(value: unknown): File | undefined {
  if (value instanceof File) return value
  if (Array.isArray(value) && value[0] instanceof File) return value[0]
  return undefined
}

export default function DocumentFormDialog({
  projet,
  dossier,
  document,
  onClose,
  onSuccess,
}: DocumentFormDialogProps) {
  const isEditing = !!document?.id_document
  const idProjet = projet.id_projet
  const idDossier = dossier.id_dossier

  const formConfig = useMemo(
    () => getDocumentProjetFormConfig(isEditing),
    [isEditing]
  )

  const defaultValues = useMemo(
    (): DocumentProjetFormData => ({
      document: document?.document || '',
      description_document: document?.description_document || '',
    }),
    [document]
  )

  const createMutation = useCreateDocumentProjet(idDossier)
  const updateMutation = useUpdateDocumentProjet(idDossier)

  const onSubmit = (data: DocumentProjetFormData) => {
    const file = extractFile(data.document)
    const payload = {
      description_document: data.description_document?.trim() || undefined,
      projet: idProjet,
      dossier: idDossier,
    }

    if (!isEditing && !file) {
      toast.error('Sélectionnez un document à téléverser')
      return
    }

    if (isEditing && document?.id_document) {
      updateMutation.mutate(
        { id: document.id_document, data: payload, file },
        { onSuccess }
      )
      return
    }

    if (!file) return

    createMutation.mutate({ data: payload, file }, { onSuccess })
  }

  return (
    <DynamicForm
      key={`document-projet-${document?.id_document ?? 'new'}`}
      config={formConfig}
      schema={documentProjetSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      submitText={isEditing ? 'Mettre à jour' : 'Enregistrer'}
      loadingText='Enregistrement…'
      isLoading={createMutation.isPending || updateMutation.isPending}
      onCancel={onClose}
      cancelText='Retour'
    />
  )
}