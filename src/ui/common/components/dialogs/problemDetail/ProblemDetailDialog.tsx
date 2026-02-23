import { Divider, IconButton, Paper, Stack, TextField } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Button } from "@mui/material"

import DeleteIcon from '@mui/icons-material/Delete';

import { type ProblemId } from "@/domain/problem/entity/Problem";
import { useEffect, useState } from 'react';
import { useProblemStore } from '@/ui/store/useProblemStore';
import { EditableText } from '../../EditableText';
import { ProblemTagEditor } from '../../ProblemTagEditor';
import { StarToggleButton } from '../../StarToggleButton/StarToggleButton';
import { useLearningRecordStore } from '@/ui/store/useLearningRecordStore';
import { useLearningEventStore } from '@/ui/store/useLearningEventStore';
import type { NewLearningEvent } from '@/domain/learning/entity/LearningEvent';
import type { SolvedResult } from '@/domain/learning/entity/Learning';

export function useProblemDetailDialogViewModel(
    problemId: ProblemId,
    open: boolean,
    onClose: () => void,
) {
    // problem store
    const problem = useProblemStore(s => s.byId[problemId])
    const updateProblem = useProblemStore(s => s.updateProblem)
    const deleteProblems = useProblemStore(s => s.deleteProblems)
    const allTags = useProblemStore(s => s.allTags)

    // learning store
    const appendLearning = useLearningEventStore(s => s.append)
    const learningRecords = useLearningRecordStore(s => s.records)
    const learning = problem ? learningRecords[problem.id] : undefined

    // local state
    const [title, setTitle] = useState("")
    const [tags, setTags] = useState<string[]>([])
    const [starred, setStarred] = useState(false)

    // open 時に初期値セット
    useEffect(() => {
        if (open && problem) {
            setTitle(problem.title)
            setTags(problem.tags ?? [])
            setStarred(problem.starred)
        }
    }, [open, problem])

    //////////////////////////////////////////////////////////
    const remove = (confirmFn: () => boolean) => {
        if (!problem || !confirmFn()) return
        deleteProblems([problem.id])
        onClose()
    }

    const save = async () => {
        if (!problem) return
        await updateProblem(problemId, prev =>
            prev.setTitle(title)
                .setTags(tags)
                .setStarred(starred)
        )
        onClose()
    }

    // 学習データリセット
    const resetLearning = (confirmFn: () => boolean) => {
        if (!confirmFn()) return
        const event: NewLearningEvent = { type: "reset", problemId }
        appendLearning(event)
    }

    // review イベント追加
    const reviewProblem = (quality: SolvedResult, sec?: number) => {
        const event: NewLearningEvent = { type: "reviewed", problemId, quality, sec }
        appendLearning(event)
    }

    return {
        problem,
        learning,
        title,
        tags,
        starred,
        allTags,
        setTitle,
        setTags,
        setStarred,
        remove,
        save,
        resetLearning,
        reviewProblem
    }
}
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
        problem, learning, title, tags, starred,
        setTitle,
        setTags,
        setStarred,
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
        <Dialog open={open} onClose={onClose} fullWidth
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
                <Stack spacing={1}>
                    
                    {/* タイトル編集 */}

                    <Paper sx={{ p: 1 }}>
                        <EditableText key={problem.id} initialText={title} onUpdateText={
                            title => { setTitle(title) }} />
                    </Paper>
                    <Divider />


                    <Paper sx={{ p: 1 }}>
                        <Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Box>UUID</Box>
                                <Box>{problem.id}</Box>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Box>追加日</Box>
                                <Box>{new Date(problem.createdAt).toLocaleString()}</Box>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Box>更新日</Box>
                                <Box>{new Date(problem.updatedAt).toLocaleString()}</Box>
                            </Stack>
                        </Stack>
                        <Box sx={{ mt: 2 }}>
                            <ProblemTagEditor
                                value={tags}
                                onChange={(tags) => {
                                    setTags(tags)
                                }}
                            />
                        </Box>
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