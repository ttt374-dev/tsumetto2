import { Button, Stack } from "@mui/material"
import { useNavigate } from "react-router-dom"

import { routes } from "@/ui/App/useAppNavigation"
import { AppShell } from "@/ui/common/components/layout/AppShell"
import { useSessionPlayerViewModel, type SessionPlayerPlayingVM, type SessionPlayerVM } from "@/ui/session/hooks/useSessionPlayerViewModel"
import SessionListView from "@/ui/session/SessionListView"

function SessionProblemListActionPanel(props: {
    onSummary: () => void
}) {    
    const navigate = useNavigate()
    const handleBack = () => { navigate(routes.back) }
    return (
        <Stack direction="row">
            <Button onClick={handleBack} fullWidth variant="contained">
                戻る
            </Button>
            <Button onClick={props.onSummary} fullWidth variant="outlined">
                サマリーへ
            </Button>
        </Stack>
    )
}

export default function SessionProblemListScreen() {
    const vm = useSessionPlayerViewModel()
    if (vm.status !== "playing") return <>{vm.status}</>

    return (<SessionProblemListContent vm={vm}/>)
}
function SessionProblemListContent( { vm } : 
    { vm: SessionPlayerPlayingVM } 
){
    const navigate = useNavigate()
    const handleOnSelect = (index: number) => {
        navigate(routes.back)        
        vm.moveTo(index)
    }

    //console.log("result", vm.results)
    return (
        <AppShell 
            header={"セッション問題リスト"}
            footer={<SessionProblemListActionPanel onSummary={vm.navigateToSummary}/>}
            navigateBack={true}>
            <SessionListView ids={vm.problemIds}
                onSelect={handleOnSelect}
                selectedId={vm.problem.id}
                sessionId={vm.sessionId}                
            />
        </AppShell>
    )
}