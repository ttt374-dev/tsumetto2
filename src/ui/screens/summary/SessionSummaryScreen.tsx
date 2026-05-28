import { useParams } from "react-router-dom";
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
type ButtonItem = {
    label: string
    onClick: () => void
    variant: "outlined" | "contained"
    disabled?: boolean
}
/////////////////////////////////////////////
export default function SessionSummaryScreen() {    
    const route = useSessionIdContext()
    const vm = useSessionSummaryViewModel(route)   
    const { navigation } = useSessionSummaryActions(route.sessionId)        

    if (vm.type === "error") return <AppShell>Error: { vm.message }</AppShell>
    const items: ButtonItem[] = [
        { label: "再挑戦", onClick: navigation.retry, variant:"outlined"},
        { label: "間違い復習", onClick: navigation.review, variant:"outlined",
            disabled: vm.disableReview
        },
        { label: "次のチャンクへ", onClick: navigation.nextChunk, variant:"contained",
            disabled: vm.disableNextChunk
        },
        { label: "ミッションへ", onClick: navigation.backToMission, variant:"outlined"},
    ]

    return (
        <AppShell header={"Summary"}>
            <Box>
                ミッション完了
            </Box>
            <SummaryView summary={vm.summary} />

            <Stack direction="row" spacing={1}>
                { items.map((item)=> (
                    <Button variant={item.variant} onClick={item.onClick} disabled={item.disabled} fullWidth>
                        { item.label}
                    </Button>

                ))}                
            </Stack>
        </AppShell>
    )
}
