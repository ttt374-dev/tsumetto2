import { Box, Button, Paper, Stack } from '@mui/material';

import type { LearningState } from '@/domain/learning/entity/LearningState';
import { learningStateLabels, toLearningStateViewData } from '@/ui/features/learning/hooks/learningPresenter';

export function LearningDetailPanel( { learningState, onResetLearning} : {
    learningState: LearningState
    onResetLearning: () => void
}) {
    const vm = toLearningStateViewData(learningState)
    console.log("vm", vm, learningState)
    return (<Paper sx={{ p: 1 }}>
        <Stack>
            <Stack direction="row" justifyContent="space-between">
                <Box>{ learningStateLabels["masteryStatus"]}</Box>
                <Box>{vm.masteryStatus}</Box>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
                <Box>{ learningStateLabels["score"]}</Box>
                <Box>{vm.score}</Box>
            </Stack>
            {learningState.lastEvent &&
                <Stack direction="row" justifyContent="space-between">
                    <Box>{ learningStateLabels["lastAnsweredAt"]}</Box>
                    <Box>{vm.lastAnsweredAt}</Box>
                </Stack>
            }

            <Stack direction="row" justifyContent="space-between">
                <Box>{ learningStateLabels["nextReviewedAt"]}</Box>
                <Box>{vm.nextReviewedAt}</Box>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
                <Box>{ learningStateLabels["intervalDays"]}</Box>
                <Box>{ vm.intervalDays}</Box>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
                <Box>{ learningStateLabels["easeFactor"]}</Box>
                <Box>{vm.easeFactor}</Box>
            </Stack>
        </Stack>
        <Stack direction="row" justifyContent="flex-end">
            <Button onClick={onResetLearning} variant='outlined'>
                学習データをリセット
            </Button>
        </Stack>
    </Paper>)
}