import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DeleteIcon from '@mui/icons-material/Delete';

import { Box, Button, Divider, IconButton, Stack, TextField } from "@mui/material";
import { AppShell } from "../common/components/layout/AppShell";
import { CancelableTextField } from "../shared/components/CancelableTextfield";
import { ProblemTypeSelect } from "./components/ProblemTypeSelect";
import { ProblemTagEditor } from "../common/components/ProblemTagEditor";
import { FreeSoloAutocomplete } from "../shared/components/FreeSoloAutocomplete";
import { useNavigate, useParams } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import { routes } from "../App/useAppNavigation";
import { useProblemDetailDialogViewModel } from "./hooks/useProblemDetailDialogViewModel";
import { StarToggleButton } from "../common/components/StarToggleButton/StarToggleButton";
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem";
import { LearningDetailPanel, ProblemInfoPanel } from "./ProblemDetailDialog";

export function ProblemDetailScreen(){
    const { id } = useParams<{ id: string }>()
    const problem = useProblemStore(s => id ? s.byId[id] : undefined)
    if (!problem) return <div>Not found</div>

    return (<ProblemDetailContent problem={problem}/>)
}

export function ProblemDetailContent( { problem }: { problem: Problem}) {
        const {
            learning, title, tags, starred, source, type, allSources, comment,
            setTitle, setTags, toggleStar, setType, setSource, remove, setComment,
            save, resetLearning
        } = useProblemDetailDialogViewModel(problem.id, true)
        

    const handleLearningReset = () => {
        if (!window.confirm("学習データをクリアしますか？")) return
        resetLearning()
    }   
    const height="64px"
    const navigate = useNavigate()
        const handleDeleteClick = () => {
        if(!window.confirm("Are you sure to delete?")) return
        remove()
        //onAfterDeleteProblem?.()  
        //onClose()
        navigate(routes.back)
    }
    const handleConfirm = () => {
        save()
        navigate(routes.back)
    }
    const onStartPlay = (id: ProblemId) => 
        navigate(routes.player(id))

    return (
        <AppShell 
            header="棋譜エントリの詳細"
            rightActions={
                <Stack direction="row" justifyContent="flex-end">
                    <StarToggleButton starred={starred}
                        onToggle={() => toggleStar()}
                         sx={{color: "white"}}
                    />

                    {onStartPlay &&
                        <IconButton onClick={() => onStartPlay(problem.id)}
                         sx={{color: "white"}}>
                            <PlayArrowIcon />
                        </IconButton>}
                    <IconButton onClick={handleDeleteClick}  sx={{color: "white"}}>
                        <DeleteIcon />
                    </IconButton>
                </Stack>
            }
            footer={
                <Stack direction="row">
                    <Button fullWidth
                        onClick={() => navigate(routes.back)}
                        variant="outlined">
                        キャンセル
                    </Button>
                    <Button
                       fullWidth          
                        variant="contained"
                        onClick={handleConfirm}
                        sx={{ height: height }}
                    >
                        確認
                    </Button>    
                </Stack>
            }
        >
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
            <Stack spacing={1} p={1} sx={{
                    flex: 1,
                    overflowY: "auto",
                    minHeight: 0,
                    
                }}>
                {/* タイトル編集 */}
                <CancelableTextField label="タイトル" value={title} onCommit={title => setTitle(title)} />
                <ProblemTypeSelect
                    value={type}
                    onChange={v => setType(v)}
                />
                <FreeSoloAutocomplete
                    label="出典"
                    value={source}
                    options={allSources}
                    onChange={v => setSource(v ?? "")}
                />
                <ProblemTagEditor
                    value={tags}
                    onChange={tags => setTags(tags)}
                />

                <ProblemInfoPanel problem={problem} />
                <Divider />

                {learning &&
                    <LearningDetailPanel learning={learning} onResetLearning={handleLearningReset} />
                }
                <TextField
                    label="コメント"
                    multiline
                    minRows={3}
                    fullWidth
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                />
            </Stack>
            </Box>
        </AppShell>
    )
}