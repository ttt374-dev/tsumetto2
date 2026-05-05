//import { AppShell } from "@/ui/common/components/layout/AppShell"
import { AppShell } from "@/ui/common/components/layout/AppShell"
import { useReviewEventStore } from "@/ui/features/learning/hooks/useReviewEventStore"
import PlayerScreen from "@/ui/screens/player/PlayerScreen"
import type { DomainEvent } from "@/ui/screens/player/runner/createGameEffectRunner"

import { useSessionPlayerRunner } from "@/ui/screens/session/runner/useSessionPlayerRunner"
import type { SessionEffect } from "@/ui/screens/session/vm/resolveSessionCommand"
import { useNavigate } from "react-router-dom"

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

