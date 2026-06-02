import { Paper, Typography, Stack, Box} from "@mui/material"
import { useMemo } from "react"

import type { ProblemId } from "@/domain/problem/entity/Problem"
import { useLearningRecordStore } from "@/ui/features/learning/hooks/useLearningRecordStore"
import type { LearningState } from "@/domain/learning/entity/LearningState"
import { useNavigate } from "react-router-dom"
import { paths } from "@/router/paths"
import { useQueryActiveProblems } from "@/ui/features/problem/hooks/useQueryActiveProblems"

type HistogramItem = {
    //count: number
    bin: HistogramBin
    ids: ProblemId[]
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
    if (min === -Infinity) return `${Math.abs(max)}日以上遅れ`
    if (max === Infinity) return `${min}日以上先`
    if (min === 0 && max === 1) return "今日"

    if (max <= 0) return `${Math.abs(max)}-${Math.abs(min) - 1}日遅れ`
    if (min >= 0) return `${min}-${max - 1}日後`

    return ""
}
function calcDiffDays(vA: number, vB: number) {
    //return (vA - vB) / (1000 * 60 * 60 * 24)
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
    const edges = [-Infinity, -31, -15, -8, 0, 1, 8, 15, 31, Infinity]
    const bins = createBinsFromEdges(edges)
    const items: HistogramItem[] = bins.map(b => ({
        //count: 0,
        bin: b,
        ids: []
    }))

    ids.forEach(id => {
        const record = learningRecords[id]
        if (!record) return
        
        const diffDays = calcDiffDays(record.schedulingState.nextReviewedAt, now.getTime())
        const binIndex = bins.findIndex(
            //b => diffDays >= b.min && diffDays <= b.max
            b => diffDays >= b.min && diffDays < b.max
        )
        if (binIndex !== -1) {
            //items[binIndex].count++
            items[binIndex].ids.push(id)
        }
    })
    return items
}

export function NextReviewHistogram({data}: {
    data: HistogramItem[]
}) {
    const filtered = data.filter(d => d.ids.length > 0).sort((a, b) => a.bin.min - b.bin.min)
    const navigate = useNavigate()

    if (filtered.length === 0) {
        return <Typography>No data available</Typography>
    }

    const max = Math.max(...filtered.map(d => d.ids.length), 1)    
    const handleClick = (ids: ProblemId[]) => {
        navigate(paths.list, { state: { ids: ids }})
    }
    

    return (
        <Paper sx={{ p: 2 }}>
            <Stack spacing={1.5}>
                {filtered.map(item => {
                    const widthPercent = (item.ids.length / max) * 100

                    return (
                        <Box key={`${item.bin.min}-${item.bin.max}`} 
                            onClick={()=>handleClick(item.ids)}>
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
                                    {item.ids.length}
                                </Typography>
                            </Stack>

                            <HistogramPercentBar percent={widthPercent} 
                                overdue={item.bin.max <= 0}/>
                        </Box>
                    )
                })}
            </Stack>
        </Paper>
    )
}
function HistogramPercentBar({ percent, overdue} : { percent: number, overdue: boolean}){
    return (<Box
        sx={{
            height: 10,
            backgroundColor: "grey.200",
            borderRadius: 5,
            overflow: "hidden",
        }}
    >
        <Box
            sx={{
                width: `${percent}%`,
                height: "100%",
                backgroundColor: overdue ? "warning.main" : "primary.main",
                transition: "width 0.4s ease",
            }}
        />
    </Box>)
}
export function NextReviewStats() {
    const problems = useQueryActiveProblems({
        sortKey: "nextReviewedAt", sortOrder: "asc", excludeReferenceOnly: true})
    const ids = problems.map(p=>p.id)
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

