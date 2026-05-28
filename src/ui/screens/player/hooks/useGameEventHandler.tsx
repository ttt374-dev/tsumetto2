import { useEffect } from "react"

import { useGameStore } from "@/ui/screens/player/store/useGameStore"
import type { GameEvent } from "@/domain/game/types/GameEvent"
import { interpretGameEvent } from "@/application/game/interpretGameEvent"
import type { EffectRunner } from "@/ui/screens/player/runner/runGameEffects"


export function useGameEventHandler(effectRunner: EffectRunner, onGameEvent?: (e: GameEvent) => void, ) {
    const events = useGameStore(s => s.events)
    const sessionId = useGameStore(s=>s.sessionId)
    const mistakes = useGameStore(s => s.state.mistakes)
    
    // イベント処理
    useEffect(() => {
        const last = events.at(-1)
        if (!last) return
        if (last.sessionId !== sessionId) return

        effectRunner.run(interpretGameEvent(last, {events, mistakes}))
        onGameEvent?.(last)
    }, [events])
}

