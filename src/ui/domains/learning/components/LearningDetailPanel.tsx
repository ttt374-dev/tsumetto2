import { Box, Button, Paper, Stack } from '@mui/material';

import type { LearningState } from '@/domain/learning/entity/LearningState';
import { toLearningStateViewData } from '@/ui/domains/learning/hooks/learningPresenter';

export function LearningDetailPanel( { learningState, onResetLearning} : {
    learningState: LearningState
    onResetLearning: () => void
}) {
    const vm = toLearningStateViewData(learningState)
    return (<Paper sx={{ p: 1 }}>
        <Stack>
            <Stack direction="row" justifyContent="space-between">
                <Box>平均スコア</Box>
                <Box>{vm.scoreText}</Box>
            </Stack>
            {learningState.lastAnsweredAt &&
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
                <Box>{learningState.intervalDays}</Box>
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