import { useRef } from "react"

export function useFileSelector(
  onFilesSelected: (files: File[]) => void,
  accept?: string,
  multiple = true
) {
  const inputRef = useRef<HTMLInputElement>(null)

  const openDialog = () => {
    inputRef.current?.click()
  }  
  const inputElement = (
    <input
      ref={inputRef}
      type="file"
      multiple={multiple}
      accept={accept}
      style={{ display: "none" }}
      onChange={(e) => {
        if (e.target.files) {
            onFilesSelected([...e.target.files])            
            e.target.value = ""
        }
      }}
    />
  )

  return { openDialog, inputElement }
}