import { Divider, IconButton, Paper, Stack, TextField } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Button } from "@mui/material"
import StarIcon from "@mui/icons-material/Star"
import StarBorderIcon from "@mui/icons-material/StarBorder"

import { Problem, type ProblemId } from "@/domain/problem/Problem";
import { useEffect, useState } from 'react';
import { useRepositoryContext } from '../App/providers/RepositoryProvider';
import { useProblemDetailDialog } from './useProblemDetailDialog';
import { useProblemStore } from '@/application/store/useProblemStore';
import { EditableText } from './EditableText';
import { ProblemTagEditor } from './ProblemTagEditor';
import { useLearningEventStore } from '@/application/store/useLearningEventStore';

type Props = {
    open: boolean
    problemId: ProblemId
    //onUpdateTitle: (title: string) => void;
    onConfirm: (problemId: string) => void;
    onClose: () => void
    onDelete: () => void
    onResetLearning: () => void
    onUpdateProblem: (problem: Problem) => void
    onViewProblem?: ()=>void
}

export default function ProblemDetailDialog({
    open,
    problemId,
    
    onClose,
    onDelete,
    onResetLearning,
    onUpdateProblem,
    onViewProblem,
}: Props) {
    const repo = useRepositoryContext()
    const store = useProblemStore(repo.problem)
    const problem = store.findById(problemId)
    useEffect(() => {
        if (open && problem) {
            setTags(problem.tags as string[] ?? [])
        }
    }, [open, problem?.tags])
    const learningStore = useLearningEventStore(repo.learningEvent)
    const learning = learningStore.records[problemId]
    
    const [tags, setTags] = useState<string[]>(
        () => problem?.tags ? [...problem.tags] : []
    )

    const allTags = Array.from(
        new Set(store.problems.flatMap(p => p.tags))
    )
    const [ starred, setStarred] = useState(problem?.starred)

    // handlers
    const handleDelete = () => {
        if (!window.confirm("本当に削除しますか？")) return
        onDelete()
        onClose()
    }
    
    const handleCancel = () => {      
        onClose()
    }
    const handleResetAccuracy = () => {
        if (!window.confirm("本当に正答データをリセットしますか？")) return
        onResetLearning()             
    }    

    
    const handleToggleStar = () => {
        problem && onUpdateProblem(problem.toggleStar())
        setStarred(!starred)
    }
    if (!problem) return null
    //const tagsString = tags.join(" ")

    ///////////////////////////////////////////////////////
    return (
        <Dialog open={open} onClose={onClose} fullWidth
            sx={{
                paddingTop: 'env(safe-area-inset-top)',
                paddingBottom: 'env(safe-area-inset-bottom)',
            }}>
            <DialogTitle>
                棋譜エントリの詳細
            </DialogTitle>
            <DialogContent>
                <Stack>
                    {/* タイトル編集 */}
                    <Box display="flex" alignItems="center" gap={2} mt={1}>
                        <EditableText initialText={problem.title} onUpdateText={
                            title => {
                            onUpdateProblem(problem.setTitle(title))
                            }}/>
                    </Box>
                    <Divider />

                    { /* 正答誤答*/}
                    {/*  { record && `正答：${record.solvedCount}, 誤答：${record.failedCount}` }*/}
                                        
                    <ProblemTagEditor
                        allTags={allTags}
                        value = {tags}
                        onChange={ (tags) => {
                            setTags(tags)
                            onUpdateProblem(problem.setTags(tags))
                        }}
                    />
                    <Paper sx={{ p: 1 }}>
                        <Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Box>追加日</Box>
                                <Box>{new Date(problem.createdAt).toLocaleDateString()}</Box>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Box>スター</Box>
                                <Box>
                                    <IconButton onClick={handleToggleStar}>
                                        { starred ? <StarIcon/> : <StarBorderIcon/>}
                                    </IconButton>
                                </Box>
                            </Stack>
                        </Stack>
                    </Paper>

                    {learning &&
                        <Paper sx={{ p: 1 }}>
                            <Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Box>正答数</Box>
                                    <Box>{learning.solvedCount}</Box>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Box>誤答数</Box>
                                    <Box>{learning.failedCount}</Box>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Box>正答率</Box>
                                    <Box>{(learning.accuracy*100).toFixed(0)}%</Box>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Box>Ease Factor</Box>
                                    <Box>{learning.easeFactor.toFixed(2)}</Box>
                                </Stack>

                                <Stack direction="row" justifyContent="space-between">
                                    <Box>次回レビュー日</Box>
                                    <Box>{new Date(learning.nextReviewedAt).toLocaleDateString()}</Box>
                                </Stack>

                                <Stack direction="row" justifyContent="space-between">
                                    <Box>interval</Box>
                                    <Box>{learning.intervalDays}</Box>
                                </Stack>
                            </Stack>
                            <Button onClick={handleResetAccuracy}>
                                学習データをリセット
                            </Button>
                        </Paper>
                    }
                </Stack>
            </DialogContent>
            
            <DialogActions>
                { onViewProblem && <Button onClick={onViewProblem}>問題を見る</Button>} 
                <Button onClick={handleCancel}>閉じる</Button>
            </DialogActions>
        </Dialog>
    )

}