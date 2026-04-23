import { TableCell, TableRow } from "@mui/material";
import { ProblemStats } from "@/domain/problem/valueObject/ProblemStats";
import type { StatsSummary } from "@/domain/learning/entity/StatsSummary";

export type StatsRowValues = {
    label: string
    //stats: ProblemStats,
    stats: StatsSummary
}

export function StatsRow(props: {
    label: string
    //stats: ProblemStats
    stats: StatsSummary
}) {
    const problemCount = props.stats.problemCount
    const totalCount = props.stats.problemCount
    const score = totalCount > 0 ? props.stats.avgScore.toFixed(1) : "-"
    const easeFactor = totalCount > 0 ? props.stats.avgEaseFactor.toFixed(2) : "-"
    const intervalDays = totalCount > 0 ? props.stats.avgIntervalDays.toFixed(0) : "-"
    
    const width = 60
    //console.log("statsorw", props.label, props.stats)
    return (
        <TableRow>
            <TableCell sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
            }}>
                {props.label}
            </TableCell>

            <TableCell align="right" sx={{ width: width }}>{problemCount}</TableCell>
            <TableCell align="right" sx={{ width: width }}>{score}</TableCell>
            <TableCell align="right" sx={{ width: width }}>{easeFactor}</TableCell>
            <TableCell align="right" sx={{ width: width }}>{intervalDays}</TableCell>
        </TableRow>
    )
}
//////////
// helpers
function formatPercentage(value: number) {
    return `${(value * 100).toFixed(0)}%`
}
