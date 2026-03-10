import { Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material"
import { Paper } from "@mui/material";
import type { LearningEvent } from "@/domain/learning/entity/LearningEvent";
import { useProblemStore } from "@/ui/store/useProblemStore";
import { useLearningEventStore } from "@/ui/store/useLearningEventStore";

function EventItemRow(props: {
    event: LearningEvent
}){
    const byId = useProblemStore(s=>s.byId)
    let content: string

    switch (props.event.type) {
        case "reviewed": 
            const resText = props.event.solvedResult.outcome === "solved" ? "正解" : "誤答"
            const mistakesString = props.event.solvedResult.outcome === "failed" ? `(${props.event.solvedResult.mistakes}:${props.event.solvedResult.answerShown})` : ""
            content = `${resText}： ${byId[props.event.problemId].title}${mistakesString} (${props.event.solvedResult.elapsedSec}s)`; 
            break
        case "cancel":  content = `キャンセル： #${props.event.targetEventId.slice(0, 4)}`; break
        case "reset": content = `リセット：${byId[props.event.problemId].title}` ; break
    }
    console.log("event", props.event)    
    return (
        <TableRow>
            <TableCell>{new Date(props.event.at).toLocaleString()}</TableCell>
            <TableCell>{ content }</TableCell>
        </TableRow>
    )
}
export function LearningHistory(){
    const allevents = useLearningEventStore(s=>s.eventLog)
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
