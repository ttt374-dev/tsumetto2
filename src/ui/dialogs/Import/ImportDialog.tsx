import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { ProblemTagEditor } from "../../common/components/ProblemTagEditor";
import { DefaultImportOptions, getExsitingTitle, type DuplicateTitleStrategy, type ImportMetadata, type ImportOptions } from "@/application/usecase/problem/import/ImportProblemsUsecase";
import { ProblemTypeFilterControl } from "@/ui/features/problem/query/components/ProblemTypeFilterControl";
import { SourceFilterControl } from "@/ui/features/problem/query/components/SourceFilterControl";
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";

export function useImportViewModel(files: File[]) {
    const allSources = useProblemStore(s => s.allSources)
    const activeProblems = useProblemStore(s => s.activeProblems)
    const existingTitles = useMemo(
        () => new Set(activeProblems.map(p => p.title)),
        [activeProblems]
    )

    const hasDuplicatedTitle = (): boolean => {
        return files.some(f => existingTitles.has(f.name))
    }

    return { allSources, hasDuplicatedTitle }
}
/////////////////////////////////////////////////////////////////////////
export function ImportDialog({ open, onClose, onImport, filesToImport }: {
    open: boolean
    onClose: () => void
    filesToImport: File[]
    onImport: (options: ImportOptions) => void
}) {
    const vm = useImportViewModel(filesToImport)
    const [options, setOptions] = useState<ImportOptions>({ ...DefaultImportOptions })

    return (
        <Dialog open={open} fullWidth >
            <DialogTitle>
                棋譜ファイルのインポート
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    {filesToImport.length} 件のファイルをインポートします。
                    <ProblemComponentControls
                        metadata={options.metadata}
                        sources={vm.allSources}
                        onChangeMetadata={partial=>
                            setOptions(prev=>({
                                ...prev,
                                metadata: {
                                    ...prev.metadata,
                                    ...partial
                                }
                            }))
                        }
                     />
                    {/* オプション*/}
                    
                    {vm.hasDuplicatedTitle() &&
                        <DuplicatedTitleControl
                            options={options}
                            onChangeStrategy={v => {
                                setOptions(prev => ({
                                    ...prev,
                                    policy: {
                                        ...prev.policy,
                                        duplicateTitleStrategy: v
                                    }
                                })
                                )
                            }}
                        />    
                    }
                </Stack>
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

function ProblemComponentControls( { metadata, sources, onChangeMetadata}: {
    metadata: ImportMetadata,
    sources: string[],
    onChangeMetadata: (p: Partial<ImportMetadata>) => void
}){
    return (<>
        <ProblemTypeFilterControl
            problemType={metadata.problemType}
            onChange={v => v && onChangeMetadata({problemType: v})
                
            }
            allowUnspecified={true}
        />
        <SourceFilterControl
            source={metadata.source} 
            onChange={v => v && onChangeMetadata({source: v})}
            sources={sources} />

        <ProblemTagEditor
            label={"tags"}
            value={metadata.tags ?? []}
            onChange={v => onChangeMetadata({tags: v})}
        />
    </>
    )
}

function DuplicatedTitleControl( { options, onChangeStrategy }: {
    options: ImportOptions,
    onChangeStrategy: (v: DuplicateTitleStrategy) => void
}) {
    return (
        <FormControl>
            <FormLabel>同名タイトルの処理</FormLabel>
            <RadioGroup
                value={options.policy.duplicateTitleStrategy}
                onChange={(e) =>                        
                    onChangeStrategy(e.target.value as DuplicateTitleStrategy)
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
    )
}