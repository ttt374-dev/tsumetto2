import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

import { useReviewEventStore } from "@/ui/store/useReviewEventStore"
import { projectLearning } from "@/domain/learning/service/projectionLearning";

export default function TodaysPerformace(){
    const events = useReviewEventStore(s=>s.eventLog)
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    const todayEvents = events.filter(e=>e.type==="reviewed").filter(e=>new Date(e.at) >= start)

    const records = projectLearning(todayEvents)

    const num = Object.values(records).length
    const score =
      Object.values(records).reduce((sum, e) => sum + e.score, 0) / todayEvents.length

    console.log("records", records, score, num)
 
    return (
        <>
        <Box>
            本日のパフォーマンス
        </Box>
        <TableContainer component={Paper}>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            解いた問題数
                        </TableCell>
                        <TableCell>
                            {num}
                        </TableCell>                        
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            平均スコア
                        </TableCell>
                        <TableCell>
                            {score.toFixed(1) }
                        </TableCell>                        
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
        </>
    )
}
