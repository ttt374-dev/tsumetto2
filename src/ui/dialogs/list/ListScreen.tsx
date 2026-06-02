import PlayArrowIcon from '@mui/icons-material/PlayArrow'

import type { ProblemId } from "@/domain/problem/entity/Problem";
import { AppShell } from "@/ui/common/components/layout/AppShell";
import { useLocation, useNavigate } from "react-router-dom";
import { paths } from "@/router/paths";
import { Button, IconButton } from "@mui/material";
import { LibraryListView } from "@/ui/screens/library/components/LibraryListView";
import { createSessionId, useSessionStore } from '@/ui/screens/session/store/useSessionStore';

type ViewerLocationState = {
    title: string
  ids: string[]
}

export function ListScreen(){
    const location = useLocation()    
    const state = (location.state as ViewerLocationState | null)
    const ids = state?.ids ?? []
    const title = state?.title ?? "List"

    const navigate = useNavigate()
    const startSession = useSessionStore(s=>s.start)
    
    const handleItemClick = (id: ProblemId) => {
        navigate(paths.detail(id))
        //navigate(routes.player(id))
    }

    const handleStartSession = () => {
        const sessionId = createSessionId()
        startSession(sessionId, ids)
        navigate(paths.sessionPlay(sessionId))
    }
    return (
        <AppShell
            header={ title }
            rightActions={<RightActionPanel onStartSession={handleStartSession}/>}
            footer={<Button variant="outlined" onClick={()=>navigate(paths.back)}>戻る</Button>}>
            <LibraryListView ids={ids} onItemClick={handleItemClick}/>
        </AppShell>
    )
}

function RightActionPanel({onStartSession}: {onStartSession: () => void}){
    return (<>
        <IconButton onClick={onStartSession}>
            <PlayArrowIcon sx={{color: "white"}} />
        </IconButton>
    </>)
}