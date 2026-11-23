import { FormConfig } from "@/shared/types/formConfig";

export const getPhoneFormConfig = (): FormConfig => ({
  fields: [
    {
      name: "contact_perso",
      label: "Téléphone",
      type: "tel",
      placeholder: "+223…",
      gridCols: 1,
    },
  ],
})
