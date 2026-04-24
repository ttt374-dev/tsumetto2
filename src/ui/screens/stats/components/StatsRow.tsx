import { TableCell, TableRow } from "@mui/material";
import type { StatsSummary } from "@/domain/learning/entity/StatsSummary";

export type StatsRowValues = {
    label: string
    stats: StatsSummary
}

function toStatsSummaryViewData(stats: StatsSummary){
    const totalCount = stats.attemptCount
    return {
        problemCount: stats.problemCount,
        avgScore: totalCount > 0 ? stats.avgScore.toFixed(1) : "-",
        avgEaseFactor: totalCount > 0 ? stats.avgEaseFactor.toFixed(2) : "-",
        completeRatio: totalCount > 0 ? `${((1 - stats.overdueCount / stats.problemCount) * 100).toFixed(0)}%` : "-"        
    }
}
export function StatsRow(props: {
    label: string
    stats: StatsSummary
}) {
    const vd = toStatsSummaryViewData(props.stats)
    const width = 60
    const data = [vd.problemCount, vd.avgScore, vd.avgEaseFactor, vd.completeRatio]
    return (
        <TableRow>
            <TableCell sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
            }}>
                {props.label}
            </TableCell>

            { data.map(d=>(
                <TableCell align="right" sx={{ width: width }}>{d}</TableCell>    
            ))}            
        </TableRow>
    )
}
//////////
// helpers
function formatPercentage(value: number) {
    return `${(value * 100).toFixed(0)}%`
}
