import { useFileSelector } from "@/ui/shared/hooks/useFileSelector"

export function useImportFilePicker(onFilesSelected: (files: File[]) => void){    
    const { openFileDialog, inputElement: pickerElement, setOnFilesSelected } = useFileSelector(".kif")    
    setOnFilesSelected(async fileList => {
        const files = Array.from(fileList)
        onFilesSelected(files)        
    })
    return { openFileDialog, pickerElement }
}