import { Autocomplete, Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, FormLabel, InputLabel, List, ListItem, ListItemIcon, ListItemText, MenuItem, Select, setRef, Stack, Switch, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { DefaultProblemType, type ProblemId } from "@/domain/problem/entity/Problem";
import { FreeSoloAutocomplete } from "@/shared/components/FreeSoloAutocomplete";
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import type { ProblemType } from "@/domain/problem/entity/ProblemType";
import { ProblemTypeFilterControl } from "@/ui/features/problem/query/components/ProblemTypeFilterControl";
import { problemFieldLabels } from "@/ui/features/problem/hooks/problemPresenter";
import { useDialogState } from "@/ui/common/hooks/useDialogState";
import { useProblemMutation } from "@/ui/features/problem/hooks/useProblemMutation";

export function useMultipleProblemsEditDialogController() {
    const dialog = useDialogState()
    //const [open, setOpen] = useState(false)
    const [checkedIds, setCheckedIds] = useState<ProblemId[]>([])

    const openDialog = (ids: ProblemId[]) => {  // override dialog.openDialog
        setCheckedIds(ids)
        //setOpen(true)
        dialog.openDialog()
    }
    //const closeDialog = () => { setOpen(false) }

    return { ...dialog, openDialog, checkedIds }
}
type BulkEditState = {
    problemType: ProblemType
    applyProblemType: boolean

    source: string
    applySource: boolean

    referenceOnly: boolean
    applyReferenceOnly: boolean

    //tagsToAdd: string[]
    //tagsToDelete: string[]
    //applyTags: boolean

}
const defaultBulkEditState: BulkEditState = {
    problemType: DefaultProblemType,
    applyProblemType: false,
    source: "",
    applySource: false,
    referenceOnly: false,
    applyReferenceOnly: false,

    //tagsToAdd: [],
    //tagsToDelete: [],
    //applyTags: false,
    
}
///////////////////////////////////////////////////
export function MultipleProblemsEditorDialog(props: {
    open: boolean
    checkedIds: ProblemId[]
    onClose: () => void
}) {
    const [state, setState] = useState<BulkEditState>(defaultBulkEditState)

    const { updateProblems } = useProblemMutation()
    const handleConfirm = () => {
        updateProblems(props.checkedIds, (p) => {
            let next = p
            if (state.applyProblemType) next = next.setType(state.problemType)
            if (state.applySource) next = next.setSource(state.source)
            //if (state.applyTags) next = next.removeTags(state.tagsToDelete).addTags(state.tagsToAdd)
            if (state.applyReferenceOnly) next = next.setReferenceOnly(state.referenceOnly)
            return next
        })
        handleClose()
    }
    /*
    const handleDeleteTag = (tag: string) => {
        setState(prev=>({...prev, tagsToDelete:  [...prev.tagsToDelete, tag]}))
        //setTagsToDelete(prev=>[...prev, tag])
    }
    const handleAddTag = (tag: string) => {
        setState(prev=>({...prev, tagsToAdd:  [...prev.tagsToAdd, tag]}))
        //setTagsToAdd(prev=>[...prev, tag])
    }*/

    const handleClose = () => {
        setState({ ...defaultBulkEditState })
        props.onClose()
    }
    const patchState = (patch: Partial<BulkEditState>) =>
        setState(prev => ({ ...prev, ...patch }))
    return (
        <Dialog open={props.open} onClose={handleClose} fullWidth   maxWidth="md" >
            <DialogTitle>まとめて編集</DialogTitle>
            <DialogContent>
                <Stack spacing={2} pt={2}>                    
                    <Stack direction="row">
                        <Checkbox checked={state.applyProblemType} 
                            onChange={(e) => 
                                patchState(({applyProblemType: e.target.checked}))}/>
                        <ProblemTypeSelectControl problemType={state.problemType} 
                            onChange={problemType => {
                                patchState({
                                    problemType,
                                    applyProblemType: true
                            })
                        }} />
                    </Stack>
                    <Stack direction="row">
                        <Checkbox checked={state.applySource} 
                            onChange={(e) => 
                                patchState(({applySource: e.target.checked}))}/>
                        <SourceSelectControl source={state.source} 
                            onChange={source => {
                                patchState({
                                    source,
                                    applySource: true
                                })
                            }} />
                    </Stack>
                    { /* 
                    <Stack direction="row">                        
                        <Checkbox checked={state.applyTags} 
                            onChange={(e) => patchState(({applyTags: e.target.checked}))}/>
                        <FormControl fullWidth>                            
                            <TagEditControl checkedIds={props.checkedIds}
                                onDeleteTag={handleDeleteTag}
                                onAddTag={handleAddTag}
                            />
                        </FormControl>                             
                    </Stack>
                    */ }
                    <Stack direction="row">
                        <Checkbox checked={state.applyReferenceOnly} 
                            onChange={(e) => patchState(({applyReferenceOnly: e.target.checked}))}/>
                        <ReferenceOnlyControl
                            checked={state.referenceOnly}
                            onChange={(checked) => { 
                                patchState({
                                    referenceOnly: checked,
                                    applyReferenceOnly: true
                                }) 
                            }}
                        />
                    </Stack>
                    
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button variant="outlined" onClick={handleClose}>
                    戻る
                </Button>
                <Button variant="contained" onClick={handleConfirm}>
                    保存
                </Button>
            </DialogActions>
        </Dialog>
    )
}
/////////////////////
/////////////////////////////////////////
function ProblemTypeSelectControl(props: {
    problemType: ProblemType
    onChange: (type: ProblemType) => void
}) {
    return (
    <FormControl fullWidth>
        <ProblemTypeFilterControl
            problemType={props.problemType}
            onChange={v => props.onChange(v)}
            allowUnspecified={false}
        />
    </FormControl>)
}
function SourceSelectControl(props: {
    source: string,
    onChange: (source: string) => void
}) {
    const allSources = useProblemStore(s => s.allSources)
    return (<FormControl fullWidth>
        <FreeSoloAutocomplete
            label={problemFieldLabels["source"]}
            value={props.source}
            options={allSources}
            onChange={v => props.onChange(v ?? "")}
        />
    </FormControl>)
}
function TagEditControl(props: {
    checkedIds: ProblemId[]
    onDeleteTag: (tag: string) => void
    onAddTag: (tag: string) => void
}) {
    const byId = useProblemStore(s=>s.byId)
    const allTags = useProblemStore(s=>s.allTags)
    // 選択中Problemのタグ集合
    const initialTags = useMemo(() => {
        const tagSet = new Set<string>()
        props.checkedIds.forEach(id => {
            const p = byId[id]
            p.tags?.forEach(tag => tagSet.add(tag))
        })
        return Array.from(tagSet)
    }, [props.checkedIds, byId])

    const [tags, setTags] = useState<string[]>([])
    useEffect(()=>{
        setTags(initialTags)
    }, [initialTags])

    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            <Autocomplete
                fullWidth
                multiple
                freeSolo
                options={[]} // ← 候補を入れたいならここ
                value={tags}
                onChange={(event, newValue) => {
                    // 追加されたタグ検出
                    const added = newValue.filter(t => !tags.includes(t))
                    const removed = tags.filter(t => !newValue.includes(t))

                    added.forEach(tag => props.onAddTag(tag))
                    removed.forEach(tag => props.onDeleteTag(tag))

                    setTags(newValue)
                }}
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip
                            label={option}
                            {...getTagProps({ index })}
                        />
                    ))
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        label="タグ編集"
                        placeholder="タグ追加"
                        fullWidth
                    />
                )}
                sx={{ minWidth: 200 }}
            />
        </Box>
    )    
}
function ReferenceOnlyControl(props: {
    checked: boolean
    onChange: (checked: boolean) => void
}) {
    const { checked, onChange} = props
    return (


        <FormControlLabel
            label="閲覧のみ"
            control={
                <Switch checked={checked} onChange={(e) => onChange(e.target.checked)} />} />

    )
}