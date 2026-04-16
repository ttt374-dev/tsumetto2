import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from "@mui/material"

import type { ProblemId } from "@/domain/problem/entity/Problem"
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore"
import type { SolvedResult } from "@/domain/review/solvedResult"
import { toSolvedResultViewData } from "@/ui/features/learning/hooks/solvedResultPresenter"

export default function SessionListView(props: {
    ids: ProblemId[]
    onSelect: (index: number) => void
    selectedId: ProblemId
    solvedResultMap: Record<ProblemId, SolvedResult>
}) {
    const byId = useProblemStore(s => s.byId)        
    
    return (
        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
            <List>
                {props.ids.map((id, i) => {
                    const problem = byId[id]
                    const res = props.solvedResultMap[id]
                    const resultString = res ? toSolvedResultViewData(res).summary : ""

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

