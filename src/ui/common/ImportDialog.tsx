import { Filesystem } from "@capacitor/filesystem";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { ProblemTagEditor } from "./ProblemTagEditor";
import type { ImportOptions } from "@/application/useImportControler";
import { useState } from "react";

export function ImportDialog({open, onImport, allTags=[] }: {
    open: boolean
    onImport: (options: ImportOptions) => void
    allTags?: string[]
}){
    const [tags, setTags] = useState<string[]>([])
    return (
        <Dialog open={open} >
            <DialogTitle>
                棋譜ファイルのインポート
            </DialogTitle>
            <DialogContent>
                インポートしますか？                

                <ProblemTagEditor
                    label={"tags"}
                    value={tags}
                    allTags={allTags}
                    onChange={(next) => { setTags(next)}}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onImport({
                    tags: tags, duplicateStrategy: "rename"
                })}>
                    Import
                </Button>
            </DialogActions>
        </Dialog>
    )
}