//import { AppShell } from "@/ui/common/components/layout/AppShell"
import { AppShell } from "@/ui/common/components/layout/AppShell"
import { PlayerFooterPanel } from "@/ui/screens/session/components/PlayerFooterPanel"
import PlayerScreen from "@/ui/screens/player/PlayerScreen"
import { useSessionPlayerViewModel } from "@/ui/screens/session/hooks/useSessionViewModel"
import { useSessionExecutor } from "@/ui/screens/session/runner/useSessionExecutor"
import { useSessionRouteContext } from "@/ui/screens/session/hooks/useSessionRouteContext"
import { createSessionBridge } from "@/ui/screens/session/runner/createSessionBridge"
import { useSessionActions } from "@/ui/screens/session/hooks/useSessionActions"

export default function SessionPlayerScreen() {
    const route = useSessionRouteContext()
    const vm = useSessionPlayerViewModel(route) 

    const execute = useSessionExecutor(route.sessionId, route.index)
    const actions = useSessionActions(execute)
    const bridge = createSessionBridge(execute)

    if (vm.type === "error") return <AppShell>Error: {vm.message}</AppShell>

    return (
        <PlayerScreen
            problem={vm.problem}
            title={vm.title}
            footer={<PlayerFooterPanel 
                onNext={actions.navigation.advanceProblem} 
                onPrev={actions.navigation.retreatProblem}
                onShowList={actions.navigation.openSessionList} />}
            onPlayerIntent={bridge.player.handleIntent}
            onGameEvent={bridge.game.handleEvent}
        />
    )
}

