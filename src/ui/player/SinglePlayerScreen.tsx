import { Navigate, useParams } from "react-router-dom"
import { useProblemStore } from "../store/useProblemStore"
import { routes } from "../App/useAppNavigation"
import { useSessionStore } from "../store/useSessionStore"
import { v4 } from "uuid"

export default function SinglePlayerScreen() {    
    const { id } = useParams<{ id: string }>()
    //const problem = useProblemStore(s => id ? s.byId[id] : undefined)    
    const startSession = useSessionStore(s=>s.start)
    if (!id) return <div>id not specified</div>
    //if (!problem) return <div>Not found</div>

    const sessionId = `single-mission-${v4()}`
    startSession(sessionId, [id])
    return (
        <Navigate to={routes.sessionPlay}/>
    )

}

