import { useNavigate, useParams } from "react-router-dom"

import { routes } from "@/ui/App/useAppNavigation"
import { createSessionId } from "@/ui/screens/session/store/useSessionStore"
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore"
import PlayerScreen from "./PlayerScreen"
import { Button, Stack } from "@mui/material"
import type { PlayerIntent } from "@/application/session/interpretor/interpretPlayerIntent"
import { useSessionExecutor } from "../session/runner/useSessionExecutor"
import { createSessionBridge } from "../session/runner/createSessionBridge"

export default function SinglePlayerScreen() {    
    const { id } = useParams<{ id: string }>()
    //const startSession = useSessionStore(s=>s.start)
    if (!id) return <div>id not specified</div>
    const sessionId = createSessionId()
    //startSession(sessionId, [id])
    const navigate = useNavigate()

    const byId = useProblemStore(s=>s.byId)
    const problem = byId[id]
    const execute = useSessionExecutor(sessionId, 0)
    const bridge = createSessionBridge(execute)

    const footer = (
        <Stack>
            <Button fullWidth variant="outlined" onClick={alert}>
                戻る
            </Button>
        </Stack>
    )
    const handlePlayerIntent = (intent: PlayerIntent) => {
        switch(intent.type){
            case "PROBLEM_CONFIRMED":
                navigate(routes.back)
                break;
        }
    }
    return (
        <PlayerScreen problem={problem} title={problem.title}
            footer={footer} onGameEvent={bridge.game.handleEvent}
            onPlayerIntent={handlePlayerIntent}
        />
        //<Navigate to={routes.sessionPlay(sessionId, 0)}/>
    )

}

