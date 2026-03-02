import type { ProblemId, ProblemType } from "@/domain/problem/entity/Problem";
import { FreeSoloAutocomplete } from "@/ui/shared/components/FreeSoloAutocomplete";
import { useProblemStore } from "@/ui/store/useProblemStore";
import { Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, FormLabel, List, ListItem, ListItemIcon, ListItemText, MenuItem, Select, Stack } from "@mui/material";
import { useEffect, useState } from "react";
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
}) {
    const byId = useProblemStore(s=>s.byId)
    const tagSet = new Set<string>()
    props.checkedIds.map(id=>{
        const p = byId[id]
        p.tags?.forEach(tag=>tagSet.add(tag))
    })
    const initialTags = Array.from(tagSet)

    const [tags, setTags] = useState<string[]>([])
    useEffect(()=>{
        setTags(initialTags)
    }, [])
    return (
        <>
        {tags.map(tag=>(
            <Chip
                key={tag}
                label={tag}
                clickable
                onDelete={()=>{
                    setTags(prev=>prev.filter(t=>t!==tag))
                    props.onDeleteTag(tag)
                }}
            />
        ))}
        </>
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

    const updateProblems = useProblemStore(s => s.updateProblems)
    const handleConfirm = () => {
        updateProblems(props.checkedIds, (p) => {
            let next = p
            if (applyType) next = next.setType(type)
            if (applySource) next = next.setSource(source)
            console.log("tagstodelete", tagsToDelete)
            next = next.removeTags(tagsToDelete)
            
            return next
        })
        props.onClose()
    }
    const handleDeleteTag = (tag: string) => {
        //alert(tag)
        tagsToDelete.push(tag)
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
                        <Checkbox checked={applySource} onChange={(e) => setApplySource(e.target.checked)}/>
                        <TagEditControl checkedIds={props.checkedIds}
                            onDeleteTag={handleDeleteTag}
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