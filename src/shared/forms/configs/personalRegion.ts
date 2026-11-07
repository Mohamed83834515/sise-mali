import { RichSelectOption } from "@/shared/forms/FormField";
import type { FormConfig } from "@/shared/types/formConfig";

export const getRegionFormConfig = ({options, disabled} : {options :RichSelectOption[], disabled : boolean}): FormConfig => ({
    fields : [
        {
             name: "region_perso",
            label: "Région",
            type: "select",
           options ,
            gridCols: 1,
            disabled
        }
    ]
})