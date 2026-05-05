//import { AppShell } from "@/ui/common/components/layout/AppShell"
import { AppShell } from "@/ui/common/components/layout/AppShell"
import PlayerScreen from "@/ui/screens/player/PlayerScreen"
import { useSessionPlayerRunner } from "@/ui/screens/session/runner/useSessionPlayerRunner"

export default function SessionPlayerScreen() {
    const model = useSessionPlayerRunner()
    
    if (model.type === "error") return <AppShell>Error: {model.message}</AppShell>
    return (
        <PlayerScreen
            problem={model.problem}
            title={model.title}
            onPlayerIntent={model.handlers.handlePlayerIntent}
            onDomainEvent={model.handlers.handleDomainEvent}
        />
    )
}

