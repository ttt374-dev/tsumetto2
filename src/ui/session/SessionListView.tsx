import type { ProblemId } from "@/domain/problem/entity/Problem"
import type { SessionId } from "@/domain/session/entity/Session"
import { useSessionStore } from "@/ui/session/hooks/useSessionStore"
import { formatSolvedResult } from "@/ui/stats/components/LearningHistory"
import { useProblemStore } from "@/ui/store/useProblemStore"
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from "@mui/material"

export function SessionListView(props: {
    ids: ProblemId[]
    onSelect: (id: ProblemId) => void
    selectedId: ProblemId
    sessionId: SessionId
}) {
    const byId = useProblemStore(s => s.byId)
    const results = useSessionStore(s=>s.results)

    return (
        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
            <List>
                {props.ids.map((id, i) => {
                    const problem = byId[id]
                    const solvedResult = results[id]

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