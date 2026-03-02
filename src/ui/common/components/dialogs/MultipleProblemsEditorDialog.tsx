import type { ProblemId, ProblemType } from "@/domain/problem/entity/Problem";
import { FreeSoloAutocomplete } from "@/ui/shared/components/FreeSoloAutocomplete";
import { useProblemStore } from "@/ui/store/useProblemStore";
import { Autocomplete, Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, FormLabel, InputLabel, List, ListItem, ListItemIcon, ListItemText, MenuItem, Select, Stack, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { ProblemTypeSelect } from "./problemDetail/ProblemTypeSelect";

export function useMultipleProblemsEditoDialog() {
    const [open, setOpen] = useState(false)
    const [checkedIds, setCheckedIds] = useState<ProblemId[]>([])

    const openDialog = (ids: ProblemId[]) => {
        setCheckedIds(ids)
        setOpen(true)
    }
    const closeDialog = () => { setOpen(false) }

    const dialogElement = (
        checkedIds.length > 0 &&
        <MultipleProblemsEditorDialog
            open={open}
            checkedIds={checkedIds}
            onClose={closeDialog}
        />
    )
    return { openDialog, dialogElement }
}
/////////////////////////////////////////
function ProblemTypeSelectControl(props: {
    type: ProblemType
    onChange: (type: ProblemType) => void
}) {
    return (<FormControl fullWidth>
        <ProblemTypeSelect
            value={props.type}
            onChange={v => props.onChange(v)}
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
            label="出典"
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
///////////////////////////////////////////////////
export function MultipleProblemsEditorDialog(props: {
    open: boolean
    checkedIds: ProblemId[]
    onClose: () => void
}) {
    const [type, setType] = useState<ProblemType>("standard")
    const [source, setSource] = useState("")
    const [applyType, setApplyType] = useState(false)
    const [applySource, setApplySource] = useState(false)
    const [tagsToDelete, setTagsToDelete] = useState<string[]>([])
    const [tagsToAdd, setTagsToAdd] = useState<string[]>([])

    const updateProblems = useProblemStore(s => s.updateProblems)
    const handleConfirm = () => {
        updateProblems(props.checkedIds, (p) => {
            let next = p
            if (applyType) next = next.setType(type)
            if (applySource) next = next.setSource(source)
            //console.log("tagstodelete", tagsToDelete)
            next = next.removeTags(tagsToDelete).addTags(tagsToAdd)            
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
                        <ProblemTypeSelectControl type={type} onChange={type => setType(type)} />
                    </Stack>
                    <Stack direction="row">
                        <Checkbox checked={applySource} onChange={(e) => setApplySource(e.target.checked)}/>
                        <SourceSelectControl source={source} onChange={s => setSource(s)} />
                    </Stack>
                    <Stack direction="row">
                        
                        <FormControl fullWidth>                            
                            <TagEditControl checkedIds={props.checkedIds}
                                onDeleteTag={handleDeleteTag}
                                onAddTag={handleAddTag}
                            />
                        </FormControl>
                             
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