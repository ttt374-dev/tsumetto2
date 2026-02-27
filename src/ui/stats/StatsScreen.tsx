import { Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material"
import { Box, List, ListItem, Paper, Stack } from "@mui/material";
import { AppShell } from "../common/components/layout/AppShell";
import { IntervalDaysStats } from "./components/IntervalDaysStats";
import { OverdueStats } from "./components/OverdueStats";
import { ProblemStatsTable } from "./components/ProblemStatsTable";
import { useLearningEventStore } from "../store/useLearningEventStore";
import { useProblemStore } from "../store/useProblemStore";
import type { LearningEvent } from "@/domain/learning/entity/LearningEvent";

function EventItemRow(props: {
    event: LearningEvent
}){
    const byId = useProblemStore(s=>s.byId)
    let content: string
    switch (props.event.type) {
        case "reviewed": content = `${byId[props.event.problemId].title}: ${props.event.quality} ${props.event.sec}s`; break
        case "cancel":  content = `#${props.event.targetEventId.slice(0, 4)}`; break
        case "reset": content = `${byId[props.event.problemId].title}` ; break
    }
    console.log("event", props.event)    
    return (
        <TableRow>
            <TableCell>{new Date(props.event.at).toLocaleString()}</TableCell>
            <TableCell>[{props.event.id?.slice(0, 4)}]</TableCell>
            <TableCell>{ props.event.type }</TableCell>
            <TableCell>{ content }</TableCell>
        </TableRow>
    )
}
function LearningHistory(){
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
                    <TableCell>ID</TableCell>
                    <TableCell>アクション</TableCell>
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

export function StatsScreen() {
    return (
        <AppShell header={"Stats"}>
            <Box sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }}>
                <Box sx={{ flex: 1, overflowY: "auto" }}>
                    <ProblemStatsTable />
                    <IntervalDaysStats />
                    <OverdueStats />
                    <LearningHistory/>
                </Box>
            </Box>
        </AppShell>
    )
}