import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { useEffect, useState } from "react";
import { ProblemTagEditor } from "../../ProblemTagEditor";
import { DefaultImportOptions, getExsitingTitle, type DuplicateTitleStrategy, type ImportOptions } from "@/application/usecase/problem/import/ImportProblemsUsecase";
import { ProblemTypeFilterControl } from "@/ui/common/query-control/ProblemTypeFilterControl";
import { SourceFilterControl } from "@/ui/common/query-control/SourceFilterControl";
import { useProblemStore } from "@/ui/store/useProblemStore";

export function useImportViewModel() {

    const allSources = useProblemStore(s => s.allSources)
    const activeProblems = useProblemStore(s => s.activeProblems)
    const existingTitles = new Set(activeProblems.map(p => p.title))

    const hasDuplicatedTitle = (files: File[]): boolean => {
        let flag = false
        for(const file of files){
            if (existingTitles.has(file.name)) flag = true
        }
        return flag
    }

    return { allSources, hasDuplicatedTitle }
}
export function ImportDialog({open, onClose, onImport, filesToImport}: {
    open: boolean
    onClose: () => void
    filesToImport: File[]
    onImport: (options: ImportOptions) => void
}){
    const vm = useImportViewModel()
   
    const [options, setOptions] = useState<ImportOptions>({...DefaultImportOptions})
    if (!filesToImport) return
        
    return (
        <Dialog open={open} >
            <DialogTitle>
                棋譜ファイルのインポート
            </DialogTitle>
            <DialogContent>                     
                { filesToImport.length} 件のファイルをインポートします。
                <ProblemTypeFilterControl
                    problemType={options.problemType} onChange={(v)=>
                        v && setOptions(prev=>({...prev, problemType: v}))
                    }
                />
                <SourceFilterControl
                    source={options.source} onChange={v=>
                        v && setOptions(prev=>({...prev, source: v}))
                    } sources={vm.allSources}/>

                <ProblemTagEditor
                    label={"tags"}
                    value={options.tags}
                    onChange={(next) => { setOptions({...options, tags: next})}}
                />
                {/* オプション*/}
                {vm.hasDuplicatedTitle(filesToImport) &&
                    <FormControl>
                        <FormLabel>同名タイトルの処理</FormLabel>
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
                }

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