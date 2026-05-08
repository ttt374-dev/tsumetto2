import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Stack } from "@mui/material";

import { SummaryView } from "./SummaryView";
import { AppShell } from "@/ui/common/components/layout/AppShell";
import { useSessionSummaryViewModel } from "@/ui/screens/summary/hooks/SessionSummaryViewModel";
import { useSessionSummaryActions } from "@/ui/screens/summary/hooks/SessionSummaryActions";
import type { SessionId } from "@/domain/session/entity/Session";

export type SessionIdContext = {
    result: SessionIdResult        
    sessionId: SessionId
}
type SessionIdResult = 
    | { type: "valid", sessionId: SessionId}
    | { type: "invalid", message?: string}

function useSessionIdContext(): SessionIdContext {
    const { sessionId: rawSessionId } = useParams<{ sessionId: string }>()    

    const sessionId: SessionId = rawSessionId === undefined ? "" : rawSessionId
    const result: SessionIdResult = rawSessionId === undefined ? 
        { type: "invalid", message: "invalid session Id"} :
        { type: "valid", sessionId}
    
    return { result, sessionId}

}
/////////////////////////////////////////////
export default function SessionSummaryScreen() {    
    const route = useSessionIdContext()
    const vm = useSessionSummaryViewModel(route)   
    const { navigation } = useSessionSummaryActions(route.sessionId)        

    if (vm.type === "error") return <AppShell>Error: { vm.message }</AppShell>

    return (
        <AppShell header={"Summary"}>
            <Box>
                ミッション完了
            </Box>
            <SummaryView summary={vm.summary} />

            <Stack direction="row" spacing={1}>
                <Button variant="outlined" onClick={navigation.retry} fullWidth>
                    再挑戦
                </Button>
                
                <Button variant="outlined" onClick={navigation.review} fullWidth
                    disabled={vm.disableReview}
                >
                    間違い復習
                </Button>

                <Button variant="contained" onClick={navigation.nextChunk} fullWidth
                    disabled={vm.disableNextChunk}
                >
                    次のチャンクへ
                </Button>
                <Button variant="outlined" fullWidth onClick={navigation.backToMission}>
                    ミッションへ
                </Button>
            </Stack>
        </AppShell>
    )
}
