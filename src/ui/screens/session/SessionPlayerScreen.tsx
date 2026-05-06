//import { AppShell } from "@/ui/common/components/layout/AppShell"
import type { GameEvent } from "@/domain/game/types/GameEvent"
import { routes } from "@/ui/App/useAppNavigation"
import { AppShell } from "@/ui/common/components/layout/AppShell"
import { PlayerFooterPanel } from "@/ui/screens/player/components/panels/PlayerFooterPanel"
import PlayerScreen from "@/ui/screens/player/PlayerScreen"
import { useSessionPlayerRunner } from "@/ui/screens/session/runner/useSessionPlayerRunner"
import { useNavigate } from "react-router-dom"

export default function SessionPlayerScreen() {
    const model = useSessionPlayerRunner()

    if (model.type === "error") return <AppShell>Error: {model.message}</AppShell>


    return (
        <PlayerScreen
            problem={model.problem}
            title={model.title}
            footer={<PlayerFooterPanel 
                onNext={model.advanceProblem} 
                onShowList={model.openSessionList} />}
            onPlayerIntent={model.handlers.handlePlayerIntent}
            onGameEvent={model.handlers.handleGameEvent}
            //onSessionEvent={model.handlers.handleDomainEvent}
        />
    )
}

