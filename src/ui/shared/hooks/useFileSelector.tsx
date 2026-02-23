import { useRef } from "react"

export function useFileSelector(accept?: string, multiple = true) {
  const inputRef = useRef<HTMLInputElement>(null)

  const openFileDialog = () => {
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
        if (e.target.files && onFilesSelected) {
          onFilesSelected(e.target.files)
          e.target.value = "" // 再選択可能に
        }
      }}
    />
  )

  let onFilesSelected: ((files: FileList) => void) | undefined

  const setOnFilesSelected = (fn: (files: FileList) => void) => {
    onFilesSelected = fn
  }

  return { openFileDialog, inputElement, setOnFilesSelected }
}
