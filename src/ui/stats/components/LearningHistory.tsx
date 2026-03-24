import { Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material"
import { Paper } from "@mui/material";
import type { ReviewEvent, ReviewEventId } from "@/domain/review/ReviewEvent";
import { useProblemStore } from "@/ui/store/useProblemStore";
import { useReviewEventStore } from "@/ui/store/useReviewEventStore";
import type { SolvedResult } from "@/domain/learning/entity/Learning";

export function formatSolvedResult(res: SolvedResult){
    const outcome = res.outcome === "solved" ? "詰み" : res.outcome === "failed" ? "失敗" : "未回答"
    const mistakesString = res.mistakes > 0 ? `(${res.mistakes}miss)` : ""
    const revealedString = res.isRevealed ? `[解答参照]` : ""
    return `: ${outcome} ${mistakesString}${revealedString} (${res.elapsedSec}s)`

}
function EventItemRow(props: {
    event: ReviewEvent
}){
    const byId = useProblemStore(s=>s.byId)
    const eventLog = useReviewEventStore(s=>s.eventLog)

    let content: string
    
    switch (props.event.type) {
        case "reviewed": 
            const res = props.event.solvedResult
            const resText = res.outcome === "solved" ? "詰み" : "失敗"
            //const mistakesString = res.mistakes > 0 ? `(${res.mistakes}miss)` : ""
            //const revealedString = res.revealed ? `[解答参照]` : ""
            content = `${byId[props.event.problemId].title}${formatSolvedResult(res)}`; 
            break
        case "cancel": 
            const eventId = props.event.targetEventId            
            const problemId = eventLog.find(e=>e.id === eventId)?.problemId
            const title = problemId && byId[problemId]?.title
            content = `キャンセル：${title} (#${props.event.targetEventId.slice(0, 4)})`; 
            break

        case "reset": content = `リセット：${byId[props.event.problemId].title}` ; break
    }
    //console.log("event", props.event)    
    return (
        <TableRow>
            <TableCell>{new Date(props.event.at).toLocaleString()}</TableCell>
            <TableCell>{ content }</TableCell>
        </TableRow>
    )
}
export function LearningHistory(){
    const allevents = useReviewEventStore(s=>s.eventLog)
    const num = 10
    const events = allevents
        .slice() // 元配列を破壊しない
        .sort((a, b) => b.at - a.at) // atで降順
        .slice(0, num); 
        

    return (
        <Paper sx={{my: 3}}>
            最近の学習データ
            <Table size="small">
                <TableHead>
                    <TableCell>日付</TableCell>
                    <TableCell>内容</TableCell>
                </TableHead>
                <TableBody>
                {
                events.map((event) =>                    
                        <EventItemRow event={event} />                    
                )}    
                </TableBody>
            </Table>            
        </Paper>
    )
}
