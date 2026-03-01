import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material"
import { Box, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { ProblemStats } from "@/domain/problem/valueObject/ProblemStats";
import { act, useMemo, useState } from "react";

function formatPercentage(value: number) {
    return `${(value * 100).toFixed(0)}%`
}
function StatsRow(props: {
    label: string
    stats: ProblemStats
}) {
    const totalCount = props.stats.problemCount
    const accuracy = totalCount > 0 ? formatPercentage(props.stats.accuracy) : "-"
    const easeFactor = totalCount > 0 ? props.stats.easeFactor.toFixed(2) : "-"
    const intervalDays = totalCount > 0 ? props.stats.intervalDays.toFixed(0) : "-"

    return (
        <TableRow>
            <TableCell   sx={{
    
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  }}>
                {props.label}
            </TableCell>

            <TableCell align="right" sx={{ width: 60 }}>{totalCount}</TableCell>
            <TableCell align="right" sx={{ width: 60 }}>{accuracy}</TableCell>
            <TableCell align="right" sx={{ width: 60 }}>{easeFactor}</TableCell>
            <TableCell align="right" sx={{ width: 60 }}>{intervalDays}</TableCell>
        </TableRow>
    )
}
export type StatsRowValues = {
    label: string
    stats: ProblemStats,
}

type Group = {
    groupName: string
    rows: StatsRowValues[]
}
export function GroupedTable({ groups, columns }: {
    groups: Group[]    
    columns: string[]
}) {
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
        "総合": true,
    })

    const toggle = (groupName: string) => {
        setOpenGroups(prev => ({
            ...prev,
            [groupName]: !prev[groupName]
        }))
    }

    return (
        <TableContainer component={Paper}>
            <Table size="small" sx={{
                "& td, & th": { py: 0.5 },
                fontSize: 14
            }}>
                <TableHead>
                    <TableRow>
                        <TableCell>分類</TableCell>
                        { columns.map(col=>
                            <TableCell align="right" sx={{ width: 60 }}>{col}</TableCell>    
                        )}
                        
                    </TableRow>
                </TableHead>

                <TableBody>
                    {groups.map(group => {
                        const open = openGroups[group.groupName]

                        return (
                            <>
                                {/* グループ行 */}
                                <TableRow key={group.groupName}>
                                    <TableCell
                                        colSpan={5}
                                        onClick={() => toggle(group.groupName)}
                                        sx={{
                                            cursor: "pointer",
                                            fontWeight: 600,
                                            userSelect: "none",
                                            py: 1,
                                        }}
                                    >
                                        <Box display="flex" alignItems="center" justifyContent="space-between">
                                            {group.groupName}

                                            {open ? (
                                                <KeyboardArrowDown fontSize="small" />
                                            ) : (
                                                <KeyboardArrowRight fontSize="small" />
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                                {/* 子行 */}
                                {open &&
                                    group.rows.map(row => (
                                        <StatsRow label={row.label} stats={row.stats} />
                                    ))}
                            </>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}