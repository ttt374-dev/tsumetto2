import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import { Box, Drawer, Stack } from "@mui/material"
import { SessionListView } from "@/ui/session/SessionListView"
import type { SessionId } from "@/domain/session/entity/Session"

export function SessionListBottomSheet(props: {
    isOpen: boolean
    onClose: () => void
    problem: Problem
    sessionId: SessionId
    onMoveToProblemId: (id: ProblemId) => void
    sessionProblemIds: ProblemId[]
}){
    
    return (
        <Drawer anchor="bottom" open={props.isOpen}
                onClose={props.onClose}
            >
                <Stack spacing={2} p={1}
                    sx={{
                        pt: "calc(env(safe-area-inset-top) + 16px)",
                        pb: "calc(env(safe-area-inset-bottom) + 16px)"
                    }}
                >
                    <Box>ミッション対象問題リスト</Box>
                    <SessionListView ids={props.sessionProblemIds}
                        onSelect={(id)=>{
                            props.onMoveToProblemId(id)
                            props.onClose()
                        }}
                        selectedId={props.problem.id}
                        sessionId={props.sessionId}
                    />
                </Stack>                
            </Drawer>
    )
}