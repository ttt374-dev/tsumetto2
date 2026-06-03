import { DefaultProblemType, type ProblemId } from "@/domain/problem/entity/Problem";
import { FreeSoloAutocomplete } from "@/shared/components/FreeSoloAutocomplete";
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import { Autocomplete, Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, FormLabel, InputLabel, List, ListItem, ListItemIcon, ListItemText, MenuItem, Select, setRef, Stack, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
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
/////////////////////////////////////////
function ProblemTypeSelectControl(props: {
    type: ProblemType
    onChange: (type: ProblemType) => void
}) {
    return (
    <FormControl fullWidth>
        <ProblemTypeFilterControl
            problemType={props.type}
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
    onToggle: () => void
}) {
    const { checked, onToggle} = props
    return (
        <FormControlLabel
            label="閲覧のみ"
            control={
                <Checkbox checked={checked} onChange={onToggle} />} />

    )
}
///////////////////////////////////////////////////
export function MultipleProblemsEditorDialog(props: {
    open: boolean
    checkedIds: ProblemId[]
    onClose: () => void
}) {
    const [type, setType] = useState<ProblemType>(DefaultProblemType)
    const [source, setSource] = useState("")
    const [applyType, setApplyType] = useState(false)
    const [applySource, setApplySource] = useState(false)
    const [tagsToDelete, setTagsToDelete] = useState<string[]>([])
    const [tagsToAdd, setTagsToAdd] = useState<string[]>([])
    const [applyReferenceOnly, setApplyReferenceOnly] = useState(false)
    const [referenceOnly, setReferenceOnly] = useState(false)

    const { updateProblems } = useProblemMutation()
    const handleConfirm = () => {
        updateProblems(props.checkedIds, (p) => {
            let next = p
            if (applyType) next = next.setType(type)
            if (applySource) next = next.setSource(source)
            //console.log("tagstodelete", tagsToDelete)
            next = next.removeTags(tagsToDelete).addTags(tagsToAdd)
            if (applyReferenceOnly) next = next.setReferenceOnly(referenceOnly)
            return next
        })
        props.onClose()
    }
    const handleDeleteTag = (tag: string) => {
        setTagsToDelete(prev=>[...prev, tag])
    }
    const handleAddTag = (tag: string) => {
        setTagsToAdd(prev=>[...prev, tag])
    }

    return (
        <Dialog open={props.open} onClose={props.onClose} fullWidth   maxWidth="md" >
            <DialogTitle>まとめて編集</DialogTitle>
            <DialogContent>
                <Stack spacing={2} pt={2}>                    
                    <Stack direction="row">
                        <Checkbox checked={applyType} onChange={(e) => setApplyType(e.target.checked)}/>
                        <ProblemTypeSelectControl type={type} onChange={type => {
                            setType(type)
                            setApplyType(true)
                        }} />
                    </Stack>
                    <Stack direction="row">
                        <Checkbox checked={applySource} onChange={(e) => setApplySource(e.target.checked)}/>
                        <SourceSelectControl source={source} onChange={s => {
                            setSource(s)
                            setApplySource(true)
                        }} />
                    </Stack>
                    <Stack direction="row">                        
                        <FormControl fullWidth>                            
                            <TagEditControl checkedIds={props.checkedIds}
                                onDeleteTag={handleDeleteTag}
                                onAddTag={handleAddTag}
                            />
                        </FormControl>                             
                    </Stack>
                    <Stack direction="row">
                        <Checkbox checked={applyReferenceOnly} onChange={(e) => setApplyReferenceOnly(e.target.checked)} />
                        <ReferenceOnlyControl
                            checked={referenceOnly}
                            onToggle={() => { 
                                setApplyReferenceOnly(true)
                                setReferenceOnly(!referenceOnly) 
                            }}
                        />
                    </Stack>
                    
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button variant="outlined" onClick={props.onClose}>
                    戻る
                </Button>
                <Button variant="contained" onClick={handleConfirm}>
                    保存
                </Button>
            </DialogActions>
        </Dialog>
    )
}