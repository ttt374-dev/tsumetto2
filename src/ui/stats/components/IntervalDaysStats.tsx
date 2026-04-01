import { useMemo, useState } from "react";
import { Box, Checkbox, FormControlLabel, Paper, Stack, Typography } from "@mui/material";

import type { ProblemId } from "@/domain/problem/entity/Problem";
import { useLearningRecordStore } from "@/ui/store/useLearningRecordStore";
import { useProblemStore } from "@/ui/store/useProblemStore";
import type { LearningRecord } from "@/domain/learning/entity/Learning";

type IntervalBin = {
    label: string
    min: number
    max: number
}
function createExponentialBins(boundaries: number[]): IntervalBin[] {
    const bins: IntervalBin[] = [];

    for (let i = 0; i < boundaries.length; i++) {
        const min = boundaries[i];
        let max: number;
        let label: string;

        if (i === 0) {
            // 最初の bin は「min以下」
            max = boundaries[i + 1] - 1;
            label = `${min}日以下`;
        } else if (i === boundaries.length - 1) {
            // 最後の bin は「min以上」
            max = Infinity;
            label = `${min}日以上`;
        } else {
            max = boundaries[i + 1] - 1;
            //label = min === max ? `${min}日` : `${min}-${max}日`;
            label = `${min}-${max}日`;
        }

        bins.push({ min, max, label });
    }

    return bins;
}

function buildIntervalHistogramBinned(
    ids: ProblemId[],
    learningRecords: LearningRecord,
    includeDelay: boolean = true,
) {
    const boundariesWithDelay = [-7, -3, 1, 3, 7, 14, 30, 60]
    const boundariesNoDelay = [1, 3, 7, 14, 30, 60]
    const bins = createExponentialBins(includeDelay ? boundariesWithDelay : boundariesNoDelay)

    const counts = bins.map(bin => ({
        label: bin.label,
        count: 0,
    }))

    ids.forEach(id => {
        const learning = learningRecords[id]
        if (!learning) return

        //const days = learning.intervalDays
        const days = (learning.nextReviewedAt - Date.now()) / (24*60*60*1000)

        const binIndex = bins.findIndex(
            b => days >= b.min && days <= b.max
        )

        if (binIndex !== -1) {
            counts[binIndex].count++
        }
    })

    return counts
}
type HistogramItem = {
    label: string
    count: number
}
export function IntervalHistogram({
    data,
}: {
    data: HistogramItem[]
}) {
    const max = Math.max(...data.map(d => d.count), 1)

    return (
        <Stack spacing={1}>
            {data.map(item => {
                const widthPercent = (item.count / max) * 100

                return (
                    <Box key={item.label}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            sx={{ mb: 0.5 }}
                        >
                            <Typography variant="body2">
                                {item.label}
                            </Typography>
                            <Typography variant="body2">
                                {item.count}
                            </Typography>
                        </Stack>

                        <Box
                            sx={{
                                height: 8,
                                backgroundColor: "grey.300",
                                borderRadius: 4,
                                overflow: "hidden",
                            }}
                        >
                            <Box
                                sx={{
                                    width: `${widthPercent}%`,
                                    height: "100%",
                                    backgroundColor: "primary.main",
                                }}
                            />
                        </Box>
                    </Box>
                )
            })}
        </Stack>
    )
}
//////////////////////////
export function IntervalDaysStats() {
    const activeProblems = useProblemStore(s => s.activeProblems)
    const records = useLearningRecordStore(s => s.records)
    const [includeDelay, setIncludeDelay ] = useState(true)

    const histogram = useMemo(() =>
        buildIntervalHistogramBinned(activeProblems.map(p => p.id), records, includeDelay),
        [activeProblems, records, includeDelay])

    return (
        <Paper>
            <Box>学習間隔</Box>
            
            <FormControlLabel
                control={
                    <Checkbox checked={includeDelay} onChange={()=>setIncludeDelay(s=>!s)}/>
                }
                label={"遅延も含む"}/>
            
            <Stack spacing={2} p={2}>
                <IntervalHistogram data={histogram} />
            </Stack>
        </Paper>

    )
}