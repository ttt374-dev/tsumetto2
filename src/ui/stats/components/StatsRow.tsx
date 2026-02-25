import { Box, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { ProblemStats } from "@/domain/problem/valueObject/ProblemStats";

export function StatsRow(props: {
    label: string
    stats: ProblemStats
}) {
    const totalCount = props.stats.totalCount
    const accuracy = totalCount > 0 ? formatPercentage(props.stats.accuracy) : "-"
    const easeFactor = totalCount > 0 ? props.stats.easeFactor.toFixed(2) : "-"
    const intervalDays = totalCount > 0 ? props.stats.intervalDays.toFixed(0) : "-"
    const width = 60
    return (
        <TableRow>
            <TableCell sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
            }}>
                {props.label}
            </TableCell>

            <TableCell align="right" sx={{ width: width }}>{totalCount}</TableCell>
            <TableCell align="right" sx={{ width: width }}>{accuracy}</TableCell>
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
