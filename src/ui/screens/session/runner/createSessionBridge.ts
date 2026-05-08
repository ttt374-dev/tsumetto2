import type { PlayerIntent } from "@/application/session/interpretor/interpretPlayerIntent"
import { interpretPlayerIntent } from "@/application/session/interpretor/interpretPlayerIntent"

import type { SessionEvent } from "@/application/session/SessionEvent"
import { interpretSessionEvent } from "@/application/session/interpretor/interpretSessionEvent"

import type { GameEvent } from "@/domain/game/types/GameEvent"
import type { SessionCommand } from "@/application/session/resolveSessionCommand"

export type SessionExecutor = (
    command: SessionCommand
) => void

export type SessionBridge = {
    player: {
        handleIntent: (
            intent: PlayerIntent
        ) => void
    }

    session: {
        handleEvent: (
            event: SessionEvent
        ) => void
    }

    game: {
        handleEvent: (
            event: GameEvent
        ) => void
    }
}

export function createSessionBridge(
    execute: SessionExecutor
): SessionBridge {

    const handlePlayerIntent = (
        intent: PlayerIntent
    ) => {

        const command =
            interpretPlayerIntent(intent)

        execute(command)
    }

    const handleSessionEvent = (
        event: SessionEvent
    ) => {

        const command =
            interpretSessionEvent(event)

        execute(command)
    }

    const handleGameEvent = (
        event: GameEvent
    ) => {

        switch (event.type) {

            case "SOLVE":

                execute({
                    type: "SUBMIT_REVIEW",
                })

                break
        }
    }

    return {

        player: {
            handleIntent: handlePlayerIntent,
        },

        session: {
            handleEvent: handleSessionEvent,
        },

        game: {
            handleEvent: handleGameEvent,
        },
    }
}