import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Stack } from "@mui/material";

import { SummaryView } from "./SummaryView";
import { AppShell } from "@/ui/common/components/layout/AppShell";
import { useSessionSummaryViewModel } from "@/ui/screens/summary/hooks/SessionSummaryViewModel";

/////////////////////////////////////////////
export default function SessionSummaryScreen() {
    const { sessionId } = useParams<{ sessionId: string }>()    
    if (!sessionId) return <AppShell>No sessionId available</AppShell>
    const vm = useSessionSummaryViewModel(sessionId)   

    return (
        <AppShell header={"Summary"}>
            <Box>
                ミッション完了
            </Box>
            <SummaryView summary={vm.summary} />

            <Stack direction="row" spacing={1}>
                <Button variant="outlined" onClick={vm.onRetry} fullWidth>
                    再挑戦
                </Button>
                
                <Button variant="outlined" onClick={vm.onReview} fullWidth
                    disabled={vm.disableReview}
                >
                    間違い復習
                </Button>

                <Button variant="contained" onClick={vm.onNextChunk} fullWidth
                    disabled={vm.disableNextChunk}
                >
                    次のチャンクへ
                </Button>
                <Button variant="outlined" fullWidth onClick={vm.onBackToMission}>
                    ミッションへ
                </Button>
            </Stack>
        </AppShell>
    )
}
