import type { Problem, ProblemId } from "@/domain/problem/entity/Problem";
import type { SessionId } from "@/domain/session/entity/Session";
import type { GameUIEvent } from "@/ui/screens/player/hooks/useGameEventHandler";
import { useGameStore, type GameEvent } from "@/ui/screens/player/store/useGameStore";
import { type SessionCommand } from "@/ui/screens/session/vm/resolveSessionCommand";
import type { Mission, MissionId } from "@/domain/mission/entity/Mission";
import type { ParseSessionParamsResult } from "@/ui/screens/session/vm/parseSessionParams";

export type SessionPlayerViewModel =
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
    export type SessionPlayerInput = ParseSessionParamsResult & {
    ids: ProblemId[]
    byId: Record<ProblemId, Problem>

    missionId: MissionId | undefined
    missions: Mission[]
}
//////////////////////////////////////////////////////
export function buildSessionPlayerVieModel(input: SessionPlayerInput): SessionPlayerViewModel {
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

export function buildSessionPlayerTitle(props: {
    missionName: string,
    index: number,
    count: number,
    problemTitle: string
}){
    return `[${props.missionName} (${props.index + 1}/${props.count})]: ${props.problemTitle}`   
}