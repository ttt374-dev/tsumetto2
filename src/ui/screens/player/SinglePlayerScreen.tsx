import { Navigate, useParams } from "react-router-dom"
import { v4 } from "uuid"

import { routes } from "@/ui/App/useAppNavigation"
import { useSessionStore } from "@/ui/screens/session/store/useSessionStore"

export default function SinglePlayerScreen() {    
    const { id } = useParams<{ id: string }>()
    const startSession = useSessionStore(s=>s.start)
    if (!id) return <div>id not specified</div>
    const sessionId = `single-mission-${v4()}`
    startSession(sessionId, [id])

    return (
        <Navigate to={routes.sessionPlay(sessionId, 0)}/>
    )

}

