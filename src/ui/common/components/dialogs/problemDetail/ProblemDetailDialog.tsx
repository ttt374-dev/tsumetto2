import { Divider, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Stack, TextField } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Button } from "@mui/material"

import DeleteIcon from '@mui/icons-material/Delete';

import { type ProblemId, type ProblemType } from "@/domain/problem/entity/Problem";
import { useEffect, useState } from 'react';
import { ProblemTagEditor } from '../../ProblemTagEditor';
import { StarToggleButton } from '../../StarToggleButton/StarToggleButton';
import { CancelableTextField } from './CancelableTextfield';
import { useProblemDetailDialogViewModel, type SourceOption } from './useProblemDetailDialogViewModel';
import { ProblemTypeSelect } from './ProblemTypeSelect';
import { FreeSoloAutocomplete } from '@/ui/shared/components/FreeSoloAutocomplete';

/////////////////////////////////////////////////////////////
type Props = {
    open: boolean
    problemId: ProblemId
    onClose: () => void
    onViewProblem?: () => void
    onAfterDeleteProblem?: () => void
}
export default function ProblemDetailDialog({ open, problemId, onAfterDeleteProblem, onClose }: Props) {
    const {
        problem, learning, title, tags, starred, source, type, allSources,
        setTitle,
        setTags,
        setStarred,
        setType,
        setSource,
        remove,
        save: handleSave,
        resetLearning
    } = useProblemDetailDialogViewModel(problemId, open, onClose)

    const [comment, setComment] = useState("")
    if (!problem) return <></>

    const handleDeleteClick = () => {
        remove(() => window.confirm("Are you sure to delete?"))
        onAfterDeleteProblem?.()
    }
    const handleLearningReset = () => {
        resetLearning(() => window.confirm("学習データをクリアしますか？"))
    }

    ///////////////////////////////////////////////////////
    return (
        <Dialog open={open} onClose={onClose} fullScreen
            sx={{
                paddingTop: 'env(safe-area-inset-top)',
                paddingBottom: 'env(safe-area-inset-bottom)',
            }}>
            <DialogTitle>
                棋譜エントリの詳細
                <Stack direction="row" justifyContent="flex-end">
                    <StarToggleButton starred={starred}
                        onToggle={() => setStarred(prev => !prev)}
                    />
                    <IconButton onClick={handleDeleteClick}>
                        <DeleteIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>
            <DialogContent>
                <Stack spacing={1} pt={2}>
                    {/* タイトル編集 */}
                    <CancelableTextField label="タイトル" value={title} onCommit={
                        title => { setTitle(title) }} />

                    <ProblemTypeSelect
                        value={type}
                        onChange={(v) => setType(v)}
                    />
                    <ProblemTagEditor
                        value={tags}
                        onChange={(tags) => {
                            setTags(tags)
                        }}
                    />

                    <FreeSoloAutocomplete
                        label="出典"
                        value={source}
                        options={allSources}
                        onChange = {v => setSource(v??"")}
                        //onChange={(v) => { setSource(v ?? ""); console.log("on change: ", v)}}                        
                    />
                    <Paper sx={{ p: 1 }}>
                        <Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Box>追加日</Box>
                                <Box>{new Date(problem.createdAt).toLocaleString()}</Box>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Box>更新日</Box>
                                <Box>{new Date(problem.updatedAt).toLocaleString()}</Box>
                            </Stack>
                        </Stack>
                    </Paper>
                    <Divider />

                    {learning &&
                        <Paper sx={{ p: 1 }}>
                            <Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Box>正答率（正答：誤答）</Box>
                                    <Box>{(learning.accuracy * 100).toFixed(0)}%({learning.solvedCount}:{learning.failedCount})</Box>
                                </Stack>


                                {learning.lastAnswerResult &&
                                    <Stack direction="row" justifyContent="space-between">
                                        <Box>前回結果</Box>
                                        <Box>{learning.lastAnswerResult}</Box>
                                    </Stack>
                                }
                                {learning.lastAnsweredAt &&
                                    <Stack direction="row" justifyContent="space-between">
                                        <Box>前回解答日</Box>
                                        <Box>{new Date(learning.lastAnsweredAt).toLocaleString()}</Box>
                                    </Stack>
                                }

                                <Stack direction="row" justifyContent="space-between">
                                    <Box>次回レビュー日</Box>
                                    <Box>{new Date(learning.nextReviewedAt).toLocaleString()}</Box>
                                </Stack>

                                <Stack direction="row" justifyContent="space-between">
                                    <Box>Ease Factor</Box>
                                    <Box>{learning.easeFactor.toFixed(2)}</Box>
                                </Stack>
                            </Stack>
                            <Stack direction="row" justifyContent="flex-end">
                                <Button onClick={handleLearningReset} variant='outlined'>
                                    学習データをリセット
                                </Button>
                            </Stack>
                        </Paper>
                    }
                    <TextField
                        label="コメント"
                        multiline
                        minRows={3}
                        fullWidth
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </Stack>


            </DialogContent>

            <DialogActions>
                <Button variant="outlined" onClick={onClose}>キャンセル</Button>
                <Button variant="contained" color="success" onClick={handleSave}>保存して戻る</Button>
            </DialogActions>
        </Dialog>
    )
}