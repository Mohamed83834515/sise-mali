import type { FormConfig } from "@/shared/types/formConfig";

export const getPlanSiteFormConfig = (niveauLabel = 'structure'): FormConfig => ({
    fields: [
        {
            name: "code_ds",
            label: `Code ${niveauLabel}`,
            type: "text",
            placeholder: `Ex: code ${niveauLabel}...`,
            required: true,
            gridCols: 2,
        },
        {
            name: "intutile_ds",
            label: `Intitulé ${niveauLabel}`,
            type: "textarea",
            placeholder: `Intitulé ${niveauLabel}`,
            required: true,
            gridCols: 2,
        },
        {
            name: "code_relai_ds",
            label: `Sigle ${niveauLabel}`,
            type: "text",
            placeholder: `Sigle ${niveauLabel}`,
            required: true,
            gridCols: 2,
        },
    ]
})
