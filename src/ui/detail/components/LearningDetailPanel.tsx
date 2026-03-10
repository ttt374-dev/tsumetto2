import { Divider, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Stack, TextField } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Button } from "@mui/material"
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DeleteIcon from '@mui/icons-material/Delete';
import type { Learning } from '@/domain/learning/entity/Learning';

export function LearningDetailPanel( { learning, onResetLearning} : {
    learning: Learning
    onResetLearning: () => void
}) {
    return (<Paper sx={{ p: 1 }}>
        <Stack>
            <Stack direction="row" justifyContent="space-between">
                <Box>正答率（正答：誤答）</Box>
                <Box>{(learning.accuracy * 100).toFixed(0)}%({learning.solvedCount}:{learning.failedCount})</Box>
            </Stack>


            {learning.lastAnswerResult &&
                <Stack direction="row" justifyContent="space-between">
                    <Box>前回結果</Box>
                    <Box>
                        間違い回数：{learning.lastAnswerResult.mistakes} / 
                        答え照合：{learning.lastAnswerResult.revealed}
                    </Box>
                </Stack>
            }
            {learning.lastAnsweredAt &&
                <Stack direction="row" justifyContent="space-between">
                    <Box>前回解答日</Box>
                    <Box>{new Date(learning.lastAnsweredAt).toLocaleString()}</Box>
                </Stack>
            }

            {learning.nextReviewedAt && <Stack direction="row" justifyContent="space-between">
                <Box>次回レビュー日</Box>
                <Box>{new Date(learning.nextReviewedAt).toLocaleString()}</Box>
            </Stack>}

            <Stack direction="row" justifyContent="space-between">
                <Box>Ease Factor</Box>
                <Box>{learning.easeFactor.toFixed(2)}</Box>
            </Stack>
        </Stack>
        <Stack direction="row" justifyContent="flex-end">
            <Button onClick={onResetLearning} variant='outlined'>
                学習データをリセット
            </Button>
        </Stack>
    </Paper>)
}