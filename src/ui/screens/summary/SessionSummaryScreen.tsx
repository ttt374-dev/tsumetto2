import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Stack } from "@mui/material";

import { SummaryView } from "./SummaryView";
import { AppShell } from "@/ui/common/components/layout/AppShell";
import { useSessionSummaryViewModel } from "@/ui/screens/summary/hooks/SessionSummaryViewModel";
import { useSessionSummaryActions } from "@/ui/screens/summary/hooks/SessionSummaryActions";
import { useSessionRouteContext } from "@/ui/screens/session/hooks/useSessionRouteContext";

function useSessionIdContext(){
    const { sessionId: rawSessionId } = useParams<{ sessionId: string }>()    

    const sessionId = rawSessionId === undefined ? "" : rawSessionId
    const result = rawSessionId === undefined ? 
        { type: "invalid"} :
        { type: "valid", sessionid: sessionId}
    
    return { result, sessionId}

}
/////////////////////////////////////////////
export default function SessionSummaryScreen() {
    //const route = useSessionRouteContext()
    const route = useSessionIdContext()
    //const { sessionId: rawSessionId } = useParams<{ sessionId: string }>()    

    //const sessionId = rawSessionId === undefined ? "" : rawSessionId
    //if (!sessionId) return <AppShell>No sessionId available</AppShell>
    //const { sessionId, result } = useSessionRouteContext()
    const vm = useSessionSummaryViewModel(route.sessionId)   
    const { navigation } = useSessionSummaryActions(route.sessionId)
    //console.log("route", route)

    if (route.result.type === "invalid") return <AppShell>invalid sessionId</AppShell>

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
