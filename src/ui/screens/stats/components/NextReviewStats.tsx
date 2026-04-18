import { Paper, Typography, Stack, Box} from "@mui/material"
import { useMemo } from "react"

import type { ProblemId } from "@/domain/problem/entity/Problem"
import { useLearningRecordStore } from "@/ui/features/learning/hooks/useLearningRecordStore"
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore"
import type { LearningState } from "@/domain/learning/entity/LearningState"

type HistogramItem = {
    count: number
    bin: HistogramBin
}

type HistogramBin = { 
    label: string,
    min: number,
    max: number,
}
function createBinsFromEdges(edges: number[]): HistogramBin[] {
    return edges.slice(0, -1).map((min, i) => {
        const max = edges[i + 1]
        return {
            min,
            max,
            label: formatLabel(min, max),
        }
    })
}

function formatLabel(min: number, max: number): string {
    if (min === -Infinity) return `${max}日以上先`
    if (max === Infinity) return `${min}日以上遅れ`

    if (max <= 0) return `${Math.abs(max)}-${Math.abs(min)}日後`
    if (min >= 0) return `${min}-${max}日遅れ`

    return "今日期限"
}
function calcDiffDays(vA: number, vB: number) {
    const a = new Date(vA)
    const b = new Date(vB)
    a.setHours(0, 0, 0, 0)
    b.setHours(0, 0, 0, 0)
    return Math.floor((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24))
}
function buildNextReviewHistogram(
    ids: ProblemId[],
    learningRecords: Record<ProblemId, LearningState>
): HistogramItem[] {
    const now = new Date()
    const edges = [-Infinity, -31, -15, -8, -4, -1, 0, 1, 4, 8, 15, 31, Infinity]
    const bins = createBinsFromEdges(edges)
    const items: HistogramItem[] = bins.map(b => ({
        count: 0,
        bin: b,
    }))

    //let noDueDate = 0

    ids.forEach(id => {
        const record = learningRecords[id]
        if (!record) return
        
        const diffDays = calcDiffDays(record.schedulingState.nextReviewedAt, now.getTime())
        const binIndex = bins.findIndex(
            b => diffDays >= b.min && diffDays <= b.max
        )
        console.log("binindex", binIndex, record)
        if (binIndex !== -1) {
            items[binIndex].count++
        }
    })
    console.log("hist", items, ids)
    //const noDueDateBin = { label: "期限未設定", min: -Infinity, max: -Infinity}
    return [
        ...items,
        //{ count: noDueDate, bin:  noDueDateBin },
    ]
}

export function NextReviewHistogram({data}: {
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
export function NextReviewStats() {
    const ids = useProblemStore(s => s.activeProblems).map(p => p.id)
    const learningRecords = useLearningRecordStore(s => s.stateRecords)    

    const histogram = useMemo(
        () => buildNextReviewHistogram(ids, learningRecords),
        [ids, learningRecords]
    )
    const unanswered = ids.filter(id=>learningRecords[id] === undefined).length
    return (
        <Paper>
            レビュー期限
            <NextReviewHistogram data={histogram} />
            未解答：{unanswered}
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