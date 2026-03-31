import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from "@mui/material"

import type { ProblemId } from "@/domain/problem/entity/Problem"
import type { SessionId } from "@/domain/session/entity/Session"
import { formatSolvedResult } from "@/ui/history/ReviewEventHistory"
import { useProblemStore } from "@/ui/store/useProblemStore"
import { useReviewEventStore } from "@/ui/store/useReviewEventStore"
import type { ReviewEvent } from "@/domain/review/ReviewEvent"
import type { SolvedResult } from "@/domain/review/solvedResult"

export default function SessionListView(props: {
    ids: ProblemId[]
    onSelect: (index: number) => void
    selectedId: ProblemId
    //sessionId: SessionId
    solvedResultMap: Record<ProblemId, SolvedResult>
}) {
    const byId = useProblemStore(s => s.byId)    
    const eventLog = useReviewEventStore(s=>s.eventLog)
    //const sessionEvents = eventLog.filter(s=>s.type==="reviewed").filter(s=>s.sessionId === props.sessionId)
    //console.log(sessionEvents)    
    //const solvedResultMap = getSolvedResultsBySession(eventLog, props.sessionId)

    return (
        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
            <List>
                {props.ids.map((id, i) => {
                    const problem = byId[id]
                    //const solvedResult: SolvedResult | undefined = props.results[id]
                    //const solvedResult = sessionEvents.find(e=>e.problemId===id)?.solvedResult                    
                    const res = props.solvedResultMap[id]
                    const resultString = res ? formatSolvedResult(res) : ""

                    return (
                        <ListItem key={i}
                            sx={{ borderBottom: 1, borderColor: "divider", px: 1, py: 0 }}>
                            <ListItemButton
                                onClick={() => props.onSelect(i)}
                                selected={props.selectedId === id}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                    {i + 1}.
                                </ListItemIcon>
                                <ListItemText
                                    primary={problem.title}
                                    secondary={resultString}
                                />
                            </ListItemButton>
                        </ListItem>
                    )
                })}                
            </List>
        </Box>
    )
}

