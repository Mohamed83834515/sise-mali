import { UpdateTitleSchema, UpdateTitleInput } from '@/shared/schemas/personnelSchema'
import { useTitres } from '@/shared/api/hooks/personnel/personnelHooks'
import { DynamicForm } from '@/shared/forms'
import { getTitleFormConfig } from '@/shared/forms/configs/personalTitleForm'
import { RichSelectOption } from '@/shared'

type Props = {
  currentValue?: string   
  onSuccess:     (data: UpdateTitleInput) => void
  isPending:     boolean
}

export function TitleForm({ currentValue, onSuccess, isPending }: Props) {
  const { data: titres=[], isLoading } = useTitres()
   const titleOptions: RichSelectOption[] = titres?.map((t) => ({
    label: t.libelle_titre,
    value: String(t.id_titre),
  }));

 const formConfig = getTitleFormConfig({options : titleOptions, disabled :isLoading});

 const defaultTitleValue =
  titleOptions.find((t) => t.label === currentValue)?.value ?? ""

  
  const handleSubmit = (data : UpdateTitleInput) => {
   onSuccess(data)
  }

 

  return (
    <>
    
    <DynamicForm
              config={formConfig}
              schema={UpdateTitleSchema}
              
              defaultValues={{titre_personnel : defaultTitleValue}}
              onSubmit={handleSubmit}
              isLoading={isPending}
              submitText="Enregistrer"
              loadingText="Enregistrement..."
            />
   
    </>
   
  )
}