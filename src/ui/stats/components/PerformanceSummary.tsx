import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

import { useReviewEventStore } from "@/ui/domains/learning/hooks/useReviewEventStore"
import type { ReviewEvent } from "@/domain/review/ReviewEvent";
import { projectLearningState } from "@/domain/learning/service/projectLearningState";

function calcAverageScore(events: ReviewEvent[]): number { 
    if (events.length === 0) return 0;   
    const records = projectLearningState(events)
    return Object.values(records).reduce((sum, e) => sum + e.score, 0) / events.length
}

export default function PerformaceSummary(){
    const events = useReviewEventStore(s=>s.eventLog)
    const start = new Date()
    start.setHours(0, 0, 0, 0)   
        

    const todayEvents = events.filter(e=>e.type==="reviewed").filter(e=>new Date(e.at) >= start)      
    const performanceMap: Record<string, {num: number, score: number }> = {}
    performanceMap["today"] = { 
        num: todayEvents.length, 
        score: calcAverageScore(todayEvents)
    }      
    // 昨日
    const ydayStart = new Date(start.getTime() - 24 * 60 * 60 * 1000);
    const ydayEvents = events.filter(e=>e.type==="reviewed").filter(e=>new Date(e.at) >= ydayStart && new Date(e.at) < start)      
    performanceMap["yday"] = { 
        num: ydayEvents.length, 
        score: calcAverageScore(ydayEvents)
    }
    // 今週
    const thisWeekStart = new Date(start.getTime() - 24 * 60 * 60 * 1000 * 7);
    const thisWeekEvents = events.filter(e=>e.type==="reviewed").filter(e=>new Date(e.at) >= thisWeekStart)      
    performanceMap["thisWeek"] = { 
        num: thisWeekEvents.length, 
        score: calcAverageScore(thisWeekEvents)
    }
    return (
        <>
        <Box>
            パフォーマンス・summary
        </Box>
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>項目</TableCell>
                        <TableCell>問題数</TableCell>
                        <TableCell>スコア</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            今日
                        </TableCell>
                        <TableCell>
                            {performanceMap["today"].num}
                        </TableCell>                        
                        <TableCell>
                            {performanceMap["today"].score.toFixed(1) }
                        </TableCell>                        
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            昨日
                        </TableCell>
                        <TableCell>
                            {performanceMap["yday"].num}
                        </TableCell>                        
                        <TableCell>
                            {performanceMap["yday"].score.toFixed(1) }
                        </TableCell>                        
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            今週
                        </TableCell>
                        <TableCell>
                            {performanceMap["thisWeek"].num}
                        </TableCell>                        
                        <TableCell>
                            {performanceMap["thisWeek"].score.toFixed(1) }
                        </TableCell>                        
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
        </>
    )
}
