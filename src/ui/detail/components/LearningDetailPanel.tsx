import { Box, Button, Paper, Stack } from '@mui/material';

import type { Learning } from '@/domain/learning/entity/Learning';
import { toLearningViewData } from '@/ui/domains/learning/learningPresenter';

export function LearningDetailPanel( { learning, onResetLearning} : {
    learning: Learning
    onResetLearning: () => void
}) {
    const vm = toLearningViewData(learning)
    return (<Paper sx={{ p: 1 }}>
        <Stack>
            <Stack direction="row" justifyContent="space-between">
                <Box>平均スコア</Box>
                <Box>{learning.score.toFixed(1)}</Box>
            </Stack>
            {learning.lastAnswerResult &&
                <Stack direction="row" justifyContent="space-between">
                    <Box>前回結果</Box>
                    <Box>
                        間違い回数：{learning.lastAnswerResult.mistakes} / 
                        答え照合：{learning.lastAnswerResult.isRevealed}
                    </Box>
                </Stack>
            }
            {learning.lastAnsweredAt &&
                <Stack direction="row" justifyContent="space-between">
                    <Box>前回解答日</Box>
                    <Box>{vm.lastAnsweredAtText}</Box>
                </Stack>
            }

            <Stack direction="row" justifyContent="space-between">
                <Box>次回レビュー日</Box>
                <Box>{vm.nextReviewedAtText}</Box>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
                <Box>インターバル</Box>
                <Box>{learning.intervalDays}</Box>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
                <Box>Ease Factor</Box>
                <Box>{vm.easeFactorText}</Box>
            </Stack>
        </Stack>
        <Stack direction="row" justifyContent="flex-end">
            <Button onClick={onResetLearning} variant='outlined'>
                学習データをリセット
            </Button>
        </Stack>
    </Paper>)
}