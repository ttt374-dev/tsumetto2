import type { Problem, ProblemId } from "@/domain/problem/Problem";
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, Stack, Tab, Tabs, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear"


import { ProblemTagEditor } from "../components/ProblemTagEditor";
import { useEffect, useState } from "react";
import { useRepositoryContext } from "../../App/providers/RepositoryProvider";
import { useProblemStore } from "@/application/store/useProblemStore";


export function useMultipleProblemsTagEditDialog(
    onUpdateProblems: (p: Problem[]) => void
    //onApplyEditTags: (problemIds: ProblemId[], addTag: string|undefined, removeTags: string[]|undefined) => void
) {
    const [open, setOpen] = useState(false)
    const [problems, setProblems] = useState<Problem[]>([])
    const [initialTags, setInitialTags] = useState<string[]>([])

    const repos = useRepositoryContext()
    //const store = useProblemStore(repos.problem)

    useEffect(() => {
        useProblemStore.getState().reload()
    }, [open])

    const openDialog = (ids: ProblemId[]) => {
        setOpen(true)
        const problems = ids.map(id => (useProblemStore(s=>s.byId[id]))).filter(p => p !== undefined)
        console.log("opendialog edittag", problems)
        //const tags = problems.map(p => p.tags)
        const uniqTags = Array.from(
            new Set(problems.flatMap(p => p.tags))
        )
        setProblems(problems)
        setInitialTags(uniqTags)
    }
    const closeDialog = () => { setOpen(false) }

    const dialogElement = (
        open &&
        <MultipleProblemsTagEditDialog
            open={open}
            problems={problems}
            initialTags={initialTags}
            onClose={closeDialog}
            onUpdateProblems={onUpdateProblems}
            //onApplyEditTags={onApplyEditTags}
        />
    )
    return { openDialog, dialogElement }
}

export default function MultipleProblemsTagEditDialog({
    open, problems, initialTags, onClose, onUpdateProblems }: {
        open: boolean
        problems: Problem[]
        initialTags: string[]

        onClose: () => void
        onUpdateProblems: (p: Problem[]) => void
        //onApplyEditTags: (problemIds: ProblemId[], addTag: string|undefined, removeTags: string[]|undefined) => void
    }) {
    //const [tags, setTags] = useState<string[]>(initialTags)
    const [tab, setTab] = useState<0 | 1>(0)
    const [tags, setTags] = useState(initialTags)
    //const [removeTags, setRemoveTags] = useState<string[]>([])

    const [input, setInput] = useState("")
    const handleAddTag = () => {
        const tag = input.trim()
        //if (!tag || initialTags.includes(tag)) return
        if (!tag) return

        //onApplyEditTags(problems.map(p => p.id), tag, undefined)
        const newProblems = problems.map(p =>
            p.setTags([...new Set([...p.tags, tag])])
        )
        console.log("addtag", newProblems)
        onUpdateProblems(newProblems)
        setInput("")
    }
    const handleDeleteTag = (tagToDelete: string) => {
        const newProblems = problems.map(p=>{
            const newTags = p.tags.filter(t=>t!==tagToDelete)
            //onUpdateProblem(p.setTags(newTags))
            return p.setTags(newTags)
        })
        onUpdateProblems(newProblems)
        setTags(prev=>prev.filter(t=>t!==tagToDelete))
    }
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                タグ編集
            </DialogTitle>
            <DialogContent>
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    variant="fullWidth"
                >
                    <Tab label="追加" />
                    <Tab label="削除" />
                </Tabs>

                { /* 追加 */}
                {tab === 0 && <>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        {initialTags.map(tag => (
                            <Chip
                                key={tag}
                                label={tag}
                                onClick={() => setInput(tag)}
                                size="small"
                            />
                        ))}
                    </Stack>

                    <Stack direction="row">
                        <TextField
                            size="small"
                            label="タグ追加"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === "Enter") {
                                    e.preventDefault()
                                    handleAddTag()
                                }
                            }}
                            sx={{ mt: 1 }}
                            slotProps={{
                                input: {
                                    endAdornment: input && (
                                        <InputAdornment position="end">
                                            <IconButton
                                                size="small"
                                                onMouseDown={e => e.preventDefault()}
                                                onClick={() => setInput("")}
                                            >
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                        <Button onClick={handleAddTag}>
                            追加
                        </Button>
                    </Stack>
                </>}

                { /* 削除 */}
                {tab === 1 &&
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        {tags.map(tag => (
                            <Chip
                                key={tag}
                                label={tag}
                                onDelete={()=>handleDeleteTag(tag)}
                                onClick={() => setInput(tag)}
                                size="small"
                            />
                        ))}
                    </Stack>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    戻る
                </Button>
            </DialogActions>
        </Dialog>
    )
}