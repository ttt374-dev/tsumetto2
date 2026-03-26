import type { SolvedResult } from "@/domain/learning/entity/Learning"
import type { ProblemId } from "@/domain/problem/entity/Problem"
import type { SessionId } from "@/domain/session/entity/Session"
import { formatSolvedResult } from "@/ui/history/ReviewEventHistory"
import { useProblemStore } from "@/ui/store/useProblemStore"
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from "@mui/material"

export function SessionListView(props: {
    ids: ProblemId[]
    onSelect: (id: ProblemId) => void
    selectedId: ProblemId
    sessionId: SessionId
    results: Record<ProblemId, SolvedResult>
}) {
    const byId = useProblemStore(s => s.byId)    
    return (
        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
            <List>
                {props.ids.map((id, i) => {
                    const problem = byId[id]
                    const solvedResult: SolvedResult | undefined = props.results[id]
                    const resultString = solvedResult ? formatSolvedResult(solvedResult) : ""

                    return (
                        <ListItem
                            sx={{ borderBottom: 1, borderColor: "divider", px: 1, py: 0 }}>
                            <ListItemButton
                                onClick={() => props.onSelect(id)}
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