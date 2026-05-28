import { AppShell } from "@/ui/common/components/layout/AppShell"
import { PlayerFooterPanel } from "@/ui/screens/session/components/PlayerFooterPanel"
import PlayerScreen from "@/ui/screens/player/PlayerScreen"
import { useSessionExecutor } from "@/ui/screens/session/runner/useSessionExecutor"
import { createSessionBridge } from "@/ui/screens/session/runner/createSessionBridge"
import { useSessionActions } from "@/ui/screens/session/hooks/useSessionActions"
import { useSessionPlayerContext} from "@/ui/screens/session/hooks/useSessionPlayerContext"
import type { Problem } from "@/domain/problem/entity/Problem"
import { useSessionPlayerTitle } from "@/ui/screens/session/hooks/useSessionPlayerTitle"

export default function SessionPlayerScreen() {
    const ctx = useSessionPlayerContext()
    if (ctx.type === "error") return <AppShell>Error: { ctx.message}</AppShell>

    return <SessionPlayerContent sessionId={ctx.sessionId} index={ctx.index} problem={ctx.problem}/>
}
function SessionPlayerContent(props: {
    sessionId: string
    index: number
    problem: Problem
}){
    const { sessionId, index, problem } = props
    const title = useSessionPlayerTitle(index, problem.title)
    const execute = useSessionExecutor(sessionId, index)
    const actions = useSessionActions(execute)
    const bridge = createSessionBridge(execute)

    return (
        <PlayerScreen
            problem={problem}
            title={title}
            footer={<PlayerFooterPanel 
                onNext={actions.navigation.advanceProblem} 
                onPrev={actions.navigation.retreatProblem}
                onShowList={actions.navigation.openSessionList} />}
            onPlayerIntent={bridge.player.handleIntent}
            onGameEvent={bridge.game.handleEvent}
        />
    )
}

