import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Checkbox, Divider, FormControlLabel, IconButton, Stack, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { AppShell } from "@/ui/common/components/layout/AppShell";
import { CancelableTextField } from "@/shared/components/CancelableTextfield";
import { ProblemTagEditor } from "@/ui/common/components/ProblemTagEditor";
import { FreeSoloAutocomplete } from "@/shared/components/FreeSoloAutocomplete";
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import { routePaths } from "../../../router/paths";
import { useProblemDetailViewModel, useProblemEditActions } from "./hooks/useProblemDetailViewModel";
import { StarToggleButton } from "../../common/components/StarToggleButton/StarToggleButton";
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem";
import { ProblemInfoPanel } from "../../features/problem/components/ProblemInfoPanel";
import { LearningDetailPanel } from "../../features/learning/components/LearningDetailPanel";
import { ProblemTypeFilterControl } from "@/ui/features/problem/query/components/ProblemTypeFilterControl";
import { problemFieldLabels } from "@/ui/features/problem/hooks/problemPresenter";
import { useProblemStar, type StarToggleController } from "@/ui/common/components/StarToggleButton/useProblemStar";

export default function ProblemDetailScreen() {
    const { id } = useParams<{ id: string }>()
    const problem = useProblemStore(s => id ? s.byId[id] : undefined)
    if (!problem) return <div>Not found</div>

    return (<ProblemDetailContent problem={problem} />)
}
////////////////////////////
export function ProblemDetailContent({ problem }: { problem: Problem }) {
    const {
        allSources, fields, learningState,
    } = useProblemDetailViewModel(problem)

    const { resetLearning, deleteProblem, startPlay, confirm }
        = useProblemEditActions(problem.id)
    const starController = useProblemStar(problem.id)
    console.log("problem details", problem, fields)
    return (
        <AppShell
            header="棋譜エントリの詳細"
            rightActions={
                <RightActions
                    starController={starController}
                    onStartPlay={startPlay} onDeleteProblem={deleteProblem} />
            }
            footer={<Footer onConfirm={confirm} />}
        >
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                <Stack spacing={1} p={1} sx={{
                    flex: 1,
                    overflowY: "auto",
                    minHeight: 0,

                }}>
                    {/* タイトル編集 */}
                    <CancelableTextField label="タイトル" value={fields.title.value} onCommit={fields.title.set} />
                    <Stack direction="row" spacing={1}>
                        <ProblemTypeFilterControl
                            problemType={fields.type.value}
                            onChange={fields.type.set}
                            allowUnspecified={false}
                        />
                        <FreeSoloAutocomplete
                            label={problemFieldLabels["source"]}
                            value={fields.source.value}
                            options={allSources}
                            onChange={v => fields.source.set(v ?? "")}
                        />
                    </Stack>
                    <Stack direction="row">
                        <FormControlLabel
                            label="閲覧のみ"
                            control={
                                <Checkbox checked={fields.referenceOnly.value} onChange={fields.referenceOnly.toggle} />} />
                        <SideSelector value={fields.userSide.value} onChange={fields.userSide.set} />
                    </Stack>
                    
                    <ProblemTagEditor
                        value={fields.tags.value}
                        onChange={fields.tags.set}
                    />

                    <ProblemInfoPanel problem={problem} />
                    <Divider />

                    {learningState &&
                        <LearningDetailPanel learningState={learningState} onResetLearning={resetLearning} />
                    }
                    <TextField
                        label="コメント"
                        multiline
                        minRows={3}
                        fullWidth
                        value={fields.comment.value}
                        onChange={e => fields.comment.set(e.target.value)}
                    />
                    <TextField
                        label="ヒント"
                        multiline
                        minRows={1}
                        fullWidth
                        value={fields.hint.value}
                        onChange={e => fields.hint.set(e.target.value)}
                    />
                </Stack>
            </Box>
        </AppShell>
    )
}

function RightActions(props: {
    starController: StarToggleController
    onStartPlay: () => void
    onDeleteProblem: () => void
}) {
    const { starController, onStartPlay, onDeleteProblem } = props

    return <Stack direction="row" justifyContent="flex-end">
        <StarToggleButton starred={starController.starred}
            onToggle={starController.toggleStar}
            sx={{ color: "white" }}
        />

        <IconButton onClick={() => onStartPlay()}
            sx={{ color: "white" }}>
            <PlayArrowIcon />
        </IconButton>

        <IconButton onClick={onDeleteProblem} sx={{ color: "white" }}>
            <DeleteIcon />
        </IconButton>
    </Stack>
}

function Footer({ onConfirm }: { onConfirm: () => void }) {
    const height = "64px"
    const navigate = useNavigate()

    return (
        <Stack direction="row">
            <Button fullWidth
                onClick={() => navigate(-1)}
                variant="outlined">
                キャンセル
            </Button>
            <Button
                fullWidth
                variant="contained"
                onClick={onConfirm}
                sx={{ height: height }}
            >
                確認
            </Button>
        </Stack>
    )
}

import { ToggleButton, ToggleButtonGroup } from "@mui/material"

export function SideSelector({
    value,
    onChange,
}: {
    value: "black" | "white"
    onChange: (v: "black" | "white") => void
}) {
    return (
        <ToggleButtonGroup
            exclusive
            value={value}
            onChange={(_, v) => {
                if (v) onChange(v)
            }}
            size="small"
        >
            <ToggleButton value="black">
                先手
            </ToggleButton>

            <ToggleButton value="white">
                後手
            </ToggleButton>
        </ToggleButtonGroup>
    )
}