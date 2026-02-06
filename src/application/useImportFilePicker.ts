import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider"
import { useFileSelector } from "@/ui/sharedComponents/useFileSelector"
import { createImportProblemsUsecase } from "@/usecase/importProblemsUsecase"
import { useState } from "react"

export function useImportFilePicker(onFilesSelected: (files: File[]) => void){    
    const { openFileDialog, inputElement: pickerElement, setOnFilesSelected } = useFileSelector(".kif")    
    setOnFilesSelected(async fileList => {
        const files = Array.from(fileList)
        onFilesSelected(files)        
    })
    return { openFileDialog, pickerElement }
}