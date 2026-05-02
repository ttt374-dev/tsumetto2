import { useEffect, } from "react";
import { useParams } from "react-router-dom";

import type { Problem, ProblemId } from "@/domain/problem/entity/Problem";
import type { SessionId } from "@/domain/session/entity/Session";
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import type { GameUIEvent } from "@/ui/screens/player/hooks/useGameEventHandler";
import { useGameStore, type GameEvent } from "@/ui/screens/player/store/useGameStore";
import { useSessionExecutor } from "@/ui/screens/session/hooks/useSessionExecutor";
import { type SessionCommand } from "@/ui/screens/session/vm/resolveSessionCommand";

export function useSessionPlayerRunner() {
    const params = useParams<{ sessionId: string, index: string }>()
    const resParsed = parseSessionParams(params)

    const sessionId = resParsed.type === "valid" ? resParsed.sessionId : ""
    const index = resParsed.type === "valid" ? resParsed.index : -1

    const dispatch = useSessionExecutor(sessionId, index)
    const lastEvent = useGameStore(s => s.events.at(-1))

    const ids = useProblemStore(s => s.ids)
    const byId = useProblemStore(s => s.byId)
    const input: SessionPlayerInput = {
        ...resParsed,
        ids, byId
    }
    const vm = buildSessionPlayerViewModel(input)
    const onGameEvent = vm.type === "ready" ? vm.onGameEvent : undefined
    useEffect(() => {
        if (!lastEvent || !onGameEvent) return
        const cmd = onGameEvent(lastEvent)
        if (cmd) dispatch(cmd)
    }, [lastEvent, onGameEvent, dispatch])

    if (vm.type === "error") return vm

    return {
        ...vm,
        goNext: () => dispatch(vm.goNext),
        goList: () => dispatch(vm.goList),
        handleUIEvent: (e: GameUIEvent) => {
            const cmd = vm.handleUIEvent(e)
            cmd && dispatch(cmd)
        }
    }
}
type ParseSessionParamsResult =
    | { type: "invalid" }
    | { type: "valid", sessionId: SessionId, index: number }

function parseSessionParams(input: {
    sessionId?: string
    index?: string
}): ParseSessionParamsResult {
    if (!input.sessionId) return { type: "invalid" }

    const index = Number(input.index)
    if (Number.isNaN(index)) return { type: "invalid" }

    return {
        type: "valid",
        sessionId: input.sessionId,
        index
    }
}
type SessionPlayerInput = ParseSessionParamsResult & {
    ids: ProblemId[]
    byId: Record<ProblemId, Problem>
}

type SessionPlayerViewModel =
    | { type: "error", message: string }
    | {
        type: "ready",
        problem: Problem;
        sessionId: SessionId;
        currentIndex: number;
        goNext: SessionCommand;
        goList: SessionCommand;
        handleUIEvent: (e: GameUIEvent) => SessionCommand | undefined
        onGameEvent: (e: GameEvent) => SessionCommand | undefined
    }

function buildSessionPlayerViewModel(input: SessionPlayerInput): SessionPlayerViewModel {
    if (input.type === "invalid") return { type: "error", message: "invalid params" }
    const { sessionId, index, ids, byId } = input

    // validation
    //if (!sessionId) return { type: "error", message: "invalid sessionId" }
    //if (!index) return { type: "error", message: "invalid index" }

    if (index < 0) {
        return { type: "error", message: "invalid currentIndex" }
    }
    if (!ids.length || index >= ids.length) {
        return { type: "error", message: "Invalid index" }
    }
    const pid = ids[index]
    const problem = pid ? byId[pid] : undefined
    if (!problem) {
        return { type: "error", message: `Problem not found: ${pid}` }
    }

    /// navigation
    const goNext: SessionCommand = { type: "GO_NEXT" } 
    const goList: SessionCommand = { type: "GO_LIST" } 

    // --- UI events ---
    const handleUIEvent = (uiEvent: GameUIEvent): SessionCommand | undefined => {
        switch (uiEvent.type) {
            case "solvedConfirmed":
                return { type: "GO_NEXT" }
            default:
                return undefined
        }
    }
    const onGameEvent = (e: GameEvent): SessionCommand | undefined => {
        if (e.type === "SOLVE") {
            return { type: "SUBMIT_REVIEW" }
        }
        return undefined
    }

    return {
        type: "ready",
        problem, sessionId, currentIndex: index,
        goNext, goList, handleUIEvent, onGameEvent,
    }

}