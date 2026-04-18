import {
    Table, TableBody, TableCell, TableHead, TableRow,
    Paper, Typography, Stack, Box
} from "@mui/material"
import { useMemo } from "react"

import type { ProblemId } from "@/domain/problem/entity/Problem"
import { useLearningRecordStore } from "@/ui/features/learning/hooks/useLearningRecordStore"
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore"
import type { LearningState } from "@/domain/learning/entity/LearningState"

type HistogramItem = {
    //label: string
    count: number
    //overdue: boolean
    bin: HistogramBin
}

type HistogramBin = { 
    label: string,
    min: number,
    max: number,
}
function createBins(): HistogramBin[] {
    return [
        { label: "30日以上遅れ", min: 31, max: Infinity },
        { label: "15-30日遅れ", min: 15, max: 30 },
        { label: "8-14日遅れ", min: 8, max: 14 },
        { label: "4-7日遅れ", min: 4, max: 7 },
        { label: "1-3日遅れ", min: 1, max: 3 },

        { label: "今日期限", min: -0, max: 0 },
        { label: "1-3日後", min: -3, max: -1 },
        { label: "4-7日後", min: -7, max: -4 },
        { label: "8日以上先", min: -Infinity, max: -8 },        
    ]
}
function calcDiffDays(vA: number, vB: number){
    return  Math.floor((vA - vB) / (1000 * 60 * 60 * 24))
}
function buildOverdueHistogram(
    ids: ProblemId[],
    learningRecords: Record<ProblemId, LearningState>
): HistogramItem[] {
    const now = new Date()
    const bins = createBins()
    const items: HistogramItem[] = bins.map(b => ({
        label: b.label,
        count: 0,
        overdue: b.min > 0,
        bin: b,
    }))

    let noDueDate = 0

    ids.forEach(id => {
        const record = learningRecords[id]
        if (!record) { noDueDate++; return }
        
        const diffDays = calcDiffDays(now.getTime(), record.schedulingState.nextReviewedAt)
        const binIndex = bins.findIndex(
            b => diffDays >= b.min && diffDays <= b.max
        )
        if (binIndex !== -1) {
            items[binIndex].count++
        }
    })
    const noDueDateBin = { label: "期限未設定", min: -Infinity, max: -Infinity}
    return [
        ...items,
        { count: noDueDate, bin:  noDueDateBin },
    ]
}


export function OverdueHistogram({data}: {
    data: HistogramItem[]
}) {
    const filtered = data.filter(d => d.count > 0)

    if (filtered.length === 0) {
        return <Typography>No data available</Typography>
    }

    const max = Math.max(...filtered.map(d => d.count), 1)

    return (
        <Paper sx={{ p: 2 }}>
            <Stack spacing={1.5}>
                {filtered.map(item => {
                    const widthPercent = (item.count / max) * 100

                    return (
                        <Box key={item.bin.label}>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                sx={{ mb: 0.5 }}
                            >
                                <Typography variant="body2">
                                    {item.bin.label}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 600 }}
                                >
                                    {item.count}
                                </Typography>
                            </Stack>

                            <Box
                                sx={{
                                    height: 10,
                                    backgroundColor: "grey.200",
                                    borderRadius: 5,
                                    overflow: "hidden",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: `${widthPercent}%`,
                                        height: "100%",
                                        backgroundColor: item.bin.min > 0 ? "warning.main" : "primary.main",
                                        transition: "width 0.4s ease",
                                    }}
                                />
                            </Box>
                        </Box>
                    )
                })}
            </Stack>
        </Paper>
    )
}
export function OverdueStats() {
    const ids = useProblemStore(s => s.activeProblems).map(p => p.id)
    const learningRecords = useLearningRecordStore(s => s.stateRecords)
    /*
    const overdueItems = useMemo(
        () => getOverdueItems(ids, learningRecords),
        [ids, learningRecords]
    )*/

    const histogram = useMemo(
        () => buildOverdueHistogram(ids, learningRecords)
            //.filter(h => h.label !== "期限内" && h.label !== "期限未設定")
            ,
        [ids, learningRecords]
    )

    return (
        <Paper>
            レビュー期限
            <OverdueHistogram data={histogram} />

        </Paper>
    )
}
/*
type OverdueItem = {
    id: ProblemId
    overdueDays: number
    dueDate: Date
}

////////////////////////////
function getOverdueItems(
    ids: ProblemId[],
    learningRecords: Record<ProblemId, LearningState>
): OverdueItem[] {
    const now = new Date()

    return ids
        .map(id => {
            const record = learningRecords[id]
            if (!record?.schedulingState.nextReviewedAt) return null

            const diffDays = Math.floor(
                (now.getTime() - new Date(record.schedulingState.nextReviewedAt).getTime()) /
                (1000 * 60 * 60 * 24)
            )

            if (diffDays <= 0) return null

            return {
                id,
                overdueDays: diffDays,
                dueDate: new Date(record.schedulingState.nextReviewedAt),
            }
        })
        .filter((v): v is OverdueItem => v !== null)
        .sort((a, b) => b.overdueDays - a.overdueDays) // 遅い順
}

type Props = {
    items: OverdueItem[]
}

export function OverdueTable({ items }: Props) {
    if (items.length === 0) {
        return <Typography>🎉 期限超過はありません</Typography>
    }

    return (
        <Paper sx={{ overflow: "auto" }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Problem</TableCell>
                        <TableCell align="right">遅延日数</TableCell>
                        <TableCell align="right">期限</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map(item => (
                        <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell align="right">
                                {item.overdueDays} 日
                            </TableCell>
                            <TableCell align="right">
                                {item.dueDate.toLocaleDateString()}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    )
}*/