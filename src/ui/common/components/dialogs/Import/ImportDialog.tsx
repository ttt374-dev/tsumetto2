import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { useState } from "react";
import type { DuplicateTitleStrategy, ImportOptions } from "./useImportController";
import { ProblemTagEditor } from "../../ProblemTagEditor";

export function ImportDialog({open, onClose, onImport}: {
    open: boolean
    onClose: () => void
    onImport: (options: ImportOptions) => void
}){
    //const [tags, setTags] = useState<string[]>([])
    const [options, setOptions] = useState<ImportOptions>({tags: [], duplicateTitleStrategy: "skip"})
    return (
        <Dialog open={open} >
            <DialogTitle>
                棋譜ファイルのインポート
            </DialogTitle>
            <DialogContent>
                インポートしますか？                

                <ProblemTagEditor
                    label={"tags"}
                    value={options.tags}
                    onChange={(next) => { setOptions({...options, tags: next})}}
                />
                {/* オプション*/ }
                <FormControl>
                    <FormLabel>同名タイトルがあった場合</FormLabel>

                    <RadioGroup
                        value={options.duplicateTitleStrategy}
                        onChange={(e) =>
                            setOptions({
                                ...options,
                                duplicateTitleStrategy:
                                    e.target.value as DuplicateTitleStrategy
                            })
                        }
                    >
                        <FormControlLabel
                            value="overwrite"
                            control={<Radio />}
                            label="上書きする"
                        />
                        <FormControlLabel
                            value="rename"
                            control={<Radio />}
                            label="名前を変えて保存"
                        />
                        <FormControlLabel
                            value="skip"
                            control={<Radio />}
                            label="スキップする"
                        />
                    </RadioGroup>
                </FormControl>

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    キャンセル
                </Button>
                <Button onClick={() => onImport(options)} color="success" variant="contained">
                    Import
                </Button>
            </DialogActions>
        </Dialog>
    )
}