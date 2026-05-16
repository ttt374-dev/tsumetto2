import { useEffect, useRef } from "react"

import { useGameStore } from "@/ui/screens/player/store/useGameStore"
import { createRunControl, runGameEffects, type EffectContext, type EffectRunner } from "@/ui/screens/player/runner/runGameEffects"
import type { GameEvent } from "@/domain/game/types/GameEvent"
import { interpretGameEvent } from "@/application/game/interpretGameEvent"

export function useGameEventHandler(effectRunner: EffectRunner, enabled: boolean = true, onGameEvent?: (e: GameEvent) => void, ) {
    const events = useGameStore(s => s.events)
    const mistakes = useGameStore(s => s.state.mistakes)
    
    //const controlRef = useRef(createRunControl())
    // イベント処理
    useEffect(() => {
        if (!enabled) return
        const last = events.at(-1)
        if (!last) return

        const effects = interpretGameEvent(last, {events, mistakes})
        //runGameEffects(effects, ctx)
        effectRunner(effects)
        onGameEvent?.(last)
    }, [events])
}

