import { useEffect, } from "react";
import { useParams } from "react-router-dom";

import type { Problem, ProblemId } from "@/domain/problem/entity/Problem";
import type { SessionId } from "@/domain/session/entity/Session";
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import type { GameUIEvent } from "@/ui/screens/player/hooks/useGameEventHandler";
import { useGameStore, type GameEvent } from "@/ui/screens/player/store/useGameStore";
import { useSessionExecutor } from "@/ui/screens/session/hooks/useSessionExecutor";
import { type SessionCommand } from "@/ui/screens/session/vm/resolveSessionCommand";
import type { Mission, MissionId } from "@/domain/mission/entity/Mission";
import { useSessionStore } from "@/ui/screens/session/hooks/useSessionStore";
import { useMissionStore } from "@/ui/screens/mission/hooks/useMissionStore";
import { buildRequestInit } from "@capacitor/core";
import { buildSessionPlayerTitle } from "@/ui/screens/session/hooks/useSessionPlayerTitleMaker";

type ParseSessionParamsResult =
    | { type: "invalid" }
    | { type: "valid", sessionId: SessionId, index: number }
type SessionPlayerInput = ParseSessionParamsResult & {
    ids: ProblemId[]
    byId: Record<ProblemId, Problem>

    missionId: MissionId | undefined
    missions: Mission[]
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
        title: string
    }

/////////////////////////////////////////
export function useSessionPlayerRunner() {
    // パラメータを解析
    const params = useParams<{ sessionId: string, index: string }>()
    const resParsed = parseSessionParams(params)

    // フックをまず取得
    const sessionId = resParsed.type === "valid" ? resParsed.sessionId : ""
    const index = resParsed.type === "valid" ? resParsed.index : -1
    
    const dispatch = useSessionExecutor(sessionId, index)
    const lastEvent = useGameStore(s => s.events.at(-1))

    // vm
    const ids = useProblemStore(s => s.ids)
    const byId = useProblemStore(s => s.byId)
    const missions = useMissionStore(s=>s.missions)
    const missionId = useSessionStore(s=>s.missionId)
    const input: SessionPlayerInput = {
        ...resParsed,
        ids, byId, missions, missionId
    }
    const vm = buildSessionPlayerViewModel(input)

    // game event 処理
    const onGameEvent = vm.type === "ready" ? vm.onGameEvent : undefined
    useEffect(() => {
        if (!lastEvent || !onGameEvent) return
        const cmd = onGameEvent(lastEvent)
        if (cmd) dispatch(cmd)
    }, [lastEvent, onGameEvent, dispatch])

    // エラーなら返す
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

function buildSessionPlayerViewModel(input: SessionPlayerInput): SessionPlayerViewModel {
    if (input.type === "invalid") return { type: "error", message: "invalid params" }
    const { sessionId, index, ids, byId, missionId, missions } = input

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

    // title
    const titleProps = {
        index: index,
        count: ids?.length ?? 0,
        problemTitle: problem?.title,
        missionName: missions.find(d=>d.id===missionId)?.name ?? ""
    }
    const title = buildSessionPlayerTitle(titleProps)
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
    // Game event
    const onGameEvent = (e: GameEvent): SessionCommand | undefined => {
        if (e.type === "SOLVE") {
            return { type: "SUBMIT_REVIEW" }
        }
        return undefined
    }

    return {
        type: "ready",
        problem, sessionId, currentIndex: index, title,
        goNext, goList, handleUIEvent, onGameEvent,
    }

}