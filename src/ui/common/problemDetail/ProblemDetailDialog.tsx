import { Divider, IconButton, Paper, Stack, TextField } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Button } from "@mui/material"

import { Problem, type ProblemId } from "@/domain/problem/Problem";
import { useEffect, useState } from 'react';
import { useProblemStore } from '@/application/store/useProblemStore';
import { EditableText } from '../components/EditableText';
import { ProblemTagEditor } from '../components/ProblemTagEditor';
import { StarToggleButton } from '../components/StarToggleButton';
import { useLearningRecordStore } from '@/application/useLearningRecordStore';

type Props = {
    open: boolean
    problemId: ProblemId
    onClose: () => void
    onViewProblem?: ()=>void
}
export function problemDetailDialogVM(
    problemId: ProblemId,
    open: boolean,
    onClose: () => void
) {
    const problem = useProblemStore(s => s.byId[problemId])
    const updateProblem = useProblemStore(s => s.updateProblem)
    const deleteProblems = useProblemStore(s => s.deleteProblems)
    const allTags = useProblemStore(s => s.allTags)

    const learning = useLearningRecordStore(
        s => problem ? s.records[problem.id] : undefined
    )

    const [title, setTitle] = useState("")
    const [tags, setTags] = useState<string[]>([])

    useEffect(() => {
        if (open && problem) {
            setTitle(problem.title)
            setTags(problem.tags ?? [])
        }
    }, [open, problem])

    const handleDelete = () => {
        if (!problem) return
        if (!window.confirm("本当に削除しますか？")) return
        deleteProblems([problem.id])
        onClose()
    }

    const handleSave = async () => {
        if (!problem) return
        await updateProblem(problem.setTitle(title).setTags(tags))
        onClose()
    }

    return {
        problem,
        learning,
        title,
        tags,
        setTitle,
        setTags,
        allTags,
        handleDelete,
        handleSave,
    }
}

export default function ProblemDetailDialog({ open, problemId, onClose}: Props) {    
    const problem = useProblemStore(p=>p.byId[problemId])
    const learningRecords = useLearningRecordStore(s=>s.records)
    const learning = learningRecords[problem.id]
    const updateProblem = useProblemStore(s=>s.updateProblem)
    const deleteProblems = useProblemStore(s=>s.deleteProblems)
    
    // タイトル
    const [title, setTitle] = useState(problem.title)
    const handleUpdateTitle = (newTitle: string) => {
        console.log("set title", newTitle)
        setTitle(newTitle)
    }
    // タグ
    const [tags, setTags] = useState<string[]>(
        () => problem?.tags ? [...problem.tags] : []
    )
        useEffect(() => {
        if (open && problem) {
            setTags(problem.tags as string[] ?? [])
        }
    }, [open, problem?.tags])

    const allTags: string[] = useProblemStore(s=>s.allTags)     
    const [starred, setStarred] = useState(problem.starred)

    // handlers
    const handleDelete = () => {
        if (!window.confirm("本当に削除しますか？")) return
        //onDelete()
        deleteProblems([problem.id])
        onClose()
    }
    const handleSaveExit = async () => {
        console.log("save exit", title, tags)
        await updateProblem(problem.setTitle(title).setTags(tags).setStar(starred))
        onClose()
    }
    const handleCancel = () => {      
        onClose()
    }
    const handleResetAccuracy = () => {
        if (!window.confirm("本当に正答データをリセットしますか？")) return
        //onResetLearning()             
        alert("TBD")
    }    
    if (!problem) return null
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
                            //updateProblem(problem.setTitle(title))
                            handleUpdateTitle(title)
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
                            //updateProblem(problem.setTags(tags))
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
                                    <StarToggleButton starred={starred}
                                        onToggle={() => setStarred(!starred)}
                                    />
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
                <Button color="error" onClick={handleDelete}>削除</Button>
                { /* onViewProblem && <Button onClick={onViewProblem}>問題を見る</Button> */} 
                <Button color="success" onClick={handleSaveExit}>保存して戻る</Button>
                <Button onClick={handleCancel}>キャンセル</Button>
            </DialogActions>
        </Dialog>
    )

}