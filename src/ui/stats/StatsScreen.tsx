import { Box, List, ListItem, Stack } from "@mui/material";
import { AppShell } from "../common/components/layout/AppShell";
import { IntervalDaysStats } from "./components/IntervalDaysStats";
import { OverdueStats } from "./components/OverdueStats";
import { ProblemStatsTable } from "./components/ProblemStatsTable";
import { useLearningEventStore } from "../store/useLearningEventStore";
import { useProblemStore } from "../store/useProblemStore";
import type { JSX } from "react";
import type { LearningEvent, LearningEventType } from "@/domain/learning/entity/LearningEvent";

function ListEventItem(props: {
    event: LearningEvent
}){
    const byId = useProblemStore(s=>s.byId)
    let content: string
    switch (props.event.type) {
        case "reviewed": content = `${props.event.quality} ${byId[props.event.problemId].title} in ${props.event.sec}s`; break
        case "cancel":  content = props.event.targetEventId.slice(0, 4); break
        case "reset": content = byId[props.event.problemId].title ; break
    }
    console.log("event", props.event)
    return (
        <Stack direction="row" spacing={2}>
            <Box>{new Date(props.event.at).toLocaleString()}</Box>
            <Box>[{props.event.id?.slice(0, 4)}]</Box>
            <Box>{ content }</Box>
        </Stack>
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
        <List>
            { events.map((event)=>
                (
                    <ListItem key={event.id}>
                        <ListEventItem event={event}/> 
                    </ListItem>
                )
            )}
            
        </List>
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