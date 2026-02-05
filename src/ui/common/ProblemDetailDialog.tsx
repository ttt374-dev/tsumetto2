import { Divider, Stack, TextField } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Button } from "@mui/material"

import { Problem, type ProblemId } from "@/domain/problem/Problem";
import { useEffect, useState } from 'react';
import { useRepositoryContext } from '../App/providers/RepositoryProvider';
import { useProblemDetailDialog } from './useProblemDetailDialog';
import { useProblemStore } from '@/application/store/useProblemStore';
import { EditableText } from './EditableText';
import { ProblemTagEditor } from './ProblemTagEditor';

type Props = {
    open: boolean
    problemId: ProblemId
    //onUpdateTitle: (title: string) => void;
    onConfirm: (problemId: string) => void;
    onClose: () => void
    onDelete: () => void
    onResetLearning: () => void
    onUpdateProblem: (problem: Problem) => void
}

export default function ProblemDetailDialog({
    open,
    problemId,
    
    onClose,
    onDelete,
    onResetLearning,
    onUpdateProblem,
}: Props) {
    const repo = useRepositoryContext()
    const store = useProblemStore(repo.problem)
    const problem = store.findById(problemId)
    useEffect(() => {
        if (open && problem) {
            setTags(problem.tags ?? [])
        }
    }, [open, problem?.tags])
    

    const [tags, setTags] = useState<string[]>(problem?.tags ?? [])
    const allTags = Array.from(
        new Set(store.problems.flatMap(p => p.tags))
    )



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

    
    if (!problem) return null
    const tagsString = tags.join(" ")
    ///////////////////////////////////////////////////////
    return (
        <Dialog open={open} onClose={onClose} fullScreen
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
                    <Button onClick={handleResetAccuracy}>
                        学習データをリセット
                    </Button>                    
                    <ProblemTagEditor
                        allTags={allTags}
                        value = {tags}
                        onChange={ (tags) => {
                            setTags(tags)
                            onUpdateProblem(problem.setTags(tags))
                        }}
                    />
                    {/*
                    <Stack direction="row">
                        <TextField
                            size="small"
                            label="タグを追加"
                            value={newTag}
                            onChange={e => setNewTag(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === "Enter" && newTag.trim()) {
                                    handleAddTag(newTag)
                                }
                            }}
                        />
                        <Button
                            onClick={() => {
                                if (!newTag.trim()) return
                                handleAddTag(newTag)
                            }}
                        >
                            追加
                        </Button>
                    </Stack>*/}
                </Stack>
            </DialogContent>
            
            <DialogActions>
                
                <Button onClick={handleCancel}>閉じる</Button>
            </DialogActions>
        </Dialog>
    )

}