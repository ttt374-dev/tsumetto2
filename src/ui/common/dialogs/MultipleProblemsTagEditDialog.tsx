import type { Problem, ProblemId } from "@/domain/problem/Problem";
import { Button, Checkbox, checkboxClasses, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, List, ListItem, ListItemIcon, ListItemText, Stack, Tab, Tabs, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear"

import { useEffect, useState } from "react";
import { useProblemStore } from "@/application/store/useProblemStore";
import { selectAllTags } from "@/application/store/ProblemSelector";


export function useMultipleProblemsTagEditDialog(checkedIds: ProblemId[]) {
    const [open, setOpen] = useState(false)
    const [problems, setProblems] = useState<Problem[]>([])
    //const [initialTags, setInitialTags] = useState<string[]>([])

    //const problems = ids.map(id => (useProblemStore(s=>s.byId[id]))).filter(p => p !== undefined)
    //useEffect(() => {
    //    useProblemStore.getState().reload()
    //}, [open])

    const openDialog = (ids: ProblemId[]) => {
        setOpen(true)

        console.log("opendialog edittag", problems)
        //const tags = problems.map(p => p.tags)
        const uniqTags = Array.from(
            new Set(problems.flatMap(p => p.tags))
        )
        setProblems(problems)
        //setInitialTags(uniqTags)
    }
    const closeDialog = () => { setOpen(false) }

    const dialogElement = (
        <MultipleProblemsTagEditDialog
            open={open}
            checkedIds={checkedIds}
            //initialTags={initialTags}
            onClose={closeDialog}
        />
    )
    return { openDialog, dialogElement }
}


type TagEditState = "add" | "remove" | "keep"

function createDraftFromProblems(
    problems: Problem[],
    allTags: string[]
): Record<string, TagEditState> {

    const total = problems.length
    const tagCount: Record<string, number> = {}

    //console.log("problems", problems)
    for (const problem of problems) {
        console.log("problem", problem)
        for (const tag of problem.tags) {
            tagCount[tag] = (tagCount[tag] ?? 0) + 1
            //console.log("tagcount", tagCount[tag], tag)
        }
    }

    const draft: Record<string, TagEditState> = {}

    for (const tag of allTags) {
        const count = tagCount[tag] ?? 0

        if (count === 0) {
            draft[tag] = "remove"
        } else if (count === total) {
            draft[tag] = "add"
        } else {
            draft[tag] = "keep"
        }
    }

    return draft
}

export default function MultipleProblemsTagEditDialog(props: {
        open: boolean
        onClose: () => void
        checkedIds: ProblemId[]
    }) {
// query
    const selectedProblems = useProblemStore(s=>s.all).filter(p =>
        props.checkedIds.includes(p.id)
    )
    const allTags = useProblemStore(s => s.allTags)
    const [draft, setDraft] = useState<Record<string, TagEditState>>({})    

    useEffect(()=>{
        setDraft(createDraftFromProblems(selectedProblems, allTags))
    }, [allTags, props.checkedIds])
    const handleToggleChecked = (tag: string, checked: boolean) => {
        setDraft(prev => ({
            ...prev,
            [tag]: checked ? "add" : "remove"
        }))
    }
    const updateProblems = useProblemStore(s=>s.updateProblems)
    const handleConfirm = () => {
        updateProblems(props.checkedIds, (p) => {
            let newTags = [...p.tags]
            let changed = false

            for (const [tag, action] of Object.entries(draft)) {

                if (action === "add" && !newTags.includes(tag)) {
                    newTags.push(tag)
                    changed = true
                }

                if (action === "remove" && newTags.includes(tag)) {
                    newTags = newTags.filter(t => t !== tag)
                    changed = true
                }
            }

            if (!changed) return p

            return p.setTags(newTags)
        })

        props.onClose()
    }


    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>
                タグ編集
            </DialogTitle>
            <DialogContent>
                <List>
                    {
                        allTags.map(tag => {

                            return (

                            <ListItem>
                                <ListItemIcon>
                                    <Checkbox
                                        onChange={(e) =>
                                            handleToggleChecked(tag, e.target.checked)}
                                        checked={draft[tag] === "add"}
                                        indeterminate={draft[tag] === "keep"}

                                    />
                                </ListItemIcon>
                                <ListItemText>
                                    {tag}
                                </ListItemText>

                            </ListItem>

                        )})

                    }
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>
                    戻る
                </Button>
                <Button color="success" variant="contained" onClick={handleConfirm}>
                    OK
                </Button>

            </DialogActions>
        </Dialog>
    )
}