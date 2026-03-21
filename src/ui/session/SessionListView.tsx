import type { SolvedResult } from "@/domain/learning/entity/Learning"
import type { ProblemId } from "@/domain/problem/entity/Problem"
import type { SessionId } from "@/domain/session/entity/Session"
import { formatSolvedResult } from "@/ui/stats/components/LearningHistory"
import { useLearningEventStore } from "@/ui/store/useLearningEventStore"
import { useProblemStore } from "@/ui/store/useProblemStore"
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from "@mui/material"
import { useNavigate } from "react-router-dom"

export function SessionListView(props: {
    ids: ProblemId[]
    onSelect: (id: ProblemId) => void
    selectedId: ProblemId
    sessionId: SessionId
}) {
    const navigate = useNavigate()
    const byId = useProblemStore(s => s.byId)
    const events = useLearningEventStore(s => s.eventLog)

    const sessionEvents = events.filter(ev => (ev.type === "reviewed" || ev.type === "cancel") &&
        (ev.sessionId === props.sessionId)).sort((a, b) => a.at < b.at ? 1 : -1)
    const records: Record<ProblemId, SolvedResult | undefined> = {}
    sessionEvents.map(event => {
        switch (event.type) {
            case "reviewed":
                records[event.problemId] = event.solvedResult
                break
            case "cancel":
                const target = sessionEvents.find(e => e.id === event.targetEventId)
                if (target && target.type === "reviewed") {
                    records[target.problemId] = undefined
                }
                break
        }
    })

    return (
        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
            <List>
                {props.ids.map((id, i) => {
                    const problem = byId[id]
                    const solvedResult = records[id]

                    return (
                        <ListItem
                            sx={{ borderBottom: 1, borderColor: "divider", px: 1, py: 0 }}
                        >
                            <ListItemButton
                                onClick={() => props.onSelect(id)}
                                selected={props.selectedId === id}
                            >
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                    {i + 1}.
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Stack direction="row" justifyContent="space-between">
                                            {problem.title}
                                        </Stack>
                                    }
                                    secondary={
                                        solvedResult && <Stack direction={"row"}>
                                            {formatSolvedResult(solvedResult)}
                                        </Stack>
                                    }

                                />
                            </ListItemButton>
                        </ListItem>

                    )
                })}                
            </List>
        </Box>
    )
}