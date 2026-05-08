import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Checkbox, Divider, FormControlLabel, IconButton, Stack, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { AppShell } from "@/ui/common/components/layout/AppShell";
import { CancelableTextField } from "@/ui/shared/components/CancelableTextfield";
import { ProblemTagEditor } from "@/ui/common/components/ProblemTagEditor";
import { FreeSoloAutocomplete } from "@/ui/shared/components/FreeSoloAutocomplete";
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import { routes } from "../../App/useAppNavigation";
import { useProblemDetailViewModel, useProblemEditActions } from "./hooks/useProblemDetailViewModel";
import { StarToggleButton } from "../../common/components/StarToggleButton/StarToggleButton";
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem";
import { ProblemInfoPanel } from "../../features/problem/components/ProblemInfoPanel";
import { LearningDetailPanel } from "../../features/learning/components/LearningDetailPanel";
import { ProblemTypeFilterControl } from "@/ui/features/problem/query/components/ProblemTypeFilterControl";
import { problemFieldLabels } from "@/ui/features/problem/hooks/problemPresenter";

export default function ProblemDetailScreen(){
    const { id } = useParams<{ id: string }>()
    const problem = useProblemStore(s => id ? s.byId[id] : undefined)
    if (!problem) return <div>Not found</div>

    return (<ProblemDetailContent problem={problem}/>)
}

export function ProblemDetailContent( { problem }: { problem: Problem}) {
    const {
        allSources,save,
        fields, learningState,
    } = useProblemDetailViewModel(problem)

    const { resetLearning,  remove,} 
        = useProblemEditActions(problem.id)
    
    const handleLearningReset = () => {
        if (!window.confirm("学習データをクリアしますか？")) return
        resetLearning()
    }   
    const height="64px"
    const navigate = useNavigate()
        const handleDeleteClick = () => {
        if(!window.confirm("Are you sure to delete?")) return
        remove()
        navigate(routes.back)
    }
    const handleConfirm = () => {
        save()
        navigate(routes.back)
    }
    const onStartPlay = (id: ProblemId) => 
        navigate(routes.view(id))

    return (
        <AppShell 
            header="棋譜エントリの詳細"
            rightActions={
                <Stack direction="row" justifyContent="flex-end">
                    <StarToggleButton starred={fields.starred.value}
                        onToggle={fields.starred.toggle}
                         sx={{color: "white"}}
                    />
                    
                        <IconButton onClick={() => onStartPlay(problem.id)}
                         sx={{color: "white"}}>
                            <PlayArrowIcon />
                        </IconButton>
                    
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
                <CancelableTextField label="タイトル" value={fields.title.value} onCommit={fields.title.set} />
                <ProblemTypeFilterControl
                    problemType={fields.type.value}
                    onChange={fields.type.set}
                    allowUnspecified={false}
                />
                <FormControlLabel
                    label="閲覧のみ"
                    control={
                    <Checkbox checked={fields.referenceOnly.value} onChange={fields.referenceOnly.toggle}/>}/>
                <FreeSoloAutocomplete
                    label={problemFieldLabels["source"]}
                    value={fields.source.value}
                    options={allSources}
                    onChange={v => fields.source.set(v ?? "")}
                />
                <ProblemTagEditor
                    value={fields.tags.value}
                    onChange={fields.tags.set}
                />

                <ProblemInfoPanel problem={problem} />
                <Divider />

                {learningState &&
                    <LearningDetailPanel learningState={learningState} onResetLearning={handleLearningReset} />
                }
                <TextField
                    label="コメント"
                    multiline
                    minRows={3}
                    fullWidth
                    value={fields.comment.value}
                    onChange={e => fields.comment.set(e.target.value)}
                />
            </Stack>
            </Box>
        </AppShell>
    )
}