import PlayArrowIcon from '@mui/icons-material/PlayArrow'

import type { ProblemId } from "@/domain/problem/entity/Problem";
import { AppShell } from "@/ui/common/components/layout/AppShell";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "@/ui/App/useAppNavigation";
import { Button, IconButton } from "@mui/material";
import { LibraryListView } from "@/ui/screens/library/components/LibraryListView";
import { createSessionId, useSessionStore } from '@/ui/screens/session/store/useSessionStore';

type ViewerLocationState = {
    title: string
  ids: string[]
}

export function ListScreen(){
    const location = useLocation()
    const navigate = useNavigate()
    const state = (location.state as ViewerLocationState | null)
    const ids = state?.ids ?? []
    const title = state?.title ?? "List"
    const startSession = useSessionStore(s=>s.start)
    
    const handleItemClick = (id: ProblemId) => {
        navigate(routes.detail(id))
        //navigate(routes.player(id))
    }

    const handleStartSession = () => {
        startSession(undefined, ids)
        navigate(routes.sessionPlay(createSessionId()))
    }
    return (
        <AppShell 
            header={ title }
            rightActions={<RightActionPanel onClick={handleStartSession}/>}
            footer={<Button variant="outlined" onClick={()=>navigate(routes.back)}>戻る</Button>}>            
            <LibraryListView ids={ids} onItemClick={handleItemClick}/>                        
        </AppShell>
    )
}

function RightActionPanel({onClick}: {onClick: () => void}){
    return (<>
        <IconButton onClick={onClick}>
            <PlayArrowIcon sx={{color: "white"}} />
        </IconButton>
    </>)
}